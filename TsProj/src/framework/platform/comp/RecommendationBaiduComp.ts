import LogsManager from "../../manager/LogsManager";
import {TopViewAutoComp} from "./TopViewAutoComp";
import UserInfo from "../../common/UserInfo";
import Message from "../../common/Message";
import WindowEvent from "../../event/WindowEvent";
import GameSwitch from "../../common/GameSwitch";

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
export class RecommendationBaiduComp extends TopViewAutoComp {

    /** 推荐列表类型：聚合 */
    static TYPE_LIST = 'list';
    /** 推荐列表类型：轮播 */
    static TYPE_CAROUSEL = 'carousel';
    /** 百度推荐组件实例 */
    protected _recommendationButton;
    /** 失败重新创建组件次数 */
    protected _retryTimes = 0;
    /** 加载是否完成 */
    protected _loadFinish = false;

    protected _hideType = TopViewAutoComp.HIDE_TYPE_HIDE;

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

    /**
     * 初始化组件
     */
    constructor(parent, type, left, top, onloadCallback = null) {
        super();
        if(!RecommendationBaiduComp.canUseRecommendBaidu())
            {
                return;
            }

        var thisObj = this;
        // 默认未加载成功隐藏
        this._status = TopViewAutoComp.STATUS_HIDE;
        // 百度推荐组件复用不销毁
        this._hideType = TopViewAutoComp.HIDE_TYPE_HIDE;
        this._parentName = parent.windowName;
        this._recommendationButton = UserInfo.platform.getWX().createRecommendationButton({
            type: type,
            style: {
                left: left,
                top: top
            }
        })
        this._recommendationButton.onError((e) => {
            if (thisObj._retryTimes <= 1) {
                // 失败自动重新加载一次
                thisObj._retryTimes++;
                thisObj._recommendationButton.load()
            }
            LogsManager.warn("Recommendation error:", JSON.stringify(e));
        })
        // 监听按钮资源加载完成
        this._recommendationButton.onLoad(() => {
            // 显示按钮
            thisObj._loadFinish = true;
            // 加载成功重置重试次数
            thisObj._retryTimes = 0;
            thisObj._checkUIState(true);
            onloadCallback && onloadCallback.call(thisObj);
        })

        // 添加View更新消息回调
        Message.instance.add(WindowEvent.WINDOW_EVENT_SWITCHUIFIN, this);

        // 触发资源加载
        this._recommendationButton.load();
    }
    
     public static canUseRecommendBaidu()
        {
            if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISIBLE_RECOMMEND_BAIDU)) {
                LogsManager.echo('hlx Recommendation 禁用：推荐开关关闭');
                return false;
            }

            if (!UserInfo.platform.getWX().createRecommendationButton) {
                LogsManager.echo("hlx Recommendation createRecommendationButton not found");
                return false;
            }

            return true;
        }

    /** 
     * 组件销毁
     */
    public destroy() {
        super.destroy();
        this._loadFinish = false;
        if (this._recommendationButton) {
            this._recommendationButton.destroy();
		this._recommendationButton = null;
        }
    }

    /** 子类重写组件显示方法 */
    protected _compShow() {
        if (this._loadFinish)  {
            this._recommendationButton.show();
        }
    }
    /** 子类重写组件隐藏方法 */
    protected _compHide() {
        if (this._loadFinish)  {
            this._recommendationButton.hide();
        }
    }
}