import BaseFunc from "../../../framework/func/BaseFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import GameConsts from "../consts/GameConsts";
import BattleConst from "../consts/BattleConst";
import GlobalParamsFunc from "./GlobalParamsFunc";
import AttributeExtendData from "../../battle/data/AttributeExtendData";
import GameSwitch from "../../../framework/common/GameSwitch";
import UserInfo from "../../../framework/common/UserInfo";
import BattleRoleView from "../../battle/view/BattleRoleView";
import UserExtModel from "../model/UserExtModel";
import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "./ShareTvOrderFunc";
import WindowManager from "../../../framework/manager/WindowManager";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import {WindowCfgs} from "../consts/WindowCfgs";
import UserModel from "../model/UserModel";
import RolesModel from "../model/RolesModel";
import FogFunc from "./FogFunc";
import RolesFunc from "./RolesFunc";
import DataResourceConst from "../consts/DataResourceConst";


export default class BattleFunc extends BaseFunc {


	//战斗调试参数 
	static debugValue: string = "0";


	//属性id对应显示类型map. 存储起来 提高运算性能 {attrId:1,"1":1,"2":2}; key是string
	static idToShowMap: any = {}


	//黑屏深度
	public static zorder_blackScreen: number = 2000 * 10;

	//入场速度
	public static enterSpeed: number = 2.5

	public static battleCenterY: number = 560;
	//战场y坐标 上下边界 做边界判断
	public static battleUpY: number;
	public static battleDownY: number;

	//开场等待帧数
	public static battleWaitFrame: number = 30;
	//地方刷新距离中点的偏移;
	public static firstWavePos: number = 200
	public static otherWavePos: number = 400

	public static defaultShadeWidth: number = 120;

	//默认缩放系数
	public static defaultScale: number = 0.25;

	//暴击伤害
	public static critDamgeRatio: number = 2;
	//最低伤害比例
	public static minDamageRatio: number = 0.01;

	//迷雾战斗复活恢复的能量
	public static fogBattleRecover: number = 0.1;

	//大数单位.战斗也缓存一个.提高读取效率
	public static reducedUnitArr: string[];

	//坐标相关
	/**空军高度 */
	public static airArmyHigh = 270;
	/**空军X */
	public static airArmyStartXLocation: number = 220;
	/**地面X */
	public static landArmyStartXLocation: number = 220;
	/**地面Y */
	public static landArmyStartYLocation = [0, 20, -20, 40, -40, 60, -60];
	/**远征站位坐标 基于基地 */
	public static warRoleXoffest = [0, 100, 200];
	/**电塔x */
	public static pylonStartXLocation = 350;
	/**重复电塔x的偏移 */
	public static pylonTwoLocation = 30;
	/**电塔扣血万分比量 */
	public static buildingAutoReduceHp = 160;
	/**电塔扣血帧数 */
	public static buildAutoFrame = 30;
	//死亡后停留时长
	public static deadLastFrame: number = 10;
	//角色死亡微振动次数
	public static diedShockCount: number = 3;

	public static leftAniTime: number = 5;
	/**超时复活的被动 */
	public static overTimePassiveSkill;

	//返回属性的样式 1是数值型 2是比例型
	static getPropStyle(id: string) {
		var info = this.idToShowMap[id]
		if (!info) {
			return BattleConst.PROPSTYLE_RATIO
		}
		return info.display
	}

	public static moveSpeed: number = 1;
	public static battleRandomIndex: number = 3;

	static angletoRad: number = Math.PI / 180;
	static radtoAngle: number = 180 / Math.PI;

	//1米大概等于多少像素
	static miToPixel: number = 640 / 18;
	static pixelToMi: number = 18 / 640;

	//一周
	static twopi: number = Math.PI * 2;
	//90°对应的弧度
	static halfpi: number = Math.PI / 2;


	//默认角色的y坐标. 这样可以提升性能 降低批次穿透
	static defaultRoleYpos: number = 0

	//战斗中的帧长度系数
	static battleViewFrameScale: number = 2;

