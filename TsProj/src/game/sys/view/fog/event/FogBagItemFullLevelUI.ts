import {ui} from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../../framework/utils/ButtonUtils";
import FogFunc from "../../../func/FogFunc";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import FogServer from "../../../server/FogServer";
import {DataResourceType} from "../../../func/DataResourceFunc";


export default class FogBagItemFullLevelUI extends ui.gameui.fog.FogBagItemFullLevelUI implements IMessage {

	private itemArr;//奖励数组
	private itemIds;//道具id数组
	private exchangeCompNum;//道具满级能折算的全部零件
	private callBack;
	private thisObj;

	constructor() {
		super();
		new ButtonUtils(this.closeBtn, this.close, this);
		new ButtonUtils(this.receiveBtn, this.onClickReceive, this);
	}

	//道具满级传参：
	public setData(data) {
		this.itemArr = [];
		this.itemIds = [];
		this.exchangeCompNum = 0;
		this.callBack = data && data.callBack;
		this.thisObj = data && data.thisObj;


		//道具满级折算零件需要传入的参数：item(满级的道具id数组)["1001", "1002"]，viewType
		this.itemIds = data.item;
		for (var i = 0; i < this.itemIds.length; i++) {
			this.itemArr.push([DataResourceType.FOGITEM, this.itemIds[i]]);
		}

		//标题
		this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_fogitem_full_level");


		//能折算出的零件总数
		this.exchangeCompNum = FogFunc.instance.getExchangeCompByItem(this.itemIds);
		this.lbl_desc.text = TranslateFunc.instance.getTranslate("#tid_fog_item_fulllevel_exchange") + this.exchangeCompNum;

		//奖励列表初始化
		this.initReward();
	}

	initReward() {
		this.itemList.repeatX = this.itemArr.length;
		this.itemList.array = this.itemArr;
		this.itemList.renderHandler = new Laya.Handler(this, this.onListRender);
		this.itemList.scrollTo(0);
	}

	onListRender(cell: Laya.Box, index: number) {
		var data = this.itemList.array[index];
		var itemIcon = cell.getChildByName("item").getChildByName("itemIcon") as Laya.Image;

		var result = FogFunc.instance.getResourceShowInfo(data);
		itemIcon.skin = result["icon"];
		itemIcon.scale(result["scale"], result["scale"]);
	}

	onClickReceive() {
		//道具满级兑换
		FogServer.exchangeComp({"reward": this.exchangeCompNum, "item": this.itemIds}, this.close, this);
		//保存FogReward数据
		FogServer.saveFogReward({"reward": [[DataResourceType.COMP, this.exchangeCompNum]]});
		//飘奖励
		FogFunc.instance.flyResTween([[DataResourceType.COMP, this.exchangeCompNum]], null);
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogBagItemFullLevelUI);
		this.callBack && this.callBack.call(this.thisObj)
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}