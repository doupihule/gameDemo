// @ts-nocheck 

declare module 'csharp' {
    interface $Ref<T> {}
    
    interface $Task<T> {}
    
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
        class Color {
            
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
        class Quaternion {
            
        }
        class Matrix4x4 {
            
        }
        enum Space { World = 0, Self = 1 }
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
        class Rect {
            
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
        enum PrimitiveType { Sphere = 0, Capsule = 1, Cylinder = 2, Cube = 3, Plane = 4, Quad = 5 }
        enum HideFlags { None = 0, HideInHierarchy = 1, HideInInspector = 2, DontSaveInEditor = 4, NotEditable = 8, DontSaveInBuild = 16, DontUnloadUnusedAsset = 32, DontSave = 52, HideAndDontSave = 61 }
        class CanvasGroup extends UnityEngine.Behaviour {
            public alpha: number;
            public interactable: boolean;
            public blocksRaycasts: boolean;
            public ignoreParentGroups: boolean;
            public constructor();
            public IsRaycastLocationValid(sp: UnityEngine.Vector2, eventCamera: UnityEngine.Camera):boolean;
            
        }
        class Camera {
            
        }
        class Behaviour {
            
        }
        class Texture {
            
        }
        class Mesh {
            
        }
        class MonoBehaviour {
            
        }
        class Color32 {
            
        }
        
    }
    namespace System {
        class Void {
            
        }
        class Single {
            
        }
        class Boolean {
            
        }
        class Object {
            
        }
        class String {
            
        }
        class Exception {
            
        }
        class Int32 {
            
        }
        class ValueType {
            
        }
        type Converter$2<TInput,TOutput> = (input: TInput) => TOutput;
        type Predicate$1<T> = (obj: T) => boolean;
        type Action$1<T> = (obj: T) => void;
        type Comparison$1<T> = (x: T, y: T) => number;
        class Type {
            
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
        
    }
    namespace System.Collections.ObjectModel {
        class ReadOnlyCollection$1<T> {
            
        }
        
    }
    namespace System.Collections.Generic.List$1 {
        class Enumerator<T> {
            
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
    namespace UnityEngine.SceneManagement {
        class Scene {
            
        }
        
    }
    namespace System.Reflection {
        class MethodInfo {
            
        }
        
    }
    namespace System.Runtime.Serialization {
        class SerializationInfo {
            
        }
        class StreamingContext {
            
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
        class ExposedList$1<T> {
            
        }
        class Skeleton {
            
        }
        class Event {
            
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
        class AnimationStateData {
            
        }
        class TrackEntry {
            
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
        class BoneData {
            
        }
        class SkeletonData {
            
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
        class SkeletonDataAsset {
            
        }
        class MeshGenerator {
            
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
    namespace UnityEngine.UI {
        enum CanvasUpdate { Prelayout = 0, Layout = 1, PostLayout = 2, PreRender = 3, LatePreRender = 4, MaxUpdateValue = 5 }
        class MaskableGraphic {
            
        }
        class Graphic {
            
        }
        
    }
    namespace UnityEngine.EventSystems {
        class UIBehaviour {
            
        }
        
    }
    
}