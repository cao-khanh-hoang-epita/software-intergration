// config.js
const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

let envFile;
switch (env) {
    case 'development':
        envFile = '.env.development';
        break;
    case 'release':
        envFile = '.env.release';
        break;
    case 'production':
        envFile = '.env.production';
        break;
    default:
        throw new Error(`Unknown environment: ${env}`);
}

const result = dotenv.config({ path: path.resolve(__dirname, envFile) });

if (result.error) {
    throw result.error;
}

const { parsed: envs } = result;
console.log(`Loaded environment configuration for ${env}:`, envs);

module.exports = envs;
