﻿namespace PuertsStaticWrap
{
    public static class AutoStaticCodeRegister
    {
        public static void Register(Puerts.JsEnv jsEnv)
        {
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.Debug), UnityEngine_Debug_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.Vector3), UnityEngine_Vector3_Wrap.GetRegisterInfo);
            UnityEngine_Vector3_Wrap.InitBlittableCopy(jsEnv);
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.Vector2), UnityEngine_Vector2_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(System.Collections.Generic.List<int>), System_Collections_Generic_List_1_System_Int32__Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.Time), UnityEngine_Time_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.Transform), UnityEngine_Transform_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.RectTransform), UnityEngine_RectTransform_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.Component), UnityEngine_Component_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.GameObject), UnityEngine_GameObject_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.Object), UnityEngine_Object_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(System.Delegate), System_Delegate_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(UnityEngine.CanvasGroup), UnityEngine_CanvasGroup_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(Spine.Animation), Spine_Animation_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(Spine.AnimationState), Spine_AnimationState_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(Spine.Bone), Spine_Bone_Wrap.GetRegisterInfo);
            jsEnv.AddLazyStaticWrapLoader(typeof(Spine.Unity.SkeletonGraphic), Spine_Unity_SkeletonGraphic_Wrap.GetRegisterInfo);
            
        }
    }
}