"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../ui/layaMaxUI");
const UserModel_1 = require("../../../game/sys/model/UserModel");
const ButtonUtils_1 = require("../../utils/ButtonUtils");
const WindowManager_1 = require("../../manager/WindowManager");
const WindowCommonCfgs_1 = require("../../consts/WindowCommonCfgs");
const TableUtils_1 = require("../../utils/TableUtils");
const Client_1 = require("../../common/kakura/Client");
const SingleCommonServer_1 = require("../../server/SingleCommonServer");
class ChangeDataUI extends layaMaxUI_1.ui.gameui.changeData.ChangeDataUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.returnBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.sureBtn, this.onClickSure, this);
    }
    setData(data) {
        this.tipTxt.text = "";
        this.firstData = UserModel_1.default.instance.getData();
        var datas = TableUtils_1.default.safelyJsonStringfy(this.firstData);
        this.dataTxt.text = ChangeDataUI.stringToJSON(datas);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCommonCfgs_1.default.ChangeDataView);
    }
    onClickSure() {
        var data;
        try {
            data = JSON.parse(this.dataTxt.text);
        }
        catch (error) {
            this.tipTxt.text = "json数据结构错误" + JSON.stringify(error);
            return;
        }
        var uData = {};
        TableUtils_1.default.compareTable(this.firstData, data, uData);
        var deData = {};
        TableUtils_1.default.getDelData(this.firstData, data, deData);
        var backData = Client_1.default.instance.doDummyServerBack(null, uData, deData);
        SingleCommonServer_1.default.startSaveClientData();
        this.firstData = UserModel_1.default.instance.getData();
        this.tipTxt.text = "数据修改成功";
    }
    static stringToJSON(strJson) {
        // 计数tab的个数
        var tabNum = 0;
        var length = strJson.length;
        var result = "";
        var last = "";
        for (var i = 0; i < length; i++) {
            var c = strJson[i];
            if (c == '{') {
                tabNum++;
                result += c + "\n";
                result += this.getSpaceOrTab(tabNum);
            }
            else if (c == '}') {
                tabNum--;
                result += "\n";
                result += this.getSpaceOrTab(tabNum);
                result += c;
            }
            else if (c == ',') {
                result += c + "\n";
                result += this.getSpaceOrTab(tabNum);
            }
            else if (c == ':') {
                result += c + " ";
            }
            else if (c == '[') {
                tabNum++;
                var next = strJson[i + 1];
                if (next == ']') {
                    result += c;
                }
                else {
                    result += c + "\n";
                    result += this.getSpaceOrTab(tabNum);
                }
            }
            else if (c == ']') {
                tabNum--;
                if (last == '[') {
                    result += c;
                }
                else {
                    result += "\n" + this.getSpaceOrTab(tabNum) + c;
                }
            }
            else {
                result += c;
            }
            last = c;
        }
        return result;
    }
    static getSpaceOrTab(tabNum) {
        var str = "";
        for (var i = 0; i < tabNum; i++) {
            str += '\t';
        }
        return str;
    }
}
exports.default = ChangeDataUI;
//# sourceMappingURL=ChangeDataUI.js.map