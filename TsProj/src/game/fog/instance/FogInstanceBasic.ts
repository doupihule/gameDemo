export default class FogInstanceBasic extends Laya.Image {

	public cacheId;
	public fogControler;
	public pos;
	public classModel;
	public _myView;
	public viewWay: number;

	constructor(fogControler) {
		super();

		this.anchorX = 0.5;
		this.anchorY = 0.5;
		this.fogControler = fogControler;
		this.pos = new Laya.Vector3();

	}

	public setData(data) {

	}

	//逐帧刷新函数
	updateFrame() {
		//这里写一些空函数,供子类重写.
		this.doAiLogical()
	}

	//循环外刷新 先所有对象执行updateframe  后 在执行updateFrameLater
	updateFrameLater() {
		this.movePos()
		this.realShowView();
	}

	//设置旋转角度
	public setRotation(value: number) {

	}

	//执行ai逻辑
	public doAiLogical() {

	}

	//子类重写运动函数
	movePos() {

	}

	//实现坐标
	realShowView() {
		var x = this.pos.x;
		var y = this.pos.y + this.pos.z
		this.x = x;
		this.y = y;
	}

	//设置坐标
	setPos(x: number = 0, y: number = 0, z: number = 0) {
		this.pos.x = x;
		this.pos.y = y;
		this.pos.z = z;
		this.realShowView()
	}

	//设置视图
	setView(view: any) {
		if (this._myView != view) {
			this.disposeView();
		}
		this._myView = view;
	}

	//设置视图方位
	public setViewWay(value: number) {
		this.viewWay = value;
		if (this._myView) {
			this._myView.scale(this._myView._viewScale * value, this._myView._viewScale)
		}
	}


	//销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
	public dispose() {
		this.removeSelf();
	}

	//从舞台移除
	public onSetToCache() {
		this.removeSelf();
	}

	private disposeView() {
		if (this._myView) {
			if (this._myView.parent) {
				this._myView.parent.removeChild(this._myView);
			}
			this._myView = null;
		}
	}
}