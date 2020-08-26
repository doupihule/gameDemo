

/**
 * 数据格式定义器:目的只是为了能让数据结构有代码提示功能.降低属性读写错误概率.
 * 这个.d.ts  在 最终发布后 没有任何作用. 也不会参与代码编译. 
 * 
 * //类命名格式 SC{模块名}Data 模块名首字母大写
 * //为了防止类名申明和代码重名. 所有的类名前缀添加一个SC 代表sererclient
 * 把每个模块可能用到的数据全部申明成变量
 * 比如用户数据: user:{
 *     level:1,
 *      name:xd
 * }
 * 
 * 针对嵌套的复杂对象 比如 roles:{
 * 
 *      id:{
 *          level:1,        //角色等级
 *          weapon:1        //角色装备
 *      }
 *      只需要申明SRoleData.  
 * 
 * }
 */
/**打工 */
declare class SCWorkData {
    public expireTime: number; //过期时间
    public workRole: { [key: string]: any } //正在打工的角色
    public workInfo: { [key: string]: SCWorkInfoData } //工作信息
    public companyLevel: number;//公司等级
    public repute: number; //名声
}
declare class SCWorkInfoData {
    public cd: number; //解锁到达时间
    public allTime:number //总共需要的时间
    public finish: number //是否已领取
    public id:number //工作id
    public index:number //工作index 只有必出工作有
}
/**商店 */
declare class SCShopData {
    public expireTime: number// 过期时间
    public shopList: { [key: string]: SCShopList } //商品列表
}
declare class SCShopList {
    public count: number; //领取次数
    public id: any;//商品id
}
/**对话item */
declare class SCChatItemData {
    public frontNum: number //前置对话已显示数量
    public followNum: number//后置对话已显示数量
    public answer: { [key: string]: any }
    public index: number //第几个对话
}
/**任务 */
declare class SCTaskData {
    public task: { [key: string]: number };
    public taskBox: { [key: string]: number } //任务宝箱
    public taskPoint: number; //任务活跃度
    public taskCount: { [key: string]: { [key: string]: number } } //任务次数按逻辑类型记录
}
/**章节 */
declare class SCChapterData {
    public rewardBox: { [key: string]: number };//章节宝箱
}
/**迷雾fog */
declare class SCFogData {
    public layer: number;//当前层数
    public globalEvent: any;
    public cell: { [key: string]: SCFogCellData };//迷雾格子数据
    public comp: number;//零件数
    public act: number;//行动力
    public enemy: { [key: string]: SCFogEnemyData };//敌人列表
    public counts: { [key: string]: number };//迷雾次数列表
    public prop: { [key: string]: number };//迷雾道具列表
    public line: { [key: string]: string };//迷雾阵容列表
    //  public fogShop: {[key: string]: SCFogShopData };//迷雾局内商店列表
    public bus: SCFogBusData;//大巴车
    public reward: any;//迷雾获得奖励列表
}
/**迷雾格子cell */
declare class SCFogCellData {
    public ste: number;
    public evt: SCFogCellEventData;
    public type: string;
    //是否锁定
    public lock: number;


}
/**迷雾格子cell的事件 */
declare class SCFogCellEventData {
    public id: number;
    public role: string;
    public ai: string;
    public name: string;
    public reward: any;//奖励类事件用于存储随机的奖励，避免每次不一致
    public wrongIndex: any;//答题事件，错误答案
    public fogShop: { [key: string]: SCFogShopData };//局内商店，goods列表
    public counts: number;//局内商店刷新次数
    public isVideoGetRight: number;//是否看视频获得正确答案
}
/**迷雾敌人数据 */
declare class SCFogEnemyData {
    public use: number;
    public roles: any;
    public userExt;
    public name: string;

}
/**迷雾大巴车数据 */
declare class SCFogBusData {
    public level: number;//等级
    public pos: string;//位置
}
/**迷雾局内商店数据 */
declare class SCFogShopData {
    public id: string;//goodsId
    public status: number;//状态
}
// //申明角色类属性
// declare class SCRoleData {
//     public level:number;
//     public weapon:number;
// }

// declare class SCUserExtData{
//     public loginTime:number;    //登入时间
//     public sp:number;           //体力
//     public expriteTime:number;  //过期时间
// }



