using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using GameUtils;
using Resource;
using UObject = UnityEngine.Object;
using UIWidgets;

namespace XLua
{
    [LuaCallCSharp]
    public class XLuaHelper
    {
        /// <summary>
        /// Load a gameObject
        /// Tips: If this method be invoked in Lua, Use CS.XLua.XLuaHelper.LoadGameObject( path )
        /// </summary>
        /// <param name="assetName"> Asset name </param>
        /// <param name="path"> Path in the project </param>
        /// <param name="bundleName"> Assetbundle name </param>
        /// <param name="parent"> parent transform </param>
        /// <returns></returns>
        public static GameObject LoadCloneGameObject( string assetName, string path, string bundleName, Transform parent = null )
        {
            try
            {
                GameObject go = ResourceManager.Instance.LoadAsset<GameObject>( assetName, path, bundleName );
                go = GameObject.Instantiate( go, Vector3.zero, Quaternion.identity, parent );
                go.transform.localScale = Vector3.one;

                CSRegisterObject.RegisterObject( go );
                return go;
            }
            catch ( Exception e )
            {
                DebugUtils.LogError( DebugUtils.Type.Resource, string.Format( "Load gameobject failed! name = {0} path = {1} bundleName = {2} \n Error message {3}", assetName, path, bundleName, e.Message ) );
                return null;
            }
        }

        public static void LoadCloneGameObjectAsync( string assetName, string path, string bundleName, Action<GameObject> callback, Transform parent = null )
        {
            try
            {
                ResourceManager.Instance.LoadAssetAsync<GameObject>( assetName, path, bundleName, delegate ( GameObject go )
                {
                    GameObject clone = GameObject.Instantiate( go, Vector3.zero, Quaternion.identity, parent );
                    clone.transform.SetParent( parent );
                    clone.transform.localScale = Vector3.one;
                    if ( callback != null )
                    {
                        CSRegisterObject.RegisterObject( go );
                        callback( clone );
                    }
                } );
            }
            catch ( Exception e )
            {
                if ( callback != null )
                {
                    callback( null );
                }
                DebugUtils.LogError( DebugUtils.Type.Resource, string.Format( "Load gameobject failed! name = {0} path = {1} bundleName = {2} \n Error message {3}", assetName, path, bundleName, e.Message ) );
            }
        }


        public static UObject LoadUObject( string assetName, string path, string bundleName )
        {
            try
            {
                UObject obj = ResourceManager.Instance.LoadAsset<UObject>( assetName, path, bundleName );
                CSRegisterObject.RegisterObject( obj );
                return obj;
            }
            catch ( Exception e )
            {
                DebugUtils.LogError( DebugUtils.Type.Resource, string.Format( "Load gameobject failed! name = {0} path = {1} bundleName = {2} \n Error message {3}", assetName, path, bundleName, e.Message ) );
                return null;
            }
        }

        public static Shader LoadShader( string shaderName, string bundleName )
        {
            try
            {
                Shader shader = ResourceManager.Instance.FindInBundle( shaderName, bundleName );
                CSRegisterObject.RegisterObject( shader );
                return shader;
            }
            catch ( Exception e )
            {
                DebugUtils.LogError( DebugUtils.Type.Resource, string.Format( "Load shader failed! name = {0} bundleName = {2} \n Error message {3}", shaderName, bundleName, e.Message ) );
                return null;
            }
        }

        public static List<Vector3> GetPoints( Vector3 a, Vector3 b, float pointCount )
        {
            List<Vector3> points = new List<Vector3>();
            float distance = Vector3.Distance( a, b );
            float avg = distance / pointCount;
            Vector3 normalized = ( a - b ).normalized;
            for ( int i = 1; i < pointCount; i++ )
            {
                points.Add( a - normalized * avg * i );
            }
            return points;
        }

        public static List<float> GetSizes( float a, float b, float pointCount )
        {
            List<float> points = new List<float>();
            float distance =  a - b ;
            float avg = distance / pointCount;
            for ( int i = 1; i < pointCount; i++ )
            {
                points.Add( a - avg * i );
            }
            return points;
        }

        public static Vector3[] GetPaths( List<Vector3> points, float pointCount,GameObject parentObj )
        {
            List<Vector3> paths = new List<Vector3>();
            for(int i =0;i<points.Count;i++ )
            {
                if(i< points.Count - 1 )
                {
                    paths.Add( points[i] );
                    paths.AddRange( GetPoints( points[i], points[i + 1], pointCount ) );
                }
            }

            //for(int i =0;i< paths.Count;i++ )
            //{
            //    GameObject obj = GameObject.CreatePrimitive( PrimitiveType.Cube );
            //    obj.transform.parent = parentObj.transform;
            //    obj.transform.name = i.ToString();
            //    obj.transform.localPosition = paths[i];
            //    obj.transform.localScale = Vector3.one * 20f;
            //}

            return paths.ToArray();
        }

