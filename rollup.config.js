import sass from 'node-sass';
import cssnano from 'cssnano';
import pkg from './package.json';
import vue from 'rollup-plugin-vue';
import babel from 'rollup-plugin-babel';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';

const plugins = [
    eslint({
        include: [
            '**/*.js',
            '**/*.vue',
        ],
    }),
    vue({
        compileTemplate: true,
    }),
    babel({
        extensions: ['.js', '.vue'],
    }),
];

export default [
    {
        input: 'src/index.js',
        output: [
            {
                file: pkg.main,
                name: 'VueSelect',
                format: 'umd',
                exports: 'named',
            },
            {
                file: pkg.module,
                format: 'esm',
                exports: 'named',
            },
        ],
        plugins,
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/vue-select.min.js',
            name: 'VueSelect',
            format: 'umd',
            exports: 'named',
            sourcemap: true,
        },
        plugins: [
            ...plugins,
            terser(),
        ],
    },
    {
        input: 'src/styles/index.scss',
        output: {
            file: 'dist/vue-select.min.css',
            format: 'es',
        },
        plugins: [
            postcss({
                extract: true,
                minimize: true,
                sourceMap: true,
                extensions: [ '.sass' ],
                plugins: [
                    cssnano(),
                    autoprefixer,
                ],
                preprocessor: (content, id) => new Promise(resolve => {
                    const result = sass.renderSync({ file: id });

                    resolve({
                        code: result.css.toString(),
                    });
                }),
            }),
        ],
    },
];
