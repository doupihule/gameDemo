import IMessage from "../../interfaces/IMessage";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import UserInfo from "../../../../framework/common/UserInfo";
import StatisticsManager from "../../manager/StatisticsManager";
import StatisticsCommonConst from "../../../../framework/consts/StatisticsCommonConst";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ButtonExpand from "../../../../framework/components/ButtonExpand";
import LabelExpand from "../../../../framework/components/LabelExpand";
import ImageExpand from "../../../../framework/components/ImageExpand";
import UIBaseView from "../../../../framework/components/UIBaseView";
import DataResourceConst from "../../consts/DataResourceConst";

export default class FreePowerUI extends UIBaseView  {

    /** 免费资源类型 */
    private freeType: number
    /** 广告还是分享  */
    private adType: number;
    public  receiveBtn:ButtonExpand;
    public  closeBtn:ButtonExpand;
    public  closeBtn2:ButtonExpand;
    public  descLabel:LabelExpand;
    public  receiveImg:ImageExpand;

    constructor() {
        super();
        this.initBtn();

    }

    initBtn() {
        this.descLabel.changeText(TranslateFunc.instance.getTranslate("#tid_addPower_01", null, GlobalParamsFunc.instance.getDataNum("spPerAd") + ""));
        new ButtonUtils(this.receiveBtn, this.onReceiveBtnClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
        new ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils(this.closeBtn2, this.close, this);
    }

    onReceiveBtnClick() {
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FREE_SP, ShareOrTvManager.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, null, this);
    }

    successCall() {
        if (this.adType == ShareOrTvManager.TYPE_ADV) {
            // StatisticsManager.ins.onEvent(StatisticsManager.VIDEO_POWERRECOVERY_CLICKSUCCESS);
        } else if (this.adType == ShareOrTvManager.TYPE_SHARE) {
            // StatisticsManager.ins.onEvent(StatisticsManager.SHARE_POWER_RECOVERY_SUCCESS);
        }

        if (this.freeType == DataResourceConst.SP) {
            this.close();
            var spPerAd = GlobalParamsFunc.instance.getDataNum("spPerAd");
            var spReward = DataResourceConst.SP + "," + spPerAd;
            //打开恭喜获得界面:{reward,shareOrTyId,isDouble}
            WindowManager.OpenUI(WindowCfgs.CommonRewardUI, { reward: [spReward], id: ShareTvOrderFunc.SHARELINE_FREE_SP, isDouble: 1 });
        }
    }

    public setData(data): void {
        this.freeType = data.type;

        // 预留不同资源复用
        if (this.freeType == DataResourceConst.SP) {
            this.adType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_SP)
            if (this.adType == ShareOrTvManager.TYPE_ADV) {
                this.receiveImg.setSkin( "native/common/common_image_shipin.png");
                StatisticsManager.ins.onEvent(StatisticsCommonConst.VIDEO_TOTAL_SHOW);
                //  StatisticsManager.ins.onEvent(StatisticsManager.VIDEO_POWERRECOVERY_SHOW);

            } else if (this.adType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsCommonConst.SHARE_TOTAL_SHOW);
                //   StatisticsManager.ins.onEvent(StatisticsManager.SHARE_POWERRECOVERY_SHOW);

                if (UserInfo.isWX()) {
                    // 微信渠道分享显示视频图标
                    this.receiveImg.setSkin("native/common/common_image_shipin.png");
                }
                else {
                    this.receiveImg.setSkin( "native/common/common_image_fenxiang.png");
                }
            }
        }
        // BannerAdManager.addBannerQuick();
    }


    close() {
        // 关闭banner
        // BannerAdManager.hideQuickBanner();
        WindowManager.CloseUI(WindowCfgs.FreePowerUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }

    }
}


