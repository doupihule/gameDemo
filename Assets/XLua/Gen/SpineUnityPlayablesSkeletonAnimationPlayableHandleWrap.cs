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
    public class SpineUnityPlayablesSkeletonAnimationPlayableHandleWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Playables.SkeletonAnimationPlayableHandle);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 3, 1);
			
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Skeleton", _g_get_Skeleton);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "SkeletonData", _g_get_SkeletonData);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "skeletonAnimation", _g_get_skeletonAnimation);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "skeletonAnimation", _s_set_skeletonAnimation);
            
			
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
					
					Spine.Unity.Playables.SkeletonAnimationPlayableHandle gen_ret = new Spine.Unity.Playables.SkeletonAnimationPlayableHandle();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Playables.SkeletonAnimationPlayableHandle constructor!");
            
        }
        
		
        
		
        
        
        
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Skeleton(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SkeletonAnimationPlayableHandle gen_to_be_invoked = (Spine.Unity.Playables.SkeletonAnimationPlayableHandle)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Skeleton);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_SkeletonData(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SkeletonAnimationPlayableHandle gen_to_be_invoked = (Spine.Unity.Playables.SkeletonAnimationPlayableHandle)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.SkeletonData);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_skeletonAnimation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SkeletonAnimationPlayableHandle gen_to_be_invoked = (Spine.Unity.Playables.SkeletonAnimationPlayableHandle)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.skeletonAnimation);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_skeletonAnimation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SkeletonAnimationPlayableHandle gen_to_be_invoked = (Spine.Unity.Playables.SkeletonAnimationPlayableHandle)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.skeletonAnimation = (Spine.Unity.SkeletonAnimation)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonAnimation));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