        public static float[] GetPathSizes( List<float> sizes , float pointCount )
        {
            List<float> pSizes = new List<float>();
            for ( int i = 0; i < sizes.Count; i++ )
            {
                if ( i < sizes.Count - 1 )
                {
                    pSizes.Add( sizes[i] );
                    pSizes.AddRange( GetSizes( sizes[i], sizes[i + 1], pointCount ) );
                }
            }
            return pSizes.ToArray();
        }
        //卸载用过的资源
        public static void UnLoadUObject( object obj )
        {
            try
            {
                CSRegisterObject.UnRegisterObject( obj );
            }
            catch ( Exception e )
            {
                DebugUtils.LogError( DebugUtils.Type.Resource, string.Format( "UnloadUObject Error  Obj:{0}, ErrorMsg:{1}", obj.ToString(), e.Message ) );
            }
        }

        public static void LoadUObjectAsync( string assetName, string path, string bundleName, Action<UObject> callback )
        {
            try
            {
                ResourceManager.Instance.LoadAssetAsync<UObject>( assetName, path, bundleName, delegate ( UObject obj )
                {
                    if ( callback != null )
                    {
                        CSRegisterObject.RegisterObject( obj );
                        callback( obj );
                    }
                } );
            }
            catch ( Exception e )
            {
                if ( callback != null )
                {
                    callback( null );
                }
                DebugUtils.LogError( DebugUtils.Type.Resource, string.Format( "Load gameobject failed! name = {0} path = {1} bundleName = {2} \n Error message {3}", assetName, path, bundleName, e.Message ) );
            }
        }

        public static void ReleaseAsset( string bundleName, string assetName )
        {
            ResourceManager.Instance.ReleaseAsset( bundleName, assetName );
        }

        public static void UnloadBundle( string bundleName, bool unloadAllLoadedObjects )
        {
            ResourceManager.Instance.UnloadBundleByName( bundleName, unloadAllLoadedObjects );
        }

        public static bool IsNull( GameObject obj )
        {
            return obj == null;
        }

        public static bool InputClick()
        { 
            return Input.GetMouseButtonUp( 0 );
        }
        public static GameObject CreateEmptyGameObject( string name, GameObject parentObj = null )
        {
            GameObject obj = new GameObject( name );
            if ( parentObj != null )
            {
                obj.transform.parent = parentObj.transform;
                obj.transform.localPosition = Vector3.zero;
                obj.transform.localScale = Vector3.one;
                obj.transform.localRotation = Quaternion.identity;
            }
            return obj;
        }
        public static RenderTexture CreateRenderTexture( float width, float height )
        {
            return new RenderTexture( (int)width, (int)height, 16, RenderTextureFormat.ARGB32, RenderTextureReadWrite.Default );
        }
        public static LuaTable LoadUILuaTable( string assetName, string path, string bundleName, Transform parent = null )
        {
            GameObject gameObject = LoadCloneGameObject( assetName, path, bundleName, parent );
            LuaBehaviour luaBehaviour = gameObject.GetComponent<LuaBehaviour>();
            if ( luaBehaviour != null )
            {
                LuaTable t = luaBehaviour.GetLuaTable();
                return t;
            }
            return null;
        }

        public static void FillCompoents( LuaTable t, GameObject g, string path )
        {
            SearchInChild( t, g.transform, path );
               
            //Image viewPanel = g.GetComponent<>();
            //if ( viewPanel )
            //{
            //    t.SetInPath<Image>( string.Format( path, "viewPanel" ), viewPanel );
            //}
        }

        public static void SetLocalScale( Transform t, float x, float y )
        {
            Vector3 scale = new Vector3( x, y, 1 );
            DebugUtils.Assert( t != null, string.Format( "Can't set a null transform's scale as  {0}", scale ) );

            t.localScale = scale;
        }

        public static void SetPosition( Transform t, float x, float y )
        {
            Vector3 pos = new Vector3( x, y, 0 );
            DebugUtils.Assert( t != null, string.Format( "Can't set a null transform's position as  {0}", pos ) );

            t.position = pos;
        }

