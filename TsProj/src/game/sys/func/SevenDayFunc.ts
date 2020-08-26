import BaseFunc from "../../../framework/func/BaseFunc";
import GameUtils from "../../../utils/GameUtils";
import RolesModel from "../model/RolesModel";
import RolesFunc, { RoleType } from "./RolesFunc";
import SkillModel from "../model/SkillModel";
import { DataResourceType } from "./DataResourceFunc";
import UserModel from "../model/UserModel";

/**七日登录相关 */
export default class SevenDayFunc extends BaseFunc {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "SevenDay_json" },
        ];
    }

    static _instance: SevenDayFunc;
    static get instance() {
        if (!this._instance) {
            this._instance = new SevenDayFunc();
        }
        return this._instance;
    }
    getSevenDatas() {
        return this.getAllCfgData("SevenDay_json");
    }
}
