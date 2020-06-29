using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// 【郑毅烨】用OnGUI记录FPS大小

public class FPSLabel : MonoBehaviour {

    //Rect position = new Rect(10, 10, 100, 50);

    GUIStyle fontStyle = new GUIStyle();
    Camera m_camera;

	// Use this for initialization
	void Start () {

        fontStyle.fontSize = 30;
        fontStyle.normal.textColor = new Color(1, 1, 1);
        fontStyle.alignment = TextAnchor.MiddleRight;

        m_camera = Camera.main;
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    // 用OnGUI画上FPS记录
    //private void OnGUI()
    //{
    //    if (m_camera == null) {
    //        m_camera = GameObject.Find("Camera").GetComponent<Camera>();
    //        return;
    //    }
        

    //    //Resolution currentResolution = Screen.currentResolution;
    //    Vector2 currentResolution = new Vector2(m_camera.pixelWidth, m_camera.pixelHeight);

    //    Rect position = new Rect(currentResolution.x - 200, 10, 100, 100);

    //    float fps = 0;

    //    if( Time.deltaTime != 0 )
    //    {
    //        fps =  1 / Time.deltaTime;
    //    }

    //    string content = System.String.Format("{0:F2} FPS", fps) + "\nResolution:" + currentResolution.x + " " + currentResolution.y;

    //    GUI.Label(position, content, fontStyle);


    //}

}
