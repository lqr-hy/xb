import { prompt } from 'inquirer'
import log from 'npmlog'
import { release } from './release'

async function publish(lib, version) {
  const { releaseType } = await prompt([{
    type: 'list',
    message: '请选择将要发布的版本：',
    name: 'releaseType',
    default: 'alpha',
    choices: ['alpha', 'next', 'latest', 'exit']
  }])

  if (releaseType === 'exit') {
    process.exit(0)
  }

  log.info('Release Type', releaseType)
  try {
    await release(lib, releaseType, version)
  } catch (err) {
    console.log(err)
  }
}


export { publish }