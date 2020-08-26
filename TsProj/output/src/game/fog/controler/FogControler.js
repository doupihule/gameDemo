"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FogLayerControler_1 = require("./FogLayerControler");
const FogFunc_1 = require("../../sys/func/FogFunc");
const BattleControler_1 = require("../../battle/controler/BattleControler");
/**总控制器 */
class FogControler extends BattleControler_1.default {
    constructor(ctn, ui) {
        super(ctn);
        this.tmpPoint = new Laya.Point();
        this._allMoveInstanceArr = [];
        this.fogLayerControler = new FogLayerControler_1.FogLayerControler(this, ctn);
    }
    setData(layer) {
    }
    //总的追帧刷新函数
    updateFrame() {
        this.runUpdate();
    }
    //更新所有实例
    runUpdate() {
        //这里要倒着遍历. 因为在执行每个对象的update的过程中 可能会销毁某个对象 导致数组变化
        var len = this._allMoveInstanceArr.length;
        for (var i = len - 1; i >= 0; i--) {
            var instance = this._allMoveInstanceArr[i];
            instance.updateFrame();
        }
        //重新运动
        for (var i = len - 1; i >= 0; i--) {
            var instance = this._allMoveInstanceArr[i];
            instance.updateFrameLater();
        }
    }
    //把舞台坐标转化成格子的坐标 1_1
    turnStagePosToCellSign(stagex, stagey) {
        //先把全局坐标转化成相对坐标
        this.tmpPoint.x = stagex;
        this.tmpPoint.y = stagey;
        var pos = this.fogLayerControler.a22.globalToLocal(this.tmpPoint);
        var xIndex = Math.floor(pos.x / FogFunc_1.default.itemWidth) + 1;
        var yIndex = FogFunc_1.default.row - Math.floor(pos.y / FogFunc_1.default.itemHeight);
        return xIndex + "_" + yIndex;
    }
    dispose() {
        this.fogLayerControler.dispose();
        this.fogLayerControler = null;
    }
}
exports.default = FogControler;
//# sourceMappingURL=FogControler.js.map