        public static void SetLocalPosition( Transform t, float x, float y )
        {
            Vector3 pos = new Vector3( x, y, 0 );
            DebugUtils.Assert( t != null, string.Format( "Can't set a null transform's local position as  {0}", pos ) );

            t.localPosition = pos;
        }

        static void SearchInChild( LuaTable luaT, Transform t, string path )
        {
            if ( t.childCount == 0 )
            {
                return;
            }

            for ( int i = 0; i < t.childCount; i++ )
            {
                Transform child = t.GetChild( i );
                luaT.Set(child.gameObject.name, child.gameObject);
                //CheckChildComponentName( luaT, child.gameObject, path );
                SearchInChild( luaT, child, path );
            }
        }

        private static void CheckChildComponentName( LuaTable t, GameObject g, string path )
        {
            string[] name = g.name.Split( '_' );
            if ( name.Length > 1 )
            {
                string tag = name[name.Length - 1];
                //SetValueInTable<>(t, tag, g, path);
                //switch ( tag )
                //{
                //    case "tr":
                //        {
                //            SetValueInTable<TrailRenderer>( t, tag, g, path );
                //            break;
                //        }
                //    case "sp":
                //        {
                //            SetValueInTable<Sprite>( t, tag, g, path );
                //            break;
                //        }
                //    case "txt":
                //        {
                //            SetValueInTable<>( t, tag, g, path );
                //            break;
                //        }
                //    case "btn":
                //        {
                //            SetValueInTable<Button>( t, tag, g, path );
                //            break;
                //        }
                //    case "go":
                //        {
                //            t.SetInPath( string.Format( path, g.name ), g );
                //            break;
                //        }
                //    case "particle":
                //    case "ps":
                //        {
                //            SetValueInTable<ParticleSystem>( t, tag, g, path );
                //            break;
                //        }
                //    case "tog":
                //        {
                //            SetValueInTable<UIToggle>( t, tag, g, path );
                //            break;
                //        }
                //    case "uis":
                //    case "sdr":
                //        {
                //            SetValueInTable<UISlider>( t, tag, g, path );
                //            break;
                //        }
                //    case "grd":
                //        {
                //            SetValueInTable<UIGrid>( t, tag, g, path );
                //            break;
                //        }
                //    case "pn":
                //        {
                //            SetValueInTable<Image>( t, tag, g, path );
                //            break;
                //        }
                //    case "pop":
                //        {
                //            SetValueInTable<UIPopupList>( t, tag, g, path );
                //            break;
                //        }
                //    case "wid":
                //    case "inicon":
                //        {
                //            SetValueInTable<UIWidget>( t, tag, g, path );
                //            break;
                //        }
                //    case "ani":
                //        {
                //            SetValueInTable<Animation>( t, tag, g, path );
                //            break;
                //        }
                //    case "tex":
                //        {
                //            SetValueInTable<UITexture>( t, tag, g, path );
                //            break;
                //        }
                //    case "scrollBar":
                //        {
                //            SetValueInTable<UIScrollBar>( t, tag, g, path );
                //            break;
                //        }
                //    case "ip":
                //        {
                //            SetValueInTable<UIInput>( t, tag, g, path );
                //            break;
                //        }
                //    case "tb":
                //        {
                //            SetValueInTable<UITable>( t, tag, g, path );
                //            break;
                //        }
                //    case "box":
                //        {
                //            SetValueInTable<BoxCollider>( t, tag, g, path );
                //            break;
                //        }
                //    case "scl":
                //        {
                //            SetValueInTable<UIScrollView>( t, tag, g, path );
                //            break;
                //        }
                //    case "drag":
                //        {
                //            SetValueInTable<UIDragScrollView>( t, tag, g, path );
                //            break;
                //        }
                //    case "warp":
                //        {
                //            SetValueInTable<MUIWrapContent>( t, tag, g, path );
                //            break;
                //        }
                //    default:
                //        {
                //            break;
                //        }
                //}
            }
        }

        private static void SetValueInTable<T>( LuaTable t, string nameTag, GameObject g, string path )
        {
            T component = g.GetComponent<T>();
            DebugUtils.Assert( component != null, string.Format( "Can't find target component in gameObject {1}, tag = {0}", nameTag, g.name ) );
            t.SetInPath<T>( string.Format( path, g.name ), component );
        }

        public static float ParseDistance( string positionstr, Vector3 position )
        {
            return Vector3.Distance( ParseVector3( positionstr ), position );
        }