	//毫秒转化成帧
	static miniSecondToFrame: number = 60 / 1000
	//帧转化成毫秒
	static frameToMiniSecode: number = 1000 / 60

	//原点0,0,0 禁止修改
	public static originPoint: {x,y,z} = {x:0,y:0,z:0}

	//定义一个临时对象.用来存储临时属性的
	public static tempObject: any = {};
	public static tempObject2: any = {};
	public static tempObject3: any = {};
	public static tempObject4: any = {};

	//临时矩形
	public static tempRect: any = {x: 0, y: 0, width: 0, height: 0};
	public static tempRect2: any = {x: 0, y: 0, width: 0, height: 0};
	//临时的圆
	public static tempCircle: any = {r: 0, x: 0, y: 0};


	//记录一个临时点 战斗逻辑中间使用的过渡点
	public static tempPoint: {x,y,z} =  {x:0,y:0,z:0};
	public static tempPoint2: {x,y,z} = {x:0,y:0,z:0};
	public static tempPoint3: {x,y,z} = {x:0,y:0,z:0};
	public static tempPoint4: {x,y,z} = {x:0,y:0,z:0};

	public static tempClickPoint: {x,y} = {x:0,y:0};

	/**特效不独立 */
	public static EFFECT_NOALLOW = 1;
	//空数组 禁止写
	static emptyArr: any[] = []
	/**从战斗返回主界面 */
	static fromBattleMain;
	static _cacheTempArr: any[] = [];

	static getOneTempArr(): any[] {
		if (this._cacheTempArr.length == 0) {
			return []
		}
		return this._cacheTempArr.shift()
	}

	//缓存一个tempArr 把长度设置为0
	static cacheOneTempArr(value: any[]) {
		value.length = 0;
		this._cacheTempArr.push(value);
	}


	//被动技能
	static tempArr_passive: any[] = []


	//波次最大时长 默认是60秒
	static waveMaxFrame: number = 60 * 60;
	//boss时长
	static bossMaxFrame: number = 60 * 60;

	/**创建不同角色的index值 */
	static CreateRoleIndex = {};


	static _instance: BattleFunc;
	/**当前战斗类型 */
	static curBattleType = 1;
	/**当前战斗状态 */
	static curGameState;

	static get instance() {
		if (!this._instance) {
			this._instance = new BattleFunc();
			BattleFunc.initGlobalParams();
		}
		return this._instance;
	}


	protected getCfgsPathArr() {
		return ["AttributeList", "Role", "RoleUpdate", "Scene", "Decoration",
			"Skill", "SkillUpdate", "Buff", "Condition", "SkillEffect",
			"Target", "RoleAct", "Level", "LevelWave",
			"PassiveSkill", "AoeEffect", "Bullet", "TranslateLevel", "TranslateMonster", "Lottery"
		];
	}

	constructor() {
		super();

	}


	//获取角色对应的数据
	public getRoleInfoData(id, level) {
		return this.getCfgDatasByKey("Role", id, level);
	}

	//将毫秒转化成帧
	public turnMinisecondToframe(minisecond) {
		return Math.floor(Number(minisecond) * BattleFunc.miniSecondToFrame)
	}

	//将 像素/秒转化成 像素/帧
	public turnSpeedToFrame(secondSpeed) {
		return secondSpeed / GameConsts.gameFrameRate;
	}

	public getShadeScale(instanceWid: number) {
		var scale = instanceWid / BattleFunc.defaultShadeWidth;
		if (scale > 1) {
			scale = 1;
		} else if (scale < 0.3) {
			scale = 0.3
		}
		return scale;
	}

	//将 像素/秒转化成 像素/帧
	public turnAddSpeedToFrame(secondAddSpeed) {
		return secondAddSpeed / GameConsts.gameFrameRate / GameConsts.gameFrameRate;
	}


