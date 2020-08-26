import { ui } from "../../../../ui/layaMaxUI";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import UserModel from "../../model/UserModel";
import IMessage from "../../interfaces/IMessage";
import Client from "../../../../framework/common/kakura/Client";
import Method from "../../common/kakura/Method";
import CacheManager from "../../../../framework/manager/CacheManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import Global from "../../../../utils/Global";
import GMConst from "../../consts/GMConst";
import SingleCommonServer from "../../../../framework/server/SingleCommonServer";
export default class TestOpListUI extends ui.gameui.test.TestOpListUI implements IMessage {
    public static res = ["gameui/TestOpList.scene",
        // "common/common_btn_btn2.png",
        // "common/login_box.png",
        // "common/userInfo_topbg.png",
    ];
    private _firstSelect;
    private _secondSelect;
    private _testOpData;//测试接口数据
    private _opData;//正式接口数据

    private _firstListData;
    private _SecondListData;
    private _selectOpId;
    private _selectAction;      //所选action
    private _params = {};
    private _defaultText = "选择方法";
    private _defaultInput = "参数";
    private _selectIndex: number = 0;//选择的类别，默认第一个test


    constructor() {
        super();
        this.returnInfoPanel.vScrollBarSkin = "";
        this.errorPanel.vScrollBarSkin = "";
        this.showParamsList([]);
    }

    public setData(data): void {
        this._firstSelect = "opFirstSelect" + UserModel.instance.getUserRid();
        this._secondSelect = "opSecondSelect" + UserModel.instance.getUserRid();
        this.initData();
        this.initView();

    }

    initData() {
        if (Global.checkUserCloudStorage()) {
            //云存储走新的逻辑
            var oplistData = GMConst.getOplistData();
            this.afterGetData(oplistData.result);
        } else {
            //暂时保留原来的代码
            Client.instance.send(Method.test_system_getTestOpList, {}, (result) => {
                this.afterGetData(result);
            }, this);
        }
    }

    afterGetData(result) {
        var oplist = result.data.oplist;
        var firstData = [];
        for (var key in oplist) {
            if (oplist.hasOwnProperty(key)) {
                var element = oplist[key];
                element.actDes = element.label + "：" + element.desc;
                var len = element.ops.length;
                for (var i = 0; i < len; i++) {
                    element.ops[i].actDes = element.ops[i].action + "：" + element.ops[i].desc;
                }
                firstData.push(element);
            }
        }
        this._testOpData = firstData;
        this._firstListData = this._testOpData;
        this.list_first.array = this._firstListData;
        this.list_first.renderHandler = new Laya.Handler(this, this.onFirstListRender);
        this.initClickEvent();
        //this.getOpData();
        this.showHisSelect();
    }

    initView() {
        this.backBtn.on(Laya.Event.CLICK, this, this.close);
        this.clickPanel.visible = false;
        this.firstPanel.visible = false;
        this.secondPanel.visible = false;
        this._params = {};
        this.clickPanel.on(Laya.Event.CLICK, this, () => {
            this.firstPanel.visible = false;
            this.secondPanel.visible = false;
            this.clickPanel.visible = false;
        });

        this.takeBtn.on(Laya.Event.CLICK, this, () => {
            if (!this._selectAction) {
                // WindowManager.ShowTip("请选择类别");
                return;
            }
            if (!this._selectOpId) {
                // WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#TestErrorOp"));
                // WindowManager.ShowTip("请选择方法");
                return;
            }
            if (this._params == {} || !this._params) {
                // WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#TestErrorParams"));
                // WindowManager.ShowTip("请输入参数");
                return;
            }
            if (Global.checkUserCloudStorage()) {
                var info = this._selectAction.split(".");
                if (info[0] == "delModel") {
                    this.doDelData(info[1], this._params[info[2]])
                } else {
                    if (info.length == 4) {
                        this.doUpdateData(info[0], info[1], this._params[info[2]], this._params[info[3]]);
                    } else if (info.length == 3) {
                        this.doUpdateData(info[0], this._params[info[1]], info[2], this._params[info[2]]);
                    } else {
                        this.doUpdateData(info[0], info[1], null, this._params[info[1]]);
                    }
                }

            } else {
                Client.instance.send("" + this._selectOpId, this._params, (result) => {
                    this.resetOutputText();
                    this.resultLabel.text = JSON.stringify(result);
                    if (result.error) {
                        this.errorLabel.text = JSON.stringify(result.error)
                    }
                }, this);
            }
        });

        this.testBtn.on(Laya.Event.CLICK, this, this.clickTestBtn);
        this.ridLab.text = "rid:" + UserModel.instance.getUserRid();
    }
    //点击上方的测试窗口切换
    clickTestBtn() {
        this._selectIndex = (this._selectIndex + 1) % 2;
        this.titleLabel.text = TranslateFunc.instance.getTranslate("#TestTitle" + this._selectIndex);
        this.resetView();
        if (this._selectIndex == 0) {
            this._firstListData = this._testOpData;
        } else {
            this._opData = this.getOpData();
            this._firstListData = this._opData;
        }
        this.list_first.array = this._firstListData;
        this.list_first.renderHandler = new Laya.Handler(this, this.onFirstListRender);
        this.showParamsList([])
        this.showHisSelect();
    }
    //切换窗口后重置
    resetView() {
        this.firstLabel.text = TranslateFunc.instance.getTranslate("#TestFirstLb");
        this.secondLabel.text = TranslateFunc.instance.getTranslate("#TestSecondLb");
        this.resetOutputText();
    }
    resetOutputText() {
        this.resultLabel.text = "";
        this.errorLabel.text = "";
    }

