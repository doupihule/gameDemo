"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const UserGlobalModel_1 = require("../../../../framework/model/UserGlobalModel");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const UserModel_1 = require("../../model/UserModel");
const DataResourceServer_1 = require("../../server/DataResourceServer");
const ResourceConst_1 = require("../../consts/ResourceConst");
const Message_1 = require("../../../../framework/common/Message");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const RedPointConst_1 = require("../../consts/RedPointConst");
class InviteListUI extends layaMaxUI_1.ui.gameui.share.InviteListUI {
    constructor(shareData) {
        super();
        //已经初始化按钮了
        this._hasInitBtn = false;
        this.itemHeight = 101;
        this.itemOffsetY = 5;
        this.shareData = shareData;
        this.initData();
    }
    initBtn() {
        if (this._hasInitBtn)
            return;
        this._hasInitBtn = true;
        new ButtonUtils_1.ButtonUtils(this.reward_btn, this.getReward, this);
    }
    //初始化
    initData() {
        this.initBtn();
        this.list_num.text = this.shareData.num;
        var rewardArr = this.shareData.invitingReward[0].split(",");
        this.rewardType = Number(rewardArr[0]);
        this.rewardNum = Number(rewardArr[1]);
        this.rewardImg.skin = ResourceConst_1.default.AIDDROP_DETAIL_ARR[this.rewardType];
        this.reward_num.text = "X" + StringUtils_1.default.getCoinStr(rewardArr[1]);
        this.reward_description.text = "邀请" + this.shareData.count + "个新玩家";
        this.initBtnStatus();
    }
    initBtnStatus() {
        var shareNum = Object.keys(UserGlobalModel_1.default.instance.getInviteInfo()).length;
        var gainStatus = UserModel_1.default.instance.getInviteRewardStatus(this.shareData.id);
        //已领取
        if (gainStatus) {
            this.reward_no_recive.visible = false;
            this.reward_has_recive.visible = true;
            this.dikuang.skin = "uisource/video/video/video_image_yilingqudi.png";
        }
        //未领取
        else {
            this.reward_no_recive.visible = true;
            this.reward_has_recive.visible = false;
            this.reward_progress.text = Math.min(shareNum, this.shareData.count) + "/" + this.shareData.count;
            this.dikuang.skin = "uisource/video/video/video_image_zuanshidi.png";
            if (shareNum < this.shareData.count) {
                this.reward_btn.gray = true;
            }
            else {
                this.reward_btn.gray = false;
            }
        }
    }
    getReward() {
        var shareNum = Object.keys(UserGlobalModel_1.default.instance.getInviteInfo()).length;
        if (shareNum < this.shareData.count) {
            WindowManager_1.default.ShowTip("人数不够哦！多邀请些小伙伴吧");
            return;
        }
        DataResourceServer_1.default.getInviteReward({ "id": this.shareData.id, "reward": [this.rewardType, this.rewardNum] }, () => {
            this.initBtnStatus();
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_INVITEFRIEND);
        }, this);
    }
    close() {
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = InviteListUI;
//# sourceMappingURL=InviteListUI.js.map