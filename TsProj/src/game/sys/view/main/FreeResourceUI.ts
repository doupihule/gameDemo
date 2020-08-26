import IMessage from "../../interfaces/IMessage";
import { ui } from "../../../../ui/layaMaxUI";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ResourceCommonConst from "../../consts/ResourceCommonConst";
import UserInfo from "../../../../framework/common/UserInfo";
import StatisticsManager from "../../manager/StatisticsManager";
import StatisticsCommonConst from "../../../../framework/consts/StatisticsCommonConst";
import StringUtils from "../../../../framework/utils/StringUtils";
import UserExtServer from "../../server/UserExtServer";
import SceneReference from "../../../../framework/consts/SceneReference";
import { DataResourceType } from "../../func/DataResourceFunc";

export default class FreeResourceUI extends ui.gameui.main.FreeResourceUI implements IMessage {

    /** 免费资源类型 */
    private freeType: number
    /** 广告还是分享  */
    private adType: number

    /**传来的数据 */
    _data: any;

    constructor() {
        super();
        this.initBtn();

    }

    initBtn() {
        new ButtonUtils(this.receiveBtn, this.onReceiveBtnClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
        new ButtonUtils(this.closeBtn, this.close, this);
    }

    public setData(data): void {
        BannerAdManager.addBannerQuick(this);
        this._data = data;
        this.freeType = data.type;


        if (this.freeType == DataResourceType.SP) {
            // 预留不同资源复用
            this.getNum.text = "X" + GlobalParamsFunc.instance.getDataNum('spPerAd');
            this.adType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_SP);

            if (this.adType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_NOPOWER_SHOW);
            }
            BannerAdManager.addTopBannerStyleJump(this);

        } else if (this.freeType == DataResourceType.COIN) {
            this.lbl_desc.changeText("你的金币不足，是否领取金币x" + StringUtils.getCoinStr(data.coin));
            this.adType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_COIN);
            if (this.adType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsCommonConst.VIDEO_TOTAL_SHOW);
                // StatisticsManager.ins.onEvent(StatisticsManager.VIDEO_FREECOIN_SHOW);
            } else if (this.adType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsCommonConst.SHARE_TOTAL_SHOW);
                // StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FREECOIN_SHOW);
            }

        }

        this.receiveImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.adType);

    }

    onReceiveBtnClick() {
        if (this.freeType == DataResourceType.SP) {
            if (this.adType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_NOPOWER_CLICK);
            }
            ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FREE_SP, ShareOrTvManager.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, this.successCall, this.failCall, this);
        } else if (this.freeType == DataResourceType.COIN) {
            ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FREE_COIN, ShareOrTvManager.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, this.successCall, this.failCall, this);
        }
    }

    successCall() {
        if (this.freeType == DataResourceType.SP) {
            if (this.adType == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_NOPOWERSUCEEDNUB);
            } else if (this.adType == ShareOrTvManager.TYPE_SHARE) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_POWERRECOVERY_CLICKSUCCESS);
            }

            UserExtServer.getFreeSp({ reward: GlobalParamsFunc.instance.getDataNum("spPerAd") }, () => {
                WindowManager.ShowTip("体力+" + GlobalParamsFunc.instance.getDataNum("spPerAd"))
                // StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FREESP);
                this.close();
            }, this);
        } else if (this.freeType == DataResourceType.COIN) {
            if (this.adType == ShareOrTvManager.TYPE_ADV) {
                // StatisticsManager.ins.onEvent(StatisticsManager.VIDEO_FREECOIN_CLICKSUCCESS);
            } else if (this.adType == ShareOrTvManager.TYPE_SHARE) {
                // StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FREECOIN_CLICKSUCCESS);
            }
            // StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_PAYSOLDIERSUCEEDNUB);
            UserExtServer.getFreeCoin({ coin: this._data.coin }, () => {
                WindowManager.ShowTip("金币+" + StringUtils.getCoinStr(this._data.coin));
                // StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FREESP);
                this.close();
            }, this);
        }
    }
    failCall() {

    }

    close() {
        WindowManager.CloseUI(WindowCfgs.FreeResourceUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }

    }
}


