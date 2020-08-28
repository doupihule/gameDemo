"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const ResourceConst_1 = require("../../consts/ResourceConst");
const DataResourceServer_1 = require("../../server/DataResourceServer");
class BoxInfoUI extends layaMaxUI_1.ui.gameui.main.BoxInfoUI {
    constructor() {
        super();
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickCLose, this);
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onClickReceive, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.callBack = data.callBack;
        this.thisObj = data.thisObj;
        this.item = data.item;
        this.isCanReceive = data.isCanReceive;
        //领取按钮状态
        if (this.isCanReceive) {
            this.receiveBtn.gray = false;
        }
        else {
            this.receiveBtn.gray = true;
        }
        //界面初始化
        this.initView();
    }
    initView() {
        var reward = this.item.reward[0].split(",");
        this.rewardImg.skin = ResourceConst_1.default.AIDDROP_DETAIL_ARR[Number(reward[0])];
        this.rewardCount.changeText(StringUtils_1.default.getCoinStr(reward[1]));
        this.desTxt.changeText("转动转盘累计" + this.item.count + "次可领取");
    }
    //linguistic宝箱奖励
    onClickReceive() {
        if (this.isCanReceive) {
            var rewardInfo = this.item.reward[0].split(",");
            DataResourceServer_1.default.getBoxReward({ "reward": this.item.reward, "index": this.item.index }, () => {
                this.callBack && this.callBack.call(this.thisObj);
                var rewardInfo = this.item.reward[0].split(",");
                if (Number(rewardInfo[0]) == GlobalParamsFunc_1.default.coin) {
                    WindowManager_1.default.ShowTip("获得金币 x" + rewardInfo[1]);
                }
                if (Number(rewardInfo[0]) == GlobalParamsFunc_1.default.gold) {
                    WindowManager_1.default.ShowTip("获得钻石 x" + rewardInfo[1]);
                }
                WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BoxInfoUI);
            }, this);
        }
    }
    onClickCLose() {
        this.callBack && this.callBack.call(this.thisObj);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BoxInfoUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = BoxInfoUI;
//# sourceMappingURL=BoxInfoUI.js.map