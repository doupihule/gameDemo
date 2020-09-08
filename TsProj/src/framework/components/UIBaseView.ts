import {UnityEngine} from 'csharp'
import BaseViewExpand from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";
import ViewTools from "./ViewTools";
import Message from "../common/Message";
import IMessage from "../../game/sys/interfaces/IMessage";

export default class UIBaseView extends BaseViewExpand  implements IMessage{
    public  windowName:string;
    public  __modalView:BaseViewExpand;
    constructor() {
        super();
        this.uitype = UICompConst.comp_ui;
    }

    public setCObject(cui){
        super.setCObject(cui);
        this.bindChild(cui);
        this.doAfterInit();
        return this
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
            var className = ViewTools.compClassMap[uiType];
            if (className){
                var childGameObj = childTrans.gameObject;
                var childViewInstance:BaseViewExpand = ViewTools.autoBindingCObj(childGameObj,true);
                if (this[name] != null){
                    //子对象名字重复 只打警告
                    window["LogsManager"].warn("有子对象名字重复了"+path+"."+ name);
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

    //初始化完毕之后 可以访问组件了 给子类重写.类似ya的createChildren . 如果某个ui 没有和cobj进行绑定. 也就是手写ui. 那么就需要手动调用这个函数 .
    public  doAfterInit(){

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

    public  recvMsg(cmd: string, data: any): void {
    }

    public dispose() {
        super.dispose();
        Message.instance.removeObjEvents(this as any);
    }

}
