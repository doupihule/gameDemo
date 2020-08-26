"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LogsManager {
    constructor() {
    }
    static initLogsManager() {
        LogsManager.logsArr = [];
    }
    //输出 如果message里面包含#号,optionalParams就按照#n顺序替换规则
    /**
      * 示例:
      * echo("这是人名测试:#1,#2","小明","小黄"),
      * 打印结果 : 这是人名测试:小明,小黄
      * 后面数组长度和前面#1,#n对应
      */
    static echo(message, ...optionalParams) {
        var resultArr = this.turnStr("echo", message, optionalParams);
        // if (!Global.isRelease)
        if (!UserInfo_1.default.isSystemMini()) {
            console.log(resultArr.join(" "));
        }
        else {
            console.log.apply(null, resultArr);
        }
    }
    //警告
    static warn(message, ...optionalParams) {
        var resultArr = this.turnStr("warn", message, optionalParams);
        if (!UserInfo_1.default.isSystemMini()) {
            console.warn(resultArr.join(" "));
        }
        else {
            console.warn.apply(null, resultArr);
        }
    }
    //错误 errorId:错误日志的聚合id, 按照模块归类.. 比如 文件系统相关的报错  errorId为 file, 配表相关的配表errorId为config.
    static error(message, ...optionalParams) {
        console.error("__禁止走到这里来");
        if (UserInfo_1.default.isTest()) {
            WindowManager_1.default.ShowTip("禁止使用error接口！改为errorTag");
        }
    }
    static errorTag(errorId = null, message, ...optionalParams) {
        var resultArr = this.turnStr("error", message, optionalParams, true);
        var arr = resultArr.slice(1, resultArr.length);
        var concatStr = "" + arr.join(",");
        if (UserInfo_1.default.isTest()) {
            WindowManager_1.default.ShowTip("有错误，去看日志！");
        }
        //这里防止 deviceId调用错误, 故 延迟一帧发送阿里云错误日志
        TimerManager_1.default.instance.add(this.sendErrorToPlatform, this, 10, 1, false, [concatStr, this.errorTag_gameError, 200, errorId]);
        // this.sendErrorToPlatform(concatStr,this.errorTag_gameError);
        //错误日志 要特殊处理,因为 在sendErrorToPlatform里面需要读取最近的20行日志数据,这样会导致获取重复数据
        this.insterOneLogs(concatStr);
        if (!UserInfo_1.default.isSystemMini()) {
            console.error(resultArr.join(" "));
        }
        else {
            if (UserInfo_1.default.isWeb()) {
                console.error.apply(null, resultArr);
            }
            else {
                console.warn.apply(null, resultArr);
            }
        }
    }
    //系统底层报错
    static systemError(message, ...optionalParams) {
        var resultArr = this.turnStr("sysError", message, optionalParams, true);
        var arr = resultArr.slice();
        arr.splice(0, 1);
        var concatStr = "" + arr.join(",");
        //这里防止 deviceId调用错误, 故 延迟一帧发送阿里云错误日志
        TimerManager_1.default.instance.add(this.sendErrorToPlatform, this, 10, 1, false, [concatStr, this.errorTag_sysError]);
        // this.sendErrorToPlatform(concatStr,this.errorTag_sysError);
        this.insterOneLogs(concatStr);
        if (UserInfo_1.default.isWeb()) {
            console.error.apply(null, resultArr);
        }
        else {
            console.warn.apply(null, resultArr);
        }
        if (UserInfo_1.default.isWeb()) {
            WindowManager_1.default.ShowTip("有错误，去看日志！");
        }
    }
    //发送错误日志到平台 tag 日志标识(分片)
    static sendErrorToPlatform(errorStr, tag = '', maxLength = 1000, errorId = null, logLength = 80, startLine = 0, pieceLength = 60, sendCount = 1) {
        var id = 0;
        while (logLength > pieceLength) {
            this.sendErrorToPlatformByPiece(errorStr, tag, maxLength, errorId, pieceLength, startLine, id + 1, sendCount);
            logLength -= pieceLength;
            startLine += pieceLength;
            id++;
        }
        if (id) {
            this.sendErrorToPlatformByPiece(errorStr, tag, maxLength, errorId, logLength, startLine, id + 1, sendCount);
        }
        else {
            this.sendErrorToPlatformByPiece(errorStr, tag, maxLength, errorId, logLength, startLine, 0, sendCount);
        }
    }
    //发送错误日志到平台 tag 日志标识
    static sendErrorToPlatformByPiece(errorStr, tag = '', maxLength = 1000, errorId = null, logLength = 80, startLine = 0, id = 0, sendCount) {
        //如果是禁掉 发送错误日志的
        if (UserInfo_1.default.isWeb())
            return; //web版本不发送
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_SENDERRORLOG)) {
            return;
        }
        // url编码
        errorStr = this.turnURIContent(errorStr);
        errorStr = errorStr.replace(/[\n\r]+/g, " ");
        errorStr = errorStr.slice(0, Math.min(errorStr.length, maxLength));
        this.sendDataToAiCloud(errorStr, tag, logLength, errorId, startLine, id, sendCount);
    }
    //获取最大日志长度
    static getMaxLogsLength() {
        var state = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_TURNURL_PLAT);
        if (state && state.indexOf(UserInfo_1.default.platformId) != -1) {
            return this.sendMaxLength;
        }
        return this.sendMaxLength / 3;
    }
    //转化url字符串
    static turnURIContent(str) {
        var state = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_TURNURL_PLAT);
        if (state && state.indexOf(UserInfo_1.default.platformId) != -1) {
            return str;
        }
        return encodeURIComponent(str);
    }
    //发送错误日志到阿里云
    static sendDataToAiCloud(errorStack, tag, logLength = 80, errorId = null, startLine = 0, messageId = 0, sendCount = 1) {
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_ALIYUN)) {
            return;
        }
        var errorName = messageId + "_" + errorStack;
        //同一条请求只发送一次
        if (this._sendCache[errorName]) {
            return;
        }
        this._sendCache[errorName] = true;
        var id;
        if (!errorId) {
            id = Md5.init(errorStack);
        }
        else {
            id = errorId;
        }
        var errorTagGroup = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.LOGS_ERRORTAG_GROP);
        if (errorTagGroup && errorTagGroup.indexOf(errorId) != -1) {
            LogsManager.echo("忽略报错日志", errorId);
            return;
        }
        var message = "";
        if (messageId) {
            message = messageId + "_";
        }
        var params = {
            id: id,
            game: GameConsts_1.default.gameCode,
            platform: PackConfigManager_1.default.ins.platform.platform,
            time: Client_1.default.instance.serverTime,
            os: Global_1.default.getOs(),
            device: Global_1.default.deviceModel,
            cver: Global_1.default.client_version,
            ver: Global_1.default.version,
            rid: UserModel_1.default.instance.getUserRid(),
            error_message: message,
            error_stack: errorStack,
            error_type: tag,
            context: "",
            deviceId: Global_1.default.deviceId,
        };
        var sdkInfo = Global_1.default.getSDKInfo();
        if (sdkInfo) {
            params["context"] = sdkInfo + params["context"];
        }
        var urlParams = HttpMessage_1.default.instance.objectToUrlParam(params);
        var url = this._aliyunLogsUrl + urlParams;
        //如果发送消息失败 这里需要把信息存储起来 后续优化
        var onErrorCall = () => {
            console.log("__onerrorCall");
            this.sendErrorToPlatform(errorStack, tag, 200, errorId, 60, 0, 30, 2);
        };
        var webParams = {
            errorCall: onErrorCall,
            isOrigin: true,
            thisObj: this,
            sendCount: sendCount
        };
        var allLength = this.getMaxLogsLength() - url.length;
        params["context"] = this.turnURIContent(params["context"] + this.getNearestLogs(logLength, id, startLine, allLength));
        var urlParams1 = HttpMessage_1.default.instance.objectToUrlParam(params);
        var url1 = this._aliyunLogsUrl + urlParams1;
        HttpMessage_1.default.instance.sendOtherHttpRequest(url1, null, null, null, "get", webParams, 1);
    }
    /**将打点数据发送到阿里云 */
    static sendStaticToAiCloud(eventId, eventData) {
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_ALIYUN)) {
            return;
        }
        var params = {
            game: GameConsts_1.default.gameCode,
            platform: PackConfigManager_1.default.ins.platform.platform,
            cver: Global_1.default.client_version,
            deviceId: Global_1.default.deviceId,
            eventId: eventId,
            rid: UserModel_1.default.instance.getUserRid(),
            device: Global_1.default.deviceModel,
            circleId: this.getCircleId(),
            t: Laya.Browser.now()
        };
        if (eventData) {
            //打点上报，这两个参数要单独发
            if (eventData["sortId"]) {
                params["sortId"] = eventData["sortId"];
                delete eventData["sortId"];
            }
            if (eventData["groupId"]) {
                params["groupId"] = eventData["groupId"];
                delete eventData["groupId"];
            }
            if (eventData["comeFrom"]) {
                params["comeFrom"] = eventData["comeFrom"];
                delete eventData["comeFrom"];
            }
            if (eventData["channelUserId"]) {
                params["channelUserId"] = eventData["channelUserId"];
                delete eventData["channelUserId"];
            }
            if (eventData["sex"]) {
                params["sex"] = eventData["sex"];
                delete eventData["sex"];
            }
            if (eventData["cver"]) {
                params["cver"] = eventData["cver"];
                delete eventData["cver"];
            }
        }
        //如果是套壳包 
        params.childChannelId = UserInfo_1.default.platform.getChildChannelKey();
        if (eventData && JSON.stringify(eventData) != "{}") {
            params["value"] = JSON.stringify(eventData);
        }
        var urlParams = HttpMessage_1.default.instance.objectToUrlParam(params);
        var url = this._aliyunStaUrl + urlParams;
        //如果发送消息失败 这里需要把信息存储起来 后续优化
        var onErrorCall = () => {
            console.log("__onerrorCall");
        };
        var webParams = {
            errorCall: onErrorCall,
            isOrigin: true,
        };
        HttpMessage_1.default.instance.sendOtherHttpRequest(url, null, null, null, "get", webParams);
    }
    /**将打点-激活数据发送到阿里云 */
    static sendActiveToAiCloud(isNew) {
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_ALIYUN)) {
            return;
        }
        var params = {
            game: GameConsts_1.default.gameCode,
            platform: PackConfigManager_1.default.ins.platform.platform,
            deviceId: Global_1.default.deviceId,
            device: Global_1.default.deviceModel,
            isNew: isNew,
        };
        var urlParams = HttpMessage_1.default.instance.objectToUrlParam(params);
        var url = this._aliyunActiveUrl + urlParams;
        //如果发送消息失败 这里需要把信息存储起来 后续优化
        var onErrorCall = () => {
            console.log("__onerrorCall");
        };
        var webParams = {
            errorCall: onErrorCall,
            isOrigin: true,
        };
        HttpMessage_1.default.instance.sendOtherHttpRequest(url, null, null, null, "get", webParams);
    }
    /**将loading总时长发送到阿里云 */
    static sendLoadingToAiCloud(time) {
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_ALIYUN)) {
            return;
        }
        var params = {
            game: GameConsts_1.default.gameCode,
            platform: PackConfigManager_1.default.ins.platform.platform,
            deviceId: Global_1.default.deviceId,
            device: Global_1.default.deviceModel,
            isNew: StatisticsManager_1.default.isNewPlayer ? 1 : 0,
            network: DeviceTools_1.default.network,
            time: time
        };
        LogsManager.echo("yrc1111 sendLoadingToAiCloud", JSON.stringify(params));
        var urlParams = HttpMessage_1.default.instance.objectToUrlParam(params);
        var url = this._aliyunLoadingUrl + urlParams;
        //如果发送消息失败 这里需要把信息存储起来 后续优化
        var onErrorCall = () => {
            console.log("__onerrorCall");
        };
        var webParams = {
            errorCall: onErrorCall,
            isOrigin: true,
        };
        HttpMessage_1.default.instance.sendOtherHttpRequest(url, null, null, null, "get", webParams);
    }
    //后面封装日志缓存接口,方便查看日志 比如 
    //插入一个日志,这个不做长度校验
    static insterOneLogs(str) {
        var rowLen = 50;
        //最多截取1000个字符
        // if (str.length > 1000) {
        // 	str = str.slice(0, 1000);
        // }
        // while (str.length > rowLen) {
        // 	var substring = str.substr(0, rowLen);
        // 	str = str.substr(rowLen, str.length - rowLen);
        // 	LogsManager.logsArr.push({ label: substring });
        // }
        LogsManager.logsArr.push({ label: str });
        //判断长度
        if (LogsManager.logsArr.length > LogsManager.maxCancheLength) {
            LogsManager.logsArr.splice(0, 1);
        }
        if (LogsManager.logPanel) {
            if (!LogsManager.updateFlag && LogsManager.logPanel.visible) {
                Laya.timer.once(500, this, () => {
                    if (LogsManager.updateFlag && LogsManager.logPanel.visible) {
                        LogsManager.refreshLog();
                    }
                    LogsManager.updateFlag = false;
                });
                LogsManager.updateFlag = true;
            }
        }
    }
    //获取最近指定行数的日志,0表示返回所有日志，是倒着数的
    static getNearestLogs(line, id = null, startLine = 0, allLength) {
        if (id == LogsErrorCode_1.default.ALIYUN_SENDERROR)
            return "";
        if (line == 0) {
            return this.logsArr;
        }
        var len = this.logsArr.length;
        if (line + startLine > len) {
            line = Math.max(0, len - startLine);
        }
        var start = len - line - startLine;
        if (start < 0) {
            start = 0;
        }
        var str = "";
        // LogsManager.echo("krma. " + "len " + len + " startLine " + startLine + " line " + line + " start " + start + " ")
        for (var i = start; i < start + line; i++) {
            str += this.logsArr[i].label + "\n";
        }
        if (!str.length) {
            str = "all " + len + " start " + startLine + " ,log already end";
        }
        if (allLength) {
            if (str.length > allLength) {
                str = str.slice(0, allLength);
            }
        }
        // str = this.getSureByte(str, allLength);
        return str;
    }
    //根据最多能发送的长度截取
    static getSureByte(str, allLength) {
        var lastStr = "";
        var changeStr = "";
        var s = "";
        var enocdeLength = 0;
        for (var i = str.length - 1; i >= 0; i--) {
            s = str.charAt(i);
            enocdeLength = encodeURIComponent(s).length;
            if (allLength - enocdeLength >= 30) {
                lastStr += s;
                allLength -= enocdeLength;
            }
            else {
                break;
            }
        }
        for (var i = lastStr.length - 1; i >= 0; i--) {
            changeStr += lastStr.charAt(i);
        }
        return changeStr;
    }
    //字符串转换
    static turnStr(title, message, optionalParams, isError = false) {
        //如果是有通配符替换的
        if (typeof message != "string") {
            message = message + "";
        }
        var timeStr = this.getTimeStr(title);
        var resultStr;
        var length = optionalParams.length;
        var arr;
        if (message.indexOf("#") != -1) {
            resultStr = message;
            for (var i = 0; i < length; i++) {
                resultStr = resultStr.replace("#" + (i + 1), optionalParams[i]);
            }
            arr = [resultStr];
        }
        else {
            if (length > 0) {
                resultStr = message + " " + optionalParams.join(" ");
            }
            else {
                resultStr = message;
            }
            optionalParams.splice(0, 0, message);
            arr = optionalParams;
        }
        resultStr = timeStr + " " + resultStr;
        // 最多截取1000个打印字符
        // if (resultStr.length > 1000) {
        // 	resultStr = resultStr.slice(0, 1000)
        // }
        if (!isError) {
            this.insterOneLogs(resultStr);
        }
        arr.splice(0, 0, timeStr);
        return arr;
    }
    static getTimeStr(title) {
        var time = new Date();
        return "[" + title + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " ] ";
    }
    static getFunctionName(func) {
        var name;
        if (typeof func == 'function' || typeof func == 'object') {
            name = ('' + func);
            name = name.match(/function\s*([\w\$]*)\s*\(/);
        }
        return name && name[1];
    }
    static initLogPanel() {
        LogsManager.logGroup = new Laya.Image();
        LogsManager.logPanel = new Laya.Image();
        LogsManager.scroller = new Laya.List();
        var background = new Laya.Sprite();
        var logBtn = new Laya.Label("Log");
        LogsManager.autoBtn = new Laya.Label("Auto");
        LogsManager.disposeAccountBtn = new Laya.Label("清除数据（慎点）");
        LogsManager.disposeAccountSureBtn = new Laya.Label("确认清除数据（慎点）");
        LogsManager.disposeAccountCancelBtn = new Laya.Label("不清除数据了");
        LogsManager.statBtn = new Laya.Label("stat");
        LogsManager.infoLabel = new Laya.Label("uid");
        LogsManager.infoLabel.fontSize = 20;
        LogsManager.infoLabel.color = "#ffffff";
        logBtn.fontSize = LogsManager.disposeAccountBtn.fontSize = LogsManager.autoBtn.fontSize = LogsManager.statBtn.fontSize = 20;
        logBtn.color = LogsManager.disposeAccountBtn.color = LogsManager.autoBtn.color = LogsManager.statBtn.color = "#ffffff";
        // logBtn.bgColor = LogsManager.disposeAccountBtn.bgColor = LogsManager.autoBtn.bgColor = LogsManager.statBtn.color = "#000000";
        LogsManager.disposeAccountSureBtn.fontSize = LogsManager.disposeAccountCancelBtn.fontSize = 60;
        LogsManager.disposeAccountSureBtn.bold = LogsManager.disposeAccountCancelBtn.bold = true;
        LogsManager.disposeAccountSureBtn.color = LogsManager.disposeAccountCancelBtn.color = "#ff0000";
        LogsManager.txt = new Laya.Text();
        var logGroup = LogsManager.logGroup;
        var logPanel = LogsManager.logPanel;
        var txt = LogsManager.txt;
        const Text = Laya.Text, Event = Laya.Event;
        txt.overflow = Text.SCROLL;
        txt.text = LogsManager.setLogTxt();
        txt.wordWrap = true;
        txt.size(540, 540);
        txt.fontSize = 20;
        txt.color = "#ffffff";
        // 不用重复打印初始化前的日志
        // console.log(LogsManager.txt.text);
        txt.on(Event.MOUSE_DOWN, this, startScrollText);
        var thisObj = this;
        /* 开始滚动文本 */
        function startScrollText(e) {
            const Event = Laya.Event;
            LogsManager.prevX = txt.mouseX;
            LogsManager.prevY = txt.mouseY;
            Laya.stage.on(Event.MOUSE_MOVE, this, scrollText);
            Laya.stage.on(Event.MOUSE_UP, this, finishScrollText);
        }
        /* 停止滚动文本 */
        function finishScrollText(e) {
            const Event = Laya.Event;
            Laya.stage.off(Event.MOUSE_MOVE, this, scrollText);
            Laya.stage.off(Event.MOUSE_UP, this, finishScrollText);
        }
        /* 鼠标滚动文本 */
        function scrollText(e) {
            const Event = Laya.Event;
            var nowX = txt.mouseX;
            var nowY = txt.mouseY;
            txt.scrollX += LogsManager.prevX - nowX;
            txt.scrollY += LogsManager.prevY - nowY;
            LogsManager.prevX = nowX;
            LogsManager.prevY = nowY;
        }
        logPanel.addChild(background);
        logPanel.addChild(txt);
        logGroup.addChild(logPanel);
        logGroup.addChild(logBtn);
        logGroup.addChild(LogsManager.autoBtn);
        logGroup.addChild(LogsManager.disposeAccountBtn);
        logGroup.addChild(LogsManager.disposeAccountSureBtn);
        logGroup.addChild(LogsManager.disposeAccountCancelBtn);
        logGroup.addChild(LogsManager.statBtn);
        logGroup.addChild(LogsManager.infoLabel);
        WindowManager_1.default.debugLayer.addChild(logGroup);
        logGroup.mouseThrough = true;
        //画矩形
        background.graphics.drawRect(0, 30, 640, 540, 0);
        var touchGroup = new Laya.Sprite();
        // touchGroup.graphics.drawRect(0, Global.stageHeight * 0.5+50, 100, 100, "0xff0000");			
        touchGroup.width = 150;
        touchGroup.height = 50;
        touchGroup.x = 490;
        touchGroup.y = 0;
        WindowManager_1.default.debugLayer.addChild(touchGroup);
        touchGroup.on(Laya.Event.CLICK, this, this.touchHandler);
        background.alpha = 0.8;
        logBtn.x += 30;
        LogsManager.autoBtn.x += 100;
        LogsManager.disposeAccountBtn.x += 300;
        LogsManager.disposeAccountSureBtn.x += 60;
        LogsManager.disposeAccountSureBtn.y += 400;
        LogsManager.disposeAccountCancelBtn.x += 60;
        LogsManager.disposeAccountCancelBtn.y += 480;
        LogsManager.statBtn.x += 100;
        LogsManager.statBtn.y += 20;
        LogsManager.infoLabel.x += 180;
        txt.y += 30;
        logPanel.y += 15;
        logGroup.y += 100;
        logPanel.visible = false;
        LogsManager.setLogGroupVisible(GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_LOG_PANEL));
        logBtn.on(Laya.Event.CLICK, this, this.showLogPanel);
        LogsManager.autoBtn.on(Laya.Event.CLICK, this, this.autoSwitch);
        LogsManager.disposeAccountBtn.on(Laya.Event.CLICK, this, this.sureDisposeAccount);
        LogsManager.disposeAccountSureBtn.on(Laya.Event.CLICK, SingleCommonServer_1.default, SingleCommonServer_1.default.disposeAccount);
        LogsManager.disposeAccountCancelBtn.on(Laya.Event.CLICK, this, this.cancelDisposeAccount);
        LogsManager.statBtn.on(Laya.Event.CLICK, this, this.statSwitch);
        //先把清档选项按钮隐藏
        this.cancelDisposeAccount();
    }
    static checkGM() {
        return;
    }
    static setLogTxt() {
        var alltxt = "";
        for (var i = 0; i < LogsManager.logsArr.length; i++) {
            alltxt += LogsManager.logsArr[i].label + "\n";
        }
        return alltxt;
    }
    static showLogPanel() {
        if (LogsManager.logPanel.visible) {
            LogsManager.logPanel.visible = false;
        }
        else {
            LogsManager.logPanel.visible = true;
            LogsManager.autoDisableFlag = false;
            LogsManager.refreshLog();
        }
    }
    static autoSwitch() {
        if (LogsManager.autoBtn.text == "Auto")
            LogsManager.autoBtn.text = "Locked";
        else
            LogsManager.autoBtn.text = "Auto";
        LogsManager.autoFlag = !LogsManager.autoFlag;
    }
    //弹框确认是否真的清档
    static sureDisposeAccount() {
        LogsManager.disposeAccountSureBtn.visible = true;
        LogsManager.disposeAccountCancelBtn.visible = true;
    }
    //不清档了  隐藏确定和取消按钮
    static cancelDisposeAccount() {
        LogsManager.disposeAccountSureBtn.visible = false;
        LogsManager.disposeAccountCancelBtn.visible = false;
    }
    static statSwitch() {
        this.statVis = !this.statVis;
        if (this.statVis) {
            Laya.Stat.show(0, 100);
        }
        else {
            Laya.Stat.hide();
        }
    }
    static addTouchShow(target) {
        // if (egret.Capabilities.runtimeType == egret.RuntimeType.WXGAME) {
        // egret.Logger.logLevel = egret.Logger.OFF;
        // target.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        // }
    }
    static touchHandler(evt) {
        if (LogsManager.logGroup.visible)
            return;
        var time = Laya.Browser.now();
        if (time - this._prevTime < 200) {
            this._prevTime = time;
            this._count++;
            if (this._count == 6) {
                this.sendErrorToPlatform("发送客户端错误日志", this.errorTage_clientLog, 200, "sendClinetError");
                this.isOpenLogsDebug = true;
            }
            else if (this._count >= 10) {
                this._count = 0;
                LogsManager.setLogGroupVisible(true);
                WindowManager_1.default.ShowTip("请不要频繁点击");
            }
        }
        else {
            this._count = 0;
        }
        this._prevTime = time;
    }
    static refreshLog() {
        var txt = LogsManager.txt;
        txt.text = LogsManager.setLogTxt();
        if (LogsManager.autoFlag)
            Laya.timer.once(30, this, () => {
                txt.scrollY = txt.maxScrollY;
            });
    }
    /**收到服务器push消息时，发送客户端日志，并显示log日志 */
    static sendAndShowLog() {
        this.sendErrorToPlatform("发送客户端错误日志", this.errorTage_clientLog, 200, "sendClinetError");
        LogsManager.setLogGroupVisible(true);
    }
    static setLogGroupVisible(visible) {
        if (visible) {
            this.isOpenLogsDebug = true;
        }
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_LOG)) {
            if (WindowManager_1.default.debugLayer.numChildren > 0) {
                WindowManager_1.default.debugLayer.removeChildAt(0);
                WindowManager_1.default.debugLayer.mouseEnabled = false;
                WindowManager_1.default.debugLayer.mouseThrough = true;
            }
        }
        if (visible && !GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_LOG_PANEL_DISABLE)) {
            // if (game.GameSwitch.checkOnOff(game.GameSwitch.SWITCH_LOG_PANEL)) //若已经显示
            if (LogsManager.logGroup.visible) //若已经显示
                return;
            GameSwitch_1.default.setOnOff(GameSwitch_1.default.SWITCH_LOG_PANEL, 1); //显示
            LogsManager.infoLabel.text = "rid:" + UserModel_1.default.instance.getUserRid() + "\nGlobalVer:" + Global_1.default.version;
            LogsManager.echo("console show");
            LogsManager.logGroup.visible = true;
            LogsManager.autoDisableFlag = true; //开启自动隐藏
            if (LogsManager.idTimeout) { //若已有定时器自动隐藏，定时器关闭
                TimerManager_1.default.instance.remove(LogsManager.idTimeout);
                LogsManager.idTimeout = null;
            }
            LogsManager.idTimeout = TimerManager_1.default.instance.add(() => {
                if (LogsManager.autoDisableFlag) { //自动隐藏开关未关闭
                    LogsManager.setLogGroupVisible(false);
                }
            }, this, 20000);
        }
        else {
            // if (!game.GameSwitch.checkOnOff(game.GameSwitch.SWITCH_LOG_PANEL)) //若已经隐藏
            if (!LogsManager.logGroup.visible) //若已经隐藏
                return;
            LogsManager.autoDisableFlag = false; //重置自动隐藏
            GameSwitch_1.default.setOnOff(GameSwitch_1.default.SWITCH_LOG_PANEL, 0); //隐藏
            LogsManager.echo("console hide");
            LogsManager.logGroup.visible = false;
            LogsManager.idTimeout = null;
        }
    }
    static getCircleId() {
        if (!this._circleId) {
            this._circleId = Global_1.default.deviceId + "_" + Laya.Browser.now() + Math.floor(Math.random() * 100000);
        }
        return this._circleId;
    }
}
exports.default = LogsManager;
LogsManager.logsArr = [];
//暂时最对存储1000行日志; 每次打印的日志 如果太长 需要分段截取.
// 服务器请求回来的数据 注意做一些消息过滤
LogsManager.maxCancheLength = 1000;
LogsManager._sendCache = {};
LogsManager.updateFlag = false;
LogsManager.autoDisableFlag = false;
LogsManager.idTimeout = null;
LogsManager.autoFlag = true;
LogsManager.statVis = false;
LogsManager.sendMaxLength = 10000;
LogsManager._aliyunLogsUrl = "https://client-error-log.cn-beijing.log.aliyuncs.com/logstores/client_error_log/track?APIVersion=0.6.0&";
LogsManager._aliyunStaUrl = "https://client-business-log.cn-beijing.log.aliyuncs.com/logstores/client_event_log/track?APIVersion=0.6.0&"; //打点数据
LogsManager._aliyunActiveUrl = "https://client-business-log.cn-beijing.log.aliyuncs.com/logstores/client_active_log/track?APIVersion=0.6.0&"; //打点数据-激活数据
LogsManager._aliyunLoadingUrl = "https://client-business-log.cn-beijing.log.aliyuncs.com/logstores/client_loading_log/track?APIVersion=0.6.0&"; //打点数据-记录时长
//系统界别的报错. 比如空属性
LogsManager.errorTag_sysError = "sys";
LogsManager.errorTag_gameError = "game";
LogsManager.errorTage_serverError = "server";
LogsManager.errorTage_clientLog = "clientLog";
LogsManager.errorTage_memoryWarning = "memoryWarning"; //内存警告
//忽略的log
LogsManager.ignoreLogs = ["1201", "1630", "1203", "arena_wordAppear", "arena_wordGuessRight"];
//自定义报错;
LogsManager.prevX = 0;
LogsManager.prevY = 0;
//是否打开日志调试
LogsManager.isOpenLogsDebug = false;
LogsManager._prevTime = 0;
LogsManager._count = 0;
class LabelRenderer extends Laya.Box {
    setLabel(txt) {
        this.label = new Laya.Label();
        this.size(50, 30);
        this.addChild(this.label);
        this.mouseThrough = false;
        this.label.text = txt;
        this.label.fontSize = 20;
    }
}
const GameSwitch_1 = require("../common/GameSwitch");
const TimerManager_1 = require("./TimerManager");
const Global_1 = require("../../utils/Global");
const WindowManager_1 = require("./WindowManager");
const StatisticsManager_1 = require("../../game/sys/manager/StatisticsManager");
const UserModel_1 = require("../../game/sys/model/UserModel");
const PackConfigManager_1 = require("./PackConfigManager");
const HttpMessage_1 = require("../common/HttpMessage");
const UserInfo_1 = require("../common/UserInfo");
const DeviceTools_1 = require("../utils/DeviceTools");
const GameConsts_1 = require("../../game/sys/consts/GameConsts");
const SingleCommonServer_1 = require("../server/SingleCommonServer");
const LogsErrorCode_1 = require("../consts/LogsErrorCode");
const Client_1 = require("../common/kakura/Client");
//# sourceMappingURL=LogsManager.js.map