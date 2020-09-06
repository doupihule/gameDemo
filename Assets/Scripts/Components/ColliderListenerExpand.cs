using UnityEngine;
using UnityEditor;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
//using Resource;
using Spine.Unity;
using Resource;
using System;
using GameUtils;
public class ColliderListenerExpand : MonoBehaviour
{
    static Main instance;
    Action timerManager;

    protected Action luaUpdate = null;
    protected Action luaUpdateLate = null;
    public delegate void initStage(GameObject stage,GameObject uiroot);
    void Awake()
    {
        

    }
    void Update()
    {
    }
    void LateUpdate()
    {
    }

    private void OnCollisionEnter(Collision collision)
    {
        
    }

    private void OnCollisionExit(Collision collision)
    {
        
    }

    private void OnCollisionStay(Collision collision)
    {
        
    }

    private void OnControllerColliderHit(ControllerColliderHit hit)
    {
        
    }

}