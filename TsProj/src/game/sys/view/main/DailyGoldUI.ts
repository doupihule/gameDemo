import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import Message from "../../../../framework/common/Message";
import StatisticsManager from "../../manager/StatisticsManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import SubPackageConst from "../../consts/SubPackageConst";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import DailyGoldModel from "../../model/DailyGoldModel";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import UserInfo from "../../../../framework/common/UserInfo";
import ResourceConst from "../../consts/ResourceConst";
import DailyDiamondFunc from "../../func/DailyDiamondFunc";
import DailyGoldServer from "../../server/DailyGoldServer";
import GameMainEvent from "../../event/GameMainEvent";
import LogsManager from "../../../../framework/manager/LogsManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";


export default class DailyGoldUI extends ui.gameui.main.DailyGoldUI implements IMessage {

    //分享序列类型
    private shareType;
    // 当前观看进度
    private currentGoldStep: number;
    // 当前奖励钻石数量
    private currentGold: number;
    // 当前观看次数
    private watchTime: number;
    // 当前次数数据
    private currentData;

    constructor() {
        super();
        this.addEvent();

        new ButtonUtils(this.closeBtn, this.onClickCLose, this);
        new ButtonUtils(this.btn_getReward, this.onClickReceive, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
    }
    /**添加事件监听 */
    addEvent() {
    }

    public setData(data): void {
        BannerAdManager.addBannerQuick(this);
        AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_DailyGold, this);
        var dailyGold = DailyGoldModel.instance.getDailyGold();
        if (dailyGold.currentStep && !dailyGold.currentGoldStep) {
            this.currentGoldStep = dailyGold.currentStep + 1;
        }
        else {
            this.currentGoldStep = dailyGold.currentGoldStep + 1;
        }
        this.watchTime = dailyGold.watchTime;

        this.initView();
    }

    initView() {
        this.refreshView();

       
        this.currentGold = this.currentData.giveDiamond;
        this.lbl_currentTime.text = "当前第" + this.currentGoldStep + "次";
        this.lbl_currentNum.text = "×" + this.currentGold;

        //获取下一次显示的奖励
        var nextTime = DailyDiamondFunc.instance.getNextShowTime(this.currentGoldStep);
        var nextGoldData = DailyDiamondFunc.instance.getDataById(nextTime);

        this.lbl_nextTime.text = nextTime;
        this.lbl_nextNum.text = nextGoldData.giveDiamond;
    }
    refreshView() {
        //根据序列切换图标
        this.shareType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_DAILYGOLD);
        this.img_adv.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.shareType);
        if (this.shareType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FREEGOLD_SHOW, {"gainTimes": this.currentGoldStep});
        }

        var freeGoldData = DailyDiamondFunc.instance.getDataById(this.currentGoldStep);
        this.currentData = freeGoldData;

        if (freeGoldData.showNub == 1) {
            this.group_step.visible = false;
        } else {
            this.group_step.visible = true;
            this.lbl_step.text = this.watchTime + "/" + freeGoldData.showNub;
        }

    }

    onClickCLose() {
        this.close();
    }
    onClickReceive() {
        if (this.shareType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FREEGOLD_CLICK, {"gainTimes": this.currentGoldStep});
        } 
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_DAILYGOLD, ShareOrTvManager.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);
    }
    //成功回调，判断是否达到领奖次数
    successCall() {
        //观看次数+1
        this.watchTime += 1;
        if (this.shareType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FREEGOLD_FINISH, {"gainTimes": this.currentGoldStep});
        } else if (this.shareType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FREEGOLD_FINISH, {"gainTimes": this.currentGoldStep});
        }
        if (this.watchTime >= this.currentData.showNub) {
            //可以领取奖励
            this.getReward();
        } else {
            //更新观看视频次数
            DailyGoldServer.updateWatchTime({ "watchTime": this.watchTime }, () => {
                //更新界面
                var freeGoldData = DailyDiamondFunc.instance.getDataById(this.currentGoldStep);
                this.refreshView();
            }, this);
        }
       
    }

    //领取奖励并退出游戏
    getReward() {
        //领取奖励并回到主界面
        DailyGoldServer.gainReward({ "currentGoldStep": this.currentGoldStep, "currentGold": this.currentGold }, () => {
            WindowManager.ShowTip("获得钻石×" + this.currentGold);
            //更新界面
            if (this.currentGoldStep >= DailyDiamondFunc.instance.getMaxId()) {
                Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REFRESH_DAILYGOLD);
                this.close();
            } else {
                this.refreshUI();
            }
        }, this);
    }
    refreshUI() {
        var dailyGold = DailyGoldModel.instance.getDailyGold();
        this.currentGoldStep = dailyGold.currentGoldStep + 1;
        this.watchTime = dailyGold.watchTime;

        this.initView();
    }

    closeCall() {
    }

    close() {
        WindowManager.CloseUI(WindowCfgs.DailyGoldUI);
    }
    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}


