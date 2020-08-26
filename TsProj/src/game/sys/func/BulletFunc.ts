import BaseFunc from "../../../framework/func/BaseFunc";

/**子弹相关 */
export default class BulletFunc extends BaseFunc {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Bullet_json" },
        ];
    }
    static _instance: BulletFunc;
    static get instance() {
        if (!this._instance) {
            this._instance = new BulletFunc();
        }
        return this._instance;
    }
    getBulletInfo(id1, id2) {
        return this.getCfgDatasByKey("Bullet_json", id1, id2);
    }
}
