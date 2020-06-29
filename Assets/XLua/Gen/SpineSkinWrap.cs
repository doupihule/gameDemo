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
using Spine;using Spine.Unity.Modules.AttachmentTools;

namespace XLua.CSObjectWrap
{
    using Utils = XLua.Utils;
    public class SpineSkinWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Skin);
			Utils.BeginObjectRegister(type, L, translator, 0, 12, 2, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "AddAttachment", _m_AddAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetAttachment", _m_GetAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindNamesForSlot", _m_FindNamesForSlot);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindAttachmentsForSlot", _m_FindAttachmentsForSlot);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ToString", _m_ToString);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetRepackedSkin", _m_GetRepackedSkin);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetClone", _m_GetClone);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetAttachment", _m_SetAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "RemoveAttachment", _m_RemoveAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Clear", _m_Clear);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Append", _m_Append);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "CopyTo", _m_CopyTo);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Name", _g_get_Name);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Attachments", _g_get_Attachments);
            
			
			
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
					
					Spine.Skin gen_ret = new Spine.Skin(_name);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skin constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AddAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    int _slotIndex = LuaAPI.xlua_tointeger(L, 2);
                    string _name = LuaAPI.lua_tostring(L, 3);
                    Spine.Attachment _attachment = (Spine.Attachment)translator.GetObject(L, 4, typeof(Spine.Attachment));
                    
                    gen_to_be_invoked.AddAttachment( _slotIndex, _name, _attachment );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    int _slotIndex = LuaAPI.xlua_tointeger(L, 2);
                    string _name = LuaAPI.lua_tostring(L, 3);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetAttachment( _slotIndex, _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.Skeleton>(L, 4)) 
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    string _keyName = LuaAPI.lua_tostring(L, 3);
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 4, typeof(Spine.Skeleton));
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetAttachment( _slotName, _keyName, _skeleton );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skin.GetAttachment!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindNamesForSlot(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& translator.Assignable<System.Collections.Generic.List<string>>(L, 3)) 
                {
                    int _slotIndex = LuaAPI.xlua_tointeger(L, 2);
                    System.Collections.Generic.List<string> _names = (System.Collections.Generic.List<string>)translator.GetObject(L, 3, typeof(System.Collections.Generic.List<string>));
                    
                    gen_to_be_invoked.FindNamesForSlot( _slotIndex, _names );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.SkeletonData>(L, 3)&& translator.Assignable<System.Collections.Generic.List<string>>(L, 4)) 
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    Spine.SkeletonData _skeletonData = (Spine.SkeletonData)translator.GetObject(L, 3, typeof(Spine.SkeletonData));
                    System.Collections.Generic.List<string> _results = (System.Collections.Generic.List<string>)translator.GetObject(L, 4, typeof(System.Collections.Generic.List<string>));
                    
                    gen_to_be_invoked.FindNamesForSlot( _slotName, _skeletonData, _results );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skin.FindNamesForSlot!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindAttachmentsForSlot(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 3)) 
                {
                    int _slotIndex = LuaAPI.xlua_tointeger(L, 2);
                    System.Collections.Generic.List<Spine.Attachment> _attachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 3, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    
                    gen_to_be_invoked.FindAttachmentsForSlot( _slotIndex, _attachments );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.SkeletonData>(L, 3)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 4)) 
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    Spine.SkeletonData _skeletonData = (Spine.SkeletonData)translator.GetObject(L, 3, typeof(Spine.SkeletonData));
                    System.Collections.Generic.List<Spine.Attachment> _results = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 4, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    
                    gen_to_be_invoked.FindAttachmentsForSlot( _slotName, _skeletonData, _results );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skin.FindAttachmentsForSlot!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ToString(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        string gen_ret = gen_to_be_invoked.ToString(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetRepackedSkin(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 8&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 8)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    bool _useOriginalNonrenderables = LuaAPI.lua_toboolean(L, 8);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps, _useOriginalNonrenderables );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 7&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 6&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 5&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Material>(L, 3)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _materialPropertySource, out _outputMaterial, out _outputTexture );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 10&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Shader>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)&& translator.Assignable<UnityEngine.Material>(L, 8)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 9)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 10)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 8, typeof(UnityEngine.Material));
                    bool _clearCache = LuaAPI.lua_toboolean(L, 9);
                    bool _useOriginalNonrenderables = LuaAPI.lua_toboolean(L, 10);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _shader, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps, _materialPropertySource, _clearCache, _useOriginalNonrenderables );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 9&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Shader>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)&& translator.Assignable<UnityEngine.Material>(L, 8)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 9)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 8, typeof(UnityEngine.Material));
                    bool _clearCache = LuaAPI.lua_toboolean(L, 9);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _shader, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps, _materialPropertySource, _clearCache );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 8&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Shader>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)&& translator.Assignable<UnityEngine.Material>(L, 8)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 8, typeof(UnityEngine.Material));
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _shader, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps, _materialPropertySource );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 7&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Shader>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _shader, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 6&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Shader>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _shader, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 5&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Shader>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _shader, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Shader>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _shader, out _outputMaterial, out _outputTexture, _maxAtlasSize );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Shader>(L, 3)) 
                {
                    string _newName = LuaAPI.lua_tostring(L, 2);
                    UnityEngine.Shader _shader = (UnityEngine.Shader)translator.GetObject(L, 3, typeof(UnityEngine.Shader));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetRepackedSkin( _newName, _shader, out _outputMaterial, out _outputTexture );
                        translator.Push(L, gen_ret);
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 3;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skin.GetRepackedSkin!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetClone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetClone(  );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.Attachment>(L, 4)) 
                {
                    int _slotIndex = LuaAPI.xlua_tointeger(L, 2);
                    string _keyName = LuaAPI.lua_tostring(L, 3);
                    Spine.Attachment _attachment = (Spine.Attachment)translator.GetObject(L, 4, typeof(Spine.Attachment));
                    
                    gen_to_be_invoked.SetAttachment( _slotIndex, _keyName, _attachment );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 5&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.Attachment>(L, 4)&& translator.Assignable<Spine.Skeleton>(L, 5)) 
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    string _keyName = LuaAPI.lua_tostring(L, 3);
                    Spine.Attachment _attachment = (Spine.Attachment)translator.GetObject(L, 4, typeof(Spine.Attachment));
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 5, typeof(Spine.Skeleton));
                    
                    gen_to_be_invoked.SetAttachment( _slotName, _keyName, _attachment, _skeleton );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skin.SetAttachment!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_RemoveAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    int _slotIndex = LuaAPI.xlua_tointeger(L, 2);
                    string _keyName = LuaAPI.lua_tostring(L, 3);
                    
                        bool gen_ret = gen_to_be_invoked.RemoveAttachment( _slotIndex, _keyName );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.Skeleton>(L, 4)) 
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    string _keyName = LuaAPI.lua_tostring(L, 3);
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 4, typeof(Spine.Skeleton));
                    
                        bool gen_ret = gen_to_be_invoked.RemoveAttachment( _slotName, _keyName, _skeleton );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skin.RemoveAttachment!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Clear(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Clear(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Append(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skin _source = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    
                    gen_to_be_invoked.Append( _source );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CopyTo(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 5&& translator.Assignable<Spine.Skin>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)) 
                {
                    Spine.Skin _destination = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    bool _overwrite = LuaAPI.lua_toboolean(L, 3);
                    bool _cloneAttachments = LuaAPI.lua_toboolean(L, 4);
                    bool _cloneMeshesAsLinked = LuaAPI.lua_toboolean(L, 5);
                    
                    gen_to_be_invoked.CopyTo( _destination, _overwrite, _cloneAttachments, _cloneMeshesAsLinked );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 4&& translator.Assignable<Spine.Skin>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.Skin _destination = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    bool _overwrite = LuaAPI.lua_toboolean(L, 3);
                    bool _cloneAttachments = LuaAPI.lua_toboolean(L, 4);
                    
                    gen_to_be_invoked.CopyTo( _destination, _overwrite, _cloneAttachments );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skin.CopyTo!");
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Name(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.Name);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Attachments(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skin gen_to_be_invoked = (Spine.Skin)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Attachments);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
		
		
		
		
    }
}
