import TimerManager from "../../../framework/manager/TimerManager";
import StringUtils from "../../../framework/utils/StringUtils";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import PoolCode from "../consts/PoolCode";
import PoolTools from "../../../framework/utils/PoolTools";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import DataResourceFunc from "../func/DataResourceFunc";
import BattleFunc from "../func/BattleFunc";
import { create } from "domain";

/**Tween动画 */
export default class TweenAniManager {
    private static _instance: TweenAniManager;

    constructor() {

    }
    static get instance(): TweenAniManager {
        if (!this._instance) {
            this._instance = new TweenAniManager();
        }
        return this._instance;
    }
    /**渐现动画 */
    fadeInAni(thisObj, callback = null, duration = 500, obj = null, firtAlpha = 0, lastAlpha = 1) {
        thisObj.alpha = firtAlpha;
        Laya.Tween.to(thisObj, { alpha: lastAlpha }, duration, null, Laya.Handler.create(obj, () => {
            callback && callback.call(obj);
        }));
    }
    /**渐隐动画 */
    fadeOutAni(thisObj, callback = null, duration = 500, obj = null, firstAlpha = 1, lastAlpha = 0) {
        thisObj.alpha = firstAlpha;
        Laya.Tween.to(thisObj, { alpha: lastAlpha }, duration, null, Laya.Handler.create(obj, () => {
            callback && callback.call(obj);
        }));
    }
    /**水平运动 */
    horizontalAni(thisObj, posX, callback = null, obj = null, duration = 200, ease = null) {
        Laya.Tween.to(thisObj, { x: posX }, duration, ease, Laya.Handler.create(obj, () => {
            callback && callback.call(obj);
        }));
    }
    /**垂直运动 */
    verticalAni(thisObj, posY, callback = null, duration = 1000, ease = null) {
        Laya.Tween.to(thisObj, { y: posY }, duration, ease);
    }
    /**调整centerX移动 */
    horizontalCenterAni(thisObj, posX, callback = null, obj = null, duration = 200) {
        Laya.Tween.to(thisObj, { centerX: posX }, duration, null, Laya.Handler.create(obj, () => {
            callback && callback.call(obj);
        }));
    }
    /**调整right移动 */
    horizontalRightAni(thisObj, posX, callback = null, obj = null, duration = 200) {
        Laya.Tween.to(thisObj, { right: posX }, duration, null, Laya.Handler.create(obj, () => {
            callback && callback.call(obj);
        }));
    }
    /**二级界面缩放动画 */
    scaleAni(thisObj, callback = null, obj = null, duration = 100) {
        thisObj.scale(0.76, 0.76)
        var item = thisObj.getChildAt(0);
        this.fadeInAni(item, null, 200);
        Laya.Tween.to(thisObj, { scaleX: 1, scaleY: 1 }, duration, null, Laya.Handler.create(
            obj, () => {
                Laya.Tween.to(thisObj, { scaleX: 0.98, scaleY: 0.98 }, 100, null, Laya.Handler.create(obj, () => {
                    callback && callback.call(obj);
                }))
            }
        ));
    }
    /**顶部动画 */
    topAni(thisObj, top, duration = 200) {
        Laya.Tween.to(thisObj, { top: top }, duration);

    }
    /**模型动画 */
    playRoleAni(firstX, role: Laya.Sprite3D, lastX, towardRight = true, y = 0.1) {
        var offest = firstX;
        role.transform.position = new Laya.Vector3(offest, y, 1.3);
        var ani = () => {
            if (towardRight) {
                //向右移动
                if (role.transform.position.x < lastX) {
                    offest += 0.1;
                    role.transform.position = new Laya.Vector3(offest, y, 1.3);
                } else {
                    Laya.timer.clear(this, ani);
                }
            } else {
                //向左移动
                if (role.transform.position.x > lastX) {
                    offest -= 0.1;
                    role.transform.position = new Laya.Vector3(offest, y, 1.3);
                } else {
                    Laya.timer.clear(this, ani);
                }
            }

        }
        Laya.timer.frameLoop(1, this, ani);

    }

