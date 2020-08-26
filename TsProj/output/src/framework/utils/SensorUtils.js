"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../common/kakura/Client");
const UserInfo_1 = require("../common/UserInfo");
class SensorUtils {
    static shakeCheck(data, callback, thisObj) {
        if (!SensorUtils.timeDelta) {
            SensorUtils.timeDelta = 1000;
            SensorUtils.timeCD = 3000;
            SensorUtils.addSpeed = 12;
        }
        var x = data.x.toFixed(3);
        var time = Client_1.default.instance.serverTimeMicro;
        if (time > SensorUtils.maxTime + SensorUtils.timeDelta) {
            SensorUtils.maxX = x;
            SensorUtils.maxTime = time;
            SensorUtils.minX = x;
            SensorUtils.minTime = time;
            UserInfo_1.default.platform.accelerometerClear({ x: x });
        }
        else if (time > SensorUtils.minTime + SensorUtils.timeDelta) {
            SensorUtils.maxX = x;
            SensorUtils.maxTime = time;
            SensorUtils.minX = x;
            SensorUtils.minTime = time;
            UserInfo_1.default.platform.accelerometerClear({ x: x });
        }
        else if (x > SensorUtils.maxX && time > SensorUtils.maxTime) {
            SensorUtils.maxX = x;
            SensorUtils.maxTime = time;
        }
        else if (x < SensorUtils.minX && time > SensorUtils.minTime) {
            SensorUtils.minX = x;
            SensorUtils.minTime = time;
        }
        else {
            SensorUtils.maxX = x;
            SensorUtils.minX = x;
            UserInfo_1.default.platform.accelerometerClear({ x: x });
        }
        if (SensorUtils.maxX - SensorUtils.minX > SensorUtils.addSpeed) {
            SensorUtils.maxX = x;
            SensorUtils.maxTime = time + SensorUtils.timeCD;
            SensorUtils.minX = x;
            SensorUtils.minTime = time + SensorUtils.timeCD;
            UserInfo_1.default.platform.accelerometerClear({ x: x });
            callback.call(thisObj);
        }
    }
}
exports.default = SensorUtils;
SensorUtils.maxX = 0;
SensorUtils.maxTime = 0;
SensorUtils.minX = 0;
SensorUtils.minTime = 0;
//# sourceMappingURL=SensorUtils.js.map