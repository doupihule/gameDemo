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
    public class SpineUnityModulesSkeletonGhostRendererWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Modules.SkeletonGhostRenderer);
			Utils.BeginObjectRegister(type, L, translator, 0, 2, 1, 1);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Initialize", _m_Initialize);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Cleanup", _m_Cleanup);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "fadeSpeed", _g_get_fadeSpeed);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "fadeSpeed", _s_set_fadeSpeed);
            
			
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
					
					Spine.Unity.Modules.SkeletonGhostRenderer gen_ret = new Spine.Unity.Modules.SkeletonGhostRenderer();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Modules.SkeletonGhostRenderer constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Initialize(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonGhostRenderer gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhostRenderer)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Mesh _mesh = (UnityEngine.Mesh)translator.GetObject(L, 2, typeof(UnityEngine.Mesh));
                    UnityEngine.Material[] _materials = (UnityEngine.Material[])translator.GetObject(L, 3, typeof(UnityEngine.Material[]));
                    UnityEngine.Color32 _color;translator.Get(L, 4, out _color);
                    bool _additive = LuaAPI.lua_toboolean(L, 5);
                    float _speed = (float)LuaAPI.lua_tonumber(L, 6);
                    int _sortingLayerID = LuaAPI.xlua_tointeger(L, 7);
                    int _sortingOrder = LuaAPI.xlua_tointeger(L, 8);
                    
                    gen_to_be_invoked.Initialize( _mesh, _materials, _color, _additive, _speed, _sortingLayerID, _sortingOrder );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Cleanup(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonGhostRenderer gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhostRenderer)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Cleanup(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_fadeSpeed(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhostRenderer gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhostRenderer)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.fadeSpeed);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_fadeSpeed(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGhostRenderer gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGhostRenderer)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.fadeSpeed = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
