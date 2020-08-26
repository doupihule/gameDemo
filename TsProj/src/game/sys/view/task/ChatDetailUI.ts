import IMessage from "../../interfaces/IMessage";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import TaskChatFunc from "../../func/TaskChatFunc";
import TaskUI from "./TaskUI";
import TaskModel from "../../model/TaskModel";
import TaskConditionTrigger from "../../trigger/TaskConditionTrigger";
import TaskConst from "../../consts/TaskConst";
import FogFunc from "../../func/FogFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import ChatTaskUI from "./ChatTaskUI";
import ChatDialogUI from "./ChatDialogUI";


export default class ChatDetailUI extends ui.gameui.task.ChatDetailUI implements IMessage {


	private cfgData;
	private taskUI: TaskUI;
	private chatUI: ChatTaskUI;
	private dialog: ChatDialogUI;

	constructor() {
		super();
		this.addEvent();
		new ButtonUtils(this.goOnBtn, this.onClickGo, this);
		new ButtonUtils(this.receiveBtn, this.onClickReceive, this);
		new ButtonUtils(this.closeBtn, this.onClickClose, this);

	}

	/**添加事件监听 */
	addEvent() {
	}

	public setData(data): void {
		this.cfgData = data.cfg;
		this.taskUI = data.task;
		this.chatUI = data.chat;
		this.dialog = data.dialog
		var roleChatData = TaskChatFunc.instance.getCfgDatas("TaskRole", this.cfgData.role)
		var name = TranslateFunc.instance.getTranslate(roleChatData.name)
		this.titleTxt.text = TranslateFunc.instance.getTranslate("#tid_task_chat_title", null, name);
		var info = TaskConditionTrigger.checkTaskCondition(this.cfgData);
		this.nameTxt.text = TranslateFunc.instance.getTranslate(this.cfgData.name);
		if (!info.noProcess) {
			this.nameTxt.text += "(" + info.cur + "/" + info.target + ")"
		} else {
			if (info.finish) {
				this.nameTxt.text += "(1/1)"

			} else {
				this.nameTxt.text += "(0/1)"
			}
		}
		this.descTxt.text = TranslateFunc.instance.getTranslate(this.cfgData.desc);

		var width = info.cur * this.processDi.width / info.target;
		this.processImg.width = width > this.processDi.width ? this.processDi.width : width;

		this.rewardGroup1.visible = false;
		this.rewardGroup2.visible = false;

		var reward = this.cfgData.reward;
		if (reward[0]) {
			this.rewardGroup1.visible = true;
			var result = FogFunc.instance.getResourceShowInfo(reward[0])
			this.rewardImg1.skin = result.icon;
			this.rewardTxt1.text = result.num;
		}
		if (reward[1]) {
			this.rewardGroup2.visible = true;
			var result = FogFunc.instance.getResourceShowInfo(reward[1])
			this.rewardImg2.skin = result.icon;
			this.rewardTxt2.text = result.num + "";
		}
		if (reward.length == 1) {
			this.rewardGroup1.x = 71
		} else {
			this.rewardGroup1.x = -3
		}
		this.receiveBtn.visible = false;
		this.goOnBtn.visible = false;
		this.hasReceiveTxt.visible = false;
		var type = TaskModel.instance.getChatTaskStateById(this.cfgData);
		if (type == TaskConst.Chat_state_canReceive) {
			this.receiveBtn.visible = true;
		} else if (type == TaskConst.Chat_state_finish) {
			this.hasReceiveTxt.visible = true;
		} else if (type == TaskConst.Chat_state_noFinish) {
			this.goOnBtn.visible = true;
		}
	}

	onClickGo() {
		this.onClickClose();
		this.dialog && this.dialog.onClickClose();
		this.taskUI.onClickGo(this.cfgData);
	}

	onClickReceive() {
		this.onClickClose();
		this.dialog && this.dialog.onClickClose();
		this.chatUI.onClickReceive([this.cfgData]);
	}

	onClickClose() {
		WindowManager.CloseUI(WindowCfgs.ChatDetailUI)
	}

	recvMsg(cmd: string, data: any): void {


	}

	close() {

	}
}


