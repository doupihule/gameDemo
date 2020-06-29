using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using UObject = UnityEngine.Object;
using GameUtils;
using Constants;

namespace Resource
{
    public class LoadAssetBundle : MonoBehaviour
    {
        private LoadAssetStep loadAssetBundleStep;
        private Dictionary<string, AssetBundleRef> bundlesDic;

        private LoadBundleVo curLoadData;
        private Queue<LoadBundleVo> loadingBundleQueue = new Queue<LoadBundleVo>();

        private string bundlePath;

        void Awake()
        {
            //DontDestroyOnLoad( this );
            bundlePath = ResourceManager.assetPath + ResourceManager.BUNDLE_PATH;
        }

        public void Init()
        {
            StopAllCoroutines();
            loadAssetBundleStep = LoadAssetStep.PreLoad;
            if( bundlesDic != null && bundlesDic.Count > 0 )
            {
                UnloadAllBundles();
                bundlesDic.Clear();
            }
            else
            {
                bundlesDic = new Dictionary<string, AssetBundleRef>();
            }
            loadingBundleQueue.Clear();
            curLoadData = null;
#if UNITY_EDITOR
            if( !GameConstants.LoadAssetByEditor )
#endif
            {
                SetManifestFile();
            }
        }

        private void SetManifestFile()
        {
            string fileName = CommonUtil.EncodingToMd5 ( GameConstants.BUNDLE_MANIFEST );
            string localPath = bundlePath + fileName;
            AssetBundle bundle = AssetBundle.LoadFromFile ( localPath );
            if ( bundle == null )
            {
                DebugUtils.LogError ( DebugUtils.Type.AssetBundle, "AssetBundleManifest is not found! path : " + localPath );
            }
            AssetBundleManifest assetBundleManifest = bundle.LoadAsset<AssetBundleManifest> ( "AssetBundleManifest" );

            string[] bundleNames = assetBundleManifest.GetAllAssetBundles ();
            for ( int i = 0; i < bundleNames.Length; i++ )
            {
                string bundleName = bundleNames[ i ];
                string[] dependencies = assetBundleManifest.GetAllDependencies( bundleName );

                if ( !bundlesDic.ContainsKey ( bundleName ) )
                {
                    bundlesDic[bundleName] = new AssetBundleRef( bundleName, dependencies, OnUnDependenciesBundle );
                }
            }

            bundle.Unload ( true );
            bundle = null;
        }

        public void ReleaseAsset( string bundleName, string assetName )
        {
            AssetBundleRef bundleRef;
            if ( bundlesDic.TryGetValue( bundleName, out bundleRef ) )
            {
                bundleRef.RemoveRef( assetName );
            }
        }

        public void UnloadBundle( string bundleName, bool unloadAllLoadedObjects )
        {
            AssetBundleRef abr;
            if ( bundlesDic.TryGetValue( bundleName, out abr ) )
            {
                abr.UnloadBundle( unloadAllLoadedObjects );
            }
        }

        public void UnloadAllBundles()
        {
            var item = bundlesDic.GetEnumerator();
            while ( item.MoveNext() )
            {
                try
                {
                    item.Current.Value.UnloadBundle( false );
                }
                catch ( Exception e )
                {
                    DebugUtils.LogError( DebugUtils.Type.AssetBundle, "Unload all bundle err, msg: " + e.Message );
                }
            }
        }

        public void PreloadBundle( string bundleName )
        {
            DebugUtils.Log( DebugUtils.Type.AssetBundle, "Preload bundle : " + bundleName );
            GetAssetAsync( bundleName, null, null );
        }

        public T GetAsset<T>( string assetName, string bundleName ) where T : UObject
        {
            AssetBundleRef assetBundleRef;
            if( !bundlesDic.TryGetValue( bundleName, out assetBundleRef ) )
            {
                DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "AssetBundle {0} for this platform not found", bundleName ) );
                return null;
            }

            // load depend bundles
            LoadBundleDepend( assetBundleRef );

            string bundlePath = this.bundlePath + CommonUtil.EncodingToMd5( bundleName );
            if ( assetBundleRef.assetBundle == null )
            {
                assetBundleRef.assetBundle = AssetBundle.LoadFromFile( bundlePath );
                DebugUtils.Log( DebugUtils.Type.AssetBundle, "Sync load bundle done, name：" + bundleName );
            }

