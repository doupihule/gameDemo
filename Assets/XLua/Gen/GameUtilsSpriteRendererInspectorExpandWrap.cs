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
    public class GameUtilsSpriteRendererInspectorExpandWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(GameUtils.SpriteRendererInspectorExpand);
			Utils.BeginObjectRegister(type, L, translator, 0, 3, 2, 2);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "RestValue", _m_RestValue);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetAlphaTexture", _m_SetAlphaTexture);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "OnSnap", _m_OnSnap);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "spriteRenderer", _g_get_spriteRenderer);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "alphaTexture2d", _g_get_alphaTexture2d);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "spriteRenderer", _s_set_spriteRenderer);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "alphaTexture2d", _s_set_alphaTexture2d);
            
			
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
					
					GameUtils.SpriteRendererInspectorExpand gen_ret = new GameUtils.SpriteRendererInspectorExpand();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to GameUtils.SpriteRendererInspectorExpand constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_RestValue(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.SpriteRendererInspectorExpand gen_to_be_invoked = (GameUtils.SpriteRendererInspectorExpand)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.RestValue(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetAlphaTexture(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.SpriteRendererInspectorExpand gen_to_be_invoked = (GameUtils.SpriteRendererInspectorExpand)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.SetAlphaTexture(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_OnSnap(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.SpriteRendererInspectorExpand gen_to_be_invoked = (GameUtils.SpriteRendererInspectorExpand)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.OnSnap(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_spriteRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                GameUtils.SpriteRendererInspectorExpand gen_to_be_invoked = (GameUtils.SpriteRendererInspectorExpand)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.spriteRenderer);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_alphaTexture2d(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                GameUtils.SpriteRendererInspectorExpand gen_to_be_invoked = (GameUtils.SpriteRendererInspectorExpand)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.alphaTexture2d);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_spriteRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                GameUtils.SpriteRendererInspectorExpand gen_to_be_invoked = (GameUtils.SpriteRendererInspectorExpand)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.spriteRenderer = (UnityEngine.SpriteRenderer)translator.GetObject(L, 2, typeof(UnityEngine.SpriteRenderer));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_alphaTexture2d(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                GameUtils.SpriteRendererInspectorExpand gen_to_be_invoked = (GameUtils.SpriteRendererInspectorExpand)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.alphaTexture2d = (UnityEngine.Texture2D)translator.GetObject(L, 2, typeof(UnityEngine.Texture2D));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
