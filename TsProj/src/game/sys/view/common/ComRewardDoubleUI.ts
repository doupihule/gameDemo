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


export default class ComRewardDoubleUI extends ui.gameui.common.ComRewardDoubleUI implements IMessage {

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
        this.closeBtn.visible = false;

        this.freeType = ShareOrTvManager.instance.getShareOrTvType(this.shareName, ShareOrTvManager.TYPE_SHARE);
        this.receiveImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
            this.receiveBtn.visible = false;
            this.closeBtn.visible = true;
            this.closeBtn.text = "确定"
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
        this.pieceBg.visible = false;
        if (this.reward[0] == DataResourceType.PIECE) {
            this.pieceBg.visible = true;
            var info = RolesFunc.instance.getCfgDatas("EquipMaterial", this.reward[1])
            this.rewardImg.skin = RolesFunc.instance.getEquipIcon(info.icon);
            this.pieceTxt.text = this.reward[2];
            this.rewardNum.text = TranslateFunc.instance.getTranslate(info.name);
        } else {
            this.rewardImg.skin = ResourceConst.AIDDROP_DETAIL_ARR[Number(this.reward[0])];
            this.rewardNum.text = this.reward[1];
            this.pieceTxt.text = "";
        }

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
            DataResourceFunc.instance.showTip([this.reward[0], Number(this.reward[1]) * 2]);
        }
        this.addSuccEvent();
        this.close();

    }
    failCall() {

    }
    //展示打点
    addShowEvent() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_SEVENDAY) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_SEVENDAY_SHOW, this.params);
        } else if (this.shareName == ShareTvOrderFunc.SHARELINE_EQUIP_GET_DOUBLE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_VIDEOPIECE_REWARD_SHOW, this.params);
        }
    }
    //点击打点
    addClickEvent() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_SEVENDAY) {
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_SEVENDAY_CLICK, this.params);
            }
        } else if (this.shareName == ShareTvOrderFunc.SHARELINE_EQUIP_GET_DOUBLE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_VIDEOPIECE_REWARD_CLICK, this.params);
        }
    }
    //展示成功打点
    addSuccEvent() {
        if (this.shareName == ShareTvOrderFunc.SHARELINE_SEVENDAY) {
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_SEVENDAY_FINISH, this.params);
            } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_SEVENDAY_FINISH, this.params);
            }
        } else if (this.shareName == ShareTvOrderFunc.SHARELINE_EQUIP_GET_DOUBLE) {
            if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_VIDEOPIECE_REWARD_FINISH, this.params);
            } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_VIDEOPIECE_REWARD_FINISH, this.params);
            }
        }
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.ComRewardDoubleUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }

    }
}


