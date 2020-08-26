"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FogLayerControler = void 0;
class FogLayerControler {
    constructor(fogControler, rootCtn) {
        this.fogControler = fogControler;
        this.rootCtn = rootCtn;
        this.a = new Laya.Sprite();
        this.a1 = new Laya.Sprite();
        this.a2 = new Laya.Sprite();
        this.a3 = new Laya.Sprite();
        this.a2Offset = new Laya.Sprite();
        this.a21 = new Laya.Sprite();
        this.a22 = new Laya.Sprite();
        this.a23 = new Laya.Sprite();
        this.a24 = new Laya.Sprite();
        rootCtn.addChild(this.a);
        this.a.addChild(this.a1);
        this.a.addChild(this.a2);
        this.a.addChild(this.a3);
        //为了方便坐标好算. 网格的(0,0)点会和 原点有一个相对坐标偏移
        this.a2.addChild(this.a2Offset);
        this.a2Offset.x = 0;
        this.a2Offset.y = 0;
        this.a2Offset.addChild(this.a21);
        this.a2Offset.addChild(this.a22);
        this.a2Offset.addChild(this.a23);
        this.a2Offset.addChild(this.a24);
    }
    //销毁函数
    dispose() {
        this.a && this.a.removeChildren();
        this.a = null;
        this.a1 = null;
        this.a2 = null;
        this.a3 = null;
        this.a21 = null;
        this.a22 = null;
        this.a23 = null;
        this.fogControler = null;
    }
}
exports.FogLayerControler = FogLayerControler;
//# sourceMappingURL=FogLayerControler.js.map