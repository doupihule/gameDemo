import InstanceMove from "./InstanceMove";
import DisplayUtils from "../../../framework/utils/DisplayUtils";
import GameConsts from "../../sys/consts/GameConsts";
import BattleConst from "../../sys/consts/BattleConst";
import BattleFunc from "../../sys/func/BattleFunc";
import BattleBuffData from "../data/BattleBuffData";
import LogsManager from "../../../framework/manager/LogsManager";
import PoolTools from "../../../framework/utils/PoolTools";
import PoolCode from "../../sys/consts/PoolCode";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import RoleHealthBar from "../view/RoleHealthBar";
import BattleRoleView from "../view/BattleRoleView";
import RoleBuffBar from "../view/RoleBuffBar";
//life 表现相关类. 比如 震屏, 闪红,  硬直
export default class InstancePerformance extends InstanceMove {

	//角色类型 1是地面小兵 2是空中小兵 3是地面建筑 4是基地 9是技能控制器
	public lifeType: number;
	//血条
	public hpBar: RoleHealthBar;
	//buff
	public buffBar: RoleBuffBar;
	//兵种子对象显示数量 默认是1个
	public childViewNums: number = 1;
	public totalViewNums: number = 1;

	//硬直时间
	public stillFrame: number = 0;
	//受击闪红
	protected _flashFrame = 0;
	//质量
	public mass: number = 1;
	//当前的动作标签
	public label: string;
	//动画帧长度数据
	protected _frameDatas: any;
	//死亡状态 0 是没有死亡, 1 是死亡中,2是死亡行为完成
	public diedState: number = 0;
	//剩余死亡帧数
	protected _leftDiedFrame: number = 0;
	//记录当前的透明度
	protected _noteAlpha: number = 1;

	//技能加速效果表 {skillId:speed,}
	protected _sKillSppedUpMap: any

	//实际尺寸. 用来算血条高度的.
	public realSize: number[]


	//存储上次瞬移的坐标
	public lastPos: Laya.Vector3;

	//阵位排序 根据阵位需要调整的Z坐标
	public targetZPos: number = 0;


	//影子
	private _shade: Laya.Image;

	//子对象view  只是做表现
	public _childViewArr: any[];


	//view视图暂停 计数 0表示 不暂停 >1 表示暂停
	//  游戏暂停 技能暂停 自身动画暂停
	protected _viewPasuseValue: number = 0;

	/**文本飘字创建的总间隔时间 */
	public txtUpdateCount = 0;


	//硬直抖动
	/**
	 * frame: 持续时长
	 * style:  样式
	 * strength 力度 默认为1
	 * intervel   频率
	 * x       x偏移
	 * y        y偏移
	 */
	protected _shakeParams: any;

	public shadeOffestX = 0;

	constructor(controler: any) {
		super(controler);
		this._followEffGroup = [];
		this.realSize = [10, 10];
		//晃动参数
		this._shakeParams = {frame: 0, stype: "x", strength: 1, intervel: 1, x: 0, y: 0};
	}


	//初始化数据
	public setData(data) {
		if (!this.lastPos) {
			this.lastPos = new Laya.Vector3();
		}
		this._sKillSppedUpMap = {};
		super.setData(data);
		this._viewPasuseValue = 0;
		if (this._myView) {
			this._myView.alpha = 1;
			this._myView.setChildViewPos(0, 0);
		}
		this._noteAlpha = 1;
		this._leftDiedFrame = 0;
		if (this._myView2) {
			this._myView2.alpha = 1;
			this._myView.setChildViewPos(0, 0);
		}
		this._aniPlaySpeed = 1;
		// this.setLifeKind(this.cfgData.kind)

	}

	public doAiLogical() {
		super.doAiLogical();
		// if(this.updateCount % 120 ==0){
		//     this.hitedflash();
		// }
		this.doPerformance();
		this.doDiedEffect();
		this.doShadeFollow();
	}

	//执行表现逻辑
	protected doPerformance() {
		//自身抖动
		this.checkShake();
	}

	//自身抖动. 后续扩展
	protected checkShake() {
		var shakeParams = this._shakeParams
		if (shakeParams.frame <= 0) {
			return;
		}
		this.controler.cameraControler.updateShakeParams(shakeParams);
		//设置子对象硬直
		this._myView.setChildViewPos(shakeParams.x * this._viewWay, shakeParams.y);

	}

