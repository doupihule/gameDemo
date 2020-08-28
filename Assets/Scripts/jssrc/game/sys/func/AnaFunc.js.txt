"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
class AnaFunc extends BaseFunc_1.default {
    static getInstance() {
        if (!this._instance) {
            this._instance = new AnaFunc();
        }
        return this._instance;
    }
    getCfgsPathArr() {
        return [
            { name: "Ana_json" },
            { name: "TranslateAna_json" }
        ];
    }
    // 获取一条随机的格言编号
    getRandomAnaId() {
        return 1 + Math.round(Math.random() * 21);
    }
    // 根据id获取格言
    getSentenceById(id) {
        var keys = this.getAnaDataByDoubleId(id, "sentence");
        return TranslateFunc_1.default.instance.getTranslate(keys, "TranslateAna_json");
    }
    // 根据id获取格言作者
    getSpeakerById(id) {
        var keys = this.getAnaDataByDoubleId(id, "speaker");
        return TranslateFunc_1.default.instance.getTranslate(keys, "TranslateAna_json");
    }
    //获取字符串
    getWordById(id) {
        return TranslateFunc_1.default.instance.getTranslate(id, "TranslateAna_json");
    }
    /**根据id获取配表内容 */
    getAnaDataByDoubleId(id, id2) {
        return this.getCfgDatasByKey("Ana_json", id, id2);
    }
}
exports.default = AnaFunc;
//# sourceMappingURL=AnaFunc.js.map