"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const GameConsts_1 = require("../consts/GameConsts");
const BattleConst_1 = require("../consts/BattleConst");
const GlobalParamsFunc_1 = require("./GlobalParamsFunc");
const AttributeExtendData_1 = require("../../battle/data/AttributeExtendData");
const GameSwitch_1 = require("../../../framework/common/GameSwitch");
const UserInfo_1 = require("../../../framework/common/UserInfo");
const BattleRoleView_1 = require("../../battle/view/BattleRoleView");
const UserExtModel_1 = require("../model/UserExtModel");
const ShareOrTvManager_1 = require("../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("./ShareTvOrderFunc");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
const WindowCfgs_1 = require("../consts/WindowCfgs");
const DataResourceFunc_1 = require("./DataResourceFunc");
const UserModel_1 = require("../model/UserModel");
const RolesModel_1 = require("../model/RolesModel");
const FogFunc_1 = require("./FogFunc");
const RolesFunc_1 = require("./RolesFunc");
class BattleFunc extends BaseFunc_1.default {
    constructor() {
        super();
        //--------------------------------------------------------------------------------------------------------------
        //--------------------------------------缓存数据-----------------------------------------------------------------
        //--------------------------------------------------------------------------------------------------------------
        this._cacheCfgMap = { baseAttr: {}, addAttr: {}, advanceAttr: {}, rebornAttr: {} };
    }
    //返回属性的样式 1是数值型 2是比例型
    static getPropStyle(id) {
        var info = this.idToShowMap[id];
        if (!info) {
            return BattleConst_1.default.PROPSTYLE_RATIO;
        }
        return info.display;
    }
    static getOneTempArr() {
        if (this._cacheTempArr.length == 0) {
            return [];
        }
        return this._cacheTempArr.shift();
    }
    //缓存一个tempArr 把长度设置为0
    static cacheOneTempArr(value) {
        value.length = 0;
        this._cacheTempArr.push(value);
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new BattleFunc();
            BattleFunc.initGlobalParams();
        }
        return this._instance;
    }
    getCfgsPathArr() {
        return ["AttributeList", "Role", "RoleUpdate", "Scene", "Decoration",
            "Skill", "SkillUpdate", "Buff", "Condition", "SkillEffect",
            "Target", "RoleAct", "Level", "LevelWave",
            "PassiveSkill", "AoeEffect", "Bullet", "TranslateLevel", "TranslateMonster", "Lottery"
        ];
    }
    //获取角色对应的数据
    getRoleInfoData(id, level) {
        return this.getCfgDatasByKey("Role", id, level);
    }
    //将毫秒转化成帧
    turnMinisecondToframe(minisecond) {
        return Math.floor(Number(minisecond) * BattleFunc.miniSecondToFrame);
    }
    //将 像素/秒转化成 像素/帧
    turnSpeedToFrame(secondSpeed) {
        return secondSpeed / GameConsts_1.default.gameFrameRate;
    }
    getShadeScale(instanceWid) {
        var scale = instanceWid / BattleFunc.defaultShadeWidth;
        if (scale > 1) {
            scale = 1;
        }
        else if (scale < 0.3) {
            scale = 0.3;
        }
        return scale;
    }
    //将 像素/秒转化成 像素/帧
    turnAddSpeedToFrame(secondAddSpeed) {
        return secondAddSpeed / GameConsts_1.default.gameFrameRate / GameConsts_1.default.gameFrameRate;
    }
    //创建角色spine 需要把role数据传递进来,为以后 换装或者皮肤做准备 
    //targetScale 缩放系数 因为是按照4倍大尺寸做的 所以默认缩放系数是0.2 . 根据系统需要传入缩放值
    // type 1是小兵, 2是英雄 
    // isForceModifyBody  是否需要强制修改角色的皮肤为9
    //tag表示当前动画 在哪个ui. 用来做统计筛选的
    createRoleSpine(roleId, level, type, targetScale = 0.25, isShowShade = true, isForceModifyBody = false, uiTag = "") {
        var cfgs = this.getCfgDatas("Role", roleId);
        var spineName = cfgs.spine[0];
        var roleUpdateInfo = this.getCfgDatasByKey("RoleUpdate", roleId, level);
        var index = roleUpdateInfo.body || 0;
        if (isForceModifyBody) {
            index = 9;
        }
        var animode = index == 0 && 0 || 1;
        var sp = new BattleRoleView_1.default(spineName, targetScale, index, uiTag);
        if (isShowShade) {
            var size = roleUpdateInfo.size;
            var width = Number(size[1]);
            var shadeScale = this.getShadeScale(width);
            sp.setShade(shadeScale);
        }
        //播放闲置动画
        sp.play(BattleConst_1.default.LABEL_IDLE, true);
        return sp;
    }
    //计算主角属性
    countPlayerAttr(outMap, heroId, heroInfo, userData) {
        if (!this._cacheAttrData) {
            this._cacheAttrData = new AttributeExtendData_1.default(heroId, heroInfo, BattleConst_1.default.LIFE_PLAYER, userData);
        }
        else {
            this._cacheAttrData.resetData(heroId, heroInfo, BattleConst_1.default.LIFE_PLAYER, userData);
        }
        for (var i in this._cacheAttrData.finalAttr) {
            outMap[i] = this._cacheAttrData.finalAttr[i];
        }
        return outMap;
    }
    //把配表数组转化成 table,  [ ["1","200","300"] ,....]-> { "1":[200,300], "2":[300,400],... } 注意所有的属性id必须是字符串
    turnPropArrToTable(propArr, outTable = null) {
        if (!outTable) {
            outTable = {};
        }
        ;
        if (!propArr) {
            LogsManager_1.default.errorTag("properror", "没有传入属性数据");
            return outTable;
        }
        for (var i = 0; i < propArr.length; i++) {
            var info = propArr[i];
            //如果是字符串.说明还没有进行拆分
            if (typeof info == "string") {
                info = info.split(",");
            }
            var id = info[0];
            if (!outTable[id]) {
                outTable[id] = [0, 0];
            }
            outTable[id][0] += Number(info[1]) || 0;
            outTable[id][1] += Number(info[2]) || 0;
        }
        return outTable;
    }
    //获取缓存的baseAttr. 是为了提高性能节省内存,避免重复copy
    getCacheBaseAttr(attrId) {
        if (!this._cacheCfgMap.baseAttr[attrId]) {
            this._cacheCfgMap.baseAttr[attrId] = this.turnPropArrToTable(this.getCfgDatasByKey("BaseAttribute", attrId, "baseAttribute"));
        }
        return this._cacheCfgMap.baseAttr[attrId];
    }
    //获取缓存的addAttr
    getCacheAddAttr(attrId) {
        if (!this._cacheCfgMap.addAttr[attrId]) {
            this._cacheCfgMap.addAttr[attrId] = this.turnPropArrToTable(this.getCfgDatasByKey("BaseAttribute", attrId, "attributeAdd"));
        }
        return this._cacheCfgMap.addAttr[attrId];
    }
    //获取缓存的 advance
    getCacheAdvanceAttr(roleId, advance) {
        var key = roleId + "_" + advance;
        if (!this._cacheCfgMap.advanceAttr[key]) {
            this._cacheCfgMap.advanceAttr[key] = this.turnPropArrToTable(this.getCfgDatasByMultyKey("RoleAdvance", roleId, advance, "attr"));
        }
        return this._cacheCfgMap.advanceAttr[key];
    }
    //获取缓存的rebornData
    getCacheRebornAttr(rebornTimes) {
        var key = rebornTimes;
        if (!this._cacheCfgMap.rebornAttr[key]) {
            this._cacheCfgMap.rebornAttr[key] = this.turnPropArrToTable(this.getCfgDatasByKey("RebornAttribute", String(rebornTimes), "attribute"));
        }
        return this._cacheCfgMap.rebornAttr[key];
    }
    //获取阵位坐标偏移
    getPosByFromation(zhenwei) {
        return 1;
    }
    //获取技能参数
    getSkillValueByParams(key, _skillId, level, skillParams, tag) {
        if (key.indexOf("_") == -1) {
            return Number(key);
        }
        if (!skillParams) {
            skillParams = this.getCfgDatasByMultyKey("SkillUpdate", _skillId, String(level), "params", true);
            if (!skillParams) {
                return Number(key);
            }
        }
        var tempArr = key.split("_");
        var arr1 = skillParams[Number(tempArr[0]) - 1];
        if (!arr1) {
            LogsManager_1.default.errorTag("SkillCfgsError", "参数配置错误,skillId:", _skillId, "skilllv:", level, "key:", key, tag);
            return 0;
        }
        var rt = arr1[Number(tempArr[1]) - 1];
        if (rt == null) {
            LogsManager_1.default.errorTag("SkillCfgsError", "参数配置错误,skillId:", _skillId, "skilllv:", level, "key:", key, tag);
            return 0;
        }
        rt = Number(rt);
        if (isNaN(rt)) {
            LogsManager_1.default.errorTag("battleError", "错误的技能参数数据,skillId:", _skillId, "skilllv:", level, tag);
        }
        return rt;
    }
    //初始化全局参数. 策划配置的数需要转化.而且为了访问方便.
    static initGlobalParams() {
        this.critDamgeRatio = GlobalParamsFunc_1.default.instance.getDataNum("baseCritDamage") / 10000;
        this.minDamageRatio = GlobalParamsFunc_1.default.instance.getDataNum("minDamage") / 10000;
        this.battleCenterY = GlobalParamsFunc_1.default.instance.getDataNum("battleCenterY");
        this.battleUpY = this.battleCenterY - 180;
        this.battleDownY = this.battleCenterY + 180;
        var cfg = BattleFunc.instance.getAllCfgData("AttributeList");
        this.reducedUnitArr = GlobalParamsFunc_1.default.instance.getDataString("reducedUnit").split(",");
        this.airArmyHigh = GlobalParamsFunc_1.default.instance.getDataNum("airArmyHigh");
        this.landArmyStartYLocation = GlobalParamsFunc_1.default.instance.getDataArray("landArmyStartYLocation");
        this.airArmyStartXLocation = GlobalParamsFunc_1.default.instance.getDataNum("airArmyStartXLocation");
        this.landArmyStartXLocation = GlobalParamsFunc_1.default.instance.getDataNum("landArmyStartXLocation");
        this.pylonTwoLocation = GlobalParamsFunc_1.default.instance.getDataNum("pylonTwoLocation");
        this.pylonStartXLocation = GlobalParamsFunc_1.default.instance.getDataNum("pylonStartXLocation");
        this.diedShockCount = GlobalParamsFunc_1.default.instance.getDataNum("deadShock");
        var buildAutoHp = GlobalParamsFunc_1.default.instance.getDataArray("buildingAutoReduceHp");
        this.warRoleXoffest = GlobalParamsFunc_1.default.instance.getDataArray("fogBattleColumns");
        this.buildAutoFrame = BattleFunc.instance.turnMinisecondToframe(Number(buildAutoHp[0]));
        this.deadLastFrame = BattleFunc.instance.turnMinisecondToframe(GlobalParamsFunc_1.default.instance.getDataNum("pylonStartXLocation"));
        this.buildingAutoReduceHp = Number(buildAutoHp[1]);
        this.fogBattleRecover = GlobalParamsFunc_1.default.instance.getDataNum("fogResurrectionEnergy") / 10000;
        this.leftAniTime = GlobalParamsFunc_1.default.instance.getDataNum("battleEndWarnTime") / 1000;
        this.overTimePassiveSkill = GlobalParamsFunc_1.default.instance.getDataNum("battleOvertimeBuff");
        this.idToShowMap = cfg;
        this.initFrameDates();
        //判断调试开关
        if (UserInfo_1.default.isWeb()) {
            var re = /\@(.*)\@/g;
            //如果匹配到
            if (window.location.href.search(re) >= 0) {
                var rt = re.exec(window.location.href);
                var str = rt[1];
                LogsManager_1.default.echo("战斗调试模式:", str);
                GameSwitch_1.default.switchMap.SWITCH_BATTLE_DEBUGLEVEL = str;
            }
        }
    }
    //初始化帧率相关数据
    static initFrameDates() {
        this.battleViewFrameScale = GameConsts_1.default.gameFrameRate / 30;
        this.miniSecondToFrame = GameConsts_1.default.gameFrameRate / 1000;
        this.frameToMiniSecode = 1000 / GameConsts_1.default.gameFrameRate;
    }
    showGetPower() {
        var power = UserExtModel_1.default.instance.getCurrentSp();
        if (power < GlobalParamsFunc_1.default.instance.getDataNum('levelSpCost')) {
            var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FREE_SP);
            //体力不足不让玩了
            if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_battle_noenoughsp"));
            }
            else {
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FreeResourceUI, { type: DataResourceFunc_1.DataResourceType.SP });
            }
            return true;
        }
        return false;
    }
    //是否展示滑稽装备碎片引导
    IshowGuide_403() {
        if (UserModel_1.default.instance.getMainGuide() == 6) {
            var baseRole = GlobalParamsFunc_1.default.instance.getDataNum("bornRoleId");
            //碎片第一步引导结束并且当前需要引导合成的角色还没有合成
            if (RolesModel_1.default.instance.getRoleStarLevel(baseRole) == 0 && !RolesModel_1.default.instance.getIsHaveEquip(baseRole, GlobalParamsFunc_1.default.instance.getDataNum("guideEquipId"))) {
                return true;
            }
        }
        return false;
    }
    /**进入战斗引导 */
    IshowGuide_204() {
        //大于一关就不引导进入游戏了 并且没有进行过该步引导  该步是第四步
        if (UserModel_1.default.instance.getMaxBattleLevel() == 1 && UserModel_1.default.instance.getMainGuide() <= 3) {
            return true;
        }
        return false;
    }
    //检测迷雾街区功能开启引导
    IshowGuide_501() {
        if (UserModel_1.default.instance.getMainGuide() < 9 && UserModel_1.default.instance.getMaxBattleLevel() >= FogFunc_1.default.instance.getFogOpenLevel()) {
            return true;
        }
        return false;
    }
    IshowUnlockGuide() {
        var isShow = false;
        var curLevel = UserExtModel_1.default.instance.getMaxLevel();
        var roleList = RolesFunc_1.default.instance.getAllRole();
        var roleInfo;
        for (var id in roleList) {
            if (roleList[id].unlockCondition) {
                var unlockCondition = roleList[id].unlockCondition;
                for (var i = 0; i < unlockCondition.length; i++) {
                    var temp = unlockCondition[i].split(",");
                    if (Number(temp[0]) == RolesFunc_1.default.ROLE_UNLOCK_TYPE_LEVEL) {
                        if (Number(temp[1]) == curLevel && !RolesModel_1.default.instance.getIsHaveRole(id)) {
                            isShow = true;
                            break;
                        }
                    }
                }
            }
        }
        return isShow;
    }
}
exports.default = BattleFunc;
//战斗调试参数 
BattleFunc.debugValue = "0";
//属性id对应显示类型map. 存储起来 提高运算性能 {attrId:1,"1":1,"2":2}; key是string
BattleFunc.idToShowMap = {};
//黑屏深度
BattleFunc.zorder_blackScreen = 2000 * 10;
//入场速度
BattleFunc.enterSpeed = 2.5;
BattleFunc.battleCenterY = 560;
//开场等待帧数
BattleFunc.battleWaitFrame = 30;
//地方刷新距离中点的偏移;
BattleFunc.firstWavePos = 200;
BattleFunc.otherWavePos = 400;
BattleFunc.defaultShadeWidth = 120;
//默认缩放系数
BattleFunc.defaultScale = 0.25;
//暴击伤害
BattleFunc.critDamgeRatio = 2;
//最低伤害比例
BattleFunc.minDamageRatio = 0.01;
//迷雾战斗复活恢复的能量
BattleFunc.fogBattleRecover = 0.1;
//坐标相关
/**空军高度 */
BattleFunc.airArmyHigh = 270;
/**空军X */
BattleFunc.airArmyStartXLocation = 220;
/**地面X */
BattleFunc.landArmyStartXLocation = 220;
/**地面Y */
BattleFunc.landArmyStartYLocation = [0, 20, -20, 40, -40, 60, -60];
/**远征站位坐标 基于基地 */
BattleFunc.warRoleXoffest = [0, 100, 200];
/**电塔x */
BattleFunc.pylonStartXLocation = 350;
/**重复电塔x的偏移 */
BattleFunc.pylonTwoLocation = 30;
/**电塔扣血万分比量 */
BattleFunc.buildingAutoReduceHp = 160;
/**电塔扣血帧数 */
BattleFunc.buildAutoFrame = 30;
//死亡后停留时长
BattleFunc.deadLastFrame = 10;
//角色死亡微振动次数
BattleFunc.diedShockCount = 3;
BattleFunc.leftAniTime = 5;
BattleFunc.moveSpeed = 1;
BattleFunc.battleRandomIndex = 3;
BattleFunc.angletoRad = Math.PI / 180;
BattleFunc.radtoAngle = 180 / Math.PI;
//1米大概等于多少像素
BattleFunc.miToPixel = 640 / 18;
BattleFunc.pixelToMi = 18 / 640;
//一周
BattleFunc.twopi = Math.PI * 2;
//90°对应的弧度
BattleFunc.halfpi = Math.PI / 2;
//默认角色的y坐标. 这样可以提升性能 降低批次穿透
BattleFunc.defaultRoleYpos = 0;
//战斗中的帧长度系数
BattleFunc.battleViewFrameScale = 2;
//毫秒转化成帧
BattleFunc.miniSecondToFrame = 60 / 1000;
//帧转化成毫秒
BattleFunc.frameToMiniSecode = 1000 / 60;
//原点0,0,0 禁止修改
BattleFunc.originPoint = new Laya.Vector3();
//定义一个临时对象.用来存储临时属性的
BattleFunc.tempObject = {};
BattleFunc.tempObject2 = {};
BattleFunc.tempObject3 = {};
BattleFunc.tempObject4 = {};
//临时矩形
BattleFunc.tempRect = { x: 0, y: 0, width: 0, height: 0 };
BattleFunc.tempRect2 = { x: 0, y: 0, width: 0, height: 0 };
//临时的圆
BattleFunc.tempCircle = { r: 0, x: 0, y: 0 };
//记录一个临时点 战斗逻辑中间使用的过渡点
BattleFunc.tempPoint = new Laya.Vector3(0, 0, 0);
BattleFunc.tempPoint2 = new Laya.Vector3(0, 0, 0);
BattleFunc.tempPoint3 = new Laya.Vector3(0, 0, 0);
BattleFunc.tempPoint4 = new Laya.Vector3(0, 0, 0);
BattleFunc.tempClickPoint = new Laya.Point(0, 0);
/**特效不独立 */
BattleFunc.EFFECT_NOALLOW = 1;
//空数组 禁止写
BattleFunc.emptyArr = [];
BattleFunc._cacheTempArr = [];
//被动技能
BattleFunc.tempArr_passive = [];
//波次最大时长 默认是60秒
BattleFunc.waveMaxFrame = 60 * 60;
//boss时长
BattleFunc.bossMaxFrame = 60 * 60;
/**创建不同角色的index值 */
BattleFunc.CreateRoleIndex = {};
/**当前战斗类型 */
BattleFunc.curBattleType = 1;
//# sourceMappingURL=BattleFunc.js.map