    horizontalScaleAni(thisObj, width, obj = null, duration = 300) {
        thisObj.width = 110;
        Laya.Tween.to(thisObj, { width: width }, duration, null, null);
    }
    verticalScaleAni(thisObj, height, obj = null, duration = 300) {
        thisObj.height = 48;
        Laya.Tween.to(thisObj, { height: height }, duration, null, null);
    }
    scaleOnlyAni(thisObj, scaleX, scaleY, duration = 300, callback = null, obj = null) {
        Laya.Tween.to(thisObj, { scaleX: scaleX, scaleY: scaleY }, duration, null, Laya.Handler.create(obj, () => {
            callback && callback.call(obj);
        }));
    }

    //战斗 暴击动画
    battleTweenBaojiAni(view, duration = 200) {
        view.scaleX = 0.5
        view.scaleY = 0.5
        //先清除这个tween
        Laya.Tween.clearTween(view);
        Laya.Tween.to(view, { scaleX: 1, scaleY: 1 }, duration, Laya.Ease.bounceInOut);
    }

    //战斗ui死亡飘字动画
    battleTweenDiedAni(view: Laya.Sprite) {
        view.scaleX = 0.5
        view.scaleY = 0.5
        view.alpha = 1;
        //先清除这个tween
        Laya.Tween.clearTween(view);
        Laya.Tween.to(view, { scaleX: 2, scaleY: 2 }, 200, Laya.Ease.bounceInOut);
        Laya.Tween.to(view, { alpha: 0.5, }, 200, Laya.Ease.bounceInOut, null, 300);
    }

    /**升级界面横幅缩放动画 */
    scaleLevelUpAni(thisObj, callback = null, obj = null, duration = 100) {
        thisObj.scale(1.1, 1.1);
        var item = thisObj.getChildAt(0);
        this.fadeInAni(item, null, 100);
        Laya.Tween.to(thisObj, { scaleX: 1, scaleY: 1 }, duration, null, Laya.Handler.create(
            obj, () => {
                // Laya.Tween.to(thisObj, { scaleX: 0.98, scaleY: 0.98 }, 100, null, Laya.Handler.create(obj, () => {
                //     callback && callback.call(obj);
                // }))
            }
        ));
    }

    /**
      * 数字滚动动画
      * @param oldNum 原始数字
      * @param newNum 目标数字
      * @param lable 要改的文本lable
      * @param group 需要修改的lable组(兼容当lable缩放时，laya显示异常问题，故对group缩放)
      * @param isBigInt 是否需要大整数转换
      * @param duration 滚动持续时间
      * @param times 滚动次数
      */
    public changeNumTween(oldNum, newNum, lable: any, group: any, isBigInt = false, thisObj: any = null, callBack: Function = null, duration = 1000, times = 10) {
        if (oldNum == newNum) {
            return
        }
        var delay = Math.round(duration / times);
        // 如果已经存在缓动动画，停止缓动。播放新动画
        if (lable.__currentNum) {
            TimerManager.instance.removeByCallBack(lable, this.numberChangeCallBack)
            lable.__currentNum = null
        }

        TimerManager.instance.add(this.numberChangeCallBack, lable, delay, Number.MAX_VALUE, true, [oldNum, newNum, lable, group, isBigInt, thisObj, callBack, delay, times]);
    }

