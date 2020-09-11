// @ts-nocheck
declare module 'csharp' {
    interface $Ref<T> {}
    
    interface $Task<T> {}
    
    namespace System {
        class Object {
            
        }
        class ValueType extends System.Object {
            
        }
        class Void extends System.ValueType {
            
        }
        class Single extends System.ValueType {
            
        }
        class Boolean extends System.ValueType {
            
        }
        class String extends System.Object {
            
        }
        class Array extends System.Object {
            
        }
        class Exception extends System.Object {
            
        }
        class Int32 extends System.ValueType {
            
        }
        class Delegate extends System.Object {
            public Method: System.Reflection.MethodInfo;
            public Target: any;
            public static CreateDelegate(type: System.Type, firstArgument: any, method: System.Reflection.MethodInfo, throwOnBindFailure: boolean):Function;
            public static CreateDelegate(type: System.Type, firstArgument: any, method: System.Reflection.MethodInfo):Function;
            public static CreateDelegate(type: System.Type, method: System.Reflection.MethodInfo, throwOnBindFailure: boolean):Function;
            public static CreateDelegate(type: System.Type, method: System.Reflection.MethodInfo):Function;
            public static CreateDelegate(type: System.Type, target: any, method: string):Function;
            public static CreateDelegate(type: System.Type, target: System.Type, method: string, ignoreCase: boolean, throwOnBindFailure: boolean):Function;
            public static CreateDelegate(type: System.Type, target: System.Type, method: string):Function;
            public static CreateDelegate(type: System.Type, target: System.Type, method: string, ignoreCase: boolean):Function;
            public static CreateDelegate(type: System.Type, target: any, method: string, ignoreCase: boolean, throwOnBindFailure: boolean):Function;
            public static CreateDelegate(type: System.Type, target: any, method: string, ignoreCase: boolean):Function;
            public DynamicInvoke(...args: any[]):any;
            public Clone():any;
            public Equals(obj: any):boolean;
            public GetHashCode():number;
            public GetObjectData(info: System.Runtime.Serialization.SerializationInfo, context: System.Runtime.Serialization.StreamingContext):void;
            public GetInvocationList():Function[];
            public static Combine(a: Function, b: Function):Function;
            public static Combine(...delegates: Function[]):Function;
            public static Remove(source: Function, value: Function):Function;
            public static RemoveAll(source: Function, value: Function):Function;
            public static op_Equality(d1: Function, d2: Function):boolean;
            public static op_Inequality(d1: Function, d2: Function):boolean;
            
        }
        type MulticastDelegate = (...args:any[]) => any;
        var MulticastDelegate: {new (func: (...args:any[]) => any): MulticastDelegate;}
        type Converter$2<TInput,TOutput> = (input: TInput) => TOutput;
        type Predicate$1<T> = (obj: T) => boolean;
        type Action$1<T> = (obj: T) => void;
        type Comparison$1<T> = (x: T, y: T) => number;
        class Enum extends System.ValueType {
            
        }
        class Type extends System.Reflection.MemberInfo {
            
        }
        class UInt32 extends System.ValueType {
            
        }
        class UInt16 extends System.ValueType {
            
        }
        interface IAsyncResult {
            
        }
        type AsyncCallback = (ar: System.IAsyncResult) => void;
        var AsyncCallback: {new (func: (ar: System.IAsyncResult) => void): AsyncCallback;}
        class IntPtr extends System.ValueType {
            
        }
        type Action$2<T1,T2> = (arg1: T1, arg2: T2) => void;
        class Int64 extends System.ValueType {
            
        }
        type Action$3<T1,T2,T3> = (arg1: T1, arg2: T2, arg3: T3) => void;
        class Byte extends System.ValueType {
            
        }
        type Action = () => void;
        var Action: {new (func: () => void): Action;}
        
    }
    namespace UnityEngine {
        class Debug extends System.Object {
            public static unityLogger: UnityEngine.ILogger;
            public static developerConsoleVisible: boolean;
            public static isDebugBuild: boolean;
            public static logger: UnityEngine.ILogger;
            public constructor();
            public static DrawLine(start: UnityEngine.Vector3, end: UnityEngine.Vector3, color: UnityEngine.Color, duration: number):void;
            public static DrawLine(start: UnityEngine.Vector3, end: UnityEngine.Vector3, color: UnityEngine.Color):void;
            public static DrawLine(start: UnityEngine.Vector3, end: UnityEngine.Vector3):void;
            public static DrawLine(start: UnityEngine.Vector3, end: UnityEngine.Vector3, color: UnityEngine.Color, duration: number, depthTest: boolean):void;
            public static DrawRay(start: UnityEngine.Vector3, dir: UnityEngine.Vector3, color: UnityEngine.Color, duration: number):void;
            public static DrawRay(start: UnityEngine.Vector3, dir: UnityEngine.Vector3, color: UnityEngine.Color):void;
            public static DrawRay(start: UnityEngine.Vector3, dir: UnityEngine.Vector3):void;
            public static DrawRay(start: UnityEngine.Vector3, dir: UnityEngine.Vector3, color: UnityEngine.Color, duration: number, depthTest: boolean):void;
            public static Break():void;
            public static DebugBreak():void;
            public static Log(message: any):void;
            public static Log(message: any, context: UnityEngine.Object):void;
            public static LogFormat(format: string, ...args: any[]):void;
            public static LogFormat(context: UnityEngine.Object, format: string, ...args: any[]):void;
            public static LogError(message: any):void;
            public static LogError(message: any, context: UnityEngine.Object):void;
            public static LogErrorFormat(format: string, ...args: any[]):void;
            public static LogErrorFormat(context: UnityEngine.Object, format: string, ...args: any[]):void;
            public static ClearDeveloperConsole():void;
            public static LogException(exception: System.Exception):void;
            public static LogException(exception: System.Exception, context: UnityEngine.Object):void;
            public static LogWarning(message: any):void;
            public static LogWarning(message: any, context: UnityEngine.Object):void;
            public static LogWarningFormat(format: string, ...args: any[]):void;
            public static LogWarningFormat(context: UnityEngine.Object, format: string, ...args: any[]):void;
            public static Assert(condition: boolean):void;
            public static Assert(condition: boolean, context: UnityEngine.Object):void;
            public static Assert(condition: boolean, message: any):void;
            public static Assert(condition: boolean, message: string):void;
            public static Assert(condition: boolean, message: any, context: UnityEngine.Object):void;
            public static Assert(condition: boolean, message: string, context: UnityEngine.Object):void;
            public static AssertFormat(condition: boolean, format: string, ...args: any[]):void;
            public static AssertFormat(condition: boolean, context: UnityEngine.Object, format: string, ...args: any[]):void;
            public static LogAssertion(message: any):void;
            public static LogAssertion(message: any, context: UnityEngine.Object):void;
            public static LogAssertionFormat(format: string, ...args: any[]):void;
            public static LogAssertionFormat(context: UnityEngine.Object, format: string, ...args: any[]):void;
            
        }
        interface ILogger {
            
        }
        class Vector3 extends System.ValueType {
            public static kEpsilon: number;
            public static kEpsilonNormalSqrt: number;
            public x: number;
            public y: number;
            public z: number;
            public Item: number;
            public normalized: UnityEngine.Vector3;
            public magnitude: number;
            public sqrMagnitude: number;
            public static zero: UnityEngine.Vector3;
            public static one: UnityEngine.Vector3;
            public static forward: UnityEngine.Vector3;
            public static back: UnityEngine.Vector3;
            public static up: UnityEngine.Vector3;
            public static down: UnityEngine.Vector3;
            public static left: UnityEngine.Vector3;
            public static right: UnityEngine.Vector3;
            public static positiveInfinity: UnityEngine.Vector3;
            public static negativeInfinity: UnityEngine.Vector3;
            public static fwd: UnityEngine.Vector3;
            public constructor(x: number, y: number, z: number);
            public constructor(x: number, y: number);
            public static Slerp(a: UnityEngine.Vector3, b: UnityEngine.Vector3, t: number):UnityEngine.Vector3;
            public static SlerpUnclamped(a: UnityEngine.Vector3, b: UnityEngine.Vector3, t: number):UnityEngine.Vector3;
            public static OrthoNormalize(normal: $Ref<UnityEngine.Vector3>, tangent: $Ref<UnityEngine.Vector3>):void;
            public static OrthoNormalize(normal: $Ref<UnityEngine.Vector3>, tangent: $Ref<UnityEngine.Vector3>, binormal: $Ref<UnityEngine.Vector3>):void;
            public static RotateTowards(current: UnityEngine.Vector3, target: UnityEngine.Vector3, maxRadiansDelta: number, maxMagnitudeDelta: number):UnityEngine.Vector3;
            public static Lerp(a: UnityEngine.Vector3, b: UnityEngine.Vector3, t: number):UnityEngine.Vector3;
            public static LerpUnclamped(a: UnityEngine.Vector3, b: UnityEngine.Vector3, t: number):UnityEngine.Vector3;
            public static MoveTowards(current: UnityEngine.Vector3, target: UnityEngine.Vector3, maxDistanceDelta: number):UnityEngine.Vector3;
            public static SmoothDamp(current: UnityEngine.Vector3, target: UnityEngine.Vector3, currentVelocity: $Ref<UnityEngine.Vector3>, smoothTime: number, maxSpeed: number):UnityEngine.Vector3;
            public static SmoothDamp(current: UnityEngine.Vector3, target: UnityEngine.Vector3, currentVelocity: $Ref<UnityEngine.Vector3>, smoothTime: number):UnityEngine.Vector3;
            public static SmoothDamp(current: UnityEngine.Vector3, target: UnityEngine.Vector3, currentVelocity: $Ref<UnityEngine.Vector3>, smoothTime: number, maxSpeed: number, deltaTime: number):UnityEngine.Vector3;
            public get_Item(index: number):number;
            public set_Item(index: number, value: number):void;
            public Set(newX: number, newY: number, newZ: number):void;
            public static Scale(a: UnityEngine.Vector3, b: UnityEngine.Vector3):UnityEngine.Vector3;
            public Scale(scale: UnityEngine.Vector3):void;
            public static Cross(lhs: UnityEngine.Vector3, rhs: UnityEngine.Vector3):UnityEngine.Vector3;
            public GetHashCode():number;
            public Equals(other: any):boolean;
            public Equals(other: UnityEngine.Vector3):boolean;
            public static Reflect(inDirection: UnityEngine.Vector3, inNormal: UnityEngine.Vector3):UnityEngine.Vector3;
            public static Normalize(value: UnityEngine.Vector3):UnityEngine.Vector3;
            public Normalize():void;
            public static Dot(lhs: UnityEngine.Vector3, rhs: UnityEngine.Vector3):number;
            public static Project(vector: UnityEngine.Vector3, onNormal: UnityEngine.Vector3):UnityEngine.Vector3;
            public static ProjectOnPlane(vector: UnityEngine.Vector3, planeNormal: UnityEngine.Vector3):UnityEngine.Vector3;
            public static Angle(from: UnityEngine.Vector3, to: UnityEngine.Vector3):number;
            public static SignedAngle(from: UnityEngine.Vector3, to: UnityEngine.Vector3, axis: UnityEngine.Vector3):number;
            public static Distance(a: UnityEngine.Vector3, b: UnityEngine.Vector3):number;
            public static ClampMagnitude(vector: UnityEngine.Vector3, maxLength: number):UnityEngine.Vector3;
            public static Magnitude(vector: UnityEngine.Vector3):number;
            public static SqrMagnitude(vector: UnityEngine.Vector3):number;
            public static Min(lhs: UnityEngine.Vector3, rhs: UnityEngine.Vector3):UnityEngine.Vector3;
            public static Max(lhs: UnityEngine.Vector3, rhs: UnityEngine.Vector3):UnityEngine.Vector3;
            public static op_Addition(a: UnityEngine.Vector3, b: UnityEngine.Vector3):UnityEngine.Vector3;
            public static op_Subtraction(a: UnityEngine.Vector3, b: UnityEngine.Vector3):UnityEngine.Vector3;
            public static op_UnaryNegation(a: UnityEngine.Vector3):UnityEngine.Vector3;
            public static op_Multiply(a: UnityEngine.Vector3, d: number):UnityEngine.Vector3;
            public static op_Multiply(d: number, a: UnityEngine.Vector3):UnityEngine.Vector3;
            public static op_Division(a: UnityEngine.Vector3, d: number):UnityEngine.Vector3;
            public static op_Equality(lhs: UnityEngine.Vector3, rhs: UnityEngine.Vector3):boolean;
            public static op_Inequality(lhs: UnityEngine.Vector3, rhs: UnityEngine.Vector3):boolean;
            public ToString():string;
            public ToString(format: string):string;
            public static AngleBetween(from: UnityEngine.Vector3, to: UnityEngine.Vector3):number;
            public static Exclude(excludeThis: UnityEngine.Vector3, fromThat: UnityEngine.Vector3):UnityEngine.Vector3;
            
        }
        class Color extends System.ValueType {
            
        }
        class Object extends System.Object {
            public name: string;
            public hideFlags: UnityEngine.HideFlags;
            public constructor();
            public GetInstanceID():number;
            public GetHashCode():number;
            public Equals(other: any):boolean;
            public static op_Implicit(exists: UnityEngine.Object):boolean;
            public static Instantiate(original: UnityEngine.Object, position: UnityEngine.Vector3, rotation: UnityEngine.Quaternion):UnityEngine.Object;
            public static Instantiate(original: UnityEngine.Object, position: UnityEngine.Vector3, rotation: UnityEngine.Quaternion, parent: UnityEngine.Transform):UnityEngine.Object;
            public static Instantiate(original: UnityEngine.Object):UnityEngine.Object;
            public static Instantiate(original: UnityEngine.Object, parent: UnityEngine.Transform):UnityEngine.Object;
            public static Instantiate(original: UnityEngine.Object, parent: UnityEngine.Transform, instantiateInWorldSpace: boolean):UnityEngine.Object;
            public static Destroy(obj: UnityEngine.Object, t: number):void;
            public static Destroy(obj: UnityEngine.Object):void;
            public static DestroyImmediate(obj: UnityEngine.Object, allowDestroyingAssets: boolean):void;
            public static DestroyImmediate(obj: UnityEngine.Object):void;
            public static FindObjectsOfType(type: System.Type):UnityEngine.Object[];
            public static DontDestroyOnLoad(target: UnityEngine.Object):void;
            public static DestroyObject(obj: UnityEngine.Object, t: number):void;
            public static DestroyObject(obj: UnityEngine.Object):void;
            public static FindSceneObjectsOfType(type: System.Type):UnityEngine.Object[];
            public static FindObjectsOfTypeIncludingAssets(type: System.Type):UnityEngine.Object[];
            public static FindObjectsOfTypeAll(type: System.Type):UnityEngine.Object[];
            public static FindObjectOfType(type: System.Type):UnityEngine.Object;
            public ToString():string;
            public static op_Equality(x: UnityEngine.Object, y: UnityEngine.Object):boolean;
            public static op_Inequality(x: UnityEngine.Object, y: UnityEngine.Object):boolean;
            
        }
        class Vector2 extends System.ValueType {
            public x: number;
            public y: number;
            public static kEpsilon: number;
            public static kEpsilonNormalSqrt: number;
            public Item: number;
            public normalized: UnityEngine.Vector2;
            public magnitude: number;
            public sqrMagnitude: number;
            public static zero: UnityEngine.Vector2;
            public static one: UnityEngine.Vector2;
            public static up: UnityEngine.Vector2;
            public static down: UnityEngine.Vector2;
            public static left: UnityEngine.Vector2;
            public static right: UnityEngine.Vector2;
            public static positiveInfinity: UnityEngine.Vector2;
            public static negativeInfinity: UnityEngine.Vector2;
            public constructor(x: number, y: number);
            public get_Item(index: number):number;
            public set_Item(index: number, value: number):void;
            public Set(newX: number, newY: number):void;
            public static Lerp(a: UnityEngine.Vector2, b: UnityEngine.Vector2, t: number):UnityEngine.Vector2;
            public static LerpUnclamped(a: UnityEngine.Vector2, b: UnityEngine.Vector2, t: number):UnityEngine.Vector2;
            public static MoveTowards(current: UnityEngine.Vector2, target: UnityEngine.Vector2, maxDistanceDelta: number):UnityEngine.Vector2;
            public static Scale(a: UnityEngine.Vector2, b: UnityEngine.Vector2):UnityEngine.Vector2;
            public Scale(scale: UnityEngine.Vector2):void;
            public Normalize():void;
            public ToString():string;
            public ToString(format: string):string;
            public GetHashCode():number;
            public Equals(other: any):boolean;
            public Equals(other: UnityEngine.Vector2):boolean;
            public static Reflect(inDirection: UnityEngine.Vector2, inNormal: UnityEngine.Vector2):UnityEngine.Vector2;
            public static Perpendicular(inDirection: UnityEngine.Vector2):UnityEngine.Vector2;
            public static Dot(lhs: UnityEngine.Vector2, rhs: UnityEngine.Vector2):number;
            public static Angle(from: UnityEngine.Vector2, to: UnityEngine.Vector2):number;
            public static SignedAngle(from: UnityEngine.Vector2, to: UnityEngine.Vector2):number;
            public static Distance(a: UnityEngine.Vector2, b: UnityEngine.Vector2):number;
            public static ClampMagnitude(vector: UnityEngine.Vector2, maxLength: number):UnityEngine.Vector2;
            public static SqrMagnitude(a: UnityEngine.Vector2):number;
            public SqrMagnitude():number;
            public static Min(lhs: UnityEngine.Vector2, rhs: UnityEngine.Vector2):UnityEngine.Vector2;
            public static Max(lhs: UnityEngine.Vector2, rhs: UnityEngine.Vector2):UnityEngine.Vector2;
            public static SmoothDamp(current: UnityEngine.Vector2, target: UnityEngine.Vector2, currentVelocity: $Ref<UnityEngine.Vector2>, smoothTime: number, maxSpeed: number):UnityEngine.Vector2;
            public static SmoothDamp(current: UnityEngine.Vector2, target: UnityEngine.Vector2, currentVelocity: $Ref<UnityEngine.Vector2>, smoothTime: number):UnityEngine.Vector2;
            public static SmoothDamp(current: UnityEngine.Vector2, target: UnityEngine.Vector2, currentVelocity: $Ref<UnityEngine.Vector2>, smoothTime: number, maxSpeed: number, deltaTime: number):UnityEngine.Vector2;
            public static op_Addition(a: UnityEngine.Vector2, b: UnityEngine.Vector2):UnityEngine.Vector2;
            public static op_Subtraction(a: UnityEngine.Vector2, b: UnityEngine.Vector2):UnityEngine.Vector2;
            public static op_Multiply(a: UnityEngine.Vector2, b: UnityEngine.Vector2):UnityEngine.Vector2;
            public static op_Division(a: UnityEngine.Vector2, b: UnityEngine.Vector2):UnityEngine.Vector2;
            public static op_UnaryNegation(a: UnityEngine.Vector2):UnityEngine.Vector2;
            public static op_Multiply(a: UnityEngine.Vector2, d: number):UnityEngine.Vector2;
            public static op_Multiply(d: number, a: UnityEngine.Vector2):UnityEngine.Vector2;
            public static op_Division(a: UnityEngine.Vector2, d: number):UnityEngine.Vector2;
            public static op_Equality(lhs: UnityEngine.Vector2, rhs: UnityEngine.Vector2):boolean;
            public static op_Inequality(lhs: UnityEngine.Vector2, rhs: UnityEngine.Vector2):boolean;
            public static op_Implicit(v: UnityEngine.Vector3):UnityEngine.Vector2;
            public static op_Implicit(v: UnityEngine.Vector2):UnityEngine.Vector3;
            
        }
        class Time extends System.Object {
            public static time: number;
            public static timeSinceLevelLoad: number;
            public static deltaTime: number;
            public static fixedTime: number;
            public static unscaledTime: number;
            public static fixedUnscaledTime: number;
            public static unscaledDeltaTime: number;
            public static fixedUnscaledDeltaTime: number;
            public static fixedDeltaTime: number;
            public static maximumDeltaTime: number;
            public static smoothDeltaTime: number;
            public static maximumParticleDeltaTime: number;
            public static timeScale: number;
            public static frameCount: number;
            public static renderedFrameCount: number;
            public static realtimeSinceStartup: number;
            public static captureFramerate: number;
            public static inFixedTimeStep: boolean;
            public constructor();
            
        }
        class Component extends UnityEngine.Object {
            public transform: UnityEngine.Transform;
            public gameObject: UnityEngine.GameObject;
            public tag: string;
            public constructor();
            public GetComponent(type: System.Type):UnityEngine.Component;
            public GetComponent(type: string):UnityEngine.Component;
            public GetComponentInChildren(t: System.Type, includeInactive: boolean):UnityEngine.Component;
            public GetComponentInChildren(t: System.Type):UnityEngine.Component;
            public GetComponentsInChildren(t: System.Type, includeInactive: boolean):UnityEngine.Component[];
            public GetComponentsInChildren(t: System.Type):UnityEngine.Component[];
            public GetComponentInParent(t: System.Type):UnityEngine.Component;
            public GetComponentsInParent(t: System.Type, includeInactive: boolean):UnityEngine.Component[];
            public GetComponentsInParent(t: System.Type):UnityEngine.Component[];
            public GetComponents(type: System.Type):UnityEngine.Component[];
            public GetComponents(type: System.Type, results: System.Collections.Generic.List$1<UnityEngine.Component>):void;
            public CompareTag(tag: string):boolean;
            public SendMessageUpwards(methodName: string, value: any, options: UnityEngine.SendMessageOptions):void;
            public SendMessageUpwards(methodName: string, value: any):void;
            public SendMessageUpwards(methodName: string):void;
            public SendMessageUpwards(methodName: string, options: UnityEngine.SendMessageOptions):void;
            public SendMessage(methodName: string, value: any):void;
            public SendMessage(methodName: string):void;
            public SendMessage(methodName: string, value: any, options: UnityEngine.SendMessageOptions):void;
            public SendMessage(methodName: string, options: UnityEngine.SendMessageOptions):void;
            public BroadcastMessage(methodName: string, parameter: any, options: UnityEngine.SendMessageOptions):void;
            public BroadcastMessage(methodName: string, parameter: any):void;
            public BroadcastMessage(methodName: string):void;
            public BroadcastMessage(methodName: string, options: UnityEngine.SendMessageOptions):void;
            
        }
        class Transform extends UnityEngine.Component {
            public position: UnityEngine.Vector3;
            public localPosition: UnityEngine.Vector3;
            public eulerAngles: UnityEngine.Vector3;
            public localEulerAngles: UnityEngine.Vector3;
            public right: UnityEngine.Vector3;
            public up: UnityEngine.Vector3;
            public forward: UnityEngine.Vector3;
            public rotation: UnityEngine.Quaternion;
            public localRotation: UnityEngine.Quaternion;
            public localScale: UnityEngine.Vector3;
            public parent: UnityEngine.Transform;
            public worldToLocalMatrix: UnityEngine.Matrix4x4;
            public localToWorldMatrix: UnityEngine.Matrix4x4;
            public root: UnityEngine.Transform;
            public childCount: number;
            public lossyScale: UnityEngine.Vector3;
            public hasChanged: boolean;
            public hierarchyCapacity: number;
            public hierarchyCount: number;
            public SetParent(p: UnityEngine.Transform):void;
            public SetParent(parent: UnityEngine.Transform, worldPositionStays: boolean):void;
            public SetPositionAndRotation(position: UnityEngine.Vector3, rotation: UnityEngine.Quaternion):void;
            public Translate(translation: UnityEngine.Vector3, relativeTo: UnityEngine.Space):void;
            public Translate(translation: UnityEngine.Vector3):void;
            public Translate(x: number, y: number, z: number, relativeTo: UnityEngine.Space):void;
            public Translate(x: number, y: number, z: number):void;
            public Translate(translation: UnityEngine.Vector3, relativeTo: UnityEngine.Transform):void;
            public Translate(x: number, y: number, z: number, relativeTo: UnityEngine.Transform):void;
            public Rotate(eulers: UnityEngine.Vector3, relativeTo: UnityEngine.Space):void;
            public Rotate(eulers: UnityEngine.Vector3):void;
            public Rotate(xAngle: number, yAngle: number, zAngle: number, relativeTo: UnityEngine.Space):void;
            public Rotate(xAngle: number, yAngle: number, zAngle: number):void;
            public Rotate(axis: UnityEngine.Vector3, angle: number, relativeTo: UnityEngine.Space):void;
            public Rotate(axis: UnityEngine.Vector3, angle: number):void;
            public RotateAround(point: UnityEngine.Vector3, axis: UnityEngine.Vector3, angle: number):void;
            public LookAt(target: UnityEngine.Transform, worldUp: UnityEngine.Vector3):void;
            public LookAt(target: UnityEngine.Transform):void;
            public LookAt(worldPosition: UnityEngine.Vector3, worldUp: UnityEngine.Vector3):void;
            public LookAt(worldPosition: UnityEngine.Vector3):void;
            public TransformDirection(direction: UnityEngine.Vector3):UnityEngine.Vector3;
            public TransformDirection(x: number, y: number, z: number):UnityEngine.Vector3;
            public InverseTransformDirection(direction: UnityEngine.Vector3):UnityEngine.Vector3;
            public InverseTransformDirection(x: number, y: number, z: number):UnityEngine.Vector3;
            public TransformVector(vector: UnityEngine.Vector3):UnityEngine.Vector3;
            public TransformVector(x: number, y: number, z: number):UnityEngine.Vector3;
            public InverseTransformVector(vector: UnityEngine.Vector3):UnityEngine.Vector3;
            public InverseTransformVector(x: number, y: number, z: number):UnityEngine.Vector3;
            public TransformPoint(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public TransformPoint(x: number, y: number, z: number):UnityEngine.Vector3;
            public InverseTransformPoint(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public InverseTransformPoint(x: number, y: number, z: number):UnityEngine.Vector3;
            public DetachChildren():void;
            public SetAsFirstSibling():void;
            public SetAsLastSibling():void;
            public SetSiblingIndex(index: number):void;
            public GetSiblingIndex():number;
            public Find(n: string):UnityEngine.Transform;
            public IsChildOf(parent: UnityEngine.Transform):boolean;
            public FindChild(n: string):UnityEngine.Transform;
            public GetEnumerator():System.Collections.IEnumerator;
            public RotateAround(axis: UnityEngine.Vector3, angle: number):void;
            public RotateAroundLocal(axis: UnityEngine.Vector3, angle: number):void;
            public GetChild(index: number):UnityEngine.Transform;
            public GetChildCount():number;
            
        }
        class Quaternion extends System.ValueType {
            public x: number;
            public y: number;
            public z: number;
            public w: number;
            public static kEpsilon: number;
            public Item: number;
            public static identity: UnityEngine.Quaternion;
            public eulerAngles: UnityEngine.Vector3;
            public normalized: UnityEngine.Quaternion;
            public constructor(x: number, y: number, z: number, w: number);
            public static FromToRotation(fromDirection: UnityEngine.Vector3, toDirection: UnityEngine.Vector3):UnityEngine.Quaternion;
            public static Inverse(rotation: UnityEngine.Quaternion):UnityEngine.Quaternion;
            public static Slerp(a: UnityEngine.Quaternion, b: UnityEngine.Quaternion, t: number):UnityEngine.Quaternion;
            public static SlerpUnclamped(a: UnityEngine.Quaternion, b: UnityEngine.Quaternion, t: number):UnityEngine.Quaternion;
            public static Lerp(a: UnityEngine.Quaternion, b: UnityEngine.Quaternion, t: number):UnityEngine.Quaternion;
            public static LerpUnclamped(a: UnityEngine.Quaternion, b: UnityEngine.Quaternion, t: number):UnityEngine.Quaternion;
            public static AngleAxis(angle: number, axis: UnityEngine.Vector3):UnityEngine.Quaternion;
            public static LookRotation(forward: UnityEngine.Vector3, upwards: UnityEngine.Vector3):UnityEngine.Quaternion;
            public static LookRotation(forward: UnityEngine.Vector3):UnityEngine.Quaternion;
            public get_Item(index: number):number;
            public set_Item(index: number, value: number):void;
            public Set(newX: number, newY: number, newZ: number, newW: number):void;
            public static op_Multiply(lhs: UnityEngine.Quaternion, rhs: UnityEngine.Quaternion):UnityEngine.Quaternion;
            public static op_Multiply(rotation: UnityEngine.Quaternion, point: UnityEngine.Vector3):UnityEngine.Vector3;
            public static op_Equality(lhs: UnityEngine.Quaternion, rhs: UnityEngine.Quaternion):boolean;
            public static op_Inequality(lhs: UnityEngine.Quaternion, rhs: UnityEngine.Quaternion):boolean;
            public static Dot(a: UnityEngine.Quaternion, b: UnityEngine.Quaternion):number;
            public SetLookRotation(view: UnityEngine.Vector3):void;
            public SetLookRotation(view: UnityEngine.Vector3, up: UnityEngine.Vector3):void;
            public static Angle(a: UnityEngine.Quaternion, b: UnityEngine.Quaternion):number;
            public static Euler(x: number, y: number, z: number):UnityEngine.Quaternion;
            public static Euler(euler: UnityEngine.Vector3):UnityEngine.Quaternion;
            public ToAngleAxis(angle: $Ref<number>, axis: $Ref<UnityEngine.Vector3>):void;
            public SetFromToRotation(fromDirection: UnityEngine.Vector3, toDirection: UnityEngine.Vector3):void;
            public static RotateTowards(from: UnityEngine.Quaternion, to: UnityEngine.Quaternion, maxDegreesDelta: number):UnityEngine.Quaternion;
            public static Normalize(q: UnityEngine.Quaternion):UnityEngine.Quaternion;
            public Normalize():void;
            public GetHashCode():number;
            public Equals(other: any):boolean;
            public Equals(other: UnityEngine.Quaternion):boolean;
            public ToString():string;
            public ToString(format: string):string;
            public static EulerRotation(x: number, y: number, z: number):UnityEngine.Quaternion;
            public static EulerRotation(euler: UnityEngine.Vector3):UnityEngine.Quaternion;
            public SetEulerRotation(x: number, y: number, z: number):void;
            public SetEulerRotation(euler: UnityEngine.Vector3):void;
            public ToEuler():UnityEngine.Vector3;
            public static EulerAngles(x: number, y: number, z: number):UnityEngine.Quaternion;
            public static EulerAngles(euler: UnityEngine.Vector3):UnityEngine.Quaternion;
            public ToAxisAngle(axis: $Ref<UnityEngine.Vector3>, angle: $Ref<number>):void;
            public SetEulerAngles(x: number, y: number, z: number):void;
            public SetEulerAngles(euler: UnityEngine.Vector3):void;
            public static ToEulerAngles(rotation: UnityEngine.Quaternion):UnityEngine.Vector3;
            public ToEulerAngles():UnityEngine.Vector3;
            public SetAxisAngle(axis: UnityEngine.Vector3, angle: number):void;
            public static AxisAngle(axis: UnityEngine.Vector3, angle: number):UnityEngine.Quaternion;
            
        }
        class Matrix4x4 extends System.ValueType {
            
        }
        enum Space { World = 0, Self = 1 }
        class RectTransform extends UnityEngine.Transform {
            public rect: UnityEngine.Rect;
            public anchorMin: UnityEngine.Vector2;
            public anchorMax: UnityEngine.Vector2;
            public anchoredPosition: UnityEngine.Vector2;
            public sizeDelta: UnityEngine.Vector2;
            public pivot: UnityEngine.Vector2;
            public anchoredPosition3D: UnityEngine.Vector3;
            public offsetMin: UnityEngine.Vector2;
            public offsetMax: UnityEngine.Vector2;
            public constructor();
            public static add_reapplyDrivenProperties(value: UnityEngine.RectTransform.ReapplyDrivenProperties):void;
            public static remove_reapplyDrivenProperties(value: UnityEngine.RectTransform.ReapplyDrivenProperties):void;
            public ForceUpdateRectTransforms():void;
            public GetLocalCorners(fourCornersArray: UnityEngine.Vector3[]):void;
            public GetWorldCorners(fourCornersArray: UnityEngine.Vector3[]):void;
            public SetInsetAndSizeFromParentEdge(edge: UnityEngine.RectTransform.Edge, inset: number, size: number):void;
            public SetSizeWithCurrentAnchors(axis: UnityEngine.RectTransform.Axis, size: number):void;
            
        }
        class Rect extends System.ValueType {
            
        }
        class GameObject extends UnityEngine.Object {
            public transform: UnityEngine.Transform;
            public layer: number;
            public active: boolean;
            public activeSelf: boolean;
            public activeInHierarchy: boolean;
            public isStatic: boolean;
            public tag: string;
            public scene: UnityEngine.SceneManagement.Scene;
            public gameObject: UnityEngine.GameObject;
            public constructor(name: string);
            public constructor();
            public constructor(name: string, ...components: System.Type[]);
            public static CreatePrimitive(type: UnityEngine.PrimitiveType):UnityEngine.GameObject;
            public GetComponent(type: System.Type):UnityEngine.Component;
            public GetComponent(type: string):UnityEngine.Component;
            public GetComponentInChildren(type: System.Type, includeInactive: boolean):UnityEngine.Component;
            public GetComponentInChildren(type: System.Type):UnityEngine.Component;
            public GetComponentInParent(type: System.Type):UnityEngine.Component;
            public GetComponents(type: System.Type):UnityEngine.Component[];
            public GetComponents(type: System.Type, results: System.Collections.Generic.List$1<UnityEngine.Component>):void;
            public GetComponentsInChildren(type: System.Type):UnityEngine.Component[];
            public GetComponentsInChildren(type: System.Type, includeInactive: boolean):UnityEngine.Component[];
            public GetComponentsInParent(type: System.Type):UnityEngine.Component[];
            public GetComponentsInParent(type: System.Type, includeInactive: boolean):UnityEngine.Component[];
            public static FindWithTag(tag: string):UnityEngine.GameObject;
            public SendMessageUpwards(methodName: string, options: UnityEngine.SendMessageOptions):void;
            public SendMessage(methodName: string, options: UnityEngine.SendMessageOptions):void;
            public BroadcastMessage(methodName: string, options: UnityEngine.SendMessageOptions):void;
            public AddComponent(componentType: System.Type):UnityEngine.Component;
            public SetActive(value: boolean):void;
            public SetActiveRecursively(state: boolean):void;
            public CompareTag(tag: string):boolean;
            public static FindGameObjectWithTag(tag: string):UnityEngine.GameObject;
            public static FindGameObjectsWithTag(tag: string):UnityEngine.GameObject[];
            public SendMessageUpwards(methodName: string, value: any, options: UnityEngine.SendMessageOptions):void;
            public SendMessageUpwards(methodName: string, value: any):void;
            public SendMessageUpwards(methodName: string):void;
            public SendMessage(methodName: string, value: any, options: UnityEngine.SendMessageOptions):void;
            public SendMessage(methodName: string, value: any):void;
            public SendMessage(methodName: string):void;
            public BroadcastMessage(methodName: string, parameter: any, options: UnityEngine.SendMessageOptions):void;
            public BroadcastMessage(methodName: string, parameter: any):void;
            public BroadcastMessage(methodName: string):void;
            public static Find(name: string):UnityEngine.GameObject;
            
        }
        enum SendMessageOptions { RequireReceiver = 0, DontRequireReceiver = 1 }
        class Renderer extends UnityEngine.Component {
            public castShadows: boolean;
            public motionVectors: boolean;
            public useLightProbes: boolean;
            public bounds: UnityEngine.Bounds;
            public enabled: boolean;
            public isVisible: boolean;
            public shadowCastingMode: UnityEngine.Rendering.ShadowCastingMode;
            public receiveShadows: boolean;
            public motionVectorGenerationMode: UnityEngine.MotionVectorGenerationMode;
            public lightProbeUsage: UnityEngine.Rendering.LightProbeUsage;
            public reflectionProbeUsage: UnityEngine.Rendering.ReflectionProbeUsage;
            public renderingLayerMask: number;
            public rendererPriority: number;
            public sortingLayerName: string;
            public sortingLayerID: number;
            public sortingOrder: number;
            public allowOcclusionWhenDynamic: boolean;
            public isPartOfStaticBatch: boolean;
            public worldToLocalMatrix: UnityEngine.Matrix4x4;
            public localToWorldMatrix: UnityEngine.Matrix4x4;
            public lightProbeProxyVolumeOverride: UnityEngine.GameObject;
            public probeAnchor: UnityEngine.Transform;
            public lightmapIndex: number;
            public realtimeLightmapIndex: number;
            public lightmapScaleOffset: UnityEngine.Vector4;
            public realtimeLightmapScaleOffset: UnityEngine.Vector4;
            public materials: UnityEngine.Material[];
            public material: UnityEngine.Material;
            public sharedMaterial: UnityEngine.Material;
            public sharedMaterials: UnityEngine.Material[];
            public constructor();
            public HasPropertyBlock():boolean;
            public SetPropertyBlock(properties: UnityEngine.MaterialPropertyBlock):void;
            public SetPropertyBlock(properties: UnityEngine.MaterialPropertyBlock, materialIndex: number):void;
            public GetPropertyBlock(properties: UnityEngine.MaterialPropertyBlock):void;
            public GetPropertyBlock(properties: UnityEngine.MaterialPropertyBlock, materialIndex: number):void;
            public GetMaterials(m: System.Collections.Generic.List$1<UnityEngine.Material>):void;
            public GetSharedMaterials(m: System.Collections.Generic.List$1<UnityEngine.Material>):void;
            public GetClosestReflectionProbes(result: System.Collections.Generic.List$1<UnityEngine.Rendering.ReflectionProbeBlendInfo>):void;
            
        }
        class Vector4 extends System.ValueType {
            
        }
        class Bounds extends System.ValueType {
            
        }
        class MaterialPropertyBlock extends System.Object {
            
        }
        enum MotionVectorGenerationMode { Camera = 0, Object = 1, ForceNoMotion = 2 }
        class Material extends UnityEngine.Object {
            
        }
        enum PrimitiveType { Sphere = 0, Capsule = 1, Cylinder = 2, Cube = 3, Plane = 4, Quad = 5 }
        enum HideFlags { None = 0, HideInHierarchy = 1, HideInInspector = 2, DontSaveInEditor = 4, NotEditable = 8, DontSaveInBuild = 16, DontUnloadUnusedAsset = 32, DontSave = 52, HideAndDontSave = 61 }
        class Behaviour extends UnityEngine.Component {
            
        }
        class CanvasGroup extends UnityEngine.Behaviour {
            public alpha: number;
            public interactable: boolean;
            public blocksRaycasts: boolean;
            public ignoreParentGroups: boolean;
            public constructor();
            public IsRaycastLocationValid(sp: UnityEngine.Vector2, eventCamera: UnityEngine.Camera):boolean;
            
        }
        class Camera extends UnityEngine.Behaviour {
            public static onPreCull: UnityEngine.Camera.CameraCallback;
            public static onPreRender: UnityEngine.Camera.CameraCallback;
            public static onPostRender: UnityEngine.Camera.CameraCallback;
            public nearClipPlane: number;
            public farClipPlane: number;
            public fieldOfView: number;
            public renderingPath: UnityEngine.RenderingPath;
            public actualRenderingPath: UnityEngine.RenderingPath;
            public allowHDR: boolean;
            public allowMSAA: boolean;
            public allowDynamicResolution: boolean;
            public forceIntoRenderTexture: boolean;
            public orthographicSize: number;
            public orthographic: boolean;
            public opaqueSortMode: UnityEngine.Rendering.OpaqueSortMode;
            public transparencySortMode: UnityEngine.TransparencySortMode;
            public transparencySortAxis: UnityEngine.Vector3;
            public depth: number;
            public aspect: number;
            public velocity: UnityEngine.Vector3;
            public cullingMask: number;
            public eventMask: number;
            public layerCullSpherical: boolean;
            public cameraType: UnityEngine.CameraType;
            public layerCullDistances: number[];
            public useOcclusionCulling: boolean;
            public cullingMatrix: UnityEngine.Matrix4x4;
            public backgroundColor: UnityEngine.Color;
            public clearFlags: UnityEngine.CameraClearFlags;
            public depthTextureMode: UnityEngine.DepthTextureMode;
            public clearStencilAfterLightingPass: boolean;
            public usePhysicalProperties: boolean;
            public sensorSize: UnityEngine.Vector2;
            public lensShift: UnityEngine.Vector2;
            public focalLength: number;
            public gateFit: UnityEngine.Camera.GateFitMode;
            public rect: UnityEngine.Rect;
            public pixelRect: UnityEngine.Rect;
            public pixelWidth: number;
            public pixelHeight: number;
            public scaledPixelWidth: number;
            public scaledPixelHeight: number;
            public targetTexture: UnityEngine.RenderTexture;
            public activeTexture: UnityEngine.RenderTexture;
            public targetDisplay: number;
            public cameraToWorldMatrix: UnityEngine.Matrix4x4;
            public worldToCameraMatrix: UnityEngine.Matrix4x4;
            public projectionMatrix: UnityEngine.Matrix4x4;
            public nonJitteredProjectionMatrix: UnityEngine.Matrix4x4;
            public useJitteredProjectionMatrixForTransparentRendering: boolean;
            public previousViewProjectionMatrix: UnityEngine.Matrix4x4;
            public static main: UnityEngine.Camera;
            public static current: UnityEngine.Camera;
            public scene: UnityEngine.SceneManagement.Scene;
            public stereoEnabled: boolean;
            public stereoSeparation: number;
            public stereoConvergence: number;
            public areVRStereoViewMatricesWithinSingleCullTolerance: boolean;
            public stereoTargetEye: UnityEngine.StereoTargetEyeMask;
            public stereoActiveEye: UnityEngine.Camera.MonoOrStereoscopicEye;
            public static allCamerasCount: number;
            public static allCameras: UnityEngine.Camera[];
            public commandBufferCount: number;
            public near: number;
            public far: number;
            public fov: number;
            public hdr: boolean;
            public constructor();
            public Reset():void;
            public ResetTransparencySortSettings():void;
            public ResetAspect():void;
            public ResetCullingMatrix():void;
            public SetReplacementShader(shader: UnityEngine.Shader, replacementTag: string):void;
            public ResetReplacementShader():void;
            public SetTargetBuffers(colorBuffer: UnityEngine.RenderBuffer, depthBuffer: UnityEngine.RenderBuffer):void;
            public SetTargetBuffers(colorBuffer: UnityEngine.RenderBuffer[], depthBuffer: UnityEngine.RenderBuffer):void;
            public ResetWorldToCameraMatrix():void;
            public ResetProjectionMatrix():void;
            public CalculateObliqueMatrix(clipPlane: UnityEngine.Vector4):UnityEngine.Matrix4x4;
            public WorldToScreenPoint(position: UnityEngine.Vector3, eye: UnityEngine.Camera.MonoOrStereoscopicEye):UnityEngine.Vector3;
            public WorldToViewportPoint(position: UnityEngine.Vector3, eye: UnityEngine.Camera.MonoOrStereoscopicEye):UnityEngine.Vector3;
            public ViewportToWorldPoint(position: UnityEngine.Vector3, eye: UnityEngine.Camera.MonoOrStereoscopicEye):UnityEngine.Vector3;
            public ScreenToWorldPoint(position: UnityEngine.Vector3, eye: UnityEngine.Camera.MonoOrStereoscopicEye):UnityEngine.Vector3;
            public WorldToScreenPoint(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public WorldToViewportPoint(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public ViewportToWorldPoint(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public ScreenToWorldPoint(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public ScreenToViewportPoint(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public ViewportToScreenPoint(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public ViewportPointToRay(pos: UnityEngine.Vector3, eye: UnityEngine.Camera.MonoOrStereoscopicEye):UnityEngine.Ray;
            public ViewportPointToRay(pos: UnityEngine.Vector3):UnityEngine.Ray;
            public ScreenPointToRay(pos: UnityEngine.Vector3, eye: UnityEngine.Camera.MonoOrStereoscopicEye):UnityEngine.Ray;
            public ScreenPointToRay(pos: UnityEngine.Vector3):UnityEngine.Ray;
            public CalculateFrustumCorners(viewport: UnityEngine.Rect, z: number, eye: UnityEngine.Camera.MonoOrStereoscopicEye, outCorners: UnityEngine.Vector3[]):void;
            public static CalculateProjectionMatrixFromPhysicalProperties(output: $Ref<UnityEngine.Matrix4x4>, focalLength: number, sensorSize: UnityEngine.Vector2, lensShift: UnityEngine.Vector2, nearClip: number, farClip: number, gateFitParameters: UnityEngine.Camera.GateFitParameters):void;
            public static FocalLengthToFOV(focalLength: number, sensorSize: number):number;
            public static FOVToFocalLength(fov: number, sensorSize: number):number;
            public GetStereoNonJitteredProjectionMatrix(eye: UnityEngine.Camera.StereoscopicEye):UnityEngine.Matrix4x4;
            public GetStereoViewMatrix(eye: UnityEngine.Camera.StereoscopicEye):UnityEngine.Matrix4x4;
            public CopyStereoDeviceProjectionMatrixToNonJittered(eye: UnityEngine.Camera.StereoscopicEye):void;
            public GetStereoProjectionMatrix(eye: UnityEngine.Camera.StereoscopicEye):UnityEngine.Matrix4x4;
            public SetStereoProjectionMatrix(eye: UnityEngine.Camera.StereoscopicEye, matrix: UnityEngine.Matrix4x4):void;
            public ResetStereoProjectionMatrices():void;
            public SetStereoViewMatrix(eye: UnityEngine.Camera.StereoscopicEye, matrix: UnityEngine.Matrix4x4):void;
            public ResetStereoViewMatrices():void;
            public static GetAllCameras(cameras: UnityEngine.Camera[]):number;
            public RenderToCubemap(cubemap: UnityEngine.Cubemap, faceMask: number):boolean;
            public RenderToCubemap(cubemap: UnityEngine.Cubemap):boolean;
            public RenderToCubemap(cubemap: UnityEngine.RenderTexture, faceMask: number):boolean;
            public RenderToCubemap(cubemap: UnityEngine.RenderTexture):boolean;
            public RenderToCubemap(cubemap: UnityEngine.RenderTexture, faceMask: number, stereoEye: UnityEngine.Camera.MonoOrStereoscopicEye):boolean;
            public Render():void;
            public RenderWithShader(shader: UnityEngine.Shader, replacementTag: string):void;
            public RenderDontRestore():void;
            public static SetupCurrent(cur: UnityEngine.Camera):void;
            public CopyFrom(other: UnityEngine.Camera):void;
            public RemoveCommandBuffers(evt: UnityEngine.Rendering.CameraEvent):void;
            public RemoveAllCommandBuffers():void;
            public AddCommandBuffer(evt: UnityEngine.Rendering.CameraEvent, buffer: UnityEngine.Rendering.CommandBuffer):void;
            public AddCommandBufferAsync(evt: UnityEngine.Rendering.CameraEvent, buffer: UnityEngine.Rendering.CommandBuffer, queueType: UnityEngine.Rendering.ComputeQueueType):void;
            public RemoveCommandBuffer(evt: UnityEngine.Rendering.CameraEvent, buffer: UnityEngine.Rendering.CommandBuffer):void;
            public GetCommandBuffers(evt: UnityEngine.Rendering.CameraEvent):UnityEngine.Rendering.CommandBuffer[];
            
        }
        class MonoBehaviour extends UnityEngine.Behaviour {
            
        }
        class Sprite extends UnityEngine.Object {
            public bounds: UnityEngine.Bounds;
            public rect: UnityEngine.Rect;
            public border: UnityEngine.Vector4;
            public texture: UnityEngine.Texture2D;
            public pixelsPerUnit: number;
            public associatedAlphaSplitTexture: UnityEngine.Texture2D;
            public pivot: UnityEngine.Vector2;
            public packed: boolean;
            public packingMode: UnityEngine.SpritePackingMode;
            public packingRotation: UnityEngine.SpritePackingRotation;
            public textureRect: UnityEngine.Rect;
            public textureRectOffset: UnityEngine.Vector2;
            public vertices: UnityEngine.Vector2[];
            public triangles: number[];
            public uv: UnityEngine.Vector2[];
            public GetPhysicsShapeCount():number;
            public GetPhysicsShapePointCount(shapeIdx: number):number;
            public GetPhysicsShape(shapeIdx: number, physicsShape: System.Collections.Generic.List$1<UnityEngine.Vector2>):number;
            public OverridePhysicsShape(physicsShapes: System.Collections.Generic.IList$1<UnityEngine.Vector2[]>):void;
            public OverrideGeometry(vertices: UnityEngine.Vector2[], triangles: number[]):void;
            public static Create(texture: UnityEngine.Texture2D, rect: UnityEngine.Rect, pivot: UnityEngine.Vector2, pixelsPerUnit: number, extrude: number, meshType: UnityEngine.SpriteMeshType, border: UnityEngine.Vector4, generateFallbackPhysicsShape: boolean):UnityEngine.Sprite;
            public static Create(texture: UnityEngine.Texture2D, rect: UnityEngine.Rect, pivot: UnityEngine.Vector2, pixelsPerUnit: number, extrude: number, meshType: UnityEngine.SpriteMeshType, border: UnityEngine.Vector4):UnityEngine.Sprite;
            public static Create(texture: UnityEngine.Texture2D, rect: UnityEngine.Rect, pivot: UnityEngine.Vector2, pixelsPerUnit: number, extrude: number, meshType: UnityEngine.SpriteMeshType):UnityEngine.Sprite;
            public static Create(texture: UnityEngine.Texture2D, rect: UnityEngine.Rect, pivot: UnityEngine.Vector2, pixelsPerUnit: number, extrude: number):UnityEngine.Sprite;
            public static Create(texture: UnityEngine.Texture2D, rect: UnityEngine.Rect, pivot: UnityEngine.Vector2, pixelsPerUnit: number):UnityEngine.Sprite;
            public static Create(texture: UnityEngine.Texture2D, rect: UnityEngine.Rect, pivot: UnityEngine.Vector2):UnityEngine.Sprite;
            
        }
        class Texture extends UnityEngine.Object {
            
        }
        class Texture2D extends UnityEngine.Texture {
            
        }
        enum SpritePackingMode { Tight = 0, Rectangle = 1 }
        enum SpritePackingRotation { None = 0, FlipHorizontal = 1, FlipVertical = 2, Rotate180 = 3, Any = 15 }
        enum SpriteMeshType { FullRect = 0, Tight = 1 }
        class TextGenerator extends System.Object {
            
        }
        class Font extends UnityEngine.Object {
            
        }
        enum TextAnchor { UpperLeft = 0, UpperCenter = 1, UpperRight = 2, MiddleLeft = 3, MiddleCenter = 4, MiddleRight = 5, LowerLeft = 6, LowerCenter = 7, LowerRight = 8 }
        enum HorizontalWrapMode { Wrap = 0, Overflow = 1 }
        enum VerticalWrapMode { Truncate = 0, Overflow = 1 }
        enum FontStyle { Normal = 0, Bold = 1, Italic = 2, BoldAndItalic = 3 }
        class TextGenerationSettings extends System.ValueType {
            
        }
        enum RenderingPath { UsePlayerSettings = -1, VertexLit = 0, Forward = 1, DeferredLighting = 2, DeferredShading = 3 }
        enum TransparencySortMode { Default = 0, Perspective = 1, Orthographic = 2, CustomAxis = 3 }
        enum CameraType { Game = 1, SceneView = 2, Preview = 4, VR = 8, Reflection = 16 }
        enum CameraClearFlags { Skybox = 1, Color = 2, SolidColor = 2, Depth = 3, Nothing = 4 }
        enum DepthTextureMode { None = 0, Depth = 1, DepthNormals = 2, MotionVectors = 4 }
        class Shader extends UnityEngine.Object {
            
        }
        class RenderTexture extends UnityEngine.Texture {
            
        }
        class RenderBuffer extends System.ValueType {
            
        }
        class Ray extends System.ValueType {
            public origin: UnityEngine.Vector3;
            public direction: UnityEngine.Vector3;
            public constructor(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3);
            public GetPoint(distance: number):UnityEngine.Vector3;
            public ToString():string;
            public ToString(format: string):string;
            
        }
        enum StereoTargetEyeMask { None = 0, Left = 1, Right = 2, Both = 3 }
        class Cubemap extends UnityEngine.Texture {
            
        }
        class Plane extends System.ValueType {
            public normal: UnityEngine.Vector3;
            public distance: number;
            public flipped: UnityEngine.Plane;
            public constructor(inNormal: UnityEngine.Vector3, inPoint: UnityEngine.Vector3);
            public constructor(inNormal: UnityEngine.Vector3, d: number);
            public constructor(a: UnityEngine.Vector3, b: UnityEngine.Vector3, c: UnityEngine.Vector3);
            public SetNormalAndPosition(inNormal: UnityEngine.Vector3, inPoint: UnityEngine.Vector3):void;
            public Set3Points(a: UnityEngine.Vector3, b: UnityEngine.Vector3, c: UnityEngine.Vector3):void;
            public Flip():void;
            public Translate(translation: UnityEngine.Vector3):void;
            public static Translate(plane: UnityEngine.Plane, translation: UnityEngine.Vector3):UnityEngine.Plane;
            public ClosestPointOnPlane(point: UnityEngine.Vector3):UnityEngine.Vector3;
            public GetDistanceToPoint(point: UnityEngine.Vector3):number;
            public GetSide(point: UnityEngine.Vector3):boolean;
            public SameSide(inPt0: UnityEngine.Vector3, inPt1: UnityEngine.Vector3):boolean;
            public Raycast(ray: UnityEngine.Ray, enter: $Ref<number>):boolean;
            public ToString():string;
            public ToString(format: string):string;
            
        }
        class TrailRenderer extends UnityEngine.Renderer {
            public numPositions: number;
            public time: number;
            public startWidth: number;
            public endWidth: number;
            public widthMultiplier: number;
            public autodestruct: boolean;
            public emitting: boolean;
            public numCornerVertices: number;
            public numCapVertices: number;
            public minVertexDistance: number;
            public startColor: UnityEngine.Color;
            public endColor: UnityEngine.Color;
            public positionCount: number;
            public shadowBias: number;
            public generateLightingData: boolean;
            public textureMode: UnityEngine.LineTextureMode;
            public alignment: UnityEngine.LineAlignment;
            public widthCurve: UnityEngine.AnimationCurve;
            public colorGradient: UnityEngine.Gradient;
            public constructor();
            public SetPosition(index: number, position: UnityEngine.Vector3):void;
            public GetPosition(index: number):UnityEngine.Vector3;
            public Clear():void;
            public BakeMesh(mesh: UnityEngine.Mesh, useTransform: boolean):void;
            public BakeMesh(mesh: UnityEngine.Mesh, camera: UnityEngine.Camera, useTransform: boolean):void;
            public GetPositions(positions: UnityEngine.Vector3[]):number;
            public SetPositions(positions: UnityEngine.Vector3[]):void;
            public AddPosition(position: UnityEngine.Vector3):void;
            public AddPositions(positions: UnityEngine.Vector3[]):void;
            
        }
        enum LineTextureMode { Stretch = 0, Tile = 1, DistributePerSegment = 2, RepeatPerSegment = 3 }
        enum LineAlignment { View = 0, Local = 1, TransformZ = 1 }
        class Mesh extends UnityEngine.Object {
            
        }
        class AnimationCurve extends System.Object {
            
        }
        class Gradient extends System.Object {
            
        }
        class Input extends System.Object {
            public static simulateMouseWithTouches: boolean;
            public static anyKey: boolean;
            public static anyKeyDown: boolean;
            public static inputString: string;
            public static mousePosition: UnityEngine.Vector3;
            public static mouseScrollDelta: UnityEngine.Vector2;
            public static imeCompositionMode: UnityEngine.IMECompositionMode;
            public static compositionString: string;
            public static imeIsSelected: boolean;
            public static compositionCursorPos: UnityEngine.Vector2;
            public static eatKeyPressOnTextFieldFocus: boolean;
            public static mousePresent: boolean;
            public static touchCount: number;
            public static touchPressureSupported: boolean;
            public static stylusTouchSupported: boolean;
            public static touchSupported: boolean;
            public static multiTouchEnabled: boolean;
            public static isGyroAvailable: boolean;
            public static deviceOrientation: UnityEngine.DeviceOrientation;
            public static acceleration: UnityEngine.Vector3;
            public static compensateSensors: boolean;
            public static accelerationEventCount: number;
            public static backButtonLeavesApp: boolean;
            public static location: UnityEngine.LocationService;
            public static compass: UnityEngine.Compass;
            public static gyro: UnityEngine.Gyroscope;
            public static touches: UnityEngine.Touch[];
            public static accelerationEvents: UnityEngine.AccelerationEvent[];
            public constructor();
            public static GetAxis(axisName: string):number;
            public static GetAxisRaw(axisName: string):number;
            public static GetButton(buttonName: string):boolean;
            public static GetButtonDown(buttonName: string):boolean;
            public static GetButtonUp(buttonName: string):boolean;
            public static GetMouseButton(button: number):boolean;
            public static GetMouseButtonDown(button: number):boolean;
            public static GetMouseButtonUp(button: number):boolean;
            public static ResetInputAxes():void;
            public static GetJoystickNames():string[];
            public static GetTouch(index: number):UnityEngine.Touch;
            public static GetAccelerationEvent(index: number):UnityEngine.AccelerationEvent;
            public static GetKey(key: UnityEngine.KeyCode):boolean;
            public static GetKey(name: string):boolean;
            public static GetKeyUp(key: UnityEngine.KeyCode):boolean;
            public static GetKeyUp(name: string):boolean;
            public static GetKeyDown(key: UnityEngine.KeyCode):boolean;
            public static GetKeyDown(name: string):boolean;
            
        }
        class Touch extends System.ValueType {
            
        }
        class AccelerationEvent extends System.ValueType {
            
        }
        enum KeyCode { None = 0, Backspace = 8, Delete = 127, Tab = 9, Clear = 12, Return = 13, Pause = 19, Escape = 27, Space = 32, Keypad0 = 256, Keypad1 = 257, Keypad2 = 258, Keypad3 = 259, Keypad4 = 260, Keypad5 = 261, Keypad6 = 262, Keypad7 = 263, Keypad8 = 264, Keypad9 = 265, KeypadPeriod = 266, KeypadDivide = 267, KeypadMultiply = 268, KeypadMinus = 269, KeypadPlus = 270, KeypadEnter = 271, KeypadEquals = 272, UpArrow = 273, DownArrow = 274, RightArrow = 275, LeftArrow = 276, Insert = 277, Home = 278, End = 279, PageUp = 280, PageDown = 281, F1 = 282, F2 = 283, F3 = 284, F4 = 285, F5 = 286, F6 = 287, F7 = 288, F8 = 289, F9 = 290, F10 = 291, F11 = 292, F12 = 293, F13 = 294, F14 = 295, F15 = 296, Alpha0 = 48, Alpha1 = 49, Alpha2 = 50, Alpha3 = 51, Alpha4 = 52, Alpha5 = 53, Alpha6 = 54, Alpha7 = 55, Alpha8 = 56, Alpha9 = 57, Exclaim = 33, DoubleQuote = 34, Hash = 35, Dollar = 36, Percent = 37, Ampersand = 38, Quote = 39, LeftParen = 40, RightParen = 41, Asterisk = 42, Plus = 43, Comma = 44, Minus = 45, Period = 46, Slash = 47, Colon = 58, Semicolon = 59, Less = 60, Equals = 61, Greater = 62, Question = 63, At = 64, LeftBracket = 91, Backslash = 92, RightBracket = 93, Caret = 94, Underscore = 95, BackQuote = 96, A = 97, B = 98, C = 99, D = 100, E = 101, F = 102, G = 103, H = 104, I = 105, J = 106, K = 107, L = 108, M = 109, N = 110, O = 111, P = 112, Q = 113, R = 114, S = 115, T = 116, U = 117, V = 118, W = 119, X = 120, Y = 121, Z = 122, LeftCurlyBracket = 123, Pipe = 124, RightCurlyBracket = 125, Tilde = 126, Numlock = 300, CapsLock = 301, ScrollLock = 302, RightShift = 303, LeftShift = 304, RightControl = 305, LeftControl = 306, RightAlt = 307, LeftAlt = 308, LeftCommand = 310, LeftApple = 310, LeftWindows = 311, RightCommand = 309, RightApple = 309, RightWindows = 312, AltGr = 313, Help = 315, Print = 316, SysReq = 317, Break = 318, Menu = 319, Mouse0 = 323, Mouse1 = 324, Mouse2 = 325, Mouse3 = 326, Mouse4 = 327, Mouse5 = 328, Mouse6 = 329, JoystickButton0 = 330, JoystickButton1 = 331, JoystickButton2 = 332, JoystickButton3 = 333, JoystickButton4 = 334, JoystickButton5 = 335, JoystickButton6 = 336, JoystickButton7 = 337, JoystickButton8 = 338, JoystickButton9 = 339, JoystickButton10 = 340, JoystickButton11 = 341, JoystickButton12 = 342, JoystickButton13 = 343, JoystickButton14 = 344, JoystickButton15 = 345, JoystickButton16 = 346, JoystickButton17 = 347, JoystickButton18 = 348, JoystickButton19 = 349, Joystick1Button0 = 350, Joystick1Button1 = 351, Joystick1Button2 = 352, Joystick1Button3 = 353, Joystick1Button4 = 354, Joystick1Button5 = 355, Joystick1Button6 = 356, Joystick1Button7 = 357, Joystick1Button8 = 358, Joystick1Button9 = 359, Joystick1Button10 = 360, Joystick1Button11 = 361, Joystick1Button12 = 362, Joystick1Button13 = 363, Joystick1Button14 = 364, Joystick1Button15 = 365, Joystick1Button16 = 366, Joystick1Button17 = 367, Joystick1Button18 = 368, Joystick1Button19 = 369, Joystick2Button0 = 370, Joystick2Button1 = 371, Joystick2Button2 = 372, Joystick2Button3 = 373, Joystick2Button4 = 374, Joystick2Button5 = 375, Joystick2Button6 = 376, Joystick2Button7 = 377, Joystick2Button8 = 378, Joystick2Button9 = 379, Joystick2Button10 = 380, Joystick2Button11 = 381, Joystick2Button12 = 382, Joystick2Button13 = 383, Joystick2Button14 = 384, Joystick2Button15 = 385, Joystick2Button16 = 386, Joystick2Button17 = 387, Joystick2Button18 = 388, Joystick2Button19 = 389, Joystick3Button0 = 390, Joystick3Button1 = 391, Joystick3Button2 = 392, Joystick3Button3 = 393, Joystick3Button4 = 394, Joystick3Button5 = 395, Joystick3Button6 = 396, Joystick3Button7 = 397, Joystick3Button8 = 398, Joystick3Button9 = 399, Joystick3Button10 = 400, Joystick3Button11 = 401, Joystick3Button12 = 402, Joystick3Button13 = 403, Joystick3Button14 = 404, Joystick3Button15 = 405, Joystick3Button16 = 406, Joystick3Button17 = 407, Joystick3Button18 = 408, Joystick3Button19 = 409, Joystick4Button0 = 410, Joystick4Button1 = 411, Joystick4Button2 = 412, Joystick4Button3 = 413, Joystick4Button4 = 414, Joystick4Button5 = 415, Joystick4Button6 = 416, Joystick4Button7 = 417, Joystick4Button8 = 418, Joystick4Button9 = 419, Joystick4Button10 = 420, Joystick4Button11 = 421, Joystick4Button12 = 422, Joystick4Button13 = 423, Joystick4Button14 = 424, Joystick4Button15 = 425, Joystick4Button16 = 426, Joystick4Button17 = 427, Joystick4Button18 = 428, Joystick4Button19 = 429, Joystick5Button0 = 430, Joystick5Button1 = 431, Joystick5Button2 = 432, Joystick5Button3 = 433, Joystick5Button4 = 434, Joystick5Button5 = 435, Joystick5Button6 = 436, Joystick5Button7 = 437, Joystick5Button8 = 438, Joystick5Button9 = 439, Joystick5Button10 = 440, Joystick5Button11 = 441, Joystick5Button12 = 442, Joystick5Button13 = 443, Joystick5Button14 = 444, Joystick5Button15 = 445, Joystick5Button16 = 446, Joystick5Button17 = 447, Joystick5Button18 = 448, Joystick5Button19 = 449, Joystick6Button0 = 450, Joystick6Button1 = 451, Joystick6Button2 = 452, Joystick6Button3 = 453, Joystick6Button4 = 454, Joystick6Button5 = 455, Joystick6Button6 = 456, Joystick6Button7 = 457, Joystick6Button8 = 458, Joystick6Button9 = 459, Joystick6Button10 = 460, Joystick6Button11 = 461, Joystick6Button12 = 462, Joystick6Button13 = 463, Joystick6Button14 = 464, Joystick6Button15 = 465, Joystick6Button16 = 466, Joystick6Button17 = 467, Joystick6Button18 = 468, Joystick6Button19 = 469, Joystick7Button0 = 470, Joystick7Button1 = 471, Joystick7Button2 = 472, Joystick7Button3 = 473, Joystick7Button4 = 474, Joystick7Button5 = 475, Joystick7Button6 = 476, Joystick7Button7 = 477, Joystick7Button8 = 478, Joystick7Button9 = 479, Joystick7Button10 = 480, Joystick7Button11 = 481, Joystick7Button12 = 482, Joystick7Button13 = 483, Joystick7Button14 = 484, Joystick7Button15 = 485, Joystick7Button16 = 486, Joystick7Button17 = 487, Joystick7Button18 = 488, Joystick7Button19 = 489, Joystick8Button0 = 490, Joystick8Button1 = 491, Joystick8Button2 = 492, Joystick8Button3 = 493, Joystick8Button4 = 494, Joystick8Button5 = 495, Joystick8Button6 = 496, Joystick8Button7 = 497, Joystick8Button8 = 498, Joystick8Button9 = 499, Joystick8Button10 = 500, Joystick8Button11 = 501, Joystick8Button12 = 502, Joystick8Button13 = 503, Joystick8Button14 = 504, Joystick8Button15 = 505, Joystick8Button16 = 506, Joystick8Button17 = 507, Joystick8Button18 = 508, Joystick8Button19 = 509 }
        enum IMECompositionMode { Auto = 0, On = 1, Off = 2 }
        enum DeviceOrientation { Unknown = 0, Portrait = 1, PortraitUpsideDown = 2, LandscapeLeft = 3, LandscapeRight = 4, FaceUp = 5, FaceDown = 6 }
        class LocationService extends System.Object {
            
        }
        class Compass extends System.Object {
            
        }
        class Gyroscope extends System.Object {
            
        }
        class Screen extends System.Object {
            public static width: number;
            public static height: number;
            public static dpi: number;
            public static orientation: UnityEngine.ScreenOrientation;
            public static sleepTimeout: number;
            public static autorotateToPortrait: boolean;
            public static autorotateToPortraitUpsideDown: boolean;
            public static autorotateToLandscapeLeft: boolean;
            public static autorotateToLandscapeRight: boolean;
            public static currentResolution: UnityEngine.Resolution;
            public static fullScreen: boolean;
            public static fullScreenMode: UnityEngine.FullScreenMode;
            public static safeArea: UnityEngine.Rect;
            public static resolutions: UnityEngine.Resolution[];
            public static lockCursor: boolean;
            public constructor();
            public static SetResolution(width: number, height: number, fullscreenMode: UnityEngine.FullScreenMode, preferredRefreshRate: number):void;
            public static SetResolution(width: number, height: number, fullscreenMode: UnityEngine.FullScreenMode):void;
            public static SetResolution(width: number, height: number, fullscreen: boolean, preferredRefreshRate: number):void;
            public static SetResolution(width: number, height: number, fullscreen: boolean):void;
            
        }
        enum ScreenOrientation { Unknown = 0, Portrait = 1, PortraitUpsideDown = 2, LandscapeLeft = 3, LandscapeRight = 4, AutoRotation = 5, Landscape = 3 }
        class Resolution extends System.ValueType {
            
        }
        enum FullScreenMode { ExclusiveFullScreen = 0, FullScreenWindow = 1, MaximizedWindow = 2, Windowed = 3 }
        class RaycastHit extends System.ValueType {
            public collider: UnityEngine.Collider;
            public point: UnityEngine.Vector3;
            public normal: UnityEngine.Vector3;
            public barycentricCoordinate: UnityEngine.Vector3;
            public distance: number;
            public triangleIndex: number;
            public textureCoord: UnityEngine.Vector2;
            public textureCoord2: UnityEngine.Vector2;
            public textureCoord1: UnityEngine.Vector2;
            public transform: UnityEngine.Transform;
            public rigidbody: UnityEngine.Rigidbody;
            public lightmapCoord: UnityEngine.Vector2;
            
        }
        class Collider extends UnityEngine.Component {
            public enabled: boolean;
            public attachedRigidbody: UnityEngine.Rigidbody;
            public isTrigger: boolean;
            public contactOffset: number;
            public bounds: UnityEngine.Bounds;
            public sharedMaterial: UnityEngine.PhysicMaterial;
            public material: UnityEngine.PhysicMaterial;
            public constructor();
            public ClosestPoint(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public Raycast(ray: UnityEngine.Ray, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number):boolean;
            public ClosestPointOnBounds(position: UnityEngine.Vector3):UnityEngine.Vector3;
            
        }
        class Rigidbody extends UnityEngine.Component {
            public velocity: UnityEngine.Vector3;
            public angularVelocity: UnityEngine.Vector3;
            public drag: number;
            public angularDrag: number;
            public mass: number;
            public useGravity: boolean;
            public maxDepenetrationVelocity: number;
            public isKinematic: boolean;
            public freezeRotation: boolean;
            public constraints: UnityEngine.RigidbodyConstraints;
            public collisionDetectionMode: UnityEngine.CollisionDetectionMode;
            public centerOfMass: UnityEngine.Vector3;
            public worldCenterOfMass: UnityEngine.Vector3;
            public inertiaTensorRotation: UnityEngine.Quaternion;
            public inertiaTensor: UnityEngine.Vector3;
            public detectCollisions: boolean;
            public position: UnityEngine.Vector3;
            public rotation: UnityEngine.Quaternion;
            public interpolation: UnityEngine.RigidbodyInterpolation;
            public solverIterations: number;
            public sleepThreshold: number;
            public maxAngularVelocity: number;
            public solverVelocityIterations: number;
            public sleepVelocity: number;
            public sleepAngularVelocity: number;
            public useConeFriction: boolean;
            public solverIterationCount: number;
            public solverVelocityIterationCount: number;
            public constructor();
            public SetDensity(density: number):void;
            public MovePosition(position: UnityEngine.Vector3):void;
            public MoveRotation(rot: UnityEngine.Quaternion):void;
            public Sleep():void;
            public IsSleeping():boolean;
            public WakeUp():void;
            public ResetCenterOfMass():void;
            public ResetInertiaTensor():void;
            public GetRelativePointVelocity(relativePoint: UnityEngine.Vector3):UnityEngine.Vector3;
            public GetPointVelocity(worldPoint: UnityEngine.Vector3):UnityEngine.Vector3;
            public SetMaxAngularVelocity(a: number):void;
            public AddForce(force: UnityEngine.Vector3, mode: UnityEngine.ForceMode):void;
            public AddForce(force: UnityEngine.Vector3):void;
            public AddForce(x: number, y: number, z: number, mode: UnityEngine.ForceMode):void;
            public AddForce(x: number, y: number, z: number):void;
            public AddRelativeForce(force: UnityEngine.Vector3, mode: UnityEngine.ForceMode):void;
            public AddRelativeForce(force: UnityEngine.Vector3):void;
            public AddRelativeForce(x: number, y: number, z: number, mode: UnityEngine.ForceMode):void;
            public AddRelativeForce(x: number, y: number, z: number):void;
            public AddTorque(torque: UnityEngine.Vector3, mode: UnityEngine.ForceMode):void;
            public AddTorque(torque: UnityEngine.Vector3):void;
            public AddTorque(x: number, y: number, z: number, mode: UnityEngine.ForceMode):void;
            public AddTorque(x: number, y: number, z: number):void;
            public AddRelativeTorque(torque: UnityEngine.Vector3, mode: UnityEngine.ForceMode):void;
            public AddRelativeTorque(torque: UnityEngine.Vector3):void;
            public AddRelativeTorque(x: number, y: number, z: number, mode: UnityEngine.ForceMode):void;
            public AddRelativeTorque(x: number, y: number, z: number):void;
            public AddForceAtPosition(force: UnityEngine.Vector3, position: UnityEngine.Vector3, mode: UnityEngine.ForceMode):void;
            public AddForceAtPosition(force: UnityEngine.Vector3, position: UnityEngine.Vector3):void;
            public AddExplosionForce(explosionForce: number, explosionPosition: UnityEngine.Vector3, explosionRadius: number, upwardsModifier: number, mode: UnityEngine.ForceMode):void;
            public AddExplosionForce(explosionForce: number, explosionPosition: UnityEngine.Vector3, explosionRadius: number, upwardsModifier: number):void;
            public AddExplosionForce(explosionForce: number, explosionPosition: UnityEngine.Vector3, explosionRadius: number):void;
            public ClosestPointOnBounds(position: UnityEngine.Vector3):UnityEngine.Vector3;
            public SweepTest(direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public SweepTest(direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number):boolean;
            public SweepTest(direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>):boolean;
            public SweepTestAll(direction: UnityEngine.Vector3, maxDistance: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.RaycastHit[];
            public SweepTestAll(direction: UnityEngine.Vector3, maxDistance: number):UnityEngine.RaycastHit[];
            public SweepTestAll(direction: UnityEngine.Vector3):UnityEngine.RaycastHit[];
            
        }
        class PhysicMaterial extends UnityEngine.Object {
            
        }
        class BoxCollider extends UnityEngine.Collider {
            public center: UnityEngine.Vector3;
            public size: UnityEngine.Vector3;
            public extents: UnityEngine.Vector3;
            public constructor();
            
        }
        class Collision extends System.Object {
            public relativeVelocity: UnityEngine.Vector3;
            public rigidbody: UnityEngine.Rigidbody;
            public collider: UnityEngine.Collider;
            public transform: UnityEngine.Transform;
            public gameObject: UnityEngine.GameObject;
            public contactCount: number;
            public contacts: UnityEngine.ContactPoint[];
            public impulse: UnityEngine.Vector3;
            public impactForceSum: UnityEngine.Vector3;
            public frictionForceSum: UnityEngine.Vector3;
            public other: UnityEngine.Component;
            public constructor();
            public GetContact(index: number):UnityEngine.ContactPoint;
            public GetContacts(contacts: UnityEngine.ContactPoint[]):number;
            public GetEnumerator():System.Collections.IEnumerator;
            
        }
        class ContactPoint extends System.ValueType {
            
        }
        enum RigidbodyConstraints { None = 0, FreezePositionX = 2, FreezePositionY = 4, FreezePositionZ = 8, FreezeRotationX = 16, FreezeRotationY = 32, FreezeRotationZ = 64, FreezePosition = 14, FreezeRotation = 112, FreezeAll = 126 }
        enum CollisionDetectionMode { Discrete = 0, Continuous = 1, ContinuousDynamic = 2, ContinuousSpeculative = 3 }
        enum RigidbodyInterpolation { None = 0, Interpolate = 1, Extrapolate = 2 }
        enum ForceMode { Force = 0, Acceleration = 5, Impulse = 1, VelocityChange = 2 }
        enum QueryTriggerInteraction { UseGlobal = 0, Ignore = 1, Collide = 2 }
        class Physics extends System.Object {
            public static IgnoreRaycastLayer: number;
            public static DefaultRaycastLayers: number;
            public static AllLayers: number;
            public static gravity: UnityEngine.Vector3;
            public static defaultContactOffset: number;
            public static sleepThreshold: number;
            public static queriesHitTriggers: boolean;
            public static queriesHitBackfaces: boolean;
            public static bounceThreshold: number;
            public static defaultSolverIterations: number;
            public static defaultSolverVelocityIterations: number;
            public static bounceTreshold: number;
            public static sleepVelocity: number;
            public static sleepAngularVelocity: number;
            public static solverIterationCount: number;
            public static solverVelocityIterationCount: number;
            public static penetrationPenaltyForce: number;
            public static defaultPhysicsScene: UnityEngine.PhysicsScene;
            public static autoSimulation: boolean;
            public static autoSyncTransforms: boolean;
            public static reuseCollisionCallbacks: boolean;
            public static interCollisionDistance: number;
            public static interCollisionStiffness: number;
            public static interCollisionSettingsToggle: boolean;
            public constructor();
            public static IgnoreCollision(collider1: UnityEngine.Collider, collider2: UnityEngine.Collider, ignore: boolean):void;
            public static IgnoreCollision(collider1: UnityEngine.Collider, collider2: UnityEngine.Collider):void;
            public static IgnoreLayerCollision(layer1: number, layer2: number, ignore: boolean):void;
            public static IgnoreLayerCollision(layer1: number, layer2: number):void;
            public static GetIgnoreLayerCollision(layer1: number, layer2: number):boolean;
            public static Raycast(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static Raycast(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number):boolean;
            public static Raycast(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, maxDistance: number):boolean;
            public static Raycast(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3):boolean;
            public static Raycast(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static Raycast(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number):boolean;
            public static Raycast(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number):boolean;
            public static Raycast(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>):boolean;
            public static Raycast(ray: UnityEngine.Ray, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static Raycast(ray: UnityEngine.Ray, maxDistance: number, layerMask: number):boolean;
            public static Raycast(ray: UnityEngine.Ray, maxDistance: number):boolean;
            public static Raycast(ray: UnityEngine.Ray):boolean;
            public static Raycast(ray: UnityEngine.Ray, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static Raycast(ray: UnityEngine.Ray, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number):boolean;
            public static Raycast(ray: UnityEngine.Ray, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number):boolean;
            public static Raycast(ray: UnityEngine.Ray, hitInfo: $Ref<UnityEngine.RaycastHit>):boolean;
            public static Linecast(start: UnityEngine.Vector3, end: UnityEngine.Vector3, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static Linecast(start: UnityEngine.Vector3, end: UnityEngine.Vector3, layerMask: number):boolean;
            public static Linecast(start: UnityEngine.Vector3, end: UnityEngine.Vector3):boolean;
            public static Linecast(start: UnityEngine.Vector3, end: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static Linecast(start: UnityEngine.Vector3, end: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, layerMask: number):boolean;
            public static Linecast(start: UnityEngine.Vector3, end: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>):boolean;
            public static CapsuleCast(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static CapsuleCast(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number):boolean;
            public static CapsuleCast(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, maxDistance: number):boolean;
            public static CapsuleCast(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3):boolean;
            public static CapsuleCast(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static CapsuleCast(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number):boolean;
            public static CapsuleCast(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number):boolean;
            public static CapsuleCast(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>):boolean;
            public static SphereCast(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static SphereCast(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number):boolean;
            public static SphereCast(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number):boolean;
            public static SphereCast(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>):boolean;
            public static SphereCast(ray: UnityEngine.Ray, radius: number, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static SphereCast(ray: UnityEngine.Ray, radius: number, maxDistance: number, layerMask: number):boolean;
            public static SphereCast(ray: UnityEngine.Ray, radius: number, maxDistance: number):boolean;
            public static SphereCast(ray: UnityEngine.Ray, radius: number):boolean;
            public static SphereCast(ray: UnityEngine.Ray, radius: number, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static SphereCast(ray: UnityEngine.Ray, radius: number, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number, layerMask: number):boolean;
            public static SphereCast(ray: UnityEngine.Ray, radius: number, hitInfo: $Ref<UnityEngine.RaycastHit>, maxDistance: number):boolean;
            public static SphereCast(ray: UnityEngine.Ray, radius: number, hitInfo: $Ref<UnityEngine.RaycastHit>):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, maxDistance: number, layerMask: number):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, maxDistance: number):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, orientation: UnityEngine.Quaternion):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, orientation: UnityEngine.Quaternion, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, orientation: UnityEngine.Quaternion, maxDistance: number, layerMask: number):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, orientation: UnityEngine.Quaternion, maxDistance: number):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>, orientation: UnityEngine.Quaternion):boolean;
            public static BoxCast(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, hitInfo: $Ref<UnityEngine.RaycastHit>):boolean;
            public static RaycastAll(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.RaycastHit[];
            public static RaycastAll(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number):UnityEngine.RaycastHit[];
            public static RaycastAll(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, maxDistance: number):UnityEngine.RaycastHit[];
            public static RaycastAll(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3):UnityEngine.RaycastHit[];
            public static RaycastAll(ray: UnityEngine.Ray, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.RaycastHit[];
            public static RaycastAll(ray: UnityEngine.Ray, maxDistance: number, layerMask: number):UnityEngine.RaycastHit[];
            public static RaycastAll(ray: UnityEngine.Ray, maxDistance: number):UnityEngine.RaycastHit[];
            public static RaycastAll(ray: UnityEngine.Ray):UnityEngine.RaycastHit[];
            public static RaycastNonAlloc(ray: UnityEngine.Ray, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):number;
            public static RaycastNonAlloc(ray: UnityEngine.Ray, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number):number;
            public static RaycastNonAlloc(ray: UnityEngine.Ray, results: UnityEngine.RaycastHit[], maxDistance: number):number;
            public static RaycastNonAlloc(ray: UnityEngine.Ray, results: UnityEngine.RaycastHit[]):number;
            public static RaycastNonAlloc(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):number;
            public static RaycastNonAlloc(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number):number;
            public static RaycastNonAlloc(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], maxDistance: number):number;
            public static RaycastNonAlloc(origin: UnityEngine.Vector3, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[]):number;
            public static CapsuleCastAll(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.RaycastHit[];
            public static CapsuleCastAll(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number):UnityEngine.RaycastHit[];
            public static CapsuleCastAll(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, maxDistance: number):UnityEngine.RaycastHit[];
            public static CapsuleCastAll(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3):UnityEngine.RaycastHit[];
            public static SphereCastAll(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.RaycastHit[];
            public static SphereCastAll(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, maxDistance: number, layerMask: number):UnityEngine.RaycastHit[];
            public static SphereCastAll(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, maxDistance: number):UnityEngine.RaycastHit[];
            public static SphereCastAll(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3):UnityEngine.RaycastHit[];
            public static SphereCastAll(ray: UnityEngine.Ray, radius: number, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.RaycastHit[];
            public static SphereCastAll(ray: UnityEngine.Ray, radius: number, maxDistance: number, layerMask: number):UnityEngine.RaycastHit[];
            public static SphereCastAll(ray: UnityEngine.Ray, radius: number, maxDistance: number):UnityEngine.RaycastHit[];
            public static SphereCastAll(ray: UnityEngine.Ray, radius: number):UnityEngine.RaycastHit[];
            public static OverlapCapsule(point0: UnityEngine.Vector3, point1: UnityEngine.Vector3, radius: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.Collider[];
            public static OverlapCapsule(point0: UnityEngine.Vector3, point1: UnityEngine.Vector3, radius: number, layerMask: number):UnityEngine.Collider[];
            public static OverlapCapsule(point0: UnityEngine.Vector3, point1: UnityEngine.Vector3, radius: number):UnityEngine.Collider[];
            public static OverlapSphere(position: UnityEngine.Vector3, radius: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.Collider[];
            public static OverlapSphere(position: UnityEngine.Vector3, radius: number, layerMask: number):UnityEngine.Collider[];
            public static OverlapSphere(position: UnityEngine.Vector3, radius: number):UnityEngine.Collider[];
            public static Simulate(step: number):void;
            public static SyncTransforms():void;
            public static ComputePenetration(colliderA: UnityEngine.Collider, positionA: UnityEngine.Vector3, rotationA: UnityEngine.Quaternion, colliderB: UnityEngine.Collider, positionB: UnityEngine.Vector3, rotationB: UnityEngine.Quaternion, direction: $Ref<UnityEngine.Vector3>, distance: $Ref<number>):boolean;
            public static ClosestPoint(point: UnityEngine.Vector3, collider: UnityEngine.Collider, position: UnityEngine.Vector3, rotation: UnityEngine.Quaternion):UnityEngine.Vector3;
            public static OverlapSphereNonAlloc(position: UnityEngine.Vector3, radius: number, results: UnityEngine.Collider[], layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):number;
            public static OverlapSphereNonAlloc(position: UnityEngine.Vector3, radius: number, results: UnityEngine.Collider[], layerMask: number):number;
            public static OverlapSphereNonAlloc(position: UnityEngine.Vector3, radius: number, results: UnityEngine.Collider[]):number;
            public static CheckSphere(position: UnityEngine.Vector3, radius: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static CheckSphere(position: UnityEngine.Vector3, radius: number, layerMask: number):boolean;
            public static CheckSphere(position: UnityEngine.Vector3, radius: number):boolean;
            public static CapsuleCastNonAlloc(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):number;
            public static CapsuleCastNonAlloc(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number):number;
            public static CapsuleCastNonAlloc(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], maxDistance: number):number;
            public static CapsuleCastNonAlloc(point1: UnityEngine.Vector3, point2: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[]):number;
            public static SphereCastNonAlloc(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):number;
            public static SphereCastNonAlloc(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number):number;
            public static SphereCastNonAlloc(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], maxDistance: number):number;
            public static SphereCastNonAlloc(origin: UnityEngine.Vector3, radius: number, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[]):number;
            public static SphereCastNonAlloc(ray: UnityEngine.Ray, radius: number, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):number;
            public static SphereCastNonAlloc(ray: UnityEngine.Ray, radius: number, results: UnityEngine.RaycastHit[], maxDistance: number, layerMask: number):number;
            public static SphereCastNonAlloc(ray: UnityEngine.Ray, radius: number, results: UnityEngine.RaycastHit[], maxDistance: number):number;
            public static SphereCastNonAlloc(ray: UnityEngine.Ray, radius: number, results: UnityEngine.RaycastHit[]):number;
            public static CheckCapsule(start: UnityEngine.Vector3, end: UnityEngine.Vector3, radius: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static CheckCapsule(start: UnityEngine.Vector3, end: UnityEngine.Vector3, radius: number, layerMask: number):boolean;
            public static CheckCapsule(start: UnityEngine.Vector3, end: UnityEngine.Vector3, radius: number):boolean;
            public static CheckBox(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, layermask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):boolean;
            public static CheckBox(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, layerMask: number):boolean;
            public static CheckBox(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, orientation: UnityEngine.Quaternion):boolean;
            public static CheckBox(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3):boolean;
            public static OverlapBox(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.Collider[];
            public static OverlapBox(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, layerMask: number):UnityEngine.Collider[];
            public static OverlapBox(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, orientation: UnityEngine.Quaternion):UnityEngine.Collider[];
            public static OverlapBox(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3):UnityEngine.Collider[];
            public static OverlapBoxNonAlloc(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, results: UnityEngine.Collider[], orientation: UnityEngine.Quaternion, mask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):number;
            public static OverlapBoxNonAlloc(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, results: UnityEngine.Collider[], orientation: UnityEngine.Quaternion, mask: number):number;
            public static OverlapBoxNonAlloc(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, results: UnityEngine.Collider[], orientation: UnityEngine.Quaternion):number;
            public static OverlapBoxNonAlloc(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, results: UnityEngine.Collider[]):number;
            public static BoxCastNonAlloc(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], orientation: UnityEngine.Quaternion, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):number;
            public static BoxCastNonAlloc(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], orientation: UnityEngine.Quaternion):number;
            public static BoxCastNonAlloc(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], orientation: UnityEngine.Quaternion, maxDistance: number):number;
            public static BoxCastNonAlloc(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[], orientation: UnityEngine.Quaternion, maxDistance: number, layerMask: number):number;
            public static BoxCastNonAlloc(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, results: UnityEngine.RaycastHit[]):number;
            public static BoxCastAll(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, maxDistance: number, layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):UnityEngine.RaycastHit[];
            public static BoxCastAll(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, maxDistance: number, layerMask: number):UnityEngine.RaycastHit[];
            public static BoxCastAll(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, orientation: UnityEngine.Quaternion, maxDistance: number):UnityEngine.RaycastHit[];
            public static BoxCastAll(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3, orientation: UnityEngine.Quaternion):UnityEngine.RaycastHit[];
            public static BoxCastAll(center: UnityEngine.Vector3, halfExtents: UnityEngine.Vector3, direction: UnityEngine.Vector3):UnityEngine.RaycastHit[];
            public static OverlapCapsuleNonAlloc(point0: UnityEngine.Vector3, point1: UnityEngine.Vector3, radius: number, results: UnityEngine.Collider[], layerMask: number, queryTriggerInteraction: UnityEngine.QueryTriggerInteraction):number;
            public static OverlapCapsuleNonAlloc(point0: UnityEngine.Vector3, point1: UnityEngine.Vector3, radius: number, results: UnityEngine.Collider[], layerMask: number):number;
            public static OverlapCapsuleNonAlloc(point0: UnityEngine.Vector3, point1: UnityEngine.Vector3, radius: number, results: UnityEngine.Collider[]):number;
            public static RebuildBroadphaseRegions(worldBounds: UnityEngine.Bounds, subdivisions: number):void;
            
        }
        class PhysicsScene extends System.ValueType {
            
        }
        class Animator extends UnityEngine.Behaviour {
            public isOptimizable: boolean;
            public isHuman: boolean;
            public hasRootMotion: boolean;
            public humanScale: number;
            public isInitialized: boolean;
            public deltaPosition: UnityEngine.Vector3;
            public deltaRotation: UnityEngine.Quaternion;
            public velocity: UnityEngine.Vector3;
            public angularVelocity: UnityEngine.Vector3;
            public rootPosition: UnityEngine.Vector3;
            public rootRotation: UnityEngine.Quaternion;
            public applyRootMotion: boolean;
            public linearVelocityBlending: boolean;
            public animatePhysics: boolean;
            public updateMode: UnityEngine.AnimatorUpdateMode;
            public hasTransformHierarchy: boolean;
            public gravityWeight: number;
            public bodyPosition: UnityEngine.Vector3;
            public bodyRotation: UnityEngine.Quaternion;
            public stabilizeFeet: boolean;
            public layerCount: number;
            public parameters: UnityEngine.AnimatorControllerParameter[];
            public parameterCount: number;
            public feetPivotActive: number;
            public pivotWeight: number;
            public pivotPosition: UnityEngine.Vector3;
            public isMatchingTarget: boolean;
            public speed: number;
            public targetPosition: UnityEngine.Vector3;
            public targetRotation: UnityEngine.Quaternion;
            public cullingMode: UnityEngine.AnimatorCullingMode;
            public playbackTime: number;
            public recorderStartTime: number;
            public recorderStopTime: number;
            public recorderMode: UnityEngine.AnimatorRecorderMode;
            public runtimeAnimatorController: UnityEngine.RuntimeAnimatorController;
            public hasBoundPlayables: boolean;
            public avatar: UnityEngine.Avatar;
            public playableGraph: UnityEngine.Playables.PlayableGraph;
            public layersAffectMassCenter: boolean;
            public leftFeetBottomHeight: number;
            public rightFeetBottomHeight: number;
            public logWarnings: boolean;
            public fireEvents: boolean;
            public keepAnimatorControllerStateOnDisable: boolean;
            public constructor();
            public GetFloat(name: string):number;
            public GetFloat(id: number):number;
            public SetFloat(name: string, value: number):void;
            public SetFloat(name: string, value: number, dampTime: number, deltaTime: number):void;
            public SetFloat(id: number, value: number):void;
            public SetFloat(id: number, value: number, dampTime: number, deltaTime: number):void;
            public GetBool(name: string):boolean;
            public GetBool(id: number):boolean;
            public SetBool(name: string, value: boolean):void;
            public SetBool(id: number, value: boolean):void;
            public GetInteger(name: string):number;
            public GetInteger(id: number):number;
            public SetInteger(name: string, value: number):void;
            public SetInteger(id: number, value: number):void;
            public SetTrigger(name: string):void;
            public SetTrigger(id: number):void;
            public ResetTrigger(name: string):void;
            public ResetTrigger(id: number):void;
            public IsParameterControlledByCurve(name: string):boolean;
            public IsParameterControlledByCurve(id: number):boolean;
            public GetIKPosition(goal: UnityEngine.AvatarIKGoal):UnityEngine.Vector3;
            public SetIKPosition(goal: UnityEngine.AvatarIKGoal, goalPosition: UnityEngine.Vector3):void;
            public GetIKRotation(goal: UnityEngine.AvatarIKGoal):UnityEngine.Quaternion;
            public SetIKRotation(goal: UnityEngine.AvatarIKGoal, goalRotation: UnityEngine.Quaternion):void;
            public GetIKPositionWeight(goal: UnityEngine.AvatarIKGoal):number;
            public SetIKPositionWeight(goal: UnityEngine.AvatarIKGoal, value: number):void;
            public GetIKRotationWeight(goal: UnityEngine.AvatarIKGoal):number;
            public SetIKRotationWeight(goal: UnityEngine.AvatarIKGoal, value: number):void;
            public GetIKHintPosition(hint: UnityEngine.AvatarIKHint):UnityEngine.Vector3;
            public SetIKHintPosition(hint: UnityEngine.AvatarIKHint, hintPosition: UnityEngine.Vector3):void;
            public GetIKHintPositionWeight(hint: UnityEngine.AvatarIKHint):number;
            public SetIKHintPositionWeight(hint: UnityEngine.AvatarIKHint, value: number):void;
            public SetLookAtPosition(lookAtPosition: UnityEngine.Vector3):void;
            public SetLookAtWeight(weight: number):void;
            public SetLookAtWeight(weight: number, bodyWeight: number):void;
            public SetLookAtWeight(weight: number, bodyWeight: number, headWeight: number):void;
            public SetLookAtWeight(weight: number, bodyWeight: number, headWeight: number, eyesWeight: number):void;
            public SetLookAtWeight(weight: number, bodyWeight: number, headWeight: number, eyesWeight: number, clampWeight: number):void;
            public SetBoneLocalRotation(humanBoneId: UnityEngine.HumanBodyBones, rotation: UnityEngine.Quaternion):void;
            public GetBehaviours(fullPathHash: number, layerIndex: number):UnityEngine.StateMachineBehaviour[];
            public GetLayerName(layerIndex: number):string;
            public GetLayerIndex(layerName: string):number;
            public GetLayerWeight(layerIndex: number):number;
            public SetLayerWeight(layerIndex: number, weight: number):void;
            public GetCurrentAnimatorStateInfo(layerIndex: number):UnityEngine.AnimatorStateInfo;
            public GetNextAnimatorStateInfo(layerIndex: number):UnityEngine.AnimatorStateInfo;
            public GetAnimatorTransitionInfo(layerIndex: number):UnityEngine.AnimatorTransitionInfo;
            public GetCurrentAnimatorClipInfoCount(layerIndex: number):number;
            public GetNextAnimatorClipInfoCount(layerIndex: number):number;
            public GetCurrentAnimatorClipInfo(layerIndex: number):UnityEngine.AnimatorClipInfo[];
            public GetNextAnimatorClipInfo(layerIndex: number):UnityEngine.AnimatorClipInfo[];
            public GetCurrentAnimatorClipInfo(layerIndex: number, clips: System.Collections.Generic.List$1<UnityEngine.AnimatorClipInfo>):void;
            public GetNextAnimatorClipInfo(layerIndex: number, clips: System.Collections.Generic.List$1<UnityEngine.AnimatorClipInfo>):void;
            public IsInTransition(layerIndex: number):boolean;
            public GetParameter(index: number):UnityEngine.AnimatorControllerParameter;
            public MatchTarget(matchPosition: UnityEngine.Vector3, matchRotation: UnityEngine.Quaternion, targetBodyPart: UnityEngine.AvatarTarget, weightMask: UnityEngine.MatchTargetWeightMask, startNormalizedTime: number):void;
            public MatchTarget(matchPosition: UnityEngine.Vector3, matchRotation: UnityEngine.Quaternion, targetBodyPart: UnityEngine.AvatarTarget, weightMask: UnityEngine.MatchTargetWeightMask, startNormalizedTime: number, targetNormalizedTime: number):void;
            public InterruptMatchTarget():void;
            public InterruptMatchTarget(completeMatch: boolean):void;
            public ForceStateNormalizedTime(normalizedTime: number):void;
            public CrossFadeInFixedTime(stateName: string, fixedTransitionDuration: number):void;
            public CrossFadeInFixedTime(stateName: string, fixedTransitionDuration: number, layer: number):void;
            public CrossFadeInFixedTime(stateName: string, fixedTransitionDuration: number, layer: number, fixedTimeOffset: number):void;
            public CrossFadeInFixedTime(stateName: string, fixedTransitionDuration: number, layer: number, fixedTimeOffset: number, normalizedTransitionTime: number):void;
            public CrossFadeInFixedTime(stateHashName: number, fixedTransitionDuration: number, layer: number, fixedTimeOffset: number):void;
            public CrossFadeInFixedTime(stateHashName: number, fixedTransitionDuration: number, layer: number):void;
            public CrossFadeInFixedTime(stateHashName: number, fixedTransitionDuration: number):void;
            public CrossFadeInFixedTime(stateHashName: number, fixedTransitionDuration: number, layer: number, fixedTimeOffset: number, normalizedTransitionTime: number):void;
            public WriteDefaultValues():void;
            public CrossFade(stateName: string, normalizedTransitionDuration: number, layer: number, normalizedTimeOffset: number):void;
            public CrossFade(stateName: string, normalizedTransitionDuration: number, layer: number):void;
            public CrossFade(stateName: string, normalizedTransitionDuration: number):void;
            public CrossFade(stateName: string, normalizedTransitionDuration: number, layer: number, normalizedTimeOffset: number, normalizedTransitionTime: number):void;
            public CrossFade(stateHashName: number, normalizedTransitionDuration: number, layer: number, normalizedTimeOffset: number, normalizedTransitionTime: number):void;
            public CrossFade(stateHashName: number, normalizedTransitionDuration: number, layer: number, normalizedTimeOffset: number):void;
            public CrossFade(stateHashName: number, normalizedTransitionDuration: number, layer: number):void;
            public CrossFade(stateHashName: number, normalizedTransitionDuration: number):void;
            public PlayInFixedTime(stateName: string, layer: number):void;
            public PlayInFixedTime(stateName: string):void;
            public PlayInFixedTime(stateName: string, layer: number, fixedTime: number):void;
            public PlayInFixedTime(stateNameHash: number, layer: number, fixedTime: number):void;
            public PlayInFixedTime(stateNameHash: number, layer: number):void;
            public PlayInFixedTime(stateNameHash: number):void;
            public Play(stateName: string, layer: number):void;
            public Play(stateName: string):void;
            public Play(stateName: string, layer: number, normalizedTime: number):void;
            public Play(stateNameHash: number, layer: number, normalizedTime: number):void;
            public Play(stateNameHash: number, layer: number):void;
            public Play(stateNameHash: number):void;
            public SetTarget(targetIndex: UnityEngine.AvatarTarget, targetNormalizedTime: number):void;
            public GetBoneTransform(humanBoneId: UnityEngine.HumanBodyBones):UnityEngine.Transform;
            public StartPlayback():void;
            public StopPlayback():void;
            public StartRecording(frameCount: number):void;
            public StopRecording():void;
            public HasState(layerIndex: number, stateID: number):boolean;
            public static StringToHash(name: string):number;
            public Update(deltaTime: number):void;
            public Rebind():void;
            public ApplyBuiltinRootMotion():void;
            public GetVector(name: string):UnityEngine.Vector3;
            public GetVector(id: number):UnityEngine.Vector3;
            public SetVector(name: string, value: UnityEngine.Vector3):void;
            public SetVector(id: number, value: UnityEngine.Vector3):void;
            public GetQuaternion(name: string):UnityEngine.Quaternion;
            public GetQuaternion(id: number):UnityEngine.Quaternion;
            public SetQuaternion(name: string, value: UnityEngine.Quaternion):void;
            public SetQuaternion(id: number, value: UnityEngine.Quaternion):void;
            
        }
        class AnimationInfo extends System.ValueType {
            
        }
        enum AnimatorUpdateMode { Normal = 0, AnimatePhysics = 1, UnscaledTime = 2 }
        enum AvatarIKGoal { LeftFoot = 0, RightFoot = 1, LeftHand = 2, RightHand = 3 }
        enum AvatarIKHint { LeftKnee = 0, RightKnee = 1, LeftElbow = 2, RightElbow = 3 }
        enum HumanBodyBones { Hips = 0, LeftUpperLeg = 1, RightUpperLeg = 2, LeftLowerLeg = 3, RightLowerLeg = 4, LeftFoot = 5, RightFoot = 6, Spine = 7, Chest = 8, UpperChest = 54, Neck = 9, Head = 10, LeftShoulder = 11, RightShoulder = 12, LeftUpperArm = 13, RightUpperArm = 14, LeftLowerArm = 15, RightLowerArm = 16, LeftHand = 17, RightHand = 18, LeftToes = 19, RightToes = 20, LeftEye = 21, RightEye = 22, Jaw = 23, LeftThumbProximal = 24, LeftThumbIntermediate = 25, LeftThumbDistal = 26, LeftIndexProximal = 27, LeftIndexIntermediate = 28, LeftIndexDistal = 29, LeftMiddleProximal = 30, LeftMiddleIntermediate = 31, LeftMiddleDistal = 32, LeftRingProximal = 33, LeftRingIntermediate = 34, LeftRingDistal = 35, LeftLittleProximal = 36, LeftLittleIntermediate = 37, LeftLittleDistal = 38, RightThumbProximal = 39, RightThumbIntermediate = 40, RightThumbDistal = 41, RightIndexProximal = 42, RightIndexIntermediate = 43, RightIndexDistal = 44, RightMiddleProximal = 45, RightMiddleIntermediate = 46, RightMiddleDistal = 47, RightRingProximal = 48, RightRingIntermediate = 49, RightRingDistal = 50, RightLittleProximal = 51, RightLittleIntermediate = 52, RightLittleDistal = 53, LastBone = 55 }
        class ScriptableObject extends UnityEngine.Object {
            
        }
        class StateMachineBehaviour extends UnityEngine.ScriptableObject {
            
        }
        class AnimatorStateInfo extends System.ValueType {
            
        }
        class AnimatorTransitionInfo extends System.ValueType {
            
        }
        class AnimatorClipInfo extends System.ValueType {
            
        }
        class AnimatorControllerParameter extends System.Object {
            
        }
        enum AvatarTarget { Root = 0, Body = 1, LeftFoot = 2, RightFoot = 3, LeftHand = 4, RightHand = 5 }
        class MatchTargetWeightMask extends System.ValueType {
            
        }
        enum AnimatorCullingMode { AlwaysAnimate = 0, CullUpdateTransforms = 1, CullCompletely = 2, BasedOnRenderers = 1 }
        enum AnimatorRecorderMode { Offline = 0, Playback = 1, Record = 2 }
        class RuntimeAnimatorController extends UnityEngine.Object {
            
        }
        class Avatar extends UnityEngine.Object {
            
        }
        class Color32 extends System.ValueType {
            
        }
        
    }
    namespace System.Collections.Generic {
        class List$1<T> extends System.Object {
            public Capacity: number;
            public Count: number;
            public Item: T;
            public constructor();
            public constructor(capacity: number);
            public constructor(collection: System.Collections.Generic.IEnumerable$1<T>);
            public get_Item(index: number):T;
            public set_Item(index: number, value: T):void;
            public Add(item: T):void;
            public AddRange(collection: System.Collections.Generic.IEnumerable$1<T>):void;
            public AsReadOnly():System.Collections.ObjectModel.ReadOnlyCollection$1<T>;
            public BinarySearch(index: number, count: number, item: T, comparer: System.Collections.Generic.IComparer$1<T>):number;
            public BinarySearch(item: T):number;
            public BinarySearch(item: T, comparer: System.Collections.Generic.IComparer$1<T>):number;
            public Clear():void;
            public Contains(item: T):boolean;
            public CopyTo(array: T[]):void;
            public CopyTo(index: number, array: T[], arrayIndex: number, count: number):void;
            public CopyTo(array: T[], arrayIndex: number):void;
            public Exists(match: System.Predicate$1<T>):boolean;
            public Find(match: System.Predicate$1<T>):T;
            public FindAll(match: System.Predicate$1<T>):System.Collections.Generic.List$1<T>;
            public FindIndex(match: System.Predicate$1<T>):number;
            public FindIndex(startIndex: number, match: System.Predicate$1<T>):number;
            public FindIndex(startIndex: number, count: number, match: System.Predicate$1<T>):number;
            public FindLast(match: System.Predicate$1<T>):T;
            public FindLastIndex(match: System.Predicate$1<T>):number;
            public FindLastIndex(startIndex: number, match: System.Predicate$1<T>):number;
            public FindLastIndex(startIndex: number, count: number, match: System.Predicate$1<T>):number;
            public ForEach(action: System.Action$1<T>):void;
            public GetEnumerator():System.Collections.Generic.List$1.Enumerator<T>;
            public GetRange(index: number, count: number):System.Collections.Generic.List$1<T>;
            public IndexOf(item: T):number;
            public IndexOf(item: T, index: number):number;
            public IndexOf(item: T, index: number, count: number):number;
            public Insert(index: number, item: T):void;
            public InsertRange(index: number, collection: System.Collections.Generic.IEnumerable$1<T>):void;
            public LastIndexOf(item: T):number;
            public LastIndexOf(item: T, index: number):number;
            public LastIndexOf(item: T, index: number, count: number):number;
            public Remove(item: T):boolean;
            public RemoveAll(match: System.Predicate$1<T>):number;
            public RemoveAt(index: number):void;
            public RemoveRange(index: number, count: number):void;
            public Reverse():void;
            public Reverse(index: number, count: number):void;
            public Sort():void;
            public Sort(comparer: System.Collections.Generic.IComparer$1<T>):void;
            public Sort(index: number, count: number, comparer: System.Collections.Generic.IComparer$1<T>):void;
            public Sort(comparison: System.Comparison$1<T>):void;
            public ToArray():T[];
            public TrimExcess():void;
            public TrueForAll(match: System.Predicate$1<T>):boolean;
            
        }
        interface IEnumerable$1<T> {
            
        }
        interface IComparer$1<T> {
            
        }
        interface IList$1<T> {
            
        }
        class Dictionary$2<TKey,TValue> extends System.Object {
            
        }
        
    }
    namespace System.Collections.ObjectModel {
        class ReadOnlyCollection$1<T> extends System.Object {
            
        }
        
    }
    namespace System.Collections.Generic.List$1 {
        class Enumerator<T> extends System.ValueType {
            
        }
        
    }
    namespace System.Collections {
        interface IEnumerator {
            
        }
        
    }
    namespace UnityEngine.RectTransform {
        type ReapplyDrivenProperties = (driven: UnityEngine.RectTransform) => void;
        var ReapplyDrivenProperties: {new (func: (driven: UnityEngine.RectTransform) => void): ReapplyDrivenProperties;}
        enum Edge { Left = 0, Right = 1, Top = 2, Bottom = 3 }
        enum Axis { Horizontal = 0, Vertical = 1 }
        
    }
    namespace System.Reflection {
        class MemberInfo extends System.Object {
            
        }
        class MethodBase extends System.Reflection.MemberInfo {
            
        }
        class MethodInfo extends System.Reflection.MethodBase {
            
        }
        
    }
    namespace UnityEngine.Rendering {
        enum ShadowCastingMode { Off = 0, On = 1, TwoSided = 2, ShadowsOnly = 3 }
        enum LightProbeUsage { Off = 0, BlendProbes = 1, UseProxyVolume = 2, CustomProvided = 4 }
        enum ReflectionProbeUsage { Off = 0, BlendProbes = 1, BlendProbesAndSkybox = 2, Simple = 3 }
        class ReflectionProbeBlendInfo extends System.ValueType {
            
        }
        enum OpaqueSortMode { Default = 0, FrontToBack = 1, NoDistanceSort = 2 }
        enum CameraEvent { BeforeDepthTexture = 0, AfterDepthTexture = 1, BeforeDepthNormalsTexture = 2, AfterDepthNormalsTexture = 3, BeforeGBuffer = 4, AfterGBuffer = 5, BeforeLighting = 6, AfterLighting = 7, BeforeFinalPass = 8, AfterFinalPass = 9, BeforeForwardOpaque = 10, AfterForwardOpaque = 11, BeforeImageEffectsOpaque = 12, AfterImageEffectsOpaque = 13, BeforeSkybox = 14, AfterSkybox = 15, BeforeForwardAlpha = 16, AfterForwardAlpha = 17, BeforeImageEffects = 18, AfterImageEffects = 19, AfterEverything = 20, BeforeReflections = 21, AfterReflections = 22, BeforeHaloAndLensFlares = 23, AfterHaloAndLensFlares = 24 }
        class CommandBuffer extends System.Object {
            
        }
        enum ComputeQueueType { Default = 0, Background = 1, Urgent = 2 }
        
    }
    namespace UnityEngine.SceneManagement {
        class Scene extends System.ValueType {
            
        }
        
    }
    namespace System.Runtime.Serialization {
        class SerializationInfo extends System.Object {
            
        }
        class StreamingContext extends System.ValueType {
            
        }
        
    }
    namespace UnityEngine.EventSystems {
        class UIBehaviour extends UnityEngine.MonoBehaviour {
            
        }
        class AbstractEventData extends System.Object {
            
        }
        class BaseEventData extends UnityEngine.EventSystems.AbstractEventData {
            public currentInputModule: UnityEngine.EventSystems.BaseInputModule;
            public selectedObject: UnityEngine.GameObject;
            public constructor(eventSystem: UnityEngine.EventSystems.EventSystem);
            
        }
        class PointerEventData extends UnityEngine.EventSystems.BaseEventData {
            
        }
        class EventTrigger extends UnityEngine.MonoBehaviour {
            public triggers: System.Collections.Generic.List$1<UnityEngine.EventSystems.EventTrigger.Entry>;
            public OnPointerEnter(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnPointerExit(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnDrag(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnDrop(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnPointerDown(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnPointerUp(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnPointerClick(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnSelect(eventData: UnityEngine.EventSystems.BaseEventData):void;
            public OnDeselect(eventData: UnityEngine.EventSystems.BaseEventData):void;
            public OnScroll(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnMove(eventData: UnityEngine.EventSystems.AxisEventData):void;
            public OnUpdateSelected(eventData: UnityEngine.EventSystems.BaseEventData):void;
            public OnInitializePotentialDrag(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnBeginDrag(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnEndDrag(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnSubmit(eventData: UnityEngine.EventSystems.BaseEventData):void;
            public OnCancel(eventData: UnityEngine.EventSystems.BaseEventData):void;
            
        }
        class AxisEventData extends UnityEngine.EventSystems.BaseEventData {
            
        }
        class BaseInputModule extends UnityEngine.EventSystems.UIBehaviour {
            
        }
        class EventSystem extends UnityEngine.EventSystems.UIBehaviour {
            
        }
        enum EventTriggerType { PointerEnter = 0, PointerExit = 1, PointerDown = 2, PointerUp = 3, PointerClick = 4, Drag = 5, Drop = 6, Scroll = 7, UpdateSelected = 8, Select = 9, Deselect = 10, Move = 11, InitializePotentialDrag = 12, BeginDrag = 13, EndDrag = 14, Submit = 15, Cancel = 16 }
        
    }
    namespace UnityEngine.UI {
        class Graphic extends UnityEngine.EventSystems.UIBehaviour {
            
        }
        class MaskableGraphic extends UnityEngine.UI.Graphic {
            
        }
        class Image extends UnityEngine.UI.MaskableGraphic {
            public sprite: UnityEngine.Sprite;
            public overrideSprite: UnityEngine.Sprite;
            public type: UnityEngine.UI.Image.Type;
            public preserveAspect: boolean;
            public fillCenter: boolean;
            public fillMethod: UnityEngine.UI.Image.FillMethod;
            public fillAmount: number;
            public fillClockwise: boolean;
            public fillOrigin: number;
            public eventAlphaThreshold: number;
            public alphaHitTestMinimumThreshold: number;
            public useSpriteMesh: boolean;
            public static defaultETC1GraphicMaterial: UnityEngine.Material;
            public mainTexture: UnityEngine.Texture;
            public hasBorder: boolean;
            public pixelsPerUnit: number;
            public material: UnityEngine.Material;
            public minWidth: number;
            public preferredWidth: number;
            public flexibleWidth: number;
            public minHeight: number;
            public preferredHeight: number;
            public flexibleHeight: number;
            public layoutPriority: number;
            public OnBeforeSerialize():void;
            public OnAfterDeserialize():void;
            public SetNativeSize():void;
            public CalculateLayoutInputHorizontal():void;
            public CalculateLayoutInputVertical():void;
            public IsRaycastLocationValid(screenPoint: UnityEngine.Vector2, eventCamera: UnityEngine.Camera):boolean;
            
        }
        class Text extends UnityEngine.UI.MaskableGraphic {
            public cachedTextGenerator: UnityEngine.TextGenerator;
            public cachedTextGeneratorForLayout: UnityEngine.TextGenerator;
            public mainTexture: UnityEngine.Texture;
            public font: UnityEngine.Font;
            public text: string;
            public supportRichText: boolean;
            public resizeTextForBestFit: boolean;
            public resizeTextMinSize: number;
            public resizeTextMaxSize: number;
            public alignment: UnityEngine.TextAnchor;
            public alignByGeometry: boolean;
            public fontSize: number;
            public horizontalOverflow: UnityEngine.HorizontalWrapMode;
            public verticalOverflow: UnityEngine.VerticalWrapMode;
            public lineSpacing: number;
            public fontStyle: UnityEngine.FontStyle;
            public pixelsPerUnit: number;
            public minWidth: number;
            public preferredWidth: number;
            public flexibleWidth: number;
            public minHeight: number;
            public preferredHeight: number;
            public flexibleHeight: number;
            public layoutPriority: number;
            public FontTextureChanged():void;
            public GetGenerationSettings(extents: UnityEngine.Vector2):UnityEngine.TextGenerationSettings;
            public static GetTextAnchorPivot(anchor: UnityEngine.TextAnchor):UnityEngine.Vector2;
            public CalculateLayoutInputHorizontal():void;
            public CalculateLayoutInputVertical():void;
            
        }
        class Selectable extends UnityEngine.EventSystems.UIBehaviour {
            
        }
        class Button extends UnityEngine.UI.Selectable {
            public onClick: UnityEngine.UI.Button.ButtonClickedEvent;
            public OnPointerClick(eventData: UnityEngine.EventSystems.PointerEventData):void;
            public OnSubmit(eventData: UnityEngine.EventSystems.BaseEventData):void;
            
        }
        class BaseMeshEffect extends UnityEngine.EventSystems.UIBehaviour {
            
        }
        class Shadow extends UnityEngine.UI.BaseMeshEffect {
            public effectColor: UnityEngine.Color;
            public effectDistance: UnityEngine.Vector2;
            public useGraphicAlpha: boolean;
            public ModifyMesh(vh: UnityEngine.UI.VertexHelper):void;
            
        }
        class Outline extends UnityEngine.UI.Shadow {
            public ModifyMesh(vh: UnityEngine.UI.VertexHelper):void;
            
        }
        class VertexHelper extends System.Object {
            
        }
        enum CanvasUpdate { Prelayout = 0, Layout = 1, PostLayout = 2, PreRender = 3, LatePreRender = 4, MaxUpdateValue = 5 }
        
    }
    namespace UnityEngine.UI.Image {
        enum Type { Simple = 0, Sliced = 1, Tiled = 2, Filled = 3 }
        enum FillMethod { Horizontal = 0, Vertical = 1, Radial90 = 2, Radial180 = 3, Radial360 = 4 }
        
    }
    namespace UnityEngine.Events {
        class UnityEventBase extends System.Object {
            
        }
        class UnityEvent extends UnityEngine.Events.UnityEventBase {
            public constructor();
            public AddListener(call: UnityEngine.Events.UnityAction):void;
            public RemoveListener(call: UnityEngine.Events.UnityAction):void;
            public Invoke():void;
            
        }
        type UnityAction = () => void;
        var UnityAction: {new (func: () => void): UnityAction;}
        type UnityAction$1<T0> = (arg0: T0) => void;
        
    }
    namespace UnityEngine.UI.Button {
        class ButtonClickedEvent extends UnityEngine.Events.UnityEvent {
            public constructor();
            
        }
        
    }
    namespace UnityEngine.Camera {
        type CameraCallback = (cam: UnityEngine.Camera) => void;
        var CameraCallback: {new (func: (cam: UnityEngine.Camera) => void): CameraCallback;}
        enum GateFitMode { Vertical = 1, Horizontal = 2, Fill = 3, Overscan = 4, None = 0 }
        enum MonoOrStereoscopicEye { Left = 0, Right = 1, Mono = 2 }
        class GateFitParameters extends System.ValueType {
            
        }
        enum StereoscopicEye { Left = 0, Right = 1 }
        
    }
    namespace UnityEngine.EventSystems.EventTrigger {
        class Entry extends System.Object {
            
        }
        
    }
    namespace UnityEngine.Playables {
        class PlayableGraph extends System.ValueType {
            
        }
        
    }
    namespace Spine {
        class Animation extends System.Object {
            public Name: string;
            public Timelines: Spine.ExposedList$1<Spine.Timeline>;
            public Duration: number;
            public constructor(name: string, timelines: Spine.ExposedList$1<Spine.Timeline>, duration: number);
            public Apply(skeleton: Spine.Skeleton, lastTime: number, time: number, loop: boolean, events: Spine.ExposedList$1<Spine.Event>, alpha: number, pose: Spine.MixPose, direction: Spine.MixDirection):void;
            
        }
        interface Timeline {
            
        }
        class ExposedList$1<T> extends System.Object {
            
        }
        class Skeleton extends System.Object {
            
        }
        class Event extends System.Object {
            
        }
        enum MixPose { Setup = 0, Current = 1, CurrentLayered = 2 }
        enum MixDirection { In = 0, Out = 1 }
        class AnimationState extends System.Object {
            public Data: Spine.AnimationStateData;
            public Tracks: Spine.ExposedList$1<Spine.TrackEntry>;
            public TimeScale: number;
            public constructor(data: Spine.AnimationStateData);
            public add_Start(value: Spine.AnimationState.TrackEntryDelegate):void;
            public remove_Start(value: Spine.AnimationState.TrackEntryDelegate):void;
            public add_Interrupt(value: Spine.AnimationState.TrackEntryDelegate):void;
            public remove_Interrupt(value: Spine.AnimationState.TrackEntryDelegate):void;
            public add_End(value: Spine.AnimationState.TrackEntryDelegate):void;
            public remove_End(value: Spine.AnimationState.TrackEntryDelegate):void;
            public add_Dispose(value: Spine.AnimationState.TrackEntryDelegate):void;
            public remove_Dispose(value: Spine.AnimationState.TrackEntryDelegate):void;
            public add_Complete(value: Spine.AnimationState.TrackEntryDelegate):void;
            public remove_Complete(value: Spine.AnimationState.TrackEntryDelegate):void;
            public add_Event(value: Spine.AnimationState.TrackEntryEventDelegate):void;
            public remove_Event(value: Spine.AnimationState.TrackEntryEventDelegate):void;
            public Update(delta: number):void;
            public Apply(skeleton: Spine.Skeleton):boolean;
            public ClearTracks():void;
            public ClearTrack(trackIndex: number):void;
            public SetAnimation(trackIndex: number, animationName: string, loop: boolean):Spine.TrackEntry;
            public SetAnimationByIndex(trackIndex: number, animationIndex: number, loop: boolean):Spine.TrackEntry;
            public SetAnimation(trackIndex: number, animation: Spine.Animation, loop: boolean):Spine.TrackEntry;
            public AddAnimation(trackIndex: number, animationName: string, loop: boolean, delay: number):Spine.TrackEntry;
            public AddAnimation(trackIndex: number, animation: Spine.Animation, loop: boolean, delay: number):Spine.TrackEntry;
            public SetEmptyAnimation(trackIndex: number, mixDuration: number):Spine.TrackEntry;
            public AddEmptyAnimation(trackIndex: number, mixDuration: number, delay: number):Spine.TrackEntry;
            public SetEmptyAnimations(mixDuration: number):void;
            public GetCurrent(trackIndex: number):Spine.TrackEntry;
            public ToString():string;
            
        }
        class AnimationStateData extends System.Object {
            
        }
        class TrackEntry extends System.Object {
            
        }
        class Bone extends System.Object {
            public static yDown: boolean;
            public Data: Spine.BoneData;
            public Skeleton: Spine.Skeleton;
            public Parent: Spine.Bone;
            public Children: Spine.ExposedList$1<Spine.Bone>;
            public X: number;
            public Y: number;
            public Rotation: number;
            public ScaleX: number;
            public ScaleY: number;
            public ShearX: number;
            public ShearY: number;
            public AppliedRotation: number;
            public AX: number;
            public AY: number;
            public AScaleX: number;
            public AScaleY: number;
            public AShearX: number;
            public AShearY: number;
            public A: number;
            public B: number;
            public C: number;
            public D: number;
            public WorldX: number;
            public WorldY: number;
            public WorldRotationX: number;
            public WorldRotationY: number;
            public WorldScaleX: number;
            public WorldScaleY: number;
            public WorldToLocalRotationX: number;
            public WorldToLocalRotationY: number;
            public constructor(data: Spine.BoneData, skeleton: Spine.Skeleton, parent: Spine.Bone);
            public Update():void;
            public UpdateWorldTransform():void;
            public UpdateWorldTransform(x: number, y: number, rotation: number, scaleX: number, scaleY: number, shearX: number, shearY: number):void;
            public SetToSetupPose():void;
            public WorldToLocal(worldX: number, worldY: number, localX: $Ref<number>, localY: $Ref<number>):void;
            public LocalToWorld(localX: number, localY: number, worldX: $Ref<number>, worldY: $Ref<number>):void;
            public WorldToLocalRotation(worldRotation: number):number;
            public LocalToWorldRotation(localRotation: number):number;
            public RotateWorld(degrees: number):void;
            public ToString():string;
            
        }
        class BoneData extends System.Object {
            
        }
        class SkeletonData extends System.Object {
            
        }
        
    }
    namespace Spine.AnimationState {
        type TrackEntryDelegate = (trackEntry: Spine.TrackEntry) => void;
        var TrackEntryDelegate: {new (func: (trackEntry: Spine.TrackEntry) => void): TrackEntryDelegate;}
        type TrackEntryEventDelegate = (trackEntry: Spine.TrackEntry, e: Spine.Event) => void;
        var TrackEntryEventDelegate: {new (func: (trackEntry: Spine.TrackEntry, e: Spine.Event) => void): TrackEntryEventDelegate;}
        
    }
    namespace Spine.Unity {
        class SkeletonGraphic extends UnityEngine.UI.MaskableGraphic {
            public skeletonDataAsset: Spine.Unity.SkeletonDataAsset;
            public initialSkinName: string;
            public initialFlipX: boolean;
            public initialFlipY: boolean;
            public startingAnimation: string;
            public startingLoop: boolean;
            public timeScale: number;
            public freeze: boolean;
            public unscaledTime: boolean;
            public SkeletonDataAsset: Spine.Unity.SkeletonDataAsset;
            public OverrideTexture: UnityEngine.Texture;
            public mainTexture: UnityEngine.Texture;
            public Skeleton: Spine.Skeleton;
            public SkeletonData: Spine.SkeletonData;
            public IsValid: boolean;
            public AnimationState: Spine.AnimationState;
            public MeshGenerator: Spine.Unity.MeshGenerator;
            public constructor();
            public static NewSkeletonGraphicGameObject(skeletonDataAsset: Spine.Unity.SkeletonDataAsset, parent: UnityEngine.Transform):Spine.Unity.SkeletonGraphic;
            public static AddSkeletonGraphicComponent(gameObject: UnityEngine.GameObject, skeletonDataAsset: Spine.Unity.SkeletonDataAsset):Spine.Unity.SkeletonGraphic;
            public Rebuild(update: UnityEngine.UI.CanvasUpdate):void;
            public Update():void;
            public Update(deltaTime: number):void;
            public LateUpdate():void;
            public GetLastMesh():UnityEngine.Mesh;
            public add_UpdateLocal(value: Spine.Unity.UpdateBonesDelegate):void;
            public remove_UpdateLocal(value: Spine.Unity.UpdateBonesDelegate):void;
            public add_UpdateWorld(value: Spine.Unity.UpdateBonesDelegate):void;
            public remove_UpdateWorld(value: Spine.Unity.UpdateBonesDelegate):void;
            public add_UpdateComplete(value: Spine.Unity.UpdateBonesDelegate):void;
            public remove_UpdateComplete(value: Spine.Unity.UpdateBonesDelegate):void;
            public add_OnPostProcessVertices(value: Spine.Unity.MeshGeneratorDelegate):void;
            public remove_OnPostProcessVertices(value: Spine.Unity.MeshGeneratorDelegate):void;
            public Clear():void;
            public Initialize(overwrite: boolean):void;
            public UpdateMesh():void;
            
        }
        class SkeletonDataAsset extends UnityEngine.ScriptableObject {
            
        }
        class MeshGenerator extends System.Object {
            
        }
        type UpdateBonesDelegate = (animated: Spine.Unity.ISkeletonAnimation) => void;
        var UpdateBonesDelegate: {new (func: (animated: Spine.Unity.ISkeletonAnimation) => void): UpdateBonesDelegate;}
        type MeshGeneratorDelegate = (buffers: Spine.Unity.MeshGeneratorBuffers) => void;
        var MeshGeneratorDelegate: {new (func: (buffers: Spine.Unity.MeshGeneratorBuffers) => void): MeshGeneratorDelegate;}
        class MeshGeneratorBuffers extends System.ValueType {
            public vertexCount: number;
            public vertexBuffer: UnityEngine.Vector3[];
            public uvBuffer: UnityEngine.Vector2[];
            public colorBuffer: UnityEngine.Color32[];
            public meshGenerator: Spine.Unity.MeshGenerator;
            
        }
        
    }
    namespace Resource {
        class ResourceManager extends System.Object {
            public static BUNDLE_PATH: string;
            public static BYTES_PATH: string;
            public static TEMP_PATH: string;
            public static assetPath: string;
            public static bytesLuaTxtPath: string;
            public currentSceneName: string;
            public static gameVersion: string;
            public static bytesVersion: number;
            public static bundleVersion: number;
            public spriteRendererMaterialDic: System.Collections.Generic.Dictionary$2<string, UnityEngine.Material>;
            public static Instance: Resource.ResourceManager;
            public Init(go: UnityEngine.GameObject):void;
            public Dispose():void;
            public CheckReourceUpdate(checkCallback: System.Action$2<number, number>, versionCallback: System.Action$1<string>):void;
            public DownloadResources(updateCallback: System.Action$3<bigint, bigint, bigint>):void;
            public DownloadDispose():void;
            public UncompressResources(uncompressCallback: System.Action$2<number, number>):void;
            public RemoveDonwloadObject():void;
            public InitLoadManager():void;
            public luaLoadAsset(assetName: string, path: string, bundleName: string):UnityEngine.GameObject;
            public luaLoadSpriteAsset(assetName: string, path: string, bundleName: string):UnityEngine.Sprite;
            public FindInBundle(shaderName: string, bundleName: string):UnityEngine.Shader;
            public GetCustomSpriteRendererMaterial(alphaTexture2d: UnityEngine.Texture2D):UnityEngine.Material;
            public ReleaseAsset(bundleName: string, assetName: string):void;
            public UnloadBundleByName(bundleName: string, unloadAllLoadedObjects: boolean):void;
            public GetBundleInfo(name: string):string[];
            public GetString(id: string):string;
            
        }
        
    }
    namespace GameUtils {
        class CommonUtil extends System.Object {
            public static IsIphoneX: boolean;
            public constructor();
            public static GetPlatformString():string;
            public static EncodingToMd5(data: string):string;
            public static ReverseBytes(inArray: number[]):number[];
            public static GetTimeStamp():string;
            public static GetTimeMiniStamp():bigint;
            public static DebugLogByteArrayContent(data: number[], length: number, name: string):void;
            
        }
        class ViewExtensionMethods extends System.Object {
            public static MouseButtonDown():boolean;
            public static CameraToRaycastHitObjectClick(c: UnityEngine.Camera, go: UnityEngine.GameObject, onClickHandle: System.Action):boolean;
            public static SetChildrenLayer(obj: UnityEngine.GameObject, Layer: string):void;
            public static PlaySounds(obj: UnityEngine.GameObject, isPreloading: boolean, assetName: string, path: string, bundleName: string, delay: number):void;
            public static ClearSounds(obj: UnityEngine.GameObject):void;
            public static SetObj2dPos(trans: UnityEngine.RectTransform, x: number, y: number):void;
            public static SetObj3dPos(trans: UnityEngine.Transform, x: number, y: number, z: number):void;
            public static SetObjRotation(trans: UnityEngine.Transform, x: number, y: number, z: number):void;
            public static SetObjScale(trans: UnityEngine.Transform, x: number, y: number, z: number):void;
            public static SetLocalScaleSize(trans: UnityEngine.Transform, scale: number):void;
            public static SetImageColor(img: UnityEngine.UI.Image, r: number, g: number, b: number, a: number):void;
            public static SetLabelColor(txt: UnityEngine.UI.Text, r: number, g: number, b: number, a: number):void;
            public static initVec3(x: number, y: number, z: number):UnityEngine.Vector3;
            public static initVec2(x: number, y: number):UnityEngine.Vector2;
            public static initColor(r: number, g: number, b: number, a: number):UnityEngine.Color;
            public static RemoveAllChild(tran: UnityEngine.Transform):void;
            public static GetChildByName(tran: UnityEngine.Transform, name: string):UnityEngine.GameObject;
            public static GetRaycastHit():UnityEngine.RaycastHit;
            
        }
        class ComponentExtension extends System.Object {
            public constructor();
            public static AddCompListener(obj: UnityEngine.GameObject, eventTriggerType: UnityEngine.EventSystems.EventTriggerType, callback: GameUtils.ComponentEventDelege):void;
            
        }
        type ComponentEventDelege = (eventData: UnityEngine.EventSystems.BaseEventData) => void;
        var ComponentEventDelege: {new (func: (eventData: UnityEngine.EventSystems.BaseEventData) => void): ComponentEventDelege;}
        class PhysicsExtensionMethods extends System.Object {
            public static tempRayCastHit: UnityEngine.RaycastHit;
            public static rayCastHit(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, maxDistance: number, maskLayer: number):boolean;
            
        }
        class ColliderListenerExpand extends UnityEngine.MonoBehaviour {
            public OnTriggerEnterDelegate: GameUtils.ColliderDelege;
            public OnTriggerExitDelegate: GameUtils.ColliderDelege;
            public OnTriggerStayDelegate: GameUtils.ColliderDelege;
            public OnCollisionEnterDelegate: GameUtils.CollisionDelege;
            public OnCollisionExitDelegate: GameUtils.CollisionDelege;
            public OnCollisionStayDelegate: GameUtils.CollisionDelege;
            public OnControllerColliderHitDelegate: GameUtils.ControllerColliderDelege;
            public constructor();
            public destoryDelegate():void;
            
        }
        type ColliderDelege = (other: UnityEngine.Collider) => void;
        var ColliderDelege: {new (func: (other: UnityEngine.Collider) => void): ColliderDelege;}
        type CollisionDelege = (collision: UnityEngine.Collision) => void;
        var CollisionDelege: {new (func: (collision: UnityEngine.Collision) => void): CollisionDelege;}
        type ControllerColliderDelege = (collision: UnityEngine.ControllerColliderHit) => void;
        var ControllerColliderDelege: {new (func: (collision: UnityEngine.ControllerColliderHit) => void): ControllerColliderDelege;}
        
    }
    
}