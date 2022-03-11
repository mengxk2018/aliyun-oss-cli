#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var upload_1 = require("./upload");
var minimist = require('minimist');
var pkg = require('../package.json');
// 获取命令行参数
var program = minimist(process.argv.slice(2));
// console.log(program)
// 查看版本
if (program.version) {
    console.log(pkg.version);
    process.exit();
}
// 查看帮助
if (program.help) {
    console.log("aliyun-oss-cli [options]");
    console.log("--help               查看帮助");
    console.log("--version            查看版本");
    console.log("--config             配置文件路径 默认: ./aliyun.config.json");
    console.log("--env                发布环境 例如: dev sta prod");
    console.log("--source             本地静态文件路径 例如: dist/");
    console.log("--target             阿里云 OSS 文件路径 例如: static/home/");
    console.log("--accessKeyId        阿里云 OSS accessKeyId");
    console.log("--accessKeySecret    阿里云 OSS accessKeySecret");
    console.log("--bucket             阿里云 OSS bucket");
    console.log("--region             阿里云 OSS region");
    process.exit();
}
// 获取配置路径
var config = upload_1.path.posix.join(process.cwd(), program.config || './aliyun.config.json');
// console.log(config)
// 获取文件配置
var ossConfig = {};
if (upload_1.fs.existsSync(config))
    Object.assign(ossConfig, require(config));
// 根据环境获取文件路径
if (program.env && ossConfig.envConf && ossConfig.envConf[program.env]) {
    Object.assign(ossConfig, ossConfig.envConf[program.env]);
}
// 获取命令行配置
if (program.accessKeyId)
    ossConfig.accessKeyId = program.accessKeyId;
if (program.accessKeySecret)
    ossConfig.accessKeySecret = program.accessKeySecret;
if (program.region)
    ossConfig.region = program.region;
if (program.bucket)
    ossConfig.bucket = program.bucket;
if (program.source)
    ossConfig.source = program.source;
if (program.target)
    ossConfig.target = program.target;
// console.log(ossConfig)
// 验证参数
var params = ['accessKeyId', 'accessKeySecret', 'region', 'bucket', 'source', 'target'];
params.forEach(function (k) {
    if (!(k in ossConfig)) {
        console.error("ERROR: \u7F3A\u5C11\u53C2\u6570 " + k + "\uFF0C\u4F7F\u7528 --help \u547D\u4EE4\u67E5\u770B\u5177\u4F53\u914D\u7F6E\uFF01");
        process.exit();
    }
});
// 上传 OSS
upload_1.upload(ossConfig);
