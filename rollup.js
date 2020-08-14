const fs = require('fs'),
    process = require('process'),
    fileEncoding = 'utf-8',
    eol = '\n';

fs.readdir('src', function (err, filenames) {
    if (err) {
        console.log(err);
        return;
    }

    // matches all imports except scoped imports e.g. '@angular/test'
    const moduleImportMatch = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:"((?<!@).)*?")|(?:'((?<!@).)*?'))[\s]*?(?:;|$|)/mg;

    const out = filenames.filter(f => f.endsWith('.ts') && f.indexOf('index.ts'))
        .map((f) => fs.readFileSync('./src/' + f, fileEncoding))
        .map(content => content.replace(moduleImportMatch, ''))
        .sort((a) => {
            //make sure const/class and declarations are at the top of the file.
            if (a.indexOf('export const') || a.indexOf('export class') || a.indexOf('export declare')) {
                return -1;
            }

            return 0;
        });

    console.log(out);

    fs.mkdirSync('tmp');

    fs.writeFileSync('tmp/index.ts', out.join(eol), fileEncoding);

    process.exit(0);
});
