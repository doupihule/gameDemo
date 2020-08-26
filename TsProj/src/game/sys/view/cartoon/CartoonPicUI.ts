import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ui } from "../../../../ui/layaMaxUI";
import TweenAniManager from "../../manager/TweenAniManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import StatisticsManager from "../../manager/StatisticsManager";

/**卡通漫画 */
export default class CartoonPicUI extends ui.gameui.cartoon.CartoonPicUI implements IMessage {


    private timeOut = 0;
    private timeOffest = 500;
    private curIndex = 1;
    private guideTab = {
        1: StatisticsManager.GUIDE_0_1,
        2: StatisticsManager.GUIDE_0_2,
        3: StatisticsManager.GUIDE_0_3,
        4: StatisticsManager.GUIDE_0_4,
    }
    constructor() {
        super();
        this.initBtn();
        //延时300毫秒加载战斗背景和基地 
        TimerManager.instance.setTimeout(this.delayLoadSource, this, 300)
    }

    initBtn() {
        this.on(Laya.Event.MOUSE_DOWN, this, this.onClickBg)
        new ButtonUtils(this.closeBtn, this.close, this)
    }
    //初始化
    setData(data) {
        this.timeOffest = GlobalParamsFunc.instance.getDataNum("comicPlayTime")
        this.curIndex = 1;
        this.timeOut = 0;
        this.continueTxt.visible = false;

        for (var i = 1; i < 5; i++) {
            var item = this.picCtn.getChildByName("item" + i) as Laya.Image;
            item.alpha = 0;
            var img = item.getChildByName("img" + i) as Laya.Image;
            img.alpha = 0;
            var txt = item.getChildByName("txt" + i) as Laya.Image;
            if (txt) {
                txt.alpha = 0;
            }
            TimerManager.instance.setTimeout((data) => {
                var delay = 0
                if (this.curIndex != 1) {
                    delay = this.timeOffest - 200;
                }
                TweenAniManager.instance.fadeInAni(data.item, null, delay)
                TweenAniManager.instance.fadeInAni(data.img, null, delay)
                if (this.curIndex == 4) {
                    this.hideOther();
                }
                StatisticsManager.ins.onEvent(this.guideTab[this.curIndex])
            }, this, this.timeOut, { item: item, img: img });
            this.timeOut += this.timeOffest;
            TimerManager.instance.setTimeout((txt) => {
                if (txt) {
                    TweenAniManager.instance.fadeInAni(txt, null, this.timeOffest - 200)
                }
                if (this.curIndex == 4) {
                    this.continueTxt.visible = true;
                }
                this.curIndex += 1;
            }, this, this.timeOut, txt);
            this.timeOut += this.timeOffest;
        }
    }

    hideOther() {
        for (var i = 1; i < 4; i++) {
            var item = this.picCtn.getChildByName("item" + i) as Laya.Image;
            item.alpha = 0;
            var img = item.getChildByName("img" + i) as Laya.Image;
            img.alpha = 0;
            var txt = item.getChildByName("txt" + i) as Laya.Image;
            if (txt) {
                txt.alpha = 0;
            }
        }
    }
    delayLoadSource() {
        SubPackageManager.loadDynamics(["scene_battle01", "group_role_1000"], [])
    }

    onClickBg() {
        if (!this.continueTxt.visible) return;
        this.close();

    }
    close() {
        TimerManager.instance.removeByObject(this);
        WindowManager.SwitchUI(WindowCfgs.BattleUI, WindowCfgs.CartoonPicUI, { name: "1-1", levelId: 1 });
    }

    clear() {

    }
    dispose() {

    }
    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }

}