using UnityEngine;
using UnityEditor;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
//using Resource;
using Spine.Unity;
using Resource;
using System;
using GameUtils;
public class Main : MonoBehaviour
{
    static Main instance;
    Action timerManager;

    [RuntimeInitializeOnLoadMethod]
    static void Initialize()
    {
        Debug.Log("currentScene:"+ SceneManager.GetActiveScene().name);
        if (SceneManager.GetActiveScene().name == "SampleScene")
        {
            return;
        }
        SceneManager.LoadScene("SampleScene");
    }


    protected Action luaUpdate = null;
    protected Action luaUpdateLate = null;
    public delegate void initStage(GameObject stage,GameObject uiroot);
    void Awake()
    {
        
        instance = this;
        ResourceManager.Instance.Init(this.gameObject);
        //@xd_test开启调试模式.
        JSEnvExpand.InitEnv("C:/work/unity/gameDemo/TsProj/output/",8080);
        //JSEnvExpand.InitEnv("", -1);
        var initStage = JSEnvExpand.globalEnv.Eval<initStage>("global.initGame");
        GameObject uiRoot = GameObject.Find("uiRoot");
        initStage(this.gameObject, uiRoot);
        TrailRenderer sss;
    }
    void Update()
    {
        
        JSEnvExpand.globalEnv.Tick();
        //luaUpdate(timerManager);
        JSEnvExpand.globalEnv.Eval("window.TimerManager.instance.tickHandler()");
    }
    void LateUpdate()
    {
        //luaUpdateLate(timerManager);
        JSEnvExpand.globalEnv.Eval("window.TimerManager.instance.tickHandlerLater()");
    }
}