"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WaitEntity_1 = require("../entity/WaitEntity");
const WindowManager_1 = require("./WindowManager");
const ReqLoadingUI_1 = require("../../game/sys/view/loading/ReqLoadingUI");
const ScreenAdapterTools_1 = require("../utils/ScreenAdapterTools");
class WaitManager {
    constructor() {
        this.waitList = [];
        this.waitPool = [];
        // this.waitTimer = new egret.Timer(1000);
        // this.waitTimer.addEventListener(egret.TimerEvent.TIMER, this.timeCallBack, this);
        this._waitView = new ReqLoadingUI_1.default();
        this._waitView.width = ScreenAdapterTools_1.default.width;
        this._waitView.height = ScreenAdapterTools_1.default.height;
        Laya.timer.loop(1000, this, this.timeCallBack);
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new WaitManager();
        }
        return this._instance;
    }
    /**
     * 添加等待命令
     * @param cmd
     */
    add(cmd) {
        var wait;
        if (this.waitPool.length > 0) {
            wait = this.waitPool.shift();
        }
        else {
            wait = new WaitEntity_1.default();
        }
        wait.cmd = cmd;
        wait.time = Laya.timer.currTimer;
        this.waitList.push(wait);
        // WindowManager.OpenUI(WindowCfgs.ReqLoadingUI);
        this.showOrHideWaitView(true);
        Laya.timer.loop(1000, this, this.timeCallBack);
        // if (!this.waitTimer.running) {
        //     this.waitTimer.start();
        // }
    }
    /**
     * 移除等待命令
     * @param cmd
     */
    remove(cmd) {
        var len = this.waitList.length;
        for (var i = 0; i < len; i++) {
            if (cmd == this.waitList[i].cmd) {
                this.waitPool.push(this.waitList.splice(i, 1)[0]);
                break;
            }
        }
        this.checkWait();
    }
    /**
     * 清理等待命令
     */
    clear() {
        while (this.waitList.length > 0) {
            this.waitPool.push(this.waitList.shift());
        }
        this.checkWait();
    }
    /**
     * 检测等待命令
     */
    checkWait() {
        if (this.waitList.length <= 0) {
            // WindowManager.CloseUI(WindowCfgs.ReqLoadingUI);
            this.showOrHideWaitView(false);
            Laya.timer.clearAll(this);
        }
    }
    /**
     * 时钟回调
     */
    timeCallBack() {
        var len = this.waitList.length;
        var nowTime = Laya.timer.currTimer;
        for (var i = 0; i < len;) {
            if (nowTime - this.waitList[i].time > 20000) {
                console.log("cmd=" + this.waitList[i].cmd + " request timeout...");
                this.waitPool.push(this.waitList.splice(i, 1)[0]);
                len--;
                continue;
            }
            i++;
        }
        this.checkWait();
    }
    /*判断是否处理waiting中,true是在等待中 false表示没有waiting*/
    checkIsWaiting() {
        return this.waitList.length != 0;
    }
    //显示或者隐藏waitview
    showOrHideWaitView(value) {
        if (value) {
            if (!this._waitView.parent) {
                WindowManager_1.default.topUILayer.addChild(this._waitView);
            }
            this._waitView.visible = true;
            this._waitView.setData(null);
        }
        else {
            this._waitView.visible = false;
            if (this._waitView.parent) {
                this._waitView.parent.removeChild(this._waitView);
            }
        }
    }
}
exports.default = WaitManager;
//# sourceMappingURL=WaitManager.js.map