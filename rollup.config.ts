import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import path from 'path'
const pkg = require('./package.json')
let defaults = { compilerOptions: { declaration: true } }
let override = { compilerOptions: { declaration: false } }
const libraryName = 'wefetch'
const banner =
  `/*  
    Promise based wx.request api for  Mini Program
    @Github https://github.com/jonnyshao/wechat-fetch
    wefetch beta v${pkg.version} |(c) 2018-2019 By Jonny Shao
*/`;
export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      banner
      // exports: 'auto'
    },
    { file: pkg.module, format: 'es', sourcemap: true, banner },
    // { file: './example/node_modules/wefetch', format: 'es', sourcemap: true, banner }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigDefaults: defaults,
      tsconfig: 'tsconfig.json',
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
      // hook: {
      // Always rename declaration files to index.d.ts to avoid emitting two declaration files with identical contents
      // outputPath: (path, kind) => (kind === 'declaration' ? './dist/index.d.ts' : path)
      // }

      tsconfigOverride: override
    }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ]
}
