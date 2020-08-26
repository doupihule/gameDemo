import BaseFunc from "../../../framework/func/BaseFunc";
import UserExtModel from "../model/UserExtModel";
import RolesModel from "../model/RolesModel";
import UserModel from "../model/UserModel";
import ResourceManager from "../../../framework/manager/ResourceManager";
import SubPackageManager from "../../../framework/manager/SubPackageManager";
import LogsManager from "../../../framework/manager/LogsManager";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import Client from "../../../framework/common/kakura/Client";
import GlobalParamsFunc from "./GlobalParamsFunc";


export default class InviteFunc extends BaseFunc {
   
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "InvitingGift_json" },
        ];
    }

    static _instance: InviteFunc;
    static get instance() {
        if (!this._instance) {
            this._instance = new InviteFunc();
        }
        return this._instance;
    }
    public getAll() {
        return this.getAllCfgData("InvitingGift_json");
    }
    public getInviteInfo(id) {
        return  this.getCfgDatas("InvitingGift_json", id);
    }
}
