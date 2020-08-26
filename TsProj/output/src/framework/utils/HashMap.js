"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HashMap {
    constructor() {
        //当前数量
        this.hashCode = 0;
        this.hashCode = HashMap.HASH_COUNT++;
    }
    /**
     * 加入数据
     * @param key 键
     * @param value 值
     */
    put(key, value) {
        this[key] = value;
    }
    /**
     * 获得数据
     * @param key 键
     */
    get(key) {
        return this[key];
    }
    /**
     * 移除数据
     * @param key 键
     */
    remove(key) {
        var value = this[key];
        if (value != null) {
            delete this[key];
        }
        return value;
    }
    /**
     * 是否存在
     * @param key 键
     */
    contains(key) {
        return this[key] != null;
    }
    /**
     * 获得所有键值
     */
    keys() {
        var keys = Object.keys(this);
        var index = keys.indexOf("hashCode");
        if (index > -1) {
            keys.splice(index, 1);
        }
        return keys;
    }
    /**
     * 清空数据
     */
    clear() {
        var keys = this.keys();
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            this.remove(keys[i]);
        }
    }
}
exports.default = HashMap;
//HashMap计数
HashMap.HASH_COUNT = 0;
//# sourceMappingURL=HashMap.js.map