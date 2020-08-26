import BaseFunc from "../../../framework/func/BaseFunc";


export default class InviteFunc extends BaseFunc {

	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表
	getCfgsPathArr() {
		return [
			{name: "InvitingGift_json"},
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
		return this.getCfgDatas("InvitingGift_json", id);
	}
}
