export default class EaseUtils {
	private _easeObject: any = null;
	private _touchObject: any = null;
	private _startX: number = 0;
	private _startY: number = 0;
	private _start2X: number = 0;
	private _start2Y: number = 0;
	private _easeNum: number = 0;
	private _disX: number = 0;
	private _disY: number = 0;
	private _speedX: number = 0;
	private _speedY: number = 0;
	private _isDragMoved: boolean = false;
	//是否缓动按下了
	private _isDragDown: boolean = false;


	private _originX: number = 0;
	private _originY: number = 0;
	private _origin2X: number = 0;
	private _origin2Y: number = 0;
	private _moveStart: boolean = false;
	private _onPosChangeFunc: any;//位置改变时回调
	private _onEaseEndFunc: any;//缓动结束时回调
	private _onClickFunc: any;//缓动中点击回调？
	private _onGloablEndFunc: any;//拖动结束？时回调
	private _onMovedFunc: any;//拖动时回调
	private _onTouchDownFunc: any;//按下时回调
	private _onTwoMovedFunc: any;//双指拖动时回调
	private _onTwoTouchDownFunc: any;//双指按下时回调


	/**
	 * 为组件注册拖拽事件
	 * @param thisObj 函数回调的this
	 * @param onPosChangeFunc 拖动/惯性移动时回调
	 * @param onEaseEndFunc 惯性移动结束时回调
	 * @param easeNum 缓动系数，越高惯性越大，拖拽结束后持续移动距离越长
	 * @param touchObject 拖拽操作触发组件，一般与执行组件一致
	 */
	public constructor(touchObject: any, onPosChangeFunc: any, onEaseEndFunc: any, easeNum: number = 0.75, thisObj: any = null, onClickFunc: any = null, onGloablEndFunc: any = null, onMovedFunc: any = null, onTouchDownFunc: any = null, onTwoMovedFunc: any = null, onTwoTouchDownFunc: any = null) {
		this._easeObject = thisObj;
		this._onPosChangeFunc = onPosChangeFunc;
		this._onEaseEndFunc = onEaseEndFunc;
		this._easeNum = easeNum;
		this._touchObject = touchObject;
		this._onClickFunc = onClickFunc;
		this._onGloablEndFunc = onGloablEndFunc;
		this._onMovedFunc = onMovedFunc;
		this._onTouchDownFunc = onTouchDownFunc;
		this._onTwoMovedFunc = onTwoMovedFunc;
		this._onTwoTouchDownFunc = onTwoTouchDownFunc;
		this._touchObject.mouseEnabled = true;


		// this._touchObject.addEventListener(Laya.Event.TOUCH_TAP,this.onTouchTap,this);
	}



	public touchBeginHandler(event: any) {

		if (event.touches.length > 1) {

			this._originX = event.touches[0].stageX;
			this._originY = event.touches[0].stageY;
			this._startX = event.touches[0].stageX;
			this._startY = event.touches[0].stageY;
			this._origin2X = event.touches[1].stageX;
			this._origin2Y = event.touches[1].stageY;
			this._start2X = event.touches[1].stageX;
			this._start2Y = event.touches[1].stageY;
			this._isDragDown = true;

			this._isDragMoved = false;

			this.stopEase();

			if (this._onTwoTouchDownFunc) {
				this._onTwoTouchDownFunc.call(this._easeObject, event.touches[0].stageX, event.touches[0].stageY, event.touches[1].stageX, event.touches[1].stageY);
			}

			// this._touchObject.off(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
		} else {
			this._originX = event.stageX;
			this._originY = event.stageY;
			this._startX = event.stageX;
			this._startY = event.stageY;
			this._isDragDown = true;

			this._isDragMoved = false;

			this.stopEase();

			if (this._onTouchDownFunc) {
				this._onTouchDownFunc.call(this._easeObject, event.stageX, event.stageY);
			}

			// this._touchObject.off(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
		}

	}

