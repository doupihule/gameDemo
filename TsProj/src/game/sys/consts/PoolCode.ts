export default class PoolCode {
    //定义一些缓存key
    public static POOL_MONSTER: string = "POOL_MONSTER"; //缓存的怪物 拼怪物id
    public static POOL_PLAYER: string = "POOL_PLAYER";   //缓存的角色 拼角色id
    public static POOL_BUTTLE: string = "POOL_BUTTLE";   //缓存的子弹 后面会拼 子弹的id
    public static POOL_PLAYERCONTENT: string = "POOL_PLAYERCONTENT";   //缓存的战斗中技能容器
    public static POOL_EFFECT: string = "POOL_EFFECT";      //缓存的特效
    public static POOL_EFFECTIMAGE: string = "POOL_EFFECTIMAGE";      //缓存的特效图片
    public static POOL_HPBAR: string = "POOL_HPBAR";     //血条
    public static POOL_AOEDATA: string = "POOL_AOEDATA"; //AOE数据
    public static POOL_SHADE: string = "POOL_SHADE"; //影子
    public static POOL_PASSIVE: string = "POOL_PASSIVE"; //被动技
    public static POOL_ROLE: string = "POOL_ROLE"; //缓存得角色，用于ui展示角色动画
    public static POOL_HOME: string = "POOL_HOME"; //缓存基地
    public static POOL_BUFFBAR: string = "POOL_BUFFBAR";     //buff区域
    public static POOL_BUFFICON: string = "POOL_BUFFICON";     //buff图标
    public static POOL_FOGCELL: string = "POOL_FOGCELL";   //迷雾格子
    public static POOL_FOGBUS: string = "POOL_FOGBUS";   //迷雾车
    public static POOL_CHAPTERENEMY: string = "POOL_CHAPTERENEMY";   //章节怪物角色
    public static POOL_CHAPTERBOX: string = "POOL_CHAPTERBOX";   //章节宝箱
    public static POOL_CHAPTERPLAYER: string = "POOL_CHAPTERPLAYER";   //章节主角
    /**己方显示在小地图上的小圆蓝点对象池 */
    static SELF_MAP_POINT_POOL: string = "SELF_MAP_POINT_POOL";
    /**敌方显示在小地图上的小圆红点对象池 */
    static ENEMY_MAP_POINT_POOL: string = "ENEMY_MAP_POINT_POOL";
    /**己方显示在小地图上的小三角蓝点对象池 */
    static SELF_MAP_SKY_POINT_POOL: string = "SELF_MAP_SKY_POINT_POOL";
    /**敌方显示在小地图上的小三角红点对象池 */
    static ENEMY_MAP_SKY_POINT_POOL: string = "ENEMY_MAP_SKY_POINT_POOL";
    /**己方显示在小地图上的小梯形蓝点对象池 */
    static SELF_MAP_HOME_POINT_POOL: string = "SELF_MAP_HOME_POINT_POOL";
    /**敌方显示在小地图上的小梯形红点对象池 */
    static ENEMY_MAP_HOME_POINT_POOL: string = "ENEMY_MAP_HOME_POINT_POOL";
    /**飞的资源 */
    static POOL_FLYSOURCE:string="POOL_FLYSOURCE"
    //主界面flatItem缓存
    public static POOL_FLAT: string = "POOL_FLAT"; 
    //缓存模块定义
    //缓存按照模块缓存.每一个缓存的对方必须带有dispos方法 如果没有就会报错,是为了做清理缓存用的
    public static pool_model_battle: string = "battle";
    public static pool_model_sys: string = "sys";
    public static pool_model_scene: string = "scene";





}