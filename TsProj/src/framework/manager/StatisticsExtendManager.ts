import UserInfo from "../common/UserInfo";
import GameSwitch from "../common/GameSwitch";

export default class StatisticsExtendManager {


	public static onEvent(event: any, eventData = null) {
		var eventId = "";
		var sendData: any = {};
		if (!event) {
			var errStr = "没有写eventId";
			if (eventData) {
				errStr += "eventData" + JSON.stringify(eventData);
			}
			LogsManager.errorTag(null, errStr);
			return;
		}
		if (eventData) {
			if (typeof eventData == "object") {
				for (const eKey in eventData) {
					if (eventData.hasOwnProperty(eKey)) {
						const element = eventData[eKey];
						sendData[eKey] = element;
					}
				}
			} else {
				sendData["extra"] = JSON.stringify(eventData);
			}
		}
		var isAld: boolean = false;
		if (typeof event == "object") {
			eventId = event["name"];
			sendData["sortId"] = event["sortId"];
			sendData["groupId"] = event["groupId"];
			isAld = event["isAld"];
		} else {
			eventId = event;
		}
		//添加用户来源
		sendData["comeFrom"] = UserInfo.LoginSceneInfo;
		//发送用户channelUserId
		if (UserInfo.channelUserId) {
			sendData["channelUserId"] = UserInfo.channelUserId;
		}

		//发送性别
		if (UserInfo.userSex != null) {
			if (UserInfo.userSex == 0) {
				sendData["sex"] = "未知";
			} else if (UserInfo.userSex == 1) {
				sendData["sex"] = "男";
			} else if (UserInfo.userSex == 2) {
				sendData["sex"] = "女";
			}
		} else {
			sendData["sex"] = "未授权";
		}
		LogsManager.echo("yrc real send >>>>eventId:", eventId, ">>>>sendData:", event, ">>>>eventData", eventData);
		if (UserInfo.isWX() && isAld) {
			UserInfo.platform.aldSendEvent(eventId, sendData);
		}
		if (!UserInfo.isWeb()) {
			var sendAli: boolean = true;
			var switch_disable_log = GameSwitch.getSwitchState(GameSwitch.SWITCH_DISABLE_LOG);
			switch_disable_log = switch_disable_log.split(",");
			if (switch_disable_log.indexOf(event.name) != -1) {
				sendAli = false;
			}
			var switch_disable_log_group = GameSwitch.getSwitchState(GameSwitch.SWITCH_DISABLE_LOG_GROUP);
			switch_disable_log_group = switch_disable_log_group.split(",");
			if (switch_disable_log_group.indexOf(event.groupId) != -1) {
				sendAli = false;
			}
			if (sendAli) {
				LogsManager.sendStaticToAiCloud(eventId, sendData);
			}
		}
	}

}