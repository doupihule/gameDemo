import { ui } from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../../framework/utils/ButtonUtils";
import FogFunc from "../../../func/FogFunc";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import GameUtils from "../../../../../utils/GameUtils";
import LogsManager from "../../../../../framework/manager/LogsManager";
import { DataResourceType } from "../../../func/DataResourceFunc";
import ResourceConst from "../../../consts/ResourceConst";
import ShareOrTvManager from "../../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../../func/ShareTvOrderFunc";
import UserInfo from "../../../../../framework/common/UserInfo";
import FogServer from "../../../server/FogServer";
import ButtonConst from "../../../../../framework/consts/ButtonConst";
import BattleRoleView from "../../../../battle/view/BattleRoleView";
import PoolTools from "../../../../../framework/utils/PoolTools";
import PoolCode from "../../../consts/PoolCode";
import BattleFunc from "../../../func/BattleFunc";
import BannerAdManager from "../../../../../framework/manager/BannerAdManager";
import FogEventData from "../../../../fog/data/FogEventData";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";
import Message from "../../../../../framework/common/Message";
import FogEvent from "../../../event/FogEvent";
import StatisticsManager from "../../../manager/StatisticsManager";
import FogModel from "../../../model/FogModel";



export default class FogChooseUI extends ui.gameui.fog.FogChooseUI implements IMessage {

    private eventId;//事件id
    private eventInfo;//事件cfg
    private rewardArr = [];
    private freeType;
    private chooseIndex = -1;//当前选择index
    private roleAnim: BattleRoleView;

    //格子事件
    private events: FogEventData
    //格子
    private cell: FogInstanceCell;

    constructor() {
        super();
        new ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils(this.singleBtn, this.onClickSingle, this);
        new ButtonUtils(this.allBtn, this.onClickAll, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
        new ButtonUtils(this.item0, this.onClickitem, this, null, null, 0);
        new ButtonUtils(this.item1, this.onClickitem, this, null, null, 1);
    }

    public setData(data) {
        this.chooseIndex = -1;
        this.rewardArr = [];

        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;


        //标题
        this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
        //描述
        this.eventDesc.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");

        //item初始化
        //事件参数：掉落组ID1;掉落组ID2;
        var params = this.eventInfo.params;

        var result;
        var drop;
        var reward;

        //判断事件里面是否有保存的奖励数据
        if (this.events.eventData && this.events.eventData.reward && Object.keys(this.events.eventData.reward).length != 0) {          
            this.rewardArr = FogFunc.instance.vertRewardTableToArr(this.events.eventData.reward);
        }else {
            for (var i = 0; i < params.length; i++) {
                drop = FogFunc.instance.getDropGroupReward(params[i]);
                reward = GameUtils.getWeightItem(drop);
                this.rewardArr.push(reward);
                this.rewardArr.sort(this.sortReward);
            }
            //保存事件随机出的奖励
            FogServer.addCellEvent({ cellId: this.cell.mySign, rewardArr: this.rewardArr, id: this.eventId }, null, null);

        }



        for (var i = 0; i < this.rewardArr.length; i++) {
            //道具组展示
            result = FogFunc.instance.getResourceShowInfo(this.rewardArr[i]);
            this["itemName" + i].text = result["name"];
            this["itemImg" + i].skin = result["icon"];
            this["itemImg" + i].scale(result["scale"], result["scale"]);
            this["itemDesc" + i].text = result["desc"];
            this["itemChoose" + i].visible = false;
            //根据类型判断是否显示数量
            if (FogFunc.showNumInUI.indexOf(Number(this.rewardArr[i][0])) != -1) {
                this["itemNum" + i].visible = true;
                this["itemNum" + i].text = result["num"];
            } else {
                this["itemNum" + i].visible = false;
            }
        }

        //角色spine
        this.showRoleSpine();

        //按钮初始化
        this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_EVENT_CHOOSE);
        if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
            this.allBtn.visible = false;
            this.singleBtn.x = 275;
        }else{
            this.allBtn.visible = true;
            this.singleBtn.x = 168;
            this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_CHOOSE_SHOW);
            }
        }


        BannerAdManager.addBannerQuick(this);
    }
    //奖励数据排序
	sortReward(a, b) {
		var indexA = Number(a[0]);
		var indexB = Number(b[0]);

		if (indexA < indexB) {
			return Number(a[0]) - Number(b[0]);
		} else if (indexA > indexB) {
			return Number(b[0]) - Number(a[0]);
		} else {
			//判断id
			var idA = Number(a[1]);
			var idB = Number(b[1]);
			if (idA > idB) {
				return idA - idB;
			} else if (idA < idB) {
				return idB - idA;
			}
		}
	}
    showRoleSpine() {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
        }

        if (this.eventInfo.uiSpine) {
            var spine = this.eventInfo.uiSpine;
            var item = PoolTools.getItem(PoolCode.POOL_ROLE + spine[0]);
            var scaleRoleInfo = BattleFunc.defaultScale * Number(spine[2]) / 10000;
            if (!item) {
                this.roleAnim = new BattleRoleView(spine[0], scaleRoleInfo, 0,"FogChooseUI");
            } else {
                this.roleAnim = item;
                this.roleAnim.setItemViewScale(scaleRoleInfo);
            }
            this.roleSpine.addChild(this.roleAnim);
            this.roleAnim.play(spine[1], true);
        }
    }
    onClickitem(index) {
        this["itemChoose" + index].visible = true;
        this["itemChoose" + (1 - index)].visible = false;
        this.chooseIndex = index;
    }
    onClickSingle() {
        if (this.chooseIndex == -1) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_choose_tip"));
            return;
        }

        //消耗行动力判断
        var userActNum = FogModel.instance.getActNum()
        if (userActNum < Number(this.events.mobilityCost)) {
            FogModel.instance.checkFreeAct();
            return;
        }
        FogServer.chooseReward({ "reward": [this.rewardArr[this.chooseIndex]], "cost": [DataResourceType.ACT, this.events.mobilityCost] }, () => {
            this.chooseCallBack();
            //购买或领取成功后，弹获得奖励弹窗
            WindowManager.OpenUI(WindowCfgs.FogComRewardUI, { "reward": [this.rewardArr[this.chooseIndex]], "cell": this.cell});
        }, this);
        //保存FogReward数据
        FogServer.saveFogReward({ "reward": [this.rewardArr[this.chooseIndex]] });
      
    }
    onClickAll() {

        StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_CHOOSE_CLICK);
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_EVENT_CHOOSE, ShareOrTvManager.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successfull, () => { }, this);
    }
    successfull() {
        FogServer.chooseReward({ "reward": this.rewardArr }, () => {
            this.chooseCallBack();
            //购买或领取成功后，弹获得奖励弹窗
            WindowManager.OpenUI(WindowCfgs.FogComRewardUI, { "reward": this.rewardArr, cell: this.cell, callBack: this.finishOpen, thisObj: this });

            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_CHOOSE_FINISH);
            } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_CHOOSE_FINISH);
            }

        }, this);
        //保存FogReward数据
        FogServer.saveFogReward({ "reward": this.rewardArr });
         
    }
    //完成弹窗奖励展示后，刷新后置事件的显示
    finishOpen() {
        Message.instance.send(FogEvent.FOGEVENT_REFRESH_BEHINDEVENT, { cell: this.cell })
    }
    chooseCallBack() {
        this.close();
        //刷新当前事件的状态
        Message.instance.send(FogEvent.FOGEVENT_REFRESH_CELLEVENT, { cell: this.cell })
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.FogChooseUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}