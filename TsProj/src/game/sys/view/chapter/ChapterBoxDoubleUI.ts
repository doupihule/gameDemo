import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import FogFunc from "../../func/FogFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ChapterConst from "../../consts/ChapterConst";
import FogServer from "../../server/FogServer";
import ChapterFunc from "../../func/ChapterFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import StatisticsManager from "../../manager/StatisticsManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import { DataResourceType } from "../../func/DataResourceFunc";



export default class ChapterBoxDoubleUI extends ui.gameui.chapter.ChapterBoxDoubleUI implements IMessage {

    private itemArr;//奖励数组
    private callBack;
    private thisObj;
    private shareName;
    private doubleRate = 1
    private freeType;
    private params
    constructor() {
        super();
        new ButtonUtils(this.closeBtn, this.onClickClose, this);
        new ButtonUtils(this.doubleReceiveBtn, this.onClickDouble, this);
    }

    public setData(data) {
        BannerAdManager.addBannerQuick(this);
        BannerAdManager.addTopBannerStyleJump(this);
        this.itemArr = [];
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.itemArr = data.reward
        this.doubleRate = (data && data.doubleRate - 1) || 1
        this.shareName = data && data.shareName
        if (this.shareName == ShareTvOrderFunc.SHARELINE_WORK_GIFTDOUBLE) {
            this.doubleRate = 2;
            this.desTxt.text = TranslateFunc.instance.getTranslate("#tid_work_giftReward")
            this.giftImg.visible = true;
            this.titleLab.visible = false;
        } else {
            this.desTxt.text = TranslateFunc.instance.getTranslate("#tid_tip_receiveDouble")
            this.giftImg.visible = false;
            this.titleLab.visible = true;
        }
        this.params = data && data.params
        this.freeType = ShareOrTvManager.instance.getShareOrTvType(this.shareName, ShareOrTvManager.TYPE_SHARE);
        this.adImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
        // this.doubleTxt.text = TranslateFunc.instance.getTranslate("#tid_receiveReward_rate", null,data && data.doubleRate);
        this.addShowEvent();
        this.initReward();
        //延迟出现
        var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(this.shareName);
        this.closeBtn.visible = true;
        if (delayTime) {
            this.closeBtn.visible = false;
            TimerManager.instance.setTimeout(() => {
                this.closeBtn.visible = true;
            }, this, delayTime)
        }
    }
    initReward() {
        this.itemList.repeatX = this.itemArr.length;
        this.itemList.array = this.itemArr;
        if (this.itemArr.length == 1) {
            this.itemList.width = 127;
        } else if (this.itemArr.length == 2) {
            this.itemList.width = 257;
        } else if (this.itemArr.length == 3) {
            this.itemList.width = 383;
        }
        else if (this.itemArr.length > 3) {
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
        var equipBg = cell.getChildByName("equipBg") as Laya.Image;
        var pieceTxt = equipBg.getChildByName("pieceTxt") as Laya.Label;
        var nameTxt = equipBg.getChildByName("nameTxt") as Laya.Label;
        var result = FogFunc.instance.getResourceShowInfo(data, false);
        itemLab.text = StringUtils.getCoinStr(result["num"]);
        itemIcon.skin = result["icon"];
        if (result.type == DataResourceType.PIECE) {
            equipBg.visible = true;
            pieceTxt.text = StringUtils.getCoinStr(result["num"]);
            nameTxt.text = result.name;
            itemLab.text = ""
        } else {
            equipBg.visible = false;
        }

    }
    onClickDouble() {
        this.addClickEvent();
        ShareOrTvManager.instance.shareOrTv(this.shareName, ShareOrTvManager.TYPE_SHARE,
            {
                id: "1",
                extraData: {}
            }, this.receiveReard.bind(this, this.doubleRate), null, this);
    }
    //领取奖励
    receiveReard(rate = 1) {
        if (rate == this.doubleRate) {
            this.addSuccEvent();
        }
        FogServer.getReward({ reward: this.itemArr, doubleRate: rate }, this.finishCallBack, this);
    }
    finishCallBack() {
        this.close();
    }
    onClickClose() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_WORK_GIFTDOUBLE) {
            this.receiveReard(1)
        } else {
            this.close();
        }
    }
    //展示打点
    addShowEvent() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_CHAPTERBOX_REWARD) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_CHAPTERBOX_SHOW, this.params);
        } else if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_POINTREWARD) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_TASKBOX_SHOW, this.params);
        } else if (this.shareName == ShareTvOrderFunc.SHARELINE_WORK_GIFTDOUBLE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_GIFTDOUBLE_SHOW, this.params);
        }
    }
    //点击打点
    addClickEvent() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_CHAPTERBOX_REWARD) {
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_CHAPTERBOX_CLICK, this.params);
            }
        } else if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_POINTREWARD) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_TASKBOX_CLICK, this.params);
        } else if (this.shareName == ShareTvOrderFunc.SHARELINE_WORK_GIFTDOUBLE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_GIFTDOUBLE_CLICK, this.params);
        }
    }
    //展示成功打点
    addSuccEvent() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_CHAPTERBOX_REWARD) {
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_CHAPTERBOX_FINISH, this.params);
            } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_CHAPTERBOX_FINISH, this.params);
            }
        } else if (this.shareName == ShareTvOrderFunc.SHARELINE_TASK_POINTREWARD) {
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_TASKBOX_FINISH, this.params);
            } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_TASKBOX_FINISH, this.params);
            }
        } else if (this.shareName == ShareTvOrderFunc.SHARELINE_WORK_GIFTDOUBLE) {
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_GIFTDOUBLE_FINISH, this.params);
            } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_GIFTDOUBLE_FINISH, this.params);
            }
        }
    }
    close() {
        this.callBack & this.callBack.call(this.thisObj)
        WindowManager.CloseUI(WindowCfgs.ChapterBoxDoubleUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}