/*
 * @Author: zhenglfsir@gmail.com
 * @Date: 2018-11-30 17:04:43
 * @Last Modified by: zhenglfsir@gmail.com
 * @Last Modified time: 2019-01-25 15:47:47
 * 批量获取每个仓库数据
 */
const process = require('process');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const resolveCommand = require('./utils/resolveCommand');

const command = resolveCommand();
const cwd = process.cwd();

const users = ['zsirfs', 'Vanny', 'Biger', 'Eric'];

if (command.src) {
  try {
    const warehousePath = cwd + path.sep + command.src;
    const dirs = fs.readdirSync(warehousePath).filter((name) => {
      const stat = fs.statSync(warehousePath + path.sep + name);
      return stat.isDirectory();
    });
    // 得到所有目录后依次进入每个目录进行更新
    for (const name of dirs) {
      const respPath = warehousePath + path.sep + name;
      const dotGitDir = respPath + path.sep + '.git';
      if (fs.existsSync(dotGitDir)) {
        users.forEach((u) => {
          const result = spawnSync(
            'git',
            [
              'log',
              `--author=${u}`,
              '--pretty=tformat: --numstat | awk \'{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }\'',
            ],
            {
              cwd: respPath,
            }
          );
          console.log(result.output.join('\n'));
        });

        console.log(`${name} 获取完成`);
      } else {
        console.log(`${name}不存在.git 目录，忽略...`);
      }
    }
  } catch (err) {
    console.error('[JS-SHELL]', error);
  }
}

/*
git log --author=zsirfs --since="2014-07-01" --no-merges | grep -e 'commit [a-zA-Z0-9]*' | wc -l

git log --author="zsirfs" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "增加: %s, 移除: %s, 总行数: %s\n", add, subs, loc }' -
*/
