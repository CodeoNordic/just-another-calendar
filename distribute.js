'use strict';
/*
    © Codeo Norge AS (2024)

    THIS FILE REQUIRES A 'fullcalendar.license' FILE
    WHICH INCLUDES THE FULLCALENDAR DEVELOPER LICENSE

    THIS FILE IS FOR INTERNAL USE ONLY, AND SHOULD NOT BE SHIPPED WITH "Just Another Calendar"
*/
const greenText = '\x1b[32m';
const yellowText = '\x1b[33m';
const cyanText = '\x1b[36m';
const resetText = '\x1b[0m';

const greenBackground = '\x1b[42m';

const logInfo = message => console.log(`- ${greenText}%s${resetText}`, message);

const fcLicenseFileName = 'fullcalendar.license';

const fs = require('fs');
const archiver = require('archiver');

const { spawn } = require('child_process');
const { join } = require('path');
const { createInterface } = require('readline/promises');
const { globSync } = require('glob');

if (!fs.existsSync(fcLicenseFileName)) throw new Error(`${fcLicenseFileName} is required, as it will be injected into index.html`);
const fcLicense = fs.readFileSync(fcLicenseFileName, 'utf-8').toString();

const packageJson = require('./package.json');
if (typeof packageJson !== 'object') throw new Error('package.json was not parsed as an object');

const copyrightTemplate = `Copyright © {year} ${packageJson.author.name ?? 'Unknown'}. All rights reserved`;
const copyrightNotice = copyrightTemplate.replace('{year}', String(new Date().getFullYear()));

const title = `${packageJson.name} distribution tool`;

const dashes = Array.from(new Array(Math.max(copyrightNotice.length, title.length) + 1)).map(() => '').join('-')

console.log(dashes);
console.log(`${greenText}%s${resetText}`, `${copyrightNotice}\n${packageJson.name} distribution tool`);
console.log(dashes);

const stdInterface = createInterface({
    input: process.stdin,
    output: process.stdout
});

/** @param {string} question */
const yesNo = async question => {
    const ans = (await stdInterface.question(`${question} ${cyanText}[y/n]${resetText}\n> `)).toLowerCase();

    if (ans.length > 0) {
        if ('yes'.substring(0, ans.length) === ans) return true;
        if ('no'.substring(0, ans.length) === ans) return false;
    }

    console.log(`${yellowText}%s${resetText}`, 'Please type a valid yes/no answer');
    return yesNo(question);
}

const commentRegex = /<!--.*--> *($|(\r?\n))/g;
const trimRegex = /(^(\r?\n)+)|((\r?\n)+$)/g;

const jsOnlyStartRegex = /<!-- *\[?JSONLY START\]? *--> *($|(\r?\n))/g;
const jsOnlyEndRegex = /<!-- *\[?JSONLY END\]? *--> *($|(\r?\n))/g;

/**
 * @param {string} content
 * @param {string?} identifier
 */
const filterOutJsOnly = (content, identifier = 'Text content') => {
    /** @type {(RegExpMatchArray & { input: string })[]} */
    const jsTokensStart = Array.from(
        content.matchAll(jsOnlyStartRegex)
    );

    /** @type {(RegExpMatchArray & { input: string })[]} */
    const jsTokensEnd = Array.from(
        content.matchAll(jsOnlyEndRegex)
    );

    if (!jsTokensStart.length && !jsTokensEnd.length) return content;
    if (jsTokensStart.length !== jsTokensEnd.length)
        throw new Error(
            `${identifier} has an invalid count JS ONLY markers. There are ${jsTokensStart.length} start markers, but ${jsTokensEnd.length} end markers.`
        );

    content = '';
    for (let i = 0; i < jsTokensStart.length; i++) {
        const startToken = jsTokensStart[i];
        const prevEndToken = i? jsTokensEnd[i - 1]: undefined;
        
        content += prevEndToken
            ? prevEndToken.input.substring(
                prevEndToken.index + prevEndToken[0].length, startToken.index - 1
            ) : startToken.input.substring(0, startToken.index);
    }

    const lastToken = jsTokensEnd[jsTokensEnd.length - 1];
    return content + lastToken.input.substring(lastToken.index + lastToken[0].length);
}

let version = packageJson.version;
let answer;

