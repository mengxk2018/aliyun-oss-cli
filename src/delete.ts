import * as OSS from "ali-oss";

/** 处理请求失败的情况，防止promise.all中断，并返回失败原因和失败文件名 */
async function handleDel(client: OSS, name: string, options?: any) {
    try {
        await client.delete(name);
    } catch (error) {
        (error as any).failObjectName = name;
        return error;
    }
}

/** 删除指定前缀的文件 
 * @param client
 * @param prefix
 * @param maxKeys 默认1000
*/
export async function deletePrefix(client: OSS, prefix: string, maxKeys = 1000) {
    const list = await client.list({ prefix, 'max-keys': maxKeys }, {});
    list.objects = list.objects || [];
    const result = await Promise.all(list.objects.map((v) => handleDel(client, v.name)));
    console.log(`已清空目标文件夹：${prefix}，共计删除${list.objects.length}条文件记录`)
}

export default deletePrefix