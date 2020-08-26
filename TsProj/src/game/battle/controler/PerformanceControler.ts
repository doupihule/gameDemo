import InstanceLogical from "../instance/InstanceLogical";
import BattleLogicalControler from "./BattleLogicalControler";
import ResourceConst from "../../sys/consts/ResourceConst";
import ScreenAdapterTools from "../../../framework/utils/ScreenAdapterTools";
import BattleFunc from "../../sys/func/BattleFunc";
import InstanceBasic from "../instance/InstanceBasic";
import BattleConst from "../../sys/consts/BattleConst";
import InstanceEffect from "../instance/InstanceEffect";
import TableUtils from "../../../framework/utils/TableUtils";
import PoolTools from "../../../framework/utils/PoolTools";
import BattleDamageLabel from "../view/BattleDamageLabel";
import DataResourceFunc, {DataResourceType} from "../../sys/func/DataResourceFunc";
import TimerManager from "../../../framework/manager/TimerManager";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import SkeletonExpand from "../../../framework/viewcomp/SkeletonExpand";
import GameConsts from "../../sys/consts/GameConsts";

/**
 * 战斗表现控制器
 * 控制获得金币效果
 * 控制飘字效果.
 * 控制特效缓存
 *
 */

export default class PerformanceControler {
	//视图表现控制器
	public controler: BattleLogicalControler;
	//黑屏
	blackScreen: Laya.Image;

	//特效缓存表;   {effectName:[effectInstance,...]}
	//主要用来 控制特效同时出现的数量. 提高性能
	private _effectCacheMap: any = {};

	//根据特效 缓存的最大数量. 默认是3个
	public effectMaxNumsMap = {
		"testEffect": 1,
		"POOL_EFFECTeffect_foxi_attack_self0": 30
	}

	constructor(controler: any) {
		this.controler = controler;
		this._effectCacheMap = {}
		this.blackScreen = new Laya.Image(ResourceConst.COMMON_IMAGE_HEIDI);
		this.blackScreen.alpha = 1
		this.blackScreen.width = ScreenAdapterTools.maxWidth * 2
		this.blackScreen.height = ScreenAdapterTools.maxHeight * 2
		this.blackScreen.x = -ScreenAdapterTools.UIOffsetX - 300
		this.blackScreen.y = -ScreenAdapterTools.UIOffsetY - 300
		this.blackScreen.zOrder = BattleFunc.zorder_blackScreen;

		this.blackScreen.visible = false;
	}


	//-------------------------特效缓存模块---------------------------------------------

	//当要创建一个特效时 从当前存在的特效里面直接拿,  避免一个特效同屏数量出现过多 导致卡顿
	public getCacheEffect(cacheId: string) {
		// if(1==1){
		//     return null;
		// }
		var name = cacheId
		var arr = this._effectCacheMap[name]
		//如果不配置 默认给2个
		var maxLength: number = this.effectMaxNumsMap[cacheId] || 3;
		//如果当前数量没有达到上限
		if (!arr || arr.length < maxLength) {
			return null;
		}
		var eff: any = arr.shift();
		this.controler.clearCallBack(eff);
		//如果是跟随的 把这个特效从 对象队列里面移除
		if (eff._followTarget) {

			TableUtils.removeValue(eff._followTarget._followEffGroup, eff);
		}
		return eff;
	}

	//创建了一个特效
	public setCacheEffect(effect: InstanceEffect, name: string) {
		var arr = this._effectCacheMap[name]
		if (!arr) {
			arr = []
			this._effectCacheMap[name] = arr
		}
		arr.push(effect);
	}

	//移除一个缓存动画
	public removeCacheEffect(effect: InstanceEffect) {
		var name: string = effect.viewName;
		var arr = this._effectCacheMap[name]
		if (!arr) {
			return
		}

		TableUtils.removeValue(arr, effect);

	}

	//清除所有的特效缓存 只需要把长度清0. 销毁是在logical 里面做的
	public clearAllCacheEffect() {
		for (var i in this._effectCacheMap) {
			this._effectCacheMap.length = 0;
		}
	}