	/**增加当前的文本创建间隔 */
	public addTxtCreateTime() {
		this.txtUpdateCount += 5;
	}

	//影子做跟随
	protected doShadeFollow() {
		if (!this._shade) {
			return;
		}
		this._shade.x = this.pos.x + this.shadeOffestX;
		this._shade.y = this.pos.z;
	}

	//创建影子
	public createShade() {

		this._shade = new Laya.Image();
		//根据尺寸动态缩放影子
		var scale = BattleFunc.instance.getShadeScale(this.cfgData.size[1] * this.cfgScale)

		var formation: any[] = BattleRoleView.getPosArrByViewNums(this.childViewNums);


		for (var i = 0; i < this.childViewNums; i++) {
			var childShade: Laya.Image = this.controler.createShade();
			childShade.scale(scale, scale);
			var posOffset = formation[i];
			var xSpace = this._myView._xSpace;
			var ySpace = this._myView._ySpace;
			childShade.pos(xSpace * posOffset[0] + 2, ySpace * posOffset[1] + 3, true);
			childShade.scale(scale, scale, true);
			this._shade.addChild(childShade);
		}


		this.controler.layerControler.a21.addChild(this._shade);

		// this._shade.scale(scale, scale);
		this._shade.x = this.pos.x;
		this._shade.y = this.pos.z;

	}


	//设置视图名字
	public setViewName(value: string) {
		this.viewName = value;
		var frameCfg = BattleFunc.instance.getCfgDatasByKey("RoleAct", value, "act");
		if (!frameCfg) {
			this._frameDatas = {};
			return;
		}
		if (this._frameDatas) {
			return;
		}
		this._frameDatas = {}
		for (var i = 0; i < frameCfg.length; i++) {
			var info = frameCfg[i];
			this._frameDatas[info[0]] = Number(info[1]);
		}

	}


	//------------------------------死亡表现---------------------------------

	//执行死亡效果
	protected doDiedEffect() {

		//透明度闪烁下降消失
		if (this._leftDiedFrame > 0) {
			var yushu = this._leftDiedFrame % 4;
			this._noteAlpha -= 0.05;
			var disAlpha = 0.2;
			if (yushu == 0) {
				this._myView.alpha = this._noteAlpha + disAlpha
			} else if (yushu == 2) {
				this._myView.alpha = this._noteAlpha - disAlpha
			}
			this._leftDiedFrame--;
			if (this._myView2) {
				this._myView2.alpha = this._myView.alpha;
			}
			if (this._leftDiedFrame == 0) {
				this._myView.alpha = 0
				this.doEndDiedLogical();
			}


		}
	}

	//彻底死亡
	protected doEndDiedLogical() {
		this.diedState = BattleConst.DIED_STATE_OVER;
		//隐藏血条
		if (this.hpBar) {
			this.hpBar.delayHide();
		}
		//隐藏影子
		if (this._shade) {
			this._shade.visible = false;
		}
	}


	//执行复活表现
	protected doRelivePerformance() {
		//播放特效.
		//透明度渐变显示
		this.setViewAlpha(0.3);
		this.controler.tweenControler.setOneTween(30, this, {a: 1}, BattleConst.TWEEN_ALPHA);
	}


	//执行死亡逻辑
	protected startDoDiedPerformance() {
		//执行死亡逻辑 .暂定1秒时间执行死亡特效
		this.initStand();
		//非建筑角色 播放死亡动画 而且必须有死亡动作长度
		var frame = this._frameDatas[BattleConst.LABEL_DEAD]
		if (this.lifeType != BattleConst.LIFE_LANDBUILD && frame) {
			frame = this.getActionFrame(BattleConst.LABEL_DEAD);
			this.playAction(BattleConst.LABEL_DEAD, false, false)
			//在死亡动作的最后一帧 做渐隐消失
			this.controler.setCallBack(frame, this.onDeadActionEnd, this);
		} else {
			this.onDeadActionEnd();
		}


	}

	//死亡动作结束
	protected onDeadActionEnd() {
		this._leftDiedFrame = BattleFunc.deadLastFrame;
		this._noteAlpha = 1;
		this.controler.tweenControler.clearOneTween(this);
	}


	//------------------------挨打相关----------------------------------------------

