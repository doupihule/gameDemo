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
    public class SpineUnityModulesAttachmentToolsAtlasUtilitiesWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Modules.AttachmentTools.AtlasUtilities);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 0, 0);
			
			
			
			
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 3, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "GetRepackedAttachments", _m_GetRepackedAttachments_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "ClearCache", _m_ClearCache_xlua_st_);
            
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            return LuaAPI.luaL_error(L, "Spine.Unity.Modules.AttachmentTools.AtlasUtilities does not have a constructor!");
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetRepackedAttachments_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 10&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 1)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)&& (LuaAPI.lua_isnil(L, 8) || LuaAPI.lua_type(L, 8) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 9)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 10)) 
                {
                    System.Collections.Generic.List<Spine.Attachment> _sourceAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    System.Collections.Generic.List<Spine.Attachment> _outputAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    string _newAssetName = LuaAPI.lua_tostring(L, 8);
                    bool _clearCache = LuaAPI.lua_toboolean(L, 9);
                    bool _useOriginalNonrenderables = LuaAPI.lua_toboolean(L, 10);
                    
                    Spine.Unity.Modules.AttachmentTools.AtlasUtilities.GetRepackedAttachments( _sourceAttachments, _outputAttachments, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps, _newAssetName, _clearCache, _useOriginalNonrenderables );
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 2;
                }
                if(gen_param_count == 9&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 1)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)&& (LuaAPI.lua_isnil(L, 8) || LuaAPI.lua_type(L, 8) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 9)) 
                {
                    System.Collections.Generic.List<Spine.Attachment> _sourceAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    System.Collections.Generic.List<Spine.Attachment> _outputAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    string _newAssetName = LuaAPI.lua_tostring(L, 8);
                    bool _clearCache = LuaAPI.lua_toboolean(L, 9);
                    
                    Spine.Unity.Modules.AttachmentTools.AtlasUtilities.GetRepackedAttachments( _sourceAttachments, _outputAttachments, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps, _newAssetName, _clearCache );
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 2;
                }
                if(gen_param_count == 8&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 1)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)&& (LuaAPI.lua_isnil(L, 8) || LuaAPI.lua_type(L, 8) == LuaTypes.LUA_TSTRING)) 
                {
                    System.Collections.Generic.List<Spine.Attachment> _sourceAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    System.Collections.Generic.List<Spine.Attachment> _outputAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    string _newAssetName = LuaAPI.lua_tostring(L, 8);
                    
                    Spine.Unity.Modules.AttachmentTools.AtlasUtilities.GetRepackedAttachments( _sourceAttachments, _outputAttachments, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps, _newAssetName );
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 2;
                }
                if(gen_param_count == 7&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 1)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 7)) 
                {
                    System.Collections.Generic.List<Spine.Attachment> _sourceAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    System.Collections.Generic.List<Spine.Attachment> _outputAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    bool _mipmaps = LuaAPI.lua_toboolean(L, 7);
                    
                    Spine.Unity.Modules.AttachmentTools.AtlasUtilities.GetRepackedAttachments( _sourceAttachments, _outputAttachments, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat, _mipmaps );
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 2;
                }
                if(gen_param_count == 6&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 1)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& translator.Assignable<UnityEngine.TextureFormat>(L, 6)) 
                {
                    System.Collections.Generic.List<Spine.Attachment> _sourceAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    System.Collections.Generic.List<Spine.Attachment> _outputAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    UnityEngine.TextureFormat _textureFormat;translator.Get(L, 6, out _textureFormat);
                    
                    Spine.Unity.Modules.AttachmentTools.AtlasUtilities.GetRepackedAttachments( _sourceAttachments, _outputAttachments, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding, _textureFormat );
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 2;
                }
                if(gen_param_count == 5&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 1)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)) 
                {
                    System.Collections.Generic.List<Spine.Attachment> _sourceAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    System.Collections.Generic.List<Spine.Attachment> _outputAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    int _padding = LuaAPI.xlua_tointeger(L, 5);
                    
                    Spine.Unity.Modules.AttachmentTools.AtlasUtilities.GetRepackedAttachments( _sourceAttachments, _outputAttachments, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize, _padding );
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 2;
                }
                if(gen_param_count == 4&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 1)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    System.Collections.Generic.List<Spine.Attachment> _sourceAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    System.Collections.Generic.List<Spine.Attachment> _outputAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    int _maxAtlasSize = LuaAPI.xlua_tointeger(L, 4);
                    
                    Spine.Unity.Modules.AttachmentTools.AtlasUtilities.GetRepackedAttachments( _sourceAttachments, _outputAttachments, _materialPropertySource, out _outputMaterial, out _outputTexture, _maxAtlasSize );
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 2;
                }
                if(gen_param_count == 3&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 1)&& translator.Assignable<System.Collections.Generic.List<Spine.Attachment>>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)) 
                {
                    System.Collections.Generic.List<Spine.Attachment> _sourceAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    System.Collections.Generic.List<Spine.Attachment> _outputAttachments = (System.Collections.Generic.List<Spine.Attachment>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Attachment>));
                    UnityEngine.Material _materialPropertySource = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    UnityEngine.Material _outputMaterial;
                    UnityEngine.Texture2D _outputTexture;
                    
                    Spine.Unity.Modules.AttachmentTools.AtlasUtilities.GetRepackedAttachments( _sourceAttachments, _outputAttachments, _materialPropertySource, out _outputMaterial, out _outputTexture );
                    translator.Push(L, _outputMaterial);
                        
                    translator.Push(L, _outputTexture);
                        
                    
                    
                    
                    return 2;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Modules.AttachmentTools.AtlasUtilities.GetRepackedAttachments!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ClearCache_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                    Spine.Unity.Modules.AttachmentTools.AtlasUtilities.ClearCache(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        
        
		
		
		
		
    }
}
