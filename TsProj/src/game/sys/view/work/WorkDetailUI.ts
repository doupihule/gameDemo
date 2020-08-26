import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ui } from "../../../../ui/layaMaxUI";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import UserModel from "../../model/UserModel";
import TaskModel from "../../model/TaskModel";
import WorkRoleUI from "./WorkRoleUI";
import WorkCompanyUI from "./WorkCompanyUI";
import { ResourceShowUI } from "../main/ResourceShowUI";
import WorkModel from "../../model/WorkModel";
import Message from "../../../../framework/common/Message";
import WorkEvent from "../../event/WorkEvent";
import MainJumpReturnComp from "../../../../framework/platform/comp/MainJumpReturnComp";


export default class WorkDetailUI extends ui.gameui.work.WorkDetailUI implements IMessage {

    private workGroup;
    private companyGroup;
    private curTab = 0;
    private resouceShow;

    constructor() {
        super();
        this.addEvent();
        new ButtonUtils(this.btn_close, this.onCloseBtnClick, this);
        new ButtonUtils(this.workBtn, this.onClickChat, this);
        new ButtonUtils(this.companyBtn, this.onClickDaily, this);
        ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);
        ScreenAdapterTools.alignNotch(this.group_ctn, ScreenAdapterTools.Align_MiddleTop);
        this.resouceShow = new ResourceShowUI(this.coinNum, this.goldNum, null, null, this.addCoinBtn, this.addGoldBtn, null);
        this.group_ctn.height += ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth

    }
    /**添加事件监听 */
    addEvent() {
        Message.instance.add(WorkEvent.WORK_REPUTE_UPDATE, this)
        Message.instance.add(WorkEvent.WORK_RECEIVE_REDFRESH, this)

    }

    public setData(data): void {
        this.curTab = data && data.tab || 0;
        this.resouceShow.refreshMoney();
        var level = UserModel.instance.getMaxBattleLevel();
        this.onClickTab(this.curTab);
        this.freshCompanyRed()
        this.freshWorkRed()
        MainJumpReturnComp.instance.showJumpReturnBtn(this);

    }
    public freshCompanyRed() {
        this.redImg.visible = WorkModel.instance.getIsCanUpCompany();
    }
    public freshWorkRed() {
        var workInfo = WorkModel.instance.getWorkInfo();
        var isCanReceive = false;
        this.workRedImg.visible = false;
        for (var key in workInfo) {
            if (WorkModel.instance.getIsCanReceive(key)) {
                isCanReceive = true;
                this.workRedImg.visible = true;
                break;
            }
        }
    }
    private onClickTab(index) {
        this.workBtn.skin = (index == 0) ? "uisource/work/work/company_bt_gongzuo2.png" : "uisource/work/work/company_bt_gongzuo.png";
        this.companyBtn.skin = (index == 1) ? "uisource/work/work/company_bt_gongsishengji2.png" : "uisource/work/work/company_bt_gongsishengji1.png";
        if (index == 0) {
            this.setWorkGroup();
        } else {
            this.setCompanyGroup();
        }
    }
    //工作
    setWorkGroup() {
        if (!this.workGroup) {
            var res = WindowManager.getUILoadGroup(WindowCfgs.WorkRoleUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.workGroup = new WorkRoleUI(this);
                this.group_ctn.addChild(this.workGroup);
                this.workGroup.setData();
            }));
        } else {
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
            var res = WindowManager.getUILoadGroup(WindowCfgs.WorkCompanyUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.companyGroup = new WorkCompanyUI(this);
                this.group_ctn.addChild(this.companyGroup);
                this.companyGroup.setData();
            }));
        } else {
            this.companyGroup.visible = true;
            this.companyGroup.setData();
        }
        if (this.workGroup) {
            this.workGroup.visible = false;
        }
    }

    onClickChat() {
        if (this.curTab == 0) return;
        this.curTab = 0;
        this.onClickTab(this.curTab)
    }
    onClickDaily() {
        if (this.curTab == 1) return;
        this.curTab = 1;
        this.onClickTab(this.curTab)
    }
    onCloseBtnClick() {
        WindowManager.CloseUI(WindowCfgs.WorkDetailUI);
        this.close()
    }

    close() {
        this.workGroup && this.workGroup.close();
        this.companyGroup && this.companyGroup.close();
    }

    recvMsg(cmd: string, data: any): void {
        if (cmd == WorkEvent.WORK_REPUTE_UPDATE) {
            this.freshCompanyRed();
        } else if (cmd == WorkEvent.WORK_RECEIVE_REDFRESH) {
            this.freshWorkRed();
        }

    }
}


