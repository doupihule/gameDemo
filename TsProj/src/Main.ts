import GameConfig from "./GameConfig";
import Global from "./utils/Global";
import LogsManager from "./framework/manager/LogsManager";
import ScreenAdapterTools from "./framework/utils/ScreenAdapterTools";
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

class Main {
	constructor() {
		BaseFunc.setCfgExportType(BaseFunc.exportType_New);
		StatisticsManager.mainStartT = Laya.Browser.now();
		Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.alignH = "center";
		Laya.stage.alignV = "middle";


		Laya.stage.bgColor = "#000000";
		Laya.stage.scaleMode = ScreenAdapterTools.checkScreenFixMode(Laya.Browser.width, Laya.Browser.height);
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
		//初始化全就
		this.initWindowEnv();
		FrameWorkHandle.init();

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
		if (Global.isNew()) {
			StatisticsManager.ins.onEvent(StatisticsCommonConst.NEW_LOADING_1);
		} else {
			StatisticsManager.ins.onEvent(StatisticsCommonConst.LOADING_1);
		}

		// //@xdtest 上线之后注释
		// var defaultSha1 = "C5:19:61:2D:35:23:34:B5:27:EB:A5:37:B5:CA:27:30:75:65:2C:A4|8D:BC:FB:84:97:06:04:72:21:27:BE:A7:A8:23:20:76:81:D4:63:26"
		// var encodeStr = StringUtils.encodeSign(defaultSha1);
		// var decodeStr = StringUtils.decodeSign(encodeStr)
		// LogsManager.echo("__decodeStr:", encodeStr, decodeStr, decodeStr == defaultSha1) ;


		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show(0, 100);
		Laya.alertGlobalError = true;

		this.showMainModule();
		if (UserInfo.isWX() || UserInfo.isTT()) {
			JumpManager.setJumpChannel(JumpConst.JUMP_CHANNEL_KARIQU);
			KariquShareConst.initKariquUrl(GameConsts.kariquUrlMap);
			JumpManager.setKariquList({
				1: {
					url: GameConsts.JUMP_KARIQU_REDIRECT_LIST_URL,
					type: JumpConst.JUMP_KARIQU_LEFTSIDE,
				},
				2: {
					url: GameConsts.JUMP_KARIQU_REDIRECT_LIST_URL,
					type: JumpConst.JUMP_KARIQU_BATTLEICON,
				},
				3: {
					url: GameConsts.JUMP_KARIQU_REDIRECT_LIST_URL,
					type: JumpConst.JUMP_KARIQU_BANNER,
				},

			});
		} else {
			JumpManager.setJumpChannel(JumpConst.JUMP_CHANNEL_FANTASY);
		}

		DisplayUtils.adjustLabelPos();
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		// Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
		Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
	}

	private onResize() {
		LogsManager.echo("_onResize start___");
		LogsManager.echo(Laya.stage.scaleX, Laya.stage.scaleY, "_____scale", Laya.stage.width, Laya.stage.height);
		LogsManager.echo(Laya.stage.designWidth, Laya.stage.designHeight, "___设计宽高");
		LogsManager.echo(Laya.stage.clientScaleX, Laya.stage.clientScaleX, "___clientScale");

		LogsManager.echo(Laya.stage.clientScaleX, Laya.stage.clientScaleY, "___clientScale");
		LogsManager.echo("_clientWidthhei_:", Laya.Browser.clientWidth, Laya.Browser.clientHeight, "_width,hei:", Laya.Browser.width, Laya.Browser.height);
		LogsManager.echo("_onResize end___")
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));

	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		this.showMainModule();
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);

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
