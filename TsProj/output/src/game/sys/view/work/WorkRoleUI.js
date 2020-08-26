"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const WorkFunc_1 = require("../../func/WorkFunc");
const WorkModel_1 = require("../../model/WorkModel");
const WorkServer_1 = require("../../server/WorkServer");
const Client_1 = require("../../../../framework/common/kakura/Client");
const GameUtils_1 = require("../../../../utils/GameUtils");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const WorkInfoItemUI_1 = require("./WorkInfoItemUI");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
class WorkRoleUI extends layaMaxUI_1.ui.gameui.work.WorkRoleUI {
    constructor(workDetail) {
        super();
        this.isSendServer = false;
        this.timeArr = [];
        this.addEvent();
        this.workGroup.vScrollBarSkin = "";
        this.workGroup.height += ScreenAdapterTools_1.default.height - ScreenAdapterTools_1.default.designHeight - ScreenAdapterTools_1.default.toolBarWidth;
        new ButtonUtils_1.ButtonUtils(this.freshBtn, this.onClickFresh, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.isSendServer = false;
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.WORK_OPEN);
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_WORK_FRESH);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_WORKFRESH_SHOW);
        }
        if (this.freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.freeImg.skin = ShareOrTvManager_1.default.instance.getFreeImgSkin(this.freeType);
        }
        this.workVideoMaxTime = GlobalParamsFunc_1.default.instance.getDataNum("workVideoMaxTime");
        this.workTimePrice = GlobalParamsFunc_1.default.instance.getDataNum("workTimePrice") / 3600;
        this.setFreshWork();
    }
    setFreshWork() {
        this.companyCfg = WorkFunc_1.default.instance.getCfgDatas("CompanyUpdate", WorkModel_1.default.instance.getCompanyLevel());
        this.companyLevelTxt.text = WorkModel_1.default.instance.getCompanyLevel() + "";
        this.commissionTxt.text = this.companyCfg.commissionAdd / 100 + "%";
        var isFresh = WorkModel_1.default.instance.getIsExpire();
        if (isFresh) {
            if (!this.isSendServer) {
                this.isSendServer = true;
                WorkServer_1.default.updateWorkInfo({}, this.freshWorkInfo, this);
            }
        }
        else {
            this.freshWorkInfo();
        }
    }
    freshWorkInfo() {
        this.timeArr = [];
        this.setTitle();
        this.initData();
    }
    freshTxt() {
        /**获取是否过期 */
        var clientTime = Client_1.default.instance.serverTime;
        var expireTime = WorkModel_1.default.instance.getExpireTime();
        var offest = expireTime - clientTime;
        this.leftTxt.changeText(GameUtils_1.default.convertTime(offest));
        if (offest < 0) {
            this.setFreshWork();
            TimerManager_1.default.instance.removeByObject(this);
        }
        this.freshItem();
    }
    freshItem() {
        for (var i = this.timeArr.length - 1; i >= 0; i--) {
            var item = this.timeArr[i];
            item.freshCd();
        }
    }
    setTitle() {
        TimerManager_1.default.instance.removeByObject(this);
        TimerManager_1.default.instance.add(this.freshTxt, this, 1000);
        this.freshTxt();
    }
    initData() {
        this.roleInfo = WorkModel_1.default.instance.getWorkInfo();
        var length = this.workGroup.numChildren;
        for (var i = 0; i < length; i++) {
            this.workGroup.getChildAt(i).visible = false;
        }
        var index = 0;
        for (var key in this.roleInfo) {
            var roleItem;
            roleItem = this.workGroup.getChildAt(index);
            if (!roleItem) {
                roleItem = new WorkInfoItemUI_1.default(this);
                roleItem.y = this.workGroup.numChildren * 376;
                this.workGroup.addChild(roleItem);
            }
            roleItem.visible = true;
            roleItem.setData(this.roleInfo[key]);
            index += 1;
        }
    }
    freshAllItemState() {
        for (var i = 0; i < this.workGroup.numChildren; i++) {
            var item = this.workGroup.getChildAt(i);
            item.initData();
        }
    }
    /**点击刷新 */
    onClickFresh() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_WORKFRESH_CLICK);
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_WORK_FRESH, ShareOrTvManager_1.default.TYPE_ADV, { id: 1, extraData: {} }, this.succCall, null, this);
    }
    succCall() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_WORKFRESH_FINISH);
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_WORKFRESH_FINISH);
        }
        WorkServer_1.default.updateWorkInfo({}, this.freshWorkInfo, this);
    }
    recvMsg(cmd, data) {
    }
    close() {
        TimerManager_1.default.instance.removeByObject(this);
    }
}
exports.default = WorkRoleUI;
//# sourceMappingURL=WorkRoleUI.js.map