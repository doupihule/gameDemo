using UnityEngine;
using UnityEditor;
using XLua;
using UnityEngine.UI;
//using Resource;
using Spine.Unity;

public class Main : MonoBehaviour
{
    void Awake() {
        XLuaBridge.Init();


        GameObject a = (GameObject)Resources.Load("UI/Prefabs/GameMainUI");
        GameObject ui = Instantiate(a);
        //把ui添加到舞台
        RectTransform  childUI = ui.GetComponent<RectTransform>();
        //childUI.parent = this.GetComponent<RectTransform>();
        ui.transform.SetParent(this.transform, false);
        //SkeletonGraphic bb;
        //bb.AnimationState.TimeScale = 0;
        //bb.unscaledTime
        
        



    }
}