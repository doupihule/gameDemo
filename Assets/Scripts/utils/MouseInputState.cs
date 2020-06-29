using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using XLua;
using System;

public class MouseInputState : MonoBehaviour
{
    private Vector3 firstMousePosition = Vector3.zero;
    private Vector3 dowmPostion = Vector3.zero;
    private float offset = 2;
    private float moveTimer = 0;
    public int state = 0;
    private Action<float> setSpeed = null;
    public void SetLuaTable(LuaTable FourSoulsUIController)
    {
        setSpeed = FourSoulsUIController.Get<Action<float>>("SetSpeed");
    }
    // Update is called once per frame
    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            state = 0;
            firstMousePosition = Input.mousePosition;
            moveTimer = Time.realtimeSinceStartup;
            dowmPostion = Input.mousePosition;
        }


        if (Input.GetMouseButton(0))
        {
            if (firstMousePosition != Vector3.zero)
            {
                float offset = Input.mousePosition.x - firstMousePosition.x;
                if (offset < -this.offset && state != 1)
                {
                    state = 1;
                    moveTimer = Time.realtimeSinceStartup;
                    dowmPostion = Input.mousePosition;
                    if (setSpeed != null)
                        setSpeed(-1);
                }
                else if (offset > this.offset && state != 2)
                {
                    state = 2;
                    moveTimer = Time.realtimeSinceStartup;
                    dowmPostion = Input.mousePosition;
                    if (setSpeed != null)
                        setSpeed(-1);
                }
                if (Input.mousePosition.x == firstMousePosition.x)
                    state = -1;
            }
            firstMousePosition = Input.mousePosition;
        }

        if (Input.GetMouseButtonUp(0))
        {
            float distance = Vector3.Distance(Input.mousePosition, dowmPostion);
            distance = distance * 0.0004f;
            float timer = Time.realtimeSinceStartup - moveTimer;
            float addSpeed = 2 * distance / timer / timer;
            float speed = distance / timer;// Screen.width;
            if (setSpeed != null)
                setSpeed(addSpeed);
        }

    }
}
