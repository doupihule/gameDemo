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
using XLua;

namespace GameUtils
{
    [LuaCallCSharp]
    public static class ExtensionMethods
    {
        public static Component[] GetComponentsInChildrenExtension( this Component c, string t, bool includeInactive = false )
        {
            Type type = Type.GetType( t );
            return c.GetComponentsInChildren( type, includeInactive );
        }

        //根据GameObject直接获取子物体上的组件
        public static Component GetComponentInChild( this GameObject g, string childName, string componentName )
        {
            Transform child = g.transform.Find( childName );
            return child.GetComponentFromName( componentName );
        }

        //在物体得父物体上查找组件
        public static Component GetComponentInParent( this GameObject c, string t )
        {
            Type type = Type.GetType( t );
            if ( t == "Camera" )
            {
                return c.GetComponentInParent<Camera>();
            }
            return null;
        }

        public static Component AddComponentUIPanel( this UnityEngine.Object g )
        {
            return GetGameObject( g ).AddComponent<UnityEngine.UI.Image>();
        }

        public static Component AddComponentMeshCollider( this UnityEngine.Object g )
        {
            return GetGameObject( g ).AddComponent<MeshCollider>();
        }

        public static void RemoveComponentMeshCollider( this UnityEngine.Object g )
        {
            MeshCollider meshCollider = GetGameObject( g ).GetComponent<MeshCollider>();
            if ( meshCollider != null )
                GameObject.Destroy( meshCollider );
        }

        //public static PlotCameraEffect AddPlotCameraEffect( this UnityEngine.Object g )
        //{
        //    GameObject obj = GetGameObject( g );
        //    PlotCameraEffect mComponent = null;
        //    if ( obj != null )
        //    {
        //        mComponent = obj.GetComponent<PlotCameraEffect>();
        //        if ( mComponent == null )
        //            mComponent = obj.AddComponent<PlotCameraEffect>();
        //    }
        //    return mComponent;
        //}

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

        public static bool CameraToRaycastHitObjectClick( this Camera c, GameObject go, Action onClickHandle )
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

        
        public static void SetParent( this UnityEngine.Object g, UnityEngine.Object obj )
        {
            if ( obj == null )
                GetGameObject( g ).transform.parent = null;
            else
                GetGameObject( g ).transform.parent = GetGameObject( obj ).transform;
        }

       

        //根据GameObject获取position
        public static Vector3 GetPosition( this UnityEngine.Object g, UnityEngine.Object obj )
        {
            return GetGameObject( obj ).transform.position;
        }

        //根据GameObject设置localPosition
        public static void SetLocalPosition( this UnityEngine.Object g, Vector3 pos )
        {
            GetGameObject( g ).transform.localPosition = pos;
        }
        public static Vector3 GetLocalPosition( this UnityEngine.Object g )
        {
            return GetGameObject( g ).transform.localPosition;
        }

        public static void SetLocalPosition( this UnityEngine.Object g, float x, float y, float z )
        {
            GetGameObject( g ).transform.localPosition = new Vector3( x, y, z );
        }

        public static void SetLocalPosition( this UnityEngine.Object g, float x, float y )
        {
            GetGameObject( g ).transform.localPosition = new Vector3( x, y, GetGameObject( g ).transform.localPosition.z );
        }

        public static void SetLocalPositionZero( this UnityEngine.Object g )
        {
            GetGameObject( g ).transform.localPosition = Vector3.zero;
        }

        //根据GameObject设置localRotation
        public static void SetLocalRotation( this UnityEngine.Object g, Quaternion angle )
        {
            GetGameObject( g ).transform.localRotation = angle;
        }

        public static void SetLocalRotation( this UnityEngine.Object g, Vector3 angle )
        {
            GetGameObject( g ).transform.localRotation = Quaternion.Euler( angle );
        }

        public static Vector3 GetLocalRotation( this UnityEngine.Object g )
        {
            return GetGameObject( g ).transform.localRotation.eulerAngles;
        }

        public static void SetLocalRotationZero( this UnityEngine.Object g )
        {
            GetGameObject( g ).transform.localRotation = Quaternion.identity;
        }

        public static void SetLocalRotation( this UnityEngine.Object g, float x, float y, float z )
        {
            GetGameObject( g ).transform.localRotation = Quaternion.Euler( x, y, z );
        }

        public static void SetLocalRotationAngle( this UnityEngine.Object g, float angle )
        {
            GetGameObject( g ).transform.localRotation = Quaternion.Euler( 0, angle, 0 );
        }
        //根据GameObject设置localScale
        public static void SetLocalScale( this UnityEngine.Object g, Vector3 scale )
        {
            GetGameObject( g ).transform.localScale = scale;
        }

        public static void SetLocalScaleSize( this UnityEngine.Object g, float scale )
        {
            GetGameObject( g ).transform.localScale = Vector3.one * scale;
        }
        public static void SetLocalScaleOne( this UnityEngine.Object g )
        {
            GetGameObject( g ).transform.localScale = Vector3.one;
        }

        public static void SetLocalScaleZero( this UnityEngine.Object g )
        {
            GetGameObject( g ).transform.localScale = Vector3.zero;
        }

