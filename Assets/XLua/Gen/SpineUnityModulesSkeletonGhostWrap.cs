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
    public class SpineUnityModulesSkeletonGhostWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Modules.SkeletonGhost);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 10, 10);
			
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "ghostingEnabled", _g_get_ghostingEnabled);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "spawnRate", _g_get_spawnRate);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "color", _g_get_color);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "additive", _g_get_additive);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "maximumGhosts", _g_get_maximumGhosts);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "fadeSpeed", _g_get_fadeSpeed);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "ghostShader", _g_get_ghostShader);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "textureFade", _g_get_textureFade);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "sortWithDistanceOnly", _g_get_sortWithDistanceOnly);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "zOffset", _g_get_zOffset);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "ghostingEnabled", _s_set_ghostingEnabled);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "spawnRate", _s_set_spawnRate);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "color", _s_set_color);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "additive", _s_set_additive);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "maximumGhosts", _s_set_maximumGhosts);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "fadeSpeed", _s_set_fadeSpeed);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "ghostShader", _s_set_ghostShader);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "textureFade", _s_set_textureFade);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "sortWithDistanceOnly", _s_set_sortWithDistanceOnly);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "zOffset", _s_set_zOffset);
            
			
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
					
					Spine.Unity.Modules.SkeletonGhost gen_ret = new Spine.Unity.Modules.SkeletonGhost();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Modules.SkeletonGhost constructor!");
            
        }
        
		
        
		
        
        
        
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_ghostingEnabled(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.ghostingEnabled);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_spawnRate(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.spawnRate);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_color(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.color);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_additive(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.additive);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_maximumGhosts(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.maximumGhosts);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_fadeSpeed(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.fadeSpeed);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_ghostShader(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.ghostShader);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_textureFade(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.textureFade);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_sortWithDistanceOnly(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.sortWithDistanceOnly);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_zOffset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.zOffset);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_ghostingEnabled(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.ghostingEnabled = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_spawnRate(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.spawnRate = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_color(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                UnityEngine.Color32 gen_value;translator.Get(L, 2, out gen_value);
				gen_to_be_invoked.color = gen_value;
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_additive(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.additive = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_maximumGhosts(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.maximumGhosts = LuaAPI.xlua_tointeger(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_fadeSpeed(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.fadeSpeed = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_ghostShader(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.ghostShader = (UnityEngine.Shader)translator.GetObject(L, 2, typeof(UnityEngine.Shader));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_textureFade(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.textureFade = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_sortWithDistanceOnly(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.sortWithDistanceOnly = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_zOffset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhost gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhost)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.zOffset = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