	//创建角色spine 需要把role数据传递进来,为以后 换装或者皮肤做准备 
	//targetScale 缩放系数 因为是按照4倍大尺寸做的 所以默认缩放系数是0.2 . 根据系统需要传入缩放值
	// type 1是小兵, 2是英雄 
	// isForceModifyBody  是否需要强制修改角色的皮肤为9
	//tag表示当前动画 在哪个ui. 用来做统计筛选的
	public createRoleSpine(roleId: string, level, type, targetScale: number = 0.25, isShowShade = true, isForceModifyBody = false, uiTag = "") {
		var cfgs = this.getCfgDatas("Role", roleId);
		var spineName = cfgs.spine[0];
		var roleUpdateInfo = this.getCfgDatasByKey("RoleUpdate", roleId, level);
		var index = roleUpdateInfo.body || 0;
		if (isForceModifyBody) {
			index = 9;
		}

		var animode = index == 0 && 0 || 1
		var sp = new BattleRoleView(spineName, targetScale, index, uiTag);
		if (isShowShade) {
			var size = roleUpdateInfo.size;
			var width = Number(size[1]);
			var shadeScale = this.getShadeScale(width);
			sp.setShade(shadeScale);
		}
		//播放闲置动画
		sp.play(BattleConst.LABEL_IDLE, true);
		return sp;

	}

	//---------------------------------------------计算属性相关----------------------------------------
	//---------------------------------------------计算属性相关----------------------------------------
	//---------------------------------------------计算属性相关----------------------------------------


	//把多个模块的属性传入进来, 返回计算后的结果.战中战后用同一套. 策划配表用的格式是[[id,num,ratio] ,[id2,num,ratio]]. 需要转化一遍再传进来,统一转化成{id:[num] }
	// 转化数据方法: BattleFunc.turnPropArrToTable
	// roleInfo:{advance:1,level:1,passiveSkills:{}}
	// 返回的数据格式 { id:value,id2:value};
	//计算详细属性. 比如进阶获取下一等级的属性就需要传具体的进阶 等级 等属性

	private _cacheAttrData: AttributeExtendData;


	//计算主角属性
	public countPlayerAttr(outMap: any, heroId: string, heroInfo: any, userData: any) {
		if (!this._cacheAttrData) {
			this._cacheAttrData = new AttributeExtendData(heroId, heroInfo, BattleConst.LIFE_PLAYER, userData);
		} else {
			this._cacheAttrData.resetData(heroId, heroInfo, BattleConst.LIFE_PLAYER, userData);
		}

		for (var i in this._cacheAttrData.finalAttr) {
			outMap[i] = this._cacheAttrData.finalAttr[i];
		}
		return outMap;
	}

	//把配表数组转化成 table,  [ ["1","200","300"] ,....]-> { "1":[200,300], "2":[300,400],... } 注意所有的属性id必须是字符串
	public turnPropArrToTable(propArr, outTable = null) {
		if (!outTable) {
			outTable = {}
		}
		;
		if (!propArr) {
			LogsManager.errorTag("properror", "没有传入属性数据")
			return outTable;
		}
		for (var i = 0; i < propArr.length; i++) {
			var info = propArr[i];
			//如果是字符串.说明还没有进行拆分
			if (typeof info == "string") {
				info = info.split(",");
			}
			var id = info[0];
			if (!outTable[id]) {
				outTable[id] = [0, 0];
			}
			outTable[id][0] += Number(info[1]) || 0
			outTable[id][1] += Number(info[2]) || 0
		}
		return outTable
	}


	//--------------------------------------------------------------------------------------------------------------
	//--------------------------------------缓存数据-----------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------
	private _cacheCfgMap: any = {baseAttr: {}, addAttr: {}, advanceAttr: {}, rebornAttr: {}}

	//获取缓存的baseAttr. 是为了提高性能节省内存,避免重复copy
	public getCacheBaseAttr(attrId: string) {
		if (!this._cacheCfgMap.baseAttr[attrId]) {
			this._cacheCfgMap.baseAttr[attrId] = this.turnPropArrToTable(this.getCfgDatasByKey("BaseAttribute", attrId, "baseAttribute"))
		}
		return this._cacheCfgMap.baseAttr[attrId]

	}

