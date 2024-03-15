import { getLibALlVersion, publish, upgradeVersion } from "./utils";
import log from 'npmlog'
import { prompt } from 'inquirer'

async function release(lib: string, releaseType: string, version: string) {
  // console.log('release');
  console.log(lib, releaseType, version);
  // 获取所有版本
  const libList = await getLibALlVersion(lib)

  // 找到当前版本
  const currentVersion = libList.find(item => item === version)

  if (!currentVersion) {
    log.info('The current version has not been released before', '当前版本未发版过')
    const { continuePublish } = await prompt([{
      type: 'confirm',
      message: '是否继续发布',
      name: 'continuePublish',
    }])

    if (!continuePublish) {
      process.exit(0)
    }

    publish(releaseType)
    // TODO 待完成 发布
    return
  }

  await upgradeVersion(releaseType, libList, version)
  // await upgradeVersion(releaseType, ['0.0.1-alpha.0'], '0.0.1-alpha.0')
}


export {
  release
}