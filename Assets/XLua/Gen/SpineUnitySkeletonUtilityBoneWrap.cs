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
    public class SpineUnitySkeletonUtilityBoneWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.SkeletonUtilityBone);
			Utils.BeginObjectRegister(type, L, translator, 0, 3, 13, 12);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Reset", _m_Reset);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "DoUpdate", _m_DoUpdate);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "AddBoundingBox", _m_AddBoundingBox);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "IncompatibleTransformMode", _g_get_IncompatibleTransformMode);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "boneName", _g_get_boneName);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "parentReference", _g_get_parentReference);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "mode", _g_get_mode);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "position", _g_get_position);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "rotation", _g_get_rotation);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "scale", _g_get_scale);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "zPosition", _g_get_zPosition);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "overrideAlpha", _g_get_overrideAlpha);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "skeletonUtility", _g_get_skeletonUtility);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "bone", _g_get_bone);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "transformLerpComplete", _g_get_transformLerpComplete);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "valid", _g_get_valid);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "boneName", _s_set_boneName);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "parentReference", _s_set_parentReference);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "mode", _s_set_mode);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "position", _s_set_position);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "rotation", _s_set_rotation);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "scale", _s_set_scale);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "zPosition", _s_set_zPosition);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "overrideAlpha", _s_set_overrideAlpha);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "skeletonUtility", _s_set_skeletonUtility);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "bone", _s_set_bone);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "transformLerpComplete", _s_set_transformLerpComplete);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "valid", _s_set_valid);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 2, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "BoneTransformModeIncompatible", _m_BoneTransformModeIncompatible_xlua_st_);
            
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Spine.Unity.SkeletonUtilityBone gen_ret = new Spine.Unity.SkeletonUtilityBone();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonUtilityBone constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Reset(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Reset(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DoUpdate(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonUtilityBone.UpdatePhase _phase;translator.Get(L, 2, out _phase);
                    
                    gen_to_be_invoked.DoUpdate( _phase );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_BoneTransformModeIncompatible_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    Spine.Bone _bone = (Spine.Bone)translator.GetObject(L, 1, typeof(Spine.Bone));
                    
                        bool gen_ret = Spine.Unity.SkeletonUtilityBone.BoneTransformModeIncompatible( _bone );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AddBoundingBox(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _skinName = LuaAPI.lua_tostring(L, 2);
                    string _slotName = LuaAPI.lua_tostring(L, 3);
                    string _attachmentName = LuaAPI.lua_tostring(L, 4);
                    
                    gen_to_be_invoked.AddBoundingBox( _skinName, _slotName, _attachmentName );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_IncompatibleTransformMode(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.IncompatibleTransformMode);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_boneName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.boneName);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_parentReference(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.parentReference);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_mode(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.mode);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_position(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.position);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_rotation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.rotation);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_scale(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.scale);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_zPosition(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.zPosition);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_overrideAlpha(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.overrideAlpha);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_skeletonUtility(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.skeletonUtility);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_bone(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.bone);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_transformLerpComplete(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.transformLerpComplete);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_valid(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.valid);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_boneName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.boneName = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_parentReference(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.parentReference = (UnityEngine.Transform)translator.GetObject(L, 2, typeof(UnityEngine.Transform));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_mode(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                Spine.Unity.SkeletonUtilityBone.Mode gen_value;translator.Get(L, 2, out gen_value);
				gen_to_be_invoked.mode = gen_value;
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_position(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.position = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_rotation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.rotation = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_scale(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.scale = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_zPosition(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.zPosition = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_overrideAlpha(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.overrideAlpha = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_skeletonUtility(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.skeletonUtility = (Spine.Unity.SkeletonUtility)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonUtility));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_bone(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.bone = (Spine.Bone)translator.GetObject(L, 2, typeof(Spine.Bone));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_transformLerpComplete(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.transformLerpComplete = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_valid(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtilityBone gen_to_be_invoked = (Spine.Unity.SkeletonUtilityBone)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.valid = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
