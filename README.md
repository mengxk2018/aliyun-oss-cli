# aliyun-oss-cli
阿里云 OSS CLI， 可以快速进行文件上传等

## 安装

```
npm install @mengxk2008/aliyun-oss-cli --save-dev
```

## 配置

项目根目录创建配置文件 `aliyun.config.json`，配置阿里云OSS的 AK & SK：

```
{
  "region": "-",
  "bucket": "-",
  "accessKeyId": "-",
  "accessKeySecret": "-",
  "envConf": {
    "dev": {
      "source": "dist/",
      "target": "home/dev/"
    },
    "sta": {
      "source": "dist/",
      "target": "home/sta/"
    },
    "prod": {
      "source": "dist/",
      "target": "home/prod/"
    }
  }
}
```

## 运行

```
# 测试
npx aliyun-oss-cli --env dev

# 预发布
npx aliyun-oss-cli --env sta

# 生产
npx aliyun-oss-cli --env prod
```

更多命令 `npx aliyun-oss-cli --help`：

```
aliyun-oss-cli [options]
--help               查看帮助
--version            查看版本
--config             配置文件路径 默认: ./aliyun.config.json
--delete             上传前清空目标文件夹 默认：否
--env                发布环境 例如: dev sta prod
--source             本地静态文件路径 例如: dist/
--target             阿里云 OSS 文件路径 例如: static/home/
--accessKeyId        阿里云 OSS accessKeyId
--accessKeySecret    阿里云 OSS accessKeySecret
--bucket             阿里云 OSS bucket
--region             阿里云 OSS region
```

## Thanks

[https://github.com/mazeyqian/aliyunoss-cli](https://github.com/mazeyqian/aliyunoss-cli) [mazeyqian]
