using System;

namespace PuertsStaticWrap
{
    public static class GameUtils_ViewExtensionMethods_Wrap
    {
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8ConstructorCallback))]
        private static IntPtr Constructor(IntPtr isolate, IntPtr info, int paramLen, long data)
        {
            try
            {
                
                Puerts.PuertsDLL.ThrowException(isolate, "invalid arguments to GameUtils.ViewExtensionMethods constructor");
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
            return IntPtr.Zero;
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_MouseButtonDown(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    
                    
                    
                    {
                        
                        var result = GameUtils.ViewExtensionMethods.MouseButtonDown();
                        
                        Puerts.PuertsDLL.ReturnBoolean(isolate, info, result);
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_CameraToRaycastHitObjectClick(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.Camera>(false);
                        var Arg1 = argHelper1.Get<UnityEngine.GameObject>(false);
                        var Arg2 = argHelper2.Get<System.Action>(false);
                        var result = GameUtils.ViewExtensionMethods.CameraToRaycastHitObjectClick(Arg0,Arg1,Arg2);
                        
                        Puerts.PuertsDLL.ReturnBoolean(isolate, info, result);
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_SetChildrenLayer(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.GameObject>(false);
                        var Arg1 = argHelper1.GetString(false);
                        GameUtils.ViewExtensionMethods.SetChildrenLayer(Arg0,Arg1);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_PlaySounds(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    var argHelper3 = new Puerts.ArgumentHelper((int)data, isolate, info, 3);
                    var argHelper4 = new Puerts.ArgumentHelper((int)data, isolate, info, 4);
                    var argHelper5 = new Puerts.ArgumentHelper((int)data, isolate, info, 5);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.GameObject>(false);
                        var Arg1 = argHelper1.GetBoolean(false);
                        var Arg2 = argHelper2.GetString(false);
                        var Arg3 = argHelper3.GetString(false);
                        var Arg4 = argHelper4.GetString(false);
                        var Arg5 = argHelper5.GetFloat(false);
                        GameUtils.ViewExtensionMethods.PlaySounds(Arg0,Arg1,Arg2,Arg3,Arg4,Arg5);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_ClearSounds(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.GameObject>(false);
                        GameUtils.ViewExtensionMethods.ClearSounds(Arg0);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_SetObj2dPos(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.RectTransform>(false);
                        var Arg1 = argHelper1.GetFloat(false);
                        var Arg2 = argHelper2.GetFloat(false);
                        GameUtils.ViewExtensionMethods.SetObj2dPos(Arg0,Arg1,Arg2);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_SetObj3dPos(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    var argHelper3 = new Puerts.ArgumentHelper((int)data, isolate, info, 3);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.Transform>(false);
                        var Arg1 = argHelper1.GetFloat(false);
                        var Arg2 = argHelper2.GetFloat(false);
                        var Arg3 = argHelper3.GetFloat(false);
                        GameUtils.ViewExtensionMethods.SetObj3dPos(Arg0,Arg1,Arg2,Arg3);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_SetObjRotation(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    var argHelper3 = new Puerts.ArgumentHelper((int)data, isolate, info, 3);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.Transform>(false);
                        var Arg1 = argHelper1.GetFloat(false);
                        var Arg2 = argHelper2.GetFloat(false);
                        var Arg3 = argHelper3.GetFloat(false);
                        GameUtils.ViewExtensionMethods.SetObjRotation(Arg0,Arg1,Arg2,Arg3);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_SetObjScale(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    var argHelper3 = new Puerts.ArgumentHelper((int)data, isolate, info, 3);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.Transform>(false);
                        var Arg1 = argHelper1.GetFloat(false);
                        var Arg2 = argHelper2.GetFloat(false);
                        var Arg3 = argHelper3.GetFloat(false);
                        GameUtils.ViewExtensionMethods.SetObjScale(Arg0,Arg1,Arg2,Arg3);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_SetLocalScaleSize(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.Transform>(false);
                        var Arg1 = argHelper1.GetFloat(false);
                        GameUtils.ViewExtensionMethods.SetLocalScaleSize(Arg0,Arg1);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_SetImageColor(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    var argHelper3 = new Puerts.ArgumentHelper((int)data, isolate, info, 3);
                    var argHelper4 = new Puerts.ArgumentHelper((int)data, isolate, info, 4);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.UI.Image>(false);
                        var Arg1 = argHelper1.GetInt32(false);
                        var Arg2 = argHelper2.GetInt32(false);
                        var Arg3 = argHelper3.GetInt32(false);
                        var Arg4 = argHelper4.GetInt32(false);
                        GameUtils.ViewExtensionMethods.SetImageColor(Arg0,Arg1,Arg2,Arg3,Arg4);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_SetLabelColor(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    var argHelper3 = new Puerts.ArgumentHelper((int)data, isolate, info, 3);
                    var argHelper4 = new Puerts.ArgumentHelper((int)data, isolate, info, 4);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.Get<UnityEngine.UI.Text>(false);
                        var Arg1 = argHelper1.GetInt32(false);
                        var Arg2 = argHelper2.GetInt32(false);
                        var Arg3 = argHelper3.GetInt32(false);
                        var Arg4 = argHelper4.GetInt32(false);
                        GameUtils.ViewExtensionMethods.SetLabelColor(Arg0,Arg1,Arg2,Arg3,Arg4);
                        
                        
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_initVec3(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.GetFloat(false);
                        var Arg1 = argHelper1.GetFloat(false);
                        var Arg2 = argHelper2.GetFloat(false);
                        var result = GameUtils.ViewExtensionMethods.initVec3(Arg0,Arg1,Arg2);
                        
                        Puerts.ResultHelper.Set((int)data, isolate, info, result);
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_initVec2(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.GetFloat(false);
                        var Arg1 = argHelper1.GetFloat(false);
                        var result = GameUtils.ViewExtensionMethods.initVec2(Arg0,Arg1);
                        
                        Puerts.ResultHelper.Set((int)data, isolate, info, result);
                        
                    }
                }
                
                
            }
            catch (Exception e)
            {
                Puerts.PuertsDLL.ThrowException(isolate, "c# exception:" + e.Message + ",stack:" + e.StackTrace);
            }
        }
        
        [Puerts.MonoPInvokeCallback(typeof(Puerts.V8FunctionCallback))]
        private static void F_initColor(IntPtr isolate, IntPtr info, IntPtr self, int paramLen, long data)
        {
            try
            {
                
                
                
                {
                    
                    var argHelper0 = new Puerts.ArgumentHelper((int)data, isolate, info, 0);
                    var argHelper1 = new Puerts.ArgumentHelper((int)data, isolate, info, 1);
                    var argHelper2 = new Puerts.ArgumentHelper((int)data, isolate, info, 2);
                    var argHelper3 = new Puerts.ArgumentHelper((int)data, isolate, info, 3);
                    
                    
                    
                    {
                        
                        var Arg0 = argHelper0.GetInt32(false);
                        var Arg1 = argHelper1.GetInt32(false);
                        var Arg2 = argHelper2.GetInt32(false);
                        var Arg3 = argHelper3.GetInt32(false);
                        var result = GameUtils.ViewExtensionMethods.initColor(Arg0,Arg1,Arg2,Arg3);
                        
                        Puerts.ResultHelper.Set((int)data, isolate, info, result);
                        
                    }
                }
                
                
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
                    { new Puerts.MethodKey {Name = "MouseButtonDown", IsStatic = true},  F_MouseButtonDown },
                    { new Puerts.MethodKey {Name = "CameraToRaycastHitObjectClick", IsStatic = true},  F_CameraToRaycastHitObjectClick },
                    { new Puerts.MethodKey {Name = "SetChildrenLayer", IsStatic = true},  F_SetChildrenLayer },
                    { new Puerts.MethodKey {Name = "PlaySounds", IsStatic = true},  F_PlaySounds },
                    { new Puerts.MethodKey {Name = "ClearSounds", IsStatic = true},  F_ClearSounds },
                    { new Puerts.MethodKey {Name = "SetObj2dPos", IsStatic = true},  F_SetObj2dPos },
                    { new Puerts.MethodKey {Name = "SetObj3dPos", IsStatic = true},  F_SetObj3dPos },
                    { new Puerts.MethodKey {Name = "SetObjRotation", IsStatic = true},  F_SetObjRotation },
                    { new Puerts.MethodKey {Name = "SetObjScale", IsStatic = true},  F_SetObjScale },
                    { new Puerts.MethodKey {Name = "SetLocalScaleSize", IsStatic = true},  F_SetLocalScaleSize },
                    { new Puerts.MethodKey {Name = "SetImageColor", IsStatic = true},  F_SetImageColor },
                    { new Puerts.MethodKey {Name = "SetLabelColor", IsStatic = true},  F_SetLabelColor },
                    { new Puerts.MethodKey {Name = "initVec3", IsStatic = true},  F_initVec3 },
                    { new Puerts.MethodKey {Name = "initVec2", IsStatic = true},  F_initVec2 },
                    { new Puerts.MethodKey {Name = "initColor", IsStatic = true},  F_initColor },
                    
                },
                Properties = new System.Collections.Generic.Dictionary<string, Puerts.PropertyRegisterInfo>()
                {
                    
                }
            };
        }
        
    }
}