	//获取某个特效动作的长度
	public getEffectLength(effect: string, index: number = 0) {
		var frame = SkeletonExpand.getAniFrame(effect, index);
		if (frame == -1) {
			if (PerformanceControler._effectLength[effect]) {
				return PerformanceControler._effectLength[effect]
			}
			return 60;
		}
		return frame * BattleFunc.battleViewFrameScale;

	}

	//特效长度，未定义的默认为150
	private static _effectLength: any = {
		["effect_huangniao_skill01_AOE"]: 240, //小黄鸡大招时长
		["effect_foxi_attack_hit"]: 30, //佛系印记
	};
	//--------------------------飘字模块------------------------------------------------

	//飘字文本缓存
	private static _effectLabelCache: any = {
		["normal"]: {nums: 5, views: []},
		["crit"]: {nums: 5, views: []},
		["miss"]: {nums: 5, views: []},
		["trit"]: {nums: 5, views: []},
		["tritCrit"]: {nums: 5, views: []},
		["hudun"]: {nums: 5, views: []}

	};

	// 创建一个飘字特效
	public createNumEff(type: string, value: number, targetInstance: InstanceLogical) {
		//下一个文本的创建等待时间
		var txtCount = targetInstance.txtUpdateCount
		var data = {type: type, value: value, targetInstance: targetInstance}
		//等待为0直接创建
		if (txtCount == 0) {
			this.setTxtShowBack(data)
		} else {
			//不为0就等到了可创建时间再创建
			this.controler.setCallBack(txtCount, this.setTxtShowBack, this, data)
		}
		//重置下一个的创建时间
		targetInstance.addTxtCreateTime();

	}

	setTxtShowBack(data) {
		var type = data.type;
		var value = data.value;
		var targetInstance = data.targetInstance;
		var info = PerformanceControler._effectLabelCache[type];
		var viewArr: any[] = info.views;
		var maxNums = info.nums;
		var targetItem: BattleDamageLabel;
		var x = targetInstance.pos.x;
		var y = targetInstance._myView.y - targetInstance.cfgData.size[0] + 10;
		if (viewArr.length > maxNums) {
			targetItem = viewArr.shift();
			this.controler.tweenControler.clearOneTween(targetItem);
		} else {
			targetItem = new BattleDamageLabel();
			targetItem["__tempParams"] = {};
		}
		targetItem.setValue(type, value);
		targetItem.x = x;
		targetItem.y = y;
		var param = targetItem["__tempParams"];
		param.x = x;
		param.y = y - 100;
		this.controler.layerControler.a23.addChild(targetItem);
		viewArr.push(targetItem);
		this.controler.tweenControler.setTweenByView(0.5 * GameConsts.gameFrameRate, targetItem, param, BattleConst.TWEEN_MOVE, this.onLabelTweenComplete, this, targetItem);
	}

	//一个文本缓存完成
	private onLabelTweenComplete(label: BattleDamageLabel) {

		//把label从舞台移除
		label.removeSelf();
	}


	//技能暂停时 也继续执行
	public isRunWithSkillPause() {
		return true;
	}


	//显示黑屏
	public showBlackScreen(targetRole: InstanceLogical, lastFrame: number = 0, useArr: InstanceLogical[] = null) {
		if (!this.blackScreen.parent) {
			this.controler.layerControler.a22.addChild(this.blackScreen);
		}
		//先隐藏黑屏.
		this.hideBlackScreen();
		var allArr = this.controler.getAllInstanceArr();
		for (var i = 0; i < allArr.length; i++) {
			var instance: InstanceBasic = allArr[i];
			if (!instance.isRunWithSkillPause()) {
				instance.stopAction();
			} else {
				instance.setZorderOffset(BattleFunc.zorder_blackScreen)
			}
		}
		this.controler.sortChildren(true);
		this.controler.isSkillPause = true;
		//同步坐标.因为a22是在运动的 需要让黑屏永远锁定在屏幕中心
		this.blackScreen.x = -this.controler.layerControler.a2.x - 300
		//设置目标角色zorderoffset
		this.controler.clearCallBack(this, this.hideBlackScreen);
		// this.controler.layerControler.a22.addChild(this.blackScreen);
		this.blackScreen.visible = true
		if (lastFrame > 0) {
			this.controler.setCallBack(lastFrame, this.hideBlackScreen, this);
		}
	}

