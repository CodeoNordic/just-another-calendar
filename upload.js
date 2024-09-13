const { join } = require('path');
const config = require('./widget.json');

if (typeof config !== 'object') throw new Error('widget.json was not parsed as an object');

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

// Get the path to index.html in the dist folder
const filePath = join(__dirname, 'dist', 'index.html');

// Parameters to pass to the script
const params = { name, filePath, ...extra };

// Add parameters to the FMP URL
const url = `${fmpUrl}?script=${uploadScript}&param=${encodeURIComponent(JSON.stringify(params))}`;

// Finally, open the FMP URL
open(url);