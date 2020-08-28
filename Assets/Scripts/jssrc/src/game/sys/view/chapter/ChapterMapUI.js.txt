"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ChapterLogicControler_1 = require("../../../chapter/controler/ChapterLogicControler");
const ResourceShowUI_1 = require("../main/ResourceShowUI");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const TaskGuideTrigger_1 = require("../../trigger/TaskGuideTrigger");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const MainJumpReturnComp_1 = require("../../../../framework/platform/comp/MainJumpReturnComp");
class ChapterMapUI extends layaMaxUI_1.ui.gameui.chapter.ChapterMapUI {
    constructor() {
        super();
        this.ctn.on(Laya.Event.MOUSE_DOWN, this, this.onTouchBegin);
        this.ctn.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove);
        this.ctn.on(Laya.Event.MOUSE_UP, this, this.onTouchUp);
        new ButtonUtils_1.ButtonUtils(this.returnBtn, this.onClickClose, this);
        ScreenAdapterTools_1.default.alignNotch(this.topGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
        this.resouceShow = new ResourceShowUI_1.ResourceShowUI(this.coinNum, this.goldNum, this.powerCountLab, this.powerTimerLab, this.addCoinBtn, this.addGoldBtn, this.addSpBtn);
    }
    setData(data) {
        this.returnGuideGroup.visible = false;
        this.chapterControler = new ChapterLogicControler_1.default(this.ctn, this);
        this.chapterControler.setData(data.chapterId);
        this.resouceShow.countPower();
        this.resouceShow.refreshMoney();
        if (data.targetName && this.chapterControler) {
            this.showChapterGuide(data.targetName);
        }
        MainJumpReturnComp_1.default.instance.showJumpReturnBtn(this);
    }
    showChapterGuide(name) {
        var enemyArr = this.chapterControler.enemyArr;
        var target;
        for (var i = 0; i < enemyArr.length; i++) {
            var item = enemyArr[i];
            if (item.levelName == name) {
                target = item;
                break;
            }
        }
        if (target) {
            this.chapterControler.chapterCameraControler.focusPos.y = target.y;
            this.chapterControler.chapterCameraControler.inControlBg = true;
            this.chapterControler.chapterCameraControler.updateCtnPos(1);
            TimerManager_1.default.instance.setTimeout(() => {
                var fromX = target.x - (ScreenAdapterTools_1.default.maxWidth - ScreenAdapterTools_1.default.designWidth) / 2 + ScreenAdapterTools_1.default.UIOffsetX + ScreenAdapterTools_1.default.sceneOffsetX;
                var fromY = target.y + this.chapterControler.chapterLayerControler.a2.y - target.height;
                TaskGuideTrigger_1.default.showGuide_1(fromX, fromY, this.closeGuide_1Back, this);
            }, this, 200);
        }
    }
    closeGuide_1Back() {
        if (this.chapterControler.player) {
            this.chapterControler.chapterCameraControler.focusPos.y = this.chapterControler.player.pos.y;
            this.chapterControler.chapterCameraControler.updateCtnPos(1);
        }
    }
    onTouchBegin(event) {
        this.chapterControler.chapterLayerControler.onTouchBegin(event);
    }
    onTouchMove(event) {
        this.chapterControler.chapterLayerControler.onTouchMove(event);
    }
    onTouchUp(event) {
        this.chapterControler.chapterLayerControler.onTouchUp(event);
    }
    onClickClose() {
        this.chapterControler.exitChapter();
        Laya.Tween.clearTween(this.handImg);
        WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.ChapterListUI, WindowCfgs_1.WindowCfgs.ChapterMapUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = ChapterMapUI;
//# sourceMappingURL=ChapterMapUI.js.map