import IMessage from "../../../game/sys/interfaces/IMessage";
import Message from "../../common/Message";

import WindowEvent from "../../event/WindowEvent";
import WindowManager from "../../manager/WindowManager";
import GameTools from "../../../utils/GameTools";

/**
 * 置顶View自动显示组件基类
 *
 * 作用：继承该类。能够方便的实现。顶层View自动显示、隐藏的组件。
 * 使用方法：
 *     1. 实现 _compShow _compHide方法。显示、隐藏组件
 *     3. 组件初始化完成 调用_changeStatus 方法自动判断显示
 */
export class TopViewAutoComp implements IMessage {

	/** 组件显示状态：显示 */
	static STATUS_SHOW = 1;
	/** 组件显示状态：隐藏 */
	static STATUS_HIDE = 0;

	/** 组件隐藏状态: 销毁 */
	static HIDE_TYPE_DESTROY = 1;
	/** 组件隐藏状态：隐藏 */
	static HIDE_TYPE_HIDE = 0;

	/** 推荐组件状态:  */
	protected _status: number = TopViewAutoComp.STATUS_HIDE;

	/** 交叉组件显示所在页面 */
	protected _parentName;

	/** 隐藏状态 */
	protected _hideType = TopViewAutoComp.HIDE_TYPE_DESTROY;

	constructor() {
		// 添加View更新消息回调
		Message.instance.add(WindowEvent.WINDOW_EVENT_SWITCHUIFIN, this);
	}

	/**
	 * 显示交叉组件
	 */
	public show(force = false) {
		if (!force && this._status == TopViewAutoComp.STATUS_SHOW) {
			// 相同状态无需重复处理
			return;
		}
		this._status = TopViewAutoComp.STATUS_SHOW;
		this._changeStatus();
	}

	/**
	 * 显示隐藏组件
	 */
	public hide(force = false) {
		if (!force && this._status == TopViewAutoComp.STATUS_HIDE) {
			// 相同状态无需重复处理
			return;
		}
		this._status = TopViewAutoComp.STATUS_HIDE;
		this._changeStatus();
	}

	/**
	 * 组件销毁
	 */
	public destroy() {
		Message.instance.removeObjEvents(this);
		this._status = TopViewAutoComp.STATUS_HIDE;
		this._parentName = null;
	}

	/**
	 * 更改组件显示状态
	 */
	protected _changeStatus() {
		if (this._status == TopViewAutoComp.STATUS_SHOW) {
			this._compShow();
		} else if (this._status == TopViewAutoComp.STATUS_HIDE) {
			this._compHide();
		}
	}

	/** 子类重写组件显示方法 */
	protected _compShow() {
	}

	/** 子类重写组件隐藏方法 */
	protected _compHide() {
	}

	/**
	 * 检查UI是否在顶层
	 */
	protected _checkUIState(force = false) {
		if (this._parentName) {
			LogsManager.echo("hlx TopViewAutoComp _parentName:", GameTools.decryptStr(this._parentName), " CurrentWindowName:", GameTools.decryptStr(WindowManager.getCurrentWindowName()));
			if (this._parentName == WindowManager.getCurrentWindowName()) {
				this.show(force);
			} else {
				if (this._hideType == TopViewAutoComp.HIDE_TYPE_HIDE) {
					this.hide(force);
				} else if (this._hideType == TopViewAutoComp.HIDE_TYPE_DESTROY) {
					this.destroy();
				}
			}
		} else {
			LogsManager.echo("hlx TopViewAutoComp 组件未绑定任何页面，无需设置显示状态。此日志不是异常。");
		}
	}

	/**
	 * 实现接受事件机制
	 */
	recvMsg(cmd: string, data: any) {
		if (cmd == WindowEvent.WINDOW_EVENT_SWITCHUIFIN) {
			this._checkUIState(false);
		}
	}

}