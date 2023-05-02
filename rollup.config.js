import ts from "rollup-plugin-ts";

export default {
    input: 'src/index.ts',
    output: [
        {
            file: './build/main.mjs',
            format: 'esm',
        },
        {
            file: './build/main.cjs',
            format: 'cjs',
        },
    ],
    plugins: [ts({
        tsconfig: './tsconfig.json',
    })],
    external: ['three'],
};