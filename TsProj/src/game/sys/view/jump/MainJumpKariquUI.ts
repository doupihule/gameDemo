import IMessage from "../../interfaces/IMessage";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import JumpManager from "../../../../framework/manager/JumpManager";

import ResourceConst from "../../consts/ResourceConst";
import { ui } from "../../../../ui/layaMaxUI";
import LogsManager from "../../../../framework/manager/LogsManager";
import JumpConst from "../../consts/JumpConst";
import UserInfo from "../../../../framework/common/UserInfo";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import TableUtils from "../../../../framework/utils/TableUtils";
import GameUtils from "../../../../utils/GameUtils";

export default class MainJumpKariquUI extends ui.gameui.jump.MainJumpKariquUI implements IMessage {

    private imgWidth: number = 170;
    private spaceX: number = 20;
    private spaceY: number = 20;

    constructor() {
        super();
        new ButtonUtils(this.closeBtn, this.close, this);

        this.iconPanel.vScrollBarSkin = "";
    }


    setData(data: any): void {
        var jumpData = JumpManager.getMokaDataByType(JumpConst.JUMP_KARIQU_LEFTSIDE);
        this.initJumpData(jumpData);
    }
    /** 互推相关 */
    protected initJumpData(data, isDelay = false) {
        LogsManager.echo("xd 初始化结算互推", data)
        this.iconPanel.removeChildren();
        var newData: any[] = TableUtils.copyOneArr(data);
        data = newData;

        var iconList = [];
        for (var i = 0; i < data.length; i++) {
            iconList.push(i);
        }
        for (var i = 0; i < data.length / 2; i++) {
            var randomNum = GameUtils.getRandomInt(0, iconList.length - 1);
            iconList.splice(randomNum, 1);
        }
        var iconHotList = TableUtils.copyOneArr(iconList);
        for (var i = 0; i < iconList.length / 2; i++) {
            var randomNum = GameUtils.getRandomInt(0, iconHotList.length - 1);
            iconHotList.splice(randomNum, 1);
        }
        data = GameUtils.shuffle(data)
        for (var i = 0; i < data.length; i++) {
            var xIndex: number = i % 3;
            var yIndex: number = Math.floor(i / 3);
            var itemData = data[i];
            var sign = iconList.indexOf(i) != -1 ? (iconHotList.indexOf(i) != -1 ? ResourceConst.JUMP_ICON_HOT : ResourceConst.JUMP_ICON_NEW) : null;
            var itemBox = JumpManager.createJumpItem(itemData, this.imgWidth, this.imgWidth, { from: JumpConst.MAIN_SIDE }, sign, 0, true, 20, "#000000", true, 50, 28, true, 6,-45);
            itemBox.x = xIndex * (this.imgWidth + this.spaceX);
            itemBox.y = yIndex * (this.imgWidth + this.spaceY);
            this.iconPanel.addChild(itemBox);
        }
    }
    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }

    close() {
        WindowManager.CloseUI(WindowCfgs.MainJumpKariquUI)
    }

}