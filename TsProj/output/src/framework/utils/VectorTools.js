"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VectorTools {
    //向量乘法
    static multyByNumToSelf(vec, mul) {
        vec.x = vec.x * mul;
        vec.y = vec.y * mul;
        vec.z = vec.z * mul;
    }
    //向量乘法 返回新向量
    static multyByNum(vec, mul) {
        vec.x = vec.x * mul;
        vec.y = vec.y * mul;
        vec.z = vec.z * mul;
        return new Laya.Vector3(vec.x * mul, vec.y * mul, vec.z * mul);
    }
    //向量加法,加到第一个向量上
    static addToSelf(vec, vec2) {
        vec.x += vec2.x;
        vec.y += vec2.y;
        vec.z += vec2.z;
    }
    //向量加法创建新向量
    static added(vec, vec2) {
        var newVec = new Laya.Vector3(vec.x + vec2.x, vec.y + vec2.y, vec.z + vec2.z);
        return newVec;
    }
    //向量减法 ,
    static reduceToSelf(vec, vec2) {
        vec.x -= vec2.x;
        vec.y -= vec2.y;
        vec.z -= vec2.z;
    }
    //copy一个点
    static copyVector(vec) {
        return new Laya.Vector3(vec.x, vec.y, vec.z);
    }
}
exports.default = VectorTools;
//原点
VectorTools.originPoint = new Laya.Vector3();
//单位向量
VectorTools.unitPoint = new Laya.Vector3(1, 1, 1);
//# sourceMappingURL=VectorTools.js.map