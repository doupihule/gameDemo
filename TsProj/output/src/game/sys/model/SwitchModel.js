"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchType = void 0;
const BaseModel_1 = require("./BaseModel");
class switchType {
}
exports.switchType = switchType;
switchType.music_switch = "1"; //背景音乐开关
switchType.sound_switch = "2"; //音效开关
switchType.default_switch = "default"; //默认开关 默认为开着的
//音乐开关
class SwitchModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new SwitchModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        super.updateData(d);
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    /**根据类型获取开关 */
    getSwitchByType(type) {
        var data = this._data;
        var result = data && data[type];
        if (result == null && (type == SwitchModel.music_switch || type == SwitchModel.sound_switch)) {
            result = 0.5;
        }
        return Number(result);
    }
    /**获取背景音乐开关 */
    getMusicSwitch() {
        var curSwitch = this._data[switchType.music_switch] == 0 ? 0 : switchType.default_switch;
        if (curSwitch == 0) {
            return false;
        }
        else {
            return true;
        }
    }
    /**获取音效开关 */
    getSoundSwitch() {
        var curSwitch = this._data[switchType.sound_switch] == 0 ? 0 : switchType.default_switch;
        if (curSwitch == 0) {
            return false;
        }
        else {
            return true;
        }
    }
}
exports.default = SwitchModel;
SwitchModel.music_switch = "3"; //背景音乐音量
SwitchModel.sound_switch = "4"; //音效音量
SwitchModel.shake_switch = "5"; //震动开关  默认是0  有震动 
//# sourceMappingURL=SwitchModel.js.map