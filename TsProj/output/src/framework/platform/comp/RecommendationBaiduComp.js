"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationBaiduComp = void 0;
const LogsManager_1 = require("../../manager/LogsManager");
const TopViewAutoComp_1 = require("./TopViewAutoComp");
const UserInfo_1 = require("../../common/UserInfo");
const Message_1 = require("../../common/Message");
const WindowEvent_1 = require("../../event/WindowEvent");
const GameSwitch_1 = require("../../common/GameSwitch");
/**
 * 百度交叉推荐组件
 *
 * 交叉组件使用方式：
 * 列表聚合按钮：RecommendationBaiduComp.createRecommendationList(this, left, top);
 * 轮播按钮：RecommendationBaiduComp.createRecommendationCarousel(this, left, top);
 *
 * 组件自动在页面非顶层时隐藏。页面置顶显示
 *
 * parent 如果是缓存页面 无需 destory
 * parent 不缓存 可以手动调用 destory销毁组件
 */
class RecommendationBaiduComp extends TopViewAutoComp_1.TopViewAutoComp {
    /**
     * 初始化组件
     */
    constructor(parent, type, left, top, onloadCallback = null) {
        super();
        /** 失败重新创建组件次数 */
        this._retryTimes = 0;
        /** 加载是否完成 */
        this._loadFinish = false;
        this._hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_HIDE;
        if (!RecommendationBaiduComp.canUseRecommendBaidu()) {
            return;
        }
        var thisObj = this;
        // 默认未加载成功隐藏
        this._status = TopViewAutoComp_1.TopViewAutoComp.STATUS_HIDE;
        // 百度推荐组件复用不销毁
        this._hideType = TopViewAutoComp_1.TopViewAutoComp.HIDE_TYPE_HIDE;
        this._parentName = parent.windowName;
        this._recommendationButton = UserInfo_1.default.platform.getWX().createRecommendationButton({
            type: type,
            style: {
                left: left,
                top: top
            }
        });
        this._recommendationButton.onError((e) => {
            if (thisObj._retryTimes <= 1) {
                // 失败自动重新加载一次
                thisObj._retryTimes++;
                thisObj._recommendationButton.load();
            }
            LogsManager_1.default.warn("Recommendation error:", JSON.stringify(e));
        });
        // 监听按钮资源加载完成
        this._recommendationButton.onLoad(() => {
            // 显示按钮
            thisObj._loadFinish = true;
            // 加载成功重置重试次数
            thisObj._retryTimes = 0;
            thisObj._checkUIState(true);
            onloadCallback && onloadCallback.call(thisObj);
        });
        // 添加View更新消息回调
        Message_1.default.instance.add(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, this);
        // 触发资源加载
        this._recommendationButton.load();
    }
    /**
     * 创建聚合交叉推广组件
     */
    static createRecommendationList(parent, left, top, onloadCallback = null) {
        return new RecommendationBaiduComp(parent, RecommendationBaiduComp.TYPE_LIST, left, top, onloadCallback);
    }
    /**

     * 创建列表交叉推广组件
     */
    static createRecommendationCarousel(parent, left, top, onloadCallback = null) {
        return new RecommendationBaiduComp(parent, RecommendationBaiduComp.TYPE_CAROUSEL, left, top, onloadCallback);
    }
    static canUseRecommendBaidu() {
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISIBLE_RECOMMEND_BAIDU)) {
            LogsManager_1.default.echo('hlx Recommendation 禁用：推荐开关关闭');
            return false;
        }
        if (!UserInfo_1.default.platform.getWX().createRecommendationButton) {
            LogsManager_1.default.echo("hlx Recommendation createRecommendationButton not found");
            return false;
        }
        return true;
    }
    /**
     * 组件销毁
     */
    destroy() {
        super.destroy();
        this._loadFinish = false;
        if (this._recommendationButton) {
            this._recommendationButton.destroy();
            this._recommendationButton = null;
        }
    }
    /** 子类重写组件显示方法 */
    _compShow() {
        if (this._loadFinish) {
            this._recommendationButton.show();
        }
    }
    /** 子类重写组件隐藏方法 */
    _compHide() {
        if (this._loadFinish) {
            this._recommendationButton.hide();
        }
    }
}
exports.RecommendationBaiduComp = RecommendationBaiduComp;
/** 推荐列表类型：聚合 */
RecommendationBaiduComp.TYPE_LIST = 'list';
/** 推荐列表类型：轮播 */
RecommendationBaiduComp.TYPE_CAROUSEL = 'carousel';
//# sourceMappingURL=RecommendationBaiduComp.js.map