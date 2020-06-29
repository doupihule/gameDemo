using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using UObject = UnityEngine.Object;

namespace Resource
{
    public class LoadResources : MonoBehaviour
    {
        private LoadAssetStep loadAssetStep;
        private Queue<LoadResourcesVo> loadQueue = new Queue<LoadResourcesVo>();
        
        public void Init()
        {
            loadAssetStep = LoadAssetStep.PreLoad;
        }

        public T Load<T>( string path ) where T : UObject
        {
            return Resources.Load<T>( path );
        }

        public void LoadAsync<T>( string path, Action<T> callback ) where T : UObject
        {
            LoadResourcesVo vo = new LoadResourcesVo();
            vo.path = name;
            vo.callback = delegate( UObject obj )
            {
                if( callback != null )
                {
                    callback( ( T )obj );
                }
            };

            loadQueue.Enqueue( vo );

            loadAssetStep = loadAssetStep == LoadAssetStep.Complete ? LoadAssetStep.PreLoad : loadAssetStep;
        }

        // Update is called once per frame
        void Update()
        {
            if( loadAssetStep == LoadAssetStep.PreLoad )
            {
                loadAssetStep = LoadAssetStep.Loading;
                StartCoroutine( Load() );
            }   
        }

        private IEnumerator Load()
        {
            while( loadQueue.Count > 0 )
            {
                LoadResourcesVo vo = loadQueue.Dequeue();

                ResourceRequest request = Resources.LoadAsync( vo.path );
                yield return request.isDone;

                vo.callback( request.asset );
            }

            loadAssetStep = LoadAssetStep.Complete;
        }
    }

    internal class LoadResourcesVo
    {
        public string path;
        public Action<UObject> callback;
    }
}