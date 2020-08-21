using System;
using System.IO;
using System.Collections.Generic;

using UnityEngine;
using UnityEngine.SceneManagement;

using Constants;
using UObject = UnityEngine.Object;
using GameUtils;
using XLua;

namespace Resource
{
    [LuaCallCSharp]
    public class ResourceManager
    {
        private static ResourceManager instance;
        public static ResourceManager Instance { get { if( instance == null ) { instance = new ResourceManager(); } return instance; } }
        private ResourceManager() { }

        public const string BUNDLE_PATH = "AssetsBoundles/";
        public const string BYTES_PATH = "bytes/";
        public const string TEMP_PATH = "temp/";

        public static string assetPath;
        public static string bytesLuaTxtPath;

        public string currentSceneName = "Boot";
        public static string gameVersion;
        public static int bytesVersion;
        public static int bundleVersion;

        private GameObject goBoot;
        private LoadAssetBundle bundleManager;
        private LoadResources loadResources;

        private GameObject goDonwloadManager;
        private DownloadResource downloadResource;
        private UncompressFile uncompressFile;
        //private List<string> cacheBundleNameList;
        public Dictionary<string, Material> spriteRendererMaterialDic;
        private Shader customspriteRendererShader;

        public LuaTable luaLoadResource { set; private get; }
        public LuaTable multiLanguageHelper { set; private get; }

        public void Init( GameObject go )
        {
#if UNITY_EDITOR
            assetPath = "Assets";
            //如果是 pc 平台  那么自动索引到工程路径
#elif UNITY_STANDALONE
            assetPath =  Application.dataPath +"/../../Assets/";
#else
            DebugUtils.Log(DebugUtils.Type.Data, "path:Application.persistentDataPath " + Application.persistentDataPath+ ",Application.dataPath:" + Application.dataPath);
            assetPath = Application.streamingAssetsPath +"/Assets/";
            //assetPath = string.Concat( Application.persistentDataPath, "/", GameConstants.SERVER_URL_BRANCH, "/GameResources/" );
#endif
            bytesLuaTxtPath = string.Concat( assetPath, BYTES_PATH, "{0}.byte" );
            DebugUtils.Log(DebugUtils.Type.Data, "path:Application.persistentDataPath " + Application.persistentDataPath + ",Application.dataPath:" + Application.dataPath + ",assetPath:"+ assetPath);
            //SetVersionNumber ();
           

            //if( !Directory.Exists( assetPath + BUNDLE_PATH ) )
            //{
            //    Directory.CreateDirectory( assetPath + BUNDLE_PATH );
            //}

            //if( !Directory.Exists( assetPath + BYTES_PATH ) )
            //{
            //    Directory.CreateDirectory( assetPath + BYTES_PATH );
            //}

            //if( !Directory.Exists( assetPath + TEMP_PATH ) )
            //{
            //    Directory.CreateDirectory( assetPath + TEMP_PATH );
            //}

            goBoot = go;
            bundleManager = goBoot.AddComponent<LoadAssetBundle>();
            bundleManager.Init();
            loadResources = goBoot.AddComponent<LoadResources>();

            TextAsset configTxt = Resources.Load<TextAsset>( "gameConfig" );
 
            //goDonwloadManager = new GameObject( "donwloadManager" );
            //downloadResource = goDonwloadManager.AddComponent<DownloadResource>();
            //downloadResource.Init( configTxt != null ? configTxt.text : null );
            //uncompressFile = goDonwloadManager.AddComponent<UncompressFile>();

            //cacheBundleNameList = new List<string>();

            SceneManager.sceneLoaded += OnSceneLoadComplete;
        }

        public void Dispose()
        {
            instance = null;

            if( goDonwloadManager != null )
            {
                GameObject.Destroy( goDonwloadManager );
                goDonwloadManager = null;
            }

            //if( cacheBundleNameList != null )
            //{
            //    cacheBundleNameList.Clear();
            //    cacheBundleNameList = null;
            //}

            SceneManager.sceneLoaded -= OnSceneLoadComplete;
        }

