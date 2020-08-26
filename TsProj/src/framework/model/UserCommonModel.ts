import BaseModel from "../../game/sys/model/BaseModel";
import Client from "../common/kakura/Client";

export default class UserCommonModel extends BaseModel {
	public constructor() {
		super();
	}


	private static _instance: UserCommonModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new UserCommonModel()
		}
		return this._instance;
	}

	initData(d: any) {
		super.initData(d);
	}

	updateData(d: any) {
		super.updateData(d);
	}

	/**获取已跳转的appid map*/
	getJumpedList() {
		var jumpList = this._data.jumpedList || {};
		if (!jumpList.expireTime || Client.instance.serverTime > jumpList.expireTime) {
			this._data.jumpedList = {};
			return {};
		} else {
			return jumpList.appList;
		}
	}

}