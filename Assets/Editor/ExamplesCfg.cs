/*
 * Tencent is pleased to support the open source community by making InjectFix available.
 * Copyright (C) 2019 THL A29 Limited, a Tencent company.  All rights reserved.
 * InjectFix is licensed under the MIT License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
 * This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
 */

using System.Collections.Generic;
using Puerts;
using System;
using UnityEngine;
using Spine;
using Spine.Unity;
using Resource;
using GameUtils;
using UnityEngine.UI;
using System.Reflection;

//1、配置类必须打[Configure]标签
//2、必须放Editor目录
[Configure]
public class ExamplesCfg
{
    [Binding]
    static IEnumerable<Type> Bindings
    {
        get
        {
            return new List<Type>()
            {
                typeof(Debug),
                typeof(Vector3),
                typeof(Vector2),
                typeof(List<int>),
                //typeof(Dictionary<string, int>),
                typeof(Time),
                typeof(Transform),
                typeof(RectTransform),
                typeof(Component),
                typeof(Renderer),
                typeof(GameObject),
                typeof(UnityEngine.Object),
                typeof(Delegate),
                typeof(CanvasGroup),
                typeof(Image),
                typeof(Sprite),
                typeof(Text),
                typeof(Button),
                typeof(Button.ButtonClickedEvent),
                typeof(UnityEngine.Events.UnityEvent),
                typeof(Outline),
                typeof(Shadow),
                typeof(Camera),
                typeof(Plane),
                typeof(TrailRenderer),
                typeof(Input),
                typeof(Screen),


                typeof(Quaternion),
                typeof(UnityEngine.EventSystems.EventTrigger),
                typeof(UnityEngine.EventSystems.BaseEventData),
                typeof(UnityEngine.Events.UnityAction<UnityEngine.EventSystems.BaseEventData>),

                typeof(RaycastHit),
                typeof(Ray),
                typeof(Collider),
                typeof(BoxCollider),
                typeof(Collision),
                typeof(Rigidbody),
                typeof(UnityEngine.Physics),


                typeof(Animator),
                typeof(Spine.Animation),
                typeof(Spine.AnimationState),
                typeof(Spine.Bone),
                typeof(SkeletonGraphic),
                typeof(MeshGeneratorBuffers),
                


                typeof(ResourceManager),
                typeof(CommonUtil),

                typeof(ViewExtensionMethods),
                typeof(ComponentExtension),
                typeof(PhysicsExtensionMethods),

                typeof(ColliderListenerExpand),
            };
        }
    }

    [BlittableCopy]
    static IEnumerable<Type> Blittables
    {
        get
        {
            return new List<Type>()
            {
                //打开这个可以优化Vector3的GC，但需要开启unsafe编译
                //typeof(Vector3),
            };
        }
    }

    [Filter]
    private static bool Filter(MemberInfo meb)
    {
        string name = meb.Name;
        return name == "LoadAssetsWay" ||name == "OnRebuildRequested"||name == "IsJoystickPreconfigured" || name == "GetStereoViewMatrices" || name == "SetStereoProjectionMatrices" 
            || name == "SetStereoViewMatrices"|| name == "ResetFieldOfView" || name == "GetStereoProjectionMatrices";
    }
}
