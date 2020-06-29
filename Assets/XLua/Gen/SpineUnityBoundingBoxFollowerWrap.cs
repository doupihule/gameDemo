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
    public class SpineUnityBoundingBoxFollowerWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.BoundingBoxFollower);
			Utils.BeginObjectRegister(type, L, translator, 0, 2, 11, 4);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Initialize", _m_Initialize);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ClearState", _m_ClearState);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Slot", _g_get_Slot);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "CurrentAttachment", _g_get_CurrentAttachment);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "CurrentAttachmentName", _g_get_CurrentAttachmentName);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "CurrentCollider", _g_get_CurrentCollider);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "IsTrigger", _g_get_IsTrigger);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "skeletonRenderer", _g_get_skeletonRenderer);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "slotName", _g_get_slotName);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "isTrigger", _g_get_isTrigger);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "clearStateOnDisable", _g_get_clearStateOnDisable);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "colliderTable", _g_get_colliderTable);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "nameTable", _g_get_nameTable);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "skeletonRenderer", _s_set_skeletonRenderer);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "slotName", _s_set_slotName);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "isTrigger", _s_set_isTrigger);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "clearStateOnDisable", _s_set_clearStateOnDisable);
            
			
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
					
					Spine.Unity.BoundingBoxFollower gen_ret = new Spine.Unity.BoundingBoxFollower();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.BoundingBoxFollower constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Initialize(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2)) 
                {
                    bool _overwrite = LuaAPI.lua_toboolean(L, 2);
                    
                    gen_to_be_invoked.Initialize( _overwrite );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 1) 
                {
                    
                    gen_to_be_invoked.Initialize(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.BoundingBoxFollower.Initialize!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ClearState(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.ClearState(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Slot(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Slot);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_CurrentAttachment(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.CurrentAttachment);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_CurrentAttachmentName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.CurrentAttachmentName);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_CurrentCollider(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.CurrentCollider);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_IsTrigger(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.IsTrigger);
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
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.skeletonRenderer);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_slotName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.slotName);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_isTrigger(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.isTrigger);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_clearStateOnDisable(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.clearStateOnDisable);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_colliderTable(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.colliderTable);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_nameTable(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.nameTable);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_skeletonRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRenderer));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_slotName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.slotName = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_isTrigger(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.isTrigger = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_clearStateOnDisable(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.BoundingBoxFollower gen_to_be_invoked = (Spine.Unity.BoundingBoxFollower)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.clearStateOnDisable = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
