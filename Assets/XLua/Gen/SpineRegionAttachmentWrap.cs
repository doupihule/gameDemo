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
using Spine.Unity;using Spine.Unity.Modules.AttachmentTools;

namespace XLua.CSObjectWrap
{
    using Utils = XLua.Utils;
    public class SpineRegionAttachmentWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.RegionAttachment);
			Utils.BeginObjectRegister(type, L, translator, 0, 11, 21, 19);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UpdateOffset", _m_UpdateOffset);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetUVs", _m_SetUVs);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ComputeWorldVertices", _m_ComputeWorldVertices);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetColor", _m_GetColor);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetColor", _m_SetColor);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetRegion", _m_GetRegion);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetRegion", _m_SetRegion);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetScale", _m_SetScale);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetPositionOffset", _m_SetPositionOffset);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetRotation", _m_SetRotation);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetClone", _m_GetClone);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "X", _g_get_X);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Y", _g_get_Y);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Rotation", _g_get_Rotation);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "ScaleX", _g_get_ScaleX);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "ScaleY", _g_get_ScaleY);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Width", _g_get_Width);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Height", _g_get_Height);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "R", _g_get_R);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "G", _g_get_G);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "B", _g_get_B);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "A", _g_get_A);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Path", _g_get_Path);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RendererObject", _g_get_RendererObject);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionOffsetX", _g_get_RegionOffsetX);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionOffsetY", _g_get_RegionOffsetY);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionWidth", _g_get_RegionWidth);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionHeight", _g_get_RegionHeight);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionOriginalWidth", _g_get_RegionOriginalWidth);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionOriginalHeight", _g_get_RegionOriginalHeight);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Offset", _g_get_Offset);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "UVs", _g_get_UVs);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "X", _s_set_X);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Y", _s_set_Y);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Rotation", _s_set_Rotation);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "ScaleX", _s_set_ScaleX);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "ScaleY", _s_set_ScaleY);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Width", _s_set_Width);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Height", _s_set_Height);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "R", _s_set_R);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "G", _s_set_G);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "B", _s_set_B);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "A", _s_set_A);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Path", _s_set_Path);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RendererObject", _s_set_RendererObject);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionOffsetX", _s_set_RegionOffsetX);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionOffsetY", _s_set_RegionOffsetY);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionWidth", _s_set_RegionWidth);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionHeight", _s_set_RegionHeight);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionOriginalWidth", _s_set_RegionOriginalWidth);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionOriginalHeight", _s_set_RegionOriginalHeight);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 9, 0, 0);
			
			
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BLX", Spine.RegionAttachment.BLX);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BLY", Spine.RegionAttachment.BLY);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "ULX", Spine.RegionAttachment.ULX);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "ULY", Spine.RegionAttachment.ULY);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "URX", Spine.RegionAttachment.URX);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "URY", Spine.RegionAttachment.URY);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BRX", Spine.RegionAttachment.BRX);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BRY", Spine.RegionAttachment.BRY);
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 2 && (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING))
				{
					string _name = LuaAPI.lua_tostring(L, 2);
					
					Spine.RegionAttachment gen_ret = new Spine.RegionAttachment(_name);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.RegionAttachment constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UpdateOffset(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.UpdateOffset(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetUVs(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float _u = (float)LuaAPI.lua_tonumber(L, 2);
                    float _v = (float)LuaAPI.lua_tonumber(L, 3);
                    float _u2 = (float)LuaAPI.lua_tonumber(L, 4);
                    float _v2 = (float)LuaAPI.lua_tonumber(L, 5);
                    bool _rotate = LuaAPI.lua_toboolean(L, 6);
                    
                    gen_to_be_invoked.SetUVs( _u, _v, _u2, _v2, _rotate );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ComputeWorldVertices(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 5&& translator.Assignable<Spine.Bone>(L, 2)&& translator.Assignable<float[]>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)) 
                {
                    Spine.Bone _bone = (Spine.Bone)translator.GetObject(L, 2, typeof(Spine.Bone));
                    float[] _worldVertices = (float[])translator.GetObject(L, 3, typeof(float[]));
                    int _offset = LuaAPI.xlua_tointeger(L, 4);
                    int _stride = LuaAPI.xlua_tointeger(L, 5);
                    
                    gen_to_be_invoked.ComputeWorldVertices( _bone, _worldVertices, _offset, _stride );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 4&& translator.Assignable<Spine.Bone>(L, 2)&& translator.Assignable<float[]>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.Bone _bone = (Spine.Bone)translator.GetObject(L, 2, typeof(Spine.Bone));
                    float[] _worldVertices = (float[])translator.GetObject(L, 3, typeof(float[]));
                    int _offset = LuaAPI.xlua_tointeger(L, 4);
                    
                    gen_to_be_invoked.ComputeWorldVertices( _bone, _worldVertices, _offset );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.RegionAttachment.ComputeWorldVertices!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetColor(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        UnityEngine.Color gen_ret = gen_to_be_invoked.GetColor(  );
                        translator.PushUnityEngineColor(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetColor(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.Color>(L, 2)) 
                {
                    UnityEngine.Color _color;translator.Get(L, 2, out _color);
                    
                    gen_to_be_invoked.SetColor( _color );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.Color32>(L, 2)) 
                {
                    UnityEngine.Color32 _color;translator.Get(L, 2, out _color);
                    
                    gen_to_be_invoked.SetColor( _color );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.RegionAttachment.SetColor!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetRegion(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        Spine.AtlasRegion gen_ret = gen_to_be_invoked.GetRegion(  );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetRegion(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& translator.Assignable<Spine.AtlasRegion>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    Spine.AtlasRegion _region = (Spine.AtlasRegion)translator.GetObject(L, 2, typeof(Spine.AtlasRegion));
                    bool _updateOffset = LuaAPI.lua_toboolean(L, 3);
                    
                    gen_to_be_invoked.SetRegion( _region, _updateOffset );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& translator.Assignable<Spine.AtlasRegion>(L, 2)) 
                {
                    Spine.AtlasRegion _region = (Spine.AtlasRegion)translator.GetObject(L, 2, typeof(Spine.AtlasRegion));
                    
                    gen_to_be_invoked.SetRegion( _region );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.RegionAttachment.SetRegion!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetScale(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)) 
                {
                    float _x = (float)LuaAPI.lua_tonumber(L, 2);
                    float _y = (float)LuaAPI.lua_tonumber(L, 3);
                    
                    gen_to_be_invoked.SetScale( _x, _y );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.Vector2>(L, 2)) 
                {
                    UnityEngine.Vector2 _scale;translator.Get(L, 2, out _scale);
                    
                    gen_to_be_invoked.SetScale( _scale );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.RegionAttachment.SetScale!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetPositionOffset(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)) 
                {
                    float _x = (float)LuaAPI.lua_tonumber(L, 2);
                    float _y = (float)LuaAPI.lua_tonumber(L, 3);
                    
                    gen_to_be_invoked.SetPositionOffset( _x, _y );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.Vector2>(L, 2)) 
                {
                    UnityEngine.Vector2 _offset;translator.Get(L, 2, out _offset);
                    
                    gen_to_be_invoked.SetPositionOffset( _offset );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.RegionAttachment.SetPositionOffset!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetRotation(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float _rotation = (float)LuaAPI.lua_tonumber(L, 2);
                    
                    gen_to_be_invoked.SetRotation( _rotation );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetClone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        Spine.RegionAttachment gen_ret = gen_to_be_invoked.GetClone(  );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_X(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.X);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Y(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Y);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Rotation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Rotation);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_ScaleX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.ScaleX);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_ScaleY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.ScaleY);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Width(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Width);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Height(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Height);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_R(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.R);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_G(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.G);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_B(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.B);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_A(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.A);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Path(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.Path);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RendererObject(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                translator.PushAny(L, gen_to_be_invoked.RendererObject);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionOffsetX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionOffsetX);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionOffsetY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionOffsetY);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionWidth(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionWidth);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionHeight(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionHeight);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionOriginalWidth(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionOriginalWidth);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionOriginalHeight(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionOriginalHeight);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Offset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Offset);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_UVs(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.UVs);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_X(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.X = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Y(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Y = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Rotation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Rotation = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_ScaleX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.ScaleX = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_ScaleY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.ScaleY = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Width(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Width = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Height(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Height = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_R(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.R = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_G(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.G = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_B(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.B = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_A(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.A = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Path(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Path = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RendererObject(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RendererObject = translator.GetObject(L, 2, typeof(object));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionOffsetX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionOffsetX = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionOffsetY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionOffsetY = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionWidth(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionWidth = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionHeight(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionHeight = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionOriginalWidth(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionOriginalWidth = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionOriginalHeight(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.RegionAttachment gen_to_be_invoked = (Spine.RegionAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionOriginalHeight = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