    /**
     * 数值变化回调函数
     */
    public numberChangeCallBack(oldNum, newNum, lable: any, group: any, isBigInt: boolean, thisObj: any = null, callBack: Function = null, delay: number, times: number, bigIntChange: boolean = false) {
        // 记录当前滚动到的数值
        if (!lable.__currentNum) {
            lable.__currentNum = oldNum;
        }
        // 支持变大变小
        if (BigNumUtils.compare(newNum, oldNum)) {
            var deltaNum = BigNumUtils.round(BigNumUtils.sum(BigNumUtils.round((Math.random() * 10)), BigNumUtils.devide(BigNumUtils.substract(newNum, oldNum), times)));
        } else {
            var deltaNum = BigNumUtils.round(BigNumUtils.sum(-BigNumUtils.round((Math.random() * 10)), BigNumUtils.devide(BigNumUtils.substract(newNum, oldNum), times)));
        }

        lable.__currentNum = BigNumUtils.sum(lable.__currentNum, deltaNum);
        if ((deltaNum > "0" && BigNumUtils.compare(lable.__currentNum, newNum)) || (deltaNum < "0" && !BigNumUtils.compare(lable.__currentNum, newNum))) {
            // 到达目标变化值，移除回调
            lable.changeText(isBigInt ? StringUtils.getCoinStr(newNum) : String(newNum))
            lable.__currentNum = null
            TimerManager.instance.removeByCallBack(lable, TweenAniManager.instance.numberChangeCallBack);
            if (callBack) {
                callBack.apply(thisObj);
            }
        }
        else {
            Laya.Tween.to(group, { scaleX: 1.1, scaleY: 1.1 }, delay / 3, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                Laya.Tween.to(group, { scaleX: 1, scaleY: 1 }, delay / 3, Laya.Ease.sineOut);
            }));
            lable.changeText(isBigInt ? StringUtils.getCoinStr(BigNumUtils.round(lable.__currentNum)) : String(BigNumUtils.round(lable.__currentNum)))
        }
    }
    //气泡呼吸动画
    scaleQipaoAni(view, scale = 1.5, callback = null, obj = null, isLoop = true, time = 800) {
        Laya.Tween.clearAll(view);
        Laya.Tween.to(view, { scaleX: scale, scaleY: scale }, time, Laya.Ease.circOut, Laya.Handler.create(this, () => {
            Laya.Tween.to(view, { scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, () => {
                if (isLoop) {
                    this.scaleQipaoAni(view, scale, callback, obj, isLoop);
                }
            }))
        }));
    }
    resourceFlyAni(reward, x, y, parentUI, img, txt: Laya.Label) {
        if (typeof (reward) == "string") {
            reward = reward.split(",");
        }
        var cacheId = PoolCode.POOL_FLYSOURCE + reward[0];
        var cacheItem = PoolTools.getItem(cacheId);
        if (!cacheItem) {
            cacheItem = new Laya.Image(DataResourceFunc.instance.getIconById(reward[0]));
        }
        parentUI.addChild(cacheItem);
        cacheItem.x = x;
        cacheItem.y = y;
        var tempPos = BattleFunc.tempClickPoint;
        tempPos.x = img.x;
        tempPos.y = img.y;
        img.localToGlobal(tempPos, false, parentUI)
        var time = Math.abs(y - tempPos.y)
        Laya.Tween.to(cacheItem, { x: tempPos.x, y: tempPos.y }, time, null, Laya.Handler.create(this, () => {
            cacheItem.removeSelf();
            PoolTools.cacheItem(cacheId, cacheItem);
        }))
        Laya.Tween.clearTween(img);
        img.alpha = 1;
        Laya.Tween.to(img, { alpha: 0 }, time / 2, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(img, { alpha: 1 }, time / 2)
        }));
        txt.color = "#000000";
        txt.scale(1, 1)
        Laya.Tween.clearTween(txt);
        Laya.Tween.to(txt, { scaleX: 1.2, scaleY: 1.2 }, time / 2, null, Laya.Handler.create(this, () => {
            txt.color = "#02a43c";
            Laya.Tween.to(txt, { scaleX: 1, scaleY: 1 }, time / 2, null, Laya.Handler.create(this, () => {
                txt.color = "#000000";
            }))
        }));
    }
    shakingAni(img) {
        //向左
        Laya.Tween.to(img, { rotation: -34 }, 200, null, Laya.Handler.create(this, () => {
            //向右
            Laya.Tween.to(img, { rotation: 34 }, 400, null, Laya.Handler.create(this, () => {
                //恢复
                Laya.Tween.to(img, { rotation: -34 }, 400, null, Laya.Handler.create(this, () => {
                    //向右
                    Laya.Tween.to(img, { rotation: 34 }, 400, null, Laya.Handler.create(this, () => {
                        //恢复
                        Laya.Tween.to(img, { rotation: 0 }, 200, null, Laya.Handler.create(this, () => {
                            this.shakingAni(img)
                        }))
                    }))
                }))
            }))
        }))
    }
    addHandTween(img) {
        var baseY = img.y
        Laya.Tween.to(img, { y: baseY + 10 }, 200, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(img, { y: baseY - 10 }, 200, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(img, { y: baseY }, 200, null, Laya.Handler.create(this, () => {
                    this.addHandTween(img);
                }))
            }))
        }))
    }
}
