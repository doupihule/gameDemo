import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import ChapterFunc from "../../func/ChapterFunc";
import ChapterListItemUI from "./ChapterListItemUI";
import UserModel from "../../model/UserModel";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import BattleFunc from "../../func/BattleFunc";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import TweenAniManager from "../../manager/TweenAniManager";
import StatisticsManager from "../../manager/StatisticsManager";


export default class ChapterListUI extends ui.gameui.chapter.ChapterListUI implements IMessage {

    private cfg: any = {};
    private cfgArr = [];
    private level;
    private firstItem;


    constructor() {
        super();
        this.cfg = ChapterFunc.instance.getAllCfgData("Chapter");
        for (var key in this.cfg) {
            this.cfgArr.push(this.cfg[key]);
        }
        new ButtonUtils(this.returnBtn, this.onClickClose, this);
        //存一遍所有的章节解锁等级
        ChapterFunc.instance.getUnlockLevelByChapter(1);
        this.chapterList.height += ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth
    }

    setData(data) {
        this.level = UserModel.instance.getMaxBattleLevel();
        var unlockInfo = ChapterFunc.instance.getUnlockTab();
        var index = 0;
        for (var key in unlockInfo) {
            if (unlockInfo[key] > this.level) break;
            index++;
        }
        this.chapterList.scrollTo(0);
        this.chapterList.array = this.cfgArr;
        this.chapterList.renderHandler = new Laya.Handler(this, this.onListRender);
        this.chapterList.scrollTo(index - 1);
        Laya.Tween.clearAll(this.enterGuideImg);
        if (data && data.showGuide) {
            this.enterGuideImg.visible = true;
            TweenAniManager.instance.addHandTween(this.enterGuideImg);
            StatisticsManager.ins.onEvent(StatisticsManager.GUIDE_10006, { level: UserModel.instance.getMaxBattleLevel() })
        } else {
            this.enterGuideImg.visible = false;
        }
    }

    private onListRender(cell: Laya.Box, index: number): void {
        var data = this.chapterList.array[index];
        cell.offAll();
        var item = cell.getChildByName("item") as Laya.Image;
        var roleSpine = item.getChildByName("roleSpine") as Laya.Image;
        var chapterTxt = item.getChildByName("chapterTxt") as Laya.Label;
        var nameTxt = item.getChildByName("nameTxt") as Laya.Label;
        var descTxt = item.getChildByName("descTxt") as Laya.Label;
        var processGroup = item.getChildByName("processGroup") as Laya.Label;
        var processTxt = processGroup.getChildByName("processTxt") as Laya.Label;
        var enterBtn = item.getChildByName("enterBtn") as Laya.Image;
        var boxRedImg = enterBtn.getChildByName("boxRedImg") as Laya.Image;
        var lockGroup = cell.getChildByName("lockGroup") as Laya.Image;
        var lockTxt = lockGroup.getChildByName("lockTxt") as Laya.Label;
        if (index == 0 && !this.firstItem) {
            this.firstItem = enterBtn;
            this.showGuide_205();
        }
        this.firstItem = enterBtn;
        //设置每个item的数据
        ChapterListItemUI.instance.setItemInfo(data, this.level, roleSpine, chapterTxt, nameTxt, descTxt, processGroup, processTxt, enterBtn, lockGroup, lockTxt, boxRedImg)
    }
    onClickClose() {
        WindowManager.SwitchUI(WindowCfgs.GameMainUI, WindowCfgs.ChapterListUI, { fromResultLevel: BattleFunc.fromBattleMain });
        BattleFunc.fromBattleMain = null;
        Laya.Tween.clearAll(this.enterGuideImg);

    }
    /**进入章节引导 */
    showGuide_205() {
        if (GuideManager.ins.recentGuideId == GuideConst.GUIDE_2_204) {
            GuideManager.ins.setGuideData(GuideConst.GUIDE_2_205, GuideManager.GuideType.Static, this.firstItem, this);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_2_205);
            this.enterGuideImg.visible = false;
        }
    }


    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}