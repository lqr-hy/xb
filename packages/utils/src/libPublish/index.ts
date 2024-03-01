import { prompt } from 'inquirer'
import log from 'npmlog'

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
    
  } catch (err) {
    console.log(err)
  }
}

publish('vue', '2.6.14')