
import { gt } from 'semver';
import { red } from 'colors'
import { homedir } from 'node:os'
import dotEnv from 'dotenv'

import pkg from '../package.json';
import log from './log/log'
import { DEFAULT_CLI_HOME, LOWEST_NODE_VERSION } from './config/config'
import path from 'node:path';
import fs from 'node:fs';
import { Command } from 'commander'

const program = new Command()
const options = program.opts()

function pathExistsSync(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch {
    return false;
  }
}

function core() {
  try {
    prepare()
    registerCommander()
  } catch (e) {
    log.error('error', e.message)
  }
}

function prepare() {
  checkNodeVersion()
  checkPackageVersion()
  checkUserHome()
  checkEnv()
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

function registerCommander() {
  // 注册命令
  program
    .name('onepiece')
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '')

  // 创建命令
  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action(require('./commands/init').default)

  // 对debug监听
  program.on('option:debug', function () {
    if (options.debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }
  })

  // 对未知命令监听
  program.on('command:*', function (obj) {
    const availableCommands = program.commands.map(cmd => cmd.name())
    log.error('error', `未知命令${obj[0]}`)

    if (availableCommands.length > 0) {
      log.info('info', '可用命令' + availableCommands.join(','))
    }
  })

  // 对targetPath监听
  program.on('option:targetPath', function () {
    process.env.CLI_TARGET_PATH = options.targetPath
  })

  // 解析参数
  program.parse(process.argv)

  // 如果没有传递参数，输出帮助信息
  if (program.args && program.args.length < 1) {
    program.outputHelp()
  }
}

core()

export default core