        //根据Transform直接获取子物体上的组件
        public static Component GetComponentInChild( this Transform t, string childName, string componentName )
        {
            Transform child = t.Find( childName );
            if ( string.IsNullOrEmpty( componentName ) )
                return child;
            return child.GetComponentFromName( componentName );
        }

        //根据组件名称直接获取组件引用
        public static Component GetComponentFromName( this Component c, string componentName )
        {
            Component com = null;
            if ( componentName == "Sprite" || componentName.Equals( "Sprite" ) )
            {
                com = c.GetComponent<Image>();
            }
            else if ( componentName == "Toggle" || componentName.Equals( "Toggle" ) )
            {
                com = c.GetComponent<Toggle>();
            }
            else if ( componentName == "Slider" || componentName.Equals( "Slider" ) )
            {
                com = c.GetComponent<Slider>();
            }
            else if ( componentName == "Grid" || componentName.Equals( "Grid" ) )
            {
                com = c.GetComponent<Grid>();
            }
            else if ( componentName == " Text" || componentName.Equals( "Label" ) )
            {
                com = c.GetComponent<Text>();
            }
            else if ( componentName == "Panel" || componentName.Equals( "Panel" ) )
            {
                com = c.GetComponent<Image>();
            }
           
            
            else if ( componentName == "ScrollBar" || componentName.Equals( "IScrollBar" ) )
            {
                com = c.GetComponent<Scrollbar>();
            }
            
            else if ( componentName == "BoxCollider" || componentName.Equals( "BoxCollider" ) )
            {
                com = c.GetComponent<BoxCollider>();
            }
            else if ( componentName == "Animation" || componentName.Equals( "Animation" ) )
            {
                com = c.GetComponent<Animation>();
            }
            else if ( componentName == "ScrollView" || componentName.Equals( "UIScrollView" ) )
            {
                com = c.GetComponent<ScrollRect>();
            }
            else if ( componentName == "ParticleSystem" || componentName.Equals( "ParticleSystem" ) )
            {
                com = c.GetComponent<ParticleSystem>();
            }
            else if ( componentName == "Camera" || componentName.Equals( "Camera" ) )
            {
                com = c.GetComponent<Camera>();
            }
            else
            {
                DebugUtils.LogError( DebugUtils.Type.Lua, "attempt to get Component that haven't been registered in ExtensionMethods.cs" );
            }
            return com;
        }


        //设置颜色
        public static void SetColor( this Image s, Color c )
        {
            s.color = c;
        }

        public static void SetAlpha( this Image s, float a )
        {
            s.SetColor( new Color( 1, 1, 1, a ) );
        }

        public static Vector3 GetCameraPositionToUICameraPosition( this Camera uiCamera, Camera mainCamera, Vector3 pos )
        {
            Vector2 screenPos = mainCamera.WorldToScreenPoint( pos );
            pos = uiCamera.ScreenToWorldPoint( screenPos );
            return pos;
        }
        public static GameObject InstantiateGameObject( this GameObject obj, GameObject parentObj, bool shouldRegister = false )
        {
            GameObject go = GameObject.Instantiate( obj );
            go.transform.parent = parentObj.transform;
            go.transform.localPosition = Vector3.zero;
            go.transform.localScale = Vector3.one;
            go.transform.localRotation = Quaternion.identity;
            if ( shouldRegister )
            {
                CSRegisterObject.RegisterObject( go );
            }
            return go;
        }

        //设置成置灰状态
        public static void SetDisabled( this Image s, bool isActive )
        {
            s.color = isActive ? Color.black : Color.white;
            Collider collider = s.GetComponent<Collider>();
            if ( collider != null )
                collider.enabled = !isActive;
        }
       



        public static void Destroy( this GameObject g, bool immediately = false )
        {
            CSRegisterObject.UnRegisterObject( g );

            if ( immediately )
            {
                GameObject.Destroy( g );
            }
            else
            {
                GameObject.DestroyImmediate( g );
            }
        }

        public static void Destroy( this UnityEngine.Object g, bool immediately = false )
        {
            CSRegisterObject.UnRegisterObject( g );

            if ( immediately )
            {
                UnityEngine.Object.Destroy( g );
            }
            else
            {
                UnityEngine.Object.DestroyImmediate( g );
            }
        }

        public static GameObject GetGameObject( UnityEngine.Object go )
        {
            GameObject obj = null;
            if ( go is GameObject )
            {
                obj = go as GameObject;
            }
            else if ( go is Component )
            {
                obj = ( go as Component ).gameObject;
            }
            return obj;
        }


        // 遍历所有子控件设置layer
        public static void SetChildrenLayer( this GameObject obj, String Layer )
        {
            foreach ( Transform child in obj.GetComponentsInChildren<Transform>() )
            {
                child.gameObject.layer = LayerMask.NameToLayer( Layer );
                // SetChildrenLayer( child.gameObject, Layer );
            }
        }
        public static void PlaySounds( this GameObject obj, bool isPreloading, string assetName, string path, string bundleName, float delay )
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

        public static void ClearSounds( this GameObject obj )
        {
            AudioSource audioSource = obj.GetComponent<AudioSource>();
            if ( audioSource != null )
                audioSource.clip = null;
        }

    }
}


