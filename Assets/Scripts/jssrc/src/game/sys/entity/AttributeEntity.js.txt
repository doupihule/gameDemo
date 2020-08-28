"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const BattleFunc_1 = require("../func/BattleFunc");
class AttributeEntity {
    constructor(data) {
        var scaleValue = 1;
        this.basePower = BattleFunc_1.default.instance.turnAddSpeedToFrame(data.basePower);
        this.baseSlowDownPower = BattleFunc_1.default.instance.turnAddSpeedToFrame(data.baseSlowDownPower);
        this.baseMaxSpeed = BattleFunc_1.default.instance.turnSpeedToFrame(data.baseMaxSpeed);
        this.turnSpeed = BattleFunc_1.default.instance.turnRotateSpeedToFrame(data.turnSpeed);
        this.turnPower = BattleFunc_1.default.instance.turnAddSpeedToFrame(data.turnPower);
        this.turnPowerTime = BattleFunc_1.default.instance.turnMinisecondToframe(data.turnPowerTime);
        this.turnPowerMaxTime = BattleFunc_1.default.instance.turnMinisecondToframe(data.turnPowerMaxTime);
        this.turnMaxspeed = BattleFunc_1.default.instance.turnSpeedToFrame(data.turnMaxspeed);
        this.unsafeFallTurnTime = BattleFunc_1.default.instance.turnMinisecondToframe(data.unsafeFallTurnTime);
        this.unsafeFallSlowDownPower = BattleFunc_1.default.instance.turnAddSpeedToFrame(data.unsafeFallSlowDownPower);
        this.slowDownPower = BattleFunc_1.default.instance.turnAddSpeedToFrame(data.slowDownPower);
        this.slowDownPower = BattleFunc_1.default.instance.turnAddSpeedToFrame(data.slowDownPower);
        this.collisionSpeedChange = TableUtils_1.default.copyOneArr(data.collisionSpeedChange);
        this.collisionSpeedChange[0] /= 10000;
        this.collisionSpeedChange[1] /= 10000;
        this.roadChangeDirection = (data.roadChangeDirection);
        this.skyChangeDirection = (data.skyChangeDirection);
        this.carLength = data.carLength / 10000;
        this.box = data.box;
    }
}
exports.default = AttributeEntity;
//# sourceMappingURL=AttributeEntity.js.map