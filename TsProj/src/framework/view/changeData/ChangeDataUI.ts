import {ui} from "../../../ui/layaMaxUI";
import UserModel from "../../../game/sys/model/UserModel";
import {ButtonUtils} from "../../utils/ButtonUtils";
import WindowManager from "../../manager/WindowManager";
import WindowCommonCfgs from "../../consts/WindowCommonCfgs";
import TableUtils from "../../utils/TableUtils";
import Client from "../../common/kakura/Client";
import SingleCommonServer from "../../server/SingleCommonServer";

export default class ChangeDataUI extends ui.gameui.changeData.ChangeDataUI {

	private firstData;

	constructor() {
		super();
		new ButtonUtils(this.returnBtn, this.close, this)
		new ButtonUtils(this.sureBtn, this.onClickSure, this)

	}

	public setData(data): void {
		this.tipTxt.text = ""
		this.firstData = UserModel.instance.getData();
		var datas = TableUtils.safelyJsonStringfy(this.firstData);
		this.dataTxt.text = ChangeDataUI.stringToJSON(datas)
	}

	public close() {
		WindowManager.CloseUI(WindowCommonCfgs.ChangeDataView);
	}

	onClickSure() {
		var data;
		try {
			data = JSON.parse(this.dataTxt.text)
		} catch (error) {
			this.tipTxt.text = "json数据结构错误" + JSON.stringify(error);
			return;
		}
		var uData = {};
		TableUtils.compareTable(this.firstData, data, uData);
		var deData = {};
		TableUtils.getDelData(this.firstData, data, deData);
		var backData = Client.instance.doDummyServerBack(null, uData, deData);
		SingleCommonServer.startSaveClientData();
		this.firstData = UserModel.instance.getData();
		this.tipTxt.text = "数据修改成功";

	}

	public static stringToJSON(strJson) {
		// 计数tab的个数
		var tabNum = 0;

		var length = strJson.length;
		var result = ""
		var last = "";
		for (var i = 0; i < length; i++) {
			var c = strJson[i];
			if (c == '{') {
				tabNum++;
				result += c + "\n";
				result += this.getSpaceOrTab(tabNum);
			} else if (c == '}') {
				tabNum--;
				result += "\n";
				result += this.getSpaceOrTab(tabNum);
				result += c;
			} else if (c == ',') {
				result += c + "\n";
				result += this.getSpaceOrTab(tabNum);
			} else if (c == ':') {
				result += c + " ";
			} else if (c == '[') {
				tabNum++;
				var next = strJson[i + 1];
				if (next == ']') {
					result += c;
				} else {
					result += c + "\n";
					result += this.getSpaceOrTab(tabNum);
				}
			} else if (c == ']') {
				tabNum--;
				if (last == '[') {
					result += c
				} else {
					result += "\n" + this.getSpaceOrTab(tabNum) + c;
				}
			} else {
				result += c
			}
			last = c;
		}
		return result;
	}

	private static getSpaceOrTab(tabNum) {
		var str = ""
		for (var i = 0; i < tabNum; i++) {
			str += '\t';
		}
		return str;
	}


}