"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const UserModel_1 = require("../../model/UserModel");
const WorkRoleUI_1 = require("./WorkRoleUI");
const WorkCompanyUI_1 = require("./WorkCompanyUI");
const ResourceShowUI_1 = require("../main/ResourceShowUI");
const WorkModel_1 = require("../../model/WorkModel");
const Message_1 = require("../../../../framework/common/Message");
const WorkEvent_1 = require("../../event/WorkEvent");
const MainJumpReturnComp_1 = require("../../../../framework/platform/comp/MainJumpReturnComp");
class WorkDetailUI extends layaMaxUI_1.ui.gameui.work.WorkDetailUI {
    constructor() {
        super();
        this.curTab = 0;
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.onCloseBtnClick, this);
        new ButtonUtils_1.ButtonUtils(this.workBtn, this.onClickChat, this);
        new ButtonUtils_1.ButtonUtils(this.companyBtn, this.onClickDaily, this);
        ScreenAdapterTools_1.default.alignNotch(this.topGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
        ScreenAdapterTools_1.default.alignNotch(this.group_ctn, ScreenAdapterTools_1.default.Align_MiddleTop);
        this.resouceShow = new ResourceShowUI_1.ResourceShowUI(this.coinNum, this.goldNum, null, null, this.addCoinBtn, this.addGoldBtn, null);
        this.group_ctn.height += ScreenAdapterTools_1.default.height - ScreenAdapterTools_1.default.designHeight - ScreenAdapterTools_1.default.toolBarWidth;
    }
    /**添加事件监听 */
    addEvent() {
        Message_1.default.instance.add(WorkEvent_1.default.WORK_REPUTE_UPDATE, this);
        Message_1.default.instance.add(WorkEvent_1.default.WORK_RECEIVE_REDFRESH, this);
    }
    setData(data) {
        this.curTab = data && data.tab || 0;
        this.resouceShow.refreshMoney();
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        this.onClickTab(this.curTab);
        this.freshCompanyRed();
        this.freshWorkRed();
        MainJumpReturnComp_1.default.instance.showJumpReturnBtn(this);
    }
    freshCompanyRed() {
        this.redImg.visible = WorkModel_1.default.instance.getIsCanUpCompany();
    }
    freshWorkRed() {
        var workInfo = WorkModel_1.default.instance.getWorkInfo();
        var isCanReceive = false;
        this.workRedImg.visible = false;
        for (var key in workInfo) {
            if (WorkModel_1.default.instance.getIsCanReceive(key)) {
                isCanReceive = true;
                this.workRedImg.visible = true;
                break;
            }
        }
    }
    onClickTab(index) {
        this.workBtn.skin = (index == 0) ? "uisource/work/work/company_bt_gongzuo2.png" : "uisource/work/work/company_bt_gongzuo.png";
        this.companyBtn.skin = (index == 1) ? "uisource/work/work/company_bt_gongsishengji2.png" : "uisource/work/work/company_bt_gongsishengji1.png";
        if (index == 0) {
            this.setWorkGroup();
        }
        else {
            this.setCompanyGroup();
        }
    }
    //工作
    setWorkGroup() {
        if (!this.workGroup) {
            var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.WorkRoleUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.workGroup = new WorkRoleUI_1.default(this);
                this.group_ctn.addChild(this.workGroup);
                this.workGroup.setData();
            }));
        }
        else {
            this.workGroup.visible = true;
            this.workGroup.setData();
        }
        if (this.companyGroup) {
            this.companyGroup.visible = false;
        }
    }
    //公司
    setCompanyGroup() {
        if (!this.companyGroup) {
            var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.WorkCompanyUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.companyGroup = new WorkCompanyUI_1.default(this);
                this.group_ctn.addChild(this.companyGroup);
                this.companyGroup.setData();
            }));
        }
        else {
            this.companyGroup.visible = true;
            this.companyGroup.setData();
        }
        if (this.workGroup) {
            this.workGroup.visible = false;
        }
    }
    onClickChat() {
        if (this.curTab == 0)
            return;
        this.curTab = 0;
        this.onClickTab(this.curTab);
    }
    onClickDaily() {
        if (this.curTab == 1)
            return;
        this.curTab = 1;
        this.onClickTab(this.curTab);
    }
    onCloseBtnClick() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.WorkDetailUI);
        this.close();
    }
    close() {
        this.workGroup && this.workGroup.close();
        this.companyGroup && this.companyGroup.close();
    }
    recvMsg(cmd, data) {
        if (cmd == WorkEvent_1.default.WORK_REPUTE_UPDATE) {
            this.freshCompanyRed();
        }
        else if (cmd == WorkEvent_1.default.WORK_RECEIVE_REDFRESH) {
            this.freshWorkRed();
        }
    }
}
exports.default = WorkDetailUI;
//# sourceMappingURL=WorkDetailUI.js.map