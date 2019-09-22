import {resolve} from 'path';

export default {
  input: resolve(__dirname, '../lib/index.js'),
  output: {
    file: resolve(__dirname, '../build/webstorage.js'),
    format: 'iife',
    name: 'webstorage'
  }
};
