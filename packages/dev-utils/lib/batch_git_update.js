/*
 * @Author: zhenglfsir@gmail.com
 * @Date: 2018-11-30 17:04:43
 * @Last Modified by: zhenglfsir@gmail.com
 * @Last Modified time: 2018-11-30 17:27:40
 * 批量更新某个目录的git 仓库
 */
const process = require('process')
const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')
const resolveCommand = require('./utils/resolveCommand')

const command = resolveCommand()
const cwd = process.cwd()

if (command.src) {
  try {
    const warehousePath = cwd + path.sep + command.src
    const dirs = fs.readdirSync(warehousePath).filter((name) => {
      const stat = fs.statSync(warehousePath + path.sep + name)
      return stat.isDirectory()
    })
    // 得到所有目录后依次进入每个目录进行更新
    for (const name of dirs) {
      const respPath = warehousePath + path.sep + name
      const dotGitDir = respPath + path.sep + '.git'
      if (fs.existsSync(dotGitDir)) {
        const result = spawnSync('git', ['pull'], {
          cwd: respPath,
        })
        console.log(result.output.join('\n'))
        console.log(`${name} 更新完成`)
      } else {
        console.log(`${name}不存在.git 目录，忽略...`)
      }
    }
  } catch (err) {
    console.error('[JS-SHELL]', error)
  }
}
