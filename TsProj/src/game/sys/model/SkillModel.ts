import BaseModel from "./BaseModel";

export default class SkillModel extends BaseModel {
	public constructor() {
		super();
	}

	//单例
	private static _instance: SkillModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new SkillModel();
		}
		return this._instance;
	}

	private _roleInfo;

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

	/**根据id获取当前技能等级 */
	getSkillLevelById(id) {
		if (!this._data) {
			return 1
		}
		return this._data[id] || 1;
	}
}
