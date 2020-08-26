import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ui } from "../../../../ui/layaMaxUI";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import TaskUI from "./TaskUI";
import TaskModel from "../../model/TaskModel";
import UserModel from "../../model/UserModel";
import TaskConditionTrigger from "../../trigger/TaskConditionTrigger";
import TableUtils from "../../../../framework/utils/TableUtils";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogFunc from "../../func/FogFunc";
import { DataResourceType } from "../../func/DataResourceFunc";
import TaskFunc from "../../func/TaskFunc";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import TaskGuideTrigger from "../../trigger/TaskGuideTrigger";
import Message from "../../../../framework/common/Message";
import TaskEvent from "../../event/TaskEvent";
import TweenAniManager from "../../manager/TweenAniManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import TaskServer from "../../server/TaskServer";
import ChapterConst from "../../consts/ChapterConst";
import RolesFunc from "../../func/RolesFunc";
import TaskChatFunc from "../../func/TaskChatFunc";


export default class ChatItemUI extends ui.gameui.task.ChatItemUI implements IMessage {

    private info;
    private roleId;
    private itemWidth = 24;
    constructor() {
        super();

    }
    /**添加事件监听 */
    addEvent() {
    }

    public setData(data): void {
        this.info = data.info;
        this.roleId = data.roleId;
        this.leftGroup.visible = false
        this.rightGroup.visible = false
        var role = TaskChatFunc.instance.getCfgDatasByKey("TaskRole", this.roleId, "icon")
        if (this.info.type == 1) {
            this.leftGroup.visible = true
            this.myIcon.skin = RolesFunc.instance.getBattleRoleIcon(role)
        } else {
            this.rightGroup.visible = true;
        }
        this.setTxt(this.info.info);

    }
    setTxt(txt: string) {
        var lbl;
        var bg;
        if (this.info.type == 1) {
            lbl = this.leftTxt;
            bg = this.leftBg;
        } else {
            lbl = this.rightTxt;
            bg = this.rightBg;
        }
        lbl.text = txt;
        var row = Math.ceil((txt.length+2) * this.itemWidth / lbl.width);
        lbl.height = 24 * row;
        bg.width = lbl.width + 20;
        bg.height = lbl.height + 22 * row;
        this.height = bg.height + 50;
    }
    recvMsg(cmd: string, data: any): void {


    }
    close() {

    }
}


