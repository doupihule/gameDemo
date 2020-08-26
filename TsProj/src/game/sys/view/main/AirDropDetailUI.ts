import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import Message from "../../../../framework/common/Message";
import StatisticsManager from "../../manager/StatisticsManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import SubPackageConst from "../../consts/SubPackageConst";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import GameMainEvent from "../../event/GameMainEvent";
import SoundManager from "../../../../framework/manager/SoundManager";
import { MusicConst } from "../../consts/MusicConst";
import { WindowCfgs } from "../../consts/WindowCfgs";
import WindowManager from "../../../../framework/manager/WindowManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import UserExtServer from "../../server/UserExtServer";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import StringUtils from "../../../../framework/utils/StringUtils";
import UserExtModel from "../../model/UserExtModel";
import { DataResourceType } from "../../func/DataResourceFunc";
import ResourceConst from "../../consts/ResourceConst";
import DataResourceServer from "../../server/DataResourceServer";
import LogsManager from "../../../../framework/manager/LogsManager";
import LevelFunc from "../../func/LevelFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import { userInfo } from "os";
import UserInfo from "../../../../framework/common/UserInfo";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";

export default class AirDropDetailUI extends ui.gameui.main.AirDropDetailUI implements IMessage {

    private rewardCount;
    private rewardType;
    private freeType;

    constructor() {
        super();
        this.addEvent();

        new ButtonUtils(this.closeBtn, this.onClickCLose, this);
        new ButtonUtils(this.receiveBtn, this.onClickReceive, this);
    }
    /**添加事件监听 */
    addEvent() {
    }

    public setData(data): void {
        BannerAdManager.addBannerQuick(this);
        //界面初始化
        this.initView();
    }

    initView() {
        var rewardIndex = LevelFunc.instance.getAirDropRewardIndex();
        var boxItems = GlobalParamsFunc.instance.getDataArray("supplyBoxItem");
        var boxReward = boxItems[rewardIndex].split(",");
        this.rewardCount = boxReward[2];
        this.rewardType = parseInt(boxReward[1]);
        this.coinLab.text = this.rewardCount;
        this.rewardImg.skin = ResourceConst.AIDDROP_DETAIL_ARR[this.rewardType];

        this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_SUPPLYBOX);
        this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FLYBOX_SHOW, {"rewardType": this.rewardType, "rewardCount": this.rewardCount});
        }

    }

    onClickReceive() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FLYBOX_CLICK, {"rewardType": this.rewardType, "rewardCount": this.rewardCount});
        }
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_SUPPLYBOX, ShareOrTvManager.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);
    }
    successCall() {
        this.onSuccReward(1);
        this.close();
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FLYBOX_FINISH, {"rewardType": this.rewardType, "rewardCount": this.rewardCount});
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FLYBOX_FINISH, {"rewardType": this.rewardType, "rewardCount": this.rewardCount});
        }
    }
    //成功奖励  
    onSuccReward(rewardRate: number = 1) {
        DataResourceServer.getReward({ "reward": [this.rewardType, this.rewardCount * rewardRate]  }, () => {
            Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_DESTORY_AIRDROP);
            this.close();
        }, this);
    }

    closeCall() {

    }
    close(){
        WindowManager.CloseUI(WindowCfgs.AirDropDetailUI);
    }
    onClickCLose() {
        Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REFRESH_AIRDROP);
        WindowManager.CloseUI(WindowCfgs.AirDropDetailUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}


