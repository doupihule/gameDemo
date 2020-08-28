"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const TweenAniManager_1 = require("../../manager/TweenAniManager");
/**迷雾街区入场漫画 */
class FogCartoonPicUI extends layaMaxUI_1.ui.gameui.cartoon.FogCartoonPicUI {
    constructor() {
        super();
        this.curIndex = 1;
        this.totalNum = 7;
        this.timeOffest = 500;
        this.timeOut = 0;
        this.initBtn();
    }
    initBtn() {
        //  this.on(Laya.Event.MOUSE_DOWN, this, this.onClickBg);
        new ButtonUtils_1.ButtonUtils(this.skipTxt, this.onClickSkip, this);
    }
    //初始化
    setData() {
        this.skipTxt.visible = false;
        this.timeOffest = 1500; //GlobalParamsFunc.instance.getDataNum("comicPlayTime");
        this.curIndex = 1;
        this.timeOut = 0;
        this.loadResBack();
    }
    loadResBack() {
        //界面内容初始化
        for (var i = 1; i <= this.totalNum; i++) {
            var item = this.picCtn.getChildByName("item" + i);
            item.alpha = 0;
            var txt = item.getChildByName("txt" + i);
            if (txt) {
                txt.alpha = 0;
            }
            //自动出现
            TimerManager_1.default.instance.setTimeout((data) => {
                var delay = 0;
                if (this.curIndex != 1) {
                    delay = this.timeOffest - 500;
                }
                if (data.item.alpha == 0 && data.item.skin != "") {
                    TweenAniManager_1.default.instance.fadeInAni(data.item, null, delay);
                }
                if (this.curIndex == this.totalNum) {
                    TimerManager_1.default.instance.setTimeout(this.onClickSkip, this, 3000);
                }
            }, this, this.timeOut, { item: item });
            this.timeOut += this.timeOffest;
            TimerManager_1.default.instance.setTimeout((txt) => {
                if (txt.alpha == 0) {
                    TweenAniManager_1.default.instance.fadeInAni(txt, null, this.timeOffest - 500);
                    this.curIndex += 1;
                }
            }, this, this.timeOut, txt);
            this.timeOut += this.timeOffest;
        }
        TimerManager_1.default.instance.setTimeout(() => {
            this.skipTxt.visible = true;
        }, this, 1000);
    }
    //点击出现下一张
    onClickBg() {
        if (this.curIndex >= this.totalNum) {
            this.onClickSkip();
            return;
        }
        this.curIndex += 1;
        var item = this.picCtn.getChildByName("item" + this.curIndex);
        item.alpha = 1;
        var txt = item.getChildByName("txt" + this.curIndex);
        if (txt) {
            TweenAniManager_1.default.instance.fadeInAni(txt, null, 2000);
        }
    }
    //点击跳过，直接打开入场初始化角色界面
    onClickSkip() {
        if ("FogCartoonPicUI" == WindowManager_1.default.getCurrentWindowName()) {
            WindowManager_1.default.SwitchUI([WindowCfgs_1.WindowCfgs.FogMainUI, WindowCfgs_1.WindowCfgs.FogInitRoleUI], [WindowCfgs_1.WindowCfgs.FogCartoonPicUI]);
        }
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogCartoonPicUI);
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
exports.default = FogCartoonPicUI;
//# sourceMappingURL=FogCartoonPicUI.js.map