            T asset = null;
            if ( assetBundleRef.assetBundle == null )
            {
                DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "AssetBundle \"{0}\" for this platform not found, path : {1}", bundleName, bundlePath ) );
            }
            else
            {
                try
                {
                    asset = assetBundleRef.assetBundle.LoadAsset<T>( assetName );
                }
                catch( Exception ex )
                {
                    DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "AssetBundle LoadAsset err, bundleName:{0}, assetName:{1}, type:{2} msg{3}", bundleName, assetName, typeof( T ), ex.Message ) );
                }

                if ( asset == null )
                {
                    DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "AssetBundle \"{0}\" don't contain \"{1}\" resources, type:{2}", bundleName, assetName, typeof( T ) ) );
                }
                else
                {
#if UNITY_EDITOR
                    RestAssetShader( new UObject[] { asset } );
                    UObject[] allObject = assetBundleRef.assetBundle.LoadAllAssets( typeof( Material ) );
                    RestAssetShader( allObject );
#endif
                    assetBundleRef.AddRef( assetName );
                }
            }        
                  
            return asset;
        }

        public void GetAssetAsync( string assetName, string bundleName, Action<UObject> callback )
        {
            if ( !bundlesDic.ContainsKey( bundleName ) )
            {
                DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "AssetBundle \"{0}\" for this platform not found", bundleName ) );
                if ( callback != null )
                {
                    callback( null );
                }
                return;
            }
            AssetBundleRef assetBundleRef = bundlesDic[bundleName];

            LoadBundleVo loadData = new LoadBundleVo();
            loadData.assetName = assetName;
            loadData.abRef = assetBundleRef;
            loadData.dependRefList = new List<AssetBundleRef>();
            CollectDepend( assetBundleRef, loadData.dependRefList );
            loadData.assetLoadCompleteCall = callback;
            loadingBundleQueue.Enqueue( loadData );

            DebugUtils.Log( DebugUtils.Type.AssetBundle, string.Format( "Prepare load bundle data \"{0}\" ,assetName is \"{1}\"", loadData.abRef.bundleName, loadData.assetName ) );
        }

        private void CollectDepend( AssetBundleRef abr, List<AssetBundleRef> abList )
        {
            if ( abr.dependencies == null || abr.dependencies.Length == 0 )
            {
                abList = null;
                return;
            }
            else if ( abList == null )
            {
                abList = new List<AssetBundleRef>();
            }
            
            for ( int i = 0; i < abr.dependencies.Length; i++ )
            {
                AssetBundleRef dependAB = bundlesDic[abr.dependencies[i]];
                if( dependAB.assetBundle == null && !abList.Contains( dependAB ) )
                {
                    abList.Add( dependAB );
                    CollectDepend( dependAB, abList );
                }
            }
        }

        private void LoadBundleDepend( AssetBundleRef abr )
        {
            if( abr.dependencies == null || abr.dependencies.Length == 0 )
            {
                return;
            }

            for( int i = 0; i < abr.dependencies.Length; i++ )
            {
                AssetBundleRef dependAB = bundlesDic[abr.dependencies[i]];
                dependAB.AddDependedBundle( abr.bundleName );
                if( dependAB.assetBundle == null )
                {
                    DebugUtils.Log( DebugUtils.Type.AssetBundle, string.Concat( "Start sync loading depend bundle, name : ", dependAB.bundleName, "  depended : ", abr.bundleName ) );
                    string dependBundlePath = this.bundlePath + CommonUtil.EncodingToMd5( dependAB.bundleName );
                    dependAB.assetBundle = AssetBundle.LoadFromFile( dependBundlePath );
                    if( dependAB.assetBundle == null )
                    {
                        DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "Depend AssetBundle \"{0}\" for this platform not found, path : {1}", dependAB.bundleName, dependBundlePath ) );
                    }
                    else
                    {
                        DebugUtils.Log( DebugUtils.Type.AssetBundle, string.Concat( "Sync load depend bundle done, name：" + dependAB.bundleName, " depended : ", abr.bundleName ) );
                    }
#if UNITY_EDITOR
                    RestAssetShader( dependAB.assetBundle.LoadAllAssets( typeof( Material ) ) );
#endif

                    // recursion load depend 
                    LoadBundleDepend( dependAB );
                }
            }
        }

        private IEnumerator LoadBundleAsync(string name, Action<AssetBundle,int> calback , int index = 0 )
        {
            string path = bundlePath + CommonUtil.EncodingToMd5( name );
            AssetBundleCreateRequest assetBundleRequest = AssetBundle.LoadFromFileAsync( path );
            yield return assetBundleRequest;
            if ( assetBundleRequest.assetBundle == null )
            {
                DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "AssetBundle \"{0}\" for this platform not found, path : {1}", name, path ) );
            }
            else
            {
                DebugUtils.Log( DebugUtils.Type.AssetBundle, "Async load bundle done, name is：" + name );
            }
           
            if ( calback != null )
            {
                calback( assetBundleRequest.assetBundle, index );
            }
        }

        private IEnumerator LoadAssetAsync( AssetBundle ab, string assetName, Action<UObject> calback )
        {
            AssetBundleRequest assetBundleRequest = ab.LoadAssetAsync( assetName );
            yield return assetBundleRequest;

            if ( assetBundleRequest != null && assetBundleRequest.asset == null )
            {
                DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "AssetBundle \"{0}\" don't contain \"{1}\" resources", ab.name, assetName ) );
            }
            else
            {
                DebugUtils.Log( DebugUtils.Type.AssetBundle, "Load asset done, name is : " + assetName );
            }

            if( calback != null )
            {
                calback( assetBundleRequest.asset );
            }
        }

        private IEnumerator LoadAllAssetAsync( AssetBundle ab, Action<UObject[], int> calback, int index )
        {
            AssetBundleRequest assetBundleRequest = ab.LoadAllAssetsAsync();
            yield return assetBundleRequest;

            if ( assetBundleRequest.allAssets == null )
            {
                DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "AssetBundle \"{0}\"load all resources err!", ab.name ) );
            }
            else
            {
                DebugUtils.Log( DebugUtils.Type.AssetBundle, "Load all assets done, bundle is :" + ab.name );
            }

            if ( calback != null )
            {
                calback( assetBundleRequest.allAssets, index );
            }
        }

        private void LoadAssetBundleHandler()
        {
            if( curLoadData == null ) return;

            switch( curLoadData.curState )
            {
                case LoadBundleVo.State.Prepare:
                {
                    DebugUtils.Log( DebugUtils.Type.AssetBundle, string.Format( "Prepare load bundle is \"{0}\" ,assetName is \"{1}\"", curLoadData.abRef.bundleName, curLoadData.assetName ) );
                    curLoadData.curState = LoadBundleVo.State.LoadDepend;
                    LoadAssetBundleHandler();
                    break;
                }
                case LoadBundleVo.State.LoadDepend:
                {
                    int length = curLoadData.dependRefList == null ? 0 : curLoadData.dependRefList.Count;

                    DebugUtils.Log( DebugUtils.Type.AssetBundle, "Prepare load depend bundles, number is : " + length );

                    if ( length == 0 )
                    {
                        curLoadData.curState = LoadBundleVo.State.LoadBundle;
                        LoadAssetBundleHandler();
                        break;
                    }

                    int count = 0;
                    for ( int i = 0; i < length; i++ )
                    {
                        curLoadData.dependRefList[i].AddDependedBundle( curLoadData.abRef.bundleName );

                        if ( curLoadData.dependRefList[i].assetBundle != null )
                        {
                            if ( ++count == length )
                            {
                                curLoadData.curState = LoadBundleVo.State.LoadBundle;
                                LoadAssetBundleHandler();
                            }
                            continue;
                        }

                        DebugUtils.Log( DebugUtils.Type.AssetBundle, "Start loading depend bundle : " + curLoadData.dependRefList[i].bundleName );
                        StartCoroutine( LoadBundleAsync( curLoadData.dependRefList[i].bundleName, delegate ( AssetBundle ab, int index )
                        {
                            curLoadData.dependRefList[index].assetBundle = ab;
#if UNITY_EDITOR
                            RestAssetShader( ab.LoadAllAssets( typeof( Material ) ) );
#endif
                            if ( ++count == length )
                            {
                                curLoadData.curState = LoadBundleVo.State.LoadBundle;
                                LoadAssetBundleHandler();
                            }
                        }, i ) );
                    }

                    break;
                }
                case LoadBundleVo.State.LoadBundle:
                {
                    DebugUtils.Log( DebugUtils.Type.AssetBundle, "Prepare load bundle : " + curLoadData.abRef.bundleName );

                    if ( curLoadData.abRef.assetBundle != null )
                    {
                        curLoadData.curState = LoadBundleVo.State.LoadAsset;
                        LoadAssetBundleHandler();
                        break;
                    }

                    StartCoroutine( LoadBundleAsync( curLoadData.abRef.bundleName, delegate ( AssetBundle ab, int index )
                    {
                        curLoadData.abRef.assetBundle = ab;
#if UNITY_EDITOR
                        RestAssetShader( ab.LoadAllAssets( typeof( Material ) ) );
#endif
                        curLoadData.curState = LoadBundleVo.State.LoadAsset;
                        LoadAssetBundleHandler();
                    } ) );
                    break;
                }
                case LoadBundleVo.State.LoadAsset:
                {
                    if( !string.IsNullOrEmpty( curLoadData.assetName ) )
                    {
                        StartCoroutine( LoadAssetAsync( curLoadData.abRef.assetBundle, curLoadData.assetName, delegate ( UObject obj )
                        {
                            curLoadData.abRef.AddRef( curLoadData.assetName );
                            if( curLoadData.assetLoadCompleteCall != null )
                            {
                                curLoadData.assetLoadCompleteCall( obj );
                            }
#if UNITY_EDITOR
                            RestAssetShader( new UObject[] { obj } );
#endif
                            curLoadData.curState = LoadBundleVo.State.Complete;
                            LoadAssetBundleHandler();
                        } ) );
                    }
                    break;
                }
                case LoadBundleVo.State.Complete:
                {
                    curLoadData.Dispose();
                    curLoadData = null;
                    loadAssetBundleStep = LoadAssetStep.PreLoad;
                    break;
                }
            }

        }

        void Update()
        {
            if ( loadingBundleQueue.Count > 0 )
            {
                if ( loadAssetBundleStep == LoadAssetStep.PreLoad )
                {
                    loadAssetBundleStep = LoadAssetStep.Loading;
                    curLoadData = loadingBundleQueue.Dequeue();
                    curLoadData.curState = LoadBundleVo.State.Prepare;
                }
            }
            
            if ( curLoadData != null && curLoadData.curState == LoadBundleVo.State.Prepare )
            {
                LoadAssetBundleHandler();
            }
        }

