"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const BattleFunc_1 = require("../../func/BattleFunc");
const UserModel_1 = require("../../model/UserModel");
const GameUtils_1 = require("../../../../utils/GameUtils");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const CountsModel_1 = require("../../model/CountsModel");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const PieceServer_1 = require("../../server/PieceServer");
const Message_1 = require("../../../../framework/common/Message");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const RedPointConst_1 = require("../../consts/RedPointConst");
const BigNumUtils_1 = require("../../../../framework/utils/BigNumUtils");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
class EquipPieceGetUI extends layaMaxUI_1.ui.gameui.shop.EquipPieceGetUI {
    constructor() {
        super();
        this.init = false;
        new ButtonUtils_1.ButtonUtils(this.goldCostBtn, this.onClickGold, this);
        new ButtonUtils_1.ButtonUtils(this.freeGetBtn, this.onClickFree, this);
        new ButtonUtils_1.ButtonUtils(this.btn_getReward, this.onClickAd, this);
    }
    setData(shop) {
        this.type = null;
        this.init = false;
        this.shopUI = shop;
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        var data = BattleFunc_1.default.instance.getAllCfgData("Lottery");
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
        if (UserModel_1.default.instance.getMainGuide() == 7 && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_4_408) {
            this.shopUI.ctn.vScrollBar.setScroll(0, 100000, this.y);
            TimerManager_1.default.instance.setTimeout(() => {
                GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_4_409, GuideManager_1.default.GuideType.Static, this.freeGetBtn, this.shopUI);
                GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_4_409, this.showGuide_409_finish, this);
            }, this, 200);
        }
        else {
            AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_EquipPieceGet, this);
        }
    }
    showGuide_409_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_4_409, () => {
            this.onClickFree();
        }, this, true);
    }
    initGoldBox() {
        this.goldCost = GlobalParamsFunc_1.default.instance.getDataNum("lotteryPrice");
        this.costNumTxt.text = this.goldCost + "";
    }
    initVideoBox() {
        var freeGetCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.equipPieceFreeGet);
        if (!freeGetCount) {
            this.freeGroup.visible = true;
            this.btn_getReward.visible = false;
        }
        else {
            this.freeGroup.visible = false;
            this.btn_getReward.visible = true;
            this.freeCount = GlobalParamsFunc_1.default.instance.getDataNum("maxVideoLottery");
            this.type = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_EQUIP_GET);
            if (this.type != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                this.img_adv.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.type);
            }
            this.videoCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.equipPieceAdCount);
            this.adCountTxt.text = (this.freeCount - this.videoCount) + "/" + this.freeCount;
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_VIDEOPIECE_SHOW, { count: this.videoCount + 1 });
        }
    }
    onClickGold() {
        if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getGiftGold(), this.goldCost)) {
            WindowManager_1.default.ShowTip("钻石不足");
            return;
        }
        this.goldReward = GameUtils_1.default.getWeightItem(this.info.goldReward);
        PieceServer_1.default.getPieces({ type: "gold", reward: this.goldReward, gold: this.goldCost }, () => {
            this.showDouble(this.goldReward);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.PIECE_GOLD, { reward: this.goldReward });
        }, this);
    }
    onClickFree() {
        this.adReward = GameUtils_1.default.getWeightItem(this.info.videoReward);
        PieceServer_1.default.getPieces({ type: "free", reward: this.adReward }, () => {
            this.showDouble(this.adReward);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.PIECE_FREE, { reward: this.adReward });
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_EQUIP);
            this.initVideoBox();
        }, this);
    }
    onClickAd() {
        if (CountsModel_1.default.instance.getCountsById(CountsModel_1.default.equipPieceAdCount) >= this.freeCount) {
            WindowManager_1.default.ShowTip("今日可领取次数已达上限，请明日再来");
            return;
        }
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_VIDEOPIECE_CLICK, { count: this.videoCount + 1 });
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_EQUIP_GET, ShareOrTvManager_1.default.TYPE_ADV, { id: 1, extraData: {} }, this.successCallBack, this.failCall, this);
    }
    successCallBack() {
        if (this.type == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_VIDEOPIECE_FINISH, { count: this.videoCount + 1, reward: this.adReward });
        }
        else {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_VIDEOPIECE_FINISH, { count: this.videoCount + 1, reward: this.adReward });
        }
        this.adReward = GameUtils_1.default.getWeightItem(this.info.videoReward);
        PieceServer_1.default.getPieces({ type: "ad", reward: this.adReward }, () => {
            this.showDouble(this.adReward);
            this.initVideoBox();
        }, this);
    }
    failCall() {
    }
    showDouble(reward) {
        var params = {
            succCall: this.successCall.bind(this, reward),
            reward: reward,
            params: {},
            shareName: ShareTvOrderFunc_1.default.SHARELINE_EQUIP_GET_DOUBLE
        };
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ComRewardDoubleUI, params);
    }
    successCall(reward) {
        PieceServer_1.default.onlyGetPiece({ reward: reward });
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.EquipPieceGetUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = EquipPieceGetUI;
//# sourceMappingURL=EquipPieceGetUI.js.map