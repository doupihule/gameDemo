import BaseModel from "./BaseModel";

export class switchType {
    static music_switch = "1";  //背景音乐开关
    static sound_switch = "2"; //音效开关
    static default_switch = "default";  //默认开关 默认为开着的
}
//音乐开关
export default class SwitchModel extends BaseModel {
    public constructor() {
        super();
    }
    static music_switch = "3";  //背景音乐音量
    static sound_switch = "4"; //音效音量
    static shake_switch = "5";  //震动开关  默认是0  有震动 
    //单例
    private static _instance: SwitchModel;
    static get instance() {
        if (!this._instance) {
            this._instance = new SwitchModel();
        }
        return this._instance;
    }

    //初始化数据
    initData(d: any) {
        super.initData(d);
    }
    //更新数据
    updateData(d: any) {
        super.updateData(d);
    }
    //删除数据
    deleteData(d: any) {
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
        } else {
            return true;
        }
    }
    /**获取音效开关 */
    getSoundSwitch() {
        var curSwitch = this._data[switchType.sound_switch] == 0 ? 0 : switchType.default_switch;
        if (curSwitch == 0) {
            return false;
        } else {
            return true;
        }
    }

}
