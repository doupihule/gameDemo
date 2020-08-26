import IMessage from "../../interfaces/IMessage";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import UserModel from "../../model/UserModel";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import BattleFunc from "../../func/BattleFunc";
import TaskChatFunc from "../../func/TaskChatFunc";
import TaskFunc from "../../func/TaskFunc";
import TaskUI from "./TaskUI";
import TaskModel from "../../model/TaskModel";
import TaskConditionTrigger from "../../trigger/TaskConditionTrigger";
import TaskConst from "../../consts/TaskConst";
import ChatInfoModel from "../../model/ChatInfoModel";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";


export default class ChatTaskUI extends ui.gameui.task.ChatTaskUI implements IMessage {

	private task: TaskUI;
	private allInfo: any[];
	private listData: any[];
	private boxData: any;
	private timeCode = 0;
	private stateTab = {};
	public roleArr = [];

	constructor(task) {
		super();
		this.addEvent();
		this.task = task;
		this.allInfo = this.task.chatTaskArr;
		this.m_list.height += ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth

	}

	/**添加事件监听 */
	addEvent() {
	}

	public setData(data): void {
		this.initData();
		this.initList();
	}

	initData() {
		this.listData = [];
		this.roleArr = [];
		var level = UserModel.instance.getMaxBattleLevel();
		for (var i = 0; i < this.allInfo.length; i++) {
			var item = this.allInfo[i]
			var condition = item.condition;
			var unlock = false;
			if (condition) {
				if (TaskModel.instance.getTaskIsUnlock(condition, level)) {
					unlock = true;
				}
			} else {
				unlock = true;
			}
			if (unlock) {
				if (this.roleArr.indexOf(item.role) == -1) {
					var state = TaskModel.instance.getChatTaskStateById(item);
					if (state) {
						item.state = state
						this.listData.push(item)
						this.roleArr.push(item.role)
					}
				}

			}
		}
		//排序
		this.listData.sort(this.sortTask)
	}

	//任务列表
	initList() {
		this.m_list.array = this.listData;
		this.m_list.renderHandler = new Laya.Handler(this, this.onListRender)
		this.m_list.scrollTo(0)
	}

	freshData() {
		this.initData();
		this.initList();
	}

	private onListRender(cell: Laya.Box, index: number): void {
		var data = this.m_list.array[index];
		var bgImg = cell.getChildByName("bgImg") as Laya.Image;

		var lbl_title = bgImg.getChildByName("lbl_title") as Laya.Label;
		var lbl_receive = bgImg.getChildByName("lbl_receive") as Laya.Label;
		var lbl_desc = bgImg.getChildByName("lbl_desc") as Laya.Label;
		var lbl_noread = bgImg.getChildByName("lbl_noread") as Laya.Label;
		var lbl_read = bgImg.getChildByName("lbl_read") as Laya.Label;
		var btn_receive = cell.getChildByName("btn_receive") as Laya.Image;
		var btn_goOn = cell.getChildByName("btn_goOn") as Laya.Image;
		var roleSpine = bgImg.getChildByName("roleSpine") as Laya.Image;
		var roleChatData = TaskChatFunc.instance.getCfgDatas("TaskRole", data.role)
		btn_receive.visible = false;
		btn_goOn.visible = false;
		lbl_receive.visible = false;
		lbl_noread.visible = false;
		lbl_read.visible = false;
		if (roleSpine.numChildren > 0) {
			var item = roleSpine.getChildAt(0);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + "_" + roleSpine["roleId"], item);
			roleSpine.removeChildren();
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + "_" + data.role);
		var scale = TaskFunc.roleSizeInTask || 1.5;
		var showScale = scale * BattleFunc.defaultScale * (roleChatData.size / 10000);
		if (!cacheItem) {
			cacheItem = new BattleRoleView(roleChatData.spine, showScale, 0, "ChatTaskUI");
		} else {
			cacheItem.setItemViewScale(showScale);
		}
		cacheItem.play("idle", true)
		roleSpine.addChild(cacheItem)
		roleSpine["roleId"] = data.role;
		var state = data.state;
		if (state == TaskConst.Chat_state_noRead) {
			lbl_noread.visible = true;
		} else if (state == TaskConst.Chat_state_read) {
			lbl_read.visible = true;
		} else if (state == TaskConst.Chat_state_canReceive) {
			btn_receive.visible = true;
		} else if (state == TaskConst.Chat_state_finish) {
			lbl_receive.visible = true;
		} else if (state == TaskConst.Chat_state_noFinish) {
			btn_goOn.visible = true;
		}
		var name = TranslateFunc.instance.getTranslate(roleChatData.name)
		if (state == TaskConst.Chat_state_noRead || state == TaskConst.Chat_state_read) {
			lbl_title.text = name;
			lbl_desc.text = ChatInfoModel.instance.getDialogById(data);
		} else {
			var info = TaskConditionTrigger.checkTaskCondition(data);
			lbl_title.text = TranslateFunc.instance.getTranslate("#tid_task_chat_title", null, name);
			lbl_desc.text = TranslateFunc.instance.getTranslate(data.name);
			if (!info.noProcess) {
				lbl_desc.text += "(" + info.cur + "/" + info.target + ")"
			} else {
				if (info.finish) {
					lbl_desc.text += "(1/1)"

				} else {
					lbl_desc.text += "(0/1)"
				}
			}
		}

		new ButtonUtils(bgImg, this.onClickItem, this, null, null, [data])
		new ButtonUtils(btn_goOn, this.onClickGo, this, null, null, [data])
		new ButtonUtils(btn_receive, this.onClickReceive, this, null, null, [data])
	}

	onClickGo(data) {
		this.task.onClickGo(data[0]);
	}

	onClickReceive(data) {
		var info = {
			data: data[0],
			callBack: this.freshData,
			thisObj: this
		}
		this.task.onClickReceive(info);
	}

	onClickItem(data) {
		data = data[0]
		if (data.state == TaskConst.Chat_state_noRead || data.state == TaskConst.Chat_state_read) {
			WindowManager.OpenUI(WindowCfgs.ChatDialoglUI, {cfg: data, task: this.task, chat: this})

		} else {
			WindowManager.OpenUI(WindowCfgs.ChatDetailUI, {cfg: data, task: this.task, chat: this})
		}
	}

	sortTask(a, b) {
		var big = a.state - b.state;
		if (big == 0) {
			big = a.id - b.id;
		}
		return big;
	}

	recvMsg(cmd: string, data: any): void {


	}

	close() {

	}
}


