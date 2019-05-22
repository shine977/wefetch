const uglify = require('rollup-plugin-uglify').uglify;
import pkg from './wefetch/package.json';
const banner =
`/*  
    Promise based wx.request api for  Mini Program
    @Github https://github.com/jonnyshao/wechat-fetch
    wefetch beta v${pkg.version} |(c) 2018-2019 By Jonny Shao
*/`;
//../Example/wechat/utils
module.exports = [
    {
        input: './src/lib/wefetch.js',
        output: {
            file: './exmaple/api/wf.js',
            format: 'umd',
            name: 'wefetch',
            sourcemap: false,
            banner
        }
    },
    {
        input: './src/lib/wefetch.js',
        output: {
            file: './wefetch/dist/wefetch.min.js',
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
