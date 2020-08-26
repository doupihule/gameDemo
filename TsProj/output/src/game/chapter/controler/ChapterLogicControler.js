"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PoolTools_1 = require("../../../framework/utils/PoolTools");
const ChapterLayerControler_1 = require("./ChapterLayerControler");
const ChapterMapControler_1 = require("./ChapterMapControler");
const ChapterCameraControler_1 = require("./ChapterCameraControler");
const PoolCode_1 = require("../../sys/consts/PoolCode");
const LevelFunc_1 = require("../../sys/func/LevelFunc");
const ChapInstanceEnemy_1 = require("../instance/ChapInstanceEnemy");
const ChapterFunc_1 = require("../../sys/func/ChapterFunc");
const BattleRoleView_1 = require("../../battle/view/BattleRoleView");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const ChapInstanceBox_1 = require("../instance/ChapInstanceBox");
const GlobalParamsFunc_1 = require("../../sys/func/GlobalParamsFunc");
const UserModel_1 = require("../../sys/model/UserModel");
const ChapterConst_1 = require("../../sys/consts/ChapterConst");
const ChapInstancePlayer_1 = require("../instance/ChapInstancePlayer");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const TimerManager_1 = require("../../../framework/manager/TimerManager");
const Message_1 = require("../../../framework/common/Message");
const ChapterEvent_1 = require("../../sys/event/ChapterEvent");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const TweenAniManager_1 = require("../../sys/manager/TweenAniManager");
const WindowEvent_1 = require("../../../framework/event/WindowEvent");
const GuideManager_1 = require("../../sys/manager/GuideManager");
const GuideConst_1 = require("../../sys/consts/GuideConst");
const StatisticsManager_1 = require("../../sys/manager/StatisticsManager");
/**章节地图控制器 */
class ChapterLogicControler {
    constructor(ctn, ui) {
        this.enemyArr = [];
        this.boxArr = [];
        //目标与角色之间的距离
        this.distance = 100;
        this._allMoveInstanceArr = [];
        this.mapOffestY = 0;
        this._allInstanceArr = [];
        this.doCurLevelCode = 0;
        this.isStop = false;
        this.handCode = 0;
        this.chapterLayerControler = new ChapterLayerControler_1.ChapterLayerControler(this, ctn);
        this.chapterMapControler = new ChapterMapControler_1.default(this);
        this.chapterCameraControler = new ChapterCameraControler_1.default(this);
        this.chapMapUI = ui;
        this.addEvent();
    }
    addEvent() {
        Message_1.default.instance.add(ChapterEvent_1.default.CHAPTEREVENT_PLAYER_MOVE, this);
        Message_1.default.instance.add(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, this);
    }
    setData(chapterId) {
        this.chapterId = chapterId;
        this.isStop = false;
        this.chapterData = ChapterFunc_1.default.instance.getCfgDatas("Chapter", chapterId);
        this.chapterMapControler.setData(chapterId);
        this.chapterCameraControler.setData();
        this.startLevel = ChapterFunc_1.default.instance.getUnlockLevelByChapter(this.chapterId);
        Laya.timer.frameLoop(1, this, this.updateFrame);
        this.mapOffestY = (this.chapterMapControler.totalMap - this.chapterMapControler.allMapCount) * this.chapterMapControler.itemHeight;
        this.initGame();
    }
    initGame() {
        this.createAllEnemy();
        this.createAllRewardBox();
        this.createChapterPlayer();
    }
    /**创建所有怪 */
    createAllEnemy() {
        var levelCount = this.chapterData.levelNumber;
        for (var i = 1; i <= levelCount; i++) {
            this.createEnemy({ id: this.startLevel + i, index: i, posId: this.chapterData.level[i - 1] });
        }
    }
    /**创建所有奖励宝箱 */
    createAllRewardBox() {
        var box = this.chapterData.box;
        for (var i = 0; i < box.length; i++) {
            var info = box[i].split(",");
            this.createRewardBox({ boxId: info[0], posId: info[1], levelId: this.startLevel + Number(info[2]), index: i + 1, startIndex: Number(info[2]) });
        }
    }
    //创建本章节角色
    createChapterPlayer() {
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        //如果最高关卡已经高于本章的最高关卡 ，就不创建角色了
        if (level >= this.startLevel + this.chapterData.levelNumber)
            return;
        var x = 0;
        var y = 0;
        var viewWay = 1;
        //如果正准备过本章节第一关，就把主角放到章节配置的初始位置
        if (level == this.startLevel) {
            var pos = ChapterFunc_1.default.instance.getCfgDatasByKey("ChapterSite", this.chapterData.startSite, "site");
            x = pos[0];
            y = pos[1] - this.mapOffestY;
            viewWay = pos[2];
            this.curTarget = this.enemyArr[0];
        }
        else {
            this.getNextTarget();
            viewWay = -this.curTarget.viewWay;
            var offest = Math.abs(Math.sqrt(this.distance * this.distance / 2));
            if (viewWay < 0) {
                //朝左，在目标右侧
                x = this.curTarget.pos.x + offest;
            }
            else {
                //朝右，在目标左侧
                x = this.curTarget.pos.x - offest;
            }
            y = this.curTarget.pos.y + offest;
        }
        this.player = this.createPlayer({}, x, y, viewWay);
        this.showGuide_206();
    }
    getNextTarget() {
        var target;
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        for (var i = 0; i < this.boxArr.length; i++) {
            var item = this.boxArr[i];
            if (item.levelId == level) {
                item.freshInfo();
                if (item.type == ChapterConst_1.default.Chapter_boxState_unlock) {
                    target = item;
                    break;
                }
            }
        }
        //如果我前方不存在箱子，就把目标选成下一关
        if (!target) {
            //没有目标宝箱并且已经过了最后一关
            if (level == this.startLevel + this.chapterData.levelNumber) {
                this.curTarget = null;
                return;
            }
            var targetIndex = level - this.startLevel;
            target = this.enemyArr[targetIndex];
        }
        this.curTarget = target;
    }
    //角色移动
    doPlayerMove() {
        if (!this.player)
            return;
        if (!this.curTarget)
            return;
        if (this.doCurLevelCode) {
            TimerManager_1.default.instance.remove(this.doCurLevelCode);
            this.doCurLevelCode = 0;
            if (this.curLevelImg) {
                this.curLevelImg.visible = false;
            }
        }
        this.curTarget.freshInfo();
        var arr = [];
        arr.push(this.curTarget);
        this.getNextTarget();
        this.checkReturnGuide();
        //如果没有下个目标 就不走了
        if (!this.curTarget)
            return;
        this.curTarget.freshInfo();
        arr.push(this.curTarget);
        this.player.moveToTargetPos(arr);
    }
    /**创建主角 */
    createPlayer(data, x, y, viewWay) {
        var cacheId = PoolCode_1.default.POOL_CHAPTERENEMY;
        var spineName = GlobalParamsFunc_1.default.instance.getDataString("playerSpine");
        var scale = BattleFunc_1.default.defaultScale * ChapterFunc_1.default.chapterMapScale;
        var cacheItem = this.createInstance(data, cacheId, ChapInstancePlayer_1.default, spineName, scale);
        cacheItem.classModel = ChapterConst_1.default.model_player;
        cacheItem.setPos(x, y);
        cacheItem.setViewWay(viewWay);
        cacheItem._myView.play("idle", true);
        this.chapterLayerControler.a21.addChild(cacheItem);
        this._allMoveInstanceArr.push(cacheItem);
        return cacheItem;
    }
    /**
     * 创建敌人
     * data:{
     *  id:关卡id
     *  index：第几个位置的
     *  posId:位置id
     * }
     */
    createEnemy(data) {
        var cacheId = PoolCode_1.default.POOL_CHAPTERENEMY + data.id;
        var spineName = LevelFunc_1.default.instance.getCfgDatasByKey("Level", data.id, "spine");
        var scale = BattleFunc_1.default.defaultScale * ChapterFunc_1.default.chapterMapScale;
        var cacheItem = this.createInstance(data, cacheId, ChapInstanceEnemy_1.default, spineName, scale, 9);
        var pos = ChapterFunc_1.default.instance.getCfgDatasByKey("ChapterSite", data.posId, "site");
        //设置怪物位置和转向
        cacheItem.setPos(pos[0], pos[1] - this.mapOffestY, 0);
        cacheItem.setViewWay(pos[2]);
        cacheItem._myView.play("idle", true);
        cacheItem.classModel = ChapterConst_1.default.model_enemy;
        this.chapterLayerControler.a21.addChild(cacheItem);
        this.enemyArr.push(cacheItem);
        return cacheItem;
    }
    /**
     * 创建奖励宝箱
     * @param data
     * {
     *     boxId:宝箱id，
     *     posId:位置id,
     *     levelId:前置关卡
     *     index:第几个宝箱
     * }
     */
    createRewardBox(data) {
        var cacheId = PoolCode_1.default.POOL_CHAPTERBOX;
        var cacheItem = this.createInstance(data, cacheId, ChapInstanceBox_1.default);
        var pos = ChapterFunc_1.default.instance.getCfgDatasByKey("ChapterSite", data.posId, "site");
        //设置怪物位置和转向
        cacheItem.setPos(pos[0], pos[1] - this.mapOffestY);
        cacheItem.setItemViewWay(pos[2]);
        cacheItem.classModel = ChapterConst_1.default.model_box;
        this.chapterLayerControler.a21.addChild(cacheItem);
        this.boxArr.push(cacheItem);
        return cacheItem;
    }
    /**
     *
     * @param data instance的数据
     * @param cacheId 缓存id
     * @param model 属于哪个模块
     * @param classModel 调用哪个类
     */
    createInstance(data, cacheId, classModel, resName, viewScale = 1, viewIndex = 0) {
        var instance = PoolTools_1.default.getItem(cacheId);
        if (instance) {
            //重置 instance的控制器
            instance.fogControler = this;
            instance.setData(data);
        }
        else {
            var view;
            instance = new classModel(this);
            instance.cacheId = cacheId;
            if (resName) {
                view = new BattleRoleView_1.default(resName, viewScale, viewIndex, "ChapterLogicalControler");
                instance.setView(view);
                instance.addChild(view);
                var shadeScale = BattleFunc_1.default.instance.getShadeScale(120);
                view.setShade(shadeScale);
                view.x = instance.width / 2;
                view.y = instance.height;
            }
            //设置数据
            instance.setData(data);
            this._allInstanceArr.push(instance);
        }
        return instance;
    }
    checkReturnGuide() {
        if (UserModel_1.default.instance.getMaxBattleLevel() == this.startLevel + this.chapterData.levelNumber && !this.chapMapUI.returnGuideGroup.visible) {
            this.chapMapUI.returnGuideGroup.visible = true;
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_10004, { chapterId: this.chapterId });
            if (!this.handCode) {
                this.handCode = TimerManager_1.default.instance.add(this.handAni, this, 600, Number.MAX_VALUE, false, [this.chapMapUI.handImg]);
                this.handAni(this.chapMapUI.handImg);
            }
        }
    }
    /**展示进入指定关卡引导 */
    showGuide_206() {
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_2_205 && this.curTarget) {
            var point = BattleFunc_1.default.tempClickPoint;
            this.curTarget.localToGlobal(point, false, this.chapMapUI);
            var width = this.curTarget.width;
            var height = this.curTarget.height;
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_2_206, GuideManager_1.default.GuideType.None, null, null, width, height, point.x - width / 2, point.y - 70);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_2_206);
        }
    }
    showGuide_206_finish() {
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_2_206) {
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_2_206, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            }, this);
        }
    }
    handAni(img) {
        if (WindowManager_1.default.getCurrentWindowName() != WindowCfgs_1.WindowCfgs.ChapterMapUI)
            return;
        img.x = 90;
        Laya.Tween.to(img, { x: 100 }, 200, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(img, { x: 80 }, 200, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(img, { x: 90 }, 200, null, null);
            }));
        }));
    }
    /**宝箱摇晃动画 */
    scaleAni(img) {
        if (WindowManager_1.default.getCurrentWindowName() != WindowCfgs_1.WindowCfgs.ChapterMapUI)
            return;
        TweenAniManager_1.default.instance.scaleQipaoAni(img, 1.2, null, null, false);
    }
    /**当前关卡动画 */
    nowLevelAni(data) {
        if (WindowManager_1.default.getCurrentWindowName() != WindowCfgs_1.WindowCfgs.ChapterMapUI)
            return;
        var x = data.x;
        var y = data.y;
        if (!this.curLevelImg) {
            this.curLevelImg = new Laya.Image("uisource/common/common/common_image_jiantou.png");
            this.curLevelImg.rotation = 180;
            this.curLevelImg.anchorX = 0.5;
            this.chapterLayerControler.a21.addChild(this.curLevelImg);
        }
        if (!this.curLevelImg.visible) {
            this.curLevelImg.visible = true;
        }
        Laya.Tween.clearTween(this.curLevelImg);
        this.curLevelImg.x = x;
        this.curLevelImg.y = y;
        Laya.Tween.to(this.curLevelImg, { y: y + 20 }, 200, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(this.curLevelImg, { y: y }, 200, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.curLevelImg, { y: y - 20 }, 200, null, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this.curLevelImg, { y: y }, 200);
                }));
            }));
        }));
    }
    //总的追帧刷新函数
    updateFrame() {
        this.runUpdate();
    }
    //更新所有实例
    runUpdate() {
        //这里要倒着遍历. 因为在执行每个对象的update的过程中 可能会销毁某个对象 导致数组变化
        var len = this._allMoveInstanceArr.length;
        for (var i = len - 1; i >= 0; i--) {
            var instance = this._allMoveInstanceArr[i];
            instance.updateFrame();
        }
        //重新运动
        for (var i = len - 1; i >= 0; i--) {
            var instance = this._allMoveInstanceArr[i];
            instance.updateFrameLater();
        }
    }
    setRoleAniStop() {
        if (WindowManager_1.default.getCurrentFullWindow() != this.chapMapUI && this.isStop == false) {
            this.isStop = true;
        }
        else if (WindowManager_1.default.getCurrentFullWindow() == this.chapMapUI && this.isStop == true) {
            this.isStop = false;
        }
        else {
            return;
        }
        for (var i = 0; i < this.enemyArr.length; i++) {
            if (this.isStop) {
                this.enemyArr[i]._myView.stop();
            }
            else {
                this.enemyArr[i]._myView.resume();
            }
        }
        if (this.player) {
            if (this.isStop) {
                this.player._myView.stop();
            }
            else {
                this.player._myView.resume();
            }
        }
    }
    //销毁一个实例
    destoryInstance(instance) {
        var cacheId = instance.cacheId;
        var model = instance.classModel;
        //把instance放入缓存.
        PoolTools_1.default.cacheItem(cacheId, instance);
        TableUtils_1.default.removeValue(this._allInstanceArr, instance);
        instance.dispose();
        if (model == ChapterConst_1.default.model_enemy) {
            TableUtils_1.default.removeValue(this.enemyArr, instance);
        }
        else if (model == ChapterConst_1.default.model_box) {
            TableUtils_1.default.removeValue(this.boxArr, instance);
        }
        else if (model == ChapterConst_1.default.model_player) {
            TableUtils_1.default.removeValue(this._allMoveInstanceArr, instance);
        }
        TimerManager_1.default.instance.removeByObject(instance);
    }
    //销毁一个数组的实例
    destoryInstanceArr(instanceArr, outRemoveAllArr = false) {
        for (var i = instanceArr.length - 1; i >= 0; i--) {
            if (instanceArr[i]) {
                this.destoryInstance(instanceArr[i]);
            }
        }
    }
    //退出游戏
    exitChapter() {
        this.dispose();
    }
    dispose() {
        //销毁所有对象 
        Laya.timer.clear(this, this.updateFrame);
        //销毁所有对象 
        this.destoryInstanceArr(this._allInstanceArr);
        //清空延迟回调
        this._allInstanceArr.length = 0;
        this._allMoveInstanceArr.length = 0;
        this.enemyArr.length = 0;
        this.boxArr.length = 0;
        this.chapterCameraControler && this.chapterCameraControler.dispose();
        this.chapterCameraControler = null;
        this.chapterLayerControler && this.chapterLayerControler.dispose();
        this.chapterLayerControler = null;
        this.chapterLayerControler && this.chapterMapControler.dispose();
        this.chapterMapControler = null;
        this.handCode = null;
        this.doCurLevelCode = null;
        TimerManager_1.default.instance.removeByObject(this);
        Message_1.default.instance.removeObjEvents(this);
    }
    recvMsg(cmd, data) {
        if (cmd == ChapterEvent_1.default.CHAPTEREVENT_PLAYER_MOVE) {
            this.doPlayerMove();
        }
        else if (cmd == WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN) {
            this.setRoleAniStop();
        }
    }
}
exports.default = ChapterLogicControler;
//# sourceMappingURL=ChapterLogicControler.js.map