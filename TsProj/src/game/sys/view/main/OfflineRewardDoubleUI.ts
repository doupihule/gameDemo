import StatisticsManager from "../../manager/StatisticsManager";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ui } from "../../../../ui/layaMaxUI";
import Message from "../../../../framework/common/Message";
import StringUtils from "../../../../framework/utils/StringUtils";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import GameUtils from "../../../../utils/GameUtils";
import DataResourceServer from "../../server/DataResourceServer";
import GameMainEvent from "../../event/GameMainEvent";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import RolesModel from "../../model/RolesModel";
import BattleFunc from "../../func/BattleFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ResourceConst from "../../consts/ResourceConst";
import TimerManager from "../../../../framework/manager/TimerManager";


export default class OfflineRewardDoubleUI extends ui.gameui.main.OfflineRewardDoubleUI implements IMessage {

    private freeType;
    private offlineReward;
    private rewardType;

    constructor() {
        super();
        this.addEvent();

        new ButtonUtils(this.btn_multiReward, this.onReceiveBtnClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
        new ButtonUtils(this.closeBtn, this.close, this);
    }
    /**添加事件监听 */
    addEvent() {
    }

    setData(data): void {
        BannerAdManager.addBannerQuick(this);
        BannerAdManager.addTopBannerStyleJump(this);
        this.rewardType = data.rewardType;
        this.offlineReward = data.rewardNum;
        this.lbl_normalReward.text = StringUtils.getCoinStr(this.offlineReward);

    
        //按钮状态
        this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_OFFLINE);
        this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            this.freeImg.skin = ResourceConst.ADV_PNG;
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_OFFLINECOIN_SHOW, { "times": 2 });
        }

        var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(ShareTvOrderFunc.SHARELINE_OFFLINE);
        this.closeBtn.visible = true;
        if (delayTime) {
            this.closeBtn.visible = false;
            TimerManager.instance.setTimeout(() => {
                this.closeBtn.visible = true;
            }, this, delayTime)
        }
    }
   

    //领取多倍离线收益
    onReceiveBtnClick() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_OFFLINECOIN_CLICK, { "times": 2 });
        }
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_OFFLINE, ShareOrTvManager.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);

    }
    successCall() {
        DataResourceServer.getReward({ "reward": [this.rewardType, this.offlineReward], "offlineTime": -1 }, () => {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_get_lab"));
            this.close();
        }, this);
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_OFFLINECOIN_FINISH, { "times": 2 });
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_OFFLINECOIN_FINISH, { "times": 2 });
        }
    }
    closeCall() {

    }

    close() {
        Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REFRESH_OFFLINE_ICON);
        Message.instance.send(GameMainEvent.GAMEMIAN_EVENT_CHECKPOP);
        WindowManager.CloseUI(WindowCfgs.OfflineRewardDoubleUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }

    }
}


