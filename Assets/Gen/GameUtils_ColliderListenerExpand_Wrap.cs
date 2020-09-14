using System;

namespace PuertsStaticWrap
{
    public static class GameUtils_ColliderListenerExpand_Wrap
    {
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8ConstructorCallback))]
        private static IntPtr Constructor(IntPtr isolate, IntPtr info, int paramLen, long data)
        {
            try
            {
                
                
                {
                    
                    
                    
                    
                    {
                        
                        var result = new GameUtils.ColliderListenerExpand();
                        
                        
                        return Puerts.Utils.GetObjectPtr((int)data, typeof(GameUtils.ColliderListenerExpand), result);
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
            return IntPtr.Zero;
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void M_destoryDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                
                
                {
                    
                    
                    
                    
                    {
                        
                        obj.destoryDelegate();
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void G_OnTriggerEnterDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var result = obj.OnTriggerEnterDelegate;
                Puerts.ResultHelper.Set((int)data, isolate, info, result);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void S_OnTriggerEnterDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var argHelper = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                obj.OnTriggerEnterDelegate = argHelper.Get<GameUtils.ColliderDelege>(false);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void G_OnTriggerExitDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var result = obj.OnTriggerExitDelegate;
                Puerts.ResultHelper.Set((int)data, isolate, info, result);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void S_OnTriggerExitDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var argHelper = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                obj.OnTriggerExitDelegate = argHelper.Get<GameUtils.ColliderDelege>(false);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void G_OnTriggerStayDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var result = obj.OnTriggerStayDelegate;
                Puerts.ResultHelper.Set((int)data, isolate, info, result);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void S_OnTriggerStayDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var argHelper = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                obj.OnTriggerStayDelegate = argHelper.Get<GameUtils.ColliderDelege>(false);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void G_OnCollisionEnterDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var result = obj.OnCollisionEnterDelegate;
                Puerts.ResultHelper.Set((int)data, isolate, info, result);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void S_OnCollisionEnterDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var argHelper = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                obj.OnCollisionEnterDelegate = argHelper.Get<GameUtils.CollisionDelege>(false);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void G_OnCollisionExitDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var result = obj.OnCollisionExitDelegate;
                Puerts.ResultHelper.Set((int)data, isolate, info, result);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void S_OnCollisionExitDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var argHelper = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                obj.OnCollisionExitDelegate = argHelper.Get<GameUtils.CollisionDelege>(false);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void G_OnCollisionStayDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var result = obj.OnCollisionStayDelegate;
                Puerts.ResultHelper.Set((int)data, isolate, info, result);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void S_OnCollisionStayDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var argHelper = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                obj.OnCollisionStayDelegate = argHelper.Get<GameUtils.CollisionDelege>(false);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void G_OnControllerColliderHitDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var result = obj.OnControllerColliderHitDelegate;
                Puerts.ResultHelper.Set((int)data, isolate, info, result);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void S_OnControllerColliderHitDelegate(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                var obj = Puerts.Utils.GetSelf((int)data, self) as GameUtils.ColliderListenerExpand;
                var argHelper = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                obj.OnControllerColliderHitDelegate = argHelper.Get<GameUtils.ControllerColliderDelege>(false);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        
        
        
        public static Puerts.TypeRegisterInfo GetRegisterInfo()
        {
            return new Puerts.TypeRegisterInfo()
            {
                BlittableCopy = false,
                Constructor = Constructor,
                Methods = new System.Collections.Generic.Dictionary<Puerts.MethodKey, Puerts.V8FunctionCallback>()
                {
                    { new Puerts.MethodKey {Name = "destoryDelegate", IsStatic = false},  M_destoryDelegate },
                    
                },
                Properties = new System.Collections.Generic.Dictionary<string, Puerts.PropertyRegisterInfo>()
                {
                    {"OnTriggerEnterDelegate", new Puerts.PropertyRegisterInfo(){ IsStatic = false, Getter = G_OnTriggerEnterDelegate, Setter = S_OnTriggerEnterDelegate} },
                    {"OnTriggerExitDelegate", new Puerts.PropertyRegisterInfo(){ IsStatic = false, Getter = G_OnTriggerExitDelegate, Setter = S_OnTriggerExitDelegate} },
                    {"OnTriggerStayDelegate", new Puerts.PropertyRegisterInfo(){ IsStatic = false, Getter = G_OnTriggerStayDelegate, Setter = S_OnTriggerStayDelegate} },
                    {"OnCollisionEnterDelegate", new Puerts.PropertyRegisterInfo(){ IsStatic = false, Getter = G_OnCollisionEnterDelegate, Setter = S_OnCollisionEnterDelegate} },
                    {"OnCollisionExitDelegate", new Puerts.PropertyRegisterInfo(){ IsStatic = false, Getter = G_OnCollisionExitDelegate, Setter = S_OnCollisionExitDelegate} },
                    {"OnCollisionStayDelegate", new Puerts.PropertyRegisterInfo(){ IsStatic = false, Getter = G_OnCollisionStayDelegate, Setter = S_OnCollisionStayDelegate} },
                    {"OnControllerColliderHitDelegate", new Puerts.PropertyRegisterInfo(){ IsStatic = false, Getter = G_OnControllerColliderHitDelegate, Setter = S_OnControllerColliderHitDelegate} },
                    
                }
            };
        }
        
    }
}