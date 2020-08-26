import BaseModel from "../../game/sys/model/BaseModel";
import Client from "../common/kakura/Client";

export default class CountsCommonModel extends BaseModel {
	public constructor() {
		super();
	}

	/**
	 * 每日插屏广告展示次数
	 */
	static TYPE_INTERVALAD_COUNT = "1"
	/**
	 * 上次插屏弹出时间
	 */
	static TYPE_INTERVALAD_LASTSHOWTIME = "2"
	/**
	 * 每日原生插屏广告自动点击次数
	 */
	static TYPE_INTERVAL_ORIGINAL_CLICK_COUNT = "3"

	private static _instance: CountsCommonModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new CountsCommonModel()
		}
		return this._instance;
	}

	initData(d: any) {
		super.initData(d);
	}

	updateData(d: any) {
		super.updateData(d);
	}

	/**根据id获取计数 */
	getCountById(id: string) {
		var num = 0;
		if (!this.IsExpire(id)) {
			num = this._data[id]["count"];
		}
		return num;
	}

	//获取分享视频次数 这个id需要动态拼接的
	getShareTvCountById(id: string) {
		return this.getCountById(this.turnShareTvId(id));
	}

	turnShareTvId(id: string) {
		return "shareTv" + id
	}


	/**判断当前类型是否过期 */
	IsExpire(id: string) {
		if (this._data[id]) {
			if (this._data[id]["expireTime"]) {
				var expireTime = this._data[id]["expireTime"];
				if (expireTime > Client.instance.serverTime) {
					return false;
				} else {
					return true;
				}
			}
		}
		return true;
	}
}
