﻿using UnityEngine;
using UnityEditor;
using XLua;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
//using Resource;
using Spine.Unity;
using Resource;
using System;
public class Main : MonoBehaviour
{
    static Main instance;
    LuaTable timerManager;

    protected Action<LuaTable> luaUpdate = null;
    protected Action<LuaTable> luaUpdateLate = null;
    void Awake()
    {
        instance = this;
        ResourceManager.Instance.Init(this.gameObject);
        
        XLuaBridge.Init();
        LuaTable globalEnv = XLuaBridge.GetInstance().XLuaGetLuaInstance("GlobalEnv");
        GameObject b = GameObject.Find("uiRoot");
        globalEnv.Set("_uiRoot", b);
        globalEnv.Set("_stage", this.gameObject);

        //GameObject a = ResourceManager.Instance.LoadAsset<GameObject>("Assets/UI/Prefabs/main/GameMainUI.prefab", "Assets/UI/Prefabs/main/GameMainUI.prefab", "mainab");

        ////= (GameObject)Resources.Load("UI/Prefabs/GameMainUI");
        //GameObject ui = Instantiate(a);
        ////把ui添加到舞台
        //RectTransform childUI = ui.GetComponent<RectTransform>();
        //ui.transform.SetParent(this.transform, false);
        //SkeletonGraphic bb;
        //bb.AnimationState.TimeScale = 0;
        //bb.unscaledTime
        timerManager = XLuaBridge.GetInstance().XLuaGetLuaInstance("TimerManager.getInstance()");
        luaUpdate = timerManager.Get<Action<LuaTable>>("updateFrame");
        luaUpdateLate = timerManager.Get<Action<LuaTable>>("updateFrameLate");

        XLuaBridge.GetInstance().XLuaDoString("__startGame()","chunk");
        //Spine.AnimationState sss;
        //SkeletonGraphic sken;
        //Spine.TrackEntry entry = sken.AnimationState.SetAnimation(0, "1", true);
        //sken.AnimationState.TimeScale

        //Image bb;
        //aa.fontSize = 20;
        //aa.color

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