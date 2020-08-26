"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingUI = void 0;
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const Global_1 = require("../../../../utils/Global");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const BattleRoleView_1 = require("../../../battle/view/BattleRoleView");
class LoadingUI {
    constructor() {
        this.progress = 0;
        this.isShowWxInfo = false;
        this.alphaFlag = 1;
        LoadingUI.instance = this;
        this.initView();
        this.mainbg.mouseThrough = false;
        this.mainbg.mouseEnabled = true;
    }
    /**显示loading */
    showLoading() {
        if (this.mainbg) {
            WindowManager_1.default.topUILayer.addChild(this.mainbg);
        }
        if (WindowManager_1.default.topUILayer.numChildren > 0) {
            WindowManager_1.default.topUILayer.mouseEnabled = true;
        }
    }
    /**隐藏loading */
    hideLoading() {
        if (this.mainbg) {
            WindowManager_1.default.topUILayer.removeChild(this.mainbg);
        }
        if (WindowManager_1.default.topUILayer.numChildren == 0) {
            WindowManager_1.default.topUILayer.mouseEnabled = false;
        }
    }
    initView() {
        if (!this.mainbg) {
            this.mainbg = new Laya.Image("static/loading_bp_beijing.png");
            // this.mainbg.scaleX = this.mainbg.scaleY = 2;
            this.mainbg.width = 768;
            this.mainbg.height = 1400;
            this.mainbg.x = ScreenAdapterTools_1.default.width / 2 - ScreenAdapterTools_1.default.maxWidth / 2;
            this.mainbg.y = ScreenAdapterTools_1.default.height / 2 - ScreenAdapterTools_1.default.maxHeight / 2;
            var title = new Laya.Image("static/loading_image_logo.png");
            title.centerX = 0;
            title.top = 280;
            this.mainbg.addChildren(title);
            var logo1 = new Laya.Image("static/loading_logo_qihuan.png");
            logo1.centerX = -100;
            logo1.top = 230;
            this.mainbg.addChildren(logo1);
            var logo2 = new Laya.Image("static/loading_logo_kariqu.png");
            logo2.centerX = 100;
            logo2.top = 230;
            this.mainbg.addChildren(logo2);
        }
        if (!this.clientVersionTxt) {
            this.clientVersionTxt = new Laya.Label();
            this.clientVersionTxt.text = "client_version:1.0.1";
            this.clientVersionTxt.width = 134;
            this.clientVersionTxt.height = 16;
            this.clientVersionTxt.right = 10 + this.getHorizontalOffset();
            this.clientVersionTxt.bottom = 12 + this.getVerticalOffset();
            this.clientVersionTxt.color = "#ffffff";
            this.clientVersionTxt.stroke = 1;
            this.clientVersionTxt.strokeColor = "#000000";
            this.mainbg.addChild(this.clientVersionTxt);
        }
        if (!this.powerlaya) {
            this.powerlaya = new Laya.Label();
            this.powerlaya.text = "Powered by LayaAir Engine";
            this.powerlaya.width = 159;
            this.powerlaya.height = 16;
            this.powerlaya.color = "#ffffff";
            this.powerlaya.left = 10 + this.getHorizontalOffset();
            this.powerlaya.bottom = 12 + this.getVerticalOffset();
            this.powerlaya.stroke = 1;
            this.powerlaya.strokeColor = "#000000";
            this.mainbg.addChild(this.powerlaya);
        }
        if (!this.profgBg) {
            this.profgBg = new Laya.Image("static/loading_image_jindudi.png");
            this.profgBg.sizeGrid = "17,39,7,28";
            this.profgBg.width = 578;
            this.profgBg.centerX = 0;
            this.profgBg.bottom = 43 + this.getVerticalOffset();
            this.mainbg.addChild(this.profgBg);
            this.profg = new Laya.Image("static/loading_image_jindu.png");
            this.profgBg.addChild(this.profg);
            this.profg.sizeGrid = "16,33,10,25";
            this.profg.width = 0;
        }
        if (!this.loadingtips) {
            this.loadingtips = new Laya.Label();
            this.loadingtips.text = "资源加载加载中，请稍后...";
            this.loadingtips.x = -33;
            this.loadingtips.y = -37.5;
            this.loadingtips.width = 640;
            this.loadingtips.height = 31;
            this.loadingtips.fontSize = 20;
            this.loadingtips.font = "Microsoft YaHei";
            this.loadingtips.color = "#ffffff";
            this.loadingtips.align = "center";
            this.profgBg.addChild(this.loadingtips);
        }
        if (!this.loadingstar) {
            this.loadingstar = new Laya.Image("");
            this.loadingstar.x = -26;
            this.loadingstar.y = -22;
            this.profgBg.addChild(this.loadingstar);
            this.loadingicon = new Laya.Image("static/loading_image_jindudiche.png");
            this.loadingicon.x = 15;
            this.loadingicon.y = -27;
            this.loadingicon.anchorX = 0.5;
            this.loadingicon.anchorY = 0.5;
            this.loadingstar.addChild(this.loadingicon);
        }
        if (!this.aniGroup) {
            this.aniGroup = new Laya.Image();
            this.aniGroup.centerX = 0;
            this.aniGroup.bottom = 400 + this.getVerticalOffset();
            this.aniGroup.anchorX = 0.5;
            this.aniGroup.anchorY = 1;
            this.mainbg.addChild(this.aniGroup);
            var bg = new Laya.Image("static/loading_bp_beijing2.png");
            bg.width = 279;
            bg.height = 38;
            bg.x = -bg.width / 2;
            bg.y = 0;
            this.aniGroup.addChild(bg);
        }
        if (!this.roleAni) {
            this.roleAni = new BattleRoleView_1.default("role_16", 0.5, 0, "LoadingUI");
            this.aniGroup.addChild(this.roleAni);
            this.roleAni.play("idle", true);
        }
    }
    setData() {
        this.clientVersionTxt.text = "client_version:" + Global_1.default.client_version;
        this.progress = 0;
        // if (this.profgmask) {
        //     this.profgmask.graphics.clear();
        // }
        this.profg.width = 0;
        this.onLoop();
        Laya.timer.loop(60, this, this.onLoop);
        this.alphaFlag = 1;
        Laya.timer.loop(50, this, this.loadingFlash);
    }
    loadingFlash() {
        if (this.alphaFlag) {
            this.loadingtips.alpha -= 0.1;
        }
        else {
            this.loadingtips.alpha += 0.1;
        }
        if (this.loadingtips.alpha >= 0.95) {
            this.alphaFlag = 1;
        }
        if (this.loadingtips.alpha <= 0.05) {
            this.alphaFlag = 0;
        }
    }
    onLoop() {
        if (this.progress + 1 < 95) {
            this.progress += 1;
        }
        // if (BaseFunc.globalCfgsHasLoad) {
        //     if (this.progress < 10) {
        //         this.loadingtips.text = AnaFunc.getInstance().getWordById("#tid_loading_6000_1");
        //     } else if (this.progress < 40) {
        //         this.loadingtips.text = AnaFunc.getInstance().getWordById("#tid_loading_6000_2");
        //     } else if (this.progress < 80) {
        //         this.loadingtips.text = AnaFunc.getInstance().getWordById("#tid_loading_6000_3");
        //     } else {
        //         this.loadingtips.text = AnaFunc.getInstance().getWordById("#tid_loading_6000_4");
        //     }
        // }
        // if (this.loadingicon) {
        //     this.loadingicon.rotation = this.progress * 5;
        // }
        if (this.progress >= 100) {
            this.progress = 100;
            Laya.timer.clearAll(LoadingUI.instance);
        }
        else {
        }
        // if (this.profgmask) {
        //     this.profgmask.graphics.drawRect(0, 0, 574 * this.progress * 0.01, 30, "#ffffff");
        // }
        if (this.profg) {
            this.profg.width = 574 * this.progress * 0.01;
        }
        if (this.loadingstar) {
            var starX = -13 + this.progress * 0.01 * 574;
            this.loadingstar.x = -13 + this.progress * 0.01 * 574;
            if (this.loadingicon) {
                this.loadingicon.rotation = this.progress * 0.01 * 360;
            }
        }
    }
    setProgress(progress) {
        console.log("Loading Progress is : " + progress);
        this.progress = (Number)((progress * 100).toFixed(2));
        this.onLoop();
    }
    addProgress(progress) {
        this.progress += progress;
    }
    getProgress() {
        return this.progress;
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
    /**获取竖直方向上坐标差 */
    getVerticalOffset() {
        var offset = (1400 - ScreenAdapterTools_1.default.height) * 0.5;
        if (offset < 0) {
            offset = 0;
        }
        return offset;
    }
    /**获取水平方向上坐标差 */
    getHorizontalOffset() {
        var offset = (768 - ScreenAdapterTools_1.default.width) * 0.5;
        if (offset < 0) {
            offset = 0;
        }
        return offset;
    }
}
exports.LoadingUI = LoadingUI;
//# sourceMappingURL=LoadingUI.js.map