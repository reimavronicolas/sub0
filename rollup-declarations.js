const fs = require('fs'), fileEncoding = 'utf-8', eol = '\n';

fs.readdir('./dist', function(err, filenames) {
    if (err) {
        console.log(err);
        return;
    }

    const declarations = filenames.filter(f => f.endsWith('.d.ts'));

    const out = declarations
        .filter(f => f.indexOf('index.d.ts'))
        .map((f) => fs.readFileSync('./dist/' + f, fileEncoding))
        .map((content) => content.split(eol).filter(line => line.indexOf('import ') === -1))
        .map((lines) => lines.join(eol));

    declarations.forEach(f => fs.unlinkSync('./dist/' + f));

    fs.writeFileSync('./dist/index.d.ts', out.join(eol), fileEncoding);
});