yesNo(`The current version of ${packageJson.name} is ${version}.\nDo you wish to update it?`).then(async updateVersion => {
    if (updateVersion) {
        answer = await stdInterface.question('Please write the new version (x.x.x)\n> ') || "";

        const numbers = answer
            .split('.')
            .map(str => str.replace(/\D*/g, ''));
        
        if (
            numbers.length !== 3 ||
            !numbers.every(n => Number.isFinite(Number(n)))
        ) throw new Error(`${answer} does not follow the correct version format.`);

        version = answer;

        const packageContent = fs.readFileSync('./package.json', 'utf-8');
        const replacedPackageContent = packageContent.replace(
            /"version":(\s)*"(\d\.){2}\d"/m,
            `"version":$1"${version}"`
        ).replace(/\r\n/g, '\n');

        fs.writeFileSync(
            './package.json',
            replacedPackageContent,
            { encoding: 'utf-8' }
        );
    }

    // Check for patch notes
    const patchNotesPath = join(__dirname, 'documentation', 'patch-notes');
    
    const currentPatchNotes = `${version}.md`;
    const currentPatchNotesPath = join(patchNotesPath, currentPatchNotes);
    const currentPatchNotesExist = fs.existsSync(currentPatchNotesPath);

    if (!currentPatchNotesExist) {
        answer = await yesNo(`Patch notes for v${version} was not found. Do you still wish to continue?`);
        if (!answer) process.exit(0);
    }

    // Patchnotes
    const allPatchNotes = globSync('*.md', { cwd: patchNotesPath });

    const patchNoteValues = {
        name: packageJson.name,
        title: packageJson.title,
        short: packageJson.title.split(' ').map(w => w[0]).join(''),
        version,
        author: packageJson.author.name
    }

    const patchNoteMap = allPatchNotes.map(fileName => {
        let content = fs.readFileSync(join(patchNotesPath, fileName), 'utf-8');

        content = content.replace(/\{[\w\d-]+\}/g, str => {
            const key = str.substring(1, str.length - 1);
            if (key.startsWith('copyright-')) return copyrightTemplate.replace('{year}', key.substring('copyright-'.length));
            
            return String(patchNoteValues[key] ?? str);
        });

        const contentLite = filterOutJsOnly(content, fileName)
            .replace(commentRegex, '')
            .replace(trimRegex, '');

        content = content
            .replace(commentRegex, '')
            .replace(trimRegex, '');

        return {
            fileName,
            content,
            contentLite,
            isCurrent: fileName === currentPatchNotes
        }
    });

    const zipDirectory = join(__dirname, 'zip');
    const outputDirectory = join(zipDirectory, version);

    const fileName = `${packageJson.name}-v${version}.zip`;
    const fileNameLite = `${packageJson.name}-v${version}-lite.zip`;
    
    const fileLocation = join(outputDirectory, fileName);
    const fileLocationLite = join(outputDirectory, fileNameLite);

    const existingFiles = [];
    fs.existsSync(fileLocation) && existingFiles.push(fileName);
    fs.existsSync(fileLocationLite) && existingFiles.push(fileNameLite);
    
    if (existingFiles.length) {
        answer = await yesNo(`${existingFiles.join(' and ')} already exist${existingFiles.length === 1? 's':''}.\nDo you still wish to continue?`);
        if (!answer) process.exit(0);
    }

    const indexPath = join('dist', 'index.html');

    const zipFiles = async () => {
        !fs.existsSync(zipDirectory) && fs.mkdirSync(zipDirectory);
        !fs.existsSync(outputDirectory) && fs.mkdirSync(outputDirectory);

        const comment = `${packageJson.name}-v${version}, ${copyrightNotice}`;

        const output = fs.createWriteStream(fileLocation);
        const archive = archiver('zip', { comment });

        // Minified version
        const outputLite = fs.createWriteStream(fileLocationLite);
        const archiveLite = archiver('zip', { comment });

        const addFile = (name, dest = name, sourceCodeOnly = false) => {
            archive.file(name, { name: dest });
            !sourceCodeOnly && archiveLite.file(name, { name: dest });
        };

        output.on('close', () => {
            logInfo(`Output written to ${fileName}`);
            logInfo(`${archive.pointer()} total bytes`);
        });

        outputLite.on('close', () => {
            logInfo(`Output written to ${fileNameLite}`)
            logInfo(`${archiveLite.pointer()} total bytes`);
        });

        archive.on('error', err => { throw err });
        archive.pipe(output);

        archiveLite.on('error', err => { throw err });
        archiveLite.pipe(outputLite);

        archive.directory('src/', 'source-code');

        const sourceCodeFiles = [
            '.gitignore',
            '.parcelrc',
            '.posthtmlrc',
            'bun.lockb',
            'package.json',
            'package-lock.json',
            'testdata.json',
            'testdata_min.json',
            'tsconfig.json'
        ];

        sourceCodeFiles.forEach(name => {
            addFile(name, `source-code/${name}`, true);
        });

        addFile('LICENSE.md');
        addFile('Demo.fmp12');
        addFile('codeo-logo.png');
        addFile('upload.js');

        archive.file('widget.dist.json', { name: 'widget.json', prefix: 'source-code/' });
        archiveLite.file('widget.dist.json', { name: 'widget.json' });
        
        // README
        const readmePath = join(__dirname, 'README.md');
        const readmeContent = fs.readFileSync(readmePath, 'utf-8');

        const readmeContentLite = filterOutJsOnly(readmeContent, 'README.md')
            .replace(commentRegex, '')
            .replace(trimRegex, '');
        
        archiveLite.append(readmeContentLite, { name: 'README.md' });
        archive.append(readmeContent
            .replace(commentRegex, '')
            .replace(trimRegex, ''),
            { name: 'README.md' }
        );

        // Documentation
        archive.glob('**/*', {
            cwd: 'documentation',
            ignore: [
                'patch-notes',
                'patch-notes/**/*'
            ]
        }, { prefix: 'documentation/' });

        archiveLite.glob('**/*', {
            cwd: 'documentation',
            ignore: [
                'patch-notes',
                'patch-notes/**/*',
                'for-javascript-developers',
                'for-javascript-developers/**/*'
            ]
        }, { prefix: 'documentation/' });

        // Add patch notes
        patchNoteMap.forEach(patchNote => {
            const prefix = patchNote.isCurrent? 'patch-notes/': 'patch-notes/previous/';
            const name = patchNote.isCurrent? 'latest.md': patchNote.fileName;

            archive.append(patchNote.content, { name, prefix });
            archiveLite.append(patchNote.contentLite, { name, prefix });
        });

        // Inject the codeo license into the HTML
        if (!fs.existsSync(indexPath)) {
            archive.destroy();
            archiveLite.destroy();

            throw new Error('index.html was not found');
        }

        const base64License = btoa(fcLicense);
        const base64WindowKey = btoa('codeoFcLicense');

        const indexContent = fs.readFileSync(indexPath, 'utf-8').toString();
        const injectedContent = indexContent.replace(/<script[^>]*>/, `<script>window[atob('${base64WindowKey}')]=atob('${base64License}');`);

        archive.append(injectedContent, { name: `${packageJson.name}-v${version}.html` });
        archiveLite.append(injectedContent, { name: `${packageJson.name}-v${version}.html`});

        await archive.finalize();
        await archiveLite.finalize();

        process.on('beforeExit', (exitCode) => {
            exitCode === 0 && console.log(
                `${greenBackground}%s${resetText}`, `Distribution finished!${updateVersion? 'Remember to push package.json changes to GitHub.':''}`
            );
        });

        stdInterface.close();
    }

    const genDist = () => {
        logInfo('Building distribution version...');
        //execSync('npm run build');
        const buildProcess = spawn(process.platform === 'win32'? 'npm.cmd':'npm', ['run', 'build'], {
            cwd: process.cwd(),
            env: process.env
        });

        buildProcess.stdout.pipe(process.stdout);
        buildProcess.stderr.pipe(process.stderr);

        buildProcess.on('error', err => {
            console.error('Build failed');
            throw err;
        });

        buildProcess.on('exit', code => {
            if (code === 0) {
                logInfo('Build finished. Zipping files...');
                zipFiles();
            }

            else process.exit(code);
        });
    }

    // Create the distribution build
    if (fs.existsSync(indexPath)) {
        answer = await yesNo('index.html was found. Do you still want to generate a new dist version of this?');
        if (answer) genDist();

        else {
            logInfo('Zipping files...');
            zipFiles();
        }
    }

    else {
        answer = await yesNo('index.html was not found. Do you want to generate a new version of it?');
        if (answer)
            genDist();
        else
            throw new Error('Cannot continue without a valid index.html');
    }
});