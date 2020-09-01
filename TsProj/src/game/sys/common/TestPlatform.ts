import GlobalData from "../../../framework/utils/GlobalData";
import UserInfo from "../../../framework/common/UserInfo";

export default class TestPlatform {
	//dev平台
	private static dev = {
		"platform": "dev",
		"upgrade_path": "web_cn",
		"vms_url": "https://overtake-dev.fantasyfancy.com:8443",
		"vms_version": 1,

	}

	private static test = {
		"platform": "test",
		"upgrade_path": "web_cn",
		"vms_url": "https://gunner-test-vms.fantasyfancy.com:8604/",
		"vms_version": 1,
	}

	/**test服务器 web平台 */
	private static testWEB = {
		"platform": "test",
		"upgrade_path": "web_cn",
		"vms_url": "https://football-test.fantasyfancy.com:8443/",
		"vms_version": 1,
	}

	/**test服务器 微信平台 */
	private static testWX = {
		"platform": "test",
		"upgrade_path": "wx_cn",
		"vms_url": "https://overtake-test-vms.fantasyfancy.com:8606/",
		"vms_version": 1,
	}

	/**test服务器 头条平台 */
	private static testTT = {
		"platform": "test",
		"upgrade_path": "toutiao_cn",
		"vms_url": "https://football-test.fantasyfancy.com:8443/",
		"vms_version": 1,
	}

	/**test服务器 头条平台 */
	private static testBricks = {
		"platform": "test",
		"upgrade_path": "qq_cn",
		"vms_url": "https://football-test.fantasyfancy.com:8443/",
		"vms_version": 1,
	}

	// private static online = {
	// 	"platform": "online",
	// 	"upgrade_path": "wx_cn",
	// 	"vms_url": "https://football-online.fantasyfancy.com:8443/",
	// 	"vms_version": 1,
	// }
	private static qq = {
		"platform": "qq",
		"upgrade_path": "qq_cn",
		"vms_url": "https://football-qq.fantasyfancy.com:8443/",
		"vms_version": 1,
	}

	private static testBaidu = {
		"platform": "test",
		"upgrade_path": "baidu_cn",
		"vms_url": "https://cloud-test.fantasyfancy.com:8608/",
		"vms_version": 1,
	}
	// private static tt = {
	// 	"platform": "tt",
	// 	"upgrade_path": "toutiao_cn",
	// 	"vms_url": "https://football-toutiao.fantasyfancy.com:8443/",
	// 	"vms_version": 1,
	// }

	static get platform() {
		GlobalData.isCDN = true;
		if (UserInfo.isQQGame()) {
			return this.testBricks;
		}
		if (UserInfo.isTT()) {
			return this.testTT;
		}
		if (UserInfo.isWX()) {
			return this.testWX;
		}
		GlobalData.isCDN = false;
		return this.dev;
	}

	static getPlatform(plat: string) {
		return this[plat];
	}
}
