import BaseFunc from "../../../framework/func/BaseFunc";

/**角色相关 */
export default class RecycleFunc extends BaseFunc {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "RecyclePlate_json" },
            { name: "RecycleLuckyBox_json" },
            { name: "TranslateRole_json" },
            { name: "LuckyPlateBox_json" },
            { name: "LuckyPlate_json" },
        ];
    }
    static _instance: RecycleFunc;
    static get instance() {
        if (!this._instance) {
            this._instance = new RecycleFunc();
        }
        return this._instance;
    }
    getInfo() {
        return this.getAllCfgData("RecyclePlate_json");
    }

    getInfoByArenaId(arenaId) {
        return this.getCfgDatas("RecyclePlate_json", arenaId);
    }

    /**获取累计宝箱的最大次数 */
    getLastCount() {
        var data = this.getAllCfgData("RecycleLuckyBox_json");
        return Object.keys(data).length;
    }

    /**获取累计宝箱内容 */
    getBox(id) {
        return this.getCfgDatasByKey("RecycleLuckyBox_json", id, "luckyBox");
    }

    getLuckyInfo() {
        return this.getAllCfgData("LuckyPlate_json");
    }
}
