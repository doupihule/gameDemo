"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopViewAutoComp = void 0;
const Message_1 = require("../../common/Message");
const LogsManager_1 = require("../../manager/LogsManager");
const WindowEvent_1 = require("../../event/WindowEvent");
const WindowManager_1 = require("../../manager/WindowManager");
const GameUtils_1 = require("../../../utils/GameUtils");
/**
 * 置顶View自动显示组件基类
 *
 * 作用：继承该类。能够方便的实现。顶层View自动显示、隐藏的组件。
 * 使用方法：
 *     1. 实现 _compShow _compHide方法。显示、隐藏组件
 *     3. 组件初始化完成 调用_changeStatus 方法自动判断显示
 */
class TopViewAutoComp {
    constructor() {
        /** 推荐组件状态:  */
        this._status = TopViewAutoComp.STATUS_HIDE;
        /** 隐藏状态 */
        this._hideType = TopViewAutoComp.HIDE_TYPE_DESTROY;
        // 添加View更新消息回调
        Message_1.default.instance.add(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, this);
    }
    /**
     * 显示交叉组件
     */
    show(force = false) {
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
    hide(force = false) {
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
    destroy() {
        Message_1.default.instance.removeObjEvents(this);
        this._status = TopViewAutoComp.STATUS_HIDE;
        this._parentName = null;
    }
    /**
     * 更改组件显示状态
     */
    _changeStatus() {
        if (this._status == TopViewAutoComp.STATUS_SHOW) {
            this._compShow();
        }
        else if (this._status == TopViewAutoComp.STATUS_HIDE) {
            this._compHide();
        }
    }
    /** 子类重写组件显示方法 */
    _compShow() { }
    /** 子类重写组件隐藏方法 */
    _compHide() { }
    /**
     * 检查UI是否在顶层
     */
    _checkUIState(force = false) {
        if (this._parentName) {
            LogsManager_1.default.echo("hlx TopViewAutoComp _parentName:", GameUtils_1.default.decryptStr(this._parentName), " CurrentWindowName:", GameUtils_1.default.decryptStr(WindowManager_1.default.getCurrentWindowName()));
            if (this._parentName == WindowManager_1.default.getCurrentWindowName()) {
                this.show(force);
            }
            else {
                if (this._hideType == TopViewAutoComp.HIDE_TYPE_HIDE) {
                    this.hide(force);
                }
                else if (this._hideType == TopViewAutoComp.HIDE_TYPE_DESTROY) {
                    this.destroy();
                }
            }
        }
        else {
            LogsManager_1.default.echo("hlx TopViewAutoComp 组件未绑定任何页面，无需设置显示状态。此日志不是异常。");
        }
    }
    /**
     * 实现接受事件机制
     */
    recvMsg(cmd, data) {
        if (cmd == WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN) {
            this._checkUIState(false);
        }
    }
}
exports.TopViewAutoComp = TopViewAutoComp;
/** 组件显示状态：显示 */
TopViewAutoComp.STATUS_SHOW = 1;
/** 组件显示状态：隐藏 */
TopViewAutoComp.STATUS_HIDE = 0;
/** 组件隐藏状态: 销毁 */
TopViewAutoComp.HIDE_TYPE_DESTROY = 1;
/** 组件隐藏状态：隐藏 */
TopViewAutoComp.HIDE_TYPE_HIDE = 0;
//# sourceMappingURL=TopViewAutoComp.js.map