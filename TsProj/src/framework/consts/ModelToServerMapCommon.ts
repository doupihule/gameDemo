import JumpCommonModel from "../model/JumpCommonModel";
import UserExtCommonModel from "../model/UserExtCommonModel";
import CountsCommonModel from "../model/CountsCommonModel";
import ModelToServerMap from "../../game/sys/consts/ModelToServerMap";
import UserModel from "../../game/sys/model/UserModel";

//通用本地模块和服务器数据映射表
export default class ModelToServerMapCommon {
	public constructor() {
	}

	//所有的modelMap
	static modelToServerMap: any[] = [];


	//框架公共的模块在此处填充
	static modelToServerMapCommon: any[] = [
		{key: "jumpCommon", model: JumpCommonModel},  //已跳转map模块
		{key: "userExtCommon", model: UserExtCommonModel},//userExtCommon模块
		{key: "countsCommon", model: CountsCommonModel},  //CountsCommonModel模块
	];


	//所有model初始化
	static initModelToServerMap() {
		ModelToServerMap.initModelToServerMap();
		var modelMap: any[] = ModelToServerMap.modelToServerMap;
		var modelMapCommon: any[] = this.modelToServerMapCommon;

		var totalModelMap: any[] = [];
		if (modelMap.length && !modelMapCommon.length) {
			totalModelMap = modelMap;
		} else if (!modelMap.length && modelMapCommon.length) {
			totalModelMap.push({key: "user", model: UserModel});
			for (var i = 0; i < modelMapCommon.length; i++) {
				totalModelMap.push(modelMapCommon[i]);
			}
		} else {
			for (var i = 0; i < modelMap.length; i++) {
				totalModelMap.push(modelMap[i]);
			}
			var map = this.revertToTable(modelMap);
			if (Object.keys(map).length != 0) {
				for (var i = 0; i < modelMapCommon.length; i++) {
					if (!map.hasOwnProperty(modelMapCommon[i].key) || map[modelMapCommon[i].key] != modelMapCommon[i].model) {
						totalModelMap.push(modelMapCommon[i]);
					}
				}
			}
		}

		this.modelToServerMap = totalModelMap;
	}

	//将table数组转换成table
	static revertToTable(arr) {
		if (arr.length == 0) {
			return {};
		}

		var result = {};
		for (var i = 0; i < arr.length; i++) {
			result[arr[i].key] = arr[i].model;
		}

		return result;
	}
}