#if UNITY_EDITOR
        private void RestAssetShader( UObject[] assets )
        {
            foreach ( var u in assets )
            {
                GameObject go = u as GameObject;
                if ( go != null )
                {
                    Renderer[] rs = go.GetComponentsInChildren<Renderer>( true );
                    foreach ( Renderer r in rs )
                    {
                        RestMaterialShader( r.sharedMaterials );
                    }
                }

                Material mat = u as Material;

                if(mat != null)
                {
                    RestMaterialShader( new Material[] { mat } );
                }
            }
        }

        private void RestMaterialShader( Material[] mats )
        {
            foreach(var m in mats)
            {
                if( m == null )
                {
                    continue;
                }
                var shaderName = m.shader.name;
                Shader newShader = Shader.Find( shaderName );
                if ( newShader == null )
                {
                    DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "Not found shader name = {0}, in material = {1}", shaderName, m.name ) );
                    continue;
                }
                m.shader = newShader; 
            }
        }

        private void CheckShader( UObject[] assets )
        {
            if ( !DebugUtils.DebugMode ) return;

            foreach ( var u in assets )
            {
                CheckShader( u );
            }
        }

        private void CheckShader( UObject obj )
        {
            if ( !DebugUtils.DebugMode ) return;

            GameObject go = obj as GameObject;
            if ( go != null )
            {
                Renderer[] rs = go.GetComponentsInChildren<Renderer>( true );
                foreach ( Renderer r in rs )
                {
                    CheckShader( r.sharedMaterials, obj.name );
                }
            }

            AssetBundle ab = obj as AssetBundle;
            if ( ab != null )
            {
                CheckShader( ab.LoadAllAssets( typeof( Material ) ) );
            }

            Material mat = obj as Material;
            if ( mat != null )
            {
                CheckShader( mat, obj.name );
            }
        }

        private void CheckShader( Material[] mats, string name )
        {
            if ( !DebugUtils.DebugMode ) return;

            foreach ( var m in mats )
            {
                if ( m == null )
                {
                    continue;
                }

                CheckShader( m, name );
            }
        }

        private void CheckShader( Material m, string name )
        {
            if ( !m.shader.isSupported )
            {
                DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "The shader \"{0}\" is not supported on this platform! object name :{1} ", m.shader.name, name ) );
            }
        }

