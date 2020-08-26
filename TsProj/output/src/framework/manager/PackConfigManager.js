"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PackageConfig_1 = require("../../game/sys/config/PackageConfig");
const TestPlatform_1 = require("../../game/sys/common/TestPlatform");
const Global_1 = require("../../utils/Global");
const UserInfo_1 = require("../common/UserInfo");
const LogsManager_1 = require("./LogsManager");
const CloudPlatformData_1 = require("../../game/sys/common/CloudPlatformData");
const GameConsts_1 = require("../../game/sys/consts/GameConsts");
class PackConfigManager {
    constructor() {
    }
    static get ins() {
        if (!this._ins) {
            this._ins = new PackConfigManager();
        }
        return this._ins;
    }
    static initCfgs() {
        var config = PackageConfig_1.default.configData;
        if (!config) {
            Global_1.default.resource_url = "https://cdn-test-hz.fantasyfancy.com/" + GameConsts_1.default.gameCode + "/test/" + UserInfo_1.default.platformId + "/";
            return;
        }
        if (config.CLIENT_VERSION) {
            Global_1.default.client_version = config.CLIENT_VERSION;
        }
        if (config.CHANNEL) {
            UserInfo_1.default.platformId = config.CHANNEL;
        }
        if (config.GAME_CODE) {
            GameConsts_1.default.gameCode = config.GAME_CODE;
            LogsManager_1.default.echo("gameCode:", GameConsts_1.default.gameCode);
        }
        if (config.CDN_URL) {
            Global_1.default.resource_url = config.CDN_URL + "/" + UserInfo_1.default.platformId + "/";
        }
        if (config.SYSTEM) {
            UserInfo_1.default.systemId = config.SYSTEM;
        }
        LogsManager_1.default.echo("UserInfo.systemId", UserInfo_1.default.systemId, UserInfo_1.default.platformId, UserInfo_1.default.isSystemAndroid());
    }
    get platform() {
        if (this._platform != null) {
            return this._platform;
        }
        this._platform = {};
        var config = PackageConfig_1.default.configData;
        var platform = TestPlatform_1.default.platform;
        if (UserInfo_1.default.isWeb()) {
            Global_1.default.isCDN = false;
        }
        else {
            Global_1.default.isCDN = true;
        }
        if (Global_1.default.checkUserCloudStorage()) {
            platform = CloudPlatformData_1.default.platform;
        }
        if (config != null) {
            this._platform["platform"] = config.APP_DEPLOYMENT;
            this._platform["vms_version"] = config.APP_BUILD_NUM;
            this._platform["upgrade_path"] = config.UPGRADE_PATH;
            this._platform["vms_url"] = config.VMS_URL;
            if (config.CLOUD_URL) {
                this._platform["cloud_url"] = config.CLOUD_URL;
            }
            if (config.BACKEND_URL) {
                this._platform["backend_url"] = config.BACKEND_URL;
            }
            //是否有下载链接
            if (config.DOWNLOAD_URL) {
                this._platform.DOWNLOAD_URL = config.DOWNLOAD_URL;
                LogsManager_1.default.echo("DOWNLOAD_URL" + config.DOWNLOAD_URL);
            }
            else {
                LogsManager_1.default.warn("没有配置DOWNLOAD_URL");
            }
        }
        else {
            this._platform = platform;
        }
        return this._platform;
    }
    set platform(val) {
        this._platform["kakura_url"] = val.link;
        this._platform["sec"] = val._id;
        // this._platform["version"] = (val.version.web_cn || val.version.wx_cn || val.version.qq_cn || val.version.toutiao_cn).version;
        // this._platform["upgrade_path"] = (val.version.web_cn || val.version.wx_cn || val.version.qq_cn || val.version.toutiao_cn).upgrade_path;
    }
}
exports.default = PackConfigManager;
//# sourceMappingURL=PackConfigManager.js.map