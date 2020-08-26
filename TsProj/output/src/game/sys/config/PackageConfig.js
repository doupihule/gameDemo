"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Global_1 = require("../../../utils/Global");
const UserInfo_1 = require("../../../framework/common/UserInfo");
class PackageConfig {
    static initCfgs() {
        if (this.client_template_version != "{client_template_version}") {
            Global_1.default.client_version = this.client_template_version;
        }
        if (this.client_template_platformId != "{client_template_platformId}") {
            UserInfo_1.default.platformId = this.client_template_platformId;
        }
    }
}
exports.default = PackageConfig;
PackageConfig.configData = null;
//client version
PackageConfig.client_template_version = "{client_template_version}";
//target platform
PackageConfig.client_template_platformId = "{client_template_platformId}";
//# sourceMappingURL=PackageConfig.js.map