"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CacheManager_1 = require("../../../framework/manager/CacheManager");
const GameConsts_1 = require("./GameConsts");
const PackConfigManager_1 = require("../../../framework/manager/PackConfigManager");
const UserInfo_1 = require("../../../framework/common/UserInfo");
class StorageCode {
    constructor() {
    }
    //存储用户名
    static get storage_acount() {
        if (UserInfo_1.default.isWeb()) {
            return GameConsts_1.default.gameCode + "_" + PackConfigManager_1.default.ins.platform.platform + "_count";
        }
        return "acount";
    }
    //这里需要做一个判断 如果是dev 那么 userInfo是动态的 拼上 userName .如果是其他平台就是固定的
    static get storage_userinfo() {
        var key = GameConsts_1.default.gameCode + "_" + PackConfigManager_1.default.ins.platform.platform + "_" + CacheManager_1.default.instance.getGlobalCache(StorageCode.storage_acount) || "";
        return "storage_userinfo" + key;
    }
}
exports.default = StorageCode;
//本地缓存的vms版本号
StorageCode.storage_vmsversion = "storage_vmsversion";
StorageCode.storage_wxGuide = "wxGuide";
StorageCode.storage_isNewPlayer = "isNewPlayer";
StorageCode.storage_isOldPlayer = "isOldPlayer"; //打点用，区分新老用户
StorageCode.storage_deviceStr = "deviceStr";
/**来源缓存的KEY */
StorageCode.COMEFROM_CACHE = "COMEFROM_CACHE";
/**首次启动参数 */
StorageCode.storage_firstrun_data = "storage_firstrun_data";
//缓存的 zip文件路径 是 一个json串
StorageCode.storage_zip_file = "storage_zip_file";
// 离线收益领取次数缓存
StorageCode.storage_offlineCoinCount = "offlineCoinCount";
// 结算奖励领取次数缓存
StorageCode.storage_battleResultCount = "battleResultCount";
//迷雾战斗结算奖励
StorageCode.storage_fogBattleResultCount = "fogBattleResultCount";
//# sourceMappingURL=StorageCode.js.map