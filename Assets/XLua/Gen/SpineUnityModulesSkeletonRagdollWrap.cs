#if USE_UNI_LUA
using LuaAPI = UniLua.Lua;
using RealStatePtr = UniLua.ILuaState;
using LuaCSFunction = UniLua.CSharpFunctionDelegate;
#else
using LuaAPI = XLua.LuaDLL.Lua;
using RealStatePtr = System.IntPtr;
using LuaCSFunction = XLua.LuaDLL.lua_CSFunction;
#endif

using XLua;
using System.Collections.Generic;


namespace XLua.CSObjectWrap
{
    using Utils = XLua.Utils;
    public class SpineUnityModulesSkeletonRagdollWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Modules.SkeletonRagdoll);
			Utils.BeginObjectRegister(type, L, translator, 0, 5, 20, 14);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Apply", _m_Apply);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SmoothMix", _m_SmoothMix);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetSkeletonPosition", _m_SetSkeletonPosition);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Remove", _m_Remove);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetRigidbody", _m_GetRigidbody);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "RootRigidbody", _g_get_RootRigidbody);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "StartingBone", _g_get_StartingBone);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RootOffset", _g_get_RootOffset);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "IsActive", _g_get_IsActive);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RigidbodyArray", _g_get_RigidbodyArray);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "EstimatedSkeletonPosition", _g_get_EstimatedSkeletonPosition);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "startingBoneName", _g_get_startingBoneName);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "stopBoneNames", _g_get_stopBoneNames);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "applyOnStart", _g_get_applyOnStart);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "disableIK", _g_get_disableIK);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "disableOtherConstraints", _g_get_disableOtherConstraints);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "pinStartBone", _g_get_pinStartBone);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "enableJointCollision", _g_get_enableJointCollision);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "useGravity", _g_get_useGravity);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "thickness", _g_get_thickness);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "rotationLimit", _g_get_rotationLimit);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "rootMass", _g_get_rootMass);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "massFalloffFactor", _g_get_massFalloffFactor);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "colliderLayer", _g_get_colliderLayer);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "mix", _g_get_mix);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "startingBoneName", _s_set_startingBoneName);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "stopBoneNames", _s_set_stopBoneNames);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "applyOnStart", _s_set_applyOnStart);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "disableIK", _s_set_disableIK);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "disableOtherConstraints", _s_set_disableOtherConstraints);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "pinStartBone", _s_set_pinStartBone);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "enableJointCollision", _s_set_enableJointCollision);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "useGravity", _s_set_useGravity);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "thickness", _s_set_thickness);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "rotationLimit", _s_set_rotationLimit);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "rootMass", _s_set_rootMass);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "massFalloffFactor", _s_set_massFalloffFactor);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "colliderLayer", _s_set_colliderLayer);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "mix", _s_set_mix);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 1, 0, 0);
			
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Spine.Unity.Modules.SkeletonRagdoll gen_ret = new Spine.Unity.Modules.SkeletonRagdoll();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Modules.SkeletonRagdoll constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Apply(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Apply(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SmoothMix(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float _target = (float)LuaAPI.lua_tonumber(L, 2);
                    float _duration = (float)LuaAPI.lua_tonumber(L, 3);
                    
                        UnityEngine.Coroutine gen_ret = gen_to_be_invoked.SmoothMix( _target, _duration );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetSkeletonPosition(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Vector3 _worldPosition;translator.Get(L, 2, out _worldPosition);
                    
                    gen_to_be_invoked.SetSkeletonPosition( _worldPosition );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Remove(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Remove(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetRigidbody(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _boneName = LuaAPI.lua_tostring(L, 2);
                    
                        UnityEngine.Rigidbody gen_ret = gen_to_be_invoked.GetRigidbody( _boneName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RootRigidbody(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.RootRigidbody);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_StartingBone(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.StartingBone);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RootOffset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                translator.PushUnityEngineVector3(L, gen_to_be_invoked.RootOffset);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_IsActive(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.IsActive);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RigidbodyArray(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.RigidbodyArray);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_EstimatedSkeletonPosition(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                translator.PushUnityEngineVector3(L, gen_to_be_invoked.EstimatedSkeletonPosition);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_startingBoneName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.startingBoneName);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_stopBoneNames(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.stopBoneNames);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_applyOnStart(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.applyOnStart);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_disableIK(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.disableIK);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_disableOtherConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.disableOtherConstraints);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_pinStartBone(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.pinStartBone);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_enableJointCollision(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.enableJointCollision);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_useGravity(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.useGravity);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_thickness(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.thickness);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_rotationLimit(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.rotationLimit);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_rootMass(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.rootMass);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_massFalloffFactor(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.massFalloffFactor);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_colliderLayer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.colliderLayer);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_mix(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.mix);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_startingBoneName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.startingBoneName = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_stopBoneNames(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.stopBoneNames = (System.Collections.Generic.List<string>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<string>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_applyOnStart(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.applyOnStart = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_disableIK(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.disableIK = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_disableOtherConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.disableOtherConstraints = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_pinStartBone(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.pinStartBone = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_enableJointCollision(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.enableJointCollision = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_useGravity(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.useGravity = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_thickness(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.thickness = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_rotationLimit(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.rotationLimit = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_rootMass(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.rootMass = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_massFalloffFactor(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.massFalloffFactor = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_colliderLayer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.colliderLayer = LuaAPI.xlua_tointeger(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_mix(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRagdoll gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRagdoll)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.mix = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