        private void SetVersionNumber()
        {
			gameVersion = Application.version;
			DebugUtils.Log( DebugUtils.Type.Resource, "Current game version is " + gameVersion );

            string versionPath = assetPath + GameConstants.VERSION_FILE_NAME;
            string[] strArr = null;
            FileInfo versionFileInfo = new FileInfo( versionPath );
            if( versionFileInfo.Exists )
            {
                string versionStr = File.ReadAllText( versionPath ).Trim();
                DebugUtils.Log( DebugUtils.Type.Resource, "Get local version number = " + versionStr );
                if( !string.IsNullOrEmpty( versionStr ) )
                {
                    strArr = versionStr.Split( '.' );
                }
            }
            else
            {
                DebugUtils.Log( DebugUtils.Type.Resource, "The current version number file does not exist to set the default version number as 0.0 " );
                strArr = new string[] { "0", "0", "0", "0" };
     
                if ( !versionFileInfo.Directory.Exists )
                {
                    versionFileInfo.Directory.Create();
                }
                using( FileStream fs = versionFileInfo.Create() )
                {
                    fs.Close();
                }
            }

            if( strArr[0] == "0" )
            {
                string[] versionArr = gameVersion.Split( '.' );
                if( versionArr.Length > 2 )
                {
                    strArr[0] = versionArr[versionArr.Length - 2];
                 
                }
                else
                {
                    DebugUtils.Log( DebugUtils.Type.Resource, "Version number length incorrect! length:" + versionArr.Length );
                }
            }
            bytesVersion = int.Parse( strArr[0] );

            if( strArr[1] == "0" )
            {
                string[] versionArr = gameVersion.Split( '.' );
                if( versionArr.Length > 1 )
                {
                    strArr[1] = versionArr[versionArr.Length - 1];
                }
                else
                {
                    DebugUtils.Log( DebugUtils.Type.Resource, "Version number length err! length:" + versionArr.Length );
                }
            }
            bundleVersion = int.Parse( strArr[1] );

            string getVersionNumber = string.Join( ".", strArr );
            File.WriteAllText( versionPath, getVersionNumber );

            DebugUtils.Log( DebugUtils.Type.Resource, "Current version is " + getVersionNumber );
        }

        #region Hot update resources 

        public void CheckReourceUpdate( Action<float, float> checkCallback, Action<string> versionCallback )
        {
            downloadResource.CheckUpdate( checkCallback, versionCallback );
        }

        public void DownloadResources( Action<long, long, long> updateCallback )
        {
            downloadResource.DownloadResources( updateCallback );
        }

        public void DownloadDispose()
        {
            downloadResource.Dispose();
        }

        public void UncompressResources( Action<int, int> uncompressCallback )
        {
            uncompressFile.Uncompress( uncompressCallback );
        }

        public void RemoveDonwloadObject()
        {
            if( goDonwloadManager != null )
            {
                GameObject.Destroy( goDonwloadManager );
                goDonwloadManager = null;
                downloadResource = null;
                uncompressFile = null;
            }

            Resources.UnloadUnusedAssets();
            GC.Collect();
        }

        #endregion

        #region Load asset API

        public void InitLoadManager()
        {
            if( bundleManager != null )
            {
                bundleManager.Init();
            }
            if( loadResources != null )
            {
                loadResources.Init();
            }

        }

        public GameObject luaLoadAsset(string assetName, string path = null, string bundleName = null)
        {
            return LoadAsset<GameObject>(assetName, path, bundleName);
        }
        public Sprite luaLoadSpriteAsset(string assetName, string path = null, string bundleName = null)
        {
            return LoadAsset<Sprite>(assetName, path, bundleName);
        }

        public T LoadAsset<T>( string assetName, string path = null, string bundleName = null ) where T : UObject
        {
            if( string.IsNullOrEmpty( bundleName ) )
            {
                return loadResources.Load<T>( assetName );
            }
            else
            {
#if UNITY_EDITOR
                if (GameConstants.LoadAssetByEditor)
                {
                    return UnityEditor.AssetDatabase.LoadAssetAtPath<T>(path);
                }
#endif
                //SetCacheBundleName( bundleName );
                return bundleManager.GetAsset<T>( assetName, bundleName );
            }
        }

        public void LoadAssetAsync<T>( string assetName, string path, string bundleName, Action<T> callback ) where T : UObject
        {
            if( string.IsNullOrEmpty( bundleName ) )
            {
                loadResources.LoadAsync<T>( assetName, callback );
            }
            else
            {
#if UNITY_EDITOR
                if( GameConstants.LoadAssetByEditor )
                {
                    T t = UnityEditor.AssetDatabase.LoadAssetAtPath<T>( path );
                    if( callback != null )
                    {
                        DebugUtils.Assert( t != null, string.Format( "Async load resource failed!, assetName = {0}, path = {1}, bundleName = {2}", assetName, path, bundleName ) );
                        callback.Invoke( t );
                    }
                }
                else
#endif
                {
                    bundleManager.GetAssetAsync( assetName, bundleName,
                                    delegate ( UObject obj )
                                    {
                                        //SetCacheBundleName( bundleName );
                                        if( callback != null )
                                        {
                                            try
                                            {
                                                callback( ( T )obj );
                                            }
                                            catch (System.Exception ex)
                                            {
                                                DebugUtils.LogError( DebugUtils.Type.AssetBundle,  " err msg : " + ex.Message + " assetName : " + assetName );
                                            }
                                          
                                        }
                                    } );
                }
            }
        }

