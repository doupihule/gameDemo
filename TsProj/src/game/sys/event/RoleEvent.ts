export default class RoleEvent {
	public constructor() {
	}

	//事件定义.必须是模块名_event_功能拼音的方式.防止重复
	/**刷新红点 */
	static ROLE_EVENT_REFRESHGUNRED = "ROLE_EVENT_REFRESHGUNRED";

	/**刷新红点 */
	static ROLE_EVENT_REFRESHPRICE = "ROLE_EVENT_REFRESHPRICE";

	//选择角色
	static ROLE_EVENT_SELECT = "ROLE_EVENT_SELECT";

	/** 角色发生变化 */
	static ROLE_CHANGE = "ROLE_CHANGE";

	//升级后刷新主界面角色等级
	static ROLE_EVENT_GAMEMAIN_ROLELEVEL = "ROLE_EVENT_GAMEMAIN_ROLELEVEL";

	//解锁后刷新主界面显示
	static ROLE_EVENT_GAMEMAIN_ROLEUNLOCK = "ROLE_EVENT_GAMEMAIN_ROLEUNLOCK";

	//基地升级后刷新主界面基地红点
	static ROLE_EVENT_GAMEMAIN_FALT_REDPOINT = "ROLE_EVENT_GAMEMAIN_FALT_REDPOINT";

	//角色上阵刷新主界面
	static ROLE_EVENT_GAMEMAIN_ROLE_INLINE = "ROLE_EVENT_GAMEMAIN_ROLE_INLINE";

	/**合成装备 */
	static ROLE_EVENT_COMPOSE_EQUIP = "ROLE_EVENT_COMPOSE_EQUIP";
	/**进化 */
	static ROLE_EVENT_EVOLUTION = "ROLE_EVENT_EVOLUTION"
}
