"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ChapterFunc_1 = require("../../func/ChapterFunc");
const ChapterListItemUI_1 = require("./ChapterListItemUI");
const UserModel_1 = require("../../model/UserModel");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const BattleFunc_1 = require("../../func/BattleFunc");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const TweenAniManager_1 = require("../../manager/TweenAniManager");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
class ChapterListUI extends layaMaxUI_1.ui.gameui.chapter.ChapterListUI {
    constructor() {
        super();
        this.cfg = {};
        this.cfgArr = [];
        this.cfg = ChapterFunc_1.default.instance.getAllCfgData("Chapter");
        for (var key in this.cfg) {
            this.cfgArr.push(this.cfg[key]);
        }
        new ButtonUtils_1.ButtonUtils(this.returnBtn, this.onClickClose, this);
        //存一遍所有的章节解锁等级
        ChapterFunc_1.default.instance.getUnlockLevelByChapter(1);
        this.chapterList.height += ScreenAdapterTools_1.default.height - ScreenAdapterTools_1.default.designHeight - ScreenAdapterTools_1.default.toolBarWidth;
    }
    setData(data) {
        this.level = UserModel_1.default.instance.getMaxBattleLevel();
        var unlockInfo = ChapterFunc_1.default.instance.getUnlockTab();
        var index = 0;
        for (var key in unlockInfo) {
            if (unlockInfo[key] > this.level)
                break;
            index++;
        }
        this.chapterList.scrollTo(0);
        this.chapterList.array = this.cfgArr;
        this.chapterList.renderHandler = new Laya.Handler(this, this.onListRender);
        this.chapterList.scrollTo(index - 1);
        Laya.Tween.clearAll(this.enterGuideImg);
        if (data && data.showGuide) {
            this.enterGuideImg.visible = true;
            TweenAniManager_1.default.instance.addHandTween(this.enterGuideImg);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_10006, { level: UserModel_1.default.instance.getMaxBattleLevel() });
        }
        else {
            this.enterGuideImg.visible = false;
        }
    }
    onListRender(cell, index) {
        var data = this.chapterList.array[index];
        cell.offAll();
        var item = cell.getChildByName("item");
        var roleSpine = item.getChildByName("roleSpine");
        var chapterTxt = item.getChildByName("chapterTxt");
        var nameTxt = item.getChildByName("nameTxt");
        var descTxt = item.getChildByName("descTxt");
        var processGroup = item.getChildByName("processGroup");
        var processTxt = processGroup.getChildByName("processTxt");
        var enterBtn = item.getChildByName("enterBtn");
        var boxRedImg = enterBtn.getChildByName("boxRedImg");
        var lockGroup = cell.getChildByName("lockGroup");
        var lockTxt = lockGroup.getChildByName("lockTxt");
        if (index == 0 && !this.firstItem) {
            this.firstItem = enterBtn;
            this.showGuide_205();
        }
        this.firstItem = enterBtn;
        //设置每个item的数据
        ChapterListItemUI_1.default.instance.setItemInfo(data, this.level, roleSpine, chapterTxt, nameTxt, descTxt, processGroup, processTxt, enterBtn, lockGroup, lockTxt, boxRedImg);
    }
    onClickClose() {
        WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.GameMainUI, WindowCfgs_1.WindowCfgs.ChapterListUI, { fromResultLevel: BattleFunc_1.default.fromBattleMain });
        BattleFunc_1.default.fromBattleMain = null;
        Laya.Tween.clearAll(this.enterGuideImg);
    }
    /**进入章节引导 */
    showGuide_205() {
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_2_204) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_2_205, GuideManager_1.default.GuideType.Static, this.firstItem, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_2_205);
            this.enterGuideImg.visible = false;
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = ChapterListUI;
//# sourceMappingURL=ChapterListUI.js.map