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

if (!fs.existsSync(fcLicenseFileName)) throw new Error(`${fcLicenseFileName} is required, as it will be injected into index.html`);
const fcLicense = fs.readFileSync(fcLicenseFileName, 'utf-8').toString();

const packageJson = require('./package.json');
if (typeof packageJson !== 'object') throw new Error('package.json was not parsed as an object');

const copyrightNotice = `Copyright © ${new Date().getFullYear()} ${packageJson.author?.name ?? 'Unknown'}. All rights reserved`;
const title = `${packageJson.name} distribution tool`;

const dashes = Array.from(new Array(Math.max(copyrightNotice.length, title.length) + 1)).map(() => '').join('-')

console.log(dashes);
console.log(`${greenText}%s${resetText}`, `${copyrightNotice}\n${packageJson.name} distribution tool`);
console.log(dashes);

const stdInterface = createInterface({
    input: process.stdin,
    output: process.stdout
});

const yesNo = async question => {
    const ans = (await stdInterface.question(`${question} ${cyanText}[y/n]${resetText}\n> `)).toLowerCase();

    if (ans.length > 0) {
        if ('yes'.substring(0, ans.length) === ans) return true;
        if ('no'.substring(0, ans.length) === ans) return false;
    }

    console.log(`${yellowText}%s${resetText}`, 'Please type a valid yes/no answer');
    return yesNo(question);
}

let version = packageJson.version;
let answer;

yesNo(`The current version of ${packageJson.name} is ${version}.\nDo you wish to update it?`).then(async updateVersion => {
    if (updateVersion) {
        answer = await stdInterface.question('Please write the new version (x.x.x)\n> ') || "";

        const numbers = answer.split('.');
        if (
            numbers.length !== 3 ||
            !numbers.every(n => Number.isFinite(Number(n)))
        ) throw new Error(`${answer} does not follow the correct version format.`);

        version = answer;

        const packageContent = fs.readFileSync('./package.json', 'utf-8');
        const replacedPackageContent = packageContent.replace(
            /"version":(\s)*"(\d\.){2}\d"/m,
            `"version":$1"${version}"`
        );

        fs.writeFileSync(
            './package.json',
            replacedPackageContent,
            { encoding: 'utf-8' }
        );
    }

    const outputDirectory = join(__dirname, 'zip');
    const liteDirectory = join(outputDirectory, 'lite');

    const fileName = `${packageJson.name}-v${version}.zip`;
    const fileNameLite = `${packageJson.name}-v${version}-lite.zip`;
    
    const fileLocation = join(outputDirectory, fileName);
    const fileLocationLite = join(liteDirectory, fileNameLite);

    const existingFiles = [];
    fs.existsSync(fileLocation) && existingFiles.push(fileName);
    fs.existsSync(fileLocationLite) && existingFiles.push(fileNameLite);
    
    if (existingFiles.length) {
        answer = await yesNo(`${existingFiles.join(' and ')} already exist${existingFiles.length === 1? 's':''}.\nDo you still wish to continue?`);
        if (!answer) process.exit(0);
    }

    const indexPath = join('dist', 'index.html');

    const zipFiles = async () => {
        if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory);
        if (!fs.existsSync(liteDirectory)) fs.mkdirSync(liteDirectory);

        process.on('beforeExit', (exitCode) => {
            exitCode === 0 && console.log(`${greenBackground}%s${resetText}`, `Distribution finished!${updateVersion? 'Remember to push package.json changes to GitHub.':''}`);
        });

        const comment = `${packageJson.name}-v${version}, ${copyrightNotice}`;

        const output = fs.createWriteStream(fileLocation);
        const archive = archiver('zip', { comment });

        // Minified
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
        archive.directory('documentation/', 'documentation');

        archiveLite.glob('**/*', {
            cwd: 'documentation',
            ignore: ['for-javascript-developers', 'for-javascript-developers/**/*']
        }, { prefix: 'documentation/' });

        const sourceCodeFiles = [
            '.gitignore',
            '.parcelrc',
            '.posthtmlrc',
            'bun.lockb',
            'package.json',
            'package-lock.json',
            'testdata.json',
            'testdata_min.json',
            'tsconfig.json',
            'widget.json'
        ];

        sourceCodeFiles.forEach(name => {
            addFile(name, `source-code/${name}`, true);
        });

        addFile('LICENSE.md');
        addFile('Demo.fmp12');
        addFile('README.md');
        addFile('codeo-logo.png');
        addFile('upload.js');
        archiveLite.file('widget.json');

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