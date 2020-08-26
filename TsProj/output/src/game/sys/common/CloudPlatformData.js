"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserInfo_1 = require("../../../framework/common/UserInfo");
class CloudPlatformData {
    static get platform() {
        if (UserInfo_1.default.isWeb()) {
            return this.dev;
        }
        return this.test;
    }
    static getPlatform(plat) {
        return this[plat];
    }
}
exports.default = CloudPlatformData;
//dev平台
CloudPlatformData.dev = {
    "platform": "dev",
    "upgrade_path": "web_cn",
    "cloud_url": "https://cloud-dev.fantasyfancy.com:8544/index.php?mod=jsonrpc",
    "vms_version": 1,
    "backend_url": "https://cloud-dev.fantasyfancy.com:8601/?mod=jsonrpc"
};
//test服务器
CloudPlatformData.test = {
    "platform": "test",
    "upgrade_path": "wx_cn",
    "cloud_url": "https://cloud-test.fantasyfancy.com:8608/index.php?mod=jsonrpc",
    "vms_version": 1,
    "DOWNLOAD_URL": "https://www.taptap.com/app/193270",
    "backend_url": "https://flat-backend-test.fantasyfancy.com:8601/?mod=jsonrpc"
};
/**online服务器 */
CloudPlatformData.online = {
    "platform": "online",
    "upgrade_path": "web_cn",
    "cloud_url": "https://cloud-online.fantasyfancy.com:8544/index.php?mod=jsonrpc",
    "vms_version": 1,
};
//# sourceMappingURL=CloudPlatformData.js.map