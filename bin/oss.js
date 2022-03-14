"use strict";
exports.__esModule = true;
exports.AliyunOssService = void 0;
var OSS = require("ali-oss");
var upload_1 = require("./upload");
var delete_1 = require("./delete");
var AliyunOssService = /** @class */ (function () {
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     */
    function AliyunOssService(config) {
        this.config = config;
        this.client = new OSS(config);
    }
    /** 上传文件 */
    AliyunOssService.prototype.upload = function () {
        return upload_1.upload(this.client, this.config);
    };
    /** 使用前缀删除文件夹 */
    AliyunOssService.prototype["delete"] = function (prefix) {
        return delete_1.deletePrefix(this.client, prefix);
    };
    return AliyunOssService;
}());
exports.AliyunOssService = AliyunOssService;
