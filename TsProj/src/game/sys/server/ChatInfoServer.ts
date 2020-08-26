import ChatInfoModel from "../model/ChatInfoModel";
import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import { isatty } from "tty";
import TaskFunc from "../func/TaskFunc";

export default class ChatInfoServer {
    //     chatInfo:{
    //     	1008（角色id）:{
    //     		1(任务id):{
    //     			frontNum:1 //前置对话已显示数量
    //     			followNum:1 //后置对话已显示数量
    //     			answer:{
    //     				1001(对话id):1 玩家选择的是第几个回答 ，下标从1开始
    //     			},
    //     			index:1 //第几个对话
    //     		}
    //     	}
    // }
    static upDateChatInfo(data, callBack = null, thisObj = null, isAsyc = false) {
        var uData = {};
        var roleId = data.role;
        var taskId = data.taskId;
        var type = data.type;
        var answer = data.answer;
        var item = {};
        var taskInfo = {};
        item[roleId] = {};
        item[roleId][taskId] = taskInfo;
        var info = ChatInfoModel.instance.getChatInfoById(roleId, taskId)
        if (!info) {
            var allLength = Object.keys(ChatInfoModel.instance.getAllChatByRole(roleId) || {}).length;
            var index = allLength + 1;
            taskInfo["index"] = index;
        }
        if (type == 1) {
            //前置对话
            var count = (info && info.frontNum || 0) + 1;
            var allCount = TaskFunc.instance.getCfgDatasByKey("Task", taskId, "frontChat").length
            taskInfo["frontNum"] = count >= allCount ? allCount : count;
        } else if (type == 2) {
            //后置对话
            var count = (info && info.followNum || 0) + 1;
            var allCount = TaskFunc.instance.getCfgDatasByKey("Task", taskId, "followChat").length
            taskInfo["followNum"] = (info && info.followNum || 0) + 1;
        }
        if (answer) {
            taskInfo["answer"] = answer;
        }
        uData["chatInfo"] = item;
        var backData = Client.instance.doDummyServerBack(null, uData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer.startSaveClientData();
        }
    }
}