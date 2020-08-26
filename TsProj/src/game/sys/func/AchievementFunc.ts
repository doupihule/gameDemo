import BaseFunc from "../../../framework/func/BaseFunc";

export default class AchievementFunc extends BaseFunc {
    private static _instance: AchievementFunc;

    public static get instance(): AchievementFunc {
        if (!this._instance) {
            this._instance = new AchievementFunc();
        }
        return this._instance;
    }

    getCfgsPathArr() {
        return [
            { name: "Achievement_json" }
        ]
    }


}