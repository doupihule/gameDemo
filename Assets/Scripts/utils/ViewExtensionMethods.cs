/*----------------------------------------------------------------
// Copyright (C) 2017 Jiawen
//
// file name: ExtensionMethods.cs
// description: 
// 
// created time：11/28/2017
//
//----------------------------------------------------------------*/

using Resource;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace GameUtils
{
    //视图相关的扩展接口
    public static class ViewExtensionMethods
    {
        private static Vector2 _tempVec2 = new Vector2();

        private static Vector3 _tempVec3 = new Vector3();
        private static Color _tempColor = new Color();

        public static bool MouseButtonDown()
        {
            bool pressed = false;
#if UNITY_EDITOR || UNITY_STANDALONE
            pressed = Input.GetMouseButtonDown( 0 );
#else
            if ( Input.touchCount <= 0 )
                return false;
            else if ( Input.touchCount > 0 )
            {
                Touch touch1 = Input.GetTouch( 0 );
                if ( touch1.phase == TouchPhase.Began )
                    pressed = true;
            }
#endif
            return pressed;
        }

        public static bool CameraToRaycastHitObjectClick( Camera c, GameObject go, Action onClickHandle )
        {
            Vector3 touchPosition = Vector3.zero;
            bool pressed = false;
#if UNITY_EDITOR || UNITY_STANDALONE
            touchPosition = Input.mousePosition;
            pressed = Input.GetMouseButtonDown( 0 );
#else
            if ( Input.touchCount <= 0 )
                return false;
            else if ( Input.touchCount > 0 )
            {
                Touch touch1 = Input.GetTouch( 0 );
                touchPosition = touch1.position;

                if ( touch1.phase == TouchPhase.Began )
                    pressed = true;
            }
#endif

            if ( pressed )
            {
                Ray ray = c.ScreenPointToRay( touchPosition );  //从摄像机发出到点击坐标的射线
                RaycastHit hitInfo;
                if ( Physics.Raycast( ray, out hitInfo ) )
                {
                    if ( hitInfo.collider.gameObject == go && onClickHandle != null )
                    {
                        onClickHandle();
                        return true;
                    }
                }
            }
            return false;
        }

        
        // 遍历所有子控件设置layer
        public static void SetChildrenLayer( GameObject obj, String Layer )
        {
            foreach ( Transform child in obj.GetComponentsInChildren<Transform>() )
            {
                child.gameObject.layer = LayerMask.NameToLayer( Layer );
                // SetChildrenLayer( child.gameObject, Layer );
            }
        }


        //播放声音

        public static void PlaySounds( GameObject obj, bool isPreloading, string assetName, string path, string bundleName, float delay )
        {
            AudioSource audioSource = obj.GetComponent<AudioSource>();
            if ( audioSource != null )
            {
                if ( isPreloading )
                    audioSource.clip = ( GameResourceCacheObjects.Instance.OnLoadObject( assetName ) ) as AudioClip;
                else
                    audioSource.clip = ResourceManager.Instance.LoadAsset<AudioClip>( assetName, path, bundleName );
                audioSource.Play( (ulong)( delay * 44100 ) );
            }
        }

        public static void ClearSounds( GameObject obj )
        {
            AudioSource audioSource = obj.GetComponent<AudioSource>();
            if ( audioSource != null )
                audioSource.clip = null;
        }

        //---------------------------transform---------------------------------
        
        public static void SetObj2dPos(RectTransform trans, float x, float y)
        {
            _tempVec2.x = x;
            _tempVec2.y = y;
            trans.anchoredPosition = _tempVec2;
        }

        //设置对象3d坐标
        public static void SetObj3dPos(Transform trans, float x, float y, float z)
        {
            _tempVec3.x = x;
            _tempVec3.y = y;
            _tempVec3.z = z;
            trans.localPosition = _tempVec3;
        }

        //设置对象旋转
        public static void SetObjRotation(Transform trans, float x, float y, float z)
        {
            _tempVec3.x = x;
            _tempVec3.y = y;
            _tempVec3.z = z;
            trans.localEulerAngles = _tempVec3;
        }

        //设置缩放
        public static void SetObjScale(Transform trans, float x, float y, float z)
        {
            _tempVec3.x = x;
            _tempVec3.y = y;
            _tempVec3.z = z;
            trans.localScale = _tempVec3;
        }
        public static void SetLocalScaleSize(Transform trans, float scale)
        {
            trans.localScale = Vector3.one * scale;
        }


        //设置颜色
        public static void SetImageColor(Image img, int r,int g,int b, int a)
        {
            _tempColor.r = r;
            _tempColor.g = g;
            _tempColor.b = b;
            _tempColor.a = a;
            img.color = _tempColor;
        }
        //设置文本颜色
        public static void SetLabelColor(Text txt, int r, int g, int b, int a) {
            _tempColor.r = r;
            _tempColor.g = g;
            _tempColor.b = b;
            _tempColor.a = a;
            txt.color = _tempColor;
        }


        public static Vector3 initVec3(float x, float y, float z)
        {
            _tempVec3.x = x;
            _tempVec3.y = y;
            _tempVec3.z = z;
            return _tempVec3;
        }

        public static Vector2 initVec2(float x, float y)
        {
            _tempVec2.x = x;
            _tempVec2.y = y;
            return _tempVec2;
        }

        //初始化颜色
        public static Color initColor(int r, int g, int b, int a)
        {
            _tempColor.r = r;
            _tempColor.g = g;
            _tempColor.b = b;
            _tempColor.a = a;
            return _tempColor;
        }

         //移除所有子对象
         public static void RemoveAllChild(Transform tran)
        {
            int nums = tran.childCount;
            for(int i = nums-1; i >= 0; i--)
            {
                tran.GetChild(i).parent = null;
            }
        }

        public static GameObject GetChildByName(Transform tran,string name)
        {
            int nums = tran.childCount;
            for (int i = nums - 1; i >= 0; i--)
            {
                Transform childTrans = tran.GetChild(i);
                if (childTrans.name.Equals(name))
                {
                    return childTrans.gameObject;
                }
            }
            return null;
        }

    }
}


