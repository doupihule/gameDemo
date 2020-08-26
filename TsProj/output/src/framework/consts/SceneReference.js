"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Global_1 = require("../../utils/Global");
const LogsManager_1 = require("../manager/LogsManager");
const WhiteListFunc_1 = require("../func/WhiteListFunc");
const UserInfo_1 = require("../common/UserInfo");
const UserModel_1 = require("../../game/sys/model/UserModel");
const CommonEvent_1 = require("../event/CommonEvent");
const Message_1 = require("../common/Message");
const GameSwitch_1 = require("../common/GameSwitch");
const StatisticsManager_1 = require("../../game/sys/manager/StatisticsManager");
const StatisticsCommonConst_1 = require("./StatisticsCommonConst");
const Client_1 = require("../common/kakura/Client");
const SingleCommonServer_1 = require("../server/SingleCommonServer");
const GlobalParamsFunc_1 = require("../../game/sys/func/GlobalParamsFunc");
const UserExtCommonModel_1 = require("../model/UserExtCommonModel");
/**
 * 微信小游戏场景值参照表
 * create by sanmen 2019.6.21
 */
class SceneReference {
    constructor() {
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new SceneReference();
        }
        return this._instance;
    }
    recvMsg(cmd, data) {
        if (cmd == CommonEvent_1.default.GET_IPINFO_SUCCESS) {
            if (!UserModel_1.default.instance.isSceneBlack() && SceneReference.checkIpBlack()) {
                // 原来不是黑名单，返回收到IP在黑名单之内。设置黑名单字段。并通知黑名单更新
                SceneReference.setSceneBlack();
                Message_1.default.instance.send(CommonEvent_1.default.WHITE_LIST_CHANGE);
            }
        }
        else if (cmd == CommonEvent_1.default.GET_IPINFO_FAIL) {
            if (!UserModel_1.default.instance.isSceneBlack() && GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_BLACK_IP_FAIL_TYPE)) {
                // 原来不是黑名单，返回收到IP在黑名单之内。设置黑名单字段。并通知黑名单更新
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.WHITE_LIST_LOAD_IP_FAIL, {
                    openId: UserInfo_1.default.channelUserId,
                    rid: UserModel_1.default.instance.getUserRid()
                });
                SceneReference.setSceneBlack();
                Message_1.default.instance.send(CommonEvent_1.default.WHITE_LIST_CHANGE);
            }
        }
    }
    /**根据场景id获取场景名，没有则返回场景id */
    static getSceneName(sceneId) {
        var sceneName = sceneId || "noSceneId";
        if (this[sceneId]) {
            sceneName = this[sceneId];
        }
        return sceneName;
    }
    /**
     * 是否在白名单场景值
     */
    static isInBannerScene() {
        // 第一次查场景值添加监听事件。IP城市信息请求返回刷新黑名单状态
        Message_1.default.instance.add(CommonEvent_1.default.GET_IPINFO_SUCCESS, SceneReference.instance);
        Message_1.default.instance.add(CommonEvent_1.default.GET_IPINFO_FAIL, SceneReference.instance);
        LogsManager_1.default.echo("hlx scene 开始检查是否是白名单-----start");
        if (UserInfo_1.default.isWeb()) {
            LogsManager_1.default.echo("zm web版永远是白名单");
            return true;
        }
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_ALL_IN_WHITE_LIST)) {
            LogsManager_1.default.echo("hlx scene 全服白名单开关开启");
            return true;
        }
        if (UserExtCommonModel_1.default.instance.getTestSceneMark()) {
            LogsManager_1.default.echo("hlx scene 测试用户永远是白名单");
            return true;
        }
        // 注册白名单
        if (!SceneReference.checkWhiteSceneId(Global_1.default.sceneId, WhiteListFunc_1.default.TYPE_REGISTER)) {
            LogsManager_1.default.echo("hlx scene 账号不在注册白名单,Global.sceneId：", Global_1.default.sceneId);
            return false;
        }
        // 注册黑名单
        if (UserInfo_1.default.isNewAccount && this.checkQueryBlack()) {
            LogsManager_1.default.echo("hlx scene 账号在Query黑名单中");
            return false;
        }
        // 登陆黑名单
        if (UserModel_1.default.instance.isSceneBlack()) {
            LogsManager_1.default.echo("hlx scene 账号不在登陆白名单,userModel.sceneBlack：", UserModel_1.default.instance.isSceneBlack());
            return false;
        }
        LogsManager_1.default.echo("hlx scene 检查白名单结束-----白名单用户");
        return true;
    }
    /**
         * 检查登陆黑名单
         */
    static checkIpBlack() {
        if (UserModel_1.default.instance.isSceneBlack()) {
            LogsManager_1.default.echo("ycn 检查Ip黑名单： 账号已被染黑");
            return true;
        }
        if (UserInfo_1.default.platform.cityName) {
            var cityNames = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_BLACK_IP_CITY).split("|");
            if (cityNames) {
                for (var blackCityName of cityNames) {
                    if (blackCityName != "") {
                        if (UserInfo_1.default.platform.cityName.search(blackCityName) != -1) {
                            LogsManager_1.default.echo("hlx 检查Ip黑名单：染黑", UserInfo_1.default.platform.cityName, " ", blackCityName);
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    /**
     * 检查是否在Query白名单中
     */
    static checkQueryBlack() {
        if (UserModel_1.default.instance.isSceneBlack()) {
            LogsManager_1.default.echo("ycn 检查query白名单： 账号已被染黑");
            return true;
        }
        // 非微信平台不检查Query白名单
        if (!UserInfo_1.default.isWX()) {
            return false;
        }
        var blackenStr = GlobalParamsFunc_1.default.instance.getCfgDatas("GlobalParams_json", 'whiteListString', true);
        if (!blackenStr.string) {
            LogsManager_1.default.echo('hlx 检查Query白名单，通过：whiteListString未配置');
            return false;
        }
        var launchOptions = UserInfo_1.default.platform.getLaunchOptions();
        if (!launchOptions.query) {
            LogsManager_1.default.warn('hlx 检查Query白名单，通过：launchOptions.query 未获取到');
            return false;
        }
        LogsManager_1.default.echo("ycn scene query:", JSON.stringify(launchOptions.query), ' whiteListString：', blackenStr.string);
        for (var keyword in launchOptions.query) {
            if (keyword.search(blackenStr.string) != -1) {
                LogsManager_1.default.echo("hlx 检查Query白名单，通过, query:", keyword);
                return false;
            }
        }
        // 设置黑名单
        this.setSceneBlack();
        return true;
    }
    static setSceneBlack() {
        var updateData = {
            "sceneBlack": 1,
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, updateData, null);
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**
     * 检查场景值是否在白名单
     * @param sceneId 场景值
     * @param type 1 注册 2 登陆
     */
    static checkWhiteSceneId(sceneId, type) {
        var sceneWhiteList = WhiteListFunc_1.default.instance.getWhiteList(type);
        // 没有配置白名单。所有banner放行
        if (sceneWhiteList.length == 0 && !UserInfo_1.default.isWeb()) {
            LogsManager_1.default.echo("zm noWhiteList sceneId:", sceneId);
            return true;
        }
        else {
            LogsManager_1.default.echo("krma. bannerScene:", sceneWhiteList.length);
            if (sceneId) {
                if (sceneWhiteList.indexOf(String(Number(sceneId))) != -1) {
                    LogsManager_1.default.echo("zm find sceneId:", sceneId);
                    return true;
                }
            }
            LogsManager_1.default.echo("zm noFind sceneId:", sceneId);
            return false;
        }
    }
}
exports.default = SceneReference;
SceneReference["1001"] = "发现栏小程序主入口，「最近使用」列表"; //（基础库2.2.4版本起包含「我的小程序」列表）
SceneReference["1005"] = "微信首页顶部搜索框的搜索结果页";
SceneReference["1006"] = "发现栏小程序主入口搜索框的搜索结果页";
SceneReference["1007"] = "单人聊天会话中的小程序消息卡片";
SceneReference["1008"] = "群聊会话中的小程序消息卡片";
SceneReference["1011"] = "扫描二维码";
SceneReference["1012"] = "长按图片识别二维码";
SceneReference["1013"] = "扫描手机相册中选取的二维码";
SceneReference["1014"] = "小程序模板消息";
SceneReference["1017"] = "前往小程序体验版的入口页";
SceneReference["1019"] = "微信钱包"; //（微信客户端7.0.0版本改为支付入口）
SceneReference["1020"] = "公众号 profile 页相关小程序列表"; //appId含义: 来源公众号
SceneReference["1022"] = "聊天顶部置顶小程序入口"; //（微信客户端6.6.1版本起废弃）
SceneReference["1023"] = "安卓系统桌面图标";
SceneReference["1024"] = "小程序 profile 页";
SceneReference["1025"] = "扫描一维码";
SceneReference["1026"] = "发现栏小程序主入口，「附近的小程序」列表";
SceneReference["1027"] = "微信首页顶部搜索框搜索结果页「使用过的小程序」列表";
SceneReference["1028"] = "我的卡包";
SceneReference["1029"] = "小程序中的卡券详情页";
SceneReference["1030"] = "自动化测试下打开小程序";
SceneReference["1031"] = "长按图片识别一维码";
SceneReference["1032"] = "扫描手机相册中选取的一维码";
SceneReference["1034"] = "微信支付完成页";
SceneReference["1035"] = "公众号自定义菜单"; //appId含义: 来源公众号
SceneReference["1036"] = "App 分享消息卡片"; //appId含义: 来源APP
SceneReference["1037"] = "小程序打开小程序"; //appId含义: 来源小程序
SceneReference["1038"] = "从另一个小程序返回"; //appId含义: 来源小程序
SceneReference["1039"] = "摇电视";
SceneReference["1042"] = "添加好友搜索框的搜索结果页";
SceneReference["1043"] = "公众号模板消息"; //appId含义: 来源公众号
SceneReference["1044"] = "带 shareTicket 的小程序消息卡片";
SceneReference["1045"] = "朋友圈广告";
SceneReference["1046"] = "朋友圈广告详情页";
SceneReference["1047"] = "扫描小程序码";
SceneReference["1048"] = "长按图片识别小程序码";
SceneReference["1049"] = "扫描手机相册中选取的小程序码";
SceneReference["1052"] = "卡券的适用门店列表";
SceneReference["1053"] = "搜一搜的结果页";
SceneReference["1054"] = "顶部搜索框小程序快捷入口"; //（微信客户端版本6.7.4起废弃）
SceneReference["1056"] = "聊天顶部音乐播放器右上角菜单";
SceneReference["1057"] = "钱包中的银行卡详情页";
SceneReference["1058"] = "公众号文章";
SceneReference["1059"] = "体验版小程序绑定邀请页";
SceneReference["1064"] = "微信首页连Wi-Fi状态栏";
SceneReference["1067"] = "公众号文章广告";
SceneReference["1068"] = "附近小程序列表广告"; //（已废弃）
SceneReference["1069"] = "移动应用";
SceneReference["1071"] = "钱包中的银行卡列表页";
SceneReference["1072"] = "二维码收款页面";
SceneReference["1073"] = "客服消息列表下发的小程序消息卡片";
SceneReference["1074"] = "公众号会话下发的小程序消息卡片";
SceneReference["1077"] = "摇周边";
SceneReference["1078"] = "微信连Wi-Fi成功提示页";
SceneReference["1079"] = "微信游戏中心";
SceneReference["1081"] = "客服消息下发的文字链";
SceneReference["1082"] = "公众号会话下发的文字链";
SceneReference["1084"] = "朋友圈广告原生页";
SceneReference["1089"] = "微信聊天主界面下拉，「最近使用」栏"; //（基础库2.2.4版本起包含「我的小程序」栏）
SceneReference["1090"] = "长按小程序右上角菜单唤出最近使用历史";
SceneReference["1091"] = "公众号文章商品卡片";
SceneReference["1092"] = "城市服务入口";
SceneReference["1095"] = "小程序广告组件";
SceneReference["1096"] = "聊天记录";
SceneReference["1097"] = "微信支付签约页";
SceneReference["1099"] = "页面内嵌插件";
SceneReference["1102"] = "公众号 profile 页服务预览";
SceneReference["1103"] = "发现栏小程序主入口，「我的小程序」列表"; //（基础库2.2.4版本起废弃）
SceneReference["1104"] = "微信聊天主界面下拉，「我的小程序」栏"; //（基础库2.2.4版本起废弃）
SceneReference["1129"] = "微信爬虫访问";
//# sourceMappingURL=SceneReference.js.map