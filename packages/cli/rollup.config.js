const commonjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    json(),
    nodeResolve({
      browser: false,
      exportConditions: ['node'],
      extensions: ['.js', '.ts', '.json'],
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      sourceMap: false
    })]
}