	private touchMoveHandler(event: any) {
		//如果没有按下的 那么不相应move事件
		if (event.touches.length > 1) {
			if (!this._isDragDown) {
				return;
			}
			if (!this._moveStart)
				if (Math.pow(event.stageX - this._originX, 2) + Math.pow(event.stageY - this._originY, 2) >= 900) {
					this._moveStart = true;

				}
			if (!this._moveStart)
				return;

			var disX = event.touches[0].stageX - this._startX;
			var disY = event.touches[0].stageY - this._startY;
			var dis2X = event.touches[1].stageX - this._start2X;
			var dis2Y = event.touches[1].stageY - this._start2Y;

			this._speedX = 0;
			this._speedY = 0;

			this._onPosChangeFunc.call(this._easeObject, disX, disY, event.touches[0].stageX, event.touches[0].stageY, dis2X, dis2Y, event.touches[1].stageX, event.touches[1].stageY);

			this._startX = event.touches[0].stageX;
			this._startY = event.touches[0].stageY;
			this._start2X = event.touches[1].stageX;
			this._start2Y = event.touches[1].stageY;


			if (this._onMovedFunc) {
				this._onMovedFunc.call(this._easeObject, event.stageX, event.stageY);
			}

			this._isDragMoved = true;
		} else {

			if (!this._isDragDown) {
				return;
			}
			if (!this._moveStart)
				if (Math.pow(event.stageX - this._originX, 2) + Math.pow(event.stageY - this._originY, 2) >= 900) {
					this._moveStart = true;

				}
			if (!this._moveStart)
				return;

			var disX = event.stageX - this._startX;
			var disY = event.stageY - this._startY;

			this._speedX = disX;
			this._speedY = disY;

			this._onPosChangeFunc.call(this._easeObject, disX, disY, event.stageX, event.stageY);

			this._startX = event.stageX;
			this._startY = event.stageY;

			if (this._onMovedFunc) {
				this._onMovedFunc.call(this._easeObject, event.stageX, event.stageY);
			}

			this._isDragMoved = true;
		}
	}

	private touchEndHandler(event: any) {
		if (this._onClickFunc && event.type == "mouseup") {
			//只有在不移动的情况下 才会执行moveStart
			if (!this._moveStart) {
				this._onClickFunc.call(this._easeObject, event.stageX, event.stageY);
			}

		}
		this._isDragDown = false;
		this._moveStart = false;
		var disX = event.stageX - this._startX;
		var disY = event.stageY - this._startY;
		console.log(disX + " " + event.stageX + " " + this._startX + " " + disY + " " + event.stageY + " " + this._startY + " ")
		this._startX = event.stageX;
		this._startY = event.stageY;
		if (this._isDragMoved) {
			this.startEase(this._speedX, this._speedY);
		} else if (this._onEaseEndFunc) {
			this._onEaseEndFunc.call(this._easeObject, 0, 0);
		}
		if (this._onGloablEndFunc) {
			this._onGloablEndFunc.call(this._easeObject, event.stageX, event.stageY);
		}
		this._isDragMoved = false;

		console.log(event.type)

		// this._touchObject.on(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
	}

	private startEase(x, y) {
		// Laya.timer.frameLoop(1, this, this.onEase);
	}

	private onEase(): boolean {
		this._speedX = this._speedX * this._easeNum;
		this._speedY = this._speedY * this._easeNum;
		if (Math.abs(this._speedX) <= 1 && Math.abs(this._speedY) <= 1) {
			this._speedX = 0;
			this._speedY = 0;
			this.stopEase();
			if (this._onEaseEndFunc) {
				this._onEaseEndFunc.call(this._easeObject, 0, 0)
			}
		}
		var func: Function;
		this._onPosChangeFunc.call(this._easeObject, this._speedX, this._speedY);
		return false;
	}

	private stopEase() {
		// Laya.timer.clear(this, this.onEase);

	}


	dispose(): void {
		// this._touchObject.off(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
		// this._touchObject.off(Laya.Event.MOUSE_MOVE, this, this.touchMoveHandler);
		// this._touchObject.off(Laya.Event.MOUSE_UP, this, this.touchEndHandler);
		// this._touchObject.off(Laya.Event.MOUSE_OUT, this, this.touchEndHandler);
		// this._touchObject.removeEventListener(Laya.Event.TOUCH_TAP, this.onTouchTap, this);
	}
}