	//获取缓存的addAttr
	public getCacheAddAttr(attrId: string) {
		if (!this._cacheCfgMap.addAttr[attrId]) {
			this._cacheCfgMap.addAttr[attrId] = this.turnPropArrToTable(this.getCfgDatasByKey("BaseAttribute", attrId, "attributeAdd"))
		}
		return this._cacheCfgMap.addAttr[attrId]

	}

	//获取缓存的 advance
	public getCacheAdvanceAttr(roleId: string, advance: string) {
		var key = roleId + "_" + advance;
		if (!this._cacheCfgMap.advanceAttr[key]) {
			this._cacheCfgMap.advanceAttr[key] = this.turnPropArrToTable(this.getCfgDatasByMultyKey("RoleAdvance", roleId, advance, "attr"));
		}
		return this._cacheCfgMap.advanceAttr[key]
	}

	//获取缓存的rebornData
	public getCacheRebornAttr(rebornTimes) {
		var key = rebornTimes
		if (!this._cacheCfgMap.rebornAttr[key]) {
			this._cacheCfgMap.rebornAttr[key] = this.turnPropArrToTable(this.getCfgDatasByKey("RebornAttribute", String(rebornTimes), "attribute"));
		}
		return this._cacheCfgMap.rebornAttr[key]
	}

	//获取阵位坐标偏移
	public getPosByFromation(zhenwei: string) {
		return 1
	}


	//获取技能参数
	public getSkillValueByParams(key, _skillId: string, level: number, skillParams, tag) {
		if (key.indexOf("_") == -1) {
			return Number(key);
		}
		if (!skillParams) {
			skillParams = this.getCfgDatasByMultyKey("SkillUpdate", _skillId, String(level), "params", true);
			if (!skillParams) {
				return Number(key);
			}
		}

		var tempArr: any = key.split("_");
		var arr1 = skillParams[Number(tempArr[0]) - 1];
		if (!arr1) {
			LogsManager.errorTag("SkillCfgsError", "参数配置错误,skillId:", _skillId, "skilllv:", level, "key:", key, tag);
			return 0
		}
		var rt = arr1[Number(tempArr[1]) - 1]
		if (rt == null) {
			LogsManager.errorTag("SkillCfgsError", "参数配置错误,skillId:", _skillId, "skilllv:", level, "key:", key, tag);
			return 0
		}
		rt = Number(rt);
		if (isNaN(rt)) {
			LogsManager.errorTag("battleError", "错误的技能参数数据,skillId:", _skillId, "skilllv:", level, tag);
		}
		return rt;
	}

	//初始化全局参数. 策划配置的数需要转化.而且为了访问方便.
	public static initGlobalParams() {


		this.critDamgeRatio = GlobalParamsFunc.instance.getDataNum("baseCritDamage") / 10000;
		this.minDamageRatio = GlobalParamsFunc.instance.getDataNum("minDamage") / 10000;
		this.battleCenterY = GlobalParamsFunc.instance.getDataNum("battleCenterY");
		this.battleUpY = this.battleCenterY - 180
		this.battleDownY = this.battleCenterY + 180
		var cfg = BattleFunc.instance.getAllCfgData("AttributeList");
		this.reducedUnitArr = GlobalParamsFunc.instance.getDataString("reducedUnit").split(",");
		this.airArmyHigh = GlobalParamsFunc.instance.getDataNum("airArmyHigh");
		this.landArmyStartYLocation = GlobalParamsFunc.instance.getDataArray("landArmyStartYLocation");
		this.airArmyStartXLocation = GlobalParamsFunc.instance.getDataNum("airArmyStartXLocation");
		this.landArmyStartXLocation = GlobalParamsFunc.instance.getDataNum("landArmyStartXLocation");
		this.pylonTwoLocation = GlobalParamsFunc.instance.getDataNum("pylonTwoLocation");
		this.pylonStartXLocation = GlobalParamsFunc.instance.getDataNum("pylonStartXLocation");
		this.diedShockCount = GlobalParamsFunc.instance.getDataNum("deadShock");

		var buildAutoHp = GlobalParamsFunc.instance.getDataArray("buildingAutoReduceHp");
		this.warRoleXoffest = GlobalParamsFunc.instance.getDataArray("fogBattleColumns");
		this.buildAutoFrame = BattleFunc.instance.turnMinisecondToframe(Number(buildAutoHp[0]))
		this.deadLastFrame = BattleFunc.instance.turnMinisecondToframe(GlobalParamsFunc.instance.getDataNum("pylonStartXLocation"))
		this.buildingAutoReduceHp = Number(buildAutoHp[1]);
		this.fogBattleRecover = GlobalParamsFunc.instance.getDataNum("fogResurrectionEnergy") / 10000;
		this.leftAniTime = GlobalParamsFunc.instance.getDataNum("battleEndWarnTime") / 1000;
		this.overTimePassiveSkill = GlobalParamsFunc.instance.getDataNum("battleOvertimeBuff");

		this.idToShowMap = cfg;
		this.initFrameDates();
		//判断调试开关
		if (UserInfo.isWeb()) {
			var re = /\@(.*)\@/g
			//如果匹配到
			if (window.location.href.search(re) >= 0) {
				var rt = re.exec(window.location.href);
				var str = rt[1];
				LogsManager.echo("战斗调试模式:", str);
				GameSwitch.switchMap.SWITCH_BATTLE_DEBUGLEVEL = str;
			}
		}


	}

