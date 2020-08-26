"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ShareManager {
    constructor() {
        this.sceneShare = { 20001: 410001, 20002: 410002, 20003: 410003, 20004: 410004, 20005: 410005 };
    }
    static get ins() {
        if (!this._ins) {
            this._ins = new ShareManager();
        }
        return this._ins;
    }
    setData(shareData, translate) {
        this._shareData = shareData;
        this._translate = translate;
    }
    /**
      * 根据场景id获取分享数据
      * @param sceneId	场景id
      * @return []	0分享描述，1分享图片
      */
    getSceneShareById(sceneId) {
        var shareId = this.sceneShare[sceneId];
        var data = this._shareData[shareId];
        if (data) {
            return [this._translate[data.descId], data.pic[0]];
        }
        return null;
    }
    /**
      * 根据分享id获取分享数据
      * @param shareId	分享id
      * @return []	0分享描述，1分享图片
      */
    getShareById(shareId) {
        var data = this._shareData[shareId];
        if (data) {
            return [this._translate[data.descId], data.pic[0]];
        }
        return null;
    }
}
exports.default = ShareManager;
//# sourceMappingURL=ShareManager.js.map