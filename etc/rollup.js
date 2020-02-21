export default {
  context: 'this',
  input: 'lib/index.js',
  output: {
    file: 'build/webstorage.js',
    format: 'iife',
    name: 'webStorage'
  }
};
