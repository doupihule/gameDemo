using UnityEngine;
using UnityEditor;
using XLua;
using UnityEngine.UI;
//using Resource;
using Spine.Unity;
using Resource;

public class Main : MonoBehaviour
{
    void Awake() {
        XLuaBridge.Init();

        ResourceManager.Instance.Init(gameObject);

        GameObject a = ResourceManager.Instance.LoadAsset< GameObject >("Assets/UI/Prefabs/main/GameMainUI.prefab", "Assets/UI/Prefabs/main/GameMainUI.prefab", "mainab");

         //= (GameObject)Resources.Load("UI/Prefabs/GameMainUI");
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