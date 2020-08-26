"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const SwitchModel_1 = require("../model/SwitchModel");
const UserExtModel_1 = require("../model/UserExtModel");
const RolesModel_1 = require("../model/RolesModel");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const Client_1 = require("../../../framework/common/kakura/Client");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const CountsModel_1 = require("../model/CountsModel");
const ShopModel_1 = require("../model/ShopModel");
const TalentSkillsModel_1 = require("../model/TalentSkillsModel");
const SevenDayModel_1 = require("../model/SevenDayModel");
const DailyGoldModel_1 = require("../model/DailyGoldModel");
const PiecesModel_1 = require("../model/PiecesModel");
const FogModel_1 = require("../model/FogModel");
const ChapterModel_1 = require("../model/ChapterModel");
const TaskModel_1 = require("../model/TaskModel");
const ChatInfoModel_1 = require("../model/ChatInfoModel");
const WorkModel_1 = require("../model/WorkModel");
//本地模块和服务器数据映射表
class ModelToServerMap {
    constructor() {
    }
    static initModelToServerMap() {
        //服务器数据和本地模块映射表
        //注意优先级,比如 userModel一定要是第一个更新的
        /**
          * 这里的model 只能是user里面的数据. 如果usermodel下面没有这个模块数据,那么就是需要单独向服务器请求更新的模块,
          * 比如邮件或者好友系统,初始化的时候 不在user里面,需要手动请求 后面是单独更新
          */
        this.modelToServerMap = [
            { key: "user", model: UserModel_1.default },
            { key: "switches", model: SwitchModel_1.default },
            { key: "userExt", model: UserExtModel_1.default },
            { key: "roles", model: RolesModel_1.default },
            // { key: "skills", model: SkillModel },	//roles模块
            { key: "shops", model: ShopModel_1.default },
            { key: "work", model: WorkModel_1.default },
            { key: "counts", model: CountsModel_1.default },
            { key: "talentSkills", model: TalentSkillsModel_1.default },
            { key: "sign", model: SevenDayModel_1.default },
            { key: "dailyGold", model: DailyGoldModel_1.default },
            { key: "pieces", model: PiecesModel_1.default },
            { key: "fog", model: FogModel_1.default },
            { key: "chapter", model: ChapterModel_1.default },
            { key: "tasks", model: TaskModel_1.default },
            { key: "chatInfo", model: ChatInfoModel_1.default },
        ];
    }
    //根据游戏初始化去构造用户数据 根据游戏初始化构造
    static initBuildUserData() {
        //初始化构造数据必须带 sendTime,上一次存储的时间,默认是0 表示没有数据
        // return { sendTime: 0 }
        //初始体力
        var bornSp = GlobalParamsFunc_1.default.instance.getDataNum('bornSp');
        LogsManager_1.default.echo("krma. 构造初始数据");
        var homeId = GlobalParamsFunc_1.default.instance.getDataNum("bornHomeId");
        var baseRoleId = GlobalParamsFunc_1.default.instance.getDataNum("bornRoleId");
        var baseRole = {
            "id": baseRoleId,
            "level": 1,
            "inLine": 1
        };
        var baseHome = {
            "id": homeId,
            "level": 1,
            "inLine": 0
        };
        var data = {
            // accountUid: "",
            coin: GlobalParamsFunc_1.default.instance.getDataNum("bornCoin"),
            giftGold: GlobalParamsFunc_1.default.instance.getDataNum("bornGold"),
            hasUpdateData: false,
            userExt: {
                loginTime: Client_1.default.instance.serverTime,
                logoutTime: 3000000000,
                sp: bornSp,
                upSpTime: Client_1.default.instance.serverTime,
                lastSaveTime: Client_1.default.instance.serverTimeMicro,
                registTime: Client_1.default.instance.serverTime,
            },
            roles: {
                [baseRoleId]: baseRole
            },
            sendTime: 0,
            switches: {
                3: GlobalParamsFunc_1.default.instance.getDataNum("initialMusic") / 10000,
                4: GlobalParamsFunc_1.default.instance.getDataNum("initialSound") / 10000
            }
        };
        //如果震动的默认值配的不是1，那就默认是关闭震动 开关值为1是关闭
        if (GlobalParamsFunc_1.default.instance.getDataNum("initialShock") != 1) {
            data.switches[5] = 1;
        }
        data.roles[homeId] = baseHome;
        return data;
    }
}
exports.default = ModelToServerMap;
ModelToServerMap.modelToServerMap = [];
//# sourceMappingURL=ModelToServerMap.js.map