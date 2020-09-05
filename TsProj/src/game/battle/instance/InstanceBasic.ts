import BattleLogicalControler from "../controler/BattleLogicalControler";
import BattleFunc from "../../sys/func/BattleFunc";
import Base3dViewExpand from "../../../framework/components/d3/Base3dViewExpand";
import PhysicsColliderExpand from "../../../framework/components/physics/PhysicsColliderExpand";
import VectorTools from "../../../framework/utils/VectorTools";
import UICompConst from "../../../framework/consts/UICompConst";

/**
 * author:xd
 * 游戏中所有对象的基类. 具备坐标.视图.和刷新 逻辑
 */
export default class InstanceBasic {
	private _isDisposed: boolean;
	//备注:如果要实现复盘逻辑. 这个对象是可以不需要view的
	//我的显示对象
	public _myView: Base3dViewExpand;
	public collider: PhysicsColliderExpand;

	expendZorder: number = 0;		//扩展的深度排序,特殊情况下 需要设置这个值 保证我的显示在最前面或者最后面

	//为了考虑后面的横版或者俯视视野的游戏兼容 后面所有的坐标都是伪3D坐标.没有z轴可以不适用 坐标给public属性是因为外部访问频繁.需要提高访问速度.尤其是对战斗复盘的时候
	pos: {x,y,z};
	controller: BattleLogicalControler;
	//自身传入的数据.根据游戏需要 定义.
	protected _data: any;
	//对应的数据id
	public dataId: string;

	//当前的网格坐标
	public gridPos: {x,y,z};
	public updateCount: number = 0;
	protected cfgsData: any;
	public instanceId: number = 0;
	private static _instanceCount: number = 0;

	public rotation: {x,y,z};
	//对应的弧度角度角度.目的是为了减少计算量
	public rotationRad: {x,y,z};

	//视图缩放系数
	public viewScale: number = 1;

	public rigid;

	public constructor(controller: any) {
		//拿到游戏控制器和数据
		this.controller = controller;
		this.pos = VectorTools.createVec3();
		InstanceBasic._instanceCount++;
		this.instanceId = InstanceBasic._instanceCount;
		this.rotation = VectorTools.createVec3();
		this.rotationRad = VectorTools.createVec3();
	}
	//设置数据
	setData(data: any) {
		this._data = data;
		if (data && data.id) {
			this.dataId = data.id
		}
		//清除自身注册的所有回调 防止因为复用时 还注册了回调导致报错
		this.controller.clearCallBack(this);
	}

	//获取数据
	getData() {
		return this._data;
	}

	//自身数据发生变化
	//changeData 变化的数据 
	//供子类重写
	onDataChange(changeData: any) {
		//数据发生变化需要刷新视图
		this.updateView()
	}
	//更新视图供子类重写
	updateView() {
	}

	//设置视图
	setView(view: any, x: number = 0, y: number = 0, z: number = 0, parent = null) {
		if (this._myView != view) {
			this.disposeView();
		}
		this._myView = view;
		this.setPos(x, y, z);
		this.updateView();
		this.collider = this._myView.getComponent(UICompConst.comp_collider);
	}

	//设置坐标
	setPos(x: number = 0, y: number = 0, z: number = 0) {
		this.pos.x = x;
		this.pos.y = y;
		this.pos.z = z;
		this.realShowView()
	}

	//逐帧刷新函数
	updateFrame() {
		this.updateCount++;
		//这里写一些空函数,供子类重写.
		this.doAiLogical()
		this.updateSpeed()

	}

	updateFrameLater() {
		this.movePos()
		this.realShowView();
	}


	//执行ai逻辑
	public doAiLogical() {

	}

	//更新速度
	protected updateSpeed() {

	}

	//子类重写运动函数
	movePos() {

	}

	//实现坐标
	realShowView() {
		if (!this._myView) {
			return
		}
		var sp: Base3dViewExpand;
		if (!this.rigid) {
			this._myView.set3dPos(this.pos.x,this.pos.y,this.pos.z);
		}
		// this._myView.transform.x = this.pos.x;
		// this._myView.transform.y = this.pos.y;
		// this._myView.transform.z = this.pos.z;
	}


	//创建特效 默认1500帧以后自动缓存 .根据特效长度去定义 
	public createEfect(effectName: string, ofx, ofy, ofz, isFollow, frame: number, withRotate: boolean = false) {

		var eff = this.controller.createEffect({ id: effectName });
		eff.setPos(this.pos.x + ofx, this.pos.y + ofy, this.pos.z + ofz);
		eff.setLastFrame(frame);
		if (withRotate) {
			eff.setRadian(this.rotationRad.x, this.rotationRad.y, this.rotationRad.z);
		}
		if (isFollow) {
			eff.setFollowTarget(this, withRotate, ofx, ofy, ofz);
			//如果是 跟随的 那么需要把他放到刷新数组队列里面去
			this.controller.getAllInstanceArr().push(eff);
		}
		return eff;
	}


	//设置旋转弧度
	public setRadian(rx, ry, rz) {

		if (rx != null) {
			this.rotationRad.x = rx;
			rx = rx * BattleFunc.radtoAngle;
			this.rotation.x = rx;
		}
		if (ry != null) {
			this.rotationRad.y = ry;
			ry = ry * BattleFunc.radtoAngle;
			this.rotation.y = ry;
		}
		if (ry != null) {
			this.rotationRad.z = rz;
			rz = rz * BattleFunc.radtoAngle;
			this.rotation.z = rz;
		}

		var childView: Base3dViewExpand = this._myView;
		if (!childView) {
			return;
		}
		//设置当前view的角度
		childView.set3dRotation(this.rotation.x,this.rotation.y,this.rotation.z);
	}

	//初始化旋转弧度
	public initRadian() {
		var childView: Base3dViewExpand = this._myView;
		if (!childView) {
			return;
		}
		//设置当前view的角度
		var viewR = childView.get3dRotation();
		VectorTools.cloneTo(viewR,this.rotation);
	}

	public setViewScale(scale) {
		this.viewScale = scale;
		var childView: Base3dViewExpand = this._myView;
		if (!childView) {
			return;
		}
		var tempP = BattleFunc.tempPoint;
		tempP.x = tempP.y = tempP.z = scale;
		childView.setScale(scale,scale,scale);
	}

	//设置网格坐标
	// setGridPos(x:number,y:number){
	// 	this.gridPos.x = x;
	// 	this.gridPos.y = y;
	// 	var worldPos:{x,y,z} = BattleFunc.instance.getWorldPosByGridPos(x,y);
	// 	this.setPos(worldPos.x,worldPos.y);
	// }

	getView(): any {
		return this._myView;
	}

	destroyPre(){
		
	}

	//销毁
	dispose() {
		if (this._isDisposed) {
			return
		}
		this._isDisposed = true;
		this.disposeView()
	}
	//销毁视图对象 如果有特殊销毁.给子类重写,龙骨动画需要手动dispos
	//如果有缓存需求,也可以让子类重写
	private disposeView() {
		if (this._myView) {
			this._myView.setActive(false);
			this._myView.dispose();
			this._myView = null;
		}
	}
	//判断是否被销毁
	checkIsDispose() {
		return this._isDisposed;
	}

	//获取缓存id
	public getPoolId() {
		return "1"
	}

	//当被设置到缓存里面了 子类重写
	onSetToCache() {
		var view: Base3dViewExpand = this._myView;
		if (view) {
			view.setActive(false);
			view.removeSelf();
		}

	}



}