	//受击闪红 闪红时间4帧
	public hitedflash(frame: number = 4) {
		DisplayUtils.setViewLittleRed(this._myView);
		this._myView2 && DisplayUtils.setViewLittleRed(this._myView2);
		this.controler.setCallBack(frame, this.clearFlash, this);
	}

	//清除闪红
	private clearFlash() {
		DisplayUtils.clearViewFilter(this._myView);
		this._myView2 && DisplayUtils.clearViewFilter(this._myView2);

	}

	//被击退 冲量  impulseZ z方向冲量
	public onHitedBack(attacker: InstancePerformance, impulse: number, impulseZ: number, lastFrame: number = 0) {
		if (!impulseZ) {
			impulseZ = 0;
		}
		//空中单位暂时不会被击飞
		if (this.lifeType == BattleConst.LIFE_AIRHERO || this.lifeType == BattleConst.LIFE_JIDI) {
			return;
		}
		//如果已经是在空中的 那么不能被击退
		if (this._myState == BattleConst.state_jump) {
			return;
		}
		//如果正在执行死亡行为;
		if (this.diedState != BattleConst.DIED_STATE_NONE) {
			return;
		}

		var speed = impulse / this.mass / GameConsts.gameFrameRate;
		var disx = attacker.pos.x - this.pos.x;
		var way = -1;
		if (disx > 0) {
			way = -1;
		} else {
			way = 1
		}
		;

		var speedz = 0;
		if (impulseZ != 0) {
			var disz = attacker.pos.z - this.pos.z;
			var wayz = -1;
			if (disz > 0) {
				wayz = -1;
			} else {
				wayz = 1;
			}
			speedz = impulseZ / this.mass / GameConsts.gameFrameRate * wayz;
		}

		//计算一个击退时间;
		//给一个阻尼系数
		this.controler.clearCallBack(this, this.resumeIdleAction);
		this.controler.clearCallBack(this, this.resumeHitedBody);
		this.changeViewPauseValue(1);
		this.dragForce.x = 0.95;
		this.dragForce.z = 0.95;

		this.setViewWay(-way);
		this.initMove(speed * way, 0, speedz, true);
		this.controler.setCallBack(lastFrame, this.resumeHitedBody, this);
		this.controler.cameraControler.shakeCamera(2, null, 1, 1);

	}

	// 复原挨打身位
	protected resumeHitedBody() {
		this.dragForce.x = 1;
		this.initStand();
		this.changeViewPauseValue(-1);
		this.playAction(BattleConst.LABEL_IDLE, true, false, true)
	}


	//被击飞 水平飞行速度;高度与距离的系数比;最大高度;水平飞行距离 滑行速;滑行加速度;
	public onBeHitFly(params: any[], attacker: InstancePerformance) {
		//空中单位暂时不会被击飞
		if (this.lifeType == BattleConst.LIFE_AIRHERO || this.lifeType == BattleConst.LIFE_JIDI) {
			return;
		}
		//如果正在执行死亡行为;
		if (this.diedState != BattleConst.DIED_STATE_NONE) {
			return;
		}
		if (this._myState == BattleConst.state_jump) {
			return;
		}
		this.gravityAble = true;
		var disx = attacker.pos.x - this.pos.x;
		var way = -1;
		if (disx > 0) {
			way = -1;
		} else {
			way = 1
		}
		;


		//这里根据目标质量算
		var dis = this.mass / 100 * params[3];
		var flyDisTance = params[1] / 10000 * dis;
		var maxFlyDis = params[2];
		if (flyDisTance > maxFlyDis) {
			flyDisTance = maxFlyDis;
		}
		var spdValue = BattleFunc.instance.turnSpeedToFrame(params[0]);
		var moveFrame = Math.ceil(dis / spdValue);
		// //忽略调整方向
		this.initMove(spdValue * way, 0, 0, true);
		var halft = moveFrame / 2;
		// //计算y速度
		this.addSpeed.y = flyDisTance * 2 / (halft * halft);
		// //初始化跳跃
		this.initJump(-this.addSpeed.y * halft)

		var slideSpeed = BattleFunc.instance.turnSpeedToFrame(params[4]) * way;
		var addSpeed = BattleFunc.instance.turnAddSpeedToFrame(params[5]) * way;

		this.controler.setCallBack(moveFrame, this.onStartSlide, this, [slideSpeed, addSpeed], true)

	}

