import BaseModel from "./BaseModel";


export default class DailyGoldModel extends BaseModel {
	// 英雄列表：user.roles
	// {
	//     "1":{// 英雄id

	//         level:2,         //英雄等级
	//         upCostCoin: "1000", // 升级消耗
	//         skillPoint:10     //技能点
	//         energy:10         //能量点
	//         passiveSkills:{   //被动技能
	//             "1":2,        //被动技能id：被动技能等级
	//             "2":3,
	//         }
	//         normalSkills:{   //普通技能
	//              "1":2,//id=>level
	//              "2":3,
	//         }
	//         energySkill：{            //主动技能
	//              level:2,             //主动技能等级
	//         },
	//         advance:1   // 进阶次数
	//      } ,
	// }

	public constructor() {
		super();
	}

	//单例
	private static _instance: DailyGoldModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new DailyGoldModel();
		}
		return this._instance;
	}

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

	getDailyGoldData() {
		return this._data || {};
	}

	//获取每日钻石数据
	getDailyGold() {
		var data = this.getDailyGoldData();
		if (!Object.keys(data).length || data.expireTime <= Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 4 * 60 * 60 * 1000)).toString())) {
			data = {
				expireTime: Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 28 * 60 * 60 * 1000)).toString()),
				currentGoldStep: 0,
				watchTime: 0,
			}
		}
		return data;
	}
}
