/**
 * 修复 微信小程序中lodash 的运行环境
 */
export function lodashFix() {
  // @ts-ignore
  global.Object = Object;
  // @ts-ignore
  global.Array = Array;
  // @ts-ignore
  // global.Buffer = Buffer
  // @ts-ignore
  global.DataView = DataView;
  // @ts-ignore
  global.Date = Date;
  // @ts-ignore
  global.Error = Error;
  // @ts-ignore
  global.Float32Array = Float32Array;
  // @ts-ignore
  global.Float64Array = Float64Array;
  // @ts-ignore
  global.Function = Function;
  // @ts-ignore
  global.Int8Array = Int8Array;
  // @ts-ignore
  global.Int16Array = Int16Array;
  // @ts-ignore
  global.Int32Array = Int32Array;
  // @ts-ignore
  global.Map = Map;
  // @ts-ignore
  global.Math = Math;
  // @ts-ignore
  global.Promise = Promise;
  // @ts-ignore
  global.RegExp = RegExp;
  // @ts-ignore
  global.Set = Set;
  // @ts-ignore
  global.String = String;
  // @ts-ignore
  global.Symbol = Symbol;
  // @ts-ignore
  global.TypeError = TypeError;
  // @ts-ignore
  global.Uint8Array = Uint8Array;
  // @ts-ignore
  global.Uint8ClampedArray = Uint8ClampedArray;
  // @ts-ignore
  global.Uint16Array = Uint16Array;
  // @ts-ignore
  global.Uint32Array = Uint32Array;
  // @ts-ignore
  global.WeakMap = WeakMap;
  // @ts-ignore
  global.clearTimeout = clearTimeout;
  // @ts-ignore
  global.isFinite = isFinite;
  // @ts-ignore
  global.parseInt = parseInt;
  // @ts-ignore
  global.setTimeout = setTimeout;
}