	//开始滑行
	public onStartSlide(speedValue, addSpeed: number) {
		this.pos.y = 0;
		this.gravityAble = false;
		var frame = Math.floor(Math.abs(speedValue / addSpeed));
		this.initMove(speedValue, 0, 0, true);
		this.addSpeed.x = addSpeed;
		this.controler.setCallBack(frame, this.resumeHitedBody, this);

	}


	//----------------------------动画接口-----------------------------------------

	//封装动画播放接口
	public playAction(label: string, loop: boolean, resumeIdle: boolean = true, force: boolean = false, start: number = 0, end: number = 0) {
		if (this.label == label && !force) {
			return;
		}
		this._viewPasuseValue = 0;
		this.label = label;
		if (!this._myView) {
			return;
		}
		this._myView.play(label, loop, force, start, end);
		this._myView2 && this._myView2.play(label, loop, force, start, end);
		//如果不是循环的 动画播放完毕后还原idle
		if (!loop) {
			if (resumeIdle) {
				this.controler.setCallBack(this.getActionFrame(label), this.resumeIdleAction, this);
			}
		}
	}


	//播放循环动画接口
	public playSpecialSysAction(actionName: any, sysTime: number, startTime: number, endTime: number, actionLength: number = 0) {
		var totalframe = super.playSpecialSysAction(actionName, sysTime, startTime, endTime, actionLength, this._aniPlaySpeed);
		this._viewPasuseValue = 0;
		this.label = actionName;
		//设置特定时间后 复原
		this.controler.setCallBack(Math.round(totalframe / this._aniPlaySpeed), this.resumeIdleAction, this);
		return totalframe
	}


	//第一步完成
	protected onStartActionComp() {
		var aniParams = this._tempAnimObj;
		if (this.label != aniParams.actionName) {
			return;
		}
		this._myView.play(this._tempAnimObj.actionName, true, true, aniParams.startTime, aniParams.endTime);
	}

	//循环部分完成. 播放最后一部分
	protected onSysActionComp() {
		var aniParams = this._tempAnimObj;
		if (this.label != aniParams.actionName) {
			return;
		}
		this._myView.play(this._tempAnimObj.actionName, false, true, aniParams.endTime);
	}

	//恢复动画播放
	public resumeAction() {
		//如果是游戏暂停状态或者是技能暂停状态不能复原动画
		if (this.controler._isGamePause || this.controler.isSkillPause) {
			return;
		}
		//如果是动画暂停的
		if (this._viewPasuseValue > 0) {
			return;
		}
		this._myView.resume();
		this._myView2 && this._myView.resume();
		this.playAction(BattleConst.LABEL_IDLE, true, false, true)
	}

	//停止动画
	public stopAction() {

		this._myView.stop();
		this._myView2 && this._myView.stop();
	}

	//设置视图暂停计数
	public changeViewPauseValue(value: number) {
		this._viewPasuseValue += value;
		if (this._viewPasuseValue < 0) {
			this._viewPasuseValue = 0;
		}
		;
		if (this._viewPasuseValue > 0) {
			this.stopAction();
		} else {
			this.resumeAction();
		}
	}


	//-------------------------------------------------

	//加入一个buff 需要做特效表现
	public insterOneBuff(buff: BattleBuffData) {
		//创建buff特效
		this.createEffByParams(buff.cfgData.buffEffect, true, true);
		//播放声音
		if (buff.cfgData.sound) {
			this.playSound(buff.cfgData.sound);
		}
	}

	//移除一个buff. 移除buff对应的特效
	public clearOneBuff(buff: BattleBuffData) {
		//清除一组特效
		this.clearEffByParams(buff.cfgData.buffEffect);
	}

	//修正y坐标
	public adjustToTargetZpos() {
		var disZ = this.targetZPos - this.pos.z
		var absDisz = Math.abs(disZ);
		//对z坐标做微调
		if (absDisz > 2) {
			this.speed.z = absDisz / disZ;
		}

	}


	//还原闲置动作
	public resumeIdleAction() {
		if (this._myState != BattleConst.state_stand) {
			return;
		}
		//如果不是idle的 不能还原动作
		this.playAction(BattleConst.LABEL_IDLE, true, false, true);
	}

