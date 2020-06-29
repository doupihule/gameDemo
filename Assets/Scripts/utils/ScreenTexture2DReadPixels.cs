using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class ScreenTexture2DReadPixels : MonoBehaviour
{
    public Material memoryEffectMaterial = null;

    private Material newMemoryEffectMaterial = null;
    private Texture2D texture = null;

    public float frequency = -0.008f;
    public float speed = 3f;
    private Rect mRect = new Rect( 0, 0, Screen.width, Screen.height );
    private bool state = false;
    public void StartScreenShootEffect()
    {
    }

    void OnRenderImage( RenderTexture source, RenderTexture destination )
    {
        if ( newMemoryEffectMaterial != null )
            Graphics.Blit( source, destination, newMemoryEffectMaterial );
        else
            Graphics.Blit( source, destination );
    }

    //public void OnGUI()
    //{
    //    if ( GUILayout.Button( "波动", GUILayout.Width( 200 ) ) )
    //        StartScreenShootEffect();
    //}

    private IEnumerator ScreenShoot()
    {
        yield return new WaitForEndOfFrame();
        texture.wrapMode = TextureWrapMode.Clamp;
        texture.ReadPixels( mRect, 0, 0 );
        texture.Apply();
        if ( newMemoryEffectMaterial == null )
        {
            newMemoryEffectMaterial = new Material( memoryEffectMaterial );
            newMemoryEffectMaterial.SetTexture( "_ScreenShot", texture );
        }
        newMemoryEffectMaterial.SetFloat( "_UVOffsetScale", 0 );
        newMemoryEffectMaterial.SetFloat( "_TransferTimeScale", 1.5f );
        newMemoryEffectMaterial.SetFloat( "_TransferScale", 1 );
        state = true;
        yield return new WaitForSeconds( 3 );
    }

    public void Update()
    {
        if ( state )
        {
        }
    }
}
