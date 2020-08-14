import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: 'src/index.ts',
    output: {
        format: 'umd',
        name: 'sub0',
        dir: 'dist'
    },
    plugins: [
        typescript(),
        commonjs()
    ]
};
