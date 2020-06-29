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
    public class SpineUnitySkeletonAnimatorMecanimTranslatorWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.SkeletonAnimator.MecanimTranslator);
			Utils.BeginObjectRegister(type, L, translator, 0, 2, 3, 2);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Initialize", _m_Initialize);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Apply", _m_Apply);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Animator", _g_get_Animator);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "autoReset", _g_get_autoReset);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "layerMixModes", _g_get_layerMixModes);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "autoReset", _s_set_autoReset);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "layerMixModes", _s_set_layerMixModes);
            
			
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
					
					Spine.Unity.SkeletonAnimator.MecanimTranslator gen_ret = new Spine.Unity.SkeletonAnimator.MecanimTranslator();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonAnimator.MecanimTranslator constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Initialize(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonAnimator.MecanimTranslator gen_to_be_invoked = (Spine.Unity.SkeletonAnimator.MecanimTranslator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Animator _animator = (UnityEngine.Animator)translator.GetObject(L, 2, typeof(UnityEngine.Animator));
                    Spine.Unity.SkeletonDataAsset _skeletonDataAsset = (Spine.Unity.SkeletonDataAsset)translator.GetObject(L, 3, typeof(Spine.Unity.SkeletonDataAsset));
                    
                    gen_to_be_invoked.Initialize( _animator, _skeletonDataAsset );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Apply(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonAnimator.MecanimTranslator gen_to_be_invoked = (Spine.Unity.SkeletonAnimator.MecanimTranslator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    
                    gen_to_be_invoked.Apply( _skeleton );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Animator(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonAnimator.MecanimTranslator gen_to_be_invoked = (Spine.Unity.SkeletonAnimator.MecanimTranslator)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Animator);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_autoReset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonAnimator.MecanimTranslator gen_to_be_invoked = (Spine.Unity.SkeletonAnimator.MecanimTranslator)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.autoReset);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_layerMixModes(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonAnimator.MecanimTranslator gen_to_be_invoked = (Spine.Unity.SkeletonAnimator.MecanimTranslator)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.layerMixModes);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_autoReset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonAnimator.MecanimTranslator gen_to_be_invoked = (Spine.Unity.SkeletonAnimator.MecanimTranslator)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.autoReset = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_layerMixModes(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonAnimator.MecanimTranslator gen_to_be_invoked = (Spine.Unity.SkeletonAnimator.MecanimTranslator)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.layerMixModes = (Spine.Unity.SkeletonAnimator.MecanimTranslator.MixMode[])translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonAnimator.MecanimTranslator.MixMode[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