    //获取正式接口的数据
    getOpData() {
        if (!this._opData) {
            Client.instance.send(Method.test_system_getOpList, {}, (result) => {
                var oplist = result.data.oplist;
                var firstData = [];
                for (var key in oplist) {
                    if (oplist.hasOwnProperty(key)) {
                        var element = oplist[key];
                        element.actDes = element.label + "：" + element.desc;
                        var len = element.ops.length;
                        for (var i = 0; i < len; i++) {
                            element.ops[i].actDes = element.ops[i].action + "：" + element.ops[i].desc;
                        }
                        firstData.push(element);
                    }
                }
                this._opData = firstData;
            }, this);
        } else {
            return this._opData;
        }
    }


    private onFirstListRender(cell: Laya.Box, index: number): void {
        var data = this.list_first.array[index];
        var desTxt = cell.getChildAt(0).getChildByName("descTxt") as Laya.Label;
        desTxt.text = data.actDes;
        cell.on(Laya.Event.CLICK, this, this.clickFirstItem, [data]);
    }
    private onSecondListRender(cell: Laya.Box, index: number): void {
        var data = this.list_second.array[index];
        var desTxt = cell.getChildAt(0).getChildByName("descTxt") as Laya.Label;
        desTxt.text = data.actDes;
        cell.on(Laya.Event.CLICK, this, this.clickSecondItem, [data]);
    }
    //点击选择类别1中的item
    clickFirstItem(data) {
        this.firstLabel.text = data.actDes;
        this._SecondListData = data.ops;
        this.list_second.array = this._SecondListData;
        this.list_second.renderHandler = new Laya.Handler(this, this.onSecondListRender);

        this._selectOpId = null;
        this._params = {};
        this.secondLabel.text = this._defaultText;
        this.showParamsList([])
        this.clickFirstLabel();
        CacheManager.instance.setGlobalCache(this._firstSelect + this._selectIndex, data.label)
    }

    //点击选择类别2中的item
    clickSecondItem(data) {
        this._params = {};
        this._selectAction = data.action;
        this._selectOpId = data.op;
        this.secondLabel.text = data.actDes;
        this.clickSecondLabel();
        this.showParamsList(data.params)
        CacheManager.instance.setGlobalCache(this._secondSelect + this._selectIndex, data.op)
    }

    //根据选择的第二列类别，显示对应参数
    showParamsList(params: any[]) {
        this._params = {};
        this.list_params.array = params;
        this.list_params.repeatY = params.length;
        this.list_params.renderHandler = new Laya.Handler(this, this.onParamsListRender);
    }

