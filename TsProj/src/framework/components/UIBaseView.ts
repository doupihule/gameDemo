import {UnityEngine} from 'csharp'
import BaseViewExpand from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";
import ViewTools from "./ViewTools";
import LogsManager from "../manager/LogsManager";
import Message from "../common/Message";

export default class UIBaseView extends BaseViewExpand {
    public  windowName:string;
    public  __modalView:BaseViewExpand;
    constructor() {
        super();
        this.uitype = UICompConst.comp_ui;
    }

    public setCObject(cui){
        super.setCObject(cui);
        this.bindChild(cui);
    }

    //bing子对象
    public bindChild(cuiobj: UnityEngine.GameObject, parentViewInstance: BaseViewExpand = null, path = "") {
        var transform = cuiobj.transform;
        var childCount = transform.childCount;
        if (childCount == 0) {
            return;
        }
        for (var i = childCount - 1; i >= 0; i--) {
            var childTrans = transform.GetChild(i);
            var name = childTrans.name;
            var uiType = name.split("_")[0];
            var className = UICompConst.classMap[uiType];
            if (className){
                var childGameObj = childTrans.gameObject;
                var childViewInstance:BaseViewExpand = ViewTools.autoBindingCObj(childGameObj,true);
                if (this[name] != null){
                    //子对象名字重复 只打警告
                    LogsManager.warn("有子对象名字重复了"+path+"."+ name);
                } else{
                    this[name] = childViewInstance;
                }
                //给父对象也绑定这个属性. 这样可以形成链式访问 .比如 a.b.c
                if (parentViewInstance){
                    parentViewInstance[name] = childViewInstance;
                }
                if (uiType != UICompConst.comp_scroll && uiType != UICompConst.comp_list ){
                    this.bindChild(childGameObj, childViewInstance, path+name);
                }
            }
        }
    }

    //设置窗口名字
    public  setWindowName(name:string){
        this.windowName = name;
        this.name = name;
    }

    public  setData(data:any){

    }

    public  close(){

    }

    public dispose() {
        super.dispose();
        Message.instance.removeObjEvents(this as any);
    }

}
