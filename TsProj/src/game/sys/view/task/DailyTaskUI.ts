import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import TaskUI from "./TaskUI";
import TaskModel from "../../model/TaskModel";
import UserModel from "../../model/UserModel";
import TaskConditionTrigger from "../../trigger/TaskConditionTrigger";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogFunc from "../../func/FogFunc";
import {DataResourceType} from "../../func/DataResourceFunc";
import TaskFunc from "../../func/TaskFunc";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import Message from "../../../../framework/common/Message";
import TaskEvent from "../../event/TaskEvent";
import TweenAniManager from "../../manager/TweenAniManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import TaskServer from "../../server/TaskServer";
import ChapterConst from "../../consts/ChapterConst";
import StatisticsManager from "../../manager/StatisticsManager";


export default class DailyTaskUI extends ui.gameui.task.DailyTaskUI implements IMessage {

	private task: TaskUI;
	private allInfo: any[];
	private listData: any[];
	private boxData: any;
	private timeCode = 0;
	private stateTab = {};

	constructor(task) {
		super();
		this.addEvent();
		this.task = task;
		this.allInfo = this.task.dailyTaskArr;
		this.boxData = TaskFunc.instance.getAllCfgData("TaskBox");
		for (var id in this.boxData) {
			var info = this.boxData[id];
			new ButtonUtils(this["taskBox" + id], this.onClickBox, this, null, null, [info])
		}
		this.m_list.height += ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth

	}

	/**添加事件监听 */
	addEvent() {
		Message.instance.add(TaskEvent.TASK_EVENT_FRESHTASKBOX, this);
	}

	public setData(data): void {
		StatisticsManager.ins.onEvent(StatisticsManager.TASKDAILY_OPEN)
		this.initData();
		this.initList();
		this.initBox();
	}