#endif

        private void OnUnDependenciesBundle( string[] abs, string name )
        {
            if ( abs == null ) return;

            for ( int i = 0; i < abs.Length; i++ )
            {
                AssetBundleRef dependbundle = bundlesDic[abs[i]];
                dependbundle.ReduceDependedCount( name );
            }
        }

        public void PrintBundles()
        {
            DebugUtils.Log( DebugUtils.Type.AssetBundle, "BundleCount: " + bundlesDic.Count );

            var item = bundlesDic.GetEnumerator();
            while ( item.MoveNext() )
            {
                DebugUtils.Log( DebugUtils.Type.AssetBundle, item.Current.Value.bundleName + " " + item.Current.Value.DependedCount() );
            }
        }

    }

    internal class AssetBundleRef
    {
        public string bundleName;
        public AssetBundle assetBundle { get; set; }
        public string[] dependencies;
        private Dictionary<string, int> objectRefDic = new Dictionary<string, int>();
        private Dictionary<string, int> dependedDic = new Dictionary<string, int>();
        private Action<string[], string> unDependenciesBundle;

        public AssetBundleRef( string bundleName, string[] dependencies, Action<string[], string> unDependenciesBundle )
        {
            this.bundleName = bundleName;
            this.dependencies = dependencies;
            this.unDependenciesBundle = unDependenciesBundle;
        }

        public int DependedCount()
        {
            return dependedDic.Count;
        }

        public void AddDependedBundle( string name )
        {
            if( dependedDic.ContainsKey( name ) )
            {
                dependedDic[name]++;
            }
            else
            {
                dependedDic[name] = 1;
            }
        }

        public void ReduceDependedCount( string name )
        {
            if( dependedDic.ContainsKey( name ) )
            {
                --dependedDic[name];
                DebugUtils.Log( DebugUtils.Type.AssetBundle, string.Format( "Reduce depended count, bundle = {0}, depended = {1}, number = {2}", bundleName, name, dependedDic[name] ) );
                if ( dependedDic[name] <= 0 )
                {
                    dependedDic.Remove( name );
                }
            }

            if( dependedDic.Count == 0 )
            {
                DebugUtils.Log( DebugUtils.Type.AssetBundle, string.Format( "Reduce depended complete, Unload the bundle, bundle = {0}, depended = {1}", bundleName, name ) );
                UnloadBundle();
            }
        }

        public void AddRef( string objName )
        {
            if( objectRefDic.ContainsKey( objName ) )
            {
                objectRefDic[objName]++;
            }
            else
            {
                objectRefDic.Add( objName, 1 );
            }
        }

        public void RemoveRef( string objName )
        {
            if( objectRefDic.ContainsKey( objName ) )
            {
                int num = objectRefDic[objName];
                objectRefDic[objName] = num = num > 0 ? num - 1 : 0;

                if( num <= 0 )
                {
                    objectRefDic.Remove( objName );
                }

                if( objectRefDic.Count == 0 )
                {
                    UnloadBundle();
                }
            }
            else
            {
                DebugUtils.LogWarning( DebugUtils.Type.AssetBundle, string.Format( "The bundle {0} does not have a refcounter for {1}, maybe deleted multiple times", bundleName, objName ) );
            }
        }

        public void UnloadBundle( bool unloadAllLoadedObjects = true )
        {
            if( AssetBundleAlwaysCache.CACHE_BUNDLE_NAME_LIST.Contains( bundleName ) ) return;

#if UNITY_EDITOR
            if( objectRefDic.Count > 0 )
            {
                DebugUtils.Log( DebugUtils.Type.AssetBundle, "Unloading AssetBundle with objectRefs: " + bundleName );
                foreach( KeyValuePair<string, int> kvp in objectRefDic )
                {
                    DebugUtils.Log( DebugUtils.Type.AssetBundle, "ObjectRef: " + kvp.Key + "[" + kvp.Value + "]" );
                }
            }
            else
            {
                DebugUtils.Log( DebugUtils.Type.AssetBundle, "AssetBundle unloaded " + bundleName );
            }

            if( dependedDic.Count > 0 )
            {
                DebugUtils.LogError( DebugUtils.Type.AssetBundle, string.Format( "The AssetBundle \"{0}\" dependency count is not 0, count:{1}", bundleName, dependedDic.Count ) );
            }
#endif
            if( assetBundle != null )
            {
                assetBundle.Unload( unloadAllLoadedObjects );
                assetBundle = null;
            }

            if( unDependenciesBundle != null )
            {
                unDependenciesBundle( dependencies, bundleName );
            }
        }
    }

    internal class LoadBundleVo
    {
        public enum State
        {
            Prepare,
            LoadDepend,
            LoadBundle,
            LoadAsset,
            Complete,
            Waiting,
        }
        public State curState;
        public string assetName;
        public AssetBundleRef abRef;
        public List<AssetBundleRef> dependRefList;
        public Action<UObject> assetLoadCompleteCall;

        public void Dispose()
        {
            curState = State.Prepare;
            assetName = null;
            abRef = null;
            if( dependRefList != null )
            {
                dependRefList.Clear();
                dependRefList = null;
            }
            assetLoadCompleteCall = null;
        }
    }

    public enum LoadAssetStep
    {
        PreLoad,
        Loading,
        Complete,
    }

}