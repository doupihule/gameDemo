import BaseModel from "../../game/sys/model/BaseModel";

export default class UserExtCommonModel extends BaseModel {
	public constructor() {
		super();
	}


	private static _instance: UserExtCommonModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new UserExtCommonModel()
		}
		return this._instance;
	}

	initData(d: any) {
		super.initData(d);
	}

	updateData(d: any) {
		super.updateData(d);
	}

	//获取白名单标志
	getTestSceneMark() {
		return this._data.testSceneMark ? this._data.testSceneMark : 0;
	}

}