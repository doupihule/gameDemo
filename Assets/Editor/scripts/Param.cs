using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

public class Param : MonoBehaviour {

    public enum ElementGroup {
        Player,
        Element,
        Target
    }

    [Tooltip ("Player 玩家\nElement 元素\nTarget 目标")]
    public ElementGroup m_ElementGroup = ElementGroup.Element;

    public enum ElementType {
        Wall,
        WoodBox,
        IronBox,
        TNTBomb,
        Ball,
        IronCube,
        TNTTrigger,
        IronStrip,
        Hostage,
        Portal,
        Custom
    }

    [Tooltip ("Wall 墙\nWoodBox 木箱\nIronBox 铁箱\nTNTBomb TNT炸弹\nBall 球\nIronCube 铁块\nTNTTrigger TNT触发器\nIronStrip 铁长条\nHostage 人质\nPortal 传送门\nCustom 自定义")]
    public ElementType m_ElementType = ElementType.Custom;
    private ElementType recentType = ElementType.Custom;
    public SerializableTest param = new SerializableTest ();
    // Use this for initialization
    void Start () {
        Debug.Log ("test");
    }

    // Update is called once per frame
    void Update () {
        Debug.Log ("test2");
    }

    void OnValidate () {
        if (recentType != m_ElementType) {
            switch (m_ElementType) {
                case ElementType.Wall:
                    param.m_break = false;
                    // param.m_explode = false;
                    param.m_rebound = true;
                    param.m_weight = 0;
                    break;
                case ElementType.WoodBox:
                    param.m_break = true;
                    // param.m_explode = false;
                    param.m_rebound = true;
                    param.m_weight = 0;
                    break;
                case ElementType.IronBox:
                    param.m_break = false;
                    // param.m_explode = false;
                    param.m_rebound = true;
                    param.m_weight = 2;
                    break;
                case ElementType.TNTBomb:
                    param.m_break = true;
                    // param.m_explode = true;
                    param.m_rebound = false;
                    param.m_weight = 0;
                    break;
                case ElementType.Ball:
                    param.m_break = false;
                    // param.m_explode = false;
                    param.m_rebound = true;
                    param.m_weight = 3;
                    break;
                case ElementType.IronCube:
                    param.m_break = false;
                    // param.m_explode = false;
                    param.m_rebound = true;
                    param.m_weight = 4;
                    break;
                case ElementType.TNTTrigger:
                    param.m_break = false;
                    // param.m_explode = true;
                    param.m_rebound = false;
                    param.m_weight = 0;
                    break;
                case ElementType.IronStrip:
                    param.m_break = false;
                    // param.m_explode = false;
                    param.m_rebound = true;
                    param.m_weight = 5;
                    break;
                case ElementType.Hostage:
                    param.m_break = false;
                    // param.m_explode = false;
                    param.m_rebound = false;
                    param.m_weight = 0;
                    break;
                case ElementType.Portal:
                    param.m_break = false;
                    // param.m_explode = false;
                    param.m_rebound = false;
                    param.m_weight = 0;
                    break;
                case ElementType.Custom:
                    break;
            }
            recentType = m_ElementType;
        }

    }

}

[System.Serializable]
public class SerializableTest {

    public bool m_pierce = false;
    [Tooltip ("破坏")]
    public bool m_break = false;
    public int m_autoMoveSpeed = 0;
    public Vector3 m_autoMoveDis = new Vector3 (0, 0, 0);
    [Tooltip ("爆炸")]
    public bool m_explodeButton = false;
    public bool m_explodeBox = false;
    public int m_explodeId = 0;
    public int m_explodeRange = 0;
    [Tooltip ("反弹")]
    public bool m_rebound = false;
    [Tooltip ("重量（0表示无此参数")]
    public int m_weight = 0;
    public bool m_portalIn = false;
    public bool m_portalOut = false;
    public int m_portalId = 0;

}