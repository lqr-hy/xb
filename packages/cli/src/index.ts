
import { gt } from 'semver';
import { red } from 'colors'
import { homedir } from 'node:os'
import minimist from 'minimist';
import dotEnv from 'dotenv'

import pkg from '../package.json';
import log from './log/log'
import { DEFAULT_CLI_HOME, LOWEST_NODE_VERSION } from './config/config'
import path from 'node:path';
import fs from 'node:fs';

function pathExistsSync(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch {
    return false;
  }
}

let argv

function core(argv: string[]) {
  try {
    checkNodeVersion()
    checkPackageVersion()
    checkUserHome()
    checkInputArgv(argv)
    checkEnv()
  } catch (e) {
    log.error('error', e.message)
  }
}

// 版本
function checkPackageVersion() {
  log.version('version', pkg.version)
}

// node 版本
function checkNodeVersion() {
  const currentVersion = process.versions.node
  const lowestNodeVersion = LOWEST_NODE_VERSION

  if (!gt(currentVersion, lowestNodeVersion)) {
    throw new Error(red(`当前脚手架支持node 最低版本为${lowestNodeVersion}`))
  }
}

// 主目录
function checkUserHome() {
  if (!homedir() || !pathExistsSync(homedir())) {
    throw new Error(red('当前登录用户主目录不存在，无法正常启动脚本'))
  }
}

// 入参
function checkInputArgv(arg: string[]) {
  argv = minimist(arg)

  if (argv.debug) {
    log.level = 'debug'
  } else {
    log.level = 'info'
  }
}

// 环境
function checkEnv() {
  const dotEnvPath = path.resolve(homedir(), '.one-piece')
  if (!pathExistsSync(dotEnvPath)) {
    dotEnv.config({
      path: dotEnvPath,
    })
  } else {
    createDefaultEnvConfig()
  }
}

function createDefaultEnvConfig() {
  const cliConfig = {
    home: homedir()
  }

  if (process.env.CLI_HOME) {
    cliConfig['cliHomePath'] = path.join(cliConfig.home, process.env.CLI_HOME)
  } else {
    cliConfig['cliHomePath'] = path.join(cliConfig.home, DEFAULT_CLI_HOME)
  }

  process.env.CLI_HOME_PATH = cliConfig.home
}

core(process.argv.slice(2))

export default core