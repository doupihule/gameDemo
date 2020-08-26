import GameConsts from "../../game/sys/consts/GameConsts";

export class AdResponse {
	//1 个人中心的广告 现已经不用了
	more: Array<any>;
	//2 首页开始按钮下的广告
	promotion: Array<any>;
	//3 首页右上的浮动广告
	indexFloat: Array<any>;
	//7 首页侧栏
	indexLeft: Array<any>;
	//8 游戏页浮动广告
	gameFloat: Array<any>;
	//9 结束页广告
	endPage: Array<any>;
	//11 首页左侧浮动广告
	indexLeftFloat: Array<any>;
	static kariquPos = 1;

	/**转化数据结构 */
	public static changeStruct(data: AdResponse) {
		var datas = [];
		var endData = data.endPage;
		for (var i = 0; i < endData.length; i++) {
			var item = endData[i];
			var param = {};
			param["GameAppId"] = item.appid;
			param["GameName"] = item.app_title;
			param["Icon"] = item.app_icon;
			param["Position"] = item.position_type;
			param["MutualType"] = "1";
			param["PromoteLink"] = item.link_path;
			param["app_id"] = item.app_id;
			datas.push(param);
		}
		return datas;
	}

	public static changeDataToZhise(data) {
		var datas = {};
		datas["appid"] = data.appId;
		datas["link_path"] = data.path;
		datas["extraData"] = data.extraData && data.extraData.ext;
		datas["app_id"] = data.jumpData.app_id
		return datas;
	}

	/**
	 * 把卡日曲的数据转成标准格式
	 * @param data 互推数据
	 * @param type 互推位置类型
	 */
	public static changeKariquStruct(data, kariquList, result,) {
		//排重
		for (var index = data.length - 1; index >= 0; index--) {
			var newJumpData = data[index];
			var type = newJumpData.type + "";
			var recentJumpData;
			for (var listIndex in result) {
				var oldJumpData = result[listIndex];
				if (oldJumpData.MutualType == type) {
					recentJumpData = oldJumpData;
				}
				if (recentJumpData && recentJumpData.Icon == newJumpData.data.icon) {
					data.splice(index, 1);
				}
			}
		}
		if (kariquList.url == GameConsts['JUMP_KARIQU_REDIRECT_LIST_URL']) {
			for (var i = 0; i < data.length; i++) {
				// 新版接口
				var item = data[i];
				var param = {};
				param["MutualType"] = kariquList.type + "";
				param["GameAppId"] = item.appid;
				param["GameName"] = item.name;
				param["Icon"] = item.icon;
				param["Position"] = this.kariquPos;
				param["PromoteLink"] = item.path;
				result.push(param);
				this.kariquPos++;
			}
		} else {
			// 老板接口
			if (kariquList.isSingle) {
				var item = data;
				var param = {};
				param["GameAppId"] = item.appid;
				param["GameName"] = item.name;
				param["Icon"] = item.icon;
				param["Position"] = this.kariquPos;
				param["MutualType"] = kariquList.type + "";
				param["PromoteLink"] = item.path;
				result.push(param);
				this.kariquPos++;
			} else {
				for (var i = 0; i < Object.keys(data).length; i++) {
					var item = data[i];
					var param = {};
					if (item.data) {
						param["MutualType"] = item.type + "";
						item = item.data;
					} else {
						param["MutualType"] = kariquList.type + "";
					}
					param["GameAppId"] = item.appid;
					param["GameName"] = item.name;
					param["Icon"] = item.icon;
					param["Position"] = this.kariquPos;
					param["PromoteLink"] = item.path;
					result.push(param);
					this.kariquPos++;
				}
			}
		}

		return param;
	}
}