"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleRoleView_1 = require("../../../battle/view/BattleRoleView");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const ChapterFunc_1 = require("../../func/ChapterFunc");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const BattleFunc_1 = require("../../func/BattleFunc");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ChapterModel_1 = require("../../model/ChapterModel");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
class ChapterListItemUI {
    static get instance() {
        if (!this._instance) {
            this._instance = new ChapterListItemUI();
        }
        return this._instance;
    }
    setItemInfo(data, level, roleSpine, chapterTxt, nameTxt, descTxt, processGroup, processTxt, enterBtn, lockGroup, lockTxt, boxRedImg) {
        var chapterId = data.id;
        chapterTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_chapter_level", null, chapterId);
        nameTxt.text = TranslateFunc_1.default.instance.getTranslate(data.name);
        descTxt.text = TranslateFunc_1.default.instance.getTranslate(data.desc);
        var unlockLevel = ChapterFunc_1.default.instance.getUnlockLevelByChapter(chapterId);
        var levelCount = data.levelNumber;
        if (level >= unlockLevel) {
            lockGroup.visible = false;
            enterBtn.visible = true;
            processGroup.visible = true;
            var pass = level - unlockLevel > levelCount ? levelCount : level - unlockLevel;
            processTxt.text = pass + "/" + levelCount;
            new ButtonUtils_1.ButtonUtils(enterBtn, this.onClickEnter, this, null, null, [chapterId]);
            var isRed = ChapterModel_1.default.instance.getIsShowRedByChapter(chapterId);
            boxRedImg.visible = isRed;
        }
        else {
            lockGroup.visible = true;
            enterBtn.visible = false;
            processGroup.visible = false;
            lockTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_chapter_openLevelTxt", null, Number(chapterId) - 1);
        }
        if (roleSpine.numChildren > 0) {
            var item = roleSpine.getChildAt(0);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + roleSpine["spineName"], item);
            roleSpine.removeChildren();
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + data.spine);
        var scale = ChapterFunc_1.default.chapterListScale || 0.75;
        var showScale = scale * BattleFunc_1.default.defaultScale;
        if (!cacheItem) {
            cacheItem = new BattleRoleView_1.default(data.spine, showScale, 9, "ChapterListItemUI");
        }
        else {
            cacheItem.setItemViewScale(showScale);
        }
        cacheItem.play("idle", true);
        roleSpine.addChild(cacheItem);
        roleSpine["spineName"] = data.spine;
    }
    /**点击进入 */
    onClickEnter(data) {
        var chapterId = data[0];
        this.showGuide_205_finish();
        WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.ChapterMapUI, WindowCfgs_1.WindowCfgs.ChapterListUI, { chapterId: chapterId });
    }
    showGuide_205_finish() {
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_2_205) {
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_2_205, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            }, this);
        }
    }
}
exports.default = ChapterListItemUI;
//# sourceMappingURL=ChapterListItemUI.js.map