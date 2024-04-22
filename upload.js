const { join } = require('path');
const open = require('open').default;

import config from './widget.json';
//const config = require('./widget.json');

const {
    name,
    file,
    server,
    uploadScript,
    ...extra
} = config;

// Construct the base FMP URL
const fmpUrl = `fmp://${server}/${file}`;

const filePath = join(__dirname, 'dist', 'index.html');
const params = { name, filePath, ...extra };

// Add parameters to the FMP URL
const url = `${fmpUrl}?script=${uploadScript}&param=${encodeURIComponent(JSON.stringify(params))}`;

// Finally, open the FMP URL
open(url);