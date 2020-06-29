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
using Spine;using Spine.Unity;using Spine.Unity.Modules.AttachmentTools;

namespace XLua.CSObjectWrap
{
    using Utils = XLua.Utils;
    public class SpineAttachmentWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Attachment);
			Utils.BeginObjectRegister(type, L, translator, 0, 7, 1, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ToString", _m_ToString);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "IsRenderable", _m_IsRenderable);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetMaterial", _m_GetMaterial);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetRegion", _m_GetRegion);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetRegion", _m_SetRegion);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetClone", _m_GetClone);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetRemappedClone", _m_GetRemappedClone);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Name", _g_get_Name);
            
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 1, 0, 0);
			
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            return LuaAPI.luaL_error(L, "Spine.Attachment does not have a constructor!");
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ToString(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Attachment gen_to_be_invoked = (Spine.Attachment)translator.FastGetCSObj(L, 1);
            
            
                
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
        static int _m_IsRenderable(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Attachment gen_to_be_invoked = (Spine.Attachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        bool gen_ret = gen_to_be_invoked.IsRenderable(  );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetMaterial(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Attachment gen_to_be_invoked = (Spine.Attachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        UnityEngine.Material gen_ret = gen_to_be_invoked.GetMaterial(  );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetRegion(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Attachment gen_to_be_invoked = (Spine.Attachment)translator.FastGetCSObj(L, 1);
            
            
                
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
            
            
                Spine.Attachment gen_to_be_invoked = (Spine.Attachment)translator.FastGetCSObj(L, 1);
            
            
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
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Attachment.SetRegion!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetClone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Attachment gen_to_be_invoked = (Spine.Attachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    bool _cloneMeshesAsLinked = LuaAPI.lua_toboolean(L, 2);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetClone( _cloneMeshesAsLinked );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetRemappedClone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Attachment gen_to_be_invoked = (Spine.Attachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 5&& translator.Assignable<Spine.AtlasRegion>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)) 
                {
                    Spine.AtlasRegion _atlasRegion = (Spine.AtlasRegion)translator.GetObject(L, 2, typeof(Spine.AtlasRegion));
                    bool _cloneMeshAsLinked = LuaAPI.lua_toboolean(L, 3);
                    bool _useOriginalRegionSize = LuaAPI.lua_toboolean(L, 4);
                    float _scale = (float)LuaAPI.lua_tonumber(L, 5);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetRemappedClone( _atlasRegion, _cloneMeshAsLinked, _useOriginalRegionSize, _scale );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& translator.Assignable<Spine.AtlasRegion>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.AtlasRegion _atlasRegion = (Spine.AtlasRegion)translator.GetObject(L, 2, typeof(Spine.AtlasRegion));
                    bool _cloneMeshAsLinked = LuaAPI.lua_toboolean(L, 3);
                    bool _useOriginalRegionSize = LuaAPI.lua_toboolean(L, 4);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetRemappedClone( _atlasRegion, _cloneMeshAsLinked, _useOriginalRegionSize );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<Spine.AtlasRegion>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    Spine.AtlasRegion _atlasRegion = (Spine.AtlasRegion)translator.GetObject(L, 2, typeof(Spine.AtlasRegion));
                    bool _cloneMeshAsLinked = LuaAPI.lua_toboolean(L, 3);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetRemappedClone( _atlasRegion, _cloneMeshAsLinked );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 2&& translator.Assignable<Spine.AtlasRegion>(L, 2)) 
                {
                    Spine.AtlasRegion _atlasRegion = (Spine.AtlasRegion)translator.GetObject(L, 2, typeof(Spine.AtlasRegion));
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetRemappedClone( _atlasRegion );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 6&& translator.Assignable<UnityEngine.Sprite>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 6)) 
                {
                    UnityEngine.Sprite _sprite = (UnityEngine.Sprite)translator.GetObject(L, 2, typeof(UnityEngine.Sprite));
                    UnityEngine.Material _sourceMaterial = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    bool _premultiplyAlpha = LuaAPI.lua_toboolean(L, 4);
                    bool _cloneMeshAsLinked = LuaAPI.lua_toboolean(L, 5);
                    bool _useOriginalRegionSize = LuaAPI.lua_toboolean(L, 6);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetRemappedClone( _sprite, _sourceMaterial, _premultiplyAlpha, _cloneMeshAsLinked, _useOriginalRegionSize );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 5&& translator.Assignable<UnityEngine.Sprite>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)) 
                {
                    UnityEngine.Sprite _sprite = (UnityEngine.Sprite)translator.GetObject(L, 2, typeof(UnityEngine.Sprite));
                    UnityEngine.Material _sourceMaterial = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    bool _premultiplyAlpha = LuaAPI.lua_toboolean(L, 4);
                    bool _cloneMeshAsLinked = LuaAPI.lua_toboolean(L, 5);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetRemappedClone( _sprite, _sourceMaterial, _premultiplyAlpha, _cloneMeshAsLinked );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& translator.Assignable<UnityEngine.Sprite>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    UnityEngine.Sprite _sprite = (UnityEngine.Sprite)translator.GetObject(L, 2, typeof(UnityEngine.Sprite));
                    UnityEngine.Material _sourceMaterial = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    bool _premultiplyAlpha = LuaAPI.lua_toboolean(L, 4);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetRemappedClone( _sprite, _sourceMaterial, _premultiplyAlpha );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<UnityEngine.Sprite>(L, 2)&& translator.Assignable<UnityEngine.Material>(L, 3)) 
                {
                    UnityEngine.Sprite _sprite = (UnityEngine.Sprite)translator.GetObject(L, 2, typeof(UnityEngine.Sprite));
                    UnityEngine.Material _sourceMaterial = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetRemappedClone( _sprite, _sourceMaterial );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Attachment.GetRemappedClone!");
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Name(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Attachment gen_to_be_invoked = (Spine.Attachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.Name);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
		
		
		
		
    }
}
