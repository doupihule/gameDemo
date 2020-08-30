import UserModel from "../model/UserModel";
import SwitchModel from "../model/SwitchModel";
import UserExtModel from "../model/UserExtModel";
import RolesModel from "../model/RolesModel";
import LogsManager from "../../../framework/manager/LogsManager";
import Client from "../../../framework/common/kakura/Client";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import TalentSkillsModel from "../model/TalentSkillsModel";
import FogModel from "../model/FogModel";

//本地模块和服务器数据映射表
export default class ModelToServerMap {
	public constructor() {
	}

	static modelToServerMap: any[] = []

	static initModelToServerMap() {
		//服务器数据和本地模块映射表
		//注意优先级,比如 userModel一定要是第一个更新的
		/**
		 * 这里的model 只能是user里面的数据. 如果usermodel下面没有这个模块数据,那么就是需要单独向服务器请求更新的模块,
		 * 比如邮件或者好友系统,初始化的时候 不在user里面,需要手动请求 后面是单独更新
		 */

		this.modelToServerMap = [
			{key: "user", model: UserModel},		//用户模块
			{key: "switches", model: SwitchModel},	//音乐开关
			{key: "userExt", model: UserExtModel},	//userExt模块
			{key: "roles", model: RolesModel},	//roles模块

			{key: "talentSkills", model: TalentSkillsModel}, //天赋技能列表

		]
	}

	//根据游戏初始化去构造用户数据 根据游戏初始化构造
	static initBuildUserData() {
		//初始化构造数据必须带 sendTime,上一次存储的时间,默认是0 表示没有数据
		// return { sendTime: 0 }
		//初始体力
		var bornSp = GlobalParamsFunc.instance.getDataNum('bornSp');
		LogsManager.echo("krma. 构造初始数据")
		var homeId = GlobalParamsFunc.instance.getDataNum("bornHomeId")
		var baseRoleId = GlobalParamsFunc.instance.getDataNum("bornRoleId")
		var baseRole = {
			"id": baseRoleId,
			"level": 1,
			"inLine": 1
		}
		var baseHome = {
			"id": homeId,
			"level": 1,
			"inLine": 0
		}

		var data = {
			// accountUid: "",
			coin: GlobalParamsFunc.instance.getDataNum("bornCoin"),
			giftGold: GlobalParamsFunc.instance.getDataNum("bornGold"),
			hasUpdateData: false,
			userExt: {
				loginTime: Client.instance.serverTime,
				logoutTime: 3000000000,
				sp: bornSp,
				upSpTime: Client.instance.serverTime,
				lastSaveTime: Client.instance.serverTimeMicro,
				registTime: Client.instance.serverTime,
			},
			roles: {
				[baseRoleId]: baseRole
			},
			sendTime: 0,
			switches: {
				3: GlobalParamsFunc.instance.getDataNum("initialMusic") / 10000,
				4: GlobalParamsFunc.instance.getDataNum("initialSound") / 10000
			}
		}
		//如果震动的默认值配的不是1，那就默认是关闭震动 开关值为1是关闭
		if (GlobalParamsFunc.instance.getDataNum("initialShock") != 1) {
			data.switches[5] = 1;
		}
		data.roles[homeId] = baseHome
		return data;
	}


}
