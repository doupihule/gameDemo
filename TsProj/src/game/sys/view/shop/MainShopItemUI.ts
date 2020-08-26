import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import UserModel from "../../model/UserModel";
import ShopModel from "../../model/ShopModel";
import ShopServer from "../../server/ShopServer";
import FogFunc from "../../func/FogFunc";
import {DataResourceType} from "../../func/DataResourceFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import StatisticsManager from "../../manager/StatisticsManager";
import MainShopUI from "./MainShopUI";


export default class MainShopItemUI extends ui.gameui.shop.MainShopItemUI implements IMessage {

	public itemWeight = 178;
	public itemHeight = 260;
	private index: number;
	private info: SCShopList;
	private cfg;
	private freeType;
	private shop: MainShopUI

	constructor(index, info, shop) {
		super();
		this.index = index;
		this.info = info;
		this.shop = shop
		this.initBtn()
		this.setData()
	}

	addEvent() {

	}

	initBtn() {
		new ButtonUtils(this.goldCostBtn, this.onClickBuy, this);
		new ButtonUtils(this.coinBtn, this.onClickBuy, this);
		new ButtonUtils(this.videoGetBtn, this.onClickVideo, this);
		this.bgImg.on(Laya.Event.MOUSE_UP, this, this.onClickItem);
	}

	public setData() {
		var goodInfo = FogFunc.instance.getGoodsInfo(this.info.id);
		this.cfg = goodInfo;
		var content = goodInfo.content[0].split(",");
		var result = FogFunc.instance.getResourceShowInfo(content);
		var itemName = result.name;
		var itemIcon = result.icon;
		var iconNum = result.num;

		//如果是碎片，显示
		if (Number(content[0]) == DataResourceType.PIECE) {
			this.smallImg.visible = true
		} else {
			this.smallImg.visible = false
		}

		//icon
		this.itemImg.skin = itemIcon;

		//数量
		this.itemNum.text = StringUtils.getCoinStr(iconNum);
		//name
		this.goodNameTxt.text = itemName;
		this.discountTxt.text = TranslateFunc.instance.getTranslate(goodInfo.discount);
		this.freshCount();
	}

	public freshCount() {
		var times = this.cfg.times;
		var type = this.cfg.priceType;
		var price = Number(this.cfg.price);
		var count = ShopModel.instance.getGoodsCountByIndex(this.index)
		this.leftGrouup.visible = true;
		if (count >= times) {
			this.bgImg.gray = true;
			this.noCountTxt.visible = true;
			this.videoGetBtn.visible = false;
			this.coinBtn.visible = false;
			this.goldCostBtn.visible = false;
			this.leftGrouup.visible = false;
		} else {
			this.noCountTxt.visible = false;
			this.bgImg.gray = false;
			if (!type) {
				this.videoGetBtn.visible = true;
				this.coinBtn.visible = false;
				this.goldCostBtn.visible = false;
				this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_SHOP_BUY);
				if (this.freeType == ShareOrTvManager.TYPE_ADV) {
					StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_SHOPVIDEOBUY_SHOW, {goodsId: this.cfg.goodsId})
				}
				if (this.freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
					this.freeImg.skin = ShareOrTvManager.instance.getFreeImgSkin(this.freeType);
				}
			} else {
				this.videoGetBtn.visible = false;
				this.coinBtn.visible = false;
				this.goldCostBtn.visible = false;
				if (type == DataResourceType.COIN) {
					this.coinBtn.visible = true;
					this.coinTxt.text = StringUtils.getCoinStr(price + "")
				} else {
					this.goldCostBtn.visible = true;
					this.goldTxt.text = StringUtils.getCoinStr(price + "")
				}
			}
		}
		this.leftCountTxt.text = (times - count) + "/" + times;
	}

	onClickVideo() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_SHOPVIDEOBUY_CLICK, {goodsId: this.cfg.goodsId})
		}
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_SHOP_BUY, ShareOrTvManager.TYPE_ADV, {
			id: 1,
			extraData: {}
		}, this.succCall, null, this)
	}

	succCall() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_SHOPVIDEOBUY_FINISH, {goodsId: this.cfg.goodsId})
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_SHOPVIDEOBUY_FINISH, {goodsId: this.cfg.goodsId})
		}
		//购买
		var data = {
			reward: this.cfg.content,
			index: this.index,
			id: this.info.id
		}
		ShopServer.buyGoods(data, this.buySuccCall, this)
	}

	onClickBuy() {
		var type = this.cfg.priceType;
		var price = Number(this.cfg.price);

		switch (Number(type)) {
			case DataResourceType.GOLD:
				var gold = UserModel.instance.getGold();
				if (Number(price) > Number(gold)) {
					WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughgold"));
					return;
				}
				break;
			case DataResourceType.COIN:
				if (BigNumUtils.compare(Number(price), UserModel.instance.getCoin())) {
					WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcoin"));
					return;
				}
				break;
		}
		//购买
		var data = {
			reward: this.cfg.content,
			cost: [type, price],
			index: this.index,
			id: this.info.id
		}
		ShopServer.buyGoods(data, this.buySuccCall, this)
	}

	buySuccCall() {
		StatisticsManager.ins.onEvent(StatisticsManager.SHOP_BUY, {goodsId: this.cfg.goodsId})
		WindowManager.OpenUI(WindowCfgs.FogComRewardUI, {reward: this.cfg.content});
		this.shop.freshAllItem();
	}

	onClickItem() {
		WindowManager.OpenUI(WindowCfgs.FogShopItemDetailUI, {"goods": this.info.id});

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {


		}
	}
}