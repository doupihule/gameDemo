"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const TweenAniManager_1 = require("../../manager/TweenAniManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const SubPackageManager_1 = require("../../../../framework/manager/SubPackageManager");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
/**卡通漫画 */
class CartoonPicUI extends layaMaxUI_1.ui.gameui.cartoon.CartoonPicUI {
    constructor() {
        super();
        this.timeOut = 0;
        this.timeOffest = 500;
        this.curIndex = 1;
        this.guideTab = {
            1: StatisticsManager_1.default.GUIDE_0_1,
            2: StatisticsManager_1.default.GUIDE_0_2,
            3: StatisticsManager_1.default.GUIDE_0_3,
            4: StatisticsManager_1.default.GUIDE_0_4,
        };
        this.initBtn();
        //延时300毫秒加载战斗背景和基地 
        TimerManager_1.default.instance.setTimeout(this.delayLoadSource, this, 300);
    }
    initBtn() {
        this.on(Laya.Event.MOUSE_DOWN, this, this.onClickBg);
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
    }
    //初始化
    setData(data) {
        this.timeOffest = GlobalParamsFunc_1.default.instance.getDataNum("comicPlayTime");
        this.curIndex = 1;
        this.timeOut = 0;
        this.continueTxt.visible = false;
        for (var i = 1; i < 5; i++) {
            var item = this.picCtn.getChildByName("item" + i);
            item.alpha = 0;
            var img = item.getChildByName("img" + i);
            img.alpha = 0;
            var txt = item.getChildByName("txt" + i);
            if (txt) {
                txt.alpha = 0;
            }
            TimerManager_1.default.instance.setTimeout((data) => {
                var delay = 0;
                if (this.curIndex != 1) {
                    delay = this.timeOffest - 200;
                }
                TweenAniManager_1.default.instance.fadeInAni(data.item, null, delay);
                TweenAniManager_1.default.instance.fadeInAni(data.img, null, delay);
                if (this.curIndex == 4) {
                    this.hideOther();
                }
                StatisticsManager_1.default.ins.onEvent(this.guideTab[this.curIndex]);
            }, this, this.timeOut, { item: item, img: img });
            this.timeOut += this.timeOffest;
            TimerManager_1.default.instance.setTimeout((txt) => {
                if (txt) {
                    TweenAniManager_1.default.instance.fadeInAni(txt, null, this.timeOffest - 200);
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
            var item = this.picCtn.getChildByName("item" + i);
            item.alpha = 0;
            var img = item.getChildByName("img" + i);
            img.alpha = 0;
            var txt = item.getChildByName("txt" + i);
            if (txt) {
                txt.alpha = 0;
            }
        }
    }
    delayLoadSource() {
        SubPackageManager_1.default.loadDynamics(["scene_battle01", "group_role_1000"], []);
    }
    onClickBg() {
        if (!this.continueTxt.visible)
            return;
        this.close();
    }
    close() {
        TimerManager_1.default.instance.removeByObject(this);
        WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.BattleUI, WindowCfgs_1.WindowCfgs.CartoonPicUI, { name: "1-1", levelId: 1 });
    }
    clear() {
    }
    dispose() {
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = CartoonPicUI;
//# sourceMappingURL=CartoonPicUI.js.map