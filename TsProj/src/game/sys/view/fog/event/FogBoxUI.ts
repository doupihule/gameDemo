import { ui } from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../../framework/utils/ButtonUtils";
import FogFunc from "../../../func/FogFunc";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import LogsManager from "../../../../../framework/manager/LogsManager";
import { DataResourceType } from "../../../func/DataResourceFunc";
import FogModel from "../../../model/FogModel";
import FogServer from "../../../server/FogServer";
import GameUtils from "../../../../../utils/GameUtils";
import RolesFunc from "../../../func/RolesFunc";
import FogConst from "../../../consts/FogConst";
import StringUtils from "../../../../../framework/utils/StringUtils";
import FogEventData from "../../../../fog/data/FogEventData";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";
import Message from "../../../../../framework/common/Message";
import FogEvent from "../../../event/FogEvent";
import BannerAdManager from "../../../../../framework/manager/BannerAdManager";
import ResourceConst from "../../../consts/ResourceConst";



export default class FogBoxUI extends ui.gameui.fog.FogBoxUI implements IMessage {

    private eventId;//事件id
    private eventInfo;//事件cfg
    private boxId;//宝箱id

    private keyCostId;//钥匙开启消耗的道具id
    private actCostNum;//消耗的行动力

    private rewardArr = [];//奖励
    //格子事件
    private events: FogEventData
    //格子
    private cell: FogInstanceCell;

    constructor() {
        super();
        new ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils(this.openBtn, this.onClickDirectOpen, this);
        new ButtonUtils(this.keyOpenBtn, this.onClickKeyOpen, this);
        new ButtonUtils(this.actOpenBtn, this.onClickActOpen, this);
    }

    public setData(data) {
        this.keyCostId = "";
        this.actCostNum = 0;
        this.rewardArr = [];
        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;

        //宝箱id
        this.boxId = this.eventInfo.params[0];
        this.initBtnGroup();

        this.boxImg.skin = "fog/fog/" + this.eventInfo.uiIcon[0] + ".png";

        //初始化奖励
        this.initReward();

        BannerAdManager.addBannerQuick(this);
    }
    initBtnGroup() {
        this.unlockGroup.visible = false;
        this.lockedGroup.visible = false;

        if(this.eventInfo.desc){
            this.boxDesc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
        }
        

        var boxInfo = FogFunc.instance.getBoxInfo(this.boxId);
        //判断宝箱开启状态
        if (!boxInfo.key) {
            this.unlockGroup.visible = true;


        } else {
            this.lockedGroup.visible = true;
            this.keyCostId = boxInfo.key;


            var reduceRole = boxInfo.reduceRole;
            var name = RolesFunc.instance.getRoleInfoById(reduceRole[0]).name;
            var roleName = TranslateFunc.instance.getTranslate(name, "TranslateRole");
            //判断是否有降低消耗的角色
            if (boxInfo.reduceRole) {
                var line = FogModel.instance.getLine();
                if (line.hasOwnProperty(boxInfo.reduceRole[0])) {
                    this.actCostNum = boxInfo.reduceRole[1];
                    this.boxDesc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[1], "TranslateEvent");
                } else {
                    this.actCostNum = this.events.mobilityCost || 0;
                    this.boxDesc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
                }

            } else {
                this.boxDesc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
                this.actCostNum = this.events.mobilityCost || 0;
            }

            //消耗行动力数
            this.actLab.text = "-" + this.actCostNum;

            //玩家钥匙数量
            this.keyNum.text = StringUtils.getCoinStr(FogModel.instance.getPropNum(this.keyCostId) + "");
        }
        //标题
        this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent");

    }

    //随机奖励组
    initReward() {
        var boxInfo = FogFunc.instance.getBoxInfo(this.boxId);
        var dropGroups = boxInfo.dropGroups;
        //每个掉落组都随机出奖励
        var dropId;
        var dropArr;
        for (var i = 0; i < dropGroups.length; i++) {
            dropId = dropGroups[i][0];

            var randomNum = GameUtils.getRandomInt(0, 10000);
            if (randomNum < Number(dropGroups[i][1])) {
                dropArr = FogFunc.instance.getDropGroupReward(dropId);
                this.rewardArr.push(GameUtils.getWeightItem(dropArr));
            }
        }

    }
    //获得奖励，弹恭喜获得界面
    openCallBack() {
        this.close();
        //刷新当前事件的状态
        Message.instance.send(FogEvent.FOGEVENT_REFRESH_CELLEVENT, { cell: this.cell })
        WindowManager.OpenUI(WindowCfgs.FogMultiRewardUI, { "reward": this.rewardArr, cell: this.cell, "viewType": FogConst.VIEW_TYPE_BOX_REWARD, callBack: this.finishOpen, thisObj: this });
    }
    onClickDirectOpen() {
        FogServer.getReward({ "reward": this.rewardArr }, this.openCallBack, this);
        //保存FogReward数据
        FogServer.saveFogReward({ "reward": this.rewardArr });
    }
    onClickKeyOpen() {
        var userOwnKeyNum = FogModel.instance.getPropNum(this.keyCostId);
        if (userOwnKeyNum < 1) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughkey"));
            return;
        }
        FogServer.getReward({ "reward": this.rewardArr, "cost": [DataResourceType.FOGITEM, this.keyCostId, 1] }, this.openCallBack, this);
        //保存FogReward数据
        FogServer.saveFogReward({ "reward": this.rewardArr });
    }
    onClickActOpen() {
        var userActNum = FogModel.instance.getActNum()
        if (userActNum < this.actCostNum) {
            FogModel.instance.checkFreeAct();
            return;
        }

        FogServer.getReward({ "reward": this.rewardArr, "cost": [DataResourceType.ACT, this.actCostNum] }, this.openCallBack, this);
        //保存FogReward数据
        FogServer.saveFogReward({ "reward": this.rewardArr});
    }
    //完成打开宝箱后，刷新后置事件的显示
    finishOpen() {
        Message.instance.send(FogEvent.FOGEVENT_REFRESH_BEHINDEVENT, { cell: this.cell })
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.FogBoxUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}