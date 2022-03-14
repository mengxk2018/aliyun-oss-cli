#!/usr/bin/env node
import { AliyunOssService, OssConfig } from './oss'
import { path, fs } from './upload'
const minimist = require('minimist')
const pkg = require('../package.json')

// 获取命令行参数
const program = minimist(process.argv.slice(2))
// console.log(program)

// 查看版本
if (program.version) {
  console.log(pkg.version)
  process.exit()
}

// 查看帮助
if (program.help) {
  console.log("aliyun-oss-cli [options]")
  console.log("--help               查看帮助")
  console.log("--version            查看版本")
  console.log("--config             配置文件路径 默认: ./aliyun.config.json")
  console.log("--delete             上传前清空目标文件夹 默认：否")
  console.log("--env                发布环境 例如: dev sta prod")
  console.log("--source             本地静态文件路径 例如: dist/")
  console.log("--target             阿里云 OSS 文件路径 例如: static/home/")
  console.log("--accessKeyId        阿里云 OSS accessKeyId")
  console.log("--accessKeySecret    阿里云 OSS accessKeySecret")
  console.log("--bucket             阿里云 OSS bucket")
  console.log("--region             阿里云 OSS region")
  process.exit()
}

// 获取配置路径
const config = path.posix.join(process.cwd(), program.config || './aliyun.config.json')
// console.log(config)

// 获取文件配置
const ossConfig = {} as OssConfig
if (fs.existsSync(config)) Object.assign(ossConfig, require(config))

// 根据环境获取文件路径
if (program.env && ossConfig.envConf && ossConfig.envConf[program.env]) {
  Object.assign(ossConfig, ossConfig.envConf[program.env])
}

// 获取命令行配置
if (program.accessKeyId) ossConfig.accessKeyId = program.accessKeyId
if (program.accessKeySecret) ossConfig.accessKeySecret = program.accessKeySecret
if (program.region) ossConfig.region = program.region
if (program.bucket) ossConfig.bucket = program.bucket
if (program.source) ossConfig.source = program.source
if (program.target) ossConfig.target = program.target
// console.log(ossConfig)

// 验证参数
const params: string[] = ['accessKeyId', 'accessKeySecret', 'region', 'bucket', 'source', 'target']
params.forEach((k: string) => {
  if (!(k in ossConfig)) {
    console.error(`ERROR: 缺少参数 ${k}，使用 --help 命令查看具体配置！`)
    process.exit()
  }
})

const ossService = new AliyunOssService(ossConfig);

if (program.delete) {
  ossService.delete(ossConfig.target).then(res => {
    ossService.upload()
  })
} else {
  ossService.upload()
}
