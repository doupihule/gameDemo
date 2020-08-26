"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("../manager/LogsManager");
const Global_1 = require("../../utils/Global");
const DeviceTools_1 = require("../utils/DeviceTools");
const GameUtils_1 = require("../../utils/GameUtils");
const TableUtils_1 = require("../utils/TableUtils");
const GameSwitchConst_1 = require("../../game/sys/consts/GameSwitchConst");
const BannerAdManager_1 = require("../manager/BannerAdManager");
const ChannelConst_1 = require("../../game/sys/consts/ChannelConst");
const UserInfo_1 = require("./UserInfo");
const GameConsts_1 = require("../../game/sys/consts/GameConsts");
/**
 * 游戏中的一些开关和静态变量管理器
 */
class GameSwitch {
    constructor() {
    }
    /**
      * 获取switch
      */
    static get switchMap() {
        if (!this._hasInitSwitch)
            this.initSwitch();
        return this._switchMap;
    }
    /**
      * 写入 switch
      */
    static set switchMap(data) {
        if (!this._hasInitSwitch)
            this.initSwitch();
        this._switchMap = data;
    }
    static initSwitch() {
        TableUtils_1.default.deepMerge(this._switchMap, GameSwitchConst_1.default._switchMap);
        this._hasInitSwitch = true;
    }
    //判断某个开关是否开启 true 表示开启,false 表示关闭
    static checkOnOff(key) {
        //如果是屏蔽广告开关
        var resultValue;
        //如果满足开关条件了 那么返回开关的值
        if (this.checkCondition(this._switchCondition[key])) {
            if (Number(this.switchMap[key]) == 1 || this.switchMap[key] == true) {
                resultValue = true;
            }
            else {
                resultValue = false;
            }
            return resultValue;
        }
        return false;
    }
    //覆盖服务器回来的开关
    static coverServerSwitchMap(map) {
        for (var i in map) {
            this._switchMap[i] = map[i];
        }
        LogsManager_1.default.setLogGroupVisible(this.checkOnOff(GameSwitch.SWITCH_LOG_PANEL));
        DeviceTools_1.default.checkBySwitch();
        var channelData = ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId);
        //这里做定向覆盖包数据.
        if (map[this.VIDEO_ID]) {
            channelData.adVideoId = map[this.VIDEO_ID];
        }
        if (map[this.BANNER_ID]) {
            channelData.adBannerId = map[this.BANNER_ID];
        }
        if (map.TTADSDK_ID) {
            channelData.appSid = map.TTADSDK_ID;
        }
        //全屏视频id
        if (map.FULLVIDEO_ID) {
            channelData.adFullVideoId = map.FULLVIDEO_ID;
        }
        //GM开关
        LogsManager_1.default.checkGM();
        GameUtils_1.default.canShare = !this.checkOnOff(GameSwitch.SWITCH_DISABLE_SHARE_NEW);
        GameUtils_1.default.canVideo = !this.checkOnOff(GameSwitch.SWITCH_DISABLE_ADV);
        GameUtils_1.default.isReview = this.checkOnOff(GameSwitch.SWITCH_DISABLE_REVIEW);
        for (i in map) {
            LogsManager_1.default.echo("服务器返回的开关覆盖结果   ", i, " : ", map[i]);
        }
        var frameRate = this.getSwitchState(GameSwitch.SWITCH_GAME_FRAME_RATE);
        //var frameRate = "60"
        if (frameRate && frameRate != "0") {
            var targetRate = Number(frameRate);
            if (GameConsts_1.default.gameFrameRate != targetRate) {
                GameConsts_1.default.gameFrameRate = targetRate;
                LogsManager_1.default.echo("设置游戏帧率:", frameRate);
                UserInfo_1.default.platform.setGameFrame();
            }
        }
    }
    //覆盖开关条件
    //覆盖服务器回来的开关
    static coverServerSwitchConditionMap(map) {
        if (!map) {
            return;
        }
        for (var i in map) {
            this._switchCondition[i] = map[i];
        }
    }
    //改变开关状态 1 表示开启,0 表示关闭
    static setOnOff(key, value) {
        this.switchMap[key] = value;
    }
    //获取开关值，针对oppo
    static getSwitchState(key) {
        return this.switchMap[key];
    }
    //判断是否满足条件
    static checkCondition(value) {
        //没有condition 返回满足开关条件
        if (!value || value == "" || value == " ") {
            return true;
        }
        var resultBo = false;
        //支持数组配置 多个参数条件 只要满足一个条件就返回true.这样可以支持配置多个版本开关生效条件
        var groupArr = value.split(";");
        for (var i = 0; i < groupArr.length; i++) {
            var tempValue = groupArr[i];
            if (tempValue && tempValue != "") {
                var tempArr = tempValue.split(",");
                var condition1 = Number(tempArr[0]);
                //需要把版本号转成数字
                var conditionVersionNums = this.countVersionToNumber(tempArr[1]);
                var clientVersionNums = this.countVersionToNumber(Global_1.default.client_version);
                var tempRt;
                if (condition1 == 1) {
                    tempRt = conditionVersionNums > clientVersionNums;
                }
                else if (condition1 == 2) {
                    tempRt = conditionVersionNums >= clientVersionNums;
                }
                else if (condition1 == 3) {
                    tempRt = conditionVersionNums == clientVersionNums;
                }
                else if (condition1 == 4) {
                    tempRt = conditionVersionNums <= clientVersionNums;
                }
                else if (condition1 == 5) {
                    tempRt = conditionVersionNums < clientVersionNums;
                }
                if (tempRt) {
                    return true;
                }
            }
        }
        //全部条件满足就算完成
        return false;
    }
    //版本号字符串转化成数字
    static countVersionToNumber(version) {
        if (version) {
            var tempArr = version.split(".");
            var resultNum = 0;
            var len = tempArr.length;
            for (var i = len - 1; i >= 0; i--) {
                resultNum += Math.pow(1000, len - i - 1) * Number(tempArr[i]);
            }
            return resultNum;
        }
        return 0;
    }
    /**设置需要白名单的开关值 */
    static setWhiteListSwitch() {
        BannerAdManager_1.default.setBannerSwitch();
        // ChargeUtils.setChargeSwitch()
    }
}
exports.default = GameSwitch;
//命名规范:switch_功能名称 全大写
//开关静态变量定义
//gm开关 暂时设置为打开 方便调试 0 是关闭gm,1是打开gm
GameSwitch.SWITCH_GM_DEBUG = "SWITCH_GM_DEBUG";
//cd修改数据开关 web暂时设置为打开 方便调试 0 是关闭cd,1是打开cd
GameSwitch.SWITCH_CD_DEBUG = "SWITCH_CD_DEBUG";
//视频广告开关 暂时设为打开(即屏蔽广告) 0 是有广告 1 是禁止广告
GameSwitch.SWITCH_DISABLE_ADV = "SWITCH_DISABLE_ADV";
//日志显示开关 暂时设为关闭 0是显示  1是 隐藏
GameSwitch.SWITCH_LOG_PANEL = "SWITCH_LOG_PANEL";
//日志按钮不可显示 暂时设为关闭 0是显示 1 是隐藏
GameSwitch.SWITCH_LOG_PANEL_DISABLE = "SWITCH_LOG_PANEL_DISABLE";
//是否屏蔽分享开关 打开则为屏蔽分享 0是有分享, 1是屏蔽分享
GameSwitch.SWITCH_DISABLE_SHARE_NEW = "SWITCH_DISABLE_SHARE_NEW";
//好友邀战 0是开启好友对战  1是禁掉好友对战
GameSwitch.SWITCH_DISABLE_INVITE_FIGHT = "SWITCH_DISABLE_INVITE_FIGHT";
//是否禁止发送错误日志开关 默认0是发送错误日志 1是禁止发送
GameSwitch.SWITCH_DISABLE_SENDERRORLOG = "SWITCH_DISABLE_SENDERRORLOG";
//取消文件合并功能 0是使用文件合并功能,1是禁止使用文件合并功能 默认0 是使用合并功能, 开发模式下 可以手动修改为1 不要提交
GameSwitch.SWITCH_DISABLE_MERGEFILES = "SWITCH_DISABLE_MERGEFILES";
/**是否可以使用分包加载，默认是0：可以使用  1：不可以使用 */
GameSwitch.SWITCH_DISABLE_SUBPACKAGE = "SWITCH_DISABLE_SUBPACKAGE";
//取消阿里云上传功能 0是阿里云上传功能,1是禁止阿里云上传功能 默认0 是阿里云上传功能, 开发模式下 可以手动修改为1 不要提交
GameSwitch.SWITCH_DISABLE_ALIYUN = "SWITCH_DISABLE_ALIYUN";
//是否显示客服功能，1是显示客服 0是不显示客服，默认为0
GameSwitch.SWITCH_DISABLE_KEFU = "SWITCH_DISABLE_KEFU";
//分享图是否使用本地  默认是0：优先url其次本地分包加载的，1：优先使用本地分包加载其次url
GameSwitch.SWITCH_DISABLE_SHARE_LOCAL = "SWITCH_DISABLE_SHARE_LOCAL";
//是否禁止zip功能, 0是 使用zip功能, 1是禁止使用zip功能
GameSwitch.SWITCH_DISABLE_ZIP = "SWITCH_DISABLE_ZIP";
//是否使用非递归方式创建目录默认0 是使用非递归方式. 
GameSwitch.SWITCH_DISABLE_MAKEDIR = "SWITCH_DISABLE_MAKEDIR";
//插屏广告延迟时间
GameSwitch.SCREEN_AD_DELAY = "SCREEN_AD_DELAY";
//原生广告延迟时间
GameSwitch.ORIGIN_AD_DELAY = "ORIGIN_AD_DELAY";
//banner广告id
GameSwitch.BANNER_ID = "BANNER_ID";
//视频广告id
GameSwitch.VIDEO_ID = "VIDEO_ID";
//原生广告插屏 id
GameSwitch.ORIGIN_ID = "ORIGIN_ID";
//原生广告ICON id
GameSwitch.ORIGIN_ICON_ID = "ORIGIN_ICON_ID";
//插屏广告id
GameSwitch.SCREEN_ID = "SCREEN_ID";
//插屏广告间隔时间
GameSwitch.INTERVAL_TIME = "INTERVAL_TIME";
//插屏广告每日最大次数
GameSwitch.MAX_TIME = "MAX_TIME";
//原生广告最大次数
GameSwitch.ORIGIN_TIME = "ORIGIN_TIME";
//红包开关
GameSwitch.SWITCH_DISABLE_REDPACKET = "SWITCH_DISABLE_REDPACKET";
/**是否资源走本地 0不走 ,1走*/
GameSwitch.SWITCH_LOCAL_RES = "SWITCH_LOCAL_RES";
//游戏模式：single是单机模式, network是联网模式，默认单机模式
GameSwitch.SWITCH_GAMEMODE = "SWITCH_GAMEMODE";
/******************************OPPO **********************************/
/**插屏开关 0显示插屏 1不显示 */
GameSwitch.SWITCH_DISABLE_INTERSTITIALAD = "SWITCH_DISABLE_INTERSTITIALAD";
//是否显示直接添加的banner 默认是 0 显示 1为不显示
GameSwitch.SWITCH_DISABLE_QUICKBANNER = "SWITCH_DISABLE_QUICKBANNER";
//是否显示带诱导的banner 默认是 0 显示 1为不显示
GameSwitch.SWITCH_DISABLE_LEADBANNER = "SWITCH_DISABLE_LEADBANNER";
//是否显示神秘礼包 默认是0 显示 1不显示
GameSwitch.SWITCH_DISABLE_MYSTERIOUSGIFT = "SWITCH_DISABLE_MYSTERIOUSGIFT";
/** 神秘礼包显示方式 默认是1 banner>推荐 2 推荐>banner 3序列*/
GameSwitch.SWITCH_MYSTERIOUSGIFT_TYPE = "SWITCH_MYSTERIOUSGIFT_TYPE";
//是否显示互推 默认是0 显示 1不显示
GameSwitch.SWITCH_DISABLE_SHOWJUMP = "SWITCH_DISABLE_SHOWJUMP";
//是否显示抽屉互推 默认是0 显示 1不显示
GameSwitch.SWITCH_DISABLE_SHOWJUMP_DRAWER_VIEW = "SWITCH_DISABLE_SHOWJUMP_DRAWER_VIEW";
// 按event name关闭阿里云日志
GameSwitch.SWITCH_DISABLE_LOG = "SWITCH_DISABLE_LOG";
// 按event group关闭阿里云日志
GameSwitch.SWITCH_DISABLE_LOG_GROUP = "SWITCH_DISABLE_LOG_GROUP";
//使用服务器同步的cd,  这不是开关值
GameSwitch.SWITCH_UPDATE_USERDATA_CD = "SWITCH_UPDATE_USERDATA_CD";
/** 普通banner显示方式 默认是1 广告 2 广告>推荐 3 推荐 4 推荐>广告 */
GameSwitch.SWITCH_QUICKBANNER_TYPE = "SWITCH_QUICKBANNER_TYPE";
/** 插屏类型 默认是1    1 广告 2 广告>推荐 3 推荐 4 推荐>广告 */
GameSwitch.SWITCH_INTERSTITIAL_TYPE = "SWITCH_INTERSTITIAL_TYPE";
/** 插屏类型 默认值2    1 无 2 广告 > 原生 3 原生 > 广告*/
GameSwitch.SWITCH_INTERSTITIAL_OPPO_TYPE = "SWITCH_INTERSTITIAL_OPPO_TYPE";
//推荐组件 BannerId
GameSwitch.RECOMMEN_BANNER_ID = "RECOMMEN_BANNER_ID";
//推荐组件 插屏Id
GameSwitch.RECOMMEN_PORTAL_ID = "RECOMMEN_PORTAL_ID";
//落地頁開關 
GameSwitch.SWITCH_DISABLE_LANGDINGPAGE = "SWITCH_DISABLE_LANGDINGPAGE";
// 原生广告关闭
GameSwitch.SWITCH_DISABLE_ORIGIN = "SWITCH_DISABLE_ORIGIN";
//充值开关
GameSwitch.SWITCH_DISIBLE_CHARGE = "SWITCH_DISIBLE_CHARGE";
// 百度互推开关
GameSwitch.SWITCH_DISIBLE_RECOMMEND_BAIDU = "SWITCH_DISIBLE_RECOMMEND_BAIDU";
GameSwitch.SWITCH_DISABLE_LOWDEVICE = "SWITCH_DISABLE_LOWDEVICE";
// 插屏互推开关
GameSwitch.SWITCH_INTER_JUMP = "SWITCH_INTER_JUMP";
//是否开启审核版本 默认是0 1当前是审核版本 0是不是审核版本
GameSwitch.SWITCH_DISABLE_REVIEW = "SWITCH_DISABLE_REVIEW";
//是否开启永久白名单
GameSwitch.SWITCH_ALL_IN_WHITE_LIST = "SWITCH_ALL_IN_WHITE_LIST";
//互推抽屉样式 1全屏 2抽屉
GameSwitch.SWITCH_DRAWER_TYPE = "SWITCH_DRAWER_TYPE";
//移位误触开关 0关闭 1开启
GameSwitch.SWITCH_BTN_MOVE = "SWITCH_BTN_MOVE";
//黑明单城市名称
GameSwitch.SWITCH_BLACK_IP_CITY = "SWITCH_BLACK_IP_CITY";
//获取ip对应城市失败，是否拉黑用户 1拉黑 0不处理
GameSwitch.SWITCH_BLACK_IP_FAIL_TYPE = "SWITCH_BLACK_IP_FAIL_TYPE";
//屏蔽指定报错errorTag组格式用竖线分割  configserror|testerror|...
GameSwitch.LOGS_ERRORTAG_GROP = "LOGS_ERRORTAG_GROP";
// 百度互推开关
GameSwitch.SWITCH_DISABLE_BAIDU_HUTUI = "SWITCH_DISABLE_BAIDU_HUTUI";
//订阅消息开关 0关闭 1打开 默认为1
GameSwitch.SWITCH_SUBSCRIBE_MESSAGE = "SWITCH_SUBSCRIBE_MESSAGE";
//分享录屏开关
GameSwitch.SWITCH_DISABLE_SHAREVIDEO = "SWITCH_DISABLE_SHAREVIDEO";
//是否开启OPPO审核模式
GameSwitch.SWITCH_OPPO_REVIEW = "SWITCH_OPPO_REVIEW";
//vivo是否开启添加到桌面
GameSwitch.SWITCH_VIVO_ADDTODESK = "SWITCH_VIVO_ADDTODESK";
//OPPO、vivo原生插屏自动点击开关
GameSwitch.SWITCH_DISABLE_NATIVE_AUTOCLICK = "SWITCH_DISABLE_NATIVE_AUTOCLICK";
// 互推返回是否移除已点击图标
GameSwitch.SWITCH_REMOVE_JUMPED_APP = "SWITCH_REMOVE_JUMPED_APP";
//强更开关 默认 关闭ios强更  ,  0 关闭ios强更  1. 关闭android强更,      2. ios和android强更都关闭. 3. ios 和android 都开强更 
GameSwitch.SWITCH_FORCE_UPDATE = "SWITCH_FORCE_UPDATE";
//转换url的平台   默认是wx
GameSwitch.SWITCH_TURNURL_PLAT = "SWITCH_TURNURL_PLAT";
//是否开启货币溢出报警，默认为0 关闭，1 开启
GameSwitch.SWITCH_COIN_WARNING = "SWITCH_COIN_WARNING";
//native 激励视频类型 1 是优先可关闭视频   2是优先不可关闭视频 默认是1
GameSwitch.SWITCH_NATIVE_VEDIO_TYPE = "SWITCH_NATIVE_VEDIO_TYPE";
GameSwitch.SWITCH_DISABLE_HOTFIX = "SWITCH_DISABLE_HOTFIX"; //是否禁止热更 0 是允许强更 1是禁止强更
//原生ICON刷新间隔
GameSwitch.SWITCH_ORIGIN_ICON_REFRESH_SECOND = "SWITCH_ORIGIN_ICON_REFRESH_SECOND";
//货币不足，是否弹出转盘界面:1 打开 0 不打开
GameSwitch.SWITCH_MONEY_NOTENOUGH_OPEN_TURNABLE = "SWITCH_MONEY_NOTENOUGH_OPEN_TURNABLE";
//针对套壳包的处理方式  默认0或者空 表示 禁止玩游戏. 1表示可以玩游戏但是无法看广告
GameSwitch.SWITCH_SIGN_METHOD = "SWITCH_SIGN_METHOD";
GameSwitch.SWITCH_KARIQU_DISABLE_JUMP_LIST = "SWITCH_KARIQU_DISABLE_JUMP_LIST"; //热门推荐界面跳转，默认为0 可以转向，1不可转向
GameSwitch.SWITCH_KARIQU_JUMP_LIST_DELAY = "SWITCH_KARIQU_JUMP_LIST_DELAY"; //热门推荐界面继续游戏延时
//设置游戏帧率 默认0或者空表示不改变当前游戏帧率.否则就把帧率改成设置的值
GameSwitch.SWITCH_GAME_FRAME_RATE = "SWITCH_GAME_FRAME_RATE";
//开关表
/**
  * 开关key,
  * 值 1表示打开开关 0或者空表示 开关是关闭的
  */
