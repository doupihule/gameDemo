import PackageConfig from "../../game/sys/config/PackageConfig";
import TestPlatform from "../../game/sys/common/TestPlatform";
import Global from "../../utils/Global";
import UserInfo from "../common/UserInfo";
import LogsManager from "./LogsManager";
import CloudPlatformData from "../../game/sys/common/CloudPlatformData";
import GameConsts from "../../game/sys/consts/GameConsts";

export default class PackConfigManager {

	private _platform: any;

	private static _ins: PackConfigManager;

	public constructor() {
	}

	static get ins(): PackConfigManager {
		if (!this._ins) {
			this._ins = new PackConfigManager();
		}
		return this._ins;
	}

	static initCfgs() {
		var config: any = PackageConfig.configData;
		if (!config) {
			Global.resource_url = "https://cdn-test-hz.fantasyfancy.com/" + GameConsts.gameCode + "/test/" + UserInfo.platformId + "/";
			return;
		}
		if (config.CLIENT_VERSION) {
			Global.client_version = config.CLIENT_VERSION
		}
		if (config.CHANNEL) {
			UserInfo.platformId = config.CHANNEL;
		}
		if (config.GAME_CODE) {
			GameConsts.gameCode = config.GAME_CODE
			LogsManager.echo("gameCode:", GameConsts.gameCode)
		}
		if (config.CDN_URL) {
			Global.resource_url = config.CDN_URL + "/" + UserInfo.platformId + "/";
		}
		if (config.SYSTEM) {
			UserInfo.systemId = config.SYSTEM
		}
		LogsManager.echo("UserInfo.systemId", UserInfo.systemId, UserInfo.platformId, UserInfo.isSystemAndroid());


	}

	get platform() {
		if (this._platform != null) {
			return this._platform;
		}
		this._platform = {}
		var config: any = PackageConfig.configData;
		var platform: any = TestPlatform.platform;
		if (UserInfo.isWeb()) {
			Global.isCDN = false;
		} else {
			Global.isCDN = true;
		}

		if (Global.checkUserCloudStorage()) {
			platform = CloudPlatformData.platform;
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
				this._platform.DOWNLOAD_URL = config.DOWNLOAD_URL
				LogsManager.echo("DOWNLOAD_URL" + config.DOWNLOAD_URL);
			} else {
				LogsManager.warn("没有配置DOWNLOAD_URL");
			}

		} else {
			this._platform = platform;
		}
		return this._platform;
	}

	set platform(val: any) {
		this._platform["kakura_url"] = val.link;

		this._platform["sec"] = val._id;
		// this._platform["version"] = (val.version.web_cn || val.version.wx_cn || val.version.qq_cn || val.version.toutiao_cn).version;
		// this._platform["upgrade_path"] = (val.version.web_cn || val.version.wx_cn || val.version.qq_cn || val.version.toutiao_cn).upgrade_path;
	}
}
