"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameConfig_1 = require("./GameConfig");
const Global_1 = require("./utils/Global");
const LogsManager_1 = require("./framework/manager/LogsManager");
const ScreenAdapterTools_1 = require("./framework/utils/ScreenAdapterTools");
const MainModule_1 = require("./framework/manager/MainModule");
const PackConfigManager_1 = require("./framework/manager/PackConfigManager");
const StatisticsManager_1 = require("./game/sys/manager/StatisticsManager");
const DisplayUtils_1 = require("./framework/utils/DisplayUtils");
const CacheManager_1 = require("./framework/manager/CacheManager");
const StorageCode_1 = require("./game/sys/consts/StorageCode");
const FileUtils_1 = require("./framework/utils/FileUtils");
const EngineExpand_1 = require("./framework/engine/EngineExpand");
const JumpManager_1 = require("./framework/manager/JumpManager");
const JumpConst_1 = require("./game/sys/consts/JumpConst");
const FrameWorkHandle_1 = require("./game/sys/manager/FrameWorkHandle");
const StatisticsCommonConst_1 = require("./framework/consts/StatisticsCommonConst");
const BaseFunc_1 = require("./framework/func/BaseFunc");
const UserInfo_1 = require("./framework/common/UserInfo");
const KariquShareConst_1 = require("./framework/consts/KariquShareConst");
const GameConsts_1 = require("./game/sys/consts/GameConsts");
class Main {
    constructor() {
        BaseFunc_1.default.setCfgExportType(BaseFunc_1.default.exportType_New);
        StatisticsManager_1.default.mainStartT = Laya.Browser.now();
        Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.alignH = "center";
        Laya.stage.alignV = "middle";
        Laya.stage.bgColor = "#000000";
        Laya.stage.scaleMode = ScreenAdapterTools_1.default.checkScreenFixMode(Laya.Browser.width, Laya.Browser.height);
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //初始化全就
        this.initWindowEnv();
        FrameWorkHandle_1.default.init();
        PackConfigManager_1.default.initCfgs();
        UserInfo_1.default.init();
        if (UserInfo_1.default.isSystemIos()) {
            UserInfo_1.default.adMediaType = UserInfo_1.PlatformIdType.adMedia_gdt;
        }
        FileUtils_1.default.initRootCachePath();
        //初始化引擎扩展
        EngineExpand_1.default.initEngineExpand();
        this.checkIsNew();
        UserInfo_1.default.platform.setSystemInfo();
        if (Global_1.default.isNew()) {
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NEW_LOADING_1);
        }
        else {
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.LOADING_1);
        }
        // //@xdtest 上线之后注释
        // var defaultSha1 = "C5:19:61:2D:35:23:34:B5:27:EB:A5:37:B5:CA:27:30:75:65:2C:A4|8D:BC:FB:84:97:06:04:72:21:27:BE:A7:A8:23:20:76:81:D4:63:26"
        // var encodeStr = StringUtils.encodeSign(defaultSha1);
        // var decodeStr = StringUtils.decodeSign(encodeStr)
        // LogsManager.echo("__decodeStr:", encodeStr, decodeStr, decodeStr == defaultSha1) ;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show(0, 100);
        Laya.alertGlobalError = true;
        this.showMainModule();
        if (UserInfo_1.default.isWX() || UserInfo_1.default.isTT()) {
            JumpManager_1.default.setJumpChannel(JumpConst_1.default.JUMP_CHANNEL_KARIQU);
            KariquShareConst_1.default.initKariquUrl(GameConsts_1.default.kariquUrlMap);
            JumpManager_1.default.setKariquList({
                1: {
                    url: GameConsts_1.default.JUMP_KARIQU_REDIRECT_LIST_URL,
                    type: JumpConst_1.default.JUMP_KARIQU_LEFTSIDE,
                },
                2: {
                    url: GameConsts_1.default.JUMP_KARIQU_REDIRECT_LIST_URL,
                    type: JumpConst_1.default.JUMP_KARIQU_BATTLEICON,
                },
                3: {
                    url: GameConsts_1.default.JUMP_KARIQU_REDIRECT_LIST_URL,
                    type: JumpConst_1.default.JUMP_KARIQU_BANNER,
                },
            });
        }
        else {
            JumpManager_1.default.setJumpChannel(JumpConst_1.default.JUMP_CHANNEL_FANTASY);
        }
        DisplayUtils_1.default.adjustLabelPos();
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        // Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
    }
    onResize() {
        LogsManager_1.default.echo("_onResize start___");
        LogsManager_1.default.echo(Laya.stage.scaleX, Laya.stage.scaleY, "_____scale", Laya.stage.width, Laya.stage.height);
        LogsManager_1.default.echo(Laya.stage.designWidth, Laya.stage.designHeight, "___设计宽高");
        LogsManager_1.default.echo(Laya.stage.clientScaleX, Laya.stage.clientScaleX, "___clientScale");
        LogsManager_1.default.echo(Laya.stage.clientScaleX, Laya.stage.clientScaleY, "___clientScale");
        LogsManager_1.default.echo("_clientWidthhei_:", Laya.Browser.clientWidth, Laya.Browser.clientHeight, "_width,hei:", Laya.Browser.width, Laya.Browser.height);
        LogsManager_1.default.echo("_onResize end___");
    }
    onVersionLoaded() {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    }
    onConfigLoaded() {
        //加载IDE指定的场景
        this.showMainModule();
        // GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    }
    showMainModule() {
        new MainModule_1.default();
    }
    /**打点-激活数据上传到阿里云 */
    checkIsNew() {
        var isNewStr = StorageCode_1.default.storage_isNewPlayer;
        var isNewSta = CacheManager_1.default.instance.getFileStorageCache(isNewStr);
        var isNew = isNewSta == "0" || !isNewSta;
        StatisticsManager_1.default.isNewPlayer = isNew;
        if (!UserInfo_1.default.isWeb()) {
            LogsManager_1.default.sendActiveToAiCloud(isNew ? 1 : 0);
        }
        CacheManager_1.default.instance.setFileStorageCache(isNewStr, true);
    }
    //初始化全局变量
    initWindowEnv() {
        if (!window["LogsManager"]) {
            window["LogsManager"] = LogsManager_1.default;
        }
        //全局封装一个LogsTools变量, 如果修改了底层源码的地方 全部改用LogsTools,防止因为LogsManager因为被加密导致访问不到
        window["LogsTools"] = LogsManager_1.default;
        if (!window["UserInfo"]) {
            window["UserInfo"] = UserInfo_1.default;
        }
    }
}
//激活启动类
new Main();
//# sourceMappingURL=Main.js.map