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
    public class SpineUnitySpineSlotWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.SpineSlot);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 1, 1);
			
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "containsBoundingBoxes", _g_get_containsBoundingBoxes);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "containsBoundingBoxes", _s_set_containsBoundingBoxes);
            
			
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
				if(LuaAPI.lua_gettop(L) == 6 && (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 6))
				{
					string _startsWith = LuaAPI.lua_tostring(L, 2);
					string _dataField = LuaAPI.lua_tostring(L, 3);
					bool _containsBoundingBoxes = LuaAPI.lua_toboolean(L, 4);
					bool _includeNone = LuaAPI.lua_toboolean(L, 5);
					bool _fallbackToTextField = LuaAPI.lua_toboolean(L, 6);
					
					Spine.Unity.SpineSlot gen_ret = new Spine.Unity.SpineSlot(_startsWith, _dataField, _containsBoundingBoxes, _includeNone, _fallbackToTextField);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 5 && (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5))
				{
					string _startsWith = LuaAPI.lua_tostring(L, 2);
					string _dataField = LuaAPI.lua_tostring(L, 3);
					bool _containsBoundingBoxes = LuaAPI.lua_toboolean(L, 4);
					bool _includeNone = LuaAPI.lua_toboolean(L, 5);
					
					Spine.Unity.SpineSlot gen_ret = new Spine.Unity.SpineSlot(_startsWith, _dataField, _containsBoundingBoxes, _includeNone);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 4 && (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4))
				{
					string _startsWith = LuaAPI.lua_tostring(L, 2);
					string _dataField = LuaAPI.lua_tostring(L, 3);
					bool _containsBoundingBoxes = LuaAPI.lua_toboolean(L, 4);
					
					Spine.Unity.SpineSlot gen_ret = new Spine.Unity.SpineSlot(_startsWith, _dataField, _containsBoundingBoxes);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 3 && (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING))
				{
					string _startsWith = LuaAPI.lua_tostring(L, 2);
					string _dataField = LuaAPI.lua_tostring(L, 3);
					
					Spine.Unity.SpineSlot gen_ret = new Spine.Unity.SpineSlot(_startsWith, _dataField);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 2 && (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING))
				{
					string _startsWith = LuaAPI.lua_tostring(L, 2);
					
					Spine.Unity.SpineSlot gen_ret = new Spine.Unity.SpineSlot(_startsWith);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Spine.Unity.SpineSlot gen_ret = new Spine.Unity.SpineSlot();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SpineSlot constructor!");
            
        }
        
		
        
		
        
        
        
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_containsBoundingBoxes(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineSlot gen_to_be_invoked = (Spine.Unity.SpineSlot)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.containsBoundingBoxes);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_containsBoundingBoxes(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineSlot gen_to_be_invoked = (Spine.Unity.SpineSlot)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.containsBoundingBoxes = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
