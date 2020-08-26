"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Global_1 = require("../../../utils/Global");
const UserInfo_1 = require("../../../framework/common/UserInfo");
class TestPlatform {
    // private static tt = {
    // 	"platform": "tt",
    // 	"upgrade_path": "toutiao_cn",
    // 	"vms_url": "https://football-toutiao.fantasyfancy.com:8443/",
    // 	"vms_version": 1,
    // }
    static get platform() {
        Global_1.default.isCDN = true;
        if (UserInfo_1.default.isQQGame()) {
            return this.testBricks;
        }
        if (UserInfo_1.default.isTT()) {
            return this.testTT;
        }
        if (UserInfo_1.default.isWX()) {
            return this.testWX;
        }
        Global_1.default.isCDN = false;
        return this.dev;
    }
    static getPlatform(plat) {
        return this[plat];
    }
}
exports.default = TestPlatform;
//dev平台
TestPlatform.dev = {
    "platform": "dev",
    "upgrade_path": "web_cn",
    "vms_url": "https://overtake-dev.fantasyfancy.com:8443",
    "vms_version": 1,
};
TestPlatform.test = {
    "platform": "test",
    "upgrade_path": "web_cn",
    "vms_url": "https://gunner-test-vms.fantasyfancy.com:8604/",
    "vms_version": 1,
};
/**test服务器 web平台 */
TestPlatform.testWEB = {
    "platform": "test",
    "upgrade_path": "web_cn",
    "vms_url": "https://football-test.fantasyfancy.com:8443/",
    "vms_version": 1,
};
/**test服务器 微信平台 */
TestPlatform.testWX = {
    "platform": "test",
    "upgrade_path": "wx_cn",
    "vms_url": "https://overtake-test-vms.fantasyfancy.com:8606/",
    "vms_version": 1,
};
/**test服务器 头条平台 */
TestPlatform.testTT = {
    "platform": "test",
    "upgrade_path": "toutiao_cn",
    "vms_url": "https://football-test.fantasyfancy.com:8443/",
    "vms_version": 1,
};
/**test服务器 头条平台 */
TestPlatform.testBricks = {
    "platform": "test",
    "upgrade_path": "qq_cn",
    "vms_url": "https://football-test.fantasyfancy.com:8443/",
    "vms_version": 1,
};
// private static online = {
// 	"platform": "online",
// 	"upgrade_path": "wx_cn",
// 	"vms_url": "https://football-online.fantasyfancy.com:8443/",
// 	"vms_version": 1,
// }
TestPlatform.qq = {
    "platform": "qq",
    "upgrade_path": "qq_cn",
    "vms_url": "https://football-qq.fantasyfancy.com:8443/",
    "vms_version": 1,
};
TestPlatform.testBaidu = {
    "platform": "test",
    "upgrade_path": "baidu_cn",
    "vms_url": "https://cloud-test.fantasyfancy.com:8608/",
    "vms_version": 1,
};
//# sourceMappingURL=TestPlatform.js.map