	//获取动画长度
	protected getActionFrame(label) {
		var frame = this._frameDatas[label]
		if (!frame) {
			BattleLogsManager.battleWarn("动作标签没有配置长度,id:", this.dataId, "label:", label);
			frame = 10
			// this._frameDatas[label] = frame;
		}
		return frame * BattleFunc.battleViewFrameScale;
	}


	//复原到上一次的坐标
	public resumeToLastPos() {
		this.setPos(this.lastPos.x, this.lastPos.y, this.lastPos.z);
	}

	//记录瞬移之前的坐标
	public setLastPos(x, y, z) {
		this.lastPos.x = x;
		this.lastPos.y = y;
		this.lastPos.z = z;
	}

	public movePos() {
		super.movePos();
		if (this.pos.z > BattleFunc.battleDownY) {
			this.pos.z = BattleFunc.battleDownY
		} else if (this.pos.z < BattleFunc.battleUpY) {
			this.pos.z = BattleFunc.battleUpY;
		}
	}


	//----------------------创建声音--------------------------------
	//释放音效：音效名,播放延迟(毫秒),播放次数,播放间隔（毫秒）;
	public createSoundByParams(soundCfgs: any[]) {
		if (!soundCfgs || soundCfgs.length == 0) {
			return;
		}

		for (var i = 0; i < soundCfgs.length; i++) {
			var cfgs = soundCfgs[i];
			var delayFrame = BattleFunc.instance.turnMinisecondToframe(cfgs[1]);
			var times = Number(cfgs[2]);
			//播放间隔
			var inteval = BattleFunc.instance.turnMinisecondToframe(cfgs[3]);
			this.controler.setLastCallBack(delayFrame, inteval, times, this.playSound, this, cfgs[0]);
		}

	}

	//播放声音
	public playSound(str: string) {
		this.controler.playSound(str);
	}

	//震动角色 震动时长,  震动方式,style:1 (只x方向震动),2(只y方向震动),其他(xy方向同时震动),strength: 振幅 像素 intervel震动间隔 默认2帧减一次
	public setShakeParams(shakeFrame, style: number = 0, strength: number = 3, intervel: number = 2) {
		//如果还在震动中return
		if (this._shakeParams.frame > 0) {
			return;
		}
		this._shakeParams.frame = shakeFrame;
		this._shakeParams.style = style;
		this._shakeParams.strength = strength;
		this._shakeParams.intervel = intervel;

	}

	//按照参数震屏
	// 震屏参数, 延迟时间,震屏方式,持续时间,震屏力度,震屏频率
	public shakeCameraByParams(params: any[]) {
		var frame = Number(params[3]);
		// BattleLogsManager.battleEcho("battle,被硬直了", TableUtils.safelyJsonStringfy(params));
		this.setShakeParams(frame, Number(params[2]), Number(params[4]), Number(params[5]));
	}


	//技能加速比例 万分比
	public setSkillSpeedUpValue(skillId: string, value: number) {
		var tempValue = this._sKillSppedUpMap[skillId];
		if (tempValue == null) {
			tempValue = 10000;
		}
		tempValue += value;
		if (tempValue < 0) {
			tempValue = 0;
		}
		this._sKillSppedUpMap[skillId] = tempValue;
	}

	//获取技能 速率 万分比
	public getSkillSpeedUpValue(skillId: string) {
		var tempValue = this._sKillSppedUpMap[skillId];
		if (tempValue == null) {
			tempValue = 10000;
		}
		if (tempValue < 0) {
			LogsManager.errorTag("技能速率不能为0,设置最低速率为30%");
			tempValue = 3000;
		}
		return tempValue / 10000;
	}


	//当被放入缓存的时候 销毁所有的特效
	public onSetToCache() {
		super.onSetToCache();
		//销毁所有的缓存特效
		this.clearAllFollowEffect();
		if (this._shade) {
			this._shade.removeSelf();
			for (var i = this.totalViewNums - 1; i >= 0; i--) {
				var childShade = this._shade.getChildAt(i);
				PoolTools.cacheItem(PoolCode.POOL_SHADE, childShade);
				childShade.removeSelf();
			}
			this._shade = null;
		}
		//清除受击效果
		this.clearFlash();
	}

	//判断是否能移动
	public checkCanMove() {
		return this.lifeType != BattleConst.LIFE_JIDI && this.lifeType != BattleConst.LIFE_LANDBUILD
	}


}