const uglify = require('rollup-plugin-uglify').uglify;
import pkg from './package.json';
const banner =
`/*  
    Promise based wx.request api for  Mini Program
    @Github https://github.com/jonnyshao/wechat-fetch
    wefetch beta v${pkg.version} |(c) 2018-2019 By Jonny Shao
*/`;
//../Example/wechat/utils
module.exports = [
    {
        input: './lib/wefetch.js',
        output: {
            file: 'dist/wefetch.js',
            format: 'umd',
            name: 'wefetch',
            sourcemap: false,
            banner
        }
    },
    {
        input: './lib/wefetch.js',
        output: {
            file: 'dist/wefetch.min.js',
            format: 'umd',
            name: 'wefetch',
            sourcemap: false,
            banner
        },
        plugins: [
            uglify()
        ],

    }
];