//可以在这里初始化定义一些调试开关.后面可以走服务器控制
// 比如是否显示日志, 所有的开关默认是关闭的
GameSwitch._switchMap = {
    [GameSwitch.SWITCH_GM_DEBUG]: 0,
    [GameSwitch.SWITCH_CD_DEBUG]: 0,
    [GameSwitch.SWITCH_DISABLE_ADV]: 0,
    [GameSwitch.SWITCH_DISABLE_SHARE_NEW]: 0,
    [GameSwitch.SWITCH_LOG_PANEL]: 0,
    [GameSwitch.SWITCH_DISABLE_SUBPACKAGE]: 0,
    [GameSwitch.SWITCH_LOG_PANEL_DISABLE]: 0,
    [GameSwitch.SWITCH_DISABLE_INVITE_FIGHT]: 0,
    [GameSwitch.SWITCH_DISABLE_SENDERRORLOG]: 0,
    [GameSwitch.SWITCH_DISABLE_MERGEFILES]: 0,
    [GameSwitch.SWITCH_DISABLE_ALIYUN]: 0,
    [GameSwitch.SWITCH_DISABLE_KEFU]: 0,
    [GameSwitch.SWITCH_DISABLE_QUICKBANNER]: 0,
    [GameSwitch.SWITCH_DISABLE_LEADBANNER]: 1,
    [GameSwitch.SWITCH_DISABLE_SHOWJUMP]: 0,
    [GameSwitch.SWITCH_DISABLE_SHARE_LOCAL]: 0,
    [GameSwitch.SWITCH_DISABLE_ZIP]: 1,
    [GameSwitch.SWITCH_DISABLE_MAKEDIR]: 1,
    [GameSwitch.SWITCH_GAMEMODE]: 1,
    [GameSwitch.SCREEN_AD_DELAY]: 1,
    [GameSwitch.ORIGIN_AD_DELAY]: 1,
    [GameSwitch.BANNER_ID]: 0,
    [GameSwitch.VIDEO_ID]: 0,
    [GameSwitch.ORIGIN_ID]: 0,
    [GameSwitch.SCREEN_ID]: 0,
    [GameSwitch.INTERVAL_TIME]: 0,
    [GameSwitch.MAX_TIME]: 0,
    [GameSwitch.ORIGIN_TIME]: 4,
    [GameSwitch.SWITCH_LOCAL_RES]: 0,
    [GameSwitch.SWITCH_DISABLE_INTERSTITIALAD]: 0,
    [GameSwitch.SWITCH_DISABLE_QUICKBANNER]: 0,
    [GameSwitch.SWITCH_DISABLE_LEADBANNER]: 0,
    [GameSwitch.SWITCH_DISABLE_MYSTERIOUSGIFT]: 0,
    [GameSwitch.SWITCH_MYSTERIOUSGIFT_TYPE]: 1,
    [GameSwitch.SWITCH_DISABLE_SHOWJUMP]: 0,
    [GameSwitch.SWITCH_DISABLE_SHOWJUMP_DRAWER_VIEW]: 0,
    [GameSwitch.SWITCH_DISABLE_REDPACKET]: 0,
    [GameSwitch.SWITCH_DISABLE_LOG]: "",
    [GameSwitch.SWITCH_DISABLE_LOG_GROUP]: "S_banner",
    [GameSwitch.SWITCH_QUICKBANNER_TYPE]: 1,
    [GameSwitch.SWITCH_INTERSTITIAL_TYPE]: 1,
    [GameSwitch.SWITCH_INTERSTITIAL_OPPO_TYPE]: 2,
    [GameSwitch.SWITCH_DISABLE_LANGDINGPAGE]: 0,
    [GameSwitch.SWITCH_DISABLE_ORIGIN]: 0,
    [GameSwitch.SWITCH_DISIBLE_CHARGE]: 1,
    [GameSwitch.SWITCH_DISIBLE_RECOMMEND_BAIDU]: 0,
    [GameSwitch.SWITCH_INTER_JUMP]: "1",
    [GameSwitch.SWITCH_DISABLE_REVIEW]: 0,
    [GameSwitch.SWITCH_DISABLE_LOWDEVICE]: 0,
    [GameSwitch.SWITCH_ALL_IN_WHITE_LIST]: 0,
    // [GameSwitch.LOGS_ERRORTAG_GROP]: "clientLog|dasdsad",
    [GameSwitch.SWITCH_DRAWER_TYPE]: '2',
    [GameSwitch.SWITCH_BTN_MOVE]: '0',
    [GameSwitch.SWITCH_BLACK_IP_CITY]: '广州|深圳|未知|中国',
    [GameSwitch.SWITCH_BLACK_IP_FAIL_TYPE]: 1,
    [GameSwitch.SWITCH_DISABLE_BAIDU_HUTUI]: 0,
    [GameSwitch.SWITCH_SUBSCRIBE_MESSAGE]: 1,
    [GameSwitch.SWITCH_DISABLE_SHAREVIDEO]: 0,
    [GameSwitch.SWITCH_OPPO_REVIEW]: 0,
    [GameSwitch.SWITCH_VIVO_ADDTODESK]: 0,
    [GameSwitch.SWITCH_DISABLE_NATIVE_AUTOCLICK]: 0,
    [GameSwitch.SWITCH_REMOVE_JUMPED_APP]: 1,
    [GameSwitch.SWITCH_TURNURL_PLAT]: "wxgame|android_master|ios_master|web",
    [GameSwitch.SWITCH_NATIVE_VEDIO_TYPE]: "2",
    [GameSwitch.SWITCH_COIN_WARNING]: 0,
    [GameSwitch.SWITCH_MONEY_NOTENOUGH_OPEN_TURNABLE]: 1,
    [GameSwitch.SWITCH_KARIQU_DISABLE_JUMP_LIST]: 0,
    [GameSwitch.SWITCH_KARIQU_JUMP_LIST_DELAY]: 2000,
};
/**
  * 是否已初始化switch
  */
GameSwitch._hasInitSwitch = false;
//开关生效条件 全部是字符串 一般跟版本号相关  如果生效条件满足了,那么就算_switchmap 配置0了 开关一样算生效1 是为了兼容线上版本.
// key 和开关的key 保持一致.  
// value 采用 条件,客户端版本号的 配置方式; , 是用配置的版本号  和 global.client_version 进行比较  比如 1.0.11.12  >= global.client_version
// 可以支持多个条件.是或的关系 多个条件只要满足一个就算满足了 比如 3,1.0.1;3,1.0.2  表示 版本号为 1.0.1 或者 1.0.2的时候 生效
// 1 是>= , 2是> ,3是= 4是 <= 5是 <, 后面对应某个版本号 ,默认为空, 表示开关不生效,  
GameSwitch._switchCondition = {};
//# sourceMappingURL=GameSwitch.js.map