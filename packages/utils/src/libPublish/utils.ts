import { exec, spawnSync } from 'node:child_process'
import path from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import log from 'npmlog'
import { prompt } from 'inquirer'

// 获取所有版本
export async function getLibALlVersion(lib: string) {
  try {
    const libList = await execAwait(`npm view ${lib} versions --json`)
    return Array.isArray(JSON.parse(libList)) ? JSON.parse(libList) : [JSON.parse(libList)]
  } catch (error) {
    return error
  }
}

// 升级版本
export async function upgradeVersion(releaseType: string, versionList: string[], version: string) {
  const releaseTypeMap = {
    alpha: {
      type: ["prepatch", "preminor", "premajor"],
      suffix: "alpha",
    },
    next: {
      type: ["prepatch", "preminor", "premajor"],
      suffix: "rc",
    },
    latest: {
      type: ["patch", "minor", "major"],
      suffix: "",
    },
  };

  const typeConf = releaseTypeMap[releaseType];
  const release = typeConf.type;

  let newVersion

  // 生成待选择的版本号
  const choices = release.map((item) => {
    return `${item}: ${checkVersion(versionList, version, item, typeConf.suffix)}`;
  });

  const { currentVersion } = await prompt([{
    type: 'list',
    message: '请选择选择升级的版本',
    name: 'currentVersion',
    choices
  }])

  newVersion = currentVersion.split(":")[1].trim()

  await changeVersion(newVersion)

  // await publish(typeConf.suffix)
}

// 检查版本
export function checkVersion(versionList: string[], version: string, releaseType: string, suffix: string) {
  while (versionList.includes(version)) {
    version = getNextVersion(version, releaseType, suffix)
  }

  return version
}

// 获取下一个版本
export function getNextVersion(version: string, releaseType: string, suffix: string) {
  const versionInfo = version.match(/(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(?<alpha>.*)/).groups
  const major = Number(versionInfo.major)
  const minor = Number(versionInfo.minor)
  const patch = Number(versionInfo.patch)
  const alpha = Number(versionInfo.alpha.split('.')[1])

  switch (releaseType) {
    case 'prepatch':
      return `${major}.${minor}.${alpha ? patch : patch + 1}-${suffix}.${alpha ? alpha + 1 : 0}`
    case 'preminor':
      return `${major}.${minor + 1}.${0}-${suffix}.0`
    case 'premajor':
      return `${major + 1}.${0}.${0}-${suffix}.0`
    case 'patch':
      return `${major}.${minor}.${alpha ? patch : patch + 1}`
    case 'minor':
      return `${major}.${minor + 1}.${0}`
    case 'major':
      return `${major + 1}.${0}.${0}`
    default:
      throw new Error(`invalid increment argument: ${releaseType}`)
  }
}

// 发布
export function publish(suffix: string) {
  spawnSync('npm', ['run', 'build'], { stdio: 'inherit' })
  spawnSync('npm', ['publish', '--tag', suffix], { stdio: 'inherit' })
}

// 修改版本
export function changeVersion(version: string) {
  spawnSync('npm', ['version', '--no-git-tag-version', version], { stdio: 'inherit' })
  // const packageJsonPath = path.resolve(process.cwd(), 'package.json')

  // try {
  //   const content = await readFile(packageJsonPath, { encoding: 'utf8' })
  //   const newPackageJson = JSON.parse(content)
  //   newPackageJson.version = version
  //   await writeFile(packageJsonPath, JSON.stringify(newPackageJson, null, 2), { encoding: 'utf8' })
  // } catch (err) {
  //   log.error('file error', err.message);
  // }
}

const execAwait = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout)
    })
  })
}