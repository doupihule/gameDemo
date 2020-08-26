import UserInfo from "../../../framework/common/UserInfo";


export default class CloudPlatformData {

	//dev平台
	private static dev = {
		"platform": "dev",
		"upgrade_path": "web_cn",
		"cloud_url": "https://cloud-dev.fantasyfancy.com:8544/index.php?mod=jsonrpc",
		"vms_version": 1,
		"backend_url": "https://cloud-dev.fantasyfancy.com:8601/?mod=jsonrpc"

	}

	//test服务器
	private static test = {
		"platform": "test",
		"upgrade_path": "wx_cn",
		"cloud_url": "https://cloud-test.fantasyfancy.com:8608/index.php?mod=jsonrpc",
		"vms_version": 1,
		"DOWNLOAD_URL": "https://www.taptap.com/app/193270",
		"backend_url": "https://flat-backend-test.fantasyfancy.com:8601/?mod=jsonrpc"
	}


	/**online服务器 */
	private static online = {
		"platform": "online",
		"upgrade_path": "web_cn",
		"cloud_url": "https://cloud-online.fantasyfancy.com:8544/index.php?mod=jsonrpc",
		"vms_version": 1,
	}


	static get platform() {
		if (UserInfo.isWeb()) {
			return this.dev
		}
		return this.test;
	}

	static getPlatform(plat: string) {
		return this[plat];
	}


}