    onParamsListRender(cell: Laya.Box, index: number): void {
        var data = this.list_params.array[index];
        var params = cell.getChildByName("params") as Laya.Image;
        var paramsName = params.getChildByName("paramsName") as Laya.Label;
        var paramsDes = params.getChildByName("paramsDes") as Laya.Label;
        var paramsType = params.getChildByName("paramsType") as Laya.Label;
        var paramsInput = params.getChildByName("paramsInput") as Laya.TextInput;
        paramsName.text = data.name;
        paramsDes.text = data.desc;
        paramsType.text = data.type;
        paramsInput.text = this._defaultInput;
        //先移除之前的事件
        paramsInput.offAll();
        paramsInput.on(Laya.Event.FOCUS, this, () => {
            paramsInput.text = "";
        });
        paramsInput.on(Laya.Event.BLUR, this, () => {
            var params = paramsInput.text;
            if (params == "") {
                paramsInput.text = this._defaultInput;
            } else {
                var needType = data.type;
                var isRight: boolean = false;
                var endParams;
                switch (needType) {
                    case "int":
                        endParams = Number(params);
                        isRight = !isNaN(endParams);
                        break;
                    case "String":
                        isRight = (typeof params == "string");
                        endParams = params;
                        break;
                    case "Array":
                        endParams = params.split(",")
                        isRight = true;
                        break;
                }

                if (isRight) {
                    if (paramsInput.text != this._defaultInput) {
                        this._params[data.name] = endParams;

                    }
                } else {
                    paramsInput.text = this._defaultInput;
                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#inputerr"));
                }
            }
        });
    }

    initClickEvent() {
        this.firstLabel.on(Laya.Event.CLICK, this, this.clickFirstLabel);
        this.secondLabel.on(Laya.Event.CLICK, this, this.clickSecondLabel);
    }

    //点击第一个label
    clickFirstLabel() {
        this.firstPanel.visible = !this.firstPanel.visible;
        this.clickPanel.visible = this.firstPanel.visible;
    }
    //点击第二个label
    clickSecondLabel() {
        if (!this._SecondListData) {
            WindowManager.ShowTip("请先选择类别");
            return;
        }
        this.secondPanel.visible = !this.secondPanel.visible;
        this.clickPanel.visible = this.secondPanel.visible;
    }
    //展示历史选择
    showHisSelect() {
        var hisFirst = CacheManager.instance.getGlobalCache(this._firstSelect + this._selectIndex);
        if (hisFirst) {
            for (var i = 0; i < this._firstListData.length; i++) {
                var data = this._firstListData[i]
                if (data.label == hisFirst) {
                    this.firstLabel.text = data.actDes;
                    this._SecondListData = data.ops;
                    this.list_second.array = this._SecondListData;
                    this.list_second.renderHandler = new Laya.Handler(this, this.onSecondListRender);
                    var hisSecond = CacheManager.instance.getGlobalCache(this._secondSelect + this._selectIndex)
                    if (hisSecond) {
                        for (var j = 0; j < this._SecondListData.length; j++) {
                            var jData = this._SecondListData[j];
                            if (jData.op == hisSecond) {
                                this.secondLabel.text = jData.actDes;
                                this._selectOpId = jData.op;
                                this._selectAction = jData.action;
                                this.showParamsList(jData.params)
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }
    close(): void {
        WindowManager.CloseUI(WindowCfgs.TestOpListUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {
            // case EventType.TESTOPLISTSEND:
            //     //刷新或关闭
            //     this._params[data.data.name] = data.params;
            //     break;
        }
    }

    //云存储同步数据
    doUpdateData(parent, key, key1, value) {
        var upData = {};
        if (parent == "User") {
            upData[key] = value;
        } else {
            upData[parent] = {};
            var upTData = {};
            var upTData2 = {};
            if (key1) {
                upTData[key1] = value;
                upData[parent][key] = upTData;
            } else {
                upData[parent][key] = value;
            }

        }
        if (key == "sp") {
            upData[parent]["upSpTime"] = Client.instance.serverTime;
        }

        var deData = {};
        var backData = Client.instance.doDummyServerBack(null, upData, deData);


        SingleCommonServer.startSaveClientData();
    }
    //云存储删除数据
    doDelData(parent, key) {
        var deData = {};
        var de1 = {};
        if (key) {
            de1[key] = 1;
            deData[parent] = de1
        } else {
            deData[parent] = 1
        }
        var backData = Client.instance.doDummyServerBack(null, null, deData);

        SingleCommonServer.startSaveClientData();
    }
}

