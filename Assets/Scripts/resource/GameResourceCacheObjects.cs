using UnityEngine;
using System.Collections;
using Resource;
using System.Collections.Generic;
using UnityEngine.Profiling;

public class GameResourceCacheObjects
{
    private static GameResourceCacheObjects _Instance;
    public static GameResourceCacheObjects Instance
    {
        get
        {
            if ( _Instance == null )
            {
                _Instance = new GameResourceCacheObjects();
                // _Instance.Init();
            }

            return _Instance;
        }
    }
    public int Number = 0;  //加载资源数量
    //资源缓存列表
    private Dictionary<string, List<CacheInfo>> cacheInfoDic = new Dictionary<string, List<CacheInfo>>();
    //AB包中包含的资源文件名称
    private Dictionary<string, List<string>> resourceDependDics = new Dictionary<string, List<string>>();
    //资源所属AB包资源信息
    private Dictionary<string, string> resourceNameToDependInfos = new Dictionary<string, string>();

    private GameObject cacheParentObject = null;
    private System.Action finishCall = null;
    private System.Action destroyCall = null;
    public void Init()
    {
        cacheParentObject = new GameObject( "CacheParentObjects" );
        MonoBehaviour.DontDestroyOnLoad( cacheParentObject );
    }

    public void Destroy()
    {
        if ( cacheParentObject != null )
            MonoBehaviour.Destroy( cacheParentObject );
        cacheParentObject = null;
        if ( destroyCall != null )
            destroyCall();
    }

    //加载文件
    public void AddResourceName( string resourceName )
    {
        string[] infos = resourceName.Split( '#' );
        string key = infos[2];
        string name = infos[0];
        //不能添加重复资源
        if ( resourceNameToDependInfos.ContainsKey( name ) )
            return;
        resourceNameToDependInfos.Add( name, key );

        if ( resourceDependDics.ContainsKey( key ) )
            resourceDependDics[key].Add( name );
        else
            resourceDependDics.Add( key, new List<string>() { name } );
        Number++;

        ResourceManager.Instance.LoadAssetAsync<Object>( name, infos[1], key, OnPrefabSuccessHandle );
    }

    //资源异步加载完成回调
    private void OnPrefabSuccessHandle( Object prefab )
    {
        string name = prefab.name;
        CacheInfo cacheInfo = new CacheInfo();
        if ( prefab is GameObject )
        {
            GameObject obj = (GameObject)GameObject.Instantiate( prefab );
            MeshRenderer meshRender = obj.GetComponent<MeshRenderer>();
            obj.name = name;
            cacheInfo.obj = obj;
            cacheInfo.position = obj.transform.localPosition;
            cacheInfo.scale = obj.transform.localScale.x;
            cacheInfo.layer = obj.layer;
            cacheInfo.angle = obj.transform.localEulerAngles;
            if ( meshRender != null )
            {
                cacheInfo.sortingLayerName = meshRender.sortingLayerName;
                cacheInfo.sortingOrder = meshRender.sortingOrder;
            }
        }
        else
            cacheInfo.obj = prefab;
        cacheInfo.obj.name = name;
        cacheInfo.abObj = prefab;
        cacheInfo.isUseing = false;
        cacheInfo.name = name;
        if ( !cacheInfoDic.ContainsKey( name ) )
            cacheInfoDic.Add( name, new List<CacheInfo>() );
        cacheInfoDic[name].Add( cacheInfo );
        Number--;
        if ( Number <= 0 )
        {
            if ( finishCall != null )
                finishCall();
        }
    }
    //克隆缓存对象
    private CacheInfo ClonePrefab( CacheInfo cacheInfo )
    {
        string name = cacheInfo.name;
        CacheInfo uCacheInfo = new CacheInfo();
        if ( cacheInfo.obj is GameObject )
        {
            uCacheInfo.obj = (GameObject)GameObject.Instantiate( cacheInfo.abObj );
            uCacheInfo.obj.name = name;
        }
        else
            uCacheInfo.obj = cacheInfo.obj;
        uCacheInfo.abObj = cacheInfo.abObj;
        uCacheInfo.name = name;
        uCacheInfo.scale = cacheInfo.scale;
        uCacheInfo.layer = cacheInfo.layer;
        uCacheInfo.position = cacheInfo.position;
        uCacheInfo.angle = cacheInfo.angle;
        uCacheInfo.sortingLayerName = cacheInfo.sortingLayerName;
        uCacheInfo.sortingOrder = cacheInfo.sortingOrder;
        uCacheInfo.isUseing = false;

        if ( !cacheInfoDic.ContainsKey( name ) )
            cacheInfoDic.Add( name, new List<CacheInfo>() );
        cacheInfoDic[name].Add( uCacheInfo );
        return uCacheInfo;
    }

