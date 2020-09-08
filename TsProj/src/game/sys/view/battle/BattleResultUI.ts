
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import BattleServer from "../../server/BattleServer";
import LevelFunc from "../../func/LevelFunc";
import BattleSceneManager from "../../manager/BattleSceneManager";
import StatisticsManager from "../../manager/StatisticsManager";
import { BattleUI } from "./BattleUI";
import StringUtils from "../../../../framework/utils/StringUtils";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import UserExtModel from "../../model/UserExtModel";
import Client from "../../../../framework/common/kakura/Client";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import DataResourceConst from "../../consts/DataResourceConst";
import ButtonExpand from "../../../../framework/components/ButtonExpand";
import LabelExpand from "../../../../framework/components/LabelExpand";
import ImageExpand from "../../../../framework/components/ImageExpand";
import UIBaseView from "../../../../framework/components/UIBaseView";

export default class BattleResultUI extends UIBaseView implements IMessage {
    public static res = ["gameui/BattleResult.scene",
    ];

    private bgAlpha = 0;

    private levelId;
    private placeList;
    private rank;
    private nameList;

    public  nextBtn:ButtonExpand;
    public  returnBtn:ButtonExpand;
    public  restartBtn:ButtonExpand;
    public  upgradeBtn:ButtonExpand;
    public  resultText:LabelExpand;
    public  bg:ButtonExpand;
    public  coinNum:LabelExpand;
    public  star1:ImageExpand
    public  star2:ImageExpand
    public  star3:ImageExpand

    constructor() {
        super();
        new ButtonUtils(this.nextBtn, this.onNextBtnClick, this);
        new ButtonUtils(this.returnBtn, this.onReturnBtnClick, this);
        new ButtonUtils(this.restartBtn, this.onRestartBtnClick, this);
        new ButtonUtils(this.upgradeBtn, this.onUpgradeBtnClick, this);
        // this.receiveBtn.on(Laya.Event.CLICK, this, this.onReceiveBtnClick);
        // this.restartBtn.on(Laya.Event.CLICK, this, this.onRestartBtn);
        // this.returnBtn.on(Laya.Event.CLICK, this, this.onReturnBtnClick);
        // ScreenAdapterTools.alignNotch(this.coinGroup, ScreenAdapterTools.Align_MiddleTop);
        // ScreenAdapterTools.alignNotch(this.goldGroup, ScreenAdapterTools.Align_MiddleTop);
        // new ButtonUtils(this.doubleBtn, this.onDoubleBtnClick, this, "uisource/common/common_bt_aniu1.png", "uisource/common/common_bt_aniu1.png");
    }

    public setData(data) {
        // WindowManager.CloseUI(WindowCfgs.BattleUI);
        //隐藏战斗ui
        var battleUi: BattleUI = WindowManager.getUIByName(WindowCfgs.BattleUI);
        battleUi.visible = false;

        this.levelId = data.levelId;
        this.rank = data.rank;


        // SoundManager.playSE(MusicConst.SOUND_RACE_WIN);

        var levelInfo = LevelFunc.instance.getLevelInfoById(this.levelId);
        var reward = levelInfo.reward;
        var getCoin = 0;
        var getGold = 0;
        if (this.rank >= 3) {
            var rewardInfo = reward[0].split(",");
            if (rewardInfo[0] == 2) {
                getCoin += Number(rewardInfo[1]);
            }
            if (rewardInfo[0] == 3) {
                getGold += Number(rewardInfo[1]);
            }
            this.resultText.setText("完美通关");
            this.restartBtn.visible = true;
            this.upgradeBtn.visible = false;
        }
        else {
            this.resultText.changeText("通关");
            var freeSpType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_UPGRADE);
            //没有视频或者分享，加体力按钮隐藏
            if (freeSpType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
                this.restartBtn.visible = false;
                this.upgradeBtn.visible = true;
            }
            else {
                this.restartBtn.visible = true;
                this.upgradeBtn.visible = false;
            }
        }
        if (this.rank >= 2) {
            var rewardInfo = reward[1].split(",");
            if (rewardInfo[0] == 2) {
                getCoin += Number(rewardInfo[1]);
            }
            if (rewardInfo[0] == 3) {
                getGold += Number(rewardInfo[1]);
            }
        }
        if (this.rank >= 1) {
            var rewardInfo = reward[2].split(",");
            if (rewardInfo[0] == 2) {
                getCoin += Number(rewardInfo[1]);
            }
            if (rewardInfo[0] == 3) {
                getGold += Number(rewardInfo[1]);
            }
        }