	initData() {
		this.listData = [];
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
				var isReceive = TaskModel.instance.getTaskInfoById(item.id);
				isReceive = isReceive ? 1 : 0;
				var finish = 0;
				if (!isReceive) {
					var process = TaskConditionTrigger.checkTaskCondition(item);
					finish = process.finish;
					item.state = process
				}
				item.isReceive = isReceive;
				item.finish = finish;
				this.listData.push(item)
			}
		}
		//排序：已完成可领取>未完成>已领取
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

	//活跃度宝箱
	initBox() {
		var point = TaskModel.instance.getTaskPoint();
		this.pointTxt.text = point + "";
		var width = point * this.pro_boxDi.width / 100
		this.pro_boxImg.width = width > this.pro_boxDi.width ? this.pro_boxDi.width : width;
		for (var id in this.boxData) {
			var info = this.boxData[id];
			this["taskBox" + id].x = info.points * this.pro_boxDi.width / 100;
			var isReceive = TaskModel.instance.getIsReceiveBox(id);
			this.stateTab[id] = ChapterConst.Chapter_boxState_lock;
			Laya.Tween.clearAll(this["img_box" + id]);
			if (isReceive) {
				this["img_box" + id].skin = "uisource/task/task/task_icon_baoxiang" + id + "_2.png";
				this.stateTab[id] = ChapterConst.Chapter_boxState_receive;
			} else {
				this["img_box" + id].skin = "uisource/task/task/task_icon_baoxiang" + id + "_1.png";
				if (info.points <= point) {
					TweenAniManager.instance.scaleQipaoAni(this["img_box" + id], 1.2, null, null);
					this.stateTab[id] = ChapterConst.Chapter_boxState_unlock;
				}
			}
			this["lbl_point" + id].text = info.points + ""
		}
	}

	private onListRender(cell: Laya.Box, index: number): void {
		var data = this.m_list.array[index];
		var lbl_title = cell.getChildByName("lbl_title") as Laya.Label;
		var lbl_progress = cell.getChildByName("lbl_progress") as Laya.Label;
		var lbl_receive = cell.getChildByName("lbl_receive") as Laya.Label;
		var lbl_desc = cell.getChildByName("lbl_desc") as Laya.Label;
		var reward1 = cell.getChildByName("reward1") as Laya.Image;
		var reward2 = cell.getChildByName("reward2") as Laya.Image;
		var btn_receive = cell.getChildByName("btn_receive") as Laya.Image;
		var img_icon1 = reward1.getChildByName("img_icon1") as Laya.Image;
		var lbl_num1 = reward1.getChildByName("lbl_num1") as Laya.Label;
		var img_icon2 = reward2.getChildByName("img_icon2") as Laya.Image;
		var lbl_num2 = reward2.getChildByName("lbl_num2") as Laya.Label;
		var btn_goOn = cell.getChildByName("btn_goOn") as Laya.Image;
		var receive = data.isReceive;
		btn_receive.visible = false;
		btn_goOn.visible = false;
		lbl_receive.visible = false;
		if (receive) {
			lbl_receive.visible = true;
			lbl_progress.visible = false;
		} else {
			//没领取看下是否完成
			if (data.finish) {
				btn_receive.visible = true;
			} else {
				btn_goOn.visible = true;
			}
			lbl_progress.visible = true;
			lbl_progress.text = data.state.cur + "/" + data.state.target
		}
		lbl_title.text = TranslateFunc.instance.getTranslate(data.name);
		lbl_desc.text = TranslateFunc.instance.getTranslate(data.desc);
		img_icon1.scale(1, 1)
		img_icon2.scale(1, 1)
		reward1.visible = false;
		reward2.visible = false;

		var reward = data.reward;
		if (reward[0]) {
			reward1.visible = true;
			var result = FogFunc.instance.getResourceShowInfo(reward[0])
			img_icon1.skin = result.icon;
			lbl_num1.text = result.num;
			if (Number(reward[0][0]) == DataResourceType.TASKPOINT) {
				img_icon1.scale(0.6, 0.6)
			}
		}
		if (reward[1]) {
			reward2.visible = true;
			var result = FogFunc.instance.getResourceShowInfo(reward[1])
			img_icon2.skin = result.icon;
			lbl_num2.text = result.num + "";
			if (Number(reward[1][0]) == DataResourceType.TASKPOINT) {
				img_icon1.scale(0.6, 0.6)
			}
		}
		new ButtonUtils(btn_goOn, this.onClickGo, this, null, null, [data])
		new ButtonUtils(btn_receive, this.onClickReceive, this, null, null, [data])
	}

	//点击前往
	onClickGo(data) {
		this.task.onClickGo(data[0]);
	}

	//点击领取
	onClickReceive(data) {
		var info = {
			data: data[0],
			callBack: this.freshData,
			thisObj: this
		}
		this.task.onClickReceive(info);
	}

	sortTask(a, b) {
		var big = a.isReceive - b.isReceive;
		if (big == 0) {
			big = b.finish - a.finish;
		}
		if (big == 0) {
			big = a.id - b.id;
		}
		return big;
	}

	onClickBox(data) {
		var info = data[0];
		var desc = TranslateFunc.instance.getTranslate("#tid_taskBox_point", null, info.points)
		WindowManager.OpenUI(WindowCfgs.ChapterBoxRewardUI, {
			shareName: ShareTvOrderFunc.SHARELINE_TASK_POINTREWARD,
			doubleRate: TaskFunc.taskBoxDouble,
			type: this.stateTab[info.id],
			desc: desc,
			reward: info.reward,
			thisObj: this,
			callBack: this.receiveReward.bind(this, info.id),
			params: {boxId: info.id}
		})

	}

	receiveReward(id) {
		TaskServer.updateTaskBox({id: id}, this.initBox, this)
	}

	recvMsg(cmd: string, data: any): void {
		if (cmd == TaskEvent.TASK_EVENT_FRESHTASKBOX) {
			this.initBox();
			this.task && this.task.freshDailyRed();
		}

	}

	close() {
		Laya.Tween.clearAll(this.img_box1);
		Laya.Tween.clearAll(this.img_box2);
		Laya.Tween.clearAll(this.img_box3);
	}
}


