"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const LevelFunc_1 = require("../../func/LevelFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ResourceConst_1 = require("../../consts/ResourceConst");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const BattleFunc_1 = require("../../func/BattleFunc");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const SubPackageManager_1 = require("../../../../framework/manager/SubPackageManager");
const SubPackageConst_1 = require("../../consts/SubPackageConst");
const UserModel_1 = require("../../model/UserModel");
const RolesModel_1 = require("../../model/RolesModel");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const GameUtils_1 = require("../../../../utils/GameUtils");
const RolesFunc_1 = require("../../func/RolesFunc");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const FogFunc_1 = require("../../func/FogFunc");
const FogConst_1 = require("../../consts/FogConst");
const FogModel_1 = require("../../model/FogModel");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const BattleConst_1 = require("../../consts/BattleConst");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const FogPropTrigger_1 = require("../../../fog/trigger/FogPropTrigger");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const TableUtils_1 = require("../../../../framework/utils/TableUtils");
const DisplayUtils_1 = require("../../../../framework/utils/DisplayUtils");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const MainJumpReturnComp_1 = require("../../../../framework/platform/comp/MainJumpReturnComp");
class BattleDetailUI extends layaMaxUI_1.ui.gameui.battle.BattleDetailUI {
    constructor() {
        super();
        this.timeCode = 0;
        //需要的背景块数
        this._pickNums = 3;
        /**一共有的地图块数 */
        this._allMapCount = 5;
        //每块区域的宽度
        this._areaWidth = 256;
        /**128小地图的展示次数 */
        this._smallMapCount = 0;
        //英雄列表
        this.heroArr = [];
        //敌人列表
        this.enemyArr = [];
        this.roleTxtArr = [];
        this.enemyTxtArr = [];
        //说话方  1是我方 2是敌方
        this.speakLine = 1;
        this.roleAniArr = [];
        this.extraScale = 1;
        this.equipUnlock = 20;
        /**奖励增加的比例 */
        this.addPercent = 1;
        /**助阵角色 */
        this.helpRoleId = null;
        this.isUseHelpRole = false;
        new ButtonUtils_1.ButtonUtils(this.startGameBtn, this.onClickStartGame, this);
        new ButtonUtils_1.ButtonUtils(this.startGameBtn1, this.onClickStartGame, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.returnBtn, this.onClickReturn, this);
        new ButtonUtils_1.ButtonUtils(this.fogFullStartBtn, this.onClickFogFull, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.helpRoleBtn, this.onClickHelpRole, this);
    }
    setData(data) {
        MainJumpReturnComp_1.default.instance.showJumpReturnBtn(this);
        this.eventInfo = {};
        this.actCost = 0;
        this.helpRoleId = null;
        this.helpItem = null;
        this.isUseHelpRole = false;
        this.firstOver.visible = false;
        this.spGroup.visible = false;
        this.helpRoleBtn.visible = false;
        //页面类型：默认为战斗预览界面
        this.viewType = FogConst_1.default.VIEW_TYPE_BATTLE_DETAIL;
        BattleFunc_1.default.curBattleType = BattleConst_1.default.BATTLETYPE_NORMAL;
        //敌人事件需要传入的参数：event
        if (data && data.event) {
            var event = data.event;
            this.viewType = FogConst_1.default.VIEW_TYPE_FOG_ENEMY;
            this.eventInfo = event.cfgData;
            this.enemyId = event.enemyId;
            this.enemyType = event.enemyType;
            BattleFunc_1.default.curBattleType = BattleConst_1.default.BATTLETYPE_WAR;
        }
        FogFunc_1.default.enemyCell = data && data.cell;
        var nextLevel = Number(UserModel_1.default.instance.getMaxBattleLevel()) + 1;
        if (data && data.level) {
            nextLevel = data.level;
        }
        else {
            if (nextLevel > LevelFunc_1.default.instance.getMaxLevel()) {
                nextLevel = LevelFunc_1.default.instance.getMaxLevel();
            }
        }
        this.equipUnlock = GlobalParamsFunc_1.default.instance.getDataNum("equipUnlock") || 20;
        this._smallMapCount = 0;
        this.levelId = nextLevel;
        this.helpRoleId = this.setBattleHelpRole();
        if (this.viewType == FogConst_1.default.VIEW_TYPE_BATTLE_DETAIL) {
            this.spGroup.visible = true;
            this.levelName = data.name;
            this.levelTxt.text = data.name + "  " + TranslateFunc_1.default.instance.getTranslate(LevelFunc_1.default.instance.getCfgDatasByKey("Level", this.levelId, "name"));
            var levelCfg = BattleFunc_1.default.instance.getCfgDatas("Level", this.levelId);
            this.desTxt.text = TranslateFunc_1.default.instance.getTranslate(levelCfg.levelLoading);
            this.actCostGroup.visible = false;
            if (this.levelId > UserModel_1.default.instance.getMaxBattleLevel()) {
                this.firstOver.visible = true;
                var reward = FogFunc_1.default.instance.getResourceShowInfo(levelCfg.firstReward[0].split(","));
                this.firstOverRewardImg.skin = reward["icon"];
                this.firstOverRewardTxt.text = reward["num"];
            }
        }
        else if (this.viewType == FogConst_1.default.VIEW_TYPE_FOG_ENEMY) {
            FogModel_1.default.fogAddEnergy = 0;
            //显示敌人名字
            this.levelTxt.text = FogFunc_1.default.enemyCell.eventData.enemyName;
            //显示事件配置的描述
            this.desTxt.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc, "TranslateEvent");
            //按钮消耗 
            this.actCost = event.mobilityCost ? event.mobilityCost : 0;
            if (this.actCost) {
                this.actCostGroup.visible = true;
                this.costNum.text = "-" + this.actCost;
            }
        }
        this.extraScale = GlobalParamsFunc_1.default.instance.getDataNum("roleSizeInPreUi") / 10000;
        this.heroArr = [];
        this.enemyArr = [];
        this.roleTxtArr = [];
        this.enemyTxtArr = [];
        this.roleAniArr = [];
        this.roleCtn.removeChildren();
        this.txtCtn.removeChildren();
        this.showRole();
        this.showMap();
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            this.setWarReward();
        }
        else {
            this.setReward();
        }
        //迷雾战斗引导中不可退出
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_7_702) {
            this.returnBtn.visible = false;
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_7_702, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            }, this);
        }
        else {
            this.returnBtn.visible = true;
        }
        this.setFogFullBtnShow();
        this.showGuide_207();
    }
    showGuide_207() {
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_2_206) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_2_207, GuideManager_1.default.GuideType.Static, this.startGameBtn1, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_2_207);
        }
    }
    showGuide_207_finish() {
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_2_207) {
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_2_207, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            }, this, true);
        }
    }
    /**设置远征结算奖励 */
    setWarReward() {
        this.addPercent = 1;
        //结算货币加成的道具检测
        FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_AddMoneyPer, this);
        var enemy = FogFunc_1.default.enemyCell.eventData;
        var reward = enemy.enemyData.reward;
        this.levelRewardImg.skin = DataResourceFunc_1.default.instance.getDataResourceInfo(reward)["img"];
        this.levelReward.text = Math.floor((reward[1] + reward[2] * FogModel_1.default.instance.getCurLayer()) * this.addPercent) + "";
    }
    setReward() {
        var rewardList = LevelFunc_1.default.instance.getLevelInfoById(this.levelId).victoryReward;
        var coin = 0;
        var gold = 0;
        for (var index in rewardList) {
            var reward = rewardList[index].split(",");
            switch (Number(reward[0])) {
                case DataResourceFunc_1.DataResourceType.COIN:
                    coin += Number(reward[1]);
                    break;
                case DataResourceFunc_1.DataResourceType.GOLD:
                    gold += Number(reward[1]);
                    break;
            }
        }
        if (gold) {
            this.levelRewardImg.skin = ResourceConst_1.default.GOLD_PNG;
            this.levelReward.text = StringUtils_1.default.getCoinStr(gold + "");
        }
        else {
            this.levelRewardImg.skin = ResourceConst_1.default.COIN_PNG;
            this.levelReward.text = StringUtils_1.default.getCoinStr(coin + "");
        }
    }
    /**设置心灵鸡汤显示 */
    setFogFullBtnShow() {
        this.fogFullStartBtn.visible = false;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            this.startGameBtn.visible = true;
            this.startGameBtn1.visible = false;
            var info = GlobalParamsFunc_1.default.instance.getDataArray("fogBattleAddtion");
            var itemCount = FogModel_1.default.instance.getPropNum(info[0]);
            //如果所需道具数量够或者可以看视频 就显示
            if (itemCount > 0 || ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_START) != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                this.fogFullStartBtn.visible = true;
            }
        }
        else {
            this.startGameBtn1.visible = true;
            this.startGameBtn.visible = false;
        }
    }
    /**显示地图 */
    showMap() {
        this.bgCtn.removeChildren();
        var mapId;
        //迷雾模式 取敌人表的地图
        if (this.viewType == FogConst_1.default.VIEW_TYPE_FOG_ENEMY) {
            if (FogFunc_1.default.enemyCell) {
                var event = FogFunc_1.default.enemyCell.eventData;
                mapId = FogFunc_1.default.instance.getCfgDatasByKey("Enemy", event.params[0], "sceneId");
            }
            else {
                LogsManager_1.default.errorTag("", "没有当前的敌人事件格子");
            }
        }
        else {
            mapId = BattleFunc_1.default.instance.getCfgDatasByKey("Level", this.levelId, "sceneId") || 1;
        }
        var sceneInfo = BattleFunc_1.default.instance.getCfgDatas("Scene", mapId);
        var backInfo = sceneInfo.background;
        var mapName = backInfo[0];
        this.mapName = mapName;
        var mapStartIndex = Number(backInfo[1]);
        var startOffest = Number(backInfo[2]);
        this.mapInfo = {
            ctn: this.bgCtn,
            infoArr: []
        };
        this.bgCtn.x = -ScreenAdapterTools_1.default.sceneOffsetX - ScreenAdapterTools_1.default.UIOffsetX - startOffest;
        for (var i = 1; i <= this._pickNums; i++) {
            //判断当前的图块id是否超了图块数量
            this.createOneView(mapName, i, mapStartIndex);
            mapStartIndex = mapStartIndex + 1 > this._allMapCount ? 1 : mapStartIndex + 1;
        }
    }
    createOneView(firstName, index, mapId) {
        var imageUrl1;
        var name;
        var path;
        name = firstName + "_0" + mapId;
        path = "map/" + firstName + "/" + name;
        var image = new Laya.Image();
        if (UserInfo_1.default.isSystemNative()) {
            imageUrl1 = "map/" + firstName + "/" + name + ".png";
        }
        else {
            imageUrl1 = "map/" + firstName + "/" + firstName + "/" + name + ".png";
            image.scale(2 * (1 + 2 / 256), 2);
        }
        this.bgCtn.addChild(image);
        var posIndex = (index - 1) * 2;
        var xpos = posIndex * this._areaWidth - this._smallMapCount * 256;
        if (mapId == 5) {
            this._smallMapCount += 1;
        }
        image.anchorX = 0;
        image.x = xpos;
        image.y = 0;
        var viewInfo = { view: image };
        this.mapInfo.infoArr.push(viewInfo);
        var onMapComplete = () => {
            image.skin = imageUrl1;
        };
        //必须地图组是分包的就直接走;
        if (SubPackageManager_1.default.getPackStyle(SubPackageConst_1.default.packName_map) == SubPackageConst_1.default.PATH_STYLE_SUBPACK) {
            SubPackageManager_1.default.loadDynamics(firstName, path, onMapComplete, this);
        }
        else {
            onMapComplete();
        }
    }
    /**展示角色 */
    showRole() {
        this.setShowRole();
        for (var i = 0; i < this.enemyArr.length; i++) {
            var x = ScreenAdapterTools_1.default.width / 2 + 160 + 120 * Math.floor(i / 3);
            var y = 600 + 150 * (i % 3);
            this.setRoleAni(i, x, y, -1, this.enemyArr, this.enemyTxtArr, true);
        }
        var heroArrlength = this.heroArr.length;
        for (var i = 0; i < heroArrlength; i++) {
            var x = 0;
            var y = 0;
            if (heroArrlength > 6 && i > 2) {
                x = ScreenAdapterTools_1.default.width / 2 - 50 - 120 * Math.floor(3 / 3);
                y = 550 + 100 * (i % 4);
            }
            else {
                x = ScreenAdapterTools_1.default.width / 2 - 50 - 120 * Math.floor(i / 3);
                y = 600 + 150 * (i % 3);
            }
            this.setRoleAni(i, x, y, 1, this.heroArr, this.roleTxtArr);
        }
        this.freshSpeakInfo();
        this.timeCode = TimerManager_1.default.instance.add(this.freshSpeakInfo, this, GlobalParamsFunc_1.default.instance.getDataNum("preSpeakInterval"));
    }
    setRoleAni(i, x, y, viewWay, arr, txtArr, isForce = false) {
        var role = new Laya.Image();
        role.anchorX = 0.5;
        role.anchorY = 1;
        this.roleCtn.addChild(role);
        var item = arr[i];
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + item.id + "_" + viewWay);
        var scale = (BattleFunc_1.default.instance.getCfgDatasByKey("Role", item.id, "scale") / 10000 || 1);
        var showScale = scale * BattleFunc_1.default.defaultScale * this.extraScale;
        if (!cacheItem) {
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
                isForce = false;
            }
            cacheItem = BattleFunc_1.default.instance.createRoleSpine(item.id, item.level, 2, showScale, true, isForce, "BattleDetaiUI");
        }
        else {
            cacheItem.setItemViewScale(showScale);
        }
        cacheItem.scaleX = viewWay;
        var size = BattleFunc_1.default.instance.getCfgDatasByMultyKey("RoleUpdate", item.id, item.level, "size");
        role.addChild(cacheItem);
        var halfWidth = size[0] * scale * this.extraScale / 2;
        var height = size[1] * scale * this.extraScale;
        cacheItem.play("idle", true);
        role.x = x;
        role.y = y;
        var ctn = this.addSpeak(viewWay);
        this.txtCtn.addChild(ctn);
        ctn.x = x + halfWidth * viewWay;
        ctn.y = y - height;
        ctn.visible = false;
        if (item.helpRole) {
            this.helpItem = cacheItem;
            DisplayUtils_1.default.setViewDark(cacheItem);
            this.helpRoleBtn.visible = true;
            this.helpRoleBtn.x = x;
            this.helpRoleBtn.y = y + 20;
            var type = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_TRYROLE);
            this.helpFreeImg.skin = ShareOrTvManager_1.default.instance.getFreeImgSkin(type);
            if (type == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_ROLETRY_SHOW, { levelId: this.levelId, roleId: this.helpRoleId });
            }
        }
        txtArr.push({ ctn: ctn, speak: BattleFunc_1.default.instance.getCfgDatasByKey("Role", item.id, "preSpeak") });
        this.roleAniArr.push({ item: cacheItem, id: item.id, viewWay: viewWay });
        if (this.levelId >= this.equipUnlock) {
            var star = new Laya.Image();
            star.width = 100;
            star.anchorX = 0.5;
            star.x = x;
            star.y = y - height - 20;
            this.txtCtn.addChild(star);
            RolesFunc_1.default.instance.addStarImg(star, item.id, 20, 20, item.starLevel);
        }
    }
    addSpeak(viewway) {
        var ctn = new Laya.Image();
        var img = new Laya.Image();
        var txt = new Laya.Label();
        img.width = 170;
        img.height = 96;
        if (viewway == -1) {
            img.skin = "uisource/common/common/common_image_difang.png";
            txt.width = 112;
            txt.height = 37;
            txt.rotation = 0;
            img.x = -129;
            img.y = -80;
            txt.x = -92;
            txt.y = -47;
            txt.font = "Microsoft YaHei";
            txt.fontSize = 20;
            txt.color = "#000000";
            txt.overflow = "hidden";
            txt.wordWrap = true;
            txt.name = "txt";
        }
        else {
            img.skin = "uisource/common/common/common_image_qipao.png";
            img.scaleX = -1;
            img.x = 146;
            img.y = -70;
            txt.width = 112;
            txt.height = 37;
            txt.rotation = 0;
            txt.x = 8;
            txt.y = -44;
            txt.font = "Microsoft YaHei";
            txt.fontSize = 20;
            txt.color = "#000000";
            txt.overflow = "hidden";
            txt.wordWrap = true;
            txt.name = "txt";
        }
        txt.text = "";
        ctn.addChild(img);
        ctn.addChild(txt);
        return ctn;
    }
    /**设置需要显示的角色内容 */
    setShowRole() {
        //战斗预览
        if (this.viewType == FogConst_1.default.VIEW_TYPE_BATTLE_DETAIL) {
            this.enemyArr = RolesFunc_1.default.instance.getLevelMonsterArr(this.levelId);
            this.heroArr = RolesModel_1.default.instance.getInLineRole();
        }
        //敌人事件阵容预览
        else if (this.viewType == FogConst_1.default.VIEW_TYPE_FOG_ENEMY) {
            this.enemyArr = FogFunc_1.default.instance.getEnemyLine(this.enemyId, this.enemyType);
            this.heroArr = RolesModel_1.default.instance.getFogRole();
        }
        this.heroArr.splice(6, this.heroArr.length - 6);
        /**如果有助阵英雄 */
        if (this.helpRoleId) {
            var tryRoleNum = LevelFunc_1.default.instance.getCfgDatasByKey("Level", this.levelId, "tryRoleNum");
            var info = TableUtils_1.default.copyOneTable(BattleFunc_1.default.instance.getCfgDatas("Role", this.helpRoleId));
            info.level = tryRoleNum[0];
            info.starLevel = tryRoleNum[1];
            info.helpRole = 1;
            //把助阵英雄插入第二个位置
            this.heroArr.splice(1, 0, info);
        }
    }
    freshSpeakInfo() {
        if (this.speakLine == 1) {
            for (var i = 0; i < this.enemyTxtArr.length; i++) {
                var item = this.enemyTxtArr[i];
                item.ctn.visible = false;
            }
            var index = GameUtils_1.default.getRandomInt(0, this.roleTxtArr.length - 1);
            for (var i = 0; i < this.roleTxtArr.length; i++) {
                var item = this.roleTxtArr[i];
                if (i == index) {
                    item.ctn.visible = true;
                    var txt = item.ctn.getChildByName("txt");
                    txt.text = TranslateFunc_1.default.instance.getTranslate(GameUtils_1.default.getRandomInArr(item.speak).result);
                }
                else {
                    item.ctn.visible = false;
                }
            }
            this.speakLine = 2;
        }
        else {
            for (var i = 0; i < this.roleTxtArr.length; i++) {
                var item = this.roleTxtArr[i];
                item.ctn.visible = false;
            }
            var index = GameUtils_1.default.getRandomInt(0, this.enemyTxtArr.length - 1);
            for (var i = 0; i < this.enemyTxtArr.length; i++) {
                var item = this.enemyTxtArr[i];
                if (i == index) {
                    item.ctn.visible = true;
                    var txt = item.ctn.getChildByName("txt");
                    txt.text = TranslateFunc_1.default.instance.getTranslate(GameUtils_1.default.getRandomInArr(item.speak).result);
                }
                else {
                    item.ctn.visible = false;
                }
            }
            this.speakLine = 1;
        }
    }
    cacheRole() {
        for (var i = this.roleAniArr.length - 1; i >= 0; i--) {
            var item = this.roleAniArr[i];
            var role = item.item;
            var id = item.id;
            DisplayUtils_1.default.clearViewFilter(role);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + item.id + "_" + item.viewWay, role);
            this.roleAniArr.splice(i, 1);
            var ctn = this.roleCtn.getChildAt(i);
            ctn.removeChild(role);
            this.roleCtn.removeChild(ctn);
        }
    }
    onClickFogFull() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogBattleStartAlertUI, { detail: this });
    }
    onClickStartGame() {
        //敌人事件战斗预览
        if (this.viewType == FogConst_1.default.VIEW_TYPE_FOG_ENEMY) {
            //todo:行动力扣除位置待确定
            //开始战斗点击后，需要扣除相应的行动力才能挑战。行动力不足则弹视频。
            if (this.actCost > FogModel_1.default.instance.getActNum()) {
                FogModel_1.default.instance.checkFreeAct();
                return;
            }
            this.enterBattle();
        }
        //战斗预览
        else if (this.viewType == FogConst_1.default.VIEW_TYPE_BATTLE_DETAIL) {
            this.showGuide_207_finish();
            this.enterBattle();
        }
    }
    enterBattle() {
        //进战斗界面
        var result = LevelFunc_1.default.instance.checkIsBattleAddtionInGame();
        //判断是否进入满能量界面 远征没有满能量
        if (!result[0] || BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            this.dispose();
            this.enterBattleUI();
        }
        else {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.BattleFullEnergyUI, { "battleAddtionId": result[1], detail: this });
        }
    }
    enterBattleUI(data = null) {
        if (!data) {
            data = {};
        }
        data["levelId"] = this.levelId;
        data["name"] = this.levelName;
        if (this.isUseHelpRole) {
            data["helpRole"] = this.helpRoleId;
        }
        this.helpRoleId = null;
        this.isUseHelpRole = false;
        WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.BattleUI, WindowCfgs_1.WindowCfgs.BattleDetailUI, data);
    }
    onClickReturn() {
        this.dispose();
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleDetailUI);
    }
    /**设置战斗助阵角色 */
    setBattleHelpRole() {
        if (BattleFunc_1.default.curBattleType != BattleConst_1.default.BATTLETYPE_NORMAL)
            return;
        //当前所在关卡小于等于开启关卡，没有助阵角色
        if (Number(this.levelId) <= GlobalParamsFunc_1.default.instance.getDataNum("roleTryLevel"))
            return;
        if (ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_TRYROLE) == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE)
            return;
        var allRole = RolesFunc_1.default.instance.getHelpRoleTab();
        var list = [];
        for (var i = 0; i < allRole.length; i++) {
            var item = allRole[i].split(",");
            //如果没有解锁这个角色并且试用关卡不大于当前关卡
            if (!RolesModel_1.default.instance.getIsHaveRole(item[0]) && Number(item[1]) <= this.levelId) {
                list.push(allRole[i]);
            }
        }
        if (list.length == 0)
            return;
        var result = GameUtils_1.default.getWeightItem(list);
        return result[0];
    }
    //销毁地图
    destoryOneLayer(mapInfo) {
        if (!mapInfo)
            return;
        LogsManager_1.default.echo("销毁详情地图-------------------------");
        var infoArr = mapInfo.infoArr;
        for (var i = 0; i < infoArr.length; i++) {
            var view = infoArr[i].view;
            view.removeSelf();
            if (UserInfo_1.default.isSystemNative()) {
                view.dispose();
            }
        }
        if (!UserInfo_1.default.isSystemNative()) {
            Laya.loader.clearRes("res/atlas/map/" + this.mapName + "/" + this.mapName + ".atlas");
            Laya.loader.clearRes("res/atlas/map/" + this.mapName + "/" + this.mapName + ".png");
        }
    }
    onClickHelpRole() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.BattleHelpRoleUI, {
            callBack: this.getHelpRole,
            thisObj: this,
            helpRoleId: this.helpRoleId
        });
    }
    getHelpRole() {
        this.helpRoleBtn.visible = false;
        DisplayUtils_1.default.clearViewFilter(this.helpItem);
        this.isUseHelpRole = true;
    }
    dispose() {
        this.cacheRole();
        this.destoryOneLayer(this.mapInfo);
        this.mapInfo = null;
        TimerManager_1.default.instance.remove(this.timeCode);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = BattleDetailUI;
//# sourceMappingURL=BattleDetailUI.js.map