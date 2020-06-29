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
    public class SpineUnityBoneFollowerWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.BoneFollower);
			Utils.BeginObjectRegister(type, L, translator, 0, 5, 10, 10);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetBone", _m_SetBone);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Awake", _m_Awake);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "HandleRebuildRenderer", _m_HandleRebuildRenderer);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Initialize", _m_Initialize);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "LateUpdate", _m_LateUpdate);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "SkeletonRenderer", _g_get_SkeletonRenderer);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "skeletonRenderer", _g_get_skeletonRenderer);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "boneName", _g_get_boneName);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "followZPosition", _g_get_followZPosition);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "followBoneRotation", _g_get_followBoneRotation);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "followSkeletonFlip", _g_get_followSkeletonFlip);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "followLocalScale", _g_get_followLocalScale);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "initializeOnAwake", _g_get_initializeOnAwake);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "valid", _g_get_valid);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "bone", _g_get_bone);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "SkeletonRenderer", _s_set_SkeletonRenderer);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "skeletonRenderer", _s_set_skeletonRenderer);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "boneName", _s_set_boneName);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "followZPosition", _s_set_followZPosition);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "followBoneRotation", _s_set_followBoneRotation);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "followSkeletonFlip", _s_set_followSkeletonFlip);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "followLocalScale", _s_set_followLocalScale);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "initializeOnAwake", _s_set_initializeOnAwake);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "valid", _s_set_valid);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "bone", _s_set_bone);
            
			
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
					
					Spine.Unity.BoneFollower gen_ret = new Spine.Unity.BoneFollower();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.BoneFollower constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetBone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _name = LuaAPI.lua_tostring(L, 2);
                    
                        bool gen_ret = gen_to_be_invoked.SetBone( _name );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Awake(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Awake(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_HandleRebuildRenderer(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonRenderer _skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRenderer));
                    
                    gen_to_be_invoked.HandleRebuildRenderer( _skeletonRenderer );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Initialize(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Initialize(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_LateUpdate(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.LateUpdate(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_SkeletonRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.SkeletonRenderer);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_skeletonRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.skeletonRenderer);
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
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.boneName);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_followZPosition(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.followZPosition);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_followBoneRotation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.followBoneRotation);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_followSkeletonFlip(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.followSkeletonFlip);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_followLocalScale(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.followLocalScale);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_initializeOnAwake(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.initializeOnAwake);
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
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.valid);
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
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.bone);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_SkeletonRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.SkeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRenderer));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_skeletonRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRenderer));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_boneName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.boneName = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_followZPosition(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.followZPosition = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_followBoneRotation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.followBoneRotation = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_followSkeletonFlip(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.followSkeletonFlip = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_followLocalScale(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.followLocalScale = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_initializeOnAwake(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.initializeOnAwake = LuaAPI.lua_toboolean(L, 2);
            
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
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.valid = LuaAPI.lua_toboolean(L, 2);
            
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
			
                Spine.Unity.BoneFollower gen_to_be_invoked = (Spine.Unity.BoneFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.bone = (Spine.Bone)translator.GetObject(L, 2, typeof(Spine.Bone));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
