
import ImageExpand from "./framework/components/ImageExpand";
import ButtonExpand from "./framework/components/ButtonExpand";


import GlobalData from "./framework/utils/GlobalData";
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
import TimerManager from "./framework/manager/TimerManager";

declare  var global;
class Main {
	constructor() {
		if(!global.window){
			//赋值global.window 为global. 兼容web标准 .
			global.window = global
		}
		BaseFunc.setCfgExportType(BaseFunc.exportType_New);

		// //初始化全局变量
		this.initWindowEnv();
		FrameWorkHandle.init();
		//
		PackConfigManager.initCfgs();
		UserInfo.init();
		if (UserInfo.isSystemIos()) {
			UserInfo.adMediaType = PlatformIdType.adMedia_gdt;
		}

		FileUtils.initRootCachePath();
		//初始化引擎扩展
		EngineExpand.initEngineExpand();

		this.checkIsNew();
		UserInfo.platform.setSystemInfo();


		this.showMainModule();

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

		if (!window["UserInfo"]) {
			window["UserInfo"] = UserInfo;
		}
		//赋值timemanager
		window["TimeManager"] = TimerManager;
	}
}

//激活启动类
new Main();
