using System;
using System.Text;
using UnityEngine;
using Puerts;
using Resource;
namespace GameUtils
{
    public class JSEnvExpand
    {
        public static JsEnv globalEnv;
        public static void InitEnv(string debugRoot)
        {
            globalEnv = new JsEnv(new JsAssetsLoader(debugRoot));
        }
    }

    public class JsAssetsLoader : ILoader
    {
        private string root = "";

        public JsAssetsLoader()
        {
        }

        public JsAssetsLoader(string root)
        {
            this.root = root;
        }

        public bool FileExists(string filepath)
        {
            return UnityEngine.Resources.Load(filepath) != null;
        }

        public string ReadFile(string filepath, out string debugpath)
        {

            string datas = null;
            filepath = filepath.Replace(".", "/");
            debugpath = System.IO.Path.Combine(root, filepath);
#if UNITY_EDITOR_WIN || UNITY_STANDALONE_WIN
            debugpath = debugpath.Replace("/", "\\");
#endif
            
            string luaPath = string.Concat("Assets/Scripts/jssrc/", filepath, ".lua.txt");
#if UNITY_EDITOR
            if (Constants.GameConstants.LoadAssetByEditor)
            {
                TextAsset ta = UnityEditor.AssetDatabase.LoadAssetAtPath<TextAsset>(luaPath);
                DebugUtils.Assert(ta != null, "The lua file cannot be found! path is " + luaPath);
                datas = ta.text;
            }
            else
#endif
            {
                TextAsset luaAsset = ResourceManager.Instance.LoadAsset<TextAsset>(luaPath, luaPath, "scriptab");
                if (luaPath.Contains("Main"))
                {
                    DebugUtils.Log(DebugUtils.Type.Lua, "myLuaLoader" + luaAsset.bytes.ToString());
                }
                datas = luaAsset.text;
                //string decryptStr = File.ReadAllText( string.Format( ResourceManager.bytesLuaTxtPath, path ), System.Text.Encoding.UTF8 );
                //string byteStr = AESUtil.AESDecrypt( decryptStr ); //解密
                //datas = System.Text.Encoding.UTF8.GetBytes( byteStr );
            }
            DebugUtils.Assert(datas != null, "The js file cannot be found! path is " + filepath);

            return datas;

            //return file == null ? null : file.text;
        }
    }
}