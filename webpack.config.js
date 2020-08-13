module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        library: 'sub0',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: ['.ts']
    },
    externals: {
        '@angular/core': {
            root: ['ng', 'core'],
            commonjs: '@angular/core',
            commonjs2: '@angular/core',
            amd: '@angular/core'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/, loader: 'ts-loader'
            }
        ]
    }
};
