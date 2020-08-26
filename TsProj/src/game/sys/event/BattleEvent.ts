export default class BattleEvent  {
    /**进入战斗 */
    public static BATTLEEVENT_BATTLESTART = "BATTLEEVENT_BATTLESTART"
    /**退出战斗 */
    public static BATTLEEVENT_BATTLEEXIT = "BATTLEEVENT_BATTLEEXIT"
    /**重新开始战斗*/     
    public static GUIDEEVENT_REPLAY_BATTLE = "GUIDEEVENT_REPLAY_BATTLE"
    /**复活失败直接结算 */
    public static BATTLEEVENT_REVIEW_JUMP = "BATTLEEVENT_REVIEW_JUMP"
    /**继续战斗 */
    public static BATTLEEVENT_CONTINUE_BATTLE = "BATTLEEVENT_CONTINUE_BATTLE"
    //复活界面跳转失败界面
    public static BATTLEEVENT_REVIEW_JUMP_END = "BATTLEEVENT_REVIEW_JUMP_END"
    //第二次跳转复活界面
    public static BATTLEEVENT_REVIEW_SECOND_JUMP = "BATTLEEVENT_REVIEW_SECOND_JUMP"
     //重置reviveCount
     public static BATTLEEVENT_REVIEW_RESET_REVIVECOUNT = "BATTLEEVENT_REVIEW_RESET_REVIVECOUNT"
    //更新吃金币数量
    public static BATTLEEVENT_UPDATE_COIN_NUM = "BATTLEEVENT_UPDATE_COIN_NUM"
    /**暂停战斗 */
    public static BATTLEEVENT_PAUSE_BATTLE = "BATTLEEVENT_PAUSE_BATTLE"
    
    
}