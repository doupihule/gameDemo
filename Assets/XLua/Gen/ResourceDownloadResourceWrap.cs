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
    public class ResourceDownloadResourceWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Resource.DownloadResource);
			Utils.BeginObjectRegister(type, L, translator, 0, 5, 0, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Init", _m_Init);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "CheckUpdate", _m_CheckUpdate);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "DownloadResources", _m_DownloadResources);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "OnRemoteCertificateValidationCallback", _m_OnRemoteCertificateValidationCallback);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Dispose", _m_Dispose);
			
			
			
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 1, 1, 1);
			
			
            
			Utils.RegisterFunc(L, Utils.CLS_GETTER_IDX, "FILE_SERVER_URL", _g_get_FILE_SERVER_URL);
            
			Utils.RegisterFunc(L, Utils.CLS_SETTER_IDX, "FILE_SERVER_URL", _s_set_FILE_SERVER_URL);
            
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Resource.DownloadResource gen_ret = new Resource.DownloadResource();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Resource.DownloadResource constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Init(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.DownloadResource gen_to_be_invoked = (Resource.DownloadResource)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _fileServerIp = LuaAPI.lua_tostring(L, 2);
                    
                    gen_to_be_invoked.Init( _fileServerIp );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CheckUpdate(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.DownloadResource gen_to_be_invoked = (Resource.DownloadResource)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    System.Action<float, float> _checkCallback = translator.GetDelegate<System.Action<float, float>>(L, 2);
                    System.Action<string> _versionCallback = translator.GetDelegate<System.Action<string>>(L, 3);
                    
                    gen_to_be_invoked.CheckUpdate( _checkCallback, _versionCallback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DownloadResources(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.DownloadResource gen_to_be_invoked = (Resource.DownloadResource)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    System.Action<long, long, long> _downloadCallback = translator.GetDelegate<System.Action<long, long, long>>(L, 2);
                    
                    gen_to_be_invoked.DownloadResources( _downloadCallback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_OnRemoteCertificateValidationCallback(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.DownloadResource gen_to_be_invoked = (Resource.DownloadResource)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    object _sender = translator.GetObject(L, 2, typeof(object));
                    System.Security.Cryptography.X509Certificates.X509Certificate _certificate = (System.Security.Cryptography.X509Certificates.X509Certificate)translator.GetObject(L, 3, typeof(System.Security.Cryptography.X509Certificates.X509Certificate));
                    System.Security.Cryptography.X509Certificates.X509Chain _chain = (System.Security.Cryptography.X509Certificates.X509Chain)translator.GetObject(L, 4, typeof(System.Security.Cryptography.X509Certificates.X509Chain));
                    System.Net.Security.SslPolicyErrors _sslPolicyErrors;translator.Get(L, 5, out _sslPolicyErrors);
                    
                        bool gen_ret = gen_to_be_invoked.OnRemoteCertificateValidationCallback( _sender, _certificate, _chain, _sslPolicyErrors );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Dispose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.DownloadResource gen_to_be_invoked = (Resource.DownloadResource)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Dispose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_FILE_SERVER_URL(RealStatePtr L)
        {
		    try {
            
			    LuaAPI.lua_pushstring(L, Resource.DownloadResource.FILE_SERVER_URL);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_FILE_SERVER_URL(RealStatePtr L)
        {
		    try {
                
			    Resource.DownloadResource.FILE_SERVER_URL = LuaAPI.lua_tostring(L, 1);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
