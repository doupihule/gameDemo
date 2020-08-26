import BattleRoleView from "../../../battle/view/BattleRoleView";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import LogsManager from "../../../../framework/manager/LogsManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ChapterFunc from "../../func/ChapterFunc";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleFunc from "../../func/BattleFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import ChapterModel from "../../model/ChapterModel";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";



export default class ChapterListItemUI {

    static _instance: ChapterListItemUI;
    static get instance() {
        if (!this._instance) {
            this._instance = new ChapterListItemUI();
        }
        return this._instance;
    }

    public setItemInfo(data, level, roleSpine: Laya.Image, chapterTxt: Laya.Label, nameTxt, descTxt, processGroup, processTxt, enterBtn, lockGroup: Laya.Image, lockTxt, boxRedImg: Laya.Image) {
        var chapterId = data.id
        chapterTxt.text = TranslateFunc.instance.getTranslate("#tid_chapter_level", null, chapterId);
        nameTxt.text = TranslateFunc.instance.getTranslate(data.name);
        descTxt.text = TranslateFunc.instance.getTranslate(data.desc);
        var unlockLevel = ChapterFunc.instance.getUnlockLevelByChapter(chapterId);
        var levelCount = data.levelNumber;
        if (level >= unlockLevel) {
            lockGroup.visible = false;
            enterBtn.visible = true;
            processGroup.visible = true;
            var pass = level - unlockLevel > levelCount ? levelCount : level - unlockLevel;
            processTxt.text = pass + "/" + levelCount;
            new ButtonUtils(enterBtn, this.onClickEnter, this, null, null, [chapterId]);
            var isRed = ChapterModel.instance.getIsShowRedByChapter(chapterId);
            boxRedImg.visible = isRed;
        } else {
            lockGroup.visible = true;
            enterBtn.visible = false;
            processGroup.visible = false;
            lockTxt.text = TranslateFunc.instance.getTranslate("#tid_chapter_openLevelTxt", null, Number(chapterId) - 1)
        }
        if (roleSpine.numChildren > 0) {
            var item = roleSpine.getChildAt(0);
            PoolTools.cacheItem(PoolCode.POOL_ROLE + roleSpine["spineName"], item);
            roleSpine.removeChildren();
        }
        var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + data.spine);
        var scale = ChapterFunc.chapterListScale || 0.75;
        var showScale = scale * BattleFunc.defaultScale;
        if (!cacheItem) {
            cacheItem = new BattleRoleView(data.spine, showScale, 9, "ChapterListItemUI");
        } else {
            cacheItem.setItemViewScale(showScale);
        }
        cacheItem.play("idle", true)
        roleSpine.addChild(cacheItem)
        roleSpine["spineName"] = data.spine;

    }
    /**点击进入 */
    onClickEnter(data) {
        var chapterId = data[0];
        this.showGuide_205_finish();
        WindowManager.SwitchUI(WindowCfgs.ChapterMapUI, WindowCfgs.ChapterListUI, { chapterId: chapterId })
    }
    showGuide_205_finish() {
        if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_2_205) {
            GuideManager.ins.guideFin(GuideConst.GUIDE_2_205, () => {
                WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
            }, this)
        }
    }
}