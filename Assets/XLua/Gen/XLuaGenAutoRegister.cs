﻿#if USE_UNI_LUA
using LuaAPI = UniLua.Lua;
using RealStatePtr = UniLua.ILuaState;
using LuaCSFunction = UniLua.CSharpFunctionDelegate;
#else
using LuaAPI = XLua.LuaDLL.Lua;
using RealStatePtr = System.IntPtr;
using LuaCSFunction = XLua.LuaDLL.lua_CSFunction;
#endif

using System;
using System.Collections.Generic;
using System.Reflection;


namespace XLua.CSObjectWrap
{
    public class XLua_Gen_Initer_Register__
	{
        
        
        static void wrapInit0(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(XLua.CSRegisterObject), XLuaCSRegisterObjectWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(XLua.LuaBehaviour), XLuaLuaBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(XLua.UILuaBehaviour), XLuaUILuaBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(XLua.XLuaHelper), XLuaXLuaHelperWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.CommonUtil), GameUtilsCommonUtilWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.ExtensionMethods), GameUtilsExtensionMethodsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Resource.ResourceManager), ResourceResourceManagerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnimationEvent), UnityEngineAnimationEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnimationClip), UnityEngineAnimationClipWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Animation), UnityEngineAnimationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnimationState), UnityEngineAnimationStateWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Animator), UnityEngineAnimatorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.StateMachineBehaviour), UnityEngineStateMachineBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnimatorClipInfo), UnityEngineAnimatorClipInfoWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnimatorStateInfo), UnityEngineAnimatorStateInfoWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnimatorTransitionInfo), UnityEngineAnimatorTransitionInfoWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.MatchTargetWeightMask), UnityEngineMatchTargetWeightMaskWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnimatorOverrideController), UnityEngineAnimatorOverrideControllerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnimatorUtility), UnityEngineAnimatorUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Avatar), UnityEngineAvatarWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SkeletonBone), UnityEngineSkeletonBoneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HumanLimit), UnityEngineHumanLimitWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HumanBone), UnityEngineHumanBoneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HumanDescription), UnityEngineHumanDescriptionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AvatarBuilder), UnityEngineAvatarBuilderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AvatarMask), UnityEngineAvatarMaskWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HumanPose), UnityEngineHumanPoseWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HumanPoseHandler), UnityEngineHumanPoseHandlerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HumanTrait), UnityEngineHumanTraitWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RuntimeAnimatorController), UnityEngineRuntimeAnimatorControllerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AssetBundle), UnityEngineAssetBundleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AssetBundleCreateRequest), UnityEngineAssetBundleCreateRequestWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AssetBundleManifest), UnityEngineAssetBundleManifestWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AssetBundleRecompressOperation), UnityEngineAssetBundleRecompressOperationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AssetBundleRequest), UnityEngineAssetBundleRequestWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BuildCompression), UnityEngineBuildCompressionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioConfiguration), UnityEngineAudioConfigurationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioClip), UnityEngineAudioClipWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioBehaviour), UnityEngineAudioBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioListener), UnityEngineAudioListenerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioSource), UnityEngineAudioSourceWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioReverbZone), UnityEngineAudioReverbZoneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioLowPassFilter), UnityEngineAudioLowPassFilterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioHighPassFilter), UnityEngineAudioHighPassFilterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioDistortionFilter), UnityEngineAudioDistortionFilterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioEchoFilter), UnityEngineAudioEchoFilterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioChorusFilter), UnityEngineAudioChorusFilterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioReverbFilter), UnityEngineAudioReverbFilterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Microphone), UnityEngineMicrophoneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WebCamDevice), UnityEngineWebCamDeviceWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WebCamTexture), UnityEngineWebCamTextureWrap.__Register);
        
        }
        
        static void wrapInit1(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(UnityEngine.AudioRenderer), UnityEngineAudioRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ClothSphereColliderPair), UnityEngineClothSphereColliderPairWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Cloth), UnityEngineClothWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ClothSkinningCoefficient), UnityEngineClothSkinningCoefficientWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Keyframe), UnityEngineKeyframeWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnimationCurve), UnityEngineAnimationCurveWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Application), UnityEngineApplicationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AsyncOperation), UnityEngineAsyncOperationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ExecuteAlways), UnityEngineExecuteAlwaysWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.DefaultExecutionOrder), UnityEngineDefaultExecutionOrderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Behaviour), UnityEngineBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BillboardAsset), UnityEngineBillboardAssetWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BillboardRenderer), UnityEngineBillboardRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Bounds), UnityEngineBoundsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BoundsInt), UnityEngineBoundsIntWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CachedAssetBundle), UnityEngineCachedAssetBundleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Cache), UnityEngineCacheWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Camera), UnityEngineCameraWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Camera.GateFitParameters), UnityEngineCameraGateFitParametersWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Color), UnityEngineColorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Color32), UnityEngineColor32Wrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ColorUtility), UnityEngineColorUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Component), UnityEngineComponentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ComputeBuffer), UnityEngineComputeBufferWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Coroutine), UnityEngineCoroutineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CrashReport), UnityEngineCrashReportWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BoundingSphere), UnityEngineBoundingSphereWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CullingGroupEvent), UnityEngineCullingGroupEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CullingGroup), UnityEngineCullingGroupWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CustomYieldInstruction), UnityEngineCustomYieldInstructionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Debug), UnityEngineDebugWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Display), UnityEngineDisplayWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ExposedPropertyResolver), UnityEngineExposedPropertyResolverWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.FlareLayer), UnityEngineFlareLayerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.GameObject), UnityEngineGameObjectWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.GeometryUtility), UnityEngineGeometryUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.GradientColorKey), UnityEngineGradientColorKeyWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.GradientAlphaKey), UnityEngineGradientAlphaKeyWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Gradient), UnityEngineGradientWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SleepTimeout), UnityEngineSleepTimeoutWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Screen), UnityEngineScreenWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RenderBuffer), UnityEngineRenderBufferWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Graphics), UnityEngineGraphicsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.GL), UnityEngineGLWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ScalableBufferManager), UnityEngineScalableBufferManagerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.FrameTiming), UnityEngineFrameTimingWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.FrameTimingManager), UnityEngineFrameTimingManagerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Resolution), UnityEngineResolutionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RenderTargetSetup), UnityEngineRenderTargetSetupWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RendererExtensions), UnityEngineRendererExtensionsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ImageEffectTransformsToLDR), UnityEngineImageEffectTransformsToLDRWrap.__Register);
        
        }
        
        static void wrapInit2(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(UnityEngine.ImageEffectAllowedInSceneView), UnityEngineImageEffectAllowedInSceneViewWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ImageEffectOpaque), UnityEngineImageEffectOpaqueWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ImageEffectAfterScale), UnityEngineImageEffectAfterScaleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Mesh), UnityEngineMeshWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Renderer), UnityEngineRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Projector), UnityEngineProjectorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Shader), UnityEngineShaderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.TrailRenderer), UnityEngineTrailRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.LineRenderer), UnityEngineLineRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.MaterialPropertyBlock), UnityEngineMaterialPropertyBlockWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RenderSettings), UnityEngineRenderSettingsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Material), UnityEngineMaterialWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.OcclusionPortal), UnityEngineOcclusionPortalWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.OcclusionArea), UnityEngineOcclusionAreaWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Flare), UnityEngineFlareWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.LensFlare), UnityEngineLensFlareWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Skybox), UnityEngineSkyboxWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.MeshFilter), UnityEngineMeshFilterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SkinnedMeshRenderer), UnityEngineSkinnedMeshRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.MeshRenderer), UnityEngineMeshRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RectOffset), UnityEngineRectOffsetWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Hash128), UnityEngineHash128Wrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HashUtilities), UnityEngineHashUtilitiesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HashUnsafeUtilities), UnityEngineHashUnsafeUtilitiesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Touch), UnityEngineTouchWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AccelerationEvent), UnityEngineAccelerationEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Gyroscope), UnityEngineGyroscopeWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.LocationInfo), UnityEngineLocationInfoWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.LocationService), UnityEngineLocationServiceWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Compass), UnityEngineCompassWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.LayerMask), UnityEngineLayerMaskWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.LineUtility), UnityEngineLineUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.LOD), UnityEngineLODWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.LODGroup), UnityEngineLODGroupWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.FrustumPlanes), UnityEngineFrustumPlanesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Matrix4x4), UnityEngineMatrix4x4Wrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Vector3), UnityEngineVector3Wrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Quaternion), UnityEngineQuaternionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Mathf), UnityEngineMathfWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BoneWeight), UnityEngineBoneWeightWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CombineInstance), UnityEngineCombineInstanceWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.MonoBehaviour), UnityEngineMonoBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Plane), UnityEnginePlaneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PlayerPrefsException), UnityEnginePlayerPrefsExceptionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PlayerPrefs), UnityEnginePlayerPrefsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Pose), UnityEnginePoseWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PropertyName), UnityEnginePropertyNameWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Random), UnityEngineRandomWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Random.State), UnityEngineRandomStateWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RangeInt), UnityEngineRangeIntWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Ray), UnityEngineRayWrap.__Register);
        
        }
        
        static void wrapInit3(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(UnityEngine.Ray2D), UnityEngineRay2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Rect), UnityEngineRectWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RectInt), UnityEngineRectIntWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ReflectionProbe), UnityEngineReflectionProbeWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ResourceRequest), UnityEngineResourceRequestWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Resources), UnityEngineResourcesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ScriptableObject), UnityEngineScriptableObjectWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Security), UnityEngineSecurityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PreferBinarySerialization), UnityEnginePreferBinarySerializationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ComputeShader), UnityEngineComputeShaderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SortingLayer), UnityEngineSortingLayerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.StackTraceUtility), UnityEngineStackTraceUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UnityException), UnityEngineUnityExceptionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.MissingComponentException), UnityEngineMissingComponentExceptionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UnassignedReferenceException), UnityEngineUnassignedReferenceExceptionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.MissingReferenceException), UnityEngineMissingReferenceExceptionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SystemInfo), UnityEngineSystemInfoWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.TextAsset), UnityEngineTextAssetWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Texture), UnityEngineTextureWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Texture2D), UnityEngineTexture2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Cubemap), UnityEngineCubemapWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Texture3D), UnityEngineTexture3DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Texture2DArray), UnityEngineTexture2DArrayWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CubemapArray), UnityEngineCubemapArrayWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SparseTexture), UnityEngineSparseTextureWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RenderTexture), UnityEngineRenderTextureWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CustomRenderTextureUpdateZone), UnityEngineCustomRenderTextureUpdateZoneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CustomRenderTexture), UnityEngineCustomRenderTextureWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RenderTextureDescriptor), UnityEngineRenderTextureDescriptorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Time), UnityEngineTimeWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Object), UnityEngineObjectWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UnityEventQueueSystem), UnityEngineUnityEventQueueSystemWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Vector2), UnityEngineVector2Wrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Vector2Int), UnityEngineVector2IntWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Vector3Int), UnityEngineVector3IntWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Vector4), UnityEngineVector4Wrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WaitForEndOfFrame), UnityEngineWaitForEndOfFrameWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WaitForFixedUpdate), UnityEngineWaitForFixedUpdateWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WaitForSeconds), UnityEngineWaitForSecondsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WaitForSecondsRealtime), UnityEngineWaitForSecondsRealtimeWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WaitUntil), UnityEngineWaitUntilWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WaitWhile), UnityEngineWaitWhileWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.YieldInstruction), UnityEngineYieldInstructionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.DynamicGI), UnityEngineDynamicGIWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Logger), UnityEngineLoggerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.StaticBatchingUtility), UnityEngineStaticBatchingUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RectTransform), UnityEngineRectTransformWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Transform), UnityEngineTransformWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SpriteRenderer), UnityEngineSpriteRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Sprite), UnityEngineSpriteWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Grid), UnityEngineGridWrap.__Register);
        
        }
        
        static void wrapInit4(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(UnityEngine.GridLayout), UnityEngineGridLayoutWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Event), UnityEngineEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ImageConversion), UnityEngineImageConversionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.JsonUtility), UnityEngineJsonUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.LocalizationAsset), UnityEngineLocalizationAssetWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem), UnityEngineParticleSystemWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.MainModule), UnityEngineParticleSystemMainModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.EmissionModule), UnityEngineParticleSystemEmissionModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.ShapeModule), UnityEngineParticleSystemShapeModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.VelocityOverLifetimeModule), UnityEngineParticleSystemVelocityOverLifetimeModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.LimitVelocityOverLifetimeModule), UnityEngineParticleSystemLimitVelocityOverLifetimeModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.InheritVelocityModule), UnityEngineParticleSystemInheritVelocityModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.ForceOverLifetimeModule), UnityEngineParticleSystemForceOverLifetimeModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.ColorOverLifetimeModule), UnityEngineParticleSystemColorOverLifetimeModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.ColorBySpeedModule), UnityEngineParticleSystemColorBySpeedModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.SizeOverLifetimeModule), UnityEngineParticleSystemSizeOverLifetimeModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.SizeBySpeedModule), UnityEngineParticleSystemSizeBySpeedModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.RotationOverLifetimeModule), UnityEngineParticleSystemRotationOverLifetimeModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.RotationBySpeedModule), UnityEngineParticleSystemRotationBySpeedModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.ExternalForcesModule), UnityEngineParticleSystemExternalForcesModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.NoiseModule), UnityEngineParticleSystemNoiseModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.CollisionModule), UnityEngineParticleSystemCollisionModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.TriggerModule), UnityEngineParticleSystemTriggerModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.SubEmittersModule), UnityEngineParticleSystemSubEmittersModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.TextureSheetAnimationModule), UnityEngineParticleSystemTextureSheetAnimationModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.LightsModule), UnityEngineParticleSystemLightsModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.TrailModule), UnityEngineParticleSystemTrailModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.CustomDataModule), UnityEngineParticleSystemCustomDataModuleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.MinMaxCurve), UnityEngineParticleSystemMinMaxCurveWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.Particle), UnityEngineParticleSystemParticleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.Burst), UnityEngineParticleSystemBurstWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.MinMaxGradient), UnityEngineParticleSystemMinMaxGradientWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystem.EmitParams), UnityEngineParticleSystemEmitParamsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleSystemRenderer), UnityEngineParticleSystemRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticleCollisionEvent), UnityEngineParticleCollisionEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ParticlePhysicsExtensions), UnityEngineParticlePhysicsExtensionsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WheelFrictionCurve), UnityEngineWheelFrictionCurveWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SoftJointLimit), UnityEngineSoftJointLimitWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SoftJointLimitSpring), UnityEngineSoftJointLimitSpringWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.JointDrive), UnityEngineJointDriveWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.JointMotor), UnityEngineJointMotorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.JointSpring), UnityEngineJointSpringWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.JointLimits), UnityEngineJointLimitsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ControllerColliderHit), UnityEngineControllerColliderHitWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Collision), UnityEngineCollisionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PhysicMaterial), UnityEnginePhysicMaterialWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RaycastHit), UnityEngineRaycastHitWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Rigidbody), UnityEngineRigidbodyWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Collider), UnityEngineColliderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CharacterController), UnityEngineCharacterControllerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.MeshCollider), UnityEngineMeshColliderWrap.__Register);
        
        }
        
        static void wrapInit5(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(UnityEngine.CapsuleCollider), UnityEngineCapsuleColliderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BoxCollider), UnityEngineBoxColliderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SphereCollider), UnityEngineSphereColliderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ConstantForce), UnityEngineConstantForceWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Joint), UnityEngineJointWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HingeJoint), UnityEngineHingeJointWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SpringJoint), UnityEngineSpringJointWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.FixedJoint), UnityEngineFixedJointWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CharacterJoint), UnityEngineCharacterJointWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ConfigurableJoint), UnityEngineConfigurableJointWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ContactPoint), UnityEngineContactPointWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PhysicsScene), UnityEnginePhysicsSceneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PhysicsSceneExtensions), UnityEnginePhysicsSceneExtensionsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Physics), UnityEnginePhysicsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RaycastCommand), UnityEngineRaycastCommandWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SpherecastCommand), UnityEngineSpherecastCommandWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CapsulecastCommand), UnityEngineCapsulecastCommandWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BoxcastCommand), UnityEngineBoxcastCommandWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PhysicsScene2D), UnityEnginePhysicsScene2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PhysicsSceneExtensions2D), UnityEnginePhysicsSceneExtensions2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Physics2D), UnityEnginePhysics2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ColliderDistance2D), UnityEngineColliderDistance2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ContactFilter2D), UnityEngineContactFilter2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Collision2D), UnityEngineCollision2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ContactPoint2D), UnityEngineContactPoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.JointAngleLimits2D), UnityEngineJointAngleLimits2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.JointTranslationLimits2D), UnityEngineJointTranslationLimits2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.JointMotor2D), UnityEngineJointMotor2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.JointSuspension2D), UnityEngineJointSuspension2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RaycastHit2D), UnityEngineRaycastHit2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PhysicsJobOptions2D), UnityEnginePhysicsJobOptions2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Rigidbody2D), UnityEngineRigidbody2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Collider2D), UnityEngineCollider2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CircleCollider2D), UnityEngineCircleCollider2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CapsuleCollider2D), UnityEngineCapsuleCollider2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.EdgeCollider2D), UnityEngineEdgeCollider2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BoxCollider2D), UnityEngineBoxCollider2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PolygonCollider2D), UnityEnginePolygonCollider2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CompositeCollider2D), UnityEngineCompositeCollider2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Joint2D), UnityEngineJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.AnchoredJoint2D), UnityEngineAnchoredJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SpringJoint2D), UnityEngineSpringJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.DistanceJoint2D), UnityEngineDistanceJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.FrictionJoint2D), UnityEngineFrictionJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.HingeJoint2D), UnityEngineHingeJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RelativeJoint2D), UnityEngineRelativeJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SliderJoint2D), UnityEngineSliderJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.TargetJoint2D), UnityEngineTargetJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.FixedJoint2D), UnityEngineFixedJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WheelJoint2D), UnityEngineWheelJoint2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Effector2D), UnityEngineEffector2DWrap.__Register);
        
        }
        
        static void wrapInit6(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(UnityEngine.AreaEffector2D), UnityEngineAreaEffector2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.BuoyancyEffector2D), UnityEngineBuoyancyEffector2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PointEffector2D), UnityEnginePointEffector2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PlatformEffector2D), UnityEnginePlatformEffector2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SurfaceEffector2D), UnityEngineSurfaceEffector2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PhysicsUpdateBehaviour2D), UnityEnginePhysicsUpdateBehaviour2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ConstantForce2D), UnityEngineConstantForce2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PhysicsMaterial2D), UnityEnginePhysicsMaterial2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.ScreenCapture), UnityEngineScreenCaptureWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.SpriteMask), UnityEngineSpriteMaskWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.StreamingController), UnityEngineStreamingControllerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.PatchExtents), UnityEnginePatchExtentsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.TextGenerationSettings), UnityEngineTextGenerationSettingsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.TextMesh), UnityEngineTextMeshWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.CharacterInfo), UnityEngineCharacterInfoWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UICharInfo), UnityEngineUICharInfoWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UILineInfo), UnityEngineUILineInfoWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UIVertex), UnityEngineUIVertexWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.Font), UnityEngineFontWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.GridBrushBase), UnityEngineGridBrushBaseWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UISystemProfilerApi), UnityEngineUISystemProfilerApiWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RectTransformUtility), UnityEngineRectTransformUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RemoteSettings), UnityEngineRemoteSettingsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.RemoteConfigSettings), UnityEngineRemoteConfigSettingsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WWWForm), UnityEngineWWWFormWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WheelHit), UnityEngineWheelHitWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WheelCollider), UnityEngineWheelColliderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.WindZone), UnityEngineWindZoneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.AnimationTriggers), UnityEngineUIAnimationTriggersWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Button), UnityEngineUIButtonWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Button.ButtonClickedEvent), UnityEngineUIButtonButtonClickedEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.CanvasUpdateRegistry), UnityEngineUICanvasUpdateRegistryWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.ColorBlock), UnityEngineUIColorBlockWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.DefaultControls), UnityEngineUIDefaultControlsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.DefaultControls.Resources), UnityEngineUIDefaultControlsResourcesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Dropdown), UnityEngineUIDropdownWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Dropdown.OptionData), UnityEngineUIDropdownOptionDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Dropdown.OptionDataList), UnityEngineUIDropdownOptionDataListWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Dropdown.DropdownEvent), UnityEngineUIDropdownDropdownEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.FontData), UnityEngineUIFontDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.FontUpdateTracker), UnityEngineUIFontUpdateTrackerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Graphic), UnityEngineUIGraphicWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.GraphicRaycaster), UnityEngineUIGraphicRaycasterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.GraphicRegistry), UnityEngineUIGraphicRegistryWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Image), UnityEngineUIImageWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.InputField), UnityEngineUIInputFieldWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.InputField.SubmitEvent), UnityEngineUIInputFieldSubmitEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.InputField.OnChangeEvent), UnityEngineUIInputFieldOnChangeEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Mask), UnityEngineUIMaskWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.MaskableGraphic), UnityEngineUIMaskableGraphicWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.MaskableGraphic.CullStateChangedEvent), UnityEngineUIMaskableGraphicCullStateChangedEventWrap.__Register);
        
        }
        
        static void wrapInit7(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.MaskUtilities), UnityEngineUIMaskUtilitiesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Navigation), UnityEngineUINavigationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.RawImage), UnityEngineUIRawImageWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.RectMask2D), UnityEngineUIRectMask2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Scrollbar), UnityEngineUIScrollbarWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Scrollbar.ScrollEvent), UnityEngineUIScrollbarScrollEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.ScrollRect), UnityEngineUIScrollRectWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.ScrollRect.ScrollRectEvent), UnityEngineUIScrollRectScrollRectEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Selectable), UnityEngineUISelectableWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Slider), UnityEngineUISliderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Slider.SliderEvent), UnityEngineUISliderSliderEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.SpriteState), UnityEngineUISpriteStateWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.StencilMaterial), UnityEngineUIStencilMaterialWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Text), UnityEngineUITextWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Toggle), UnityEngineUIToggleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Toggle.ToggleEvent), UnityEngineUIToggleToggleEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.ToggleGroup), UnityEngineUIToggleGroupWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.ClipperRegistry), UnityEngineUIClipperRegistryWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Clipping), UnityEngineUIClippingWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.AspectRatioFitter), UnityEngineUIAspectRatioFitterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.CanvasScaler), UnityEngineUICanvasScalerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.ContentSizeFitter), UnityEngineUIContentSizeFitterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.GridLayoutGroup), UnityEngineUIGridLayoutGroupWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.HorizontalLayoutGroup), UnityEngineUIHorizontalLayoutGroupWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.HorizontalOrVerticalLayoutGroup), UnityEngineUIHorizontalOrVerticalLayoutGroupWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.LayoutElement), UnityEngineUILayoutElementWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.LayoutGroup), UnityEngineUILayoutGroupWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.LayoutRebuilder), UnityEngineUILayoutRebuilderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.LayoutUtility), UnityEngineUILayoutUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.VerticalLayoutGroup), UnityEngineUIVerticalLayoutGroupWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.VertexHelper), UnityEngineUIVertexHelperWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.BaseMeshEffect), UnityEngineUIBaseMeshEffectWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Outline), UnityEngineUIOutlineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.PositionAsUV1), UnityEngineUIPositionAsUV1Wrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UnityEngine.UI.Shadow), UnityEngineUIShadowWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Main), MainWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameResourceCacheObjects), GameResourceCacheObjectsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(FPSLabel), FPSLabelWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(MouseInputState), MouseInputStateWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(ScreenTexture2DReadPixels), ScreenTexture2DReadPixelsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(UI3DEventParament), UI3DEventParamentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(SpineSkeletonFlipBehaviour), SpineSkeletonFlipBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(SpineSkeletonFlipClip), SpineSkeletonFlipClipWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(SharpJson.JsonDecoder), SharpJsonJsonDecoderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Animation), SpineAnimationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.CurveTimeline), SpineCurveTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.RotateTimeline), SpineRotateTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.TranslateTimeline), SpineTranslateTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.ScaleTimeline), SpineScaleTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.ShearTimeline), SpineShearTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.ColorTimeline), SpineColorTimelineWrap.__Register);
        
        }
        
        static void wrapInit8(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(Spine.TwoColorTimeline), SpineTwoColorTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.AttachmentTimeline), SpineAttachmentTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.DeformTimeline), SpineDeformTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.EventTimeline), SpineEventTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.DrawOrderTimeline), SpineDrawOrderTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.IkConstraintTimeline), SpineIkConstraintTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.TransformConstraintTimeline), SpineTransformConstraintTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.PathConstraintPositionTimeline), SpinePathConstraintPositionTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.PathConstraintSpacingTimeline), SpinePathConstraintSpacingTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.PathConstraintMixTimeline), SpinePathConstraintMixTimelineWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.AnimationState), SpineAnimationStateWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.TrackEntry), SpineTrackEntryWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.AnimationStateData), SpineAnimationStateDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Atlas), SpineAtlasWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.AtlasPage), SpineAtlasPageWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.AtlasRegion), SpineAtlasRegionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.AtlasAttachmentLoader), SpineAtlasAttachmentLoaderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Attachment), SpineAttachmentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.BoundingBoxAttachment), SpineBoundingBoxAttachmentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.ClippingAttachment), SpineClippingAttachmentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.MeshAttachment), SpineMeshAttachmentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.PathAttachment), SpinePathAttachmentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.PointAttachment), SpinePointAttachmentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.RegionAttachment), SpineRegionAttachmentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.VertexAttachment), SpineVertexAttachmentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Bone), SpineBoneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.BoneData), SpineBoneDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Event), SpineEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.EventData), SpineEventDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.IkConstraint), SpineIkConstraintWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.IkConstraintData), SpineIkConstraintDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Json), SpineJsonWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.MathUtils), SpineMathUtilsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.PathConstraint), SpinePathConstraintWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.PathConstraintData), SpinePathConstraintDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Skeleton), SpineSkeletonWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.SkeletonBinary), SpineSkeletonBinaryWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.SkeletonBounds), SpineSkeletonBoundsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Polygon), SpinePolygonWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.SkeletonClipping), SpineSkeletonClippingWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.SkeletonData), SpineSkeletonDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.SkeletonJson), SpineSkeletonJsonWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Skin), SpineSkinWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Slot), SpineSlotWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.SlotData), SpineSlotDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.TransformConstraint), SpineTransformConstraintWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.TransformConstraintData), SpineTransformConstraintDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.BoneMatrix), SpineBoneMatrixWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.SkeletonExtensions), SpineSkeletonExtensionsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.AnimationReferenceAsset), SpineUnityAnimationReferenceAssetWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.AtlasAsset), SpineUnityAtlasAssetWrap.__Register);
        
        }
        
        static void wrapInit9(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(Spine.Unity.MaterialsTextureLoader), SpineUnityMaterialsTextureLoaderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.EventDataReferenceAsset), SpineUnityEventDataReferenceAssetWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.RegionlessAttachmentLoader), SpineUnityRegionlessAttachmentLoaderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonDataAsset), SpineUnitySkeletonDataAssetWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.BoneFollower), SpineUnityBoneFollowerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.PointFollower), SpineUnityPointFollowerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonAnimation), SpineUnitySkeletonAnimationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonAnimator), SpineUnitySkeletonAnimatorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonRenderer), SpineUnitySkeletonRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineMesh), SpineUnitySpineMeshWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SubmeshInstruction), SpineUnitySubmeshInstructionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.MeshGeneratorBuffers), SpineUnityMeshGeneratorBuffersWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.MeshGenerator), SpineUnityMeshGeneratorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.MeshRendererBuffers), SpineUnityMeshRendererBuffersWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonRendererInstruction), SpineUnitySkeletonRendererInstructionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.BoundingBoxFollower), SpineUnityBoundingBoxFollowerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.BoneFollowerGraphic), SpineUnityBoneFollowerGraphicWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonGraphic), SpineUnitySkeletonGraphicWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.WaitForSpineAnimationComplete), SpineUnityWaitForSpineAnimationCompleteWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.WaitForSpineEvent), SpineUnityWaitForSpineEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.WaitForSpineTrackEntryEnd), SpineUnityWaitForSpineTrackEntryEndWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonExtensions), SpineUnitySkeletonExtensionsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonUtility), SpineUnitySkeletonUtilityWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonUtilityBone), SpineUnitySkeletonUtilityBoneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonUtilityConstraint), SpineUnitySkeletonUtilityConstraintWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineAttributeBase), SpineUnitySpineAttributeBaseWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineSlot), SpineUnitySpineSlotWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineEvent), SpineUnitySpineEventWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineIkConstraint), SpineUnitySpineIkConstraintWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpinePathConstraint), SpineUnitySpinePathConstraintWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineTransformConstraint), SpineUnitySpineTransformConstraintWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineSkin), SpineUnitySpineSkinWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineAnimation), SpineUnitySpineAnimationWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineAttachment), SpineUnitySpineAttachmentWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineBone), SpineUnitySpineBoneWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineAtlasRegion), SpineUnitySpineAtlasRegionWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Playables.SkeletonAnimationPlayableHandle), SpineUnityPlayablesSkeletonAnimationPlayableHandleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Playables.SpinePlayableHandleBase), SpineUnityPlayablesSpinePlayableHandleBaseWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Playables.SpineAnimationStateBehaviour), SpineUnityPlayablesSpineAnimationStateBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Playables.SpineAnimationStateClip), SpineUnityPlayablesSpineAnimationStateClipWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Playables.SpineAnimationStateMixerBehaviour), SpineUnityPlayablesSpineAnimationStateMixerBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Playables.SpineAnimationStateTrack), SpineUnityPlayablesSpineAnimationStateTrackWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Playables.SpineSkeletonFlipMixerBehaviour), SpineUnityPlayablesSpineSkeletonFlipMixerBehaviourWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Playables.SpineSkeletonFlipTrack), SpineUnityPlayablesSpineSkeletonFlipTrackWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonRendererCustomMaterials), SpineUnityModulesSkeletonRendererCustomMaterialsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonGhost), SpineUnityModulesSkeletonGhostWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonGhostRenderer), SpineUnityModulesSkeletonGhostRendererWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonRagdoll), SpineUnityModulesSkeletonRagdollWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonRagdoll2D), SpineUnityModulesSkeletonRagdoll2DWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonGraphicMirror), SpineUnityModulesSkeletonGraphicMirrorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonPartsRenderer), SpineUnityModulesSkeletonPartsRendererWrap.__Register);
        
        }
        
        static void wrapInit10(LuaEnv luaenv, ObjectTranslator translator)
        {
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonRenderSeparator), SpineUnityModulesSkeletonRenderSeparatorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonUtilityEyeConstraint), SpineUnityModulesSkeletonUtilityEyeConstraintWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonUtilityGroundConstraint), SpineUnityModulesSkeletonUtilityGroundConstraintWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonUtilityKinematicShadow), SpineUnityModulesSkeletonUtilityKinematicShadowWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SlotBlendModes), SpineUnityModulesSlotBlendModesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.AttachmentTools.AttachmentRegionExtensions), SpineUnityModulesAttachmentToolsAttachmentRegionExtensionsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.AttachmentTools.AtlasUtilities), SpineUnityModulesAttachmentToolsAtlasUtilitiesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.AttachmentTools.SkinUtilities), SpineUnityModulesAttachmentToolsSkinUtilitiesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.AttachmentTools.AttachmentCloneExtensions), SpineUnityModulesAttachmentToolsAttachmentCloneExtensionsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.AESUtil), GameUtilsAESUtilWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.ByteStreamReader), GameUtilsByteStreamReaderWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.ByteStreamWriter), GameUtilsByteStreamWriterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.CRC32), GameUtilsCRC32Wrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.DebugToScreen), GameUtilsDebugToScreenWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.DebugUtils), GameUtilsDebugUtilsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.LogWriter), GameUtilsLogWriterWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.Loom), GameUtilsLoomWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.PlayerPreferences), GameUtilsPlayerPreferencesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.Rijndael), GameUtilsRijndaelWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.SpriteRendererInspectorExpand), GameUtilsSpriteRendererInspectorExpandWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Resource.DownloadResource), ResourceDownloadResourceWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Resource.DownLoadThread), ResourceDownLoadThreadWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Resource.FileVersionData), ResourceFileVersionDataWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Resource.LoadAssetBundle), ResourceLoadAssetBundleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Resource.LoadResources), ResourceLoadResourcesWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Resource.UncompressFile), ResourceUncompressFileWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Constants.GameConstants), ConstantsGameConstantsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Constants.AssetBundleAlwaysCache), ConstantsAssetBundleAlwaysCacheWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.AnimationStateData.AnimationPair), SpineAnimationStateDataAnimationPairWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.AnimationStateData.AnimationPairComparer), SpineAnimationStateDataAnimationPairComparerWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Skin.AttachmentKeyTuple), SpineSkinAttachmentKeyTupleWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SkeletonAnimator.MecanimTranslator), SpineUnitySkeletonAnimatorMecanimTranslatorWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.MeshGenerator.Settings), SpineUnityMeshGeneratorSettingsWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.MeshRendererBuffers.SmartMesh), SpineUnityMeshRendererBuffersSmartMeshWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.SpineAttachment.Hierarchy), SpineUnitySpineAttachmentHierarchyWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonRendererCustomMaterials.SlotMaterialOverride), SpineUnityModulesSkeletonRendererCustomMaterialsSlotMaterialOverrideWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonRendererCustomMaterials.AtlasMaterialOverride), SpineUnityModulesSkeletonRendererCustomMaterialsAtlasMaterialOverrideWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SkeletonRagdoll.LayerFieldAttribute), SpineUnityModulesSkeletonRagdollLayerFieldAttributeWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(Spine.Unity.Modules.SlotBlendModes.MaterialTexturePair), SpineUnityModulesSlotBlendModesMaterialTexturePairWrap.__Register);
        
        
            translator.DelayWrapLoader(typeof(GameUtils.Loom.DelayedQueueItem), GameUtilsLoomDelayedQueueItemWrap.__Register);
        
        
        
        }
        
        static void Init(LuaEnv luaenv, ObjectTranslator translator)
        {
            
            wrapInit0(luaenv, translator);
            
            wrapInit1(luaenv, translator);
            
            wrapInit2(luaenv, translator);
            
            wrapInit3(luaenv, translator);
            
            wrapInit4(luaenv, translator);
            
            wrapInit5(luaenv, translator);
            
            wrapInit6(luaenv, translator);
            
            wrapInit7(luaenv, translator);
            
            wrapInit8(luaenv, translator);
            
            wrapInit9(luaenv, translator);
            
            wrapInit10(luaenv, translator);
            
            
        }
        
	    static XLua_Gen_Initer_Register__()
        {
		    XLua.LuaEnv.AddIniter(Init);
		}
		
		
	}
	
}
namespace XLua
{
	public partial class ObjectTranslator
	{
		static XLua.CSObjectWrap.XLua_Gen_Initer_Register__ s_gen_reg_dumb_obj = new XLua.CSObjectWrap.XLua_Gen_Initer_Register__();
		static XLua.CSObjectWrap.XLua_Gen_Initer_Register__ gen_reg_dumb_obj {get{return s_gen_reg_dumb_obj;}}
	}
	
