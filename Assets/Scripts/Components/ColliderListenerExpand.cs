using UnityEngine;
using UnityEditor;
using UnityEngine.UI;
using Spine.Unity;
using Resource;
using System;



namespace GameUtils
{
    public delegate void ColliderDelege(Collider other);

    public delegate void CollisionDelege(Collision collision);

    public delegate void ControllerColliderDelege(ControllerColliderHit collision);
    public class ColliderListenerExpand : MonoBehaviour
    {
        Action timerManager;

        protected Action luaUpdate = null;
        protected Action luaUpdateLate = null;

        public ColliderDelege OnTriggerEnterDelegate;
        public ColliderDelege OnTriggerExitDelegate;
        public ColliderDelege OnTriggerStayDelegate;

        public CollisionDelege OnCollisionEnterDelegate;
        public CollisionDelege OnCollisionExitDelegate;
        public CollisionDelege OnCollisionStayDelegate;

        public ControllerColliderDelege OnControllerColliderHitDelegate;

        void Awake()
        {


        }
        void Update()
        {
        }
        void LateUpdate()
        {
        }

        private void OnTriggerEnter(Collider other)
        {
            //Debug.Log("---OnTriggerEnter----");
            if (OnTriggerEnterDelegate != null)
            {
                OnTriggerEnterDelegate(other);
            }
        }

        private void OnTriggerExit(Collider other)
        {
            //Debug.Log("---OnTriggerExit----");
            if (OnTriggerExitDelegate != null)
            {
                OnTriggerExitDelegate(other);
            }
        }

        private void OnTriggerStay(Collider other)
        {
            if (OnTriggerStayDelegate != null)
            {
                OnTriggerStayDelegate(other);
            }
        }


        private void OnCollisionEnter(Collision collision)
        {
            //Debug.Log("---OnCollisionEnter----");
            if (OnCollisionEnterDelegate != null)
            {
                OnCollisionEnterDelegate(collision);
            }
        }





        private void OnCollisionExit(Collision collision)
        {
            //Debug.Log("---OnCollisionExit----");
            if (OnCollisionExitDelegate != null)
            {
                OnCollisionExitDelegate(collision);
            }
        }

        private void OnCollisionStay(Collision collision)
        {
            //Debug.Log("---OnCollisionStay----");
            if (OnCollisionStayDelegate != null)
            {
                OnCollisionStayDelegate(collision);
            }
        }

        private void OnControllerColliderHit(ControllerColliderHit hit)
        {
            //Debug.Log("---OnCollisionStay----");
            if (OnControllerColliderHitDelegate != null)
            {
                OnControllerColliderHitDelegate(hit);
            }
        }

        public void destoryDelegate()
        {
            OnTriggerEnterDelegate = null;
            OnTriggerExitDelegate = null;
            OnTriggerStayDelegate = null;

            OnCollisionEnterDelegate = null;
            OnCollisionExitDelegate = null;
            OnCollisionStayDelegate = null;

            OnControllerColliderHitDelegate = null;

        }

    }
}