	//初始化帧率相关数据
	public static initFrameDates() {
		this.battleViewFrameScale = GameConsts.gameFrameRate / 30
		this.miniSecondToFrame = GameConsts.gameFrameRate / 1000
		this.frameToMiniSecode = 1000 / GameConsts.gameFrameRate
	}

	showGetPower() {
		var power = UserExtModel.instance.getCurrentSp()
		if (power < GlobalParamsFunc.instance.getDataNum('levelSpCost')) {
			var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_SP);
			//体力不足不让玩了
			if (freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
				WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_battle_noenoughsp"));
			} else {
				WindowManager.OpenUI(WindowCfgs.FreeResourceUI, {type: DataResourceConst.SP});
			}
			return true;
		}
		return false;
	}

	//是否展示滑稽装备碎片引导
	IshowGuide_403() {
		if (UserModel.instance.getMainGuide() == 6) {
			var baseRole = GlobalParamsFunc.instance.getDataNum("bornRoleId")
			//碎片第一步引导结束并且当前需要引导合成的角色还没有合成
			if (RolesModel.instance.getRoleStarLevel(baseRole) == 0 && !RolesModel.instance.getIsHaveEquip(baseRole, GlobalParamsFunc.instance.getDataNum("guideEquipId"))) {
				return true;
			}
		}
		return false;
	}

	/**进入战斗引导 */
	IshowGuide_204() {
		//大于一关就不引导进入游戏了 并且没有进行过该步引导  该步是第四步
		if (UserModel.instance.getMaxBattleLevel() == 1 && UserModel.instance.getMainGuide() <= 3) {
			return true;
		}
		return false;
	}

	//检测迷雾街区功能开启引导
	IshowGuide_501() {
		if (UserModel.instance.getMainGuide() < 9 && UserModel.instance.getMaxBattleLevel() >= FogFunc.instance.getFogOpenLevel()) {
			return true;
		}
		return false;
	}

	IshowUnlockGuide() {
		var isShow = false;
		var curLevel = UserExtModel.instance.getMaxLevel();
		var roleList = RolesFunc.instance.getAllRole();
		var roleInfo;
		for (var id in roleList) {
			if (roleList[id].unlockCondition) {
				var unlockCondition = roleList[id].unlockCondition;
				for (var i = 0; i < unlockCondition.length; i++) {
					var temp = unlockCondition[i].split(",");
					if (Number(temp[0]) == RolesFunc.ROLE_UNLOCK_TYPE_LEVEL) {
						if (Number(temp[1]) == curLevel && !RolesModel.instance.getIsHaveRole(id)) {
							isShow = true;
							break;
						}
					}
				}
			}
		}
		return isShow

	}

}