"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const UserInfo_1 = require("../../../framework/common/UserInfo");
const StatisticsManager_1 = require("./StatisticsManager");
const StatisticsCommonConst_1 = require("../../../framework/consts/StatisticsCommonConst");
const UserGlobalModel_1 = require("../../../framework/model/UserGlobalModel");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../consts/WindowCfgs");
const Message_1 = require("../../../framework/common/Message");
const FrameWorkEvent_1 = require("../../../framework/event/FrameWorkEvent");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const BattleFunc_1 = require("../func/BattleFunc");
const BattleConst_1 = require("../consts/BattleConst");
const SoundManager_1 = require("../../../framework/manager/SoundManager");
const SwitchModel_1 = require("../model/SwitchModel");
//主要用来处理框架相关不同的逻辑每个游戏独立维护,比如分享不一样的地方.  进入主界面不一样的地方
class FrameWorkHandle {
    //初始化函数. 需要侦听事件.每个游戏单独处理
    constructor() {
        //监听进入主界面消息
        Message_1.default.instance.add(FrameWorkEvent_1.default.FRAMEWORKEVENT_STARTENTERMAIN, this);
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new FrameWorkHandle();
        }
        return this._instance;
    }
    static init() {
        if (!this._instance) {
            this._instance = new FrameWorkHandle();
        }
    }
    //针对游戏单独处理
    onStartEnterGameMain() {
        SoundManager_1.default.setSoundVolume(SwitchModel_1.default.instance.getSwitchByType(SwitchModel_1.default.sound_switch));
        SoundManager_1.default.setMusicVol(SwitchModel_1.default.instance.getSwitchByType(SwitchModel_1.default.music_switch));
        if (UserInfo_1.default.platform.shareLinkParams && UserInfo_1.default.platform.shareLinkParams.contentId) {
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.SHARE_CLICK_ENTER, { contentId: UserInfo_1.default.platform.shareLinkParams.contentId });
        }
        if (UserInfo_1.default.platform.shareLinkParams && UserInfo_1.default.platform.shareLinkParams.inviterRid) {
            if (UserInfo_1.default.platform.shareLinkParams.inviterRid != UserModel_1.default.instance.getUserRid()) {
                // 新老用户均设置数据
                UserGlobalModel_1.default.setInviteUser(UserInfo_1.default.platform.shareLinkParams.inviterRid);
                var shareAddNum = GlobalParamsFunc_1.default.instance.getDataNum("shareTruePlayerNmb");
                UserGlobalModel_1.default.setOtherShareNum(UserInfo_1.default.platform.shareLinkParams.inviterRid, shareAddNum);
            }
        }
        var guideStep = UserModel_1.default.instance.getMainGuide();
        //如果没有引导进度信息并且当前最高关卡是0 进入引导
        if (guideStep == 0 && !UserModel_1.default.instance.getMaxBattleLevel()) {
            BattleFunc_1.default.curBattleType = BattleConst_1.default.BATTLETYPE_NORMAL;
            var cartoonSwitch = GlobalParamsFunc_1.default.instance.getDataNum("cartoonSwitch");
            if (cartoonSwitch) {
                WindowManager_1.default.SwitchUIFromLoading(WindowCfgs_1.WindowCfgs.CartoonPicUI, WindowCfgs_1.WindowCfgs.LoginUI);
            }
            else {
                WindowManager_1.default.SwitchUIFromLoading(WindowCfgs_1.WindowCfgs.BattleUI, { name: "1-1", levelId: 1 });
            }
        }
        else {
            WindowManager_1.default.SwitchUIFromLoading(WindowCfgs_1.WindowCfgs.GameMainUI, WindowCfgs_1.WindowCfgs.LoginUI);
        }
    }
    //当判断是否分享成功. 不同项目自己扩展重写
    onCheckShareSucess(distime, shareExtraData) {
        // 分享是否成功
        var shareResult = false;
        if (UserInfo_1.default.platform._shareNoWait || distime >= 3000) {
            // 该分享不检查是否分享成功或者分享时长大于3秒
            shareResult = true;
        }
        if (shareResult) {
            UserInfo_1.default.platform.onShareComplete(true);
        }
        else {
            //根据不同游戏自己做判断
            var failHandleType = GlobalParamsFunc_1.default.instance.shareHandleType;
            if (failHandleType == 1) {
                WindowManager_1.default.ShowTip("分享失败，请稍后再试");
                UserInfo_1.default.platform.onShareComplete(false);
            }
            else if (failHandleType == 2) {
                UserInfo_1.default.platform.showPopTip("提示", TranslateFunc_1.default.shareTranslateArr[Math.floor(Math.random() * TranslateFunc_1.default.shareTranslateArr.length)], {
                    confirmText: TranslateFunc_1.default.shareLabTranslate,
                    success(res) {
                        if (res.confirm) {
                            LogsManager_1.default.echo('用户点击确定,再次拉起分享');
                            //再次拉起分享
                            UserInfo_1.default.platform.share(UserInfo_1.default.platform._shareId, UserInfo_1.default.platform._shareExtraData, UserInfo_1.default.platform._shareCallback, UserInfo_1.default.platform._shareThisObj);
                        }
                        else if (res.cancel) {
                            LogsManager_1.default.echo("用户取消了再次分享");
                            UserInfo_1.default.platform.onShareComplete(false);
                        }
                    }
                });
            }
        }
    }
    //接受消息
    recvMsg(cmd, data) {
        if (cmd == FrameWorkEvent_1.default.FRAMEWORKEVENT_STARTENTERMAIN) {
            this.onStartEnterGameMain();
        }
    }
}
exports.default = FrameWorkHandle;
//# sourceMappingURL=FrameWorkHandle.js.map