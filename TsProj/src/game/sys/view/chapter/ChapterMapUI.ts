import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogFunc from "../../func/FogFunc";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import FogPropTrigger from "../../../fog/trigger/FogPropTrigger";
import ChapterFunc from "../../func/ChapterFunc";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import LogsManager from "../../../../framework/manager/LogsManager";
import ChapterListItemUI from "./ChapterListItemUI";
import UserModel from "../../model/UserModel";
import ChapterLogicControler from "../../../chapter/controler/ChapterLogicControler";
import { ResourceShowUI } from "../main/ResourceShowUI";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import TaskGuideTrigger from "../../trigger/TaskGuideTrigger";
import TimerManager from "../../../../framework/manager/TimerManager";
import MainJumpReturnComp from "../../../../framework/platform/comp/MainJumpReturnComp";


export default class ChapterMapUI extends ui.gameui.chapter.ChapterMapUI implements IMessage {

    public chapterControler: ChapterLogicControler;
    public resouceShow: ResourceShowUI;

    constructor() {
        super();
        this.ctn.on(Laya.Event.MOUSE_DOWN, this, this.onTouchBegin)
        this.ctn.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove)
        this.ctn.on(Laya.Event.MOUSE_UP, this, this.onTouchUp)
        new ButtonUtils(this.returnBtn, this.onClickClose, this);
        ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);
        this.resouceShow = new ResourceShowUI(this.coinNum, this.goldNum, this.powerCountLab, this.powerTimerLab, this.addCoinBtn, this.addGoldBtn, this.addSpBtn);

    }

    setData(data) {
        this.returnGuideGroup.visible = false;
        this.chapterControler = new ChapterLogicControler(this.ctn, this);
        this.chapterControler.setData(data.chapterId);
        this.resouceShow.countPower();
        this.resouceShow.refreshMoney();
        if (data.targetName && this.chapterControler) {
            this.showChapterGuide(data.targetName);
        }
        MainJumpReturnComp.instance.showJumpReturnBtn(this);
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
            this.chapterControler.chapterCameraControler.updateCtnPos(1)
            TimerManager.instance.setTimeout(() => {
                var fromX = target.x - (ScreenAdapterTools.maxWidth - ScreenAdapterTools.designWidth) / 2 + ScreenAdapterTools.UIOffsetX + ScreenAdapterTools.sceneOffsetX;
                var fromY = target.y + this.chapterControler.chapterLayerControler.a2.y - target.height;
                TaskGuideTrigger.showGuide_1(fromX, fromY, this.closeGuide_1Back, this)
            }, this, 200)

        }
    }
    closeGuide_1Back() {
        if (this.chapterControler.player) {
            this.chapterControler.chapterCameraControler.focusPos.y = this.chapterControler.player.pos.y;
            this.chapterControler.chapterCameraControler.updateCtnPos(1)
        }
    }

    onTouchBegin(event) {
        this.chapterControler.chapterLayerControler.onTouchBegin(event)
    }
    onTouchMove(event) {
        this.chapterControler.chapterLayerControler.onTouchMove(event)

    }
    onTouchUp(event) {
        this.chapterControler.chapterLayerControler.onTouchUp(event)

    }
    onClickClose() {
        this.chapterControler.exitChapter();
        Laya.Tween.clearTween(this.handImg);
        WindowManager.SwitchUI(WindowCfgs.ChapterListUI, WindowCfgs.ChapterMapUI)
    }


    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}