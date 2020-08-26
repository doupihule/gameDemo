"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PoolCode {
}
exports.default = PoolCode;
//定义一些缓存key
PoolCode.POOL_MONSTER = "POOL_MONSTER"; //缓存的怪物 拼怪物id
PoolCode.POOL_PLAYER = "POOL_PLAYER"; //缓存的角色 拼角色id
PoolCode.POOL_BUTTLE = "POOL_BUTTLE"; //缓存的子弹 后面会拼 子弹的id
PoolCode.POOL_PLAYERCONTENT = "POOL_PLAYERCONTENT"; //缓存的战斗中技能容器
PoolCode.POOL_EFFECT = "POOL_EFFECT"; //缓存的特效
PoolCode.POOL_EFFECTIMAGE = "POOL_EFFECTIMAGE"; //缓存的特效图片
PoolCode.POOL_HPBAR = "POOL_HPBAR"; //血条
PoolCode.POOL_AOEDATA = "POOL_AOEDATA"; //AOE数据
PoolCode.POOL_SHADE = "POOL_SHADE"; //影子
PoolCode.POOL_PASSIVE = "POOL_PASSIVE"; //被动技
PoolCode.POOL_ROLE = "POOL_ROLE"; //缓存得角色，用于ui展示角色动画
PoolCode.POOL_HOME = "POOL_HOME"; //缓存基地
PoolCode.POOL_BUFFBAR = "POOL_BUFFBAR"; //buff区域
PoolCode.POOL_BUFFICON = "POOL_BUFFICON"; //buff图标
PoolCode.POOL_FOGCELL = "POOL_FOGCELL"; //迷雾格子
PoolCode.POOL_FOGBUS = "POOL_FOGBUS"; //迷雾车
PoolCode.POOL_CHAPTERENEMY = "POOL_CHAPTERENEMY"; //章节怪物角色
PoolCode.POOL_CHAPTERBOX = "POOL_CHAPTERBOX"; //章节宝箱
PoolCode.POOL_CHAPTERPLAYER = "POOL_CHAPTERPLAYER"; //章节主角
/**己方显示在小地图上的小圆蓝点对象池 */
PoolCode.SELF_MAP_POINT_POOL = "SELF_MAP_POINT_POOL";
/**敌方显示在小地图上的小圆红点对象池 */
PoolCode.ENEMY_MAP_POINT_POOL = "ENEMY_MAP_POINT_POOL";
/**己方显示在小地图上的小三角蓝点对象池 */
PoolCode.SELF_MAP_SKY_POINT_POOL = "SELF_MAP_SKY_POINT_POOL";
/**敌方显示在小地图上的小三角红点对象池 */
PoolCode.ENEMY_MAP_SKY_POINT_POOL = "ENEMY_MAP_SKY_POINT_POOL";
/**己方显示在小地图上的小梯形蓝点对象池 */
PoolCode.SELF_MAP_HOME_POINT_POOL = "SELF_MAP_HOME_POINT_POOL";
/**敌方显示在小地图上的小梯形红点对象池 */
PoolCode.ENEMY_MAP_HOME_POINT_POOL = "ENEMY_MAP_HOME_POINT_POOL";
/**飞的资源 */
PoolCode.POOL_FLYSOURCE = "POOL_FLYSOURCE";
//主界面flatItem缓存
PoolCode.POOL_FLAT = "POOL_FLAT";
//缓存模块定义
//缓存按照模块缓存.每一个缓存的对方必须带有dispos方法 如果没有就会报错,是为了做清理缓存用的
PoolCode.pool_model_battle = "battle";
PoolCode.pool_model_sys = "sys";
PoolCode.pool_model_scene = "scene";
//# sourceMappingURL=PoolCode.js.map