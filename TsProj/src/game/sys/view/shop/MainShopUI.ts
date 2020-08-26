import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import EquipPieceGetUI from "./EquipPieceGetUI";
import ShopModel from "../../model/ShopModel";
import ShopServer from "../../server/ShopServer";
import ShopFunc from "../../func/ShopFunc";
import GameUtils from "../../../../utils/GameUtils";
import MainShopItemUI from "./MainShopItemUI";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import BattleFunc from "../../func/BattleFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import Client from "../../../../framework/common/kakura/Client";
import StatisticsManager from "../../manager/StatisticsManager";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";


export default class MainShopUI extends ui.gameui.shop.MainShopUI implements IMessage {

    private equipGroup: EquipPieceGetUI;
    private roleAnim;
    private isSendServer = false;
    private freeType;
    private itemArr = [];
    constructor() {
        super();
        this.initBtn();
        this.addEvent();
        this.ctn.vScrollBarSkin = ""
    }
    addEvent() {

    }
    initBtn() {
        new ButtonUtils(this.exitBtn, this.close, this);
        new ButtonUtils(this.freshBtn, this.onClickFresh, this);


    }
    public setData(data) {
        this.isSendServer = false;
        this.itemArr = [];
        StatisticsManager.ins.onEvent(StatisticsManager.PIECE_OPEN)
        StatisticsManager.ins.onEvent(StatisticsManager.SHOP_OPEN)
        this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_SHOP_REFRESH);
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_SHOPREFRESH_SHOW)
        }
        if (this.freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
            this.freeImg.skin = ShareOrTvManager.instance.getFreeImgSkin(this.freeType)
        }
        this.showRoleAni("1011");
        this.setfreshShop()
    }
    setfreshShop() {
        var isFresh = ShopModel.instance.getIsExpire();
        if (isFresh) {
            if (!this.isSendServer) {
                var shop = ShopFunc.instance.getShopList();
                var randomId = GameUtils.getWeightItem(shop)[0];
                this.isSendServer = true;
                ShopServer.updateShopGoods({ shopId: randomId }, this.freshShopInfo, this);
            }
        } else {
            this.freshShopInfo()
        }
    }
    setTitle() {
        TimerManager.instance.removeByObject(this);
        TimerManager.instance.add(this.freshTxt, this, 1000);
        this.freshTxt();
    }
    freshTxt() {
        /**获取是否过期 */
        var clientTime = Client.instance.serverTime;
        var expireTime = ShopModel.instance.getExpireTime();
        var offest = expireTime - clientTime;
        this.leftTxt.changeText(GameUtils.convertTime(offest))
        if (offest < 0) {
            this.setfreshShop();
            TimerManager.instance.removeByObject(this);
        }

    }
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools.cacheItem(PoolCode.POOL_ROLE + roleId, this.roleAnim);
        }
        var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = 1 * BattleFunc.defaultScale;
            this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, 1, 2, scaleRoleInfo, true, false, "MainShopUI");
        } else {
            this.roleAnim = cacheItem;
        }

        this.aniGroup.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
    }
    freshShopInfo() {
        this.freshShopGroup.removeChildren();
        var res = WindowManager.getUILoadGroup(WindowCfgs.MainShopItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager.instance.load(resAll, Laya.Handler.create(this, this.addShopItem));
        this.setTitle()
    }
    addShopItem() {
        var list = ShopModel.instance.getShopList();
        var length = Object.keys(list).length;
        for (var i = 0; i < length; i++) {
            var item: MainShopItemUI = new MainShopItemUI(i + 1, list[i + 1],this);
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
            var res = WindowManager.getUILoadGroup(WindowCfgs.EquipPieceGetUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.equipGroup = WindowManager.getUIClass(WindowCfgs.EquipPieceGetUI);
                this.ctn.addChild(this.equipGroup);
                this.equipGroup.y = this.freshShopGroup.y + this.freshShopGroup.height;
                this.equipGroup.setData(this);
            }));
        } else {
            this.equipGroup.y = this.freshShopGroup.y + this.freshShopGroup.height;
            this.equipGroup.setData(this);
        }
    }
    /**点击刷新 */
    onClickFresh() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_SHOPREFRESH_CLICK)

        }
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_SHOP_BUY, ShareOrTvManager.TYPE_ADV, { id: 1, extraData: {} }, this.succCall, null, this)

    }
    succCall() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_SHOPREFRESH_FINISH)

        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_SHOPFRESH_FINISH)

        }
        var shop = ShopFunc.instance.getShopList();
        var randomId = GameUtils.getWeightItem(shop)[0];
        ShopServer.updateShopGoods({ shopId: randomId }, this.freshShopInfo, this);
    }

    public freshAllItem(){
        for(var i=0;i<this.itemArr.length;i++){
            var item=this.itemArr[i];
            item.freshCount();
        }
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.MainShopUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {


        }
    }
}