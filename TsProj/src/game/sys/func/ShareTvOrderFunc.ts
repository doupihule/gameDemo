import BaseFunc from "../../../framework/func/BaseFunc";

export default class ShareTvOrderFunc extends BaseFunc{
	/** 增加体力 */
	static SHARELINE_FREE_SP = "1";
	/** 体力宝箱 */
	static SHARELINE_SKIPBATTLE = "2";
	/** 死亡复活 */
	static SHARELINE_UPGRADE = "3";

	private static _instance:ShareTvOrderFunc;
	public static getInstance(): ShareTvOrderFunc {
		if (!this._instance) {
			this._instance = new ShareTvOrderFunc();
		}
		return this._instance;
	}
	public static get instance(){
		if (!this._instance) {
			this._instance = new ShareTvOrderFunc();
		}
		return this._instance;
	}

	getCfgsPathArr(){
		return [
			{name:"ShareTvOrder_json"}
		]
	}
	getOrder(id:number):any
	{
		// return this.cfg[id];
		return this.getCfgDatas("ShareTvOrder_json",id);
	}
	getOrderInfoById(id1, id2) {
		return this.getCfgDatasByKey("ShareTvOrder_json", id1, id2);
	}
}