	//隐藏黑屏
	public hideBlackScreen() {
		this.controler.isSkillPause = false;
		this.blackScreen.visible = false;
		;
		var allArr = this.controler.getAllInstanceArr();
		for (var i = 0; i < allArr.length; i++) {
			var instance: InstanceBasic = allArr[i];
			instance.resumeAction();
			instance.setZorderOffset(0)
		}
		this.controler.sortChildren(true);

	}


	//--------------------------------------------------------------------------------------------------------------
	//------------------------------怪物死亡获得金币以及关卡结束获得资源-------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------


	//资源坐标缓存
	private static _resourcePointCache = {
		[DataResourceType.COIN]: new Laya.Point(90, 10),
		[DataResourceType.GOLD]: new Laya.Point(254, 10),
		[DataResourceType.SP]: new Laya.Point(35, 35),
	}


	private static _tempPos: Laya.Point = new Laya.Point();

	//战斗结束
	public onBattleWin(fromx, fromy) {


	}


	/**
	 * //飘一个资源动画
	 * @param resId  资源id
	 * @param fromx
	 * @param fromy
	 * @param value 资源值
	 * @param fromCtn 从哪个容器来的坐标
	 */
	public flyResourceAnimation(resId, fromx, fromy, value, delayFrame: number = 0, fromCtn: Laya.Sprite = null) {

		BattleLogsManager.battleEcho("获得资源:", resId, "value:", value);

		//获取金币icon
		var iconPath = DataResourceFunc.instance.getIconById(resId);

		var cacheItem = PoolTools.getItem(iconPath);
		if (!cacheItem) {
			cacheItem = new Laya.Image(iconPath);
			cacheItem["_cacheParams"] = {};
		}
		var resPos: Laya.Point = PerformanceControler._resourcePointCache[resId]
		if (!resPos) {
			resPos = new Laya.Point(35, 35);
			PerformanceControler._resourcePointCache[resId] = resPos
		}
		var group: Laya.Sprite = this.controler.battleUI.ui.group_player;
		//把自身坐标转化为相对坐标
		var tempPos = PerformanceControler._tempPos;
		tempPos.x = fromx
		tempPos.y = fromy
		if (!fromCtn) {
			fromCtn = this.controler.layerControler.a22
		}
		fromCtn.localToGlobal(tempPos);
		cacheItem.name = iconPath;
		group.globalToLocal(tempPos);
		cacheItem.pos(tempPos.x, tempPos.y, true);
		group.addChild(cacheItem);
		var tweenParams = cacheItem["_cacheParams"]
		tweenParams.x = resPos.x
		tweenParams.y = resPos.y
		//存储临时变量
		tweenParams._tempValue = value
		tweenParams._tempType = resId;

		//做缓动
		if (delayFrame) {
			TimerManager.instance.add(this.delayFlyItem, this, delayFrame * 1000 / 60, 1, false, [cacheItem]);
		} else {
			TimerManager.instance.add(this.delayFlyItem, this, 10, 1, false, [cacheItem]);
			// this.delayFlyItem(cacheItem);
		}

	}

	private delayFlyItem(cacheItem) {
		this.controler.tweenControler.setTweenByView(45, cacheItem, cacheItem["_cacheParams"], BattleConst.TWEEN_MOVE, this.onItemTweenEnd, this, cacheItem);
	}

	//缓动结束 移除icon
	private onItemTweenEnd(targetItem: Laya.Image) {
		targetItem.removeSelf();
		var params = targetItem["_cacheParams"]
		var id = params._tempType;
		var value = params._tempValue;

		PoolTools.cacheItem(targetItem.name, targetItem);
	}


}