const { execSync } = require("child_process");

execSync('rm -rf tmp');
execSync('rm -rf dist');
execSync('node .build/rollup');
execSync('tsc tmp/index.ts --declaration true --outDir dist --module UMD');
execSync('rm -rf tmp');
