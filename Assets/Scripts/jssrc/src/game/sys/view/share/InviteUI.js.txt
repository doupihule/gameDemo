"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const InviteFunc_1 = require("../../func/InviteFunc");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const InviteListUI_1 = require("./InviteListUI");
const UserGlobalModel_1 = require("../../../../framework/model/UserGlobalModel");
const UserModel_1 = require("../../model/UserModel");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
class InviteUI extends layaMaxUI_1.ui.gameui.share.InviteUI {
    constructor() {
        super();
        this.initBtn();
        this.addEvent();
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.exitInvite, this);
        new ButtonUtils_1.ButtonUtils(this.shareBtn, this.shareInvite, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
    }
    addEvent() {
    }
    setData() {
        BannerAdManager_1.default.addBannerQuick(this);
        AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_Invite, this);
        this.sharePanel.vScrollBarSkin = "";
        //初始化
        this.initData();
        //拉取最新邀请信息,重新渲染页面
        var shareNum = Object.keys(UserGlobalModel_1.default.instance.getInviteInfo()).length;
        UserGlobalModel_1.default.instance.flushGlobalData((shareNum) => {
            var newShareNum = Object.keys(UserGlobalModel_1.default.instance.getInviteInfo()).length;
            if (shareNum != newShareNum) {
                // 分享数变化才刷新界面
                this.initData();
            }
        }, this, shareNum);
    }
    initData() {
        var data = InviteFunc_1.default.instance.getAll();
        var inviteData = [];
        var i = 1;
        for (var count in data) {
            data[count]["num"] = i;
            i++;
            inviteData.push(data[count]);
        }
        this.shareData = inviteData;
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.InviteListUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initPanelData));
    }
    initPanelData() {
        this.sharePanel.removeChildren();
        for (var i = 0; i < this.shareData.length; i++) {
            var shareItem = new InviteListUI_1.default(this.shareData[i]);
            shareItem.x = 0;
            shareItem.y = i * (shareItem.height + 5);
            this.sharePanel.addChild(shareItem);
        }
        var index = UserModel_1.default.instance.getFirstNoGetInviteReward();
        this.sharePanel.vScrollBar.setScroll(0, this.shareData.length * (shareItem.height + 5), (index - 1) * (shareItem.height + 5));
    }
    exitInvite() {
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.InviteUI);
    }
    shareInvite() {
        ShareOrTvManager_1.default.instance.shareOrTv(null, ShareOrTvManager_1.default.TYPE_SHARE, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);
    }
    successCall() {
    }
    closeCall() {
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = InviteUI;
//# sourceMappingURL=InviteUI.js.map