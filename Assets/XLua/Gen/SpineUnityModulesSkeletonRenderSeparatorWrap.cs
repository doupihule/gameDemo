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
    public class SpineUnityModulesSkeletonRenderSeparatorWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Modules.SkeletonRenderSeparator);
			Utils.BeginObjectRegister(type, L, translator, 0, 1, 4, 4);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "AddPartsRenderer", _m_AddPartsRenderer);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "SkeletonRenderer", _g_get_SkeletonRenderer);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "copyPropertyBlock", _g_get_copyPropertyBlock);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "copyMeshRendererFlags", _g_get_copyMeshRendererFlags);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "partsRenderers", _g_get_partsRenderers);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "SkeletonRenderer", _s_set_SkeletonRenderer);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "copyPropertyBlock", _s_set_copyPropertyBlock);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "copyMeshRendererFlags", _s_set_copyMeshRendererFlags);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "partsRenderers", _s_set_partsRenderers);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 3, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "AddToSkeletonRenderer", _m_AddToSkeletonRenderer_xlua_st_);
            
			
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "DefaultSortingOrderIncrement", Spine.Unity.Modules.SkeletonRenderSeparator.DefaultSortingOrderIncrement);
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Spine.Unity.Modules.SkeletonRenderSeparator gen_ret = new Spine.Unity.Modules.SkeletonRenderSeparator();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Modules.SkeletonRenderSeparator constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AddToSkeletonRenderer_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 6&& translator.Assignable<Spine.Unity.SkeletonRenderer>(L, 1)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 6)) 
                {
                    Spine.Unity.SkeletonRenderer _skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRenderer));
                    int _sortingLayerID = LuaAPI.xlua_tointeger(L, 2);
                    int _extraPartsRenderers = LuaAPI.xlua_tointeger(L, 3);
                    int _sortingOrderIncrement = LuaAPI.xlua_tointeger(L, 4);
                    int _baseSortingOrder = LuaAPI.xlua_tointeger(L, 5);
                    bool _addMinimumPartsRenderers = LuaAPI.lua_toboolean(L, 6);
                    
                        Spine.Unity.Modules.SkeletonRenderSeparator gen_ret = Spine.Unity.Modules.SkeletonRenderSeparator.AddToSkeletonRenderer( _skeletonRenderer, _sortingLayerID, _extraPartsRenderers, _sortingOrderIncrement, _baseSortingOrder, _addMinimumPartsRenderers );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 5&& translator.Assignable<Spine.Unity.SkeletonRenderer>(L, 1)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)) 
                {
                    Spine.Unity.SkeletonRenderer _skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRenderer));
                    int _sortingLayerID = LuaAPI.xlua_tointeger(L, 2);
                    int _extraPartsRenderers = LuaAPI.xlua_tointeger(L, 3);
                    int _sortingOrderIncrement = LuaAPI.xlua_tointeger(L, 4);
                    int _baseSortingOrder = LuaAPI.xlua_tointeger(L, 5);
                    
                        Spine.Unity.Modules.SkeletonRenderSeparator gen_ret = Spine.Unity.Modules.SkeletonRenderSeparator.AddToSkeletonRenderer( _skeletonRenderer, _sortingLayerID, _extraPartsRenderers, _sortingOrderIncrement, _baseSortingOrder );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& translator.Assignable<Spine.Unity.SkeletonRenderer>(L, 1)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.Unity.SkeletonRenderer _skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRenderer));
                    int _sortingLayerID = LuaAPI.xlua_tointeger(L, 2);
                    int _extraPartsRenderers = LuaAPI.xlua_tointeger(L, 3);
                    int _sortingOrderIncrement = LuaAPI.xlua_tointeger(L, 4);
                    
                        Spine.Unity.Modules.SkeletonRenderSeparator gen_ret = Spine.Unity.Modules.SkeletonRenderSeparator.AddToSkeletonRenderer( _skeletonRenderer, _sortingLayerID, _extraPartsRenderers, _sortingOrderIncrement );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<Spine.Unity.SkeletonRenderer>(L, 1)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)) 
                {
                    Spine.Unity.SkeletonRenderer _skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRenderer));
                    int _sortingLayerID = LuaAPI.xlua_tointeger(L, 2);
                    int _extraPartsRenderers = LuaAPI.xlua_tointeger(L, 3);
                    
                        Spine.Unity.Modules.SkeletonRenderSeparator gen_ret = Spine.Unity.Modules.SkeletonRenderSeparator.AddToSkeletonRenderer( _skeletonRenderer, _sortingLayerID, _extraPartsRenderers );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 2&& translator.Assignable<Spine.Unity.SkeletonRenderer>(L, 1)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)) 
                {
                    Spine.Unity.SkeletonRenderer _skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRenderer));
                    int _sortingLayerID = LuaAPI.xlua_tointeger(L, 2);
                    
                        Spine.Unity.Modules.SkeletonRenderSeparator gen_ret = Spine.Unity.Modules.SkeletonRenderSeparator.AddToSkeletonRenderer( _skeletonRenderer, _sortingLayerID );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 1&& translator.Assignable<Spine.Unity.SkeletonRenderer>(L, 1)) 
                {
                    Spine.Unity.SkeletonRenderer _skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRenderer));
                    
                        Spine.Unity.Modules.SkeletonRenderSeparator gen_ret = Spine.Unity.Modules.SkeletonRenderSeparator.AddToSkeletonRenderer( _skeletonRenderer );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Modules.SkeletonRenderSeparator.AddToSkeletonRenderer!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AddPartsRenderer(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonRenderSeparator gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRenderSeparator)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)) 
                {
                    int _sortingOrderIncrement = LuaAPI.xlua_tointeger(L, 2);
                    
                    gen_to_be_invoked.AddPartsRenderer( _sortingOrderIncrement );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 1) 
                {
                    
                    gen_to_be_invoked.AddPartsRenderer(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Modules.SkeletonRenderSeparator.AddPartsRenderer!");
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_SkeletonRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRenderSeparator gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRenderSeparator)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.SkeletonRenderer);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_copyPropertyBlock(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRenderSeparator gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRenderSeparator)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.copyPropertyBlock);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_copyMeshRendererFlags(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRenderSeparator gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRenderSeparator)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.copyMeshRendererFlags);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_partsRenderers(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRenderSeparator gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRenderSeparator)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.partsRenderers);
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
			
                Spine.Unity.Modules.SkeletonRenderSeparator gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRenderSeparator)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.SkeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRenderer));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_copyPropertyBlock(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRenderSeparator gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRenderSeparator)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.copyPropertyBlock = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_copyMeshRendererFlags(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRenderSeparator gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRenderSeparator)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.copyMeshRendererFlags = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_partsRenderers(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonRenderSeparator gen_to_be_invoked = (Spine.Unity.Modules.SkeletonRenderSeparator)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.partsRenderers = (System.Collections.Generic.List<Spine.Unity.Modules.SkeletonPartsRenderer>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Unity.Modules.SkeletonPartsRenderer>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