        this.showTween();
        this.bg.alpha = this.bgAlpha;

        this.coinNum.text = "+" + StringUtils.getCoinStr(String(getCoin) );
        // this.goldNum.text = StringUtils.getCoinStr(UserModel.instance.getGold());

        this.star1.setSkin( "native/main/common_image_xing2.png");
        this.star2.setSkin( "native/main/common_image_xing2.png");
        this.star3.setSkin( "native/main/common_image_xing2.png");

        BattleServer.battleResult(this.levelId, this.rank, null, this);

        var allInfo = LevelFunc.instance.getLevel();
        var info: Array<any> = allInfo.scenes[0].level;
        var levelNum = 0;
        for (var index in info) {
            levelNum++;
        }
        if (this.levelId + 1 > levelNum) {
            this.nextBtn.visible = false;
        }
        else {
            this.nextBtn.visible = true;
        }8
    }

    onClose() {
    }

    private anime() {

        this.star1.visible = true;
        this.star2.visible = true;
        this.star3.visible = true;


        var scale = 2;
        var time = 300;
        var index = 0;

        if (this.rank >= 1) {
            this.starAnime(this.star1, index, time, scale);
            index++;
        }
        if (this.rank >= 2) {
            this.starAnime(this.star2, index, time, scale);
            index++;
        }
        if (this.rank >= 3) {
            this.starAnime(this.star3, index, time, scale);
            index++;
        }

        // Laya.timer.once(time * (index + 1), this, this.tweenEffect);
        // ();
    }

    private starAnime(star, index, time, scale) {
        // star.visible = false;

    }



    public showTween() {

    }

    public setBgAlphaShow() {

    }

    private onNextBtnClick() {

        //否则计算体力 体力 = 服务器告诉的体力 + (当前服务器时间上次 - 上次服务器刷新体力的时间) / 体力恢复间隔   如果算出来的值比最大的大 则体力等于表里的最大值 即回满了
        var nowPower = UserExtModel.instance.getLastFreshPower() + Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) / GlobalParamsFunc.instance.getDataNum('spRestoreTime'));
        var maxSp = GlobalParamsFunc.instance.getDataNum('maxSp');
        if (UserExtModel.instance.getLastFreshPower() > maxSp) {
            //如果服务器告诉的体力大于最大的  则体力等于服务器给的
            nowPower = UserExtModel.instance.getLastFreshPower();
        } else if (nowPower > maxSp) {
            nowPower = maxSp;
        }
        if (nowPower < GlobalParamsFunc.instance.getDataNum('levelSpCost')) {
            var freeSpType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_SP);
            //没有视频或者分享，加体力按钮隐藏
            if (freeSpType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
                WindowManager.OpenUI(WindowCfgs.FreePowerUI, { type: DataResourceConst.SP });
            }
            else {
                WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_power_01"));
            }
            return;
        }
        WindowManager.CloseUI(WindowCfgs.BattleResultUI);
        BattleServer.battleStart(null, this);
        var battleUi: BattleUI = WindowManager.getUIByName(WindowCfgs.BattleUI);
        battleUi.visible = true;
        battleUi.onRightBtn();
        // BattleSceneManager.instance.replayBattle();
    }

    private onRestartBtnClick() {
        WindowManager.CloseUI(WindowCfgs.BattleResultUI);
        var battleUi: BattleUI = WindowManager.getUIByName(WindowCfgs.BattleUI);
        battleUi.visible = true;
        battleUi.resetStatus();
        BattleSceneManager.instance.replayBattle();
    }

    private onReturnBtnClick() {
        this.returnBtnClick();
    }

    /**这里点击事件包了一层 */
    private returnBtnClick() {
        WindowManager.OpenUI(WindowCfgs.GameMainUI);
        WindowManager.CloseUI(WindowCfgs.BattleResultUI);
        var battleUi: BattleUI = WindowManager.getUIByName(WindowCfgs.BattleUI);
        battleUi.visible = true;
        BattleSceneManager.instance.exitBattle();
        // WindowManager.SwitchUI(WindowCfgs.GameMainUI, WindowCfgs.BattleResultUI);
    }

    private onUpgradeBtnClick() {
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_UPGRADE, ShareOrTvManager.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, null, this);
    }

    private successCall() {
        WindowManager.OpenUI(WindowCfgs.BattleResultUI, { levelId: this.levelId, rank: 3 })
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}