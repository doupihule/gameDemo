import IMessage from "../../game/sys/interfaces/IMessage";
import UserInfo from "../common/UserInfo";
import Message from "../common/Message";
import WindowManager from "../manager/WindowManager";
import TranslateFunc from "../func/TranslateFunc";
import TimerManager from "../manager/TimerManager";
import StringUtils from "./StringUtils";
import NativeToJSEvent from "../event/NativeToJSEvent";
import ChargeServer from "../server/ChargeServer";
import DataResourceFunc from "../../game/sys/func/DataResourceFunc";

export default class ChargeUtils implements IMessage {

	static _ins;
	private inCharge = false;

	constructor() {

	}


	static get ins(): ChargeUtils {
		if (!this._ins) {
			this._ins = new ChargeUtils();
		}
		return this._ins;
	}

	inAppPurchase(productId) {
		if (!this.inCharge) {
			this.inCharge = true;
			Message.instance.add(NativeToJSEvent.NATIVE_INAPP_PURCHASE_BACK, this);
			UserInfo.platform.inAppPurchase(productId, 1, "order_id", "callback_uri");
		}
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {
			case NativeToJSEvent.NATIVE_INAPP_PURCHASE_BACK:
				this.purchaseBack(data);
				break;
		}
	}

	purchaseBack(data) {
		switch (data.status) {
			case 1:
				this.purchaseSuccess(data.data);
				break;
			case 2:
				break;
			case 3:
				this.purchaseFail();
				break;
		}

		this.inCharge = false;
		Message.instance.remove(NativeToJSEvent.NATIVE_INAPP_PURCHASE_BACK, this);
	}

	purchaseSuccess(data) {
		var reward = [];//TODO改为读表
		switch (data.id) {
			case "qhmx.mergewar.game_gold_test_1":
				reward = ["3,1000"];
				break;
		}
		ChargeServer.getChargeReward(reward, () => {
			for (var index = 0; index < reward.length; index++) {
				var dataArr = reward[index].split(",");
				var type = dataArr[0];
				var num = DataResourceFunc.instance.getDataResourceInfo(dataArr)["num"];
				TimerManager.instance.setTimeout((num, type) => {
					var text = "";
					switch (Number(type)) {
						case 2:
							text = TranslateFunc.instance.getTranslate("#tid_tip_getCoin", "localTranslate", StringUtils.getCoinStr(num));
							break;
						case 3:
							text = TranslateFunc.instance.getTranslate("#tid_tip_getGold", "localTranslate", StringUtils.getCoinStr(num));
							break;
					}
					if (text != "") {
						WindowManager.ShowTip(text);
					}
				}, this, index * 1000, num, type);
			}
		}, this);
	}


	purchaseFail() {
		WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_purchaseFail"));
	}
}