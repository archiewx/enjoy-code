const process = require('process')

const argv = process.argv
const cwd = process.cwd()
const option = argv.reduce((acc, itemArg) => {
  if (itemArg.includes('=')) {
    const item = itemArg.split('=')
    acc[item[0]] = item[1]
  }
  return acc
}, {})

module.exports = () => {
  return option
}
