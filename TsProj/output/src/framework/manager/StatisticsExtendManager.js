"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("./LogsManager");
const UserInfo_1 = require("../common/UserInfo");
const GameSwitch_1 = require("../common/GameSwitch");
class StatisticsExtendManager {
    static onEvent(event, eventData = null) {
        var eventId = "";
        var sendData = {};
        if (!event) {
            var errStr = "没有写eventId";
            if (eventData) {
                errStr += "eventData" + JSON.stringify(eventData);
            }
            LogsManager_1.default.errorTag(null, errStr);
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
            }
            else {
                sendData["extra"] = JSON.stringify(eventData);
            }
        }
        var isAld = false;
        if (typeof event == "object") {
            eventId = event["name"];
            sendData["sortId"] = event["sortId"];
            sendData["groupId"] = event["groupId"];
            isAld = event["isAld"];
        }
        else {
            eventId = event;
        }
        //添加用户来源
        sendData["comeFrom"] = UserInfo_1.default.LoginSceneInfo;
        //发送用户channelUserId
        if (UserInfo_1.default.channelUserId) {
            sendData["channelUserId"] = UserInfo_1.default.channelUserId;
        }
        //发送性别
        if (UserInfo_1.default.userSex != null) {
            if (UserInfo_1.default.userSex == 0) {
                sendData["sex"] = "未知";
            }
            else if (UserInfo_1.default.userSex == 1) {
                sendData["sex"] = "男";
            }
            else if (UserInfo_1.default.userSex == 2) {
                sendData["sex"] = "女";
            }
        }
        else {
            sendData["sex"] = "未授权";
        }
        LogsManager_1.default.echo("yrc real send >>>>eventId:", eventId, ">>>>sendData:", event, ">>>>eventData", eventData);
        if (UserInfo_1.default.isWX() && isAld) {
            UserInfo_1.default.platform.aldSendEvent(eventId, sendData);
        }
        if (!UserInfo_1.default.isWeb()) {
            var sendAli = true;
            var switch_disable_log = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_DISABLE_LOG);
            switch_disable_log = switch_disable_log.split(",");
            if (switch_disable_log.indexOf(event.name) != -1) {
                sendAli = false;
            }
            var switch_disable_log_group = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_DISABLE_LOG_GROUP);
            switch_disable_log_group = switch_disable_log_group.split(",");
            if (switch_disable_log_group.indexOf(event.groupId) != -1) {
                sendAli = false;
            }
            if (sendAli) {
                LogsManager_1.default.sendStaticToAiCloud(eventId, sendData);
            }
        }
    }
}
exports.default = StatisticsExtendManager;
//# sourceMappingURL=StatisticsExtendManager.js.map