        public static Vector3 ParseVector3( string positionstr )
        {
            string[] strs = positionstr.Split( ',' );
            Vector3 ves = new Vector3();
            if ( strs.Length > 0 )
                ves.x = float.Parse( strs[0] );
            if ( strs.Length > 1 )
                ves.y = float.Parse( strs[1] );
            if ( strs.Length > 2 )
                ves.z = float.Parse( strs[2] );
            return ves;
        }

        public static Sprite[] SearchInChildSprite( GameObject obj, string contains = "" )
        {
            Sprite[] allSprites = obj.GetComponentsInChildren<Sprite>();
            if ( string.IsNullOrEmpty( contains ) )
                return allSprites;
            else
            {
                List<Sprite> spriteList = new List<Sprite>();
                if ( allSprites != null )
                {
                    for ( int i = 0; i < allSprites.Length; i++ )
                    {
                        if ( allSprites[i].name.Contains( contains ) )
                            spriteList.Add( allSprites[i] );
                    }
                }
                return spriteList.ToArray();
            }
        }

        //public static TweenAlpha[] SearchInChildTweenAlpha( GameObject obj )
        //{
        //    return obj.GetComponentsInChildren<TweenAlpha>();
        //}

        public static string OnlyEncrypt( string text )
        {
            return AESUtil.OnlyEncrypt( text );
        }

        public static string OnlyDecrypt( string text )
        {
            return AESUtil.OnlyDecrypt( text );
        }

        public static Component GetComponent( GameObject obj, string name )
        {
            return obj.GetComponent( name );
        }

        public static Component GetComponent( Transform trans, string name )
        {
            return trans.GetComponent( name );
        }

        public static GameObject Find( GameObject obj, string name )
        {
            return Find( obj.transform, name ).gameObject;
        }

        public static Transform Find( Transform trans, string name )
        {
            return trans.Find( name );
        }
        public static Component Find( Transform trans, string name, string type )
        {
            return GetComponent( Find( trans, name ), type );
        }

        public static Component Find( GameObject obj, string name, string type )
        {
            return GetComponent( Find( obj, name ), type );
        }

        public static void ParentTransform( GameObject childObj, GameObject obj )
        {
            childObj.transform.parent = obj.transform;
        }

        public static LuaTable GetLuaTable( string gameObjectName )
        {
            GameObject go = GameObject.Find( gameObjectName );
            if ( go )
            {
                LuaBehaviour luaBehavior = go.GetComponent<LuaBehaviour>();
                if ( luaBehavior )
                {
                    return luaBehavior.GetLuaTable();
                }
                else
                {
                    DebugUtils.LogError( DebugUtils.Type.Lua, string.Format( "Try to get a luaTable, but can't find LuaBehaviour on {0}", gameObjectName ) );
                }
            }

            DebugUtils.LogError( DebugUtils.Type.Lua, string.Format( "Try to get a luaTable, but can't find gameObject {0}", gameObjectName ) );
            return null;
        }

        public static Component GetGameObjectComponent( string gameObjectName, string componentName )
        {
            GameObject go = GameObject.Find( gameObjectName );
            if ( go )
            {
                Component component = go.GetComponent( componentName );
                if ( component )
                {
                    return component;
                }
                else
                {
                    DebugUtils.LogError( DebugUtils.Type.Lua, string.Format( "Try to get a component, but can't find Component on {0}", componentName ) );
                }
            }

            DebugUtils.LogError( DebugUtils.Type.Lua, string.Format( "Try to get a component, but can't find gameObject {0}", gameObjectName ) );
            return null;
        }

        #region update resources 

        public static void CheckReourceUpdate( Action<float, float> checkCallback, Action<string> versionCallback )
        {
            ResourceManager.Instance.CheckReourceUpdate( checkCallback, versionCallback );
        }

        public static void DownloadResources( Action<long, long, long> downloadCallback )
        {
            ResourceManager.Instance.DownloadResources( downloadCallback );
        }
        public static void DownloadDispose()
        {
            ResourceManager.Instance.DownloadDispose();
        }

        public static void UncompressResources( Action<int, int> uncompressCallback )
        {
            ResourceManager.Instance.UncompressResources( uncompressCallback );
        }

        public static void ResetResourceManager()
        {
            ResourceManager.Instance.RemoveDonwloadObject();
            ResourceManager.Instance.InitLoadManager();
        }

        #endregion

        public static string LocalGameVersion()
        {
            return ResourceManager.gameVersion;
        }

        public static string ServerVersion()
        {
            return string.Concat( ResourceManager.bytesVersion, ".", ResourceManager.bundleVersion );
        }
    }
}
