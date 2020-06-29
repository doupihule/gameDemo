using UnityEngine;
#if UNITY_EDITOR
using UnityEditor;
#endif

using Resource;

namespace GameUtils
{
    [ExecuteInEditMode]
    [DisallowMultipleComponent]
    [RequireComponent( typeof( SpriteRenderer ) )]
    public class SpriteRendererInspectorExpand : MonoBehaviour
    {
        [HideInInspector]
        public SpriteRenderer spriteRenderer;
        //[HideInInspector]
        public Texture2D alphaTexture2d;

#if UNITY_EDITOR
        void Reset()
        {
            RestValue();
        }

        void OnValidate()
        {
            RestValue();
        }

        void OnEnable()
        {
            RestValue();
        }       
#endif

        void Start()
        {
            SetSharedMaterial();
        }


        public void RestValue()
        {
            if( spriteRenderer == null )
            {
                spriteRenderer = GetComponent<SpriteRenderer>();
            }

            SetAlphaTexture();
        }

        public void SetAlphaTexture()
        {
#if UNITY_EDITOR
            if( alphaTexture2d != null && spriteRenderer.sprite != null )
            {
                string textureName = alphaTexture2d.name.Substring( 0, alphaTexture2d.name.Length - 2 );
                if( !spriteRenderer.sprite.texture.name.StartsWith( textureName ) )
                {
                    alphaTexture2d = null;
                }
            }

            if( spriteRenderer.sprite != null && alphaTexture2d == null )
            {
                SetSharedMaterial();
            }  
#endif
        }

        private void SetSharedMaterial()
        {
#if UNITY_EDITOR
            if ( alphaTexture2d == null )
            {
                string path = AssetDatabase.GetAssetPath( spriteRenderer.sprite.texture );
                alphaTexture2d = AssetDatabase.LoadAssetAtPath<Texture2D>( path.Replace( "_RGB.png", "_A.png" ) );
            }
            Material renderMat = new Material( Shader.Find( "Inu/Sprites/Default" ) );
            renderMat.SetTexture( "_AlphaTex", alphaTexture2d );
            spriteRenderer.sharedMaterial = renderMat;
#else
            spriteRenderer.sharedMaterial = ResourceManager.Instance.GetCustomSpriteRendererMaterial( alphaTexture2d );
#endif
        }

        public void OnSnap()
        {
            if( spriteRenderer != null && spriteRenderer.sprite != null )
            {
                spriteRenderer.size = spriteRenderer.sprite.bounds.size;
            }
        }
    }
}