
import ImageExpand from "./framework/components/ImageExpand";
import ButtonExpand from "./framework/components/ButtonExpand";


import Global from "./utils/Global";
import LogsManager from "./framework/manager/LogsManager";
import MainModule from "./framework/manager/MainModule";
import PackConfigManager from "./framework/manager/PackConfigManager";
import StatisticsManager from "./game/sys/manager/StatisticsManager";
import DisplayUtils from "./framework/utils/DisplayUtils";
import CacheManager from "./framework/manager/CacheManager";
import StorageCode from "./game/sys/consts/StorageCode";
import FileUtils from "./framework/utils/FileUtils";
import EngineExpand from "./framework/engine/EngineExpand";
import JumpManager from "./framework/manager/JumpManager";
import JumpConst from "./game/sys/consts/JumpConst";
import FrameWorkHandle from "./game/sys/manager/FrameWorkHandle";
import StatisticsCommonConst from "./framework/consts/StatisticsCommonConst";
import BaseFunc from "./framework/func/BaseFunc";
import UserInfo, {PlatformIdType} from "./framework/common/UserInfo";
import KariquShareConst from "./framework/consts/KariquShareConst";
import GameConsts from "./game/sys/consts/GameConsts";

declare  var global;
class Main {
	constructor() {
		console.log("globa;Evn:",global);
		// BaseFunc.setCfgExportType(BaseFunc.exportType_New);
		//
		// //初始化全就
		// this.initWindowEnv();
		// FrameWorkHandle.init();
		//
		// PackConfigManager.initCfgs();
		// UserInfo.init();
		// if (UserInfo.isSystemIos()) {
		// 	UserInfo.adMediaType = PlatformIdType.adMedia_gdt;
		// }
		//
		// FileUtils.initRootCachePath();
		// //初始化引擎扩展
		// EngineExpand.initEngineExpand();
		//
		//
		// this.checkIsNew();
		// UserInfo.platform.setSystemInfo();
		// if (Global.isNew()) {
		// 	StatisticsManager.ins.onEvent(StatisticsCommonConst.NEW_LOADING_1);
		// } else {
		// 	StatisticsManager.ins.onEvent(StatisticsCommonConst.LOADING_1);
		// }
		//
		//
		// this.showMainModule();
		// if (UserInfo.isWX() || UserInfo.isTT()) {
		// 	JumpManager.setJumpChannel(JumpConst.JUMP_CHANNEL_KARIQU);
		// 	KariquShareConst.initKariquUrl(GameConsts.kariquUrlMap);
		// 	JumpManager.setKariquList({
		// 		1: {
		// 			url: GameConsts.JUMP_KARIQU_REDIRECT_LIST_URL,
		// 			type: JumpConst.JUMP_KARIQU_LEFTSIDE,
		// 		},
		// 		2: {
		// 			url: GameConsts.JUMP_KARIQU_REDIRECT_LIST_URL,
		// 			type: JumpConst.JUMP_KARIQU_BATTLEICON,
		// 		},
		// 		3: {
		// 			url: GameConsts.JUMP_KARIQU_REDIRECT_LIST_URL,
		// 			type: JumpConst.JUMP_KARIQU_BANNER,
		// 		},
		//
		// 	});
		// } else {
		// 	JumpManager.setJumpChannel(JumpConst.JUMP_CHANNEL_FANTASY);
		// }
		//
		// DisplayUtils.adjustLabelPos();
	}



	showMainModule() {
		new MainModule();
	}

	/**打点-激活数据上传到阿里云 */
	checkIsNew() {
		var isNewStr = StorageCode.storage_isNewPlayer;
		var isNewSta = CacheManager.instance.getFileStorageCache(isNewStr);
		var isNew = isNewSta == "0" || !isNewSta;
		StatisticsManager.isNewPlayer = isNew;
		if (!UserInfo.isWeb()) {
			LogsManager.sendActiveToAiCloud(isNew ? 1 : 0);
		}
		CacheManager.instance.setFileStorageCache(isNewStr, true);
	}

	//初始化全局变量
	initWindowEnv() {
		if (!window["LogsManager"]) {
			window["LogsManager"] = LogsManager;
		}
		//全局封装一个LogsTools变量, 如果修改了底层源码的地方 全部改用LogsTools,防止因为LogsManager因为被加密导致访问不到
		window["LogsTools"] = LogsManager;

		if (!window["UserInfo"]) {
			window["UserInfo"] = UserInfo;
		}
	}
}

//激活启动类
new Main();
