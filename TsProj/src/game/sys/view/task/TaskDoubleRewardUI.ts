import IMessage from "../../interfaces/IMessage";
import { ui } from "../../../../ui/layaMaxUI";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import SevenDayFunc from "../../func/SevenDayFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import DataResourceFunc, { DataResourceType } from "../../func/DataResourceFunc";
import ResourceConst from "../../consts/ResourceConst";
import TimerManager from "../../../../framework/manager/TimerManager";
import StatisticsManager from "../../manager/StatisticsManager";
import UserInfo from "../../../../framework/common/UserInfo";
import RolesFunc from "../../func/RolesFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogFunc from "../../func/FogFunc";
import StringUtils from "../../../../framework/utils/StringUtils";


export default class TaskDoubleRewardUI extends ui.gameui.task.TaskDoubleRewardUI implements IMessage {

    //领取回调
    succCall: any;
    //奖励
    reward;
    //名字
    shareName;
    //打点参数
    params;

    private freeType;

    constructor() {
        super();
        this.initBtn();

    }

    initBtn() {
        new ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils(this.receiveBtn, this.onClickReceive, this);

    }

    setData(data) {
        BannerAdManager.addBannerQuick(this);
        BannerAdManager.addTopBannerStyleJump(this);

        this.succCall = data.succCall;
        this.reward = data.reward;
        this.shareName = data.shareName;
        this.params = data.params;
        this.closeBtn.visible = false;

        this.freeType = ShareOrTvManager.instance.getShareOrTvType(this.shareName, ShareOrTvManager.TYPE_SHARE);
        this.receiveImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
     
        if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
            this.receiveBtn.visible = false;
            this.closeBtn.text = "确定"
            this.closeBtn.visible = true
        } else {
            this.receiveBtn.visible = true;
            this.closeBtn.text = "我不要了";
            var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(this.shareName);
            this.closeBtn.visible = true;
            if (delayTime) {
                this.closeBtn.visible = false;
                TimerManager.instance.setTimeout(() => {
                    this.closeBtn.visible = true;
                }, this, delayTime)
            }
        }
        this.addShowEvent();
        this.initReward();
    }
    initReward() {
        this.itemList.repeatX = this.reward.length;
        this.itemList.array = this.reward;
        if (this.reward.length == 1) {
            this.itemList.width = 127;
        } else if (this.reward.length == 2) {
            this.itemList.width = 257;
        } else if (this.reward.length == 3) {
            this.itemList.width = 383;
        }
        else if (this.reward.length > 3) {
            this.itemList.width = 390;
        }
        this.itemList.renderHandler = new Laya.Handler(this, this.onListRender);
        this.itemList.scrollTo(0);
    }
    onListRender(cell: Laya.Box, index: number) {
        var data = this.itemList.array[index];
        var item = cell.getChildByName("item")
        var itemLab = item.getChildByName("itemLab") as Laya.Label;
        var itemIcon = item.getChildByName("itemIcon") as Laya.Image;
        var result = FogFunc.instance.getResourceShowInfo(data);
        itemLab.text = StringUtils.getCoinStr(result["num"]);
        itemIcon.skin = result["icon"];
    }
    onClickReceive() {
        this.addClickEvent();
        ShareOrTvManager.instance.shareOrTv(this.shareName, ShareOrTvManager.TYPE_SHARE,
            {
                id: "1",
                extraData: {}
            }, this.onSuccessCall, this.failCall, this);
    }
    onSuccessCall() {
        if (this.succCall) {
            this.succCall();
        }
        this.addSuccEvent();
        this.close();

    }
    failCall() {

    }
    //展示打点
    addShowEvent() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_DOUBLEREWARD) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_TASKREWARD_SHOW, this.params);
        }
    }
    //点击打点
    addClickEvent() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_DOUBLEREWARD) {
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_TASKREWARD_CLICK, this.params);
            }
        }
    }
    //展示成功打点
    addSuccEvent() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_DOUBLEREWARD) {
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_TASKREWARD_FINISH, this.params);
            } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_TASKREWARD_FINISH, this.params);
            }
        }
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.TaskDoubleRewardUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }

    }
}


