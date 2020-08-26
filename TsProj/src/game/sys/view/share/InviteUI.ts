import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import InviteFunc from "../../func/InviteFunc";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import InviteListUI from "./InviteListUI";
import UserGlobalModel from "../../../../framework/model/UserGlobalModel";
import UserModel from "../../model/UserModel";
import LogsManager from "../../../../framework/manager/LogsManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";


export default class InviteUI extends ui.gameui.share.InviteUI implements IMessage {

    private shareData;

    constructor() {
        super();
        this.initBtn();
        this.addEvent();
    }
    initBtn() {
        new ButtonUtils(this.closeBtn, this.exitInvite, this);
        new ButtonUtils(this.shareBtn, this.shareInvite, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
    }
    addEvent() {

    }
    setData() {
        BannerAdManager.addBannerQuick(this);
        AdVideoManager.instance.showInterstitialAdById( PlaqueConst.Plaque_Invite, this);
        this.sharePanel.vScrollBarSkin = "";
        //初始化
        this.initData();

        //拉取最新邀请信息,重新渲染页面
        var shareNum = Object.keys(UserGlobalModel.instance.getInviteInfo()).length;
        UserGlobalModel.instance.flushGlobalData((shareNum) => {
            var newShareNum = Object.keys(UserGlobalModel.instance.getInviteInfo()).length;
            if (shareNum != newShareNum) {
                // 分享数变化才刷新界面
                this.initData();
            }
        }, this, shareNum);
    }
    initData() {
        var data = InviteFunc.instance.getAll();
        var inviteData = [];
        var i = 1;
        for (var count in data) {
            data[count]["num"] = i;
            i++;
            inviteData.push(data[count]);
        }
        this.shareData = inviteData;

        var res = WindowManager.getUILoadGroup(WindowCfgs.InviteListUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initPanelData));
    }
    initPanelData() {
        this.sharePanel.removeChildren();
        for (var i = 0; i < this.shareData.length; i++) {
            var shareItem: InviteListUI = new InviteListUI(this.shareData[i]);
            shareItem.x = 0;
            shareItem.y = i * (shareItem.height + 5);
            this.sharePanel.addChild(shareItem);
        }
        var index = UserModel.instance.getFirstNoGetInviteReward();
        this.sharePanel.vScrollBar.setScroll(0, this.shareData.length * (shareItem.height + 5), (index - 1) * (shareItem.height + 5));
    }
    exitInvite() {
        this.close();
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.InviteUI);
    }
    shareInvite() {
        ShareOrTvManager.instance.shareOrTv(null, ShareOrTvManager.TYPE_SHARE, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);
    }
    successCall() {

    }
    closeCall() {

    }
    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}