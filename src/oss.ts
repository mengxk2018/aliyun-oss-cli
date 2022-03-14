import * as OSS from 'ali-oss';
import { upload } from './upload';
import { deletePrefix } from "./delete"

export interface OssConfig {
    accessKeyId: string,
    accessKeySecret: string,
    region: string,
    bucket: string,
    source: string,
    target: string,
    envConf: any
}

export class AliyunOssService {
    client: OSS;
    config: OssConfig

    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     */
    constructor(config: OssConfig) {
        this.config = config
        this.client = new OSS(config as OSS.Options)
    }

    /** 上传文件 */
    upload() {
        return upload(this.client, this.config)
    }

    /** 使用前缀删除文件夹 */
    delete(prefix: string) {
        return deletePrefix(this.client, prefix)
    }
}
