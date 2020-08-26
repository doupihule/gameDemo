"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const ShopModel_1 = require("../../model/ShopModel");
const ShopServer_1 = require("../../server/ShopServer");
const ShopFunc_1 = require("../../func/ShopFunc");
const GameUtils_1 = require("../../../../utils/GameUtils");
const MainShopItemUI_1 = require("./MainShopItemUI");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const BattleFunc_1 = require("../../func/BattleFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const Client_1 = require("../../../../framework/common/kakura/Client");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
class MainShopUI extends layaMaxUI_1.ui.gameui.shop.MainShopUI {
    constructor() {
        super();
        this.isSendServer = false;
        this.itemArr = [];
        this.initBtn();
        this.addEvent();
        this.ctn.vScrollBarSkin = "";
    }
    addEvent() {
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.exitBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.freshBtn, this.onClickFresh, this);
    }
    setData(data) {
        this.isSendServer = false;
        this.itemArr = [];
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.PIECE_OPEN);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOP_OPEN);
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_SHOP_REFRESH);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_SHOPREFRESH_SHOW);
        }
        if (this.freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.freeImg.skin = ShareOrTvManager_1.default.instance.getFreeImgSkin(this.freeType);
        }
        this.showRoleAni("1011");
        this.setfreshShop();
    }
    setfreshShop() {
        var isFresh = ShopModel_1.default.instance.getIsExpire();
        if (isFresh) {
            if (!this.isSendServer) {
                var shop = ShopFunc_1.default.instance.getShopList();
                var randomId = GameUtils_1.default.getWeightItem(shop)[0];
                this.isSendServer = true;
                ShopServer_1.default.updateShopGoods({ shopId: randomId }, this.freshShopInfo, this);
            }
        }
        else {
            this.freshShopInfo();
        }
    }
    setTitle() {
        TimerManager_1.default.instance.removeByObject(this);
        TimerManager_1.default.instance.add(this.freshTxt, this, 1000);
        this.freshTxt();
    }
    freshTxt() {
        /**获取是否过期 */
        var clientTime = Client_1.default.instance.serverTime;
        var expireTime = ShopModel_1.default.instance.getExpireTime();
        var offest = expireTime - clientTime;
        this.leftTxt.changeText(GameUtils_1.default.convertTime(offest));
        if (offest < 0) {
            this.setfreshShop();
            TimerManager_1.default.instance.removeByObject(this);
        }
    }
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + roleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = 1 * BattleFunc_1.default.defaultScale;
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, 1, 2, scaleRoleInfo, true, false, "MainShopUI");
        }
        else {
            this.roleAnim = cacheItem;
        }
        this.aniGroup.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
    }
    freshShopInfo() {
        this.freshShopGroup.removeChildren();
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.MainShopItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.addShopItem));
        this.setTitle();
    }
    addShopItem() {
        var list = ShopModel_1.default.instance.getShopList();
        var length = Object.keys(list).length;
        for (var i = 0; i < length; i++) {
            var item = new MainShopItemUI_1.default(i + 1, list[i + 1], this);
            var x = item.itemWeight * (i % 3);
            var y = item.itemHeight * Math.floor(i / 3);
            item.x = x;
            item.y = y;
            this.freshShopGroup.addChild(item);
            this.itemArr.push(item);
        }
        var allHeight = Math.ceil(length / 3) * 260;
        this.freshShopGroup.height = allHeight;
        this.setEquipGroup();
    }
    //装备碎片
    setEquipGroup() {
        if (!this.equipGroup) {
            var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.EquipPieceGetUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.equipGroup = WindowManager_1.default.getUIClass(WindowCfgs_1.WindowCfgs.EquipPieceGetUI);
                this.ctn.addChild(this.equipGroup);
                this.equipGroup.y = this.freshShopGroup.y + this.freshShopGroup.height;
                this.equipGroup.setData(this);
            }));
        }
        else {
            this.equipGroup.y = this.freshShopGroup.y + this.freshShopGroup.height;
            this.equipGroup.setData(this);
        }
    }
    /**点击刷新 */
    onClickFresh() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_SHOPREFRESH_CLICK);
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_SHOP_BUY, ShareOrTvManager_1.default.TYPE_ADV, { id: 1, extraData: {} }, this.succCall, null, this);
    }
    succCall() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_SHOPREFRESH_FINISH);
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_SHOPFRESH_FINISH);
        }
        var shop = ShopFunc_1.default.instance.getShopList();
        var randomId = GameUtils_1.default.getWeightItem(shop)[0];
        ShopServer_1.default.updateShopGoods({ shopId: randomId }, this.freshShopInfo, this);
    }
    freshAllItem() {
        for (var i = 0; i < this.itemArr.length; i++) {
            var item = this.itemArr[i];
            item.freshCount();
        }
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.MainShopUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = MainShopUI;
//# sourceMappingURL=MainShopUI.js.map