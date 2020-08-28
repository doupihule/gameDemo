"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
class ReqLoadingUI extends Laya.View {
    constructor() {
        super();
        this.rollAsset = new Laya.Label("loading...");
        this.rollAsset.color = "#ffffff";
        this.rollAsset.font = "Microsoft YaHei";
        this.rollAsset.fontSize = 24;
        this.rollAsset.x = Laya.stage.width - 150;
        this.rollAsset.y = Laya.stage.height - 50;
        this.addChild(this.rollAsset);
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this.width = 640;
        this.height = 1136;
    }
    setData(data) {
        this.rollAsset.visible = false;
        Laya.timer.once(1, this, () => {
            this.rollAsset.visible = true;
            this.rollAsset.alpha = 0;
            Laya.Tween.to(this.rollAsset, { alpha: 1 }, 500, null, Laya.Handler.create(this, this.onTween1));
        });
    }
    onTween1() {
        this.rollAsset.alpha = 1;
        Laya.Tween.to(this.rollAsset, { alpha: 0 }, 2000, null, Laya.Handler.create(this, this.onTween2));
        Laya.Tween.clearTween(this.onTween1);
    }
    onTween2() {
        this.rollAsset.alpha = 0;
        Laya.Tween.to(this.rollAsset, { alpha: 1 }, 2000, null, Laya.Handler.create(this, this.onTween1));
        Laya.Tween.clearTween(this.onTween2);
    }
}
exports.default = ReqLoadingUI;
ReqLoadingUI.res = null;
//# sourceMappingURL=ReqLoadingUI.js.map