    //加载prefab
    public GameObject OnLoadPrefab( string name )
    {
        Object obj = OnLoadObject( name );
        if ( obj != null )
            return (GameObject)obj;
        return null;
    }
    //释放prefab资源
    public bool OnUnLoadPrefab( GameObject obj, string name = "", bool isDestory = false )
    {
        return OnUnLoadObject( obj, name, isDestory );
    }
    //加载资源
    public Object OnLoadObject( string name )
    {
        CacheInfo uCacheInfo = null;
        if ( cacheInfoDic.ContainsKey( name ) )
        {
            List<CacheInfo> cacheInfos = cacheInfoDic[name];
            for ( int i = 0; i < cacheInfos.Count; i++ )
            {
                CacheInfo cacheInfo = cacheInfos[i];
                //只针对GameObject类型
                if ( cacheInfo.obj is GameObject )
                {
                    if ( !cacheInfo.isUseing )
                    {
                        cacheInfo.isUseing = true;
                        uCacheInfo = cacheInfo;
                        break;
                    }
                }
                else
                {
                    uCacheInfo = cacheInfo;
                    break;
                }
            }
            //如果没有空出来的，就克隆出一个新的
            if ( uCacheInfo == null )
            {
                uCacheInfo = ClonePrefab( cacheInfos[0] );
                uCacheInfo.isUseing = true;
            }
        }
        if ( uCacheInfo != null )
            return uCacheInfo.obj;
        return null;
    }


    //释放资源
    public bool OnUnLoadObject( Object obj, string name = "", bool isDestory = false )
    {
        if ( obj != null )
        {
            if ( string.IsNullOrEmpty( name ) )
                name = obj.name;
            if ( cacheInfoDic.ContainsKey( name ) )
            {
                List<CacheInfo> cacheInfos = cacheInfoDic[name];
                CacheInfo removeCacheInfo = null;
                for ( int i = 0; i < cacheInfos.Count; i++ )
                {
                    if ( cacheInfos[i].obj == obj )
                    {
                        cacheInfos[i].isUseing = false;
                        cacheInfos[i].obj.name = cacheInfos[i].name;
                        removeCacheInfo = cacheInfos[i];
                        break;
                    }
                }

                if ( isDestory && removeCacheInfo != null )
                {
                    if ( removeCacheInfo.obj is GameObject )
                        MonoBehaviour.Destroy( obj );
                    cacheInfos.Remove( removeCacheInfo );
                    if ( cacheInfos.Count == 0 )
                        cacheInfoDic.Remove( name );
                    else
                        cacheInfoDic[name] = cacheInfos;
                }
                return true;
            }
        }
        return false;
    }

    //清理资源
    public void ClearObject( string name )
    {
        //缓存资源清理
        if ( cacheInfoDic.ContainsKey( name ) )
        {
            List<CacheInfo> list = cacheInfoDic[name];
            for ( int j = 0; j < list.Count; j++ )
                MonoBehaviour.Destroy( list[j].obj );
            cacheInfoDic.Remove( name );
        }

        //清理资源关系文件
        if ( resourceNameToDependInfos.ContainsKey( name ) )
        {
            string key = resourceNameToDependInfos[name];
            resourceNameToDependInfos.Remove( name );
            if ( resourceDependDics.ContainsKey( key ) )
            {
                if ( resourceDependDics[key].Contains( name ) )
                    resourceDependDics[key].Remove( name );
                if ( resourceDependDics[key].Count <= 0 )
                {
                    ResourceManager.Instance.ReleaseAsset( key, name );
                    resourceDependDics.Remove( key );
                }
            }
        }
    }

    class CacheInfo
    {
        public string name;
        public int layer = 0;
        public Vector3 position = Vector3.zero;
        public Vector3 angle = Vector3.zero;
        public string sortingLayerName;
        public int sortingOrder;
        public float scale = 1;
        public Object obj;  //应用对象
        public Object abObj; //ab包中的对象
        private bool _isUseing;
        public bool isUseing
        {
            set
            {
                _isUseing = value;
                if ( obj != null && obj is GameObject )
                {
                    ( (GameObject)obj ).SetActive( _isUseing );
                    if ( !_isUseing )
                    {
                        MeshRenderer meshRenderer = ( (GameObject)obj ).GetComponent<MeshRenderer>();
                        if ( meshRenderer != null )
                        {
                            meshRenderer.sortingLayerName = sortingLayerName;
                            meshRenderer.sortingOrder = sortingOrder;
                        }
                        //SkeletonAnimation skeletonAnimation = ( (GameObject)obj ).GetComponent<SkeletonAnimation>();
                        //if ( skeletonAnimation != null )
                        //    skeletonAnimation.AnimationName = "";
                        ( (GameObject)obj ).transform.parent = Instance.cacheParentObject.transform;
                        ( (GameObject)obj ).transform.localPosition = position;
                        ( (GameObject)obj ).transform.localEulerAngles = angle;
                        ( (GameObject)obj ).transform.localScale = Vector3.one * scale;
                        ( (GameObject)obj ).layer = layer;
                    }
                }
            }
            get
            {
                return _isUseing;
            }
        }
    }
}
