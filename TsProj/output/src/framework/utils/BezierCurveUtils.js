"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BezierCurveUtils {
    //一阶贝塞尔
    static getBezierPosOne(t, from, to) {
        return (1 - t) * from + t * to;
    }
    //获取贝塞尔曲线上的点
    static getBezierPos(t, _from, _to, _temp, vector) {
        var a;
        if (vector) {
            a = vector;
        }
        else {
            a = new Laya.Vector3(0, 0, 0);
        }
        a.x = t * t * (_to.x - 2 * _temp.x + _from.x) + _from.x + 2 * t * (_temp.x - _from.x);
        a.y = t * t * (_to.y - 2 * _temp.y + _from.y) + _from.y + 2 * t * (_temp.y - _from.y);
        a.z = t * t * (_to.z - 2 * _temp.z + _from.z) + _from.z + 2 * t * (_temp.z - _from.z);
        return a;
    }
    //获取贝塞尔曲线上的点,Laya.Vector2
    static getBezierPosVector2(t, _from, _to, _temp, vector) {
        var a;
        if (vector) {
            a = vector;
        }
        else {
            a = new Laya.Vector2(0, 0);
        }
        a.x = t * t * (_to.x - 2 * _temp.x + _from.x) + _from.x + 2 * t * (_temp.x - _from.x);
        a.y = t * t * (_to.y - 2 * _temp.y + _from.y) + _from.y + 2 * t * (_temp.y - _from.y);
        return a;
    }
}
exports.default = BezierCurveUtils;
//# sourceMappingURL=BezierCurveUtils.js.map