	internal partial class InternalGlobals
    {
	    
		delegate UnityEngine.PhysicsScene __GEN_DELEGATE0( UnityEngine.SceneManagement.Scene scene);
		
		delegate UnityEngine.PhysicsScene2D __GEN_DELEGATE1( UnityEngine.SceneManagement.Scene scene);
		
		delegate bool __GEN_DELEGATE2( Spine.TransformMode mode);
		
		delegate bool __GEN_DELEGATE3( Spine.TransformMode mode);
		
	    static InternalGlobals()
		{
		    extensionMethodMap = new Dictionary<Type, IEnumerable<MethodInfo>>()
			{
			    
				{typeof(UnityEngine.SceneManagement.Scene), new List<MethodInfo>(){
				
				  new __GEN_DELEGATE0(UnityEngine.PhysicsSceneExtensions.GetPhysicsScene)
#if UNITY_WSA && !UNITY_EDITOR
                                      .GetMethodInfo(),
#else
                                      .Method,
#endif
				
				  new __GEN_DELEGATE1(UnityEngine.PhysicsSceneExtensions2D.GetPhysicsScene2D)
#if UNITY_WSA && !UNITY_EDITOR
                                      .GetMethodInfo(),
#else
                                      .Method,
#endif
				
				}},
				
				{typeof(Spine.TransformMode), new List<MethodInfo>(){
				
				  new __GEN_DELEGATE2(Spine.SkeletonExtensions.InheritsRotation)
#if UNITY_WSA && !UNITY_EDITOR
                                      .GetMethodInfo(),
#else
                                      .Method,
#endif
				
				  new __GEN_DELEGATE3(Spine.SkeletonExtensions.InheritsScale)
#if UNITY_WSA && !UNITY_EDITOR
                                      .GetMethodInfo(),
#else
                                      .Method,
#endif
				
				}},
				
			};
			
			genTryArrayGetPtr = StaticLuaCallbacks.__tryArrayGet;
            genTryArraySetPtr = StaticLuaCallbacks.__tryArraySet;
		}
	}
}
