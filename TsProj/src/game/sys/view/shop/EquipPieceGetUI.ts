import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import BattleFunc from "../../func/BattleFunc";
import UserModel from "../../model/UserModel";
import GameUtils from "../../../../utils/GameUtils";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import CountsModel from "../../model/CountsModel";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import PieceServer from "../../server/PieceServer";
import Message from "../../../../framework/common/Message";
import GameMainEvent from "../../event/GameMainEvent";
import RedPointConst from "../../consts/RedPointConst";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import StatisticsManager from "../../manager/StatisticsManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";
import MainShopUI from "./MainShopUI";
import { time } from "console";
import TimerManager from "../../../../framework/manager/TimerManager";

export default class EquipPieceGetUI extends ui.gameui.shop.EquipPieceGetUI implements IMessage {

    private info;
    private goldReward;
    private adReward;
    private goldCost;
    private freeCount;
    private type;
    private videoCount;
    private init = false;
    private shopUI: MainShopUI
    constructor() {
        super();
        new ButtonUtils(this.goldCostBtn, this.onClickGold, this);
        new ButtonUtils(this.freeGetBtn, this.onClickFree, this);
        new ButtonUtils(this.btn_getReward, this.onClickAd, this);
    }

    public setData(shop) {
        this.type = null;
        this.init = false;
        this.shopUI = shop
        var level = UserModel.instance.getMaxBattleLevel();
        var data = BattleFunc.instance.getAllCfgData("Lottery");
        var item;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (Number(key) <= level) {
                    item = data[key];
                }
            }
        }
        this.info = item;
        this.initGoldBox();
        this.initVideoBox();
        this.showGuide_409();
    }
    /**免费抽取引导 */
    showGuide_409() {
        if (UserModel.instance.getMainGuide() == 7 && GuideManager.ins.recentGuideId == GuideConst.GUIDE_4_408) {
            this.shopUI.ctn.vScrollBar.setScroll(0, 100000, this.y)
            TimerManager.instance.setTimeout(() => {
                GuideManager.ins.setGuideData(GuideConst.GUIDE_4_409, GuideManager.GuideType.Static, this.freeGetBtn, this.shopUI);
                GuideManager.ins.openGuideUI(GuideConst.GUIDE_4_409, this.showGuide_409_finish, this)
            }, this, 200)
        } else {
            AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_EquipPieceGet, this);
        }
    }
    showGuide_409_finish() {
        GuideManager.ins.guideFin(GuideConst.GUIDE_4_409, () => {
            this.onClickFree();

        }, this, true);
    }
    initGoldBox() {
        this.goldCost = GlobalParamsFunc.instance.getDataNum("lotteryPrice");
        this.costNumTxt.text = this.goldCost + ""
    }
    initVideoBox() {
        var freeGetCount = CountsModel.instance.getCountsById(CountsModel.equipPieceFreeGet);
        if (!freeGetCount) {
            this.freeGroup.visible = true;
            this.btn_getReward.visible = false;

        } else {
            this.freeGroup.visible = false;
            this.btn_getReward.visible = true;
            this.freeCount = GlobalParamsFunc.instance.getDataNum("maxVideoLottery");
            this.type = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_EQUIP_GET);
            if (this.type != ShareOrTvManager.TYPE_QUICKRECEIVE) {
                this.img_adv.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.type);
            }
            this.videoCount = CountsModel.instance.getCountsById(CountsModel.equipPieceAdCount)
            this.adCountTxt.text = (this.freeCount - this.videoCount) + "/" + this.freeCount;
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_VIDEOPIECE_SHOW, { count: this.videoCount + 1 })
        }

    }
    onClickGold() {
        if (!BigNumUtils.compare(UserModel.instance.getGiftGold(), this.goldCost)) {
            WindowManager.ShowTip("钻石不足");
            return;
        }
        this.goldReward = GameUtils.getWeightItem(this.info.goldReward);
        PieceServer.getPieces({ type: "gold", reward: this.goldReward, gold: this.goldCost }, () => {
            this.showDouble(this.goldReward)
            StatisticsManager.ins.onEvent(StatisticsManager.PIECE_GOLD, { reward: this.goldReward })
        }, this)

    }
    onClickFree() {
        this.adReward = GameUtils.getWeightItem(this.info.videoReward);
        PieceServer.getPieces({ type: "free", reward: this.adReward }, () => {
            this.showDouble(this.adReward)
            StatisticsManager.ins.onEvent(StatisticsManager.PIECE_FREE, { reward: this.adReward })
            Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, RedPointConst.POINT_MAIN_EQUIP);
            this.initVideoBox();
        }, this)

    }
    onClickAd() {
        if (CountsModel.instance.getCountsById(CountsModel.equipPieceAdCount) >= this.freeCount) {
            WindowManager.ShowTip("今日可领取次数已达上限，请明日再来");
            return;
        }
        StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_VIDEOPIECE_CLICK, { count: this.videoCount + 1 })
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_EQUIP_GET, ShareOrTvManager.TYPE_ADV, { id: 1, extraData: {} }, this.successCallBack, this.failCall, this)

    }
    successCallBack() {
        if (this.type == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_VIDEOPIECE_FINISH, { count: this.videoCount + 1, reward: this.adReward })
        } else {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_VIDEOPIECE_FINISH, { count: this.videoCount + 1, reward: this.adReward })
        }
        this.adReward = GameUtils.getWeightItem(this.info.videoReward);
        PieceServer.getPieces({ type: "ad", reward: this.adReward }, () => {
            this.showDouble(this.adReward)
            this.initVideoBox();
        }, this)
    }
    failCall() {

    }
    showDouble(reward) {
        var params = {
            succCall: this.successCall.bind(this, reward),
            reward: reward,
            params: {},
            shareName: ShareTvOrderFunc.SHARELINE_EQUIP_GET_DOUBLE
        };
        WindowManager.OpenUI(WindowCfgs.ComRewardDoubleUI, params);
    }
    successCall(reward) {
        PieceServer.onlyGetPiece({ reward: reward });

    }
    close() {
        WindowManager.CloseUI(WindowCfgs.EquipPieceGetUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}