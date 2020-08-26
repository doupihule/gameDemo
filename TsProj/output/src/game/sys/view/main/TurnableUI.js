"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const Message_1 = require("../../../../framework/common/Message");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ResourceConst_1 = require("../../consts/ResourceConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const CountsModel_1 = require("../../model/CountsModel");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const TurnableFunc_1 = require("../../func/TurnableFunc");
const UserExtModel_1 = require("../../model/UserExtModel");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const DataResourceServer_1 = require("../../server/DataResourceServer");
const RedPointConst_1 = require("../../consts/RedPointConst");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
class TurnableUI extends layaMaxUI_1.ui.gameui.main.TurnableUI {
    constructor() {
        super();
        this._isRotating = false;
        this.nowCount = 0;
        this.maxFreeCount = 3;
        //当前转盘的角度
        this.nowRotation = 0;
        this.canShare = false;
        this.canVideo = false;
        /**进度条底宽 */
        this.progressDiWidth = 399;
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onCloseBtnClick, this);
        new ButtonUtils_1.ButtonUtils(this.cjBtn, this.onClick, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        BannerAdManager_1.default.addBannerQuick(this);
        AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_Turnable, this);
        //转盘奖励初始化
        this.initRewardList();
        //界面剩余初始化
        this.freshView();
    }
    //奖励列表
    initRewardList() {
        //转盘奖励
        var rewardList = TurnableFunc_1.default.instance.getRewardList();
        for (var i = 0; i < 8; i++) {
            var rewardStr = rewardList[i];
            var rewardInfo = rewardStr.split(",");
            var type = rewardInfo[0];
            var icon;
            switch (Number(rewardInfo[0])) {
                case DataResourceFunc_1.DataResourceType.COIN:
                    icon = ResourceConst_1.default.COIN_PNG;
                    break;
                case DataResourceFunc_1.DataResourceType.GOLD:
                    icon = ResourceConst_1.default.GOLD_PNG;
                    break;
            }
            this["rewardIcon" + i].skin = icon;
            this["rewardCount" + i].changeText(StringUtils_1.default.getCoinStr(rewardInfo[1]));
        }
    }
    freshView() {
        //剩余次数
        this.maxFreeCount = GlobalParamsFunc_1.default.instance.getDataNum("luckyPlateFreeNub");
        this.nowCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.freeTurnableCount);
        this.turnCountTxt.changeText("累计次数:" + this.nowCount);
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_TURNABLE);
        if (this.nowCount < this.maxFreeCount || this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.freeGroup.visible = true;
            this.cjBtn.skin = "uisource/common/common/common_bt_anniu2.png";
            this.videoGroup.visible = false;
        }
        else if (this.freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE && this.nowCount >= this.maxFreeCount) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_PLANT_SHOW);
            this.freeGroup.visible = false;
            this.videoGroup.visible = true;
            this.cjBtn.skin = "uisource/common/common/common_bt_anniu2.png";
            this.adImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        }
        this.freshBox();
    }
    //刷新宝箱
    freshBox() {
        //累计宝箱最大次数
        var maxCount = Number(TurnableFunc_1.default.instance.getLastCount());
        this.progressImg.width = this.progressDiWidth * this.nowCount / maxCount > this.progressDiWidth ? this.progressDiWidth : this.progressDiWidth * this.nowCount / maxCount;
        if (!this.boxArr) {
            this.boxArr = [];
            var boxData = TurnableFunc_1.default.instance.getAllLuckyPlateBox();
            for (var key in boxData) {
                if (boxData.hasOwnProperty(key)) {
                    var item = boxData[key];
                    var boxImg = new Laya.Image("uisource/turnable/turnable/luckplate_icon_baoxiang" + item.plateBoxId + "_1.png");
                    boxImg.x = this.progressDiWidth * item.addUpNub / maxCount;
                    boxImg.y = -29;
                    boxImg.anchorX = 0.5;
                    boxImg.anchorY = 0.5;
                    var countTxt = new Laya.Label(item.addUpNub + "");
                    countTxt.x = this.progressDiWidth * item.addUpNub / maxCount - 8;
                    countTxt.y = 24;
                    countTxt.fontSize = 24;
                    countTxt.color = "#000000";
                    this.boxGroup.addChild(boxImg);
                    this.boxGroup.addChild(countTxt);
                    if (Number(key) != Object.keys(boxData).length) {
                        var tiao = new Laya.Image("uisource/turnable/turnable/video_image_jindu3.png");
                        tiao.x = this.progressDiWidth * item.addUpNub / maxCount;
                        tiao.y = 0;
                        this.boxGroup.addChild(tiao);
                    }
                    this.boxArr.push({
                        img: boxImg,
                        count: item.addUpNub,
                        index: item.plateBoxId,
                        reward: item.boxReward,
                    });
                }
            }
        }
        for (var i = 0; i < this.boxArr.length; i++) {
            var item = this.boxArr[i];
            item.img.touchEnabled = false;
            var receiveCount = UserExtModel_1.default.instance.getBoxGetCount(item.index);
            if (this.nowCount >= item.count && receiveCount) {
                item.img.skin = "uisource/turnable/turnable/luckplate_icon_baoxiang" + item.index + "_2.png";
                Laya.Tween.clearAll(item.img);
            }
            else {
                item.img.skin = "uisource/turnable/turnable/luckplate_icon_baoxiang" + item.index + "_1.png";
                item.img.mouseEnabled = true;
                if (this.nowCount >= item.count && !receiveCount) {
                    Laya.Tween.clearAll(item.img);
                    item.img.scaleX = item.img.scaleY = 1;
                    new ButtonUtils_1.ButtonUtils(item.img, this.onClickBoxItem, this, null, null, item).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
                }
                else {
                    if (!item.img.hasListener(Laya.Event.MOUSE_DOWN)) {
                        new ButtonUtils_1.ButtonUtils(item.img, this.onClickBoxItem, this, null, null, item);
                    }
                }
            }
        }
    }
    onClickBoxItem(item) {
        item.img.mouseEnabled = false;
        var isCanReceive = false;
        if (this.nowCount >= item.count) {
            isCanReceive = true;
        }
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.BoxInfoUI, {
            callBack: this.freshBox,
            thisObj: this,
            item: item,
            isCanReceive: isCanReceive
        });
    }
    onClick() {
        if (this.nowCount >= this.maxFreeCount && this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_counts_limit_lab"));
            return;
        }
        if (this._isRotating) {
            return;
        }
        this._isRotating = true;
        //免费抽
        if (this.nowCount < this.maxFreeCount) {
            DataResourceServer_1.default.getTurnTableReward({}, this.startRotate, this);
            var nowCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.freeTurnableCount);
            if (nowCount == this.maxFreeCount) {
                //刷新主界面气泡显示
                Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_TURNTABLE);
            }
        }
        //视频或者分享抽
        else {
            //刷新主界面气泡显示
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_TURNTABLE);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_PLANT_CLICK);
            }
            ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_TURNABLE, ShareOrTvManager_1.default.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, this.successfull, this.closefull, this);
        }
    }
    successfull() {
        DataResourceServer_1.default.getTurnTableReward({}, this.startRotate, this);
        //打点
        if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_TURNTABLE_FINISH);
        }
        else {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_PLANTSUCEEDNUB);
        }
    }
    closefull() {
        this._isRotating = false;
        this.freshView();
        WindowManager_1.default.ShowTip("看完视频才能抽奖");
    }
    //开始旋转
    startRotate(data) {
        if (data.error) {
            this._isRotating = false;
            return;
        }
        ;
        var index = data.data.randValue;
        //初始化角度
        this.nowRotation = this.nowRotation % 360;
        this.rotateGroup.rotation = this.nowRotation;
        this.zpZhenImg.rotation = 0;
        var speedUpRotation = 360 + this.nowRotation; //加速过程旋转的角度
        var time0 = 1163; //加速时间
        var constantSpeedRotation = speedUpRotation + 7 * 360; //匀速时转的角度  (30为图片角度偏差)
        var time1 = 1467; //匀速旋转时间
        var slowDownRotation = index * 45 - this.nowRotation + 360 + constantSpeedRotation; //减速时旋转角度（转到服务器指定的奖励）     
        var time2 = 421; //减速时间
        Laya.Tween.to(this.rotateGroup, { rotation: speedUpRotation }, time0, Laya.Ease.circIn, Laya.Handler.create(this, () => {
            Laya.Tween.to(this.rotateGroup, { rotation: constantSpeedRotation }, time1, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.rotateGroup, { rotation: slowDownRotation }, time2, Laya.Ease.circOut, Laya.Handler.create(this, () => {
                    TimerManager_1.default.instance.setTimeout(() => {
                        this._isRotating = false;
                        this.nowRotation = this.rotateGroup.rotation;
                        this.freshView();
                        this.showRewardView(index);
                    }, this, 300);
                }));
            }));
        }));
    }
    //显示奖励，转盘转完再加奖励
    showRewardView(index) {
        var rewardData = TurnableFunc_1.default.instance.getRewardList();
        var rewardInfo = rewardData[index].split(",");
        DataResourceServer_1.default.getReward({ "reward": [Number(rewardInfo[0]), rewardInfo[1]] });
        if (Number(rewardInfo[0]) == DataResourceFunc_1.DataResourceType.COIN) {
            WindowManager_1.default.ShowTip("获得金币 x" + StringUtils_1.default.getCoinStr(rewardInfo[1]));
        }
        else if (Number(rewardInfo[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
            WindowManager_1.default.ShowTip("获得钻石 x" + rewardInfo[1]);
        }
    }
    onCloseBtnClick() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TurnableUI);
        this.callBack && this.callBack.call(this.thisObj);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = TurnableUI;
//# sourceMappingURL=TurnableUI.js.map