const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'onepieceUtils',
  },
  plugins: [
    json(),
    commonjs(),
    typescript({
      sourceMap: false
    })]
}