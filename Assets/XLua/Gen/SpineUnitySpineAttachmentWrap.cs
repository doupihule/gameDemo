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
    public class SpineUnitySpineAttachmentWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.SpineAttachment);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 5, 5);
			
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "returnAttachmentPath", _g_get_returnAttachmentPath);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "currentSkinOnly", _g_get_currentSkinOnly);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "placeholdersOnly", _g_get_placeholdersOnly);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "skinField", _g_get_skinField);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "slotField", _g_get_slotField);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "returnAttachmentPath", _s_set_returnAttachmentPath);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "currentSkinOnly", _s_set_currentSkinOnly);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "placeholdersOnly", _s_set_placeholdersOnly);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "skinField", _s_set_skinField);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "slotField", _s_set_slotField);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 3, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "GetHierarchy", _m_GetHierarchy_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetAttachment", _m_GetAttachment_xlua_st_);
            
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 9 && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4) && (LuaAPI.lua_isnil(L, 5) || LuaAPI.lua_type(L, 5) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 6) || LuaAPI.lua_type(L, 6) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 7) || LuaAPI.lua_type(L, 7) == LuaTypes.LUA_TSTRING) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 8) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 9))
				{
					bool _currentSkinOnly = LuaAPI.lua_toboolean(L, 2);
					bool _returnAttachmentPath = LuaAPI.lua_toboolean(L, 3);
					bool _placeholdersOnly = LuaAPI.lua_toboolean(L, 4);
					string _slotField = LuaAPI.lua_tostring(L, 5);
					string _dataField = LuaAPI.lua_tostring(L, 6);
					string _skinField = LuaAPI.lua_tostring(L, 7);
					bool _includeNone = LuaAPI.lua_toboolean(L, 8);
					bool _fallbackToTextField = LuaAPI.lua_toboolean(L, 9);
					
					Spine.Unity.SpineAttachment gen_ret = new Spine.Unity.SpineAttachment(_currentSkinOnly, _returnAttachmentPath, _placeholdersOnly, _slotField, _dataField, _skinField, _includeNone, _fallbackToTextField);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 8 && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4) && (LuaAPI.lua_isnil(L, 5) || LuaAPI.lua_type(L, 5) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 6) || LuaAPI.lua_type(L, 6) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 7) || LuaAPI.lua_type(L, 7) == LuaTypes.LUA_TSTRING) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 8))
				{
					bool _currentSkinOnly = LuaAPI.lua_toboolean(L, 2);
					bool _returnAttachmentPath = LuaAPI.lua_toboolean(L, 3);
					bool _placeholdersOnly = LuaAPI.lua_toboolean(L, 4);
					string _slotField = LuaAPI.lua_tostring(L, 5);
					string _dataField = LuaAPI.lua_tostring(L, 6);
					string _skinField = LuaAPI.lua_tostring(L, 7);
					bool _includeNone = LuaAPI.lua_toboolean(L, 8);
					
					Spine.Unity.SpineAttachment gen_ret = new Spine.Unity.SpineAttachment(_currentSkinOnly, _returnAttachmentPath, _placeholdersOnly, _slotField, _dataField, _skinField, _includeNone);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 7 && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4) && (LuaAPI.lua_isnil(L, 5) || LuaAPI.lua_type(L, 5) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 6) || LuaAPI.lua_type(L, 6) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 7) || LuaAPI.lua_type(L, 7) == LuaTypes.LUA_TSTRING))
				{
					bool _currentSkinOnly = LuaAPI.lua_toboolean(L, 2);
					bool _returnAttachmentPath = LuaAPI.lua_toboolean(L, 3);
					bool _placeholdersOnly = LuaAPI.lua_toboolean(L, 4);
					string _slotField = LuaAPI.lua_tostring(L, 5);
					string _dataField = LuaAPI.lua_tostring(L, 6);
					string _skinField = LuaAPI.lua_tostring(L, 7);
					
					Spine.Unity.SpineAttachment gen_ret = new Spine.Unity.SpineAttachment(_currentSkinOnly, _returnAttachmentPath, _placeholdersOnly, _slotField, _dataField, _skinField);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 6 && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4) && (LuaAPI.lua_isnil(L, 5) || LuaAPI.lua_type(L, 5) == LuaTypes.LUA_TSTRING) && (LuaAPI.lua_isnil(L, 6) || LuaAPI.lua_type(L, 6) == LuaTypes.LUA_TSTRING))
				{
					bool _currentSkinOnly = LuaAPI.lua_toboolean(L, 2);
					bool _returnAttachmentPath = LuaAPI.lua_toboolean(L, 3);
					bool _placeholdersOnly = LuaAPI.lua_toboolean(L, 4);
					string _slotField = LuaAPI.lua_tostring(L, 5);
					string _dataField = LuaAPI.lua_tostring(L, 6);
					
					Spine.Unity.SpineAttachment gen_ret = new Spine.Unity.SpineAttachment(_currentSkinOnly, _returnAttachmentPath, _placeholdersOnly, _slotField, _dataField);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 5 && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4) && (LuaAPI.lua_isnil(L, 5) || LuaAPI.lua_type(L, 5) == LuaTypes.LUA_TSTRING))
				{
					bool _currentSkinOnly = LuaAPI.lua_toboolean(L, 2);
					bool _returnAttachmentPath = LuaAPI.lua_toboolean(L, 3);
					bool _placeholdersOnly = LuaAPI.lua_toboolean(L, 4);
					string _slotField = LuaAPI.lua_tostring(L, 5);
					
					Spine.Unity.SpineAttachment gen_ret = new Spine.Unity.SpineAttachment(_currentSkinOnly, _returnAttachmentPath, _placeholdersOnly, _slotField);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 4 && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4))
				{
					bool _currentSkinOnly = LuaAPI.lua_toboolean(L, 2);
					bool _returnAttachmentPath = LuaAPI.lua_toboolean(L, 3);
					bool _placeholdersOnly = LuaAPI.lua_toboolean(L, 4);
					
					Spine.Unity.SpineAttachment gen_ret = new Spine.Unity.SpineAttachment(_currentSkinOnly, _returnAttachmentPath, _placeholdersOnly);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 3 && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3))
				{
					bool _currentSkinOnly = LuaAPI.lua_toboolean(L, 2);
					bool _returnAttachmentPath = LuaAPI.lua_toboolean(L, 3);
					
					Spine.Unity.SpineAttachment gen_ret = new Spine.Unity.SpineAttachment(_currentSkinOnly, _returnAttachmentPath);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 2 && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2))
				{
					bool _currentSkinOnly = LuaAPI.lua_toboolean(L, 2);
					
					Spine.Unity.SpineAttachment gen_ret = new Spine.Unity.SpineAttachment(_currentSkinOnly);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Spine.Unity.SpineAttachment gen_ret = new Spine.Unity.SpineAttachment();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SpineAttachment constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetHierarchy_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    string _fullPath = LuaAPI.lua_tostring(L, 1);
                    
                        Spine.Unity.SpineAttachment.Hierarchy gen_ret = Spine.Unity.SpineAttachment.GetHierarchy( _fullPath );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetAttachment_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.SkeletonData>(L, 2)) 
                {
                    string _attachmentPath = LuaAPI.lua_tostring(L, 1);
                    Spine.SkeletonData _skeletonData = (Spine.SkeletonData)translator.GetObject(L, 2, typeof(Spine.SkeletonData));
                    
                        Spine.Attachment gen_ret = Spine.Unity.SpineAttachment.GetAttachment( _attachmentPath, _skeletonData );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.Unity.SkeletonDataAsset>(L, 2)) 
                {
                    string _attachmentPath = LuaAPI.lua_tostring(L, 1);
                    Spine.Unity.SkeletonDataAsset _skeletonDataAsset = (Spine.Unity.SkeletonDataAsset)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonDataAsset));
                    
                        Spine.Attachment gen_ret = Spine.Unity.SpineAttachment.GetAttachment( _attachmentPath, _skeletonDataAsset );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SpineAttachment.GetAttachment!");
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_returnAttachmentPath(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.returnAttachmentPath);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_currentSkinOnly(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.currentSkinOnly);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_placeholdersOnly(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.placeholdersOnly);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_skinField(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.skinField);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_slotField(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.slotField);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_returnAttachmentPath(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.returnAttachmentPath = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_currentSkinOnly(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.currentSkinOnly = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_placeholdersOnly(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.placeholdersOnly = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_skinField(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.skinField = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_slotField(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SpineAttachment gen_to_be_invoked = (Spine.Unity.SpineAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.slotField = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
