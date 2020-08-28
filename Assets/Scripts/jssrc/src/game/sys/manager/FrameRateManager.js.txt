"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameRateManager = void 0;
const UserInfo_1 = require("../../../framework/common/UserInfo");
class FrameRateManager {
    constructor() {
        this.num = 0;
        this.lowFrameFPS = 30;
        this.highFrameFPS = 60;
        this.readRate = 10;
        this.mulplite = 1.5;
    }
    ;
    static get instance() {
        if (!this._instance) {
            this._instance = new FrameRateManager();
        }
        return this._instance;
    }
    //动态设置帧率
    updateFrame() {
        if (Laya.stage.frameRate == Laya.Stage.FRAME_SLOW)
            return;
        this.num++;
        if (this.num % (this.highFrameFPS * this.readRate) == 0) {
            var nowTime = Laya.Browser.now();
            var disTime = nowTime - this._lastTime;
            if (disTime > this.readRate * 10 * this.mulplite) {
                //判断是慢设备
                UserInfo_1.default.platform.setGameFrame();
            }
            else {
                this._lastTime = Laya.Browser.now();
            }
        }
    }
    initData() {
        this.num = 0;
        this._lastTime = Laya.Browser.now();
    }
}
exports.FrameRateManager = FrameRateManager;
//# sourceMappingURL=FrameRateManager.js.map