const fs = require('fs'),
    process = require('process'),
    fileEncoding = 'utf-8',
    eol = '\n';

fs.readdir('src', function (err, filenames) {
    if (err) {
        console.log(err);
        return;
    }

    const out = filenames.filter(f => f.endsWith('.ts') && f.indexOf('index.ts'))
        .map((f) => fs.readFileSync('./src/' + f, fileEncoding))
        .map((content) => content.split(eol).filter(line => line.indexOf('import ') === -1))
        .map((lines) => lines.join(eol))
        .sort((a) => {
            //make sure const/class and declarations are at the top of the file.
            if (a.indexOf('export const') || a.indexOf('export class') || a.indexOf('export declare')) {
                return -1;
            }

            return 0;
        });

    fs.mkdirSync('tmp');

    fs.writeFileSync('tmp/index.ts', out.join(eol), fileEncoding);

    process.exit(0);
});
