#!/usr/bin/env node

const importLocal = require('import-local');

if (importLocal(__dirname)) {
  require('npmlog').info('cli', '正在使用本地的cli')
} else {
  require('.')
}