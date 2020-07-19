using UnityEngine;
using UnityEditor;
using XLua;
using UnityEngine.UI;
//using Resource;
using Spine.Unity;
using Resource;
using System;
[LuaCallCSharp]
public class Main : MonoBehaviour
{

    LuaTable timerManager;

    protected Action<LuaTable> luaUpdate = null;
    protected Action<LuaTable> luaUpdateLate = null;

    void Awake()
    {
        XLuaBridge.Init();

        ResourceManager.Instance.Init(gameObject);

        GameObject a = ResourceManager.Instance.LoadAsset<GameObject>("Assets/UI/Prefabs/main/GameMainUI.prefab", "Assets/UI/Prefabs/main/GameMainUI.prefab", "mainab");

        //= (GameObject)Resources.Load("UI/Prefabs/GameMainUI");
        GameObject ui = Instantiate(a);
        //把ui添加到舞台
        RectTransform childUI = ui.GetComponent<RectTransform>();
        //childUI.parent = this.GetComponent<RectTransform>();
        ui.transform.SetParent(this.transform, false);
        //SkeletonGraphic bb;
        //bb.AnimationState.TimeScale = 0;
        //bb.unscaledTime
        timerManager = XLuaBridge.GetInstance().XLuaGetLuaInstance("TimerManager.getInstance()");
        luaUpdate = timerManager.Get<Action<LuaTable>>("updateFrame");
        luaUpdateLate = timerManager.Get<Action<LuaTable>>("updateFrameLate");

    }
    void Update()
    {
        luaUpdate(timerManager);
    }
    void LateUpdate()
    {
        luaUpdateLate(timerManager);
    }
}