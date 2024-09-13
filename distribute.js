/*
    © Codeo Norge AS (2024)

    THIS FILE REQUIRES A 'fullcalendar.license' FILE
    WHICH INCLUDES THE FULLCALENDAR DEVELOPER LICENSE
*/
const fcLicenseFileName = 'fullcalendar.license';

const fs = require('fs');
const archiver = require('archiver');
const { execSync } = require('child_process');
const { join } = require('path');

if (!fs.existsSync(fcLicenseFileName)) throw new Error(`${fcLicenseFileName} was not found`);
const fcLicense = fs.readFileSync(fcLicenseFileName, 'utf-8').toString();

// Create the distribution build
console.log('> Building distribution version...');
execSync('npm run build');
console.log('> Build finished. Zipping files...');

const package = require('./package.json');

if (typeof package !== 'object') throw new Error('package.json was not parsed as an object');
const fileName = `${package.name}.zip`;

const output = fs.createWriteStream(fileName);
const archive = archiver('zip');

const addFile = (name, dest = name) => archive.file(name, { name: dest });

output.on('close', () => {
    console.log(`> Output written to ${fileName}`);
    console.log(`> ${archive.pointer()} total bytes`);
});

archive.on('error', err => { throw err });
archive.pipe(output);

archive.directory('src/', 'source-code');
archive.directory('documentation/', 'documentation');
//addFile('dist/index.html', 'just-another-calendar.html');

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
    addFile(name, `source-code/${name}`);
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

archive.append(injectedContent, { name: 'just-another-calendar.html' });
archive.finalize();