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
    public class SpineSkeletonBinaryWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.SkeletonBinary);
			Utils.BeginObjectRegister(type, L, translator, 0, 1, 1, 1);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ReadSkeletonData", _m_ReadSkeletonData);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Scale", _g_get_Scale);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "Scale", _s_set_Scale);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 16, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "GetVersionString", _m_GetVersionString_xlua_st_);
            
			
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BONE_ROTATE", Spine.SkeletonBinary.BONE_ROTATE);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BONE_TRANSLATE", Spine.SkeletonBinary.BONE_TRANSLATE);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BONE_SCALE", Spine.SkeletonBinary.BONE_SCALE);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BONE_SHEAR", Spine.SkeletonBinary.BONE_SHEAR);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "SLOT_ATTACHMENT", Spine.SkeletonBinary.SLOT_ATTACHMENT);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "SLOT_COLOR", Spine.SkeletonBinary.SLOT_COLOR);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "SLOT_TWO_COLOR", Spine.SkeletonBinary.SLOT_TWO_COLOR);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "PATH_POSITION", Spine.SkeletonBinary.PATH_POSITION);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "PATH_SPACING", Spine.SkeletonBinary.PATH_SPACING);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "PATH_MIX", Spine.SkeletonBinary.PATH_MIX);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "CURVE_LINEAR", Spine.SkeletonBinary.CURVE_LINEAR);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "CURVE_STEPPED", Spine.SkeletonBinary.CURVE_STEPPED);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "CURVE_BEZIER", Spine.SkeletonBinary.CURVE_BEZIER);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "TransformModeValues", Spine.SkeletonBinary.TransformModeValues);
            
			
			
			
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
					
					Spine.SkeletonBinary gen_ret = new Spine.SkeletonBinary(_atlasArray);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 2 && translator.Assignable<Spine.AttachmentLoader>(L, 2))
				{
					Spine.AttachmentLoader _attachmentLoader = (Spine.AttachmentLoader)translator.GetObject(L, 2, typeof(Spine.AttachmentLoader));
					
					Spine.SkeletonBinary gen_ret = new Spine.SkeletonBinary(_attachmentLoader);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.SkeletonBinary constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ReadSkeletonData(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonBinary gen_to_be_invoked = (Spine.SkeletonBinary)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    string _path = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.SkeletonData gen_ret = gen_to_be_invoked.ReadSkeletonData( _path );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 2&& translator.Assignable<System.IO.Stream>(L, 2)) 
                {
                    System.IO.Stream _input = (System.IO.Stream)translator.GetObject(L, 2, typeof(System.IO.Stream));
                    
                        Spine.SkeletonData gen_ret = gen_to_be_invoked.ReadSkeletonData( _input );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.SkeletonBinary.ReadSkeletonData!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetVersionString_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    System.IO.Stream _input = (System.IO.Stream)translator.GetObject(L, 1, typeof(System.IO.Stream));
                    
                        string gen_ret = Spine.SkeletonBinary.GetVersionString( _input );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Scale(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBinary gen_to_be_invoked = (Spine.SkeletonBinary)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Scale);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Scale(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBinary gen_to_be_invoked = (Spine.SkeletonBinary)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Scale = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
