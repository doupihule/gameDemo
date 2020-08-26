"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FogInstanceBasic_1 = require("../../fog/instance/FogInstanceBasic");
const ButtonUtils_1 = require("../../../framework/utils/ButtonUtils");
const UserModel_1 = require("../../sys/model/UserModel");
const ResourceConst_1 = require("../../sys/consts/ResourceConst");
const ChapterModel_1 = require("../../sys/model/ChapterModel");
const ChapterConst_1 = require("../../sys/consts/ChapterConst");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const ChapterFunc_1 = require("../../sys/func/ChapterFunc");
const TimerManager_1 = require("../../../framework/manager/TimerManager");
const ChapterServer_1 = require("../../sys/server/ChapterServer");
const TweenAniManager_1 = require("../../sys/manager/TweenAniManager");
const ScreenAdapterTools_1 = require("../../../framework/utils/ScreenAdapterTools");
const DataResourceFunc_1 = require("../../sys/func/DataResourceFunc");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
const ShareTvOrderFunc_1 = require("../../sys/func/ShareTvOrderFunc");
/**章节宝箱 */
class ChapInstanceBox extends FogInstanceBasic_1.default {
    constructor(fogControler) {
        super(fogControler);
        this.timeCode = 0;
        this.anchorX = 0.5;
        this.anchorY = 1;
        this.width = 200;
        this.height = 200;
        this.boxImg = new Laya.Image();
        this.boxImg.anchorX = 0.5;
        this.boxImg.anchorY = 0.5;
        this.boxImg.width = 79;
        this.boxImg.height = 95;
        this.boxImg.x = this.width / 2;
        this.boxImg.y = this.height - this.boxImg.height / 2;
        this.boxParent = new Laya.Image();
        this.boxParent.anchorX = 0.5;
        this.boxParent.anchorY = 1;
        this.boxParent.width = 200;
        this.boxParent.height = 200;
        this.redImg = new Laya.Image(ResourceConst_1.default.COMMON_REDPOINT);
        this.redImg.x = this.boxImg.x + this.boxImg.width / 2;
        this.redImg.y = this.boxImg.y - this.boxImg.height / 2;
        this.boxParent.x = this.width / 2;
        this.boxParent.y = this.height;
        this.boxParent.addChild(this.boxImg);
        this.addChild(this.boxParent);
        this.addChild(this.redImg);
        new ButtonUtils_1.ButtonUtils(this, this.onClickItem, this);
    }
    setData(data) {
        this.boxIndex = data.index;
        this.boxId = data.boxId;
        this.reward = ChapterFunc_1.default.instance.getCfgDatasByKey("ChapterBox", this.boxId, "reward");
        this.passLevel = this.fogControler.chapterId + "-" + data.startIndex;
        this.type = ChapterConst_1.default.Chapter_boxState_lock;
        this.levelId = data.levelId;
        this.freshInfo();
    }
    /**设置方向 */
    setItemViewWay(value) {
        this.viewWay = value;
        this.boxParent.scaleX = value;
    }
    onClickItem() {
        var desc = TranslateFunc_1.default.instance.getTranslate("#tid_chapter_boxReceiveTip", null, this.passLevel);
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChapterBoxRewardUI, { shareName: ShareTvOrderFunc_1.default.SHARELINE_CHAPTERBOX_REWARD, doubleRate: ChapterFunc_1.default.ChapterBoxDouble, type: this.type, desc: desc, reward: this.reward, thisObj: this, callBack: this.receiveReward, params: { chapterId: this.fogControler.chapterId, boxId: this.boxId } });
    }
    //记录宝箱的领取状态
    receiveReward() {
        ChapterServer_1.default.updateBoxState({ chapterId: this.fogControler.chapterId, boxId: this.boxIndex }, this.freshInfo, this);
        this.fogControler.doPlayerMove();
        this.doFly();
    }
    doFly() {
        var fromX = this.x - (ScreenAdapterTools_1.default.maxWidth - ScreenAdapterTools_1.default.designWidth) / 2 + ScreenAdapterTools_1.default.UIOffsetX + ScreenAdapterTools_1.default.sceneOffsetX;
        var fromY = this.y + this.fogControler.chapterLayerControler.a2.y;
        var target;
        var txt;
        var ui = this.fogControler.chapMapUI;
        for (var i = 0; i < this.reward.length; i++) {
            var item = this.reward[i].split(",");
            if (Number(item[0]) == DataResourceFunc_1.DataResourceType.COIN) {
                target = ui.coinImg;
                txt = ui.coinNum;
            }
            else if (Number(item[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
                target = ui.goldImg;
                txt = ui.goldNum;
            }
            else if (Number(item[0]) == DataResourceFunc_1.DataResourceType.SP) {
                target = ui.spImg;
                txt = ui.powerCountLab;
            }
            TweenAniManager_1.default.instance.resourceFlyAni(item, fromX, fromY, ui, target, txt);
        }
    }
    /**刷新宝箱状态 */
    freshInfo() {
        this.boxImg.skin = ResourceConst_1.default.CHAPTER_REWARD_BOXCLOSE;
        this.redImg.visible = false;
        TimerManager_1.default.instance.remove(this.timeCode);
        Laya.Tween.clearTween(this.boxImg);
        this.boxImg.rotation = 0;
        if (this.levelId <= UserModel_1.default.instance.getMaxBattleLevel()) {
            //已解锁
            var isReceive = ChapterModel_1.default.instance.getChapterRewardBox(this.fogControler.chapterId, this.boxIndex);
            if (isReceive) {
                //已领取
                this.boxImg.skin = ResourceConst_1.default.CHAPTER_REWARD_BOXOPEN;
                this.type = ChapterConst_1.default.Chapter_boxState_receive;
            }
            else {
                //未领取
                this.redImg.visible = true;
                this.type = ChapterConst_1.default.Chapter_boxState_unlock;
                this.timeCode = TimerManager_1.default.instance.add(this.fogControler.scaleAni, this, 1400, Number.MAX_VALUE, false, [this.boxImg]);
            }
        }
    }
    //销毁函数.
    dispose() {
        TimerManager_1.default.instance.remove(this.timeCode);
        Laya.Tween.clearTween(this.boxImg);
        this.removeSelf();
        this.fogControler = null;
    }
    //从舞台移除
    onSetToCache() {
        this.removeSelf();
    }
}
exports.default = ChapInstanceBox;
//# sourceMappingURL=ChapInstanceBox.js.map