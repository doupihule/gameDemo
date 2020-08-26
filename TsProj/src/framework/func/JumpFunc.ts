import BaseFunc from "./BaseFunc";
import ChannelConst from "../../game/sys/consts/ChannelConst";
import UserInfo from "../common/UserInfo";

export class JumpFunc extends BaseFunc {
	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表
	getCfgsPathArr() {
		return [
			{name: "Jump_json"},
		];
	}

	private static _instance: JumpFunc;

	/** 缓存推荐列表 */
	private _jumpList;

	static get instance() {
		if (!this._instance) {
			this._instance = new JumpFunc();
		}
		return this._instance;
	}

	/**设置各充值类型的数据 */
	getJumpList() {
		if (this._jumpList) {
			return this._jumpList;
		}
		this._jumpList = [];

		var listTmp = this.getAllCfgData("Jump_json", true);

		for (var key in listTmp) {
			// 排除自己
			if (listTmp[key].GameAppId != ChannelConst.getChannelConst(UserInfo.platformId).appId) {
				this._jumpList.push(listTmp[key]);
			}
		}
		// 根据位置排序
		this._jumpList = this._jumpList.sort((a, b) => {
			if (Number(a.Position) > Number(b.Position)) {
				return 1;
			} else {
				return -1;
			}
		});

		return this._jumpList;
	}
}
