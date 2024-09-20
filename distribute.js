/*
    © Codeo Norge AS (2024)

    THIS FILE REQUIRES A 'fullcalendar.license' FILE
    WHICH INCLUDES THE FULLCALENDAR DEVELOPER LICENSE

    THIS FILE IS FOR INTERNAL USE ONLY, AND SHOULD NOT BE SHIPPED WITH "Just Another Calendar"
*/
const greenText = '\x1b[32m';
const resetText = '\x1b[0m';

const logInfo = (...args) => console.log('-', greenText, ...args, resetText);

const fcLicenseFileName = 'fullcalendar.license';

const fs = require('fs');
const archiver = require('archiver');

const { execSync } = require('child_process');
const { join } = require('path');
const { createInterface } = require('readline/promises');

if (!fs.existsSync(fcLicenseFileName)) throw new Error(`${fcLicenseFileName} was not found`);
const fcLicense = fs.readFileSync(fcLicenseFileName, 'utf-8').toString();

const package = require('./package.json');

if (typeof package !== 'object') throw new Error('package.json was not parsed as an object');

const interface = createInterface({
    input: process.stdin,
    output: process.stdout
});

const yesNo = async question => {
    const ans = await interface.question(`${question} [y/n]\n> `);
    return !!ans.length && ('yes'.substring(0, ans.length) === ans.toLowerCase());
}

let version = package.version;
yesNo(`The current version of ${package.name} is ${version}.\nDo you wish to update it?`).then(async answer => {
    if (answer) {
        answer = await interface.question('Please write the new version (x.x.x)\n> ') || "";

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

    const fileName = `${package.name}-v${version}.zip`;
    const fileNameLite = `${package.name}-v${version}-lite.zip`;

    const existingFiles = [];
    fs.existsSync(fileName) && existingFiles.push(fileName);
    fs.existsSync(fileNameLite) && existingFiles.push(fileNameLite);

    if (existingFiles.length) {
        answer = await yesNo(`${existingFiles.join(' and ')} already exist${existingFiles.length === 1? 's':''}.\nDo you still wish to continue?`);
        if (!answer) process.exit(0);
    }

    // Create the distribution build
    logInfo('Building distribution version...');
    execSync('npm run build');
    logInfo('Build finished. Zipping files...');

    const output = fs.createWriteStream(fileName);
    const archive = archiver('zip');

    // Minified
    const outputLite = fs.createWriteStream(fileNameLite);
    const archiveLite = archiver('zip');

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

        logInfo('Distribution finished! Remember to push package.json changes to GitHub.');
    });

    archive.on('error', err => { throw err });
    archive.pipe(output);

    archiveLite.on('error', err => { throw err });
    archiveLite.pipe(outputLite);

    archive.directory('src/', 'source-code');
    archive.directory('documentation/', 'documentation');

    archiveLite.glob('*.md', { cwd: 'documentation' }, { prefix: 'documentation/' });

    const sourceCodeFiles = [
        '.parcelrc',
        '.posthtmlrc',
        'bun.lockb',
        'package.json',
        'package-lock.json',
        'testdata.json',
        'testdata_min.json',
        'tsconfig.json',
        'upload.js',
        'widget.json',
    ];

    sourceCodeFiles.forEach(name => {
        addFile(name, `source-code/${name}`, true);
    });

    addFile('LICENSE.md');
    addFile('Demo.fmp12');
    addFile('README.md');
    addFile('codeo-logo.png');

    // Inject the codeo license into the HTML
    const indexPath = join('dist', 'index.html');
    if (!fs.existsSync(indexPath)) throw new Error('index.html was not found');

    const base64License = btoa(fcLicense);
    const base64WindowKey = btoa('codeoFcLicense');

    const indexContent = fs.readFileSync(indexPath, 'utf-8').toString();
    const injectedContent = indexContent.replace(/<script[^>]*>/, `<script>window[atob('${base64WindowKey}')]=atob('${base64License}');`);

    archive.append(injectedContent, { name: `${package.name}-v${version}.html` });
    archiveLite.append(injectedContent, { name: `${package.name}-v${version}.html`});

    await archive.finalize();
    await archiveLite.finalize();

    interface.close();
});