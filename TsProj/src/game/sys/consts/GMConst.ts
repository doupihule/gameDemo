export default class GMConst {

	private static _oplistData;

	static getOplistData() {
		if (!this._oplistData) {
			this._oplistData = {
				"method": 100106,
				"result": {
					"serverInfo": {
						"serverTime": 1571887729583
					},
					"data": {
						"oplist": this.__cfg,
					}
				},
				"uniqueId": "uniqueId_82_1571887728710_2000002"
			}
		}
		return this._oplistData;
	}

	//云存储GM的配置
	private static __cfg = {
		"User": {
			"desc": "用户相关",
			"label": "User",
			"ops": [
				{
					"op": 100101,
					"action": "User.coin",
					"desc": "角色金币",
					"params": [
						{
							"type": "int",
							"name": "coin",
							"desc": "角色金币"
						},
					]
				},
				{
					"op": 100102,
					"action": "User.giftGold",
					"desc": "角色钻石",
					"params": [
						{
							"type": "int",
							"name": "giftGold",
							"desc": "角色钻石"
						},
					]
				},
				{
					"op": 100103,
					"action": "User.fogCoin",
					"desc": "迷雾币",
					"params": [
						{
							"type": "int",
							"name": "fogCoin",
							"desc": "迷雾币"
						},
					]
				},
			]
		},
		"UserExt": {
			"desc": "其他系统 UserExt",
			"label": "UserExt",
			"ops": [
				{
					"op": 100301,
					"action": "userExt.sp",
					"desc": "体力",
					"params": [
						{
							"type": "int",
							"name": "sp",
							"desc": "体力"
						}
					]
				},
				{
					"op": 100302,
					"action": "userExt.maxStage",
					"desc": "最大关卡",
					"params": [
						{
							"type": "int",
							"name": "maxStage",
							"desc": "最大关卡"
						}
					]
				},
				{
					"op": 100303,
					"action": "userExt.maxFogLayer",
					"desc": "迷雾最大层数",
					"params": [
						{
							"type": "int",
							"name": "maxFogLayer",
							"desc": "迷雾最大层数"
						}
					]
				}
			]
		},
		"pieces": {
			"desc": "碎片 pieces",
			"label": "pieces",
			"ops": [
				{
					"op": 100401,
					"action": "pieces.id.count",
					"desc": "pieces.id.count",
					"params": [
						{
							"type": "int",
							"name": "id",
							"desc": "id"
						},
						{
							"type": "int",
							"name": "count",
							"desc": "count"
						}
					]
				}
			]
		},
		"roles": {
			"desc": "角色",
			"label": "roles",
			"ops": [
				{
					"op": 100501,
					"action": "roles.id.starLevel",
					"desc": "设置小兵",
					"params": [
						{
							"type": "int",
							"name": "id",
							"desc": "小兵id"
						},
						{
							"type": "int",
							"name": "starLevel",
							"desc": "星级等级"
						},
					]
				}
			]
		},
		"fog": {
			"desc": "迷雾",
			"label": "fog",
			"ops": [
				{
					"op": 100601,
					"action": "fog.layer",
					"desc": "设置最大层数",
					"params": [
						{
							"type": "int",
							"name": "layer",
							"desc": "层数"
						}
					]
				},
				{
					"op": 100602,
					"action": "fog.comp",
					"desc": "设置零件数",
					"params": [
						{
							"type": "int",
							"name": "comp",
							"desc": "零件"
						}
					]
				},
				{
					"op": 100603,
					"action": "fog.act",
					"desc": "设置行动力",
					"params": [
						{
							"type": "int",
							"name": "act",
							"desc": "行动力"
						}
					]
				},
				{
					"op": 100604,
					"action": "fog.prop.id.num",
					"desc": "设置道具",
					"params": [
						{
							"type": "int",
							"name": "id",
							"desc": "道具id"
						},
						{
							"type": "int",
							"name": "num",
							"desc": "道具数量"
						}
					]
				}
			]
		},
		"work": {
			"desc": "打工系统 work",
			"label": "work",
			"ops": [
				{
					"op": 100901,
					"action": "work.repute",
					"desc": "修改名声数量",
					"params": [
						{
							"type": "int",
							"name": "repute",
							"desc": "修改名声数量"
						},
					]
				}

			]
		},
		"UserExtCommon": {
			"desc": "其他公共系统 UserExtCommon",
			"label": "UserExtCommon",
			"ops": [
				{
					"op": 100901,
					"action": "userExtCommon.testSceneMark",
					"desc": "修改白名单标识",
					"params": [
						{
							"type": "int",
							"name": "testSceneMark",
							"desc": "白名单标识"
						},
					]
				}

			]
		},
		"delModel": {
			"desc": "清除指定模块",
			"label": "delModel",
			"ops": [
				{
					"op": 100901,
					"action": "delModel.counts.id",
					"desc": "输入7清除迷雾次数",
					"params": [
						{
							"type": "int",
							"name": "id",
							"desc": "次数id"
						},
					]
				}

			]
		}
	}
}
