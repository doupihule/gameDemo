import IMessage from "../../interfaces/IMessage";
import { ui } from "../../../../ui/layaMaxUI";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import UserModel from "../../model/UserModel";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import BattleFunc from "../../func/BattleFunc";
import TaskChatFunc from "../../func/TaskChatFunc";
import TaskFunc from "../../func/TaskFunc";
import TaskModel from "../../model/TaskModel";
import TaskConditionTrigger from "../../trigger/TaskConditionTrigger";
import TaskConst from "../../consts/TaskConst";
import { stat } from "fs";
import ChatInfoModel from "../../model/ChatInfoModel";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import WorkFunc from "../../func/WorkFunc";
import WorkModel from "../../model/WorkModel";
import WorkServer from "../../server/WorkServer";
import WorkRoleItemUI from "./WorkRoleItemUI";
import FogFunc from "../../func/FogFunc";
import Client from "../../../../framework/common/kakura/Client";
import GameUtils from "../../../../utils/GameUtils";
import TimerManager from "../../../../framework/manager/TimerManager";
import WorkConst from "../../consts/WorkConst";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import WorkInfoItemUI from "./WorkInfoItemUI";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import StatisticsManager from "../../manager/StatisticsManager";


export default class WorkRoleUI extends ui.gameui.work.WorkRoleUI implements IMessage {

    private allInfo: any[];
    private listData: any[];
    public roleInfo: any;
    private isSendServer = false;
    public companyCfg;
    //视频加速的最大时长
    public workVideoMaxTime;
    //每秒消耗钻石数
    public workTimePrice;
    public timeArr = [];
    private freeType;
    constructor(workDetail) {
        super();
        this.addEvent();
        this.workGroup.vScrollBarSkin = ""
        this.workGroup.height += ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth
        new ButtonUtils(this.freshBtn, this.onClickFresh, this);

    }
    /**添加事件监听 */
    addEvent() {
    }

    public setData(data): void {
        this.isSendServer = false;
        StatisticsManager.ins.onEvent(StatisticsManager.WORK_OPEN)
        this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_WORK_FRESH);
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_WORKFRESH_SHOW)
        }
        if (this.freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
            this.freeImg.skin = ShareOrTvManager.instance.getFreeImgSkin(this.freeType)
        }
        this.workVideoMaxTime = GlobalParamsFunc.instance.getDataNum("workVideoMaxTime");
        this.workTimePrice = GlobalParamsFunc.instance.getDataNum("workTimePrice") / 3600;
        this.setFreshWork();
    }
    setFreshWork() {
        this.companyCfg = WorkFunc.instance.getCfgDatas("CompanyUpdate", WorkModel.instance.getCompanyLevel())
        this.companyLevelTxt.text = WorkModel.instance.getCompanyLevel() + ""
        this.commissionTxt.text = this.companyCfg.commissionAdd / 100 + "%"
        var isFresh = WorkModel.instance.getIsExpire();
        if (isFresh) {
            if (!this.isSendServer) {
                this.isSendServer = true;
                WorkServer.updateWorkInfo({}, this.freshWorkInfo, this)
            }
        } else {
            this.freshWorkInfo()
        }
    }
    freshWorkInfo() {
        this.timeArr = [];
        this.setTitle()
        this.initData()
    }
    freshTxt() {
        /**获取是否过期 */
        var clientTime = Client.instance.serverTime;
        var expireTime = WorkModel.instance.getExpireTime();
        var offest = expireTime - clientTime;
        this.leftTxt.changeText(GameUtils.convertTime(offest))
        if (offest < 0) {
            this.setFreshWork();
            TimerManager.instance.removeByObject(this);
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
        TimerManager.instance.removeByObject(this);
        TimerManager.instance.add(this.freshTxt, this, 1000);
        this.freshTxt();
    }
    initData() {
        this.roleInfo = WorkModel.instance.getWorkInfo();
        var length = this.workGroup.numChildren
        for (var i = 0; i < length; i++) {
            (this.workGroup.getChildAt(i) as Laya.Image).visible = false;
        }
        var index = 0;
        for (var key in this.roleInfo) {
            var roleItem;
            roleItem = this.workGroup.getChildAt(index);
            if (!roleItem) {
                roleItem = new WorkInfoItemUI(this);
                roleItem.y = this.workGroup.numChildren * 376;
                this.workGroup.addChild(roleItem);
            }
            roleItem.visible = true;
            roleItem.setData(this.roleInfo[key]);
            index += 1;
        }
    }
    public freshAllItemState() {
        for (var i = 0; i < this.workGroup.numChildren; i++) {
            var item = this.workGroup.getChildAt(i) as WorkInfoItemUI;
            item.initData()
        }
    }

    /**点击刷新 */
    onClickFresh() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_WORKFRESH_CLICK)
        }
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_WORK_FRESH, ShareOrTvManager.TYPE_ADV, { id: 1, extraData: {} }, this.succCall, null, this)

    }
    succCall() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_WORKFRESH_FINISH)
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_WORKFRESH_FINISH)
        }
        WorkServer.updateWorkInfo({}, this.freshWorkInfo, this)

    }

    recvMsg(cmd: string, data: any): void {


    }
    close() {
        TimerManager.instance.removeByObject(this);
    }
}


