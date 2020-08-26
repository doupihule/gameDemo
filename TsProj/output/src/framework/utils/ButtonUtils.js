"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonUtils = void 0;
const LogsManager_1 = require("../manager/LogsManager");
const SoundManager_1 = require("../manager/SoundManager");
const ButtonConst_1 = require("../consts/ButtonConst");
const TimerManager_1 = require("../manager/TimerManager");
const ResourceConst_1 = require("../../game/sys/consts/ResourceConst");
const Message_1 = require("../common/Message");
const FrameWorkEvent_1 = require("../event/FrameWorkEvent");
class ButtonUtils {
    /**
     * 构造按钮
     * @param button 按钮对象
     * @param callBack 回调
     * @param thisObj this
     * @param defUrl 平时皮肤
     * @param tapUrl 点击时皮肤
     * @param args 数组形式
     */
    constructor(button, callBack, thisObj, defUrl, tapUrl, args) {
        this._button = null;
        /**当前真正的点击触发器 默认是_button  为了兼容点击别的东西能让整个组出现点击效果..  （只需在初始化ButtonUtils后调用  setRealButton(***)即可.. @sanmen 2019.7.30）*/
        this._realButton = null;
        this._callBack = null;
        this._thisObj = null;
        this._isEnable = true;
        this._defUrl = "";
        this._tapUrl = "";
        this._endCallBack = null;
        this._startCallBack = null;
        this._dragCallBack = null;
        /**
         * 按钮样式 默认为1 （即点击缩放为0.9 松开变为1）   ，样式2：（点击在当前基础上缩放0.9 松开还原）
         */
        this._type = ButtonConst_1.default.BUTTON_TYPE_5;
        // 
        // 如
        /**
         * 样式额外参数：部分样式可以传额外样式参数
         * @example {diffY:10}
         */
        this._typeParams = {};
        this.shieldTime = 0; //按钮屏蔽点击的时间
        this.isCanClick = true; //当前是否可点击
        this.timeCode = 0;
        this._time = 0;
        this._longPress = false;
        this._button = button;
        this._realButton = this._button;
        this._defUrl = defUrl;
        this._tapUrl = tapUrl;
        this.oldScaleX = this._button.scaleX;
        this.oldScaleY = this._button.scaleY;
        this.setCallBackInfo(callBack, thisObj, args);
        //如果按钮已经注册过按钮事件了 这里需要移除
        if (button.__lastButtonUtils) {
            LogsManager_1.default.echo("这个按钮重复注册事件,先销毁上一次注册的事件");
            button.__lastButtonUtils.destoryButtonUtil();
        }
        button.__lastButtonUtils = this;
        this.registBtnListener();
    }
    setCallBackInfo(callBack, thisObj, args) {
        this._callBack = callBack;
        this._thisObj = thisObj;
        this._callBackParam = args;
    }
    touchHandler(e) {
        if (!this._isEnable)
            return;
        switch (e.type) {
            case Laya.Event.MOUSE_DOWN:
                if (this._isTouch)
                    return;
                if (!this.isCanClick)
                    return;
                this._isTouch = true;
                switch (this._type) {
                    case ButtonConst_1.default.BUTTON_TYPE_1:
                        this._button.scaleX = 0.9;
                        this._button.scaleY = 0.9;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_2:
                        this._button.scaleX *= 0.9;
                        this._button.scaleY *= 0.9;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_3:
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_4:
                        // 停止button动画
                        this._buttonTween && this._buttonTween.pause && this._buttonTween.pause();
                        this._button.scaleX *= 0.9;
                        this._button.scaleY *= 0.9;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_5:
                        this._button.scaleX = 1.1;
                        this._button.scaleY = 1.1;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_6:
                        // 停止button动画
                        this._buttonTween && this._buttonTween.pause && this._buttonTween.pause();
                        this._button.scaleX *= 0.8;
                        this._button.scaleY *= 0.8;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_7:
                        // 立体Y唯一式缓动按钮
                        // 如果有tween动画需要移除，并不重新记录按下Y值
                        if (this._buttonTween) {
                            Laya.Tween.clear(this._buttonTween);
                            this._buttonTween = null;
                        }
                        else {
                            this._button._downY = this._button.y;
                        }
                        var clickTargetY = this._button._downY + this._typeParams['diffY'];
                        var downDuration = this._typeParams['downDuration'] ? this._typeParams['downDuration'] : 100;
                        this._buttonTween = Laya.Tween.to(this._button, { y: clickTargetY }, downDuration, null, Laya.Handler.create(this, () => {
                            this._buttonTween = null;
                        }));
                        break;
                }
                if (this._defUrl && this._defUrl != "") {
                    this._button.skin = this._tapUrl;
                }
                if (this._startCallBack) {
                    this.callStartCallBack(e);
                }
                if (this._longPress)
                    this.setLongPress();
                break;
            case Laya.Event.MOUSE_UP:
                if (!this._isTouch)
                    return;
                Message_1.default.instance.send(FrameWorkEvent_1.default.FRAMEWORKEVENT_BUTTONCLICK);
                this.delayEnableBtn();
                this.playClickSound();
                switch (this._type) {
                    case ButtonConst_1.default.BUTTON_TYPE_1:
                        this._button.scaleX = 1;
                        this._button.scaleY = 1;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_2:
                        this._button.scaleX /= 0.9;
                        this._button.scaleY /= 0.9;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_3:
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_4:
                        // 停止button动画
                        this._buttonTween && this._buttonTween.resume && this._buttonTween.resume();
                        this._button.scaleX /= 0.9;
                        this._button.scaleY /= 0.9;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_5:
                        this._button.scaleX = 1;
                        this._button.scaleY = 1;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_6:
                        // 停止button动画
                        this._buttonTween && this._buttonTween.resume && this._buttonTween.resume();
                        this._button.scaleX /= 0.8;
                        this._button.scaleY /= 0.8;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_7:
                        // 立体Y唯一式缓动按钮
                        // 松手回到原点
                        this._buttonTween && Laya.Tween.clear(this._buttonTween);
                        var upDuration = this._typeParams['upDuration'] ? this._typeParams['upDuration'] : 300;
                        this._buttonTween = Laya.Tween.to(this._button, { y: this._button._downY }, upDuration, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                            this._buttonTween = null;
                        }));
                        break;
                }
                if (this._defUrl && this._defUrl != "") {
                    this._button.skin = this._defUrl;
                }
                if (this._isTouch && this._callBack != null) {
                    this._callBack.call(this._thisObj, this._callBackParam);
                }
                this._isTouch = false;
                if (this._endCallBack) {
                    this._endCallBack.call(this._thisObj);
                }
                if (this._longPress)
                    this.closeLongPress();
                break;
            case Laya.Event.MOUSE_OUT:
                if (!this._isTouch)
                    return;
                Message_1.default.instance.send(FrameWorkEvent_1.default.FRAMEWORKEVENT_BUTTONCLICK);
                this.delayEnableBtn();
                this._isTouch = false;
                switch (this._type) {
                    case ButtonConst_1.default.BUTTON_TYPE_1:
                        this._button.scaleX = 1;
                        this._button.scaleY = 1;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_2:
                        this._button.scaleX /= 0.9;
                        this._button.scaleY /= 0.9;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_3:
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_4:
                        // 开始button动画
                        this._buttonTween && this._buttonTween.resume && this._buttonTween.resume();
                        this._button.scaleX /= 0.9;
                        this._button.scaleY /= 0.9;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_5:
                        this._button.scaleX = 1;
                        this._button.scaleY = 1;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_6:
                        // 开始button动画
                        this._buttonTween && this._buttonTween.resume && this._buttonTween.resume();
                        this._button.scaleX /= 0.8;
                        this._button.scaleY /= 0.8;
                        break;
                    case ButtonConst_1.default.BUTTON_TYPE_7:
                        // 立体Y唯一式缓动按钮
                        // 松手回到原点
                        this._buttonTween && Laya.Tween.clear(this._buttonTween);
                        var upDuration = this._typeParams['upDuration'] ? this._typeParams['upDuration'] : 300;
                        this._buttonTween = Laya.Tween.to(this._button, { y: this._button._downY }, upDuration, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                            this._buttonTween = null;
                        }));
                        // 按下式按钮移动到外面。也判定点击
                        if (this._callBack != null) {
                            this._callBack.call(this._thisObj, this._callBackParam);
                        }
                        break;
                }
                if (this._defUrl && this._defUrl != "") {
                    this._button.skin = this._defUrl;
                }
                if (this._dragCallBack) {
                    this.callDragCallBack(e);
                }
                if (this._endCallBack) {
                    this._endCallBack.call(this._thisObj);
                }
                if (this._longPress)
                    this.closeLongPress();
                break;
        }
    }
    playClickSound() {
        if (this._clickSound) {
            SoundManager_1.default.playSE(this._clickSound);
        }
        else {
            if (ResourceConst_1.default["BASE_SOUND_CLICK"]) {
                SoundManager_1.default.playSE(ResourceConst_1.default["BASE_SOUND_CLICK"]);
            }
        }
    }
    setTouchEnd(func) {
        this._endCallBack = func;
    }
    //设置按下回调
    setTouchStart(func) {
        this._startCallBack = func;
    }
    //执行按下回调
    callStartCallBack(e) {
        if (this._isTouch) {
            this._startCallBack.call(this._thisObj, e);
        }
    }
    //设置拖出操作回调
    setDrag(func) {
        this._dragCallBack = func;
    }
    //执行拖出操作回调
    callDragCallBack(e) {
        this._dragCallBack.call(this._thisObj, e);
    }
    /**
     * 设置按钮类型
     * @param type 按钮类型
     * @param typeParams 对应类型参数
     */
    setBtnType(type, typeParams = {}) {
        // 改按钮类型时先删除所有监听重新添加
        this.removeBtnListener();
        this._type = type;
        this._typeParams = typeParams;
        this.registBtnListener();
        return this;
    }
    //设置点击音效  不传值为无音效 
    setBtnClickSound(sound = '') {
        this._clickSound = sound;
        return this;
    }
    removeBtnListener() {
        this._realButton.offAll(Laya.Event.MOUSE_DOWN);
        this._realButton.offAll(Laya.Event.MOUSE_OUT);
        this._realButton.offAll(Laya.Event.MOUSE_UP);
        this._realButton.offAll(Laya.Event.DISPLAY);
        this._realButton.offAll(Laya.Event.UNDISPLAY);
        this.removeStageCallback();
    }
    //注册按钮点击事件
    registBtnListener() {
        this._realButton.on(Laya.Event.MOUSE_DOWN, this, this.touchHandler);
        this._realButton.on(Laya.Event.MOUSE_UP, this, this.touchHandler);
        this._realButton.on(Laya.Event.MOUSE_OUT, this, this.touchHandler);
        // 如果按钮为晃动样式
        if (this._type == ButtonConst_1.default.BUTTON_TYPE_4 || this._type == ButtonConst_1.default.BUTTON_TYPE_6) {
            if (this._realButton.displayedInStage) {
                this.addStageCallback();
            }
            this._realButton.on(Laya.Event.DISPLAY, this, this.addStageCallback);
            this._realButton.on(Laya.Event.UNDISPLAY, this, this.removeStageCallback);
        }
    }
    /**
     * 添加到场景回调
     */
    addStageCallback() {
        if (this._type == ButtonConst_1.default.BUTTON_TYPE_4) {
            if (!this._buttonTween) {
                this.addButtonTween();
            }
        }
        if (this._type == ButtonConst_1.default.BUTTON_TYPE_6) {
            if (!this._buttonTween) {
                this.addButtonTween1();
            }
        }
    }
    //呼吸放大1.3倍动画
    addButtonTween1() {
        if (!this._button) {
            console.log();
        }
        this._buttonTween = Laya.Tween.to(this._button, { scaleX: 1.3 * this.oldScaleX, scaleY: 1.3 * this.oldScaleY }, 750, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
            this._buttonTween = Laya.Tween.to(this._button, { scaleX: this.oldScaleX, scaleY: this.oldScaleY }, 750, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                this._buttonTween = null;
                this.addButtonTween1();
            }));
        }));
    }
    addButtonTween() {
        if (!this._button) {
            console.log();
        }
        this._buttonTween = Laya.Tween.to(this._button, { scaleX: 1.1 * this.oldScaleX, scaleY: 1.1 * this.oldScaleY }, 750, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
            this._buttonTween = Laya.Tween.to(this._button, { scaleX: this.oldScaleX, scaleY: this.oldScaleY }, 750, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                this._buttonTween = null;
                this.addButtonTween();
            }));
        }));
    }
    /**
     * 移除场景回调
     */
    removeStageCallback() {
        if (this._type == ButtonConst_1.default.BUTTON_TYPE_4) {
            Laya.Tween.clearAll(this._button);
            this._buttonTween = null;
        }
    }
    //设置点击触发器
    setRealButton(btn) {
        this.removeBtnListener();
        this._realButton = btn;
        this.registBtnListener();
        return this;
    }
    /*
    * 是否可以长按
    * @param val
    */
    set longPress(val) {
        this._longPress = val;
    }
    setLongPress() {
        Laya.timer.once(1000, this, this.onHold);
    }
    onHold() {
        if (this._isTouch && this._callBack != null) {
            this._callBack.call(this._thisObj, this._button, this._callBackParam);
        }
    }
    closeLongPress() {
        Laya.timer.clear(this, this.onHold);
    }
    set enabled(val) {
        this._isEnable = val;
    }
    //销毁按钮
    destoryButtonUtil() {
        this.removeBtnListener();
        this._callBackParam = null;
        this._callBack = null;
        this._thisObj = null;
        this._button.__lastButtonUtils = null;
        this._button = null;
        this._realButton = null;
    }
    //设置按钮屏蔽点击的时间
    setUnEnableTime(shieldTime = 0) {
        this.shieldTime = shieldTime;
        return this;
    }
    delayEnableBtn() {
        if (this.shieldTime != 0) {
            TimerManager_1.default.instance.clearTimeout(this.timeCode);
            this.isCanClick = false;
            TimerManager_1.default.instance.setTimeout(() => {
                this.isCanClick = true;
            }, this, this.shieldTime);
        }
    }
}
exports.ButtonUtils = ButtonUtils;
//# sourceMappingURL=ButtonUtils.js.map