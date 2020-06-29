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
    public class SpineAtlasAttachmentLoaderWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.AtlasAttachmentLoader);
			Utils.BeginObjectRegister(type, L, translator, 0, 7, 0, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "NewRegionAttachment", _m_NewRegionAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "NewMeshAttachment", _m_NewMeshAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "NewBoundingBoxAttachment", _m_NewBoundingBoxAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "NewPathAttachment", _m_NewPathAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "NewPointAttachment", _m_NewPointAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "NewClippingAttachment", _m_NewClippingAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindRegion", _m_FindRegion);
			
			
			
			
			
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
				if(LuaAPI.lua_gettop(L) >= 1 && (LuaTypes.LUA_TNONE == LuaAPI.lua_type(L, 2) || translator.Assignable<Spine.Atlas>(L, 2)))
				{
					Spine.Atlas[] _atlasArray = translator.GetParams<Spine.Atlas>(L, 2);
					
					Spine.AtlasAttachmentLoader gen_ret = new Spine.AtlasAttachmentLoader(_atlasArray);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.AtlasAttachmentLoader constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_NewRegionAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.AtlasAttachmentLoader gen_to_be_invoked = (Spine.AtlasAttachmentLoader)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skin _skin = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    string _name = LuaAPI.lua_tostring(L, 3);
                    string _path = LuaAPI.lua_tostring(L, 4);
                    
                        Spine.RegionAttachment gen_ret = gen_to_be_invoked.NewRegionAttachment( _skin, _name, _path );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_NewMeshAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.AtlasAttachmentLoader gen_to_be_invoked = (Spine.AtlasAttachmentLoader)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skin _skin = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    string _name = LuaAPI.lua_tostring(L, 3);
                    string _path = LuaAPI.lua_tostring(L, 4);
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.NewMeshAttachment( _skin, _name, _path );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_NewBoundingBoxAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.AtlasAttachmentLoader gen_to_be_invoked = (Spine.AtlasAttachmentLoader)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skin _skin = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    string _name = LuaAPI.lua_tostring(L, 3);
                    
                        Spine.BoundingBoxAttachment gen_ret = gen_to_be_invoked.NewBoundingBoxAttachment( _skin, _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_NewPathAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.AtlasAttachmentLoader gen_to_be_invoked = (Spine.AtlasAttachmentLoader)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skin _skin = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    string _name = LuaAPI.lua_tostring(L, 3);
                    
                        Spine.PathAttachment gen_ret = gen_to_be_invoked.NewPathAttachment( _skin, _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_NewPointAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.AtlasAttachmentLoader gen_to_be_invoked = (Spine.AtlasAttachmentLoader)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skin _skin = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    string _name = LuaAPI.lua_tostring(L, 3);
                    
                        Spine.PointAttachment gen_ret = gen_to_be_invoked.NewPointAttachment( _skin, _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_NewClippingAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.AtlasAttachmentLoader gen_to_be_invoked = (Spine.AtlasAttachmentLoader)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skin _skin = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    string _name = LuaAPI.lua_tostring(L, 3);
                    
                        Spine.ClippingAttachment gen_ret = gen_to_be_invoked.NewClippingAttachment( _skin, _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindRegion(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.AtlasAttachmentLoader gen_to_be_invoked = (Spine.AtlasAttachmentLoader)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _name = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.AtlasRegion gen_ret = gen_to_be_invoked.FindRegion( _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        
        
		
		
		
		
    }
}
