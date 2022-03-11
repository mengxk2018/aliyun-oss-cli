export const alioss = require('ali-oss')
export const path = require('path')
export const fs = require('fs')

let allNumber = 0
let tmpNumber = 0
let sucNumber = 0
let retNumber = 0
let sizeNumber = 0

export interface OssConfig {
  accessKeyId: string,
  accessKeySecret: string,
  region: string,
  bucket: string,
  source: string,
  target: string,
  envConf: any
}

export function upload(ossConfig: OssConfig) {
  const client = new alioss(ossConfig)
  console.log(`[aliyun-oss-cli] START UPLOADING... oss://${ossConfig.bucket}/${ossConfig.target}`)
  const list = _list(path.posix.join(process.cwd(), ossConfig.source))
  allNumber = list.length
  if (list.length > 0) {
    list.forEach(item => {
      _upload(item, ossConfig, client)
    })
  } else {
    _result()
  }
}

function _result() {
  if (allNumber === tmpNumber) {
    console.log(`[aliyun-oss-cli] RESULT:   ${_renderSize(sizeNumber)} - [ SIZE ]   ${allNumber} - [ ALL ]   ${sucNumber} - [ SUCCESS ]   ${retNumber} - [ RETRY ]`)
  }
}

function _upload(item: any, ossConfig: OssConfig, client: any, retry = true) {
  client.put(`${ossConfig.target}${item.relative}`, item.file).then(() => {
    sucNumber++
    tmpNumber++
    sizeNumber += item.size
    console.log(`[aliyun-oss-cli] [ ${item.file} ] SUCCESS   ✔ [${_renderSize(item.size)}]`)
    _result()
  }).catch(() => {
    if (retry) {
      _upload(item, ossConfig, client, false)
    } else {
      retNumber++
      tmpNumber++
      console.log(`[aliyun-oss-cli] [ ${item.file} ] FAILURE   ✘ `)
      _result()
    }
  })
}

function _list(src: string) {
  let entrysList: any[] = []
  const fetchFile = (file: string) => {
    if (!fs.existsSync(file)) {
      return
    }
    let fileStat = fs.statSync(file)
    if (fileStat.isDirectory()) {
      const fileList = fs.readdirSync(file)
      if (!fileList.length) {
        return
      }
      fileList.forEach((item: string) => {
        fetchFile(path.posix.join(file, `./${item}`))
      })
    } else {
      entrysList.push({ file, relative: path.posix.relative(src, file), size: fileStat.size })
    }
  }
  fetchFile(src)
  return entrysList
}

function _renderSize(value: any) {
  if (null == value || value == '') {
    return "0 Bytes"
  }
  let unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
  let index = 0
  let srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  let size: any = srcsize / Math.pow(1024, index)
  size = size.toFixed(2)
  return size + unitArr[index]
}