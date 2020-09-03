
import SoundManager from "../manager/SoundManager";
import ButtonConst from "../consts/ButtonConst";
import TimerManager from "../manager/TimerManager";
import ResourceConst from "../../game/sys/consts/ResourceConst";
import Message from "../common/Message";
import FrameWorkEvent from "../event/FrameWorkEvent";

export class ButtonUtils {
	private _button: any = null;
	private oldScaleX: number;
	private oldScaleY: number;

	/**当前真正的点击触发器 默认是_button  为了兼容点击别的东西能让整个组出现点击效果..  （只需在初始化ButtonUtils后调用  setRealButton(***)即可.. @sanmen 2019.7.30）*/
	private _realButton: any = null;
	private _callBack: any = null;
	private _thisObj: any = null;
	private _isTouch: boolean;
	private _isEnable: boolean = true;
	private _defUrl: string = "";
	private _tapUrl: string = "";
	public _callBackParam: any;
	private _endCallBack = null;
	private _startCallBack = null;
	private _dragCallBack = null;
	/**
	 * 按钮样式 默认为1 （即点击缩放为0.9 松开变为1）   ，样式2：（点击在当前基础上缩放0.9 松开还原）
	 */
	private _type: string = ButtonConst.BUTTON_TYPE_5;
	//
	// 如
	/**
	 * 样式额外参数：部分样式可以传额外样式参数
	 * @example {diffY:10}
	 */
	private _typeParams: Object = {};


	//按钮音效
	private _clickSound: string;
	/** 当前按钮动画 */
	private _buttonTween: any;

	private shieldTime = 0; //按钮屏蔽点击的时间
	private isCanClick = true; //当前是否可点击
	private timeCode = 0;

	/**
	 * 构造按钮
	 * @param button 按钮对象
	 * @param callBack 回调
	 * @param thisObj this
	 * @param defUrl 平时皮肤
	 * @param tapUrl 点击时皮肤
	 * @param args 数组形式
	 */
	constructor(button: any, callBack: any, thisObj: any, defUrl?: string, tapUrl?: string, args?: any) {
		this._button = button;
		this._realButton = this._button;

		this._defUrl = defUrl;
		this._tapUrl = tapUrl;

		this.oldScaleX = this._button.scaleX
		this.oldScaleY = this._button.scaleY


		this.setCallBackInfo(callBack, thisObj, args);

		//如果按钮已经注册过按钮事件了 这里需要移除
		if (button.__lastButtonUtils) {
			LogsManager.echo("这个按钮重复注册事件,先销毁上一次注册的事件")
			button.__lastButtonUtils.destoryButtonUtil();
		}
		button.__lastButtonUtils = this;

		this.registBtnListener();
	}

	public setCallBackInfo(callBack: any, thisObj: any, args: any) {
		this._callBack = callBack;
		this._thisObj = thisObj;
		this._callBackParam = args
	}



	public setTouchEnd(func) {
		this._endCallBack = func;
	}

	//设置按下回调
	public setTouchStart(func) {
		this._startCallBack = func;
	}

	//执行按下回调
	public callStartCallBack(e) {
		if (this._isTouch) {
			this._startCallBack.call(this._thisObj, e);

		}
	}

	//设置拖出操作回调
	public setDrag(func) {
		this._dragCallBack = func;
	}

	//执行拖出操作回调
	public callDragCallBack(e) {
		this._dragCallBack.call(this._thisObj, e);
	}

	/**
	 * 设置按钮类型
	 * @param type 按钮类型
	 * @param typeParams 对应类型参数
	 */
	public setBtnType(type: string, typeParams = {}) {
		// 改按钮类型时先删除所有监听重新添加
		this.removeBtnListener();
		this._type = type;
		this._typeParams = typeParams;
		this.registBtnListener();
		return this;
	}

	//设置点击音效  不传值为无音效
	public setBtnClickSound(sound: string = '') {
		this._clickSound = sound;
		return this;
	}

	public removeBtnListener() {
		this.removeStageCallback();
	}

	//注册按钮点击事件
	public registBtnListener() {

	}

	/**
	 * 添加到场景回调
	 */
	private addStageCallback() {
		if (this._type == ButtonConst.BUTTON_TYPE_4) {
			if (!this._buttonTween) {
				this.addButtonTween()
			}
		}
		if (this._type == ButtonConst.BUTTON_TYPE_6) {
			if (!this._buttonTween) {
				this.addButtonTween1()
			}
		}
	}

	//呼吸放大1.3倍动画
	private addButtonTween1() {
	}

	private addButtonTween() {

	}

	/**
	 * 移除场景回调
	 */
	private removeStageCallback() {
	}


	//设置点击触发器
	public setRealButton(btn: any) {
		this.removeBtnListener();
		this._realButton = btn;
		this.registBtnListener();
		return this;
	}

	/*
	* 是否可以长按
	* @param val
	*/
	set longPress(val: boolean) {
		this._longPress = val;
	}

	private _time: number = 0;
	private _longPress: boolean = false;

	private setLongPress(): void {
	}

	onHold() {
		if (this._isTouch && this._callBack != null) {
			this._callBack.call(this._thisObj, this._button, this._callBackParam);
		}
	}

	private closeLongPress(): void {
	}


	set enabled(val: boolean) {
		this._isEnable = val;
	}


	//销毁按钮
	public destoryButtonUtil() {
		this.removeBtnListener();
		this._callBackParam = null
		this._callBack = null
		this._thisObj = null
		this._button.__lastButtonUtils = null;
		this._button = null;
		this._realButton = null;
	}

	//设置按钮屏蔽点击的时间
	public setUnEnableTime(shieldTime = 0) {
		this.shieldTime = shieldTime;
		return this;
	}

	private delayEnableBtn() {
		if (this.shieldTime != 0) {
			TimerManager.instance.clearTimeout(this.timeCode);
			this.isCanClick = false;
			TimerManager.instance.setTimeout(() => {
				this.isCanClick = true;
			}, this, this.shieldTime);
		}
	}
}
