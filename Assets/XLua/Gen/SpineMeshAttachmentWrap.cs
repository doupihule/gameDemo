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
    public class SpineMeshAttachmentWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.MeshAttachment);
			Utils.BeginObjectRegister(type, L, translator, 0, 9, 26, 26);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UpdateUVs", _m_UpdateUVs);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ApplyDeform", _m_ApplyDeform);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetColor", _m_GetColor);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetColor", _m_SetColor);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetRegion", _m_GetRegion);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetRegion", _m_SetRegion);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetLinkedClone", _m_GetLinkedClone);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetClone", _m_GetClone);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetLinkedMesh", _m_GetLinkedMesh);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "HullLength", _g_get_HullLength);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionUVs", _g_get_RegionUVs);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "UVs", _g_get_UVs);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Triangles", _g_get_Triangles);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "R", _g_get_R);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "G", _g_get_G);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "B", _g_get_B);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "A", _g_get_A);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Path", _g_get_Path);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RendererObject", _g_get_RendererObject);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionU", _g_get_RegionU);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionV", _g_get_RegionV);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionU2", _g_get_RegionU2);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionV2", _g_get_RegionV2);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionRotate", _g_get_RegionRotate);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionOffsetX", _g_get_RegionOffsetX);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionOffsetY", _g_get_RegionOffsetY);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionWidth", _g_get_RegionWidth);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionHeight", _g_get_RegionHeight);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionOriginalWidth", _g_get_RegionOriginalWidth);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RegionOriginalHeight", _g_get_RegionOriginalHeight);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "InheritDeform", _g_get_InheritDeform);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "ParentMesh", _g_get_ParentMesh);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Edges", _g_get_Edges);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Width", _g_get_Width);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Height", _g_get_Height);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "HullLength", _s_set_HullLength);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionUVs", _s_set_RegionUVs);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "UVs", _s_set_UVs);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Triangles", _s_set_Triangles);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "R", _s_set_R);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "G", _s_set_G);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "B", _s_set_B);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "A", _s_set_A);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Path", _s_set_Path);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RendererObject", _s_set_RendererObject);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionU", _s_set_RegionU);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionV", _s_set_RegionV);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionU2", _s_set_RegionU2);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionV2", _s_set_RegionV2);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionRotate", _s_set_RegionRotate);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionOffsetX", _s_set_RegionOffsetX);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionOffsetY", _s_set_RegionOffsetY);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionWidth", _s_set_RegionWidth);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionHeight", _s_set_RegionHeight);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionOriginalWidth", _s_set_RegionOriginalWidth);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "RegionOriginalHeight", _s_set_RegionOriginalHeight);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "InheritDeform", _s_set_InheritDeform);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "ParentMesh", _s_set_ParentMesh);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Edges", _s_set_Edges);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Width", _s_set_Width);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Height", _s_set_Height);
            
			
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
				if(LuaAPI.lua_gettop(L) == 2 && (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING))
				{
					string _name = LuaAPI.lua_tostring(L, 2);
					
					Spine.MeshAttachment gen_ret = new Spine.MeshAttachment(_name);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.MeshAttachment constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UpdateUVs(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.UpdateUVs(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ApplyDeform(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.VertexAttachment _sourceAttachment = (Spine.VertexAttachment)translator.GetObject(L, 2, typeof(Spine.VertexAttachment));
                    
                        bool gen_ret = gen_to_be_invoked.ApplyDeform( _sourceAttachment );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetColor(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
            
            
                
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
            
            
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
            
            
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
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.MeshAttachment.SetColor!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetRegion(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
            
            
                
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
            
            
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& translator.Assignable<Spine.AtlasRegion>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    Spine.AtlasRegion _region = (Spine.AtlasRegion)translator.GetObject(L, 2, typeof(Spine.AtlasRegion));
                    bool _updateUVs = LuaAPI.lua_toboolean(L, 3);
                    
                    gen_to_be_invoked.SetRegion( _region, _updateUVs );
                    
                    
                    
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
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.MeshAttachment.SetRegion!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetLinkedClone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2)) 
                {
                    bool _inheritDeform = LuaAPI.lua_toboolean(L, 2);
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedClone( _inheritDeform );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 1) 
                {
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedClone(  );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.MeshAttachment.GetLinkedClone!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetClone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetClone(  );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetLinkedMesh(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& translator.Assignable<UnityEngine.Sprite>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    UnityEngine.Sprite _sprite = (UnityEngine.Sprite)translator.GetObject(L, 2, typeof(UnityEngine.Sprite));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    bool _inheritDeform = LuaAPI.lua_toboolean(L, 4);
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedMesh( _sprite, _materialPropertySource, _inheritDeform );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<UnityEngine.Sprite>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)) 
                {
                    UnityEngine.Sprite _sprite = (UnityEngine.Sprite)translator.GetObject(L, 2, typeof(UnityEngine.Sprite));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedMesh( _sprite, _materialPropertySource );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 5&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.AtlasRegion>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)) 
                {
                    string _newLinkedMeshName = LuaAPI.lua_tostring(L, 2);
                    Spine.AtlasRegion _region = (Spine.AtlasRegion)translator.GetObject(L, 3, typeof(Spine.AtlasRegion));
                    bool _inheritDeform = LuaAPI.lua_toboolean(L, 4);
                    bool _copyOriginalProperties = LuaAPI.lua_toboolean(L, 5);
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedMesh( _newLinkedMeshName, _region, _inheritDeform, _copyOriginalProperties );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.AtlasRegion>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    string _newLinkedMeshName = LuaAPI.lua_tostring(L, 2);
                    Spine.AtlasRegion _region = (Spine.AtlasRegion)translator.GetObject(L, 3, typeof(Spine.AtlasRegion));
                    bool _inheritDeform = LuaAPI.lua_toboolean(L, 4);
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedMesh( _newLinkedMeshName, _region, _inheritDeform );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.AtlasRegion>(L, 3)) 
                {
                    string _newLinkedMeshName = LuaAPI.lua_tostring(L, 2);
                    Spine.AtlasRegion _region = (Spine.AtlasRegion)translator.GetObject(L, 3, typeof(Spine.AtlasRegion));
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedMesh( _newLinkedMeshName, _region );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 5&& translator.Assignable<UnityEngine.Sprite>(L, 2)&& translator.Assignable<UnityEngine.Shader>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& translator.Assignable<UnityEngine.Material>(L, 5)) 
                {
                    UnityEngine.Sprite _sprite = (UnityEngine.Sprite)translator.GetObject(L, 2, typeof(UnityEngine.Sprite));
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    bool _inheritDeform = LuaAPI.lua_toboolean(L, 4);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 5, typeof(UnityEngine.Material));
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedMesh( _sprite, _shader, _inheritDeform, _materialPropertySource );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& translator.Assignable<UnityEngine.Sprite>(L, 2)&& translator.Assignable<UnityEngine.Shader>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    UnityEngine.Sprite _sprite = (UnityEngine.Sprite)translator.GetObject(L, 2, typeof(UnityEngine.Sprite));
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    bool _inheritDeform = LuaAPI.lua_toboolean(L, 4);
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedMesh( _sprite, _shader, _inheritDeform );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<UnityEngine.Sprite>(L, 2)&& translator.Assignable<UnityEngine.Shader>(L, 3)) 
                {
                    UnityEngine.Sprite _sprite = (UnityEngine.Sprite)translator.GetObject(L, 2, typeof(UnityEngine.Sprite));
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    
                        Spine.MeshAttachment gen_ret = gen_to_be_invoked.GetLinkedMesh( _sprite, _shader );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.MeshAttachment.GetLinkedMesh!");
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_HullLength(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.HullLength);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionUVs(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.RegionUVs);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.UVs);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Triangles(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Triangles);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                translator.PushAny(L, gen_to_be_invoked.RendererObject);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionU(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionU);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionV(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionV);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionU2(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionU2);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionV2(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionV2);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RegionRotate(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.RegionRotate);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.RegionOriginalHeight);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_InheritDeform(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.InheritDeform);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_ParentMesh(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.ParentMesh);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Edges(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Edges);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Height);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_HullLength(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.HullLength = LuaAPI.xlua_tointeger(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionUVs(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionUVs = (float[])translator.GetObject(L, 2, typeof(float[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_UVs(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.UVs = (float[])translator.GetObject(L, 2, typeof(float[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Triangles(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Triangles = (int[])translator.GetObject(L, 2, typeof(int[]));
            
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RendererObject = translator.GetObject(L, 2, typeof(object));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionU(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionU = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionV(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionV = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionU2(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionU2 = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionV2(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionV2 = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_RegionRotate(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionRotate = LuaAPI.lua_toboolean(L, 2);
            
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.RegionOriginalHeight = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_InheritDeform(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.InheritDeform = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_ParentMesh(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.ParentMesh = (Spine.MeshAttachment)translator.GetObject(L, 2, typeof(Spine.MeshAttachment));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Edges(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Edges = (int[])translator.GetObject(L, 2, typeof(int[]));
            
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
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
			
                Spine.MeshAttachment gen_to_be_invoked = (Spine.MeshAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Height = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
