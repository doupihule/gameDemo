import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import FogFunc from "../../func/FogFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import GameUtils from "../../../../utils/GameUtils";
import FogServer from "../../server/FogServer";
import { DataResourceType } from "../../func/DataResourceFunc";
import FogConst from "../../consts/FogConst";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import FogEventData from "../../../fog/data/FogEventData";
import FogInstanceCell from "../../../fog/instance/FogInstanceCell";
import FogModel from "../../model/FogModel";
import LogsManager from "../../../../framework/manager/LogsManager";
import BattleFunc from "../../func/BattleFunc";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";



export default class FogMultiRewardUI extends ui.gameui.fog.FogMultiRewardUI implements IMessage {

    private itemArr;//奖励数组
    private viewType;//页面类型:必传参数
    private eventInfo;//事件cfg
    private isShowItemLab = true;//是否显示item的lab
    private callBack;
    private thisObj;
    private isFinish = false;//事件是否完成

    //格子事件
    private events: FogEventData
    //格子
    private cell: FogInstanceCell;
    constructor() {
        super();
        new ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils(this.receiveBtn, this.onClickReceive, this);
    }

    public setData(data) {
        BannerAdManager.addBannerQuick(this);
        BannerAdManager.addTopBannerStyleJump(this);
        this.itemArr = [];
        this.viewType = data.viewType;
        this.isFinish = false;

        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.isShowItemLab = false;

        this.cell = data && data.cell;

        //奖励事件需要传入的参数：eventId,viewType
        if (data.event) {
            this.events = data.event;
            this.eventInfo = this.events.cfgData;

            if (this.events.eventData && this.events.eventData.reward && Object.keys(this.events.eventData.reward).length != 0) {
                this.itemArr = FogFunc.instance.vertRewardTableToArr(this.events.eventData.reward);
            } else {
                var params = this.eventInfo.params;
                var dropId;
                var dropArr;
                for (var i = 0; i < params.length; i++) {
                    dropId = params[i][0];
                    dropArr = FogFunc.instance.getDropGroupReward(dropId);
                    this.itemArr.push(GameUtils.getWeightItem(dropArr));
                }
                //保存事件随机出的奖励
                FogServer.addCellEvent({ cellId: this.cell.mySign, rewardArr: this.itemArr, id: this.events.eventId }, null, null);

            }

            this.isShowItemLab = true;


        }

        //宝箱奖励需要传入的参数：reward(奖励数组),viewType
        if (data.reward) {
            this.itemArr = data.reward;
            this.isShowItemLab = true;
        }

        //标题初始化
        this.initTitle();
        //奖励列表初始化
        this.initReward();
    }
    initTitle() {
        this.descGroup.visible = false;

        if (this.viewType == FogConst.VIEW_TYPE_REWARD_EVENT) {
            this.descGroup.visible = true;
            this.compImg.visible = false;
            this.itemList.y = 108;
            this.descGroup.y = 42;
            this.lbl_desc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc, "TranslateEvent");
            this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
            if (this.eventInfo.id == "3003" && GuideManager.ins.recentGuideId == GuideConst.GUIDE_9_901) {
                this.closeBtn.visible = false;
            } else {
                this.closeBtn.visible = true;
            }
        }
        //宝箱奖励弹窗
        else if (this.viewType == FogConst.VIEW_TYPE_BOX_REWARD) {
            this.itemList.y = 81;
            this.titleLab.text = TranslateFunc.instance.getTranslate("tid_fog_gongxi");
        }

    }
    initReward() {
        this.itemList.repeatX = this.itemArr.length;
        this.itemList.array = this.itemArr;
        if (this.itemArr.length == 1) {
            this.itemList.x = 183;
            this.itemList.width = 127;
        } else if (this.itemArr.length == 2) {
            this.itemList.x = 118;
            this.itemList.width = 257;
        } else if (this.itemArr.length == 3) {
            this.itemList.x = 55;
            this.itemList.width = 383;
        }
        else if (this.itemArr.length > 3) {
            this.itemList.x = 36;
            this.itemList.width = 421;
        }
        this.itemList.renderHandler = new Laya.Handler(this, this.onListRender);
        this.itemList.scrollTo(0);
    }
    onListRender(cell: Laya.Box, index: number) {
        var data = this.itemList.array[index];
        var itemLab = cell.getChildByName("item").getChildByName("itemLab") as Laya.Label;
        var itemIcon = cell.getChildByName("item").getChildByName("itemIcon") as Laya.Image;

        var result = FogFunc.instance.getResourceShowInfo(data);

        if (this.isShowItemLab) {
            itemLab.text = "X" + StringUtils.getCoinStr(result["num"]);
        } else {
            itemLab.text = "";
        }

        itemIcon.skin = result["icon"];
        itemIcon.scale(result["scale"], result["scale"]);
    }
    onClickReceive() {
        //奖励事件
        if (this.viewType == FogConst.VIEW_TYPE_REWARD_EVENT) {
            var userActNum = FogModel.instance.getActNum()
            if (userActNum < Number(this.events.mobilityCost)) {
                FogModel.instance.checkFreeAct();
                return;
            }

            FogServer.getReward({ "reward": this.itemArr, "cost": [DataResourceType.ACT, this.events.mobilityCost] }, this.finishCallBack, this);
            //保存FogReward数据
            FogServer.saveFogReward({ "reward": this.itemArr });
        }
        //宝箱奖励弹窗
        else if (this.viewType == FogConst.VIEW_TYPE_BOX_REWARD) {
            this.close();
        }


        var thisObj = WindowManager.getUIByName("FogMainUI");
        FogFunc.instance.flyResTween(this.itemArr, this.cell.x - 40, this.cell.y + thisObj.cellCtn.y);
    }
    finishCallBack() {
        this.isFinish = true;
        this.close();
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.FogMultiRewardUI);
        if (this.isFinish) {
            this.callBack && this.callBack.call(this.thisObj);
        }
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}