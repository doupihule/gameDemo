"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeEntity {
    constructor(delay, callBack, thisObject, maxCount, args) {
        this.code = 0;
        this.delay = 0;
        this.oldTime = 0;
        this.maxCount = 0;
        this.callBack = null;
        this.thisObject = null;
        this.isRemove = false;
        this.delay = delay;
        this.callBack = callBack;
        this.thisObject = thisObject;
        this.maxCount = maxCount;
        this.oldTime = Laya.timer.currTimer;
        this.args = args || TimeEntity.emptyArr;
    }
}
exports.default = TimeEntity;
TimeEntity.TimeCode = 0;
TimeEntity.emptyArr = [];
//# sourceMappingURL=TimeEntity.js.map