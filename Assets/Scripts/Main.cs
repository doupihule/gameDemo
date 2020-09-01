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

    protected Action luaUpdate = null;
    protected Action luaUpdateLate = null;
    void Awake()
    {
        
        instance = this;
        ResourceManager.Instance.Init(this.gameObject);
        //JSEnvExpand.InitEnv("C:/work/unity/gameDemo/TsProj/output/",-1);
        JSEnvExpand.InitEnv("", -1);

    }
    void Update()
    {
        //luaUpdate(timerManager);
    }
    void LateUpdate()
    {
        //luaUpdateLate(timerManager);
    }
}