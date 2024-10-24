const { join, resolve } = require('path');
const { existsSync } = require('fs');
const config = require('./widget.json');

if (typeof config !== 'object')
    throw new Error('widget.json was not parsed as an object');

// open is used to run the fmp:// protocol
const open = require('open');

// Map the values of config
const {
    name,
    file,
    server,
    uploadScript,
    ...extra
} = config;

// Construct the base FMP URL
const fmpUrl = `fmp://${server}/${file}`;

// Get the path to the distribution index.html
const builtPath = join(__dirname, 'dist', 'index.html');

// Default to the original if no built index.html was found
const filePath = existsSync(builtPath)
    ? builtPath
    : resolve(__dirname, '..', 'just-another-calendar.html');

if (!existsSync(filePath))
    throw new Error(`The module HTML-file was not found. The following paths were checked: ${builtPath}, ${filePath}`);

// Parameters to pass to the script
const params = { name, filePath, ...extra };

// Add parameters to the FMP URL
const url = `${fmpUrl}?script=${uploadScript}&param=${encodeURIComponent(JSON.stringify(params))}`;

// Finally, open the FMP URL
open(url);