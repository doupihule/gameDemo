import ResourceManager from "../manager/ResourceManager";

export default class BaseFunc implements IMessage {

	//是否是合表的 默认为true, 那么全局只有2个表 globalTranslate 和 global
	public static isMergeConfig: boolean = true
	public static _globalConfigsName: string = "json/globalCfgs.json";
	public static _globalConfigsReviewName: string = "jsonreview/globalCfgs.json";
	public static _translateCfgsName: string = "json/translateCfgs.json"

	private static _globalConfigMap: any = {"DataResource": {"d": {"1": ["item", ""], "2": ["coin", "common_icon_jinbi"], "3": ["gold", ""], "4": ["physicalPowers", ""]}, "m": ["id", "name", "icon"], "t": 1}, "GlobalParams": {"d": {"autoCreateTime": [15000, "", ""], "beginHumanShareNmb": [10, "", ""], "bornCar": ["", "1", ""], "bornCoin": [10000, "", ""], "bornGold": [0, "", ""], "bornSp": [10, "", ""], "bulletFlySpeed": [3000, "", ""], "bulletTailFlyTime": [200, "", ""], "carAppearInterval": [1200, "", ""], "composeSiteUnlock": ["", "", ["302,502,304,504", "301,501,303,503,405", "301,501,303,503,305,505", "201,401,601,203,403,603,405", "201,401,601,203,403,603,305,505", "201,401,601,203,403,603,205,405,605", "101,301,501,701,103,303,503,703,305,505", "101,301,501,701,103,303,503,703,205,405,605", "101,301,501,701,103,303,503,703,105,305,505,705"]], "extraTurnPowerTime": [5000, "", ""], "falldownRatio": [2000, "", ""], "gravity": [600000, "", ""], "guideAgainTime": [1000, "", ""], "hitPlayerSlowDown": [200, "", ""], "levelSpCost": [1, "", ""], "maxChangeDirectionNum": [560, "", ""], "maxExtremeSpeedNum": [618, "", ""], "maxFlyNum": [591, "", ""], "maxLevel": [19, "", ""], "maxPowerNum": [516, "", ""], "maxSp": [10, "", ""], "maxStabilityNum": [515, "", ""], "reducedUnit": ["", "K,M,B,T,aa,bb,cc,dd,ee,ff,gg,hh,ii,jj,kk,ll,mm,nn,oo,pp,qq,rr,ss,tt,uu,vv,ww,xx,yy,zz,Aa,Bb,Cc,Dd,Ee,Ff,Gg,Hh,Ii,Jj", ""], "runSiteUnlock": ["", "", ["1", "1", "1", "4", "8", "10", "12", "14"]], "shadowSize": [3000, "", ""], "shareDayNmb": [5, "", ""], "shareTruePlayerNmb": [5, "", ""], "spPerAd": [3, "", ""], "spPerAdMaxNub": [50, "", ""], "spRestoreTime": [600, "", ""], "speedDivisor": [30000, "", ""], "startRatio": [500, "", ""]}, "m": ["id", "num", "string", "arr"], "t": 1}, "Guide": {"d": {"1": [1, "#tid_plot_1", 80, 1, 1, 0], "2": [1, "#tid_plot_2", 0, 1, 2, 0], "3": [1, "", 0, 1, 3, 0]}, "m": ["id", "type", "desc", "maskTransparency", "guideOrder", "littleOrder", "clickGoOn"], "t": 1}, "Level": {"d": {"1": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "10": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "11": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "12": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "13": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 4], "14": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "15": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 3], "16": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "17": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "18": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "19": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "2": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "20": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "21": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "22": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "23": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "24": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "25": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "26": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "27": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "28": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "29": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "3": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 3], "30": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "31": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "32": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "33": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "34": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "35": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "36": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "37": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "38": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "39": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "4": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "40": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "41": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "42": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "43": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "44": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "45": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "46": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "47": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "48": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "49": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "5": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "50": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "6": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 2], "7": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "8": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1], "9": ["scene_main_01", ["2,50", "2,100", "2,150"], 3, 1]}, "m": ["id", "map", "reward", "basisBulletNub", "threeStarPayBulletNub"], "t": 1}, "Share": {"d": {"1": {"1001": ["#tid_share_1001,https://m.qpic.cn/psb?/V11jcRIp1Um3sD/DQsWt4qbJS031LulqJSHnRYtEHJwiUGM3V1JLCHKG0E!/b/dFIBAAAAAAAA&bo=9AGQAfQBkAEDByI!&rf=viewer_4", "#tid_share_1001,https://m.qpic.cn/psb?/V11jcRIp1Um3sD/DQsWt4qbJS031LulqJSHnRYtEHJwiUGM3V1JLCHKG0E!/b/dFIBAAAAAAAA&bo=9AGQAfQBkAEDByI!&rf=viewer_4", 1000]}}, "k": ["id", "contentId"], "m": ["id", "contentId", "descWx", "descQq", "weight"], "t": 1}, "ShareTvOrder": {"d": {"1": [["1", "1", "0"]], "2": [["1", "1", "0"]], "3": [["1", "1", "0"]]}, "m": ["id", "order"], "t": 1}, "TranslateError": {"d": {"#error10000": ["NotOk message \u672a\u5b9a\u4e49", 1, "Unknown notok error"], "#error10001": ["\u53c2\u6570\u9519\u8bef", 1, "Param error"], "#error10003": ["token\u9519\u8bef", 1, "Token error"], "#error10004": ["uid\u9519\u8bef", 1, "Uid error"], "#error10005": ["\u7528\u6237\u540d\u5bc6\u7801\u9519\u8bef", 1, "Name or passwd error"], "#error10006": ["\u8d26\u53f7\u5c01\u505c", 1, "Ban login"], "#error10007": ["\u8d26\u53f7\u7981\u8a00", 1, "Ban chat"], "#error10009": ["\u591a\u70b9\u767b\u9646", 1, "Relogin error"], "#error10010": ["\u6a21\u677fid\u4e0d\u5b58\u5728", 1, "Dao not exists"], "#error10011": ["\u6a21\u677f\u6570\u636e\u9519\u8bef", 1, "Dao param error"], "#error10013": ["\u73a9\u5bb6\u7b49\u7ea7\u4e0d\u8db3", 1, "User level not enough"], "#error10014": ["\u7269\u54c1\u6570\u91cf\u4e0d\u8db3", 1, "Item not enough"], "#error10015": ["\u91d1\u5e01\u4e0d\u8db3", 1, "User coin not enough"], "#error10017": ["\u884c\u52a8\u529b\u4e0d\u8db3", 1, "User sp not enough"], "#error10018": ["\u7269\u54c1\u83b7\u5f97/\u6d88\u8017\u6765\u6e90\u9519\u8bef", 1, "Come from error"], "#error10020": ["\u7528\u6237\u51b7\u5374CD\u4e2d", 1, "User in cd"], "#error10021": ["\u7528\u6237\u65e0\u51b7\u5374CD", 1, "User no cd"], "#error10022": ["\u6b64\u7c7b\u578bCD\u65e0\u6cd5\u6e05\u9664", 1, "Cd can not clear"], "#error10023": ["\u6570\u636e\u8868\u9519\u8bef", 1, "Numeric error"], "#error10025": ["\u73a9\u5bb6\u4e0d\u5b58\u5728", 1, "User not exists"], "#error10028": ["\u5927\u533a\u4e0d\u5b58\u5728", 1, "Sec not exists"], "#error10036": ["\u65b9\u6cd5\u65e0\u6cd5\u4f7f\u7528", 1, "Function error"], "#error10037": ["server\u9519\u8bef", 1, "Server error"], "#error10038": ["token\u8fc7\u671f", 1, "Token expire"], "#error10041": ["config\u914d\u7f6e\u9519\u8bef", 1, "Config error"], "#error10043": ["\u8fde\u63a5URL\u4e0d\u5b58\u5728", 1, "Connection url miss"], "#error10044": ["\u6570\u91cf\u4e0d\u80fd\u4e3a0", 1, "Num can not zero"], "#error10045": ["\u5e73\u53f0\u9519\u8bef", 1, "Platform error"], "#error10046": ["\u542b\u6709\u7279\u6b8a\u5b57\u7b26", 1, "String illegal"], "#error10047": ["\u5b57\u7b26\u957f\u5ea6\u4e0d\u7b26", 1, "String length limit"], "#error10048": ["\u654f\u611f\u8bcd", 1, "Ban word"], "#error10050": ["httpError", 1, "Http request error"], "#error10051": ["ipError", 1, "Ip invalid"], "#error10053": ["\u670d\u52a1\u5668\u7ef4\u62a4", 1, "Sec maintain"], "#error10054": ["\u670d\u52a1\u5668\u5173\u95ed", 1, "Sec cloSe"], "#error10055": ["\u638c\u8da3sdk\u56de\u8c03error", 1, "Ourpalm bancallback error"], "#error10056": ["\u6ca1\u6709\u627e\u5230\u914d\u7f6e", 1, "Config not found"], "#error10057": ["\u6e20\u9053\u6821\u9a8c\u5931\u8d25", 1, "Verify error"], "#error10071": ["\u670d\u52a1\u5668\u914d\u7f6e\u9519\u8bef", 1, "Sec config error"], "#error10072": ["\u6682\u672a\u5f00\u670d\uff0c\u8bf7\u7a0d\u5019", 1, "Sec not open"], "#error10081": ["\u63a5\u53e3\u5df2\u88ab\u5c4f\u853d", 1, "Op hide"], "#error10085": ["accountUid\u9519\u8bef", 1, "Account uid error"], "#error10086": ["testAccount\u9519\u8bef", 1, "Test account error"], "#error10089": ["\u767b\u5f55\u6392\u961f", 1, "User need queue time"], "#error10090": ["\u6ce8\u518c\u8fbe\u5230\u4e0a\u9650", 1, "Register max"], "#error11001": ["\u65b9\u6cd5\u6ce8\u91ca\u6ca1\u6709\u6dfb\u52a0", 1, "Method doc not write"], "#error11002": ["\u7c7b\u6ce8\u91ca\u6ca1\u6709\u6dfb\u52a0", 1, "Ctrl doc not write"], "#error11003": ["OP\u6ca1\u6709\u5bf9\u5e94\u65b9\u6cd5", 1, "Actmap error op"], "#error110301": ["\u5f53\u524d\u73a9\u5bb6\u597d\u53cb\u6570\u5df2\u8fbe\u4e0a\u9650", 1, "Friend send count limit"], "#error110302": ["\u4e0d\u80fd\u5411\u81ea\u5df1\u53d1\u9001\u8bf7\u6c42", 1, "Friend sendUser cannot be self"], "#error110303": ["\u5f85\u53d1\u9001\u7533\u8bf7\u7684\u73a9\u5bb6\u5df2\u7ecf\u662f\u81ea\u5df1\u7684\u597d\u53cb", 1, "Friend sendUser is Friend"], "#error110304": ["\u5f85\u53d1\u9001\u7533\u8bf7\u7684\u73a9\u5bb6\u4e0d\u5b58\u5728", 1, "Friend sendUser not exits"], "#error110501": ["\u5f53\u524d\u73a9\u5bb6\u7684\u7533\u8bf7\u5217\u8868\u4e3a\u7a7a", 1, "Friend agree apply is empty"], "#error110502": ["\u597d\u53cb\u7684\u7533\u8bf7\u4e0d\u5b58\u5728", 1, "Friend agree apply not exists"], "#error110503": ["\u5f53\u524d\u73a9\u5bb6\u597d\u53cb\u6570\u5df2\u8fbe\u4e0a\u9650", 1, "Friend agree count limit"], "#error110504": ["\u5f85\u540c\u610f\u7533\u8bf7\u7684\u597d\u53cb\u73a9\u5bb6\u7684\u597d\u53cb\u6570\u5df2\u8fbe\u4e0a\u9650", 1, "Friend agreeUser count limit"], "#error110701": ["\u5f53\u524d\u73a9\u5bb6\u7684\u7533\u8bf7\u5217\u8868\u4e3a\u7a7a", 1, "Friend disagree apply is empty"], "#error110702": ["\u597d\u53cb\u7684\u7533\u8bf7\u4e0d\u5b58\u5728", 1, "Friend disagree apply not exists"], "#error110901": ["\u5f53\u524d\u73a9\u5bb6\u7684\u597d\u53cb\u5217\u8868\u4e3a\u7a7a", 1, "Friend Friends is empty"], "#error110902": ["\u5f85\u5220\u9664\u7684\u597d\u53cb\u4e0d\u5b58\u5728", 1, "Friend removeFriend not exists"], "#error15001": ["\u7b7e\u540d\u9a8c\u8bc1\u9519\u8bef", 1, "Authenticate error"], "#error150101": ["\u65e0\u6548\u7684\u53c2\u6570", 1, "Mail param error"], "#error150301": ["\u975e\u6cd5\u7684\u90ae\u4ef6id", 1, "Mail invalid id"], "#error150302": ["\u672a\u5230\u53d1\u9001\u65f6\u95f4", 1, "Mail future"], "#error150303": ["\u8fc7\u671f\u90ae\u4ef6", 1, "Mail expire"], "#error150304": ["\u5df2\u8bfb\u7684\u90ae\u4ef6", 1, "Mail read"], "#error150501": ["\u5df2\u9886\u7684\u90ae\u4ef6", 1, "Mail get"], "#error150502": ["\u65e0\u5956\u52b1\u7684\u90ae\u4ef6", 1, "Mail without reward"], "#error150901": ["\u6240\u6709\u90ae\u4ef6\u5168\u7a7a\u5374\u53d1\u51fa\u4e86\u4e00\u952e\u9886\u53d6\u8bf7\u6c42", 1, "Mail all mails read and get"], "#error160301": ["\u79c1\u804a\u4e0d\u80fd\u53d1\u9001\u7ed9\u81ea\u5df1", 1, "Chat can not be myself"], "#error170101": ["\u65e0\u53ef\u9886\u53d6\u7684\u4e03\u65e5\u5956\u52b1\u5374\u53d1\u51fa\u4e86\u9886\u53d6\u8bf7\u6c42", 1, "Sign invalid request"], "#error20101": ["\u8d26\u6237\u88ab\u5360\u7528", 1, "Create user passport already exist"], "#error20102": ["\u5bc6\u7801\u9519\u8bef", 1, "Password error"], "#error20501": ["\u6e20\u9053\u4fe1\u606f\u8868\u4e0d\u5b58\u5728", 1, "Channel account not exists"], "#error21301": ["\u5fae\u4fe1sdk\u767b\u5f55\u5931\u8d25", 1, "Wxsdk login error"], "#error21302": ["\u6e20\u9053\u6821\u9a8c\u7801\u5df2\u4f7f\u7528\uff0c\u8bf7\u91cd\u65b0\u83b7\u53d6\u6e20\u9053sdk", 1, ""], "#error21501": ["facebook\u7b7e\u540d\u8ba4\u8bc1\u5931\u8d25", 1, "Fb signature error"], "#error21701": ["qq token\u83b7\u53d6\u5931\u8d25", 1, ""], "#error21702": ["qq openid\u83b7\u53d6\u5931\u8d25", 1, ""], "#error21901": ["\u5934\u6761\u7528\u6237\u51ed\u8bc1\u9519\u8bef", 1, ""], "#error220101": ["qq\u8f7b\u6e38\u620f\u56de\u8c03\u9519\u8bef", 1, ""], "#error220102": ["qq\u8f7b\u6e38\u620f\u540e\u7aef\u8fd4\u56de\u9519\u8bef", 1, ""], "#error220103": ["qq\u8f7b\u6e38\u620f\u9053\u5177\u9519\u8bef", 1, ""], "#error22101": ["", "", ""], "#error22301": ["\u638c\u8da3sdk\u767b\u5f55\u5931\u8d25", 1, "Ourpalmsdk login error"], "#error30101": ["facebook\u8ba2\u5355\u7f13\u5b58\u51fa\u9519", 1, "Fborder cache error"], "#error30301": ["\u8ba2\u5355\u4e0d\u5b58\u5728", 1, "Fborder order not exist"], "#error34901": ["\u5ba2\u6237\u7aef\u9500\u6bc1dirtylist\u6570\u636e\u9519\u8bef", 1, ""], "#error9001": ["\u672a\u77e5\u9519\u8bef", 1, "Unknown"], "#error9002": ["\u53c2\u6570\u4e0d\u5bf9", 1, "Invalid param"], "#error9003": ["\u627e\u4e0d\u5230\u5bf9\u5e94\u7684\u53c2\u6570", 1, "Param not exist"], "#error9004": ["session\u51fa\u9519", 1, "Session error"], "#error9005": ["\u6570\u503c\u914d\u7f6e\u4e0d\u5b58\u5728", 1, "Numeric not exist"], "#error9006": ["model\u4e2d\u627e\u4e0d\u5230\u5bf9\u5e94\u7684\u5c5e\u6027\u503c", 1, "Property not exist"], "#error9007": ["\u65b9\u6cd5\u672a\u627e\u5230", 1, "Method not exist"], "#error9008": ["model\u5bf9\u5e94\u7684schema\u672a\u627e\u5230", 1, "Schema not found"], "#error9009": ["\u6570\u636e\u5e93\u64cd\u4f5c\u51fa\u9519", 1, "Mongo error"], "#error9010": ["\u7c7b\u672a\u5b9a\u4e49", 1, "Class not found"], "#error9011": ["\u6ca1\u6709\u627e\u5230\u914d\u7f6e", 1, "Config not found"], "#error9012": ["\u670d\u52a1\u5668\u4e0d\u652f\u6301redis", 1, "Redis not support"], "#error9013": ["\u903b\u8f91\u9519\u8bef", 1, "Logic error"], "#error9014": ["schema\u4e2d\u51fa\u9519", 1, "Schema error"], "#error9015": ["\u8be5\u5c5e\u6027\u4e0d\u80fd\u88ab\u4f7f\u7528", 1, "Property cannot use"], "#error9016": ["\u670d\u52a1\u6a21\u5f0f\u4e0d\u5b58\u5728", 1, "Mod not found"], "#error9017": ["", "", ""], "#error9018": ["\u901a\u8baf\u534f\u8bae\u53f7\u9519\u8bef", 1, "Op error"], "#error9019": ["\u9700\u8981\u5b9a\u4e49\u5e38\u91cf", 1, "Const need define"], "#error9020": ["db\u914d\u7f6e\u4e0d\u5b58\u5728", 1, "Dbparam not found"], "#error9021": ["model\u6ca1\u6709\u67e5\u8be2\u6761\u4ef6", 1, "Dbindex not found"], "#error9022": ["\u975e\u5f00\u53d1\u73af\u5883", 1, "Not dev env"], "#error9023": ["\u63a5\u53e3\u9700\u8981\u5b9e\u73b0", 1, "Abstract interface"], "#error9024": ["redis\u5bc6\u7801\u9519\u8bef", 1, "Redis password error"], "#error9025": ["\u7cfb\u7edf\u9519\u8bef", 1, "Process fork error"], "#error999712": ["\u6e38\u620f\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999713": ["\u6e38\u620f\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999714": ["\u6e38\u620f\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999715": ["\u6e38\u620f\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999716": ["\u6e38\u620f\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999720": ["\u6e38\u620f\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999721": ["\u7403\u573a\u6b63\u5728\u68c0\u4fee\uff0c\u8bf7\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999722": ["\u60a8\u7684\u8d26\u53f7\u5728\u5176\u4ed6\u8bbe\u5907\u767b\u5f55\uff0c\u8bf7\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999723": ["\u6e38\u620f\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999724": ["\u6e38\u620f\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999725": ["\u6e38\u620f\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85", 1, ""], "#error999726": ["\u53d1\u73b0\u65b0\u7248\u672c\uff0c\u8bf7\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""], "#error999727": ["\u6e38\u620f\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u8fdb\u5165\u6e38\u620f", 1, ""]}, "m": ["hid", "zh_CN", "state", "en_US"], "t": 1}, "TranslateGlobal": {"d": {"#tid_addPower_01": ["\u4f53\u529b\u4e0d\u8db3\uff0c\u662f\u5426\u89c2\u770b\u89c6\u9891\u5151\u6362#1\u70b9\u4f53\u529b\uff1f", ""], "#tid_attribute_1": ["\u4f24\u5bb3", ""], "#tid_attribute_2": ["\u5c04\u901f", ""], "#tid_attribute_3": ["\u5b50\u5f39\u901f\u5ea6", ""], "#tid_attribute_4": ["\u7a7f\u900f\u6027", ""], "#tid_attribute_5": ["\u7a33\u5b9a\u6027", ""], "#tid_attribute_6": ["\u5f39\u5939\u5bb9\u91cf", ""], "#tid_attribute_7": ["\u6362\u5f39\u65f6\u95f4", ""], "#tid_attribute_8": ["\u66b4\u51fb\u7387", ""], "#tid_attribute_9": ["\u66b4\u51fb\u4f24\u5bb3", ""], "#tid_battle_jiasu": ["\u7ffb\u8f6c\u52a0\u901f\u00d7#1", ""], "#tid_battle_lianji": ["\u8fde\u51fb\u00d7#1", ""], "#tid_coinNotEnough": ["\u91d1\u5e01\u4e0d\u8db3", ""], "#tid_goldNotEnough": ["\u94bb\u77f3\u4e0d\u8db3", ""], "#tid_power_01": ["\u4f53\u529b\u4e0d\u8db3\uff0c\u8bf7\u7a0d\u540e\u5c1d\u8bd5", ""], "#tid_role_maxlevel": ["\u8f66\u8f86\u5df2\u7ecf\u8fbe\u5230\u6700\u5927\u7b49\u7ea7", ""], "#tid_unlockCondition": ["\u901a\u5173#v1#\u5173\u89e3\u9501", ""]}, "m": ["id", "zh_CN", "en_US"], "t": 1}, "TranslateGuide": {"d": {"#tid_plot_1": ["\u957f\u6309\u5c4f\u5e55\uff01", ""], "#tid_plot_2": ["\u6ed1\u52a8\u7784\u51c6\uff0c\u677e\u624b\u5c04\u51fb\uff01", ""]}, "m": ["id", "zh_CN", "en_US"], "t": 1}, "TranslateMonster": {"d": {"#tid_npcname_1": ["\u6e05\u65b0\u67e0\u6aac"], "#tid_npcname_10": ["\u4e0d\u53ef\u78b0\u89e6\u7684\u4f24"], "#tid_npcname_100": ["\u4f0a\u99a8"], "#tid_npcname_101": ["\u751c\u751c"], "#tid_npcname_102": ["\u65e7\u57ce\u5c11\u5e74"], "#tid_npcname_103": ["\u5218\u4e09\u5e9f"], "#tid_npcname_104": ["\u63a7\u573a\u5b64\u738b"], "#tid_npcname_105": ["\u505a\u4f60\u6000\u4e2d\u7684\u732b"], "#tid_npcname_106": ["\u5076\u5c14\u5584\u826f"], "#tid_npcname_107": ["\u6728\u6797\u68ee"], "#tid_npcname_108": ["\u5973\u795e\u5ac1\u5230"], "#tid_npcname_109": ["\u8584\u8377\u5c11\u5e74\u886c\u8863\u60c5"], "#tid_npcname_11": ["\u803f\u6587\u6770"], "#tid_npcname_110": ["\u9c7c"], "#tid_npcname_111": ["\u9178\u751f"], "#tid_npcname_112": ["\u8def\u4eba\u7532"], "#tid_npcname_113": ["\u8043\u8f7b"], "#tid_npcname_114": ["\u4e8c\u6708\u60f3\u517b\u732b"], "#tid_npcname_115": ["\u949f\u7231\u54c7"], "#tid_npcname_116": ["\u5feb\u4e50\u5411\u524d\u51b2"], "#tid_npcname_117": ["\u5a5a\u59fb\u7ec8\u7ed3\u8005"], "#tid_npcname_118": ["\u5929\u4e0a\u7684\u4e91"], "#tid_npcname_119": ["\u707f\u82e5\u661f\u8fb0"], "#tid_npcname_12": ["\u96e8\u540e\u7684\u4ee5\u540e"], "#tid_npcname_120": ["\u6b32\u4e0e\u9c7c\u4f59\u8bed"], "#tid_npcname_121": ["\u5fc3\u51c9"], "#tid_npcname_122": ["\u591c\u8c93\u5b59\u919c"], "#tid_npcname_123": ["\u97f3\u821e"], "#tid_npcname_124": ["\u5fc3\u5974\u72ec\u4f24"], "#tid_npcname_125": ["Trace"], "#tid_npcname_126": ["\u4eba\u6765\u75af"], "#tid_npcname_127": ["\u7a0b\u5927\u70ae"], "#tid_npcname_128": ["\u68a6\u5fc6\u4e4b\u521d"], "#tid_npcname_129": ["\u4f59\u7b19"], "#tid_npcname_13": ["\u65c5\u9014"], "#tid_npcname_130": ["\u5b64\u50b2"], "#tid_npcname_131": ["\u590f\u5929"], "#tid_npcname_132": ["Decease"], "#tid_npcname_133": ["\u547d\u4e2d\u6ce8\u5b9a"], "#tid_npcname_134": ["\u5fc3\u7075\u611f\u5e94"], "#tid_npcname_135": ["\u6545\u4e8b"], "#tid_npcname_136": ["\u4e0d\u7f81"], "#tid_npcname_137": ["\u725b\u5976\u5496\u5561"], "#tid_npcname_138": ["\u8d85\u7ea7\u9f99\u5ba0"], "#tid_npcname_139": ["\u542c\u98ce"], "#tid_npcname_14": ["\u6bcf\u4e00\u5929"], "#tid_npcname_140": ["\u4ece\u5bb9"], "#tid_npcname_141": ["\u4f55\u7b49\u6069\u5178"], "#tid_npcname_142": ["talina"], "#tid_npcname_143": ["\u6850\u6850"], "#tid_npcname_144": ["\u4f60\u4e11\u5230\u6211\u4e86"], "#tid_npcname_145": ["\u5fae\u7b11\u7684\u6cea"], "#tid_npcname_146": ["\u7d2b\u68a6\u51cc\u4e91"], "#tid_npcname_147": ["\u8881\u73ca"], "#tid_npcname_148": ["\u55b5\u661f\u4eba"], "#tid_npcname_149": ["\u9ed4"], "#tid_npcname_15": ["\u6211\u65e0\u8bed\u4e86"], "#tid_npcname_150": ["\u83f2\u513f"], "#tid_npcname_151": ["\u6211\u7684\u4e8b\u4f60\u7ba1\u4e0d\u7740"], "#tid_npcname_152": ["\u9694\u58c1\u8001\u738b"], "#tid_npcname_153": ["\u58a8\u8bb8"], "#tid_npcname_154": ["\u98d8\u6447"], "#tid_npcname_155": ["\u554a\u554a\u554a"], "#tid_npcname_156": ["\u603b\u6709\u5201\u6c11\u8c0b\u5bb3\u6715"], "#tid_npcname_157": ["\u845b\u845b"], "#tid_npcname_158": ["\u5c0f\u80a5\u8138"], "#tid_npcname_159": ["\u6e14\u4eba"], "#tid_npcname_16": ["\u66fe\u5c0f\u9f99"], "#tid_npcname_160": ["\u8d85\u7ea7\u82f1\u96c4"], "#tid_npcname_161": ["\u51e0\u4e2a\u4f60"], "#tid_npcname_162": ["\u4f0a\u5439\u4e94\u6708\u96ea"], "#tid_npcname_163": ["\u4e00\u543b\u8352\u80e1"], "#tid_npcname_164": ["\u4e11\u624d\u6d3b\u5f97\u4e45"], "#tid_npcname_165": ["\u9152\u7b19\u6e05\u6800"], "#tid_npcname_166": ["\u609f\u7a7a"], "#tid_npcname_167": ["\u6ca1\u6709\u5bb6\u7684\u4eba"], "#tid_npcname_168": ["only\u5218\u5c0f\u82b1"], "#tid_npcname_169": ["\u9152\u8bdd\u9189\u4eba\u5fc3"], "#tid_npcname_17": ["\u56db\u53f6\u8349\u96ea\u8389"], "#tid_npcname_170": ["\u6a31\u82b1\u4e0b\u7684\u9e7f\u6657"], "#tid_npcname_171": ["\u5e26\u4e0a\u6df1\u84dd\u7f8e\u77b3"], "#tid_npcname_172": ["\u5c0f\u5b9d\u5b9d"], "#tid_npcname_173": ["\u7a7a\u68a6"], "#tid_npcname_174": ["\u534e\u5965\u535a"], "#tid_npcname_175": ["\u73ae\u73ae\u52a8\u542c"], "#tid_npcname_176": ["\u4e0d\u5177\u540d\u7684\u60b2\u5267"], "#tid_npcname_177": ["\u8fdf\u5230\u7684\u8bb0\u5fc6"], "#tid_npcname_178": ["\u51b7\u6f20\u6dec\u70bc\u9ad8\u60c5\u5546"], "#tid_npcname_179": ["\u51b7\u8840\u732b\u738b"], "#tid_npcname_18": ["Spare"], "#tid_npcname_180": ["\u6e38\u620f\u4eba\u95f4"], "#tid_npcname_181": ["\u76f8\u6fe1\u4ee5\u6cab"], "#tid_npcname_182": ["\u897f\u65bd"], "#tid_npcname_183": ["\u5f20\u9896\u742a"], "#tid_npcname_184": ["\u96e8\u96ea\u970f\u970f"], "#tid_npcname_185": ["\u822c\u82e5"], "#tid_npcname_186": ["\u5f20\u5609\u9896"], "#tid_npcname_187": ["\u6843\u6843"], "#tid_npcname_188": ["\u8292\u679c\u8349\u8393"], "#tid_npcname_189": ["\u91d1\u68a6\u4eba\u751f"], "#tid_npcname_19": ["\u8d85\u795e\u7684\u6211"], "#tid_npcname_190": ["\u9e7f\u5df7\u5c0f\u9547"], "#tid_npcname_191": ["\u4e91\u837c"], "#tid_npcname_192": ["\u719f\u6089\u7684\u964c\u751f\u4eba"], "#tid_npcname_193": ["\u5049\u5049"], "#tid_npcname_194": ["\u5b64\u5355\u62b1\u6795"], "#tid_npcname_195": ["\u6cb3\u73c2\u67ef"], "#tid_npcname_196": ["\u516b\u5144\u5f1f\u9152\u4e1a"], "#tid_npcname_197": ["\u60dc\u5b57\u5982\u91d1"], "#tid_npcname_198": ["\u5b64\u5bc2"], "#tid_npcname_199": ["\u5927\u5c71\u731b"], "#tid_npcname_2": ["\u5927\u7231\u95fa\u871c"], "#tid_npcname_20": ["doge"], "#tid_npcname_200": ["\u4e00\u7247\u5929"], "#tid_npcname_201": ["Lee"], "#tid_npcname_202": ["Izefia"], "#tid_npcname_203": ["\u535a\u60c5"], "#tid_npcname_204": ["\u5929\u56fd"], "#tid_npcname_205": ["Dr"], "#tid_npcname_206": ["\u840c\u840c\u8fbe"], "#tid_npcname_207": ["\u4eae\u6676\u6676"], "#tid_npcname_208": ["\u552f\u4f0a"], "#tid_npcname_209": ["\u90a3\u7247\u661f\u7a7a\u90a3\u7247\u6d77"], "#tid_npcname_21": ["\u90ed\u6b23\u513f"], "#tid_npcname_210": ["\u6de1"], "#tid_npcname_211": ["\u957f\u5f81\u4e03\u53f7"], "#tid_npcname_212": ["Akoasm"], "#tid_npcname_213": ["\u5929\u775b"], "#tid_npcname_214": ["\u868a\u5b50"], "#tid_npcname_215": ["\u7d2b\u5fc3\u82b1\u6d77\u60c5"], "#tid_npcname_216": ["\u8001\u53f8\u673a"], "#tid_npcname_217": ["\u80a5\u80a5"], "#tid_npcname_218": ["\u5c0f\u672c"], "#tid_npcname_219": ["\u5c0f\u5189"], "#tid_npcname_22": ["\u8001\u8872\u5316\u4e2a\u7f18"], "#tid_npcname_220": ["\u6d77\u6770"], "#tid_npcname_221": ["\u6db5\u73b2"], "#tid_npcname_222": ["\u8def\u8fc7"], "#tid_npcname_223": ["\u795e\u533b\u795e\u5dde\u884c"], "#tid_npcname_224": ["\u611b\u59b3\u5230\u6c38\u9060"], "#tid_npcname_225": ["\u770b\u4f60\u90a3\u50bb\u6837"], "#tid_npcname_226": ["\u77ac\u9593\u7684\u56de\u61b6"], "#tid_npcname_227": ["\u6709\u4f60\u5c31\u597d"], "#tid_npcname_228": ["\u8352\u57ce\u65e7\u68a6"], "#tid_npcname_229": ["\u5fc3\u8bed"], "#tid_npcname_23": ["\u6df7\u4e16\u5c0f\u9b54\u738b"], "#tid_npcname_230": ["\u5982\u68a6\u4e4b\u68a6"], "#tid_npcname_231": ["\u8c46\u6d46\u6cb9\u6761"], "#tid_npcname_232": ["\u5fc3\u4f3c\u84dd\u5929\u8fde\u6210\u6d77"], "#tid_npcname_233": ["\u5357\u521d"], "#tid_npcname_234": ["\u5c0f\u7cbe\u7075"], "#tid_npcname_235": ["W\u4e11\u4e2b\u5934L"], "#tid_npcname_236": ["\u505a\u68a6\u7684\u5b63\u8282"], "#tid_npcname_237": ["\u521d\u73b0\u7684\u79cb\u5929"], "#tid_npcname_238": ["\u800c\u6e29\u67d4"], "#tid_npcname_239": ["\u5f00\u4e49"], "#tid_npcname_24": ["\u6233\u7237"], "#tid_npcname_240": ["\u4e0d\u518d\u72b9\u8c6b"], "#tid_npcname_241": ["\u5b64\u75de"], "#tid_npcname_242": ["\u4e2d\u4e8c\u75c5"], "#tid_npcname_243": ["\u6211\u884c\u6211\u7d20"], "#tid_npcname_244": ["\u9752\u5c71\u8ffd\u68a6\u4eba"], "#tid_npcname_245": ["\u4f59\u5149\u745e\u96ea\u5988\u5988"], "#tid_npcname_246": ["\u660a\u660a\u738b\u5b50"], "#tid_npcname_247": ["\u7231\u5df2\u51b0\u5c01"], "#tid_npcname_248": ["\u6708"], "#tid_npcname_249": ["\u963f\u82f1"], "#tid_npcname_25": ["\u57f9\u6770\u4e07\u5c81"], "#tid_npcname_250": ["\u7231\u5979\u4e0d\u662f\u9519"], "#tid_npcname_251": ["\u68a6\u5e7b\u7684\u5c0f\u732b"], "#tid_npcname_252": ["\u56de\u4e0d\u53bb\u7684\u65f6\u5149"], "#tid_npcname_253": ["\u9759\u9759\u5b88\u62a4"], "#tid_npcname_254": ["\u4fee"], "#tid_npcname_255": ["\u521d\u5fc3\u53ef\u66fe\u8bb0"], "#tid_npcname_256": ["\u6b23\u7476"], "#tid_npcname_257": ["\u5bb6\u6709\u95f9\u95f9"], "#tid_npcname_258": ["\u6625\u5929\u7684\u96e8"], "#tid_npcname_259": ["\u7ea2\u53f6\u5b50"], "#tid_npcname_26": ["\u5b89\u5b88\u65e7\u68a6"], "#tid_npcname_260": ["\u8caa\u6b22"], "#tid_npcname_261": ["\u5251\u9053\u65e0\u75d5"], "#tid_npcname_262": ["\u9ed1\u5c71\u8001\u602a"], "#tid_npcname_263": ["\u827e\u7c73"], "#tid_npcname_264": ["\u7b71\u7b71"], "#tid_npcname_265": ["\u4f60\u53ea\u80fd\u662f\u6211\u7684"], "#tid_npcname_266": ["\u65e0\u6781\u65e0\u5fcc"], "#tid_npcname_267": ["Ellina"], "#tid_npcname_268": ["\u5e06\u5e06"], "#tid_npcname_269": ["\u77ed\u53d1\u59d1\u5a18\u5766\u8361\u8361"], "#tid_npcname_27": ["\u51b0\u96ea\u4e4b\u68a6"], "#tid_npcname_270": ["\u8ff7\u832b\u7684\u4eba\u751f"], "#tid_npcname_271": ["\u5b66\u4e0d\u4f1a\u4f2a\u88c5"], "#tid_npcname_272": ["\u516b\u5366\u5b69\u7eb8"], "#tid_npcname_273": ["\u6845\u5b50\u82b1\u5f00\u843d"], "#tid_npcname_274": ["\u9c7c\u4ebf\u6d77\u4e03\u79d2"], "#tid_npcname_275": ["\u7eff\u9ca4\u9c7c\u4e0e\u9a74"], "#tid_npcname_276": ["\u6d6e\u534e\u5982\u58a8"], "#tid_npcname_277": ["\u5c0f\u60a6\u60a6"], "#tid_npcname_278": ["\u5218\u989c"], "#tid_npcname_279": ["\u5f20\u8587"], "#tid_npcname_28": ["\u9065\u77e5\u5144\u5f1f"], "#tid_npcname_280": ["\u9ec4\u632f\u5cf0"], "#tid_npcname_281": ["\u718a\u5927"], "#tid_npcname_282": ["\u5b64\u72ec\u60a3\u8005"], "#tid_npcname_283": ["\u88ab\u9057\u5fd8\u7684\u66fe\u7ecf"], "#tid_npcname_284": ["\u98ce\u4e4b\u7a7a"], "#tid_npcname_285": ["\u9177 "], "#tid_npcname_286": ["\u6751\u53e3\u7684\u8c46\u8150\u4e1c\u65bd"], "#tid_npcname_287": ["\u6f5c\u9f99\u98ce\u4e91"], "#tid_npcname_288": ["\u6d45\u5531"], "#tid_npcname_289": ["\u6c34\u4e4b\u97f5\u738b\u6653\u598d"], "#tid_npcname_29": ["\u5b8c\u7f8e\u4eba\u751f"], "#tid_npcname_290": ["AUG"], "#tid_npcname_291": ["\u7389\u7c73"], "#tid_npcname_292": ["\u6cea\u67d3\u503e\u57ce"], "#tid_npcname_293": ["\u5b89\u9759\u5b89\u9759"], "#tid_npcname_294": ["\u6b63\u7ecf\u8fc7\u4eba\u95f4"], "#tid_npcname_295": ["Tepid"], "#tid_npcname_296": ["\u987a\u6e9c"], "#tid_npcname_297": ["\u76db\u590f\u6d41\u5e74"], "#tid_npcname_298": ["\u5b89\u6613\u7b71"], "#tid_npcname_299": ["\u94b1\u8fea"], "#tid_npcname_3": ["\u96e8\u83f2"], "#tid_npcname_30": ["\u6587\u86e4\u6025"], "#tid_npcname_300": ["\u751c\u5ae3\u871c\u8bed"], "#tid_npcname_301": ["\u51af\u542f\u822a"], "#tid_npcname_302": ["\u5929\u4e66\u5947\u8c08"], "#tid_npcname_303": ["\u5f6c\u5f6c\u6709\u793c"], "#tid_npcname_304": ["\u5357\u6773"], "#tid_npcname_305": ["\u5b64\u72ec\u6210\u763e"], "#tid_npcname_306": ["\u5982\u82e5\u4e0d\u89c1\u4ea6\u4e0d\u5ff5"], "#tid_npcname_307": ["\u5361\u5361\u897f\u7684\u8111\u6b8b\u7c89"], "#tid_npcname_308": [" \u54e6"], "#tid_npcname_309": ["\u79bb\u6b4c"], "#tid_npcname_31": ["Q\u9178\u5c0f\u67e0\u6aac"], "#tid_npcname_310": ["\u7ec8\u5176\u4e00\u751f\u552f\u7231\u4f60"], "#tid_npcname_311": ["\u590f\u591c"], "#tid_npcname_312": ["\u738b\u6167"], "#tid_npcname_313": ["\u53e4\u5c0f\u971e"], "#tid_npcname_314": ["\u6d1b\u51cc"], "#tid_npcname_315": ["\u9716"], "#tid_npcname_316": ["\u6df1\u5b58\u4e0d\u53ca\u4e45\u4f34"], "#tid_npcname_317": ["\u957f\u817f\u6b27\u5df4"], "#tid_npcname_318": ["\u4e00\u8def\u5411\u6696"], "#tid_npcname_319": ["\u82cf\u683c\u62c9\u5e95"], "#tid_npcname_32": ["\u8fc1\u57ce"], "#tid_npcname_320": ["\u7d2b\u8272\u68a6\u60f3"], "#tid_npcname_321": ["\u8485\u7b71\u6cfd"], "#tid_npcname_322": ["HAPPY"], "#tid_npcname_323": ["\u6298\u679d"], "#tid_npcname_324": ["\u5b9d\u8d1d\u8fc7\u6765\u7ed9\u4f60\u84dd"], "#tid_npcname_325": ["\u4f60\u4eec\u79bb\u6211\u8fdc\u70b9"], "#tid_npcname_326": ["\u6613\u76f4\u8fd9\u70ca\u73ba\u6b22\u4f60"], "#tid_npcname_327": ["\u7fe0\u5220\u5b9d\u8d1d"], "#tid_npcname_328": ["\u5c0f\u7cef\u7c73"], "#tid_npcname_329": ["\u9752\u6625\u5149\u8292"], "#tid_npcname_33": ["\u94b1\u60e0"], "#tid_npcname_330": ["Avril"], "#tid_npcname_331": ["\u795e\u7ecf\u5230\u95e8\u91cc"], "#tid_npcname_332": ["\u96e8\u843d\u5f26\u65ad"], "#tid_npcname_333": ["\u7a0b\u6893\u5e0c"], "#tid_npcname_334": ["\u5929\u4f7f\u4e4b\u5149"], "#tid_npcname_335": ["\u96ea\u6a31\u82b1"], "#tid_npcname_336": ["\u6eba\u4e8e\u4f60\u5fc3\u6d77"], "#tid_npcname_337": ["\u6000\u62b1\u6740"], "#tid_npcname_338": ["\u8bf4\u597d\u7684\u5e78\u798f\u5462"], "#tid_npcname_339": ["Dleihs"], "#tid_npcname_34": ["\u5f80\u5e74"], "#tid_npcname_340": ["\u6c99\u66b4\u6211\u7231\u7f57"], "#tid_npcname_341": ["\u5c0f\u5e7a\u9e21"], "#tid_npcname_342": ["\u6c99\u6f20\u73ab\u7470"], "#tid_npcname_343": ["\u8328\u6728\u7ae5\u5b50"], "#tid_npcname_344": ["\u91ce\u86ee\u5c0f\u53ef\u7231"], "#tid_npcname_345": ["\u767e\u9b3c\u591c\u884c"], "#tid_npcname_346": ["\u5462\u4e2a\u8c01"], "#tid_npcname_347": ["\u5eb8\u4fd7"], "#tid_npcname_348": ["\u6700\u50bb\u7684\u7537\u4eba"], "#tid_npcname_349": ["\u62b1\u7740\u5ae6\u5a25\u70e4\u7389\u5154"], "#tid_npcname_35": ["\u5355\u4e8e\u6c38\u4e30"], "#tid_npcname_350": ["\u5c4c\u4e1d\u7684\u7231"], "#tid_npcname_351": ["\u6e05\u98ce\u8d64\u51b7"], "#tid_npcname_352": ["Chen"], "#tid_npcname_353": ["Ev"], "#tid_npcname_354": ["\u7f9e\u82b1\u95ed\u6708"], "#tid_npcname_355": ["\u6d6a\u6f2b\u82b1\u8c22"], "#tid_npcname_356": ["\u667a\u969c\u5c0f\u59d0\u59d0"], "#tid_npcname_357": ["\u67d2\u5df7\u7396\u8c93"], "#tid_npcname_358": ["\u82b1\u5f00\u666f\u5e74"], "#tid_npcname_359": ["jiuan"], "#tid_npcname_36": ["\u9999\u8549\u4f60\u4e2a\u5df4\u62c9"], "#tid_npcname_360": ["\u65b0\u624b\u4e0a\u8def"], "#tid_npcname_361": ["Simon"], "#tid_npcname_362": ["Junce"], "#tid_npcname_363": ["Zella"], "#tid_npcname_364": ["JacksonYee"], "#tid_npcname_365": ["\u4e2d\u4e8c\u75c5\u7684\u738b\u8005"], "#tid_npcname_366": ["\u7ad9\u8857\u59b9"], "#tid_npcname_367": ["\u4f60\u7684\u57ce\u5e02"], "#tid_npcname_368": ["\u8424\u5149\u68d2"], "#tid_npcname_369": ["\u9b3c\u6ce3"], "#tid_npcname_37": ["\u675c\u654f"], "#tid_npcname_370": ["\u5bb9\u6eaa"], "#tid_npcname_371": ["\u66b4\u8d70\u82ad\u6bd4"], "#tid_npcname_372": ["\u5706\u5706\u5927\u897f\u74dc"], "#tid_npcname_373": ["\u5de6\u80a9"], "#tid_npcname_374": ["\u6781\u9650\u738b\u8005"], "#tid_npcname_375": ["\u51b0\u9c7c\u70ab\u821e"], "#tid_npcname_376": ["\u4e00\u9e7f\u4f34\u6657"], "#tid_npcname_377": ["HJY"], "#tid_npcname_378": ["\u5df4\u5c14\u5e72\u534a\u5c9b"], "#tid_npcname_379": ["\u63e1\u4e0d\u4f4f\u7684\u6d41\u6c99"], "#tid_npcname_38": ["\u4e00\u5207\u4e3a\u7761\u89c9"], "#tid_npcname_380": ["Rude"], "#tid_npcname_381": ["\u4eca\u665a\u6253\u8001\u864e"], "#tid_npcname_382": ["\u99ac\u5458\u5916"], "#tid_npcname_383": ["\u4eba\u9c7c"], "#tid_npcname_384": ["\u5b50\u521d"], "#tid_npcname_385": ["\u65e0\u4eba\u61c2"], "#tid_npcname_386": ["\u5403\u732b\u7684\u9c7c"], "#tid_npcname_387": ["ssssss"], "#tid_npcname_388": ["\u5c11\u5973\u4e0d\u77e5\u8981\u6d41\u6cea"], "#tid_npcname_389": ["\u53ef\u60dc\u6211\u662f\u6c34\u74f6\u5ea7"], "#tid_npcname_39": ["\u68a6\u9192\u6a31\u843d\u82b1\u6b8b"], "#tid_npcname_390": ["\u84dd\u6a31\u82b1"], "#tid_npcname_391": ["\u8d85\u795e\u738b\u8005"], "#tid_npcname_392": ["\u6708\u6717\u661f\u7a00"], "#tid_npcname_393": ["\u5403\u4e86\u4f60\u7684\u540d\u5b57"], "#tid_npcname_394": ["21\u514b\u7684\u7231"], "#tid_npcname_395": ["\u82b1\u751f\u4e86\u4ec0\u4e48\u6811"], "#tid_npcname_396": ["G9"], "#tid_npcname_397": ["\u53ee\u53ee"], "#tid_npcname_398": ["\u963f\u8336"], "#tid_npcname_399": ["\u963f\u79bb"], "#tid_npcname_4": ["\u91cd\u88c5\u5361\u8f66"], "#tid_npcname_40": ["\u4f60\u5988\u54aa"], "#tid_npcname_400": ["\u963f\u745c"], "#tid_npcname_41": ["\u65e0\u8bdd\u53ef\u8bf4"], "#tid_npcname_42": ["\u5fd7\u5728\u5fc5\u5f97"], "#tid_npcname_43": ["\u60f3\u8981\u5eb7\u5eb7"], "#tid_npcname_44": ["\u840c\u840c\u5973\u4fa0"], "#tid_npcname_45": ["\u6bd4\u5df4\u535c"], "#tid_npcname_46": ["\u5c71\u6709\u6728\u516e\u6728\u6709\u679d"], "#tid_npcname_47": ["14\u53f7\u6f58\u6587\u4fca"], "#tid_npcname_48": ["vanilla"], "#tid_npcname_49": ["\u8fea\u4e3d\u70ed\u5df4"], "#tid_npcname_5": ["\u5e7d\u6697\u4e4b\u7075"], "#tid_npcname_50": ["\u77ed\u8116\u5b50\u7684\u957f\u9888\u9e7f"], "#tid_npcname_51": ["\u738b\u724c\u5f20\u5927\u5927"], "#tid_npcname_52": ["XULIN"], "#tid_npcname_53": ["\u6e29\u99a8\u4f60\u6211"], "#tid_npcname_54": ["\u554a\u91cc\u5df4\u5df4"], "#tid_npcname_55": ["\u6708\u4f34\u5982\u661f"], "#tid_npcname_56": ["\u827e\u7490"], "#tid_npcname_57": ["\u6df1\u591c\u7684\u661f\u5149"], "#tid_npcname_58": ["\u5f20\u4e00\u9e23"], "#tid_npcname_59": ["\u66fe\u5927\u5927"], "#tid_npcname_6": ["\u4f9d\u9510"], "#tid_npcname_60": ["\u86cb\u86cb\u7684\u5fe7\u6851"], "#tid_npcname_61": ["\u67e0\u6aac\u4e3a\u4f55\u5fc3\u9178"], "#tid_npcname_62": ["\u67e0\u6aac\u9cb8"], "#tid_npcname_63": ["\u53ef\u7231\u7684\u5c0f\u516c\u4e3b"], "#tid_npcname_64": ["\u8f6f\u9897\u8349\u8393"], "#tid_npcname_65": ["\u968f\u98ce\u800c\u884c"], "#tid_npcname_66": ["\u94b0"], "#tid_npcname_67": ["\u767d\u4e45"], "#tid_npcname_68": ["\u73cd\u73e0\u4f73\u4eba"], "#tid_npcname_69": ["\u75db\u4e60\u60ef\u4e86"], "#tid_npcname_7": ["\u68a6\u7b63\u838e"], "#tid_npcname_70": ["\u6709\u75c5\u5c31\u5f97\u6cbb"], "#tid_npcname_71": ["\u73ab\u7470\u4e4b\u7ea6"], "#tid_npcname_72": ["\u7f8e\u4e3d\u65f6\u5149"], "#tid_npcname_73": ["\u88ab\u8ba8\u538c\u7684\u52c7\u6c14"], "#tid_npcname_74": ["healer"], "#tid_npcname_75": ["\u590f\u6cab"], "#tid_npcname_76": ["\u7ec8\u7ed3\u8005"], "#tid_npcname_77": ["\u4e0d\u53ca"], "#tid_npcname_78": ["\u5657\u5657"], "#tid_npcname_79": ["\u60a0\u7136"], "#tid_npcname_8": ["\u738b\u4f2f\u6e0a"], "#tid_npcname_80": ["ibanlie"], "#tid_npcname_81": ["\u9759\u9759\u7684\u7af9\u6797"], "#tid_npcname_82": ["\u591a\u60c5\u5fc5\u81ea\u6bd9"], "#tid_npcname_83": ["\u4f60\u4ece\u672a\u79bb\u53bb"], "#tid_npcname_84": ["\u884d\u590f\u6210\u6b4c"], "#tid_npcname_85": ["\u8d64\u9053\u4e0e\u5317\u6781"], "#tid_npcname_86": ["\u5728\u96e8\u6797\u4e2d\u6f2b\u6b65"], "#tid_npcname_87": ["\u9ad8\u542b\u6684\u7684\u674e\u7fa4"], "#tid_npcname_88": ["\u68a6\u5e7b\u7cbe\u7075"], "#tid_npcname_89": ["\u9ed1\u4e91\u7ffb\u9ed8"], "#tid_npcname_9": ["\u675c\u5fc3\u61ff"], "#tid_npcname_90": ["\u7b49\u4f60\u5f52"], "#tid_npcname_91": ["\u82e6\u6da9\u5496\u5561"], "#tid_npcname_92": ["\u738b\u4fca\u51ef"], "#tid_npcname_93": ["\u5a9b\u5a9b"], "#tid_npcname_94": ["\u6bd2\u86c7\u9879\u94fe"], "#tid_npcname_95": ["\u738b\u541b\u8389"], "#tid_npcname_96": ["\u4fe1\u5f92"], "#tid_npcname_97": ["\u8bb0\u5fc6\u7684\u5962\u534e"], "#tid_npcname_98": ["\u5c0f\u83e0\u83dc"], "#tid_npcname_99": ["\u7d2b\u964c\u661f\u7a7a"]}, "m": ["id", "zh_CN"], "t": 1}, "TranslateRole": {"d": {"#tid_car_1": ["\u840c\u840c", ""], "#tid_car_10": ["\u6697\u591c\u7cbe\u7075", ""], "#tid_car_11": ["\u5251\u5f71", ""], "#tid_car_12": ["\u97f3\u901f\u6218\u795e", ""], "#tid_car_2": ["\u5c0fQ\u5427", ""], "#tid_car_3": ["Cooper Mini", ""], "#tid_car_4": ["\u91cd\u88c5\u5361\u8f66", ""], "#tid_car_5": ["\u5927\u9ec4\u8702", ""], "#tid_car_6": ["\u5f00\u62d3\u8005", ""], "#tid_car_7": ["\u9b45\u5f71", ""], "#tid_car_8": ["\u70c8\u65e5", ""], "#tid_car_9": ["\u7279\u65af\u62c9", ""], "#tid_car_desc_1": ["\n  \u5c0f\u5de7\u7684\u5bb6\u7528\u4ee3\u6b65\u8f66\uff0c\u52a8\u529b\u5e73\u7a33\u5747\u8861", ""], "#tid_car_desc_10": ["\n  \u6765\u65e0\u5f71\u53bb\u65e0\u8e2a\uff0c\u662f\u9ed1\u591c\u91cc\u9b3c\u9b45\u7684\u7cbe\u7075\uff0c\u6d41\u7ebf\u578b\u8f66\u8eab\u548c\u6982\u5ff5\u8f66\u80ce\u7684\u642d\u914d\uff0c\u5c06\u963b\u529b\u964d\u5230\u6700\u4f4e", ""], "#tid_car_desc_11": ["\n  \u5251\u5f71\u65e0\u5f62\uff0c\u5982\u5f71\u968f\u98ce\uff0c\u7cbe\u51c6\u7684\u64cd\u63a7\u548c\u5f3a\u5927\u7684\u7206\u53d1\u529b\u4e5f\u5145\u5206\u4f53\u73b0\u4e86\u6b66\u58eb\u9053\u7cbe\u795e", ""], "#tid_car_desc_12": ["\n  \u706b\u7130\u822c\u7684\u8f66\u8eab\u642d\u914d\u8d85\u5f3a\u8010\u70ed\u5f15\u64ce\uff0c\u52bf\u5fc5\u71c3\u5c3d\u8d5b\u573a\uff0c\u6495\u88c2\u4e00\u5207\u963b\u788d", ""], "#tid_car_desc_2": ["\n  \u6cbf\u8857\u552e\u5356\u51b0\u6dc7\u6dcb\u7684\u53ef\u7231\u5df4\u58eb\uff0c\u7ae5\u5fc3\u5341\u8db3\uff0c\u6ee1\u8db3\u6240\u6709\u751c\u871c\u5e7b\u60f3\uff0c\u5e26\u6765\u51c9\u723d\u590f\u65e5", ""], "#tid_car_desc_3": ["\n  \u5b9d\u9a6c\u65d7\u4e0b\u7684\u77e5\u540d\u8c6a\u534e\u5c0f\u578b\u6c7d\u8f66\uff0c\u62e5\u6709\u7075\u5de7\u7684\u64cd\u63a7\u6027\u80fd\u548c\u51fa\u8272\u7684\u5b89\u5168\u6027\u80fd\uff0c\u8d62\u5f97\u4f17\u591a\u5e74\u8f7b\u4e00\u65cf\u7684\u559c\u7231", ""], "#tid_car_desc_4": ["\n  \u5f3a\u608d\u7684\u5916\u8868\u5145\u5206\u4f53\u73b0\u4e86\u5b83\u7684\u8d8a\u91ce\u80fd\u529b\uff0c\u8d85\u5927\u7684\u5c3a\u5bf8\u548c\u590d\u53e4\u7684\u7ebf\u6761\u52fe\u52d2\u51fa\u5927\u800c\u6c14\u6d3e\u7684\u611f\u89c9\uff0c\u52a9\u60a8\u7a33\u5065\u524d\u884c", ""], "#tid_car_desc_5": ["\n  \u96ea\u4f5b\u5170\u79d1\u8fc8\u7f57\uff0c\u4f20\u627f\u4e86\u7ecf\u5178\u7f8e\u7cfb\u808c\u8089\u8dd1\u8f66\u7684\u5927\u6392\u91cf\u53d1\u52a8\u673a\uff0c\u5f97\u540d\u4e8e\u300a\u53d8\u5f62\u91d1\u521a\u300b\u7cfb\u5217\u7535\u5f71\u4e2d\u5927\u9ec4\u8702\u7684\u6c7d\u8f66\u5f62\u6001", ""], "#tid_car_desc_6": ["\n  \u9738\u6c14\u5341\u8db3\u7684\u8d8a\u91ce\u8f66\u5916\u5f62\u642d\u914d\u65b0\u578b\u9a6c\u529b\u5341\u8db3\u7684\u53d1\u52a8\u673a\uff0c\u5728\u8d5b\u8f66\u754c\u6380\u8d77\u5168\u65b0\u7684\u8d8a\u91ce\u72c2\u6f6e", ""], "#tid_car_desc_7": ["\n  \u81ea\u7136\u96c6\u6c14\u8d85\u5f3a\u53d1\u52a8\u673a\u5e26\u6765\u5f3a\u52b2\u7684\u55b7\u5c04\u52a8\u529b\uff0c\u6d41\u7ebf\u578b\u7684\u5148\u950b\u8bbe\u8ba1\u4e0d\u4ec5\u5e26\u6765\u5f3a\u70c8\u7684\u8fd0\u52a8\u89c6\u89c9\u6548\u679c\uff0c\u66f4\u7a81\u663e\u51fa\u65f6\u5c1a\u6f6e\u6d41\u6c14\u606f", ""], "#tid_car_desc_8": ["\n  \u64cd\u63a7\u7cbe\u51c6\u5982\u5200\uff0c\u62e5\u6709\u8d85\u5927\u8fdb\u6c14\u683c\u6805\uff0c\u5747\u8861\u7684\u6027\u80fd\u4f7f\u5b83\u8f7b\u677e\u5e94\u5bf9\u5404\u79cd\u8def\u51b5\uff0c\u6e9c\u80cc\u5f0f\u8f66\u9876\u8bbe\u8ba1\u66f4\u6dfb\u9ad8\u989c\u503c", ""], "#tid_car_desc_9": ["  \n  \u5f97\u76ca\u4e8e\u7279\u65af\u62c9\u72ec\u7279\u7684\u7eaf\u7535\u52a8\u52a8\u529b\u603b\u6210\uff0c\u4f7f\u5f97\u8f66\u5b50\u7684\u52a0\u901f\u8868\u73b0\u5341\u5206\u51fa\u8272\uff0c\u4e14\u5c06\u7a7a\u6c14\u52a8\u529b\u5de5\u7a0b\u7684\u4f18\u52bf\u53d1\u6325\u5230\u6781\u81f4", ""]}, "m": ["id", "zh_CN", "en_US"], "t": 1}, "TranslateShare": {"d": {"#tid_share_1001": ["\u4e00\u67aa\u4e00\u4e2a\u706b\u67f4\u4eba\uff01", ""]}, "m": ["id", "zh_CN", "en_US"], "t": 1}, "WhiteList": {"d": {"1": [1037, 1], "10": [1055, 1], "11": [1017, 1], "12": [1139, 1], "2": [1044, 1], "3": [1007, 1], "4": [1008, 1], "5": [1104, 1], "6": [1089, 1], "7": [1001, 1], "8": [1095, 1], "9": [1058, 1]}, "m": ["whiteListId", "whiteListNub", "whiteListPlatform"], "t": 1}};
	private static _translateConfigs: any = {};
	public static globalCfgsHasLoad: boolean = false;
	private static hasInit: boolean = false;

	private static SWITCH_CONFIG_HOT: string = "SWITCH_CONFIG_HOT"

	//转换后的数据结构
	public static _changeCfgs: any = {};
	public static exportType_Old = 1;
	public static exportType_New = 2;
	/**导出方式：1是旧的格式 2是新格式 */
	public static exportType = BaseFunc.exportType_Old;

	/**新型导表格式：去表头 */
	public static streamType_DelHead = 1;
	/**新型导表格式：缩短表头 */
	public static streamType_ShortHead = 2;
	static hotCfg = {};
	static initAllCfgs = {};

	//当配表group加载完成. 只针对合表 需要把translate 表 和 global表 单独分组. 如果想合组也可以
	public static onConfigGroupLoadComplete() {
		if (!this.isMergeConfig) {
			return;
		}
		BaseFunc.globalCfgsHasLoad = true;

		var congfigName = this._globalConfigsName;
		if (GameTools.isReview) {
			congfigName = this._globalConfigsReviewName;
		}
		// this._globalConfigMap =ResourceManager.getResTxt(congfigName);

		var hotCfg = GameSwitch.switchMap[this.SWITCH_CONFIG_HOT];
		if (hotCfg && hotCfg != "") {
			try {
				hotCfg = JSON.parse(hotCfg);
				BaseFunc.hotCfg = hotCfg;
				if (BaseFunc.exportType == BaseFunc.exportType_Old) {
					TableUtils.deepMerge(this._globalConfigMap, hotCfg);
				}
			} catch (e) {
				window["LogsManager"].errorTag("confighoterror", "热更的配表格式错误", hotCfg);
			}

		}
		//分系统添加资源加载完成监听
		Message.instance.send(MsgCMD.LOAD_JSONCOMPLETE);
	}

	/**设置配表导出方式 */
	public static setCfgExportType(type) {
		this.exportType = type;
	}

	//当多语言表加载完成.
	public static onTranslateGroupLoadComplete() {
		if (!this.isMergeConfig) {
			return;
		}
		this._translateConfigs =  {};
		var cfgsArr: string[] = this._globalConfigMap
		var translateKey = "Translate"
		var translatekeyLen = translateKey.length;
		for (var path in cfgsArr) {
			//如果定义这个表是多语言表  那么走多语言插入设置
			if (path.slice(0, translatekeyLen) == translateKey) {
				TranslateFunc.instance.insertOneCfgs(path)
			}
		}
	}

	public static turnPath(path: string) {
		var endStr: string = "_json";
		if (path.slice(path.length - endStr.length, path.length) == endStr) {
			path = path.slice(0, path.length - endStr.length);
		}
		return path;
	}

	public static getGlobalCfg(configKey: string, ignoreNoExist = false) {
		//判断是否已_json结尾
		configKey = BaseFunc.turnPath(configKey)
		var translateKey = "Translate"
		var translatekeyLen = translateKey.length;
		var resultTb: any;
		if (configKey.slice(0, translatekeyLen) == translateKey) {
			resultTb = this._translateConfigs[configKey];
			if (!resultTb) {
				resultTb = this._globalConfigMap[configKey]
			}
		} else {
			resultTb = this._globalConfigMap[configKey]
		}
		if (!resultTb) {
			if (BaseFunc.hotCfg && BaseFunc.hotCfg[configKey]) {
				resultTb = BaseFunc.hotCfg[configKey]
			}
		}
		if (!resultTb) {
			if (!ignoreNoExist) {
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "没有这个表:" + configKey);
			}
			return {};
		}
		return resultTb

	}


	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表 
	/**
	 * {
	 * 		cfgs1:{..},
	 * 		cfgs2:{..},
	 * }
	 */

	protected _allCfgs: any;
	protected hasInit: boolean = false;

	public constructor() {
		this._allCfgs = {};
		//初始化的时候 直接开始加载配表				
		this.startLoadCfg();
		Message.instance.add(MsgCMD.LOAD_JSONCOMPLETE, this);
	}

	//开始加载配表.每个func初始化的时候需要调用这个接口
	startLoadCfg() {
		if (BaseFunc.globalCfgsHasLoad) {
			this.onGloablCfgLoadComplete()
		}
	}

	protected onGloablCfgLoadComplete() {
		//如果已经初始化了
		if (this.hasInit) {
			return;
		}
		this.hasInit = true;
		var cfgsArr: string[] = this.getCfgsPathArr();
		var translateKey = "Translate"
		var translatekeyLen = translateKey.length;
		for (var i = 0; i < cfgsArr.length; i++) {
			var pathInfo: any = cfgsArr[i];
			if (typeof pathInfo == "string") {
				pathInfo = {name: pathInfo};
			}
			var path: string;
			var name: string = pathInfo.name;
			var ignoreNoExist = pathInfo.ignoreNoExist;
			if (!pathInfo.path || pathInfo.path == "") {
				path = name;
			} else {
				path = pathInfo.path + "/" + name;
			}
			//如果定义这个表是多语言表  那么走多语言插入设置
			if (pathInfo.translate || path.slice(0, translatekeyLen) == translateKey) {
				var ins = TranslateFunc.instance
				//这里为了安全,带_json的和不带_json的 都存一份
				ins.insertOneCfgs(BaseFunc.turnPath(name))
				ins.insertOneCfgs(name)
			}
			this.insertOneCfgs(name, ignoreNoExist);
			this.insertOneCfgs(BaseFunc.turnPath(name), ignoreNoExist);
		}
	}


	//插入一条表数据, 目前主要是考虑到 translate需要分系统自己插入.
	insertOneCfgs(path: string, ignoreNoExist = false) {
		path = BaseFunc.turnPath(path);
		if (BaseFunc.isMergeConfig) {
			this._allCfgs[path] = BaseFunc.getGlobalCfg(path, ignoreNoExist);
		} else {
			// LoadManager.instance.load("json/" + path, Laya.Handler.create(this, () => {
			// 	var jsonCfgs = Laya.loader.getRes("json/" + path)
			// 	if (!jsonCfgs) {
			// 		window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "配表加载失败:", path);
			// 		return
			// 	}
			// 	this._allCfgs[path] = jsonCfgs;
			// }), null, Laya.Loader.JSON);
		}

	}


	//获取配表名数组每个子类需要重写这个函数
	/**
	 * 需要返回配表名 以及路径,如果没有路径,那么配null 或者 空字符串
	 * 返回示例:
	 * return {
	 * 	{name:"ExploreBuff",path:"explore"}
	 * }
	 */
	protected getCfgsPathArr() {
		return [];
	}

	//根据配置名称,获取该配置的所有信息
	// ignoreError 是否忽略错误.默认false当获取不到某个表的时候会提示报错
	getAllCfgData(cfgsName, ignoreError: boolean = false) {
		cfgsName = BaseFunc.turnPath(cfgsName);
		var cfgs = this._allCfgs[cfgsName];
		if (!cfgs) {
			if (!ignoreError) {
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "对应的配表没找到,请检查配置:" + cfgsName);
			}
			return {};
		}
		if (BaseFunc.exportType == BaseFunc.exportType_New) {
			var itemData = cfgs.d;
			if (!itemData || Object.keys(itemData).length == 0) {
				BaseFunc._changeCfgs[cfgsName] = {};
				if (BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName]) {
					//热更的是个新表的情况下，直接取热更内容
					cfgs = BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName];
					if (cfgs) {
						BaseFunc._changeCfgs[cfgsName] = cfgs;
						return cfgs;
					}
				}
				return {};
			}
			if (!BaseFunc.initAllCfgs[cfgsName]) {
				for (var key in itemData) {
					this.setOneChangeData(cfgsName, key);
				}
				BaseFunc.initAllCfgs[cfgsName] = true;
			}
			cfgs = BaseFunc._changeCfgs[cfgsName];
		}
		return cfgs;

	}

	//根据配置名称,对应的id 获取对应的数据
	// ignoreError 是否忽略错误.默认false当获取不到某个表的时候会提示报错
	getCfgDatas(cfgsName, id, ignoreError: boolean = false) {
		cfgsName = BaseFunc.turnPath(cfgsName);
		var cfgs = this._allCfgs[cfgsName];
		if (!cfgs) {
			if (!ignoreError) {
				//
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "配表还没有加载成功:" + cfgsName);
			}
			return {}
		}
		var data = this.changeDataById(cfgsName, id, ignoreError);
		if (!data) {
			if (!ignoreError) {
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "请找策划,配表名字:" + cfgsName + "对应的id找不到" + id);
			}
			return {};
		}
		return data;

	}

	/**转换数据结构 */
	changeDataById(cfgsName, id, ignoreError: boolean = false) {
		var data;
		if (BaseFunc.exportType == BaseFunc.exportType_Old) {
			data = this._allCfgs[cfgsName][id];
		} else {
			if (BaseFunc._changeCfgs[cfgsName] && BaseFunc._changeCfgs[cfgsName][id]) {
				data = BaseFunc._changeCfgs[cfgsName][id];
			} else {
				this.setOneChangeData(cfgsName, id, ignoreError);
				data = BaseFunc._changeCfgs[cfgsName] && BaseFunc._changeCfgs[cfgsName][id];
			}
		}
		return data;
	}

	/**转换一个id的数据 */
	setOneChangeData(cfgsName, id, ignoreError: boolean = false) {
		var cfgs = this._allCfgs[cfgsName];
		var type = Number(cfgs.t);
		var key = cfgs.m;
		var mkey = cfgs.k;
		var itemData = cfgs.d;
		//如果有这一条的数据了  直接返回
		if (BaseFunc._changeCfgs[cfgsName] && BaseFunc._changeCfgs[cfgsName][id]) return;
		if (!BaseFunc._changeCfgs[cfgsName]) {
			BaseFunc._changeCfgs[cfgsName] = {};
		}
		var curInfo = itemData && itemData[id];
		if (!curInfo) {
			//如果是新表或者旧表的新字段的热更 直接取值  旧表或旧字段的热更还是先转换数据再合并
			if (BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName] && BaseFunc.hotCfg[cfgsName][id]) {
				BaseFunc._changeCfgs[cfgsName][id] = BaseFunc.hotCfg[cfgsName][id];
				return;
			}
		}
		if (!curInfo && !ignoreError) {
			window["LogsManager"].errorTag("configError", "请找策划,配表名字:" + cfgsName + "对应的id" + id + "没有配置");
			return;
		}
		if (!curInfo) return;
		var info = {};
		var outInfo = {};
		var mulKey;
		var addNum = 1;
		if (type == BaseFunc.streamType_DelHead) {
			//去表头
			if (mkey) {
				//如果是二维配表
				for (var item in curInfo) {
					var info2 = {};
					info2[key[0]] = id;
					var itemInfo = curInfo[item];
					mulKey = item;
					info2[key[1]] = mulKey;
					addNum = 2;
					for (var i = 0; i < itemInfo.length; i++) {
						var value = itemInfo[i];
						if ((typeof value == "string" && value == "") || value == undefined) continue;
						info2[key[i + addNum]] = value;
					}
					outInfo[mulKey] = info2;
				}
				BaseFunc._changeCfgs[cfgsName][id] = outInfo;

			} else {
				info[key[0]] = id;
				for (var i = 0; i < curInfo.length; i++) {
					var value = curInfo[i];
					if ((typeof value == "string" && value == "") || value == undefined) continue;
					info[key[i + addNum]] = value;
				}
				BaseFunc._changeCfgs[cfgsName][id] = info;
			}
		} else if (type == BaseFunc.streamType_ShortHead) {
			//缩短表头
			if (mkey) {
				//如果是二维配表
				for (var item in curInfo) {
					var info2 = {};
					info2[key[0]] = id;
					var itemInfo = curInfo[item];
					mulKey = item;
					info2[key[1]] = mulKey;
					addNum = 2;
					for (var index in itemInfo) {
						if (itemInfo.hasOwnProperty(index)) {
							var value = itemInfo[index];
							info2[key[Number(index) - 1]] = value;
						}
					}
					outInfo[mulKey] = info2;
				}
				BaseFunc._changeCfgs[cfgsName][id] = outInfo;

			} else {
				info[key[0]] = id;
				for (var index in curInfo) {
					if (curInfo.hasOwnProperty(index)) {
						var value = curInfo[index];
						info[key[Number(index) - 1]] = value;
					}
				}
				BaseFunc._changeCfgs[cfgsName][id] = info;
			}

		}
		if (BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName] && BaseFunc.hotCfg[cfgsName][id]) {
			TableUtils.deepMerge(BaseFunc._changeCfgs[cfgsName][id], BaseFunc.hotCfg[cfgsName][id])
		}
	}

	//传入配表名, 对应的id, 对应的字段名 获取对应的数据
	getCfgDatasByKey(cfgsName, id, key1, ignoreError: boolean = false) {
		cfgsName = BaseFunc.turnPath(cfgsName);
		var data: any = this.getCfgDatas(cfgsName, id, ignoreError);
		var resultValue: any = data[key1];
		if (resultValue == null) {
			if (!ignoreError) {
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "请找策划,配表名字:" + cfgsName + "对应的id" + id + "字段" + key1 + "没有配置");
			}
		}
		return resultValue;
	}

	//获取某个配表对应多层key的数据
	//一般对应的是二维表. key1 可以是int
	getCfgDatasByMultyKey(cfgsName, id, key1, key2, ignoreError: boolean = false) {
		var data: any = this.getCfgDatas(cfgsName, id, ignoreError);
		var key1Data: any = data[key1];
		if (!key1Data) {
			if (!ignoreError) {
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "请找策划,配表名字:" + cfgsName + "对应的id" + id + "字段" + key1 + "没有配置");
			}
			return null;
		}
		var resultValue = key1Data[key2];
		if (!resultValue) {
			if (!ignoreError) {
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "请找策划,配表名字:" + cfgsName + "对应的id" + id + "字段" + key1 +
					"_" + key2 + "没有配置");
			}
		}
		return resultValue;
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {
			case MsgCMD.LOAD_JSONCOMPLETE:
				this.onGloablCfgLoadComplete();
				break;
		}
	}

}

import TranslateFunc from "./TranslateFunc";
import Message from "../common/Message";
import IMessage from "../../game/sys/interfaces/IMessage";
// import {LoadManager} from "../manager/LoadManager";
import MsgCMD from "../../game/sys/common/MsgCMD";
import LogsErrorCode from "../consts/LogsErrorCode";
import GameSwitch from "../common/GameSwitch";
import TableUtils from "../utils/TableUtils";
import GameTools from "../../utils/GameTools";