        public Shader FindInBundle( string shaderName, string bundleName = null )
        {
            Shader shader = null;
#if UNITY_EDITOR
            if( CommonUtil.LoadAssetsWay )
            {
                shader = Shader.Find( shaderName );
            }
            else
#endif
            {
                if( string.IsNullOrEmpty( bundleName ) )
                {
                    string[] infos = GetBundleInfo( shaderName );
                    shaderName = infos[0];
                    bundleName = infos[1];
                }
                shader = bundleManager.GetAsset<Shader>( shaderName, bundleName );
            }

            if( shader == null )
            {
                DebugUtils.LogError( DebugUtils.Type.Resource, "Not found the shader, name is " + shaderName );
            }
#if !UNITY_EDITOR
            if( !shader.isSupported )
            {
                DebugUtils.LogError( DebugUtils.Type.Resource, "The platform does not support this shader, name is " + shaderName );
            } 
#else
            shader = Shader.Find( shader.name );
#endif
            return shader;
        }

        //private void SetCacheBundleName( string bundleName )
        //{
        //    if( !cacheBundleNameList.Contains( bundleName ) )
        //    {
        //        cacheBundleNameList.Add( bundleName );
        //    }
        //}

        public Material GetCustomSpriteRendererMaterial( Texture2D alphaTexture2d )
        {
            DebugUtils.Assert( alphaTexture2d != null, " Get custom sprite renderer material, the alphaTexture2d can not be null " );

            if( customspriteRendererShader == null )
            {
                customspriteRendererShader = ResourceManager.Instance.FindInBundle( "Inu/Sprites/Default" );
            }

            if( spriteRendererMaterialDic == null )
            {
                spriteRendererMaterialDic = new Dictionary<string, Material>();
            }

            Material mat = null;
            spriteRendererMaterialDic.TryGetValue( alphaTexture2d.name, out mat );

            if( mat == null )
            {
                mat = new Material( customspriteRendererShader );
                spriteRendererMaterialDic[alphaTexture2d.name] = mat;
            }
            mat.SetTexture( "_AlphaTex", alphaTexture2d );

            return mat;
        }

#endregion

#region Release asset API

        public void ReleaseAsset( string bundleName, string assetName )
        {
            bundleManager.ReleaseAsset( bundleName, assetName );
        }

        public void UnloadBundleByName( string bundleName, bool unloadAllLoadedObjects = true )
        {
            //if( cacheBundleNameList.Contains( bundleName ) )
            //{
            //    cacheBundleNameList.Remove( bundleName );
            //}
            UnloadBundle( bundleName, unloadAllLoadedObjects );
        }

        private void UnloadBundle( string bundleName, bool unloadAllLoadedObjects )
        {
#if UNITY_EDITOR
            if( GameConstants.LoadAssetByEditor ) return;
#endif
            if( string.IsNullOrEmpty( bundleName ) ) return;

            bundleManager.UnloadBundle( bundleName, unloadAllLoadedObjects );
        }

#endregion

#region Get table data

        /// <summary>
        /// Get bundle table info
        /// return array:
        /// index 0 is Path
        /// index 1 is Bundle
        /// </summary>
        /// <param name="name"> asset name </param>
        /// <returns></returns>
        public string[] GetBundleInfo( string name )
        {
            Func<string, string> getBundleNameByName = luaLoadResource.Get<Func<string, string>>( "SharpGetBundleInfo" );
            string bundleInfo = getBundleNameByName( name );
            string[] infos = bundleInfo.Split( '#' );
            return infos;
        }
        public string GetString( string id )
        {
            if( multiLanguageHelper == null )
            {
                return "";
            }
            else
            {
                if ( string.IsNullOrEmpty( id ) )
                    return "";
                if ( id == "-1" )
                    return "";
                Func<string, string> getString = multiLanguageHelper.Get<Func<string, string>>( "GetString" );
                return getString( id );
            }
        }

#endregion

        private void OnSceneLoadComplete( Scene scene, LoadSceneMode mode )
        {
            DebugUtils.Log( DebugUtils.Type.Resource, "Switch scene complete! Current scene name is " + scene.name );
            if( currentSceneName != scene.name )
            {
                //ClearCacheBundle();
                currentSceneName = scene.name;
            }
        }

        //private void ClearCacheBundle()
        //{
        //    for( int i = 0; i < cacheBundleNameList.Count; i++ )
        //    {
        //        UnloadBundle( cacheBundleNameList[i], true );
        //    }
        //    cacheBundleNameList.Clear();
        //}

    }
}