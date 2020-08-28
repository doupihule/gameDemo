"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
class TipsUI extends Laya.Sprite {
    constructor() {
        super();
        this.tipsbg = new Laya.Sprite();
        this.tipsbg.alpha = 0.5;
        this.tipsbg.mouseEnabled = true;
        this.tipsbg.mouseThrough = false;
        this.tipsbg.size(543, 97);
        this.tipsbg.y = 1207;
        this.addChild(this.tipsbg);
        this.tips = new Laya.Label();
        this.tips.color = "#ffffff";
        this.tips.font = "Microsoft YaHei";
        this.tips.fontSize = 30;
        this.tips.align = "center";
        this.tips.anchorX = 0.5;
        this.tips.pos(this.tipsbg.width / 2, 30);
        this.tipsbg.addChild(this.tips);
    }
    // private ignoreSound = ["购买成功"];
    setData(data) {
        // if (this.ignoreSound.indexOf(data) == -1)
        //     SoundManager.playSE(MusicConst.SOUND_ERROR_TIPS);
        //TODO 适配
        this.tipsbg.y = ScreenAdapterTools_1.default.designHeight * 0.5;
        this.tipsbg.alpha = 0;
        Laya.Tween.to(this.tipsbg, { alpha: 1, y: ScreenAdapterTools_1.default.designHeight * 0.5 - 100 }, 500);
        this.tips.text = data;
        this.tipsbg.width = (this.tips.width + 100) > 455 ? (this.tips.width + 100) : 455;
        this.tipsbg.graphics.clear();
        this.tipsbg.graphics.drawRect(0, 0, this.tipsbg.width, 97, "#000000");
        this.tipsbg.x = ScreenAdapterTools_1.default.width / 2 - this.tipsbg.width / 2;
        this.tips.x = this.tipsbg.width * 0.5;
        Laya.timer.once(1000, this, () => {
            Laya.Tween.to(this.tipsbg, { alpha: 0 }, 500);
        });
    }
}
exports.default = TipsUI;
TipsUI.res = [];
//# sourceMappingURL=TipsUI.js.map