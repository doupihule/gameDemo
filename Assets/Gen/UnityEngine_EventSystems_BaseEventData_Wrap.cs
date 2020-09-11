using System;

namespace PuertsStaticWrap
{
    public static class UnityEngine_EventSystems_BaseEventData_Wrap
    {
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8ConstructorCallback))]
        private static IntPtr Constructor(IntPtr isolate, IntPtr info, int paramLen, long data)
        {
            try
            {
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.EventSystems.EventSystem>(false);
                        var result = new UnityEngine.EventSystems.BaseEventData(Arg0);
                        
                        
                        return Puerts.Utils.GetObjectPtr((int)data, typeof(UnityEngine.EventSystems.BaseEventData), result);
                    }
                }
                
                Puerts.PuertsDLL.ThrowException(isolate, "invalid arguments to UnityEngine.EventSystems.BaseEventData constructor");
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
            return IntPtr.Zero;
        }
        
        
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void G_currentInputModule(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                UnityEngine.EventSystems.BaseEventData obj = Puerts.Utils.GetSelf((int)data, self) as UnityEngine.EventSystems.BaseEventData;
                var result = obj.currentInputModule;
                Puerts.ResultHelper.Set((int)data, isolate, info, result);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void G_selectedObject(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                UnityEngine.EventSystems.BaseEventData obj = Puerts.Utils.GetSelf((int)data, self) as UnityEngine.EventSystems.BaseEventData;
                var result = obj.selectedObject;
                Puerts.ResultHelper.Set((int)data, isolate, info, result);
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void S_selectedObject(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                UnityEngine.EventSystems.BaseEventData obj = Puerts.Utils.GetSelf((int)data, self) as UnityEngine.EventSystems.BaseEventData;
                var argHelper = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                obj.selectedObject = argHelper.Get<UnityEngine.GameObject>(false);
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
                    
                },
                Properties = new System.Collections.Generic.Dictionary<string, Puerts.PropertyRegisterInfo>()
                {
                    {"currentInputModule", new Puerts.PropertyRegisterInfo(){ IsStatic = false, Getter = G_currentInputModule, Setter = null} },
                    {"selectedObject", new Puerts.PropertyRegisterInfo(){ IsStatic = false, Getter = G_selectedObject, Setter = S_selectedObject} },
                    
                }
            };
        }
        
    }
}