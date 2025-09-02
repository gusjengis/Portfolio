let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_30(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h0618a0929da6e504(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_39(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbf8137dc5dfc79f3(arg0, arg1);
}

function __wbg_adapter_50(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h886d14073acc90c2(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_55(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h757687f34733f859(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_58(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hfa39258b2a4ff59e(arg0, arg1, addHeapObject(arg2));
}

export function webmain() {
    wasm.webmain();
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

const __wbindgen_enum_GpuAddressMode = ["clamp-to-edge", "repeat", "mirror-repeat"];

const __wbindgen_enum_GpuAutoLayoutMode = ["auto"];

const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant"];

const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];

const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];

const __wbindgen_enum_GpuCanvasAlphaMode = ["opaque", "premultiplied"];

const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];

const __wbindgen_enum_GpuCompilationMessageType = ["error", "warning", "info"];

const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];

const __wbindgen_enum_GpuDeviceLostReason = ["destroyed"];

const __wbindgen_enum_GpuErrorFilter = ["validation", "out-of-memory", "internal"];

const __wbindgen_enum_GpuFeatureName = ["depth-clip-control", "depth32float-stencil8", "texture-compression-bc", "texture-compression-etc2", "texture-compression-astc", "timestamp-query", "indirect-first-instance", "shader-f16", "bgra8unorm-storage", "rg11b10ufloat-renderable"];

const __wbindgen_enum_GpuFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuFrontFace = ["ccw", "cw"];

const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];

const __wbindgen_enum_GpuLoadOp = ["load", "clear"];

const __wbindgen_enum_GpuMipmapFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuPowerPreference = ["low-power", "high-performance"];

const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];

const __wbindgen_enum_GpuQueryType = ["occlusion", "timestamp"];

const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];

const __wbindgen_enum_GpuStencilOperation = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];

const __wbindgen_enum_GpuStorageTextureAccess = ["write-only"];

const __wbindgen_enum_GpuStoreOp = ["store", "discard"];

const __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];

const __wbindgen_enum_GpuTextureDimension = ["1d", "2d", "3d"];

const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];

const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];

const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];

const __wbindgen_enum_GpuVertexFormat = ["uint8x2", "uint8x4", "sint8x2", "sint8x4", "unorm8x2", "unorm8x4", "snorm8x2", "snorm8x4", "uint16x2", "uint16x4", "sint16x2", "sint16x4", "unorm16x2", "unorm16x4", "snorm16x2", "snorm16x4", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4"];

const __wbindgen_enum_GpuVertexStepMode = ["vertex", "instance"];

const __wbindgen_enum_ResizeObserverBoxOptions = ["border-box", "content-box", "device-pixel-content-box"];

const __wbindgen_enum_VisibilityState = ["hidden", "visible"];

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_Window_3cfcdcb1aa106442 = function(arg0) {
        const ret = getObject(arg0).Window;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_WorkerGlobalScope_446a93e502b1149a = function(arg0) {
        const ret = getObject(arg0).WorkerGlobalScope;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_queueMicrotask_848aa4969108a57e = function(arg0) {
        const ret = getObject(arg0).queueMicrotask;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_c5419c06eab41e73 = function(arg0) {
        queueMicrotask(getObject(arg0));
    };
    imports.wbg.__wbg_instanceof_Window_9029196b662bc42a = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_document_f7ace2b956f30a4f = function(arg0) {
        const ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_navigator_7c9103698acde322 = function(arg0) {
        const ret = getObject(arg0).navigator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_innerWidth_ebe07ce5463ff293 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).innerWidth;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_innerHeight_2dd06d8cf68f1d7d = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).innerHeight;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_devicePixelRatio_f9de7bddca0eaf20 = function(arg0) {
        const ret = getObject(arg0).devicePixelRatio;
        return ret;
    };
    imports.wbg.__wbg_matchMedia_12ef69056e32d0b3 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).matchMedia(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_get_cb7c1c2da725c920 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0)[getStringFromWasm0(arg1, arg2)];
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_cancelAnimationFrame_9b68e9588c6543bc = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).cancelAnimationFrame(arg1);
    }, arguments) };
    imports.wbg.__wbg_requestAnimationFrame_d082200514b6674d = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clearTimeout_220be2fa0577b342 = function(arg0, arg1) {
        getObject(arg0).clearTimeout(arg1);
    };
    imports.wbg.__wbg_setTimeout_eb1a0d116c26d9f6 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_body_674aec4c1c0910cd = function(arg0) {
        const ret = getObject(arg0).body;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_fullscreenElement_07d5b77ef6c958c1 = function(arg0) {
        const ret = getObject(arg0).fullscreenElement;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createElement_4891554b28d3388b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_exitFullscreen_5fada21e8623256e = function(arg0) {
        getObject(arg0).exitFullscreen();
    };
    imports.wbg.__wbg_querySelectorAll_c03e8664a5a0f0c5 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).querySelectorAll(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setid_1984ee27e5075311 = function(arg0, arg1, arg2) {
        getObject(arg0).id = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_getBoundingClientRect_ac9db8cf97ca8083 = function(arg0) {
        const ret = getObject(arg0).getBoundingClientRect();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_requestFullscreen_3545278bcd44910c = function() { return handleError(function (arg0) {
        getObject(arg0).requestFullscreen();
    }, arguments) };
    imports.wbg.__wbg_setAttribute_e7e80b478b7b8b2f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setPointerCapture_e7c29336490bba19 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).setPointerCapture(arg1);
    }, arguments) };
    imports.wbg.__wbg_style_3801009b2339aa94 = function(arg0) {
        const ret = getObject(arg0).style;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_navigator_41bd88b80ed4685e = function(arg0) {
        const ret = getObject(arg0).navigator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_GpuAdapter_c0a5a310603ba618 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof GPUAdapter;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_features_88901f43932fb28e = function(arg0) {
        const ret = getObject(arg0).features;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_limits_a7f3fbf58768b61f = function(arg0) {
        const ret = getObject(arg0).limits;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_requestDevice_068e794820eb88eb = function(arg0, arg1) {
        const ret = getObject(arg0).requestDevice(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_error_f85e77a2651e41dc = function(arg0) {
        const ret = getObject(arg0).error;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_matches_0f7e350783b542c2 = function(arg0) {
        const ret = getObject(arg0).matches;
        return ret;
    };
    imports.wbg.__wbg_clientX_1a480606ab0cabaa = function(arg0) {
        const ret = getObject(arg0).clientX;
        return ret;
    };
    imports.wbg.__wbg_clientY_9c7878f7faf3900f = function(arg0) {
        const ret = getObject(arg0).clientY;
        return ret;
    };
    imports.wbg.__wbg_offsetX_5a58f16f6c3a41b6 = function(arg0) {
        const ret = getObject(arg0).offsetX;
        return ret;
    };
    imports.wbg.__wbg_offsetY_c45b4956f6429a95 = function(arg0) {
        const ret = getObject(arg0).offsetY;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_0a805df688b5bf42 = function(arg0) {
        const ret = getObject(arg0).ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_8a070ab6169b5fa4 = function(arg0) {
        const ret = getObject(arg0).shiftKey;
        return ret;
    };
    imports.wbg.__wbg_altKey_6fc1761a6b7a406e = function(arg0) {
        const ret = getObject(arg0).altKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_d89287be4389a3c1 = function(arg0) {
        const ret = getObject(arg0).metaKey;
        return ret;
    };
    imports.wbg.__wbg_button_7a095234b69de930 = function(arg0) {
        const ret = getObject(arg0).button;
        return ret;
    };
    imports.wbg.__wbg_buttons_d0f40e1650e3fa28 = function(arg0) {
        const ret = getObject(arg0).buttons;
        return ret;
    };
    imports.wbg.__wbg_movementX_966ec323c169d1a6 = function(arg0) {
        const ret = getObject(arg0).movementX;
        return ret;
    };
    imports.wbg.__wbg_movementY_b14b3bc8e1b31f23 = function(arg0) {
        const ret = getObject(arg0).movementY;
        return ret;
    };
    imports.wbg.__wbg_gpu_1678673f109c8aeb = function(arg0) {
        const ret = getObject(arg0).gpu;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_x_6c8af74c3b4d8c09 = function(arg0) {
        const ret = getObject(arg0).x;
        return ret;
    };
    imports.wbg.__wbg_y_4cca2672ce1b5fc1 = function(arg0) {
        const ret = getObject(arg0).y;
        return ret;
    };
    imports.wbg.__wbg_requestAdapter_d8298d7a27a391f0 = function(arg0, arg1) {
        const ret = getObject(arg0).requestAdapter(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_matches_07c564b5b4101cf2 = function(arg0) {
        const ret = getObject(arg0).matches;
        return ret;
    };
    imports.wbg.__wbg_addListener_85fb6e4bd17e8878 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).addListener(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_removeListener_3b62020874cfc3c7 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).removeListener(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_now_0cfdc90c97d0c24b = function(arg0) {
        const ret = getObject(arg0).now();
        return ret;
    };
    imports.wbg.__wbg_setProperty_b95ef63ab852879e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_size_6540ddb49e0d7120 = function(arg0) {
        const ret = getObject(arg0).size;
        return ret;
    };
    imports.wbg.__wbg_usage_f5b34f3e0170424b = function(arg0) {
        const ret = getObject(arg0).usage;
        return ret;
    };
    imports.wbg.__wbg_destroy_9b5398e5b148e210 = function(arg0) {
        getObject(arg0).destroy();
    };
    imports.wbg.__wbg_getMappedRange_becef7e3d9dc5489 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).getMappedRange(arg1, arg2);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_mapAsync_91acdcf41b7ae21d = function(arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).mapAsync(arg1 >>> 0, arg2, arg3);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_unmap_1677c09514e08e64 = function(arg0) {
        getObject(arg0).unmap();
    };
    imports.wbg.__wbg_createView_3e46af1f54fdcd1f = function(arg0, arg1) {
        const ret = getObject(arg0).createView(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_destroy_728f676d96e34538 = function(arg0) {
        getObject(arg0).destroy();
    };
    imports.wbg.__wbg_charCode_75cea1a3a6d66388 = function(arg0) {
        const ret = getObject(arg0).charCode;
        return ret;
    };
    imports.wbg.__wbg_keyCode_dfa86be31f5ef90c = function(arg0) {
        const ret = getObject(arg0).keyCode;
        return ret;
    };
    imports.wbg.__wbg_altKey_612289acf855835c = function(arg0) {
        const ret = getObject(arg0).altKey;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_582686fb2263dd3c = function(arg0) {
        const ret = getObject(arg0).ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_48e8701355d8e2d4 = function(arg0) {
        const ret = getObject(arg0).shiftKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_43193b7cc99f8914 = function(arg0) {
        const ret = getObject(arg0).metaKey;
        return ret;
    };
    imports.wbg.__wbg_key_8aeaa079126a9cc7 = function(arg0, arg1) {
        const ret = getObject(arg1).key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_code_96d6322b968b2d17 = function(arg0, arg1) {
        const ret = getObject(arg1).code;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getModifierState_5102ee8843516d2f = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).getModifierState(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_instanceof_GpuCanvasContext_7a77e275c38d41d8 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof GPUCanvasContext;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_configure_93a57a4e5e0f8bcf = function(arg0, arg1) {
        getObject(arg0).configure(getObject(arg1));
    };
    imports.wbg.__wbg_getCurrentTexture_ecedc4f6f71990d2 = function(arg0) {
        const ret = getObject(arg0).getCurrentTexture();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_has_8720889cf3ad610c = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).has(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_deltaX_84508d00a1050e70 = function(arg0) {
        const ret = getObject(arg0).deltaX;
        return ret;
    };
    imports.wbg.__wbg_deltaY_64823169afb0335d = function(arg0) {
        const ret = getObject(arg0).deltaY;
        return ret;
    };
    imports.wbg.__wbg_deltaMode_1c680147cfdba8a5 = function(arg0) {
        const ret = getObject(arg0).deltaMode;
        return ret;
    };
    imports.wbg.__wbg_clear_bcb047cec85d9563 = typeof console.clear == 'function' ? console.clear : notDefined('console.clear');
    imports.wbg.__wbg_debug_9a6b3243fbbebb61 = function(arg0) {
        console.debug(getObject(arg0));
    };
    imports.wbg.__wbg_error_788ae33f81d3b84b = function(arg0) {
        console.error(getObject(arg0));
    };
    imports.wbg.__wbg_error_c9309504864e78b5 = function(arg0, arg1) {
        console.error(getObject(arg0), getObject(arg1));
    };
    imports.wbg.__wbg_info_2e30e8204b29d91d = function(arg0) {
        console.info(getObject(arg0));
    };
    imports.wbg.__wbg_log_1d3ae0273d8f4f8a = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_warn_d60e832f9882c1b2 = function(arg0) {
        console.warn(getObject(arg0));
    };
    imports.wbg.__wbg_getBindGroupLayout_20dc45d52b96fa42 = function(arg0, arg1) {
        const ret = getObject(arg0).getBindGroupLayout(arg1 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_end_bdfb66792e0c59a2 = function(arg0) {
        getObject(arg0).end();
    };
    imports.wbg.__wbg_executeBundles_0a1fdfd83c1a3e57 = function(arg0, arg1) {
        getObject(arg0).executeBundles(getObject(arg1));
    };
    imports.wbg.__wbg_setBlendConstant_e89574db5137b2f6 = function(arg0, arg1) {
        getObject(arg0).setBlendConstant(getObject(arg1));
    };
    imports.wbg.__wbg_setScissorRect_0af8c89e90a6e89c = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_setStencilReference_71be0db67db2f7ab = function(arg0, arg1) {
        getObject(arg0).setStencilReference(arg1 >>> 0);
    };
    imports.wbg.__wbg_setViewport_9c5fb686baf1cf4f = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).setViewport(arg1, arg2, arg3, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_setBindGroup_ce4432036922cd83 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).setBindGroup(arg1 >>> 0, getObject(arg2), getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
    };
    imports.wbg.__wbg_draw_6357a5fbc8a6b097 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_drawIndexed_5d1dd89d7375148c = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
    };
    imports.wbg.__wbg_drawIndexedIndirect_526599171cfbbee5 = function(arg0, arg1, arg2) {
        getObject(arg0).drawIndexedIndirect(getObject(arg1), arg2);
    };
    imports.wbg.__wbg_drawIndirect_8dd595dc622e21ac = function(arg0, arg1, arg2) {
        getObject(arg0).drawIndirect(getObject(arg1), arg2);
    };
    imports.wbg.__wbg_setIndexBuffer_1f4a86d1cc8c16d9 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).setIndexBuffer(getObject(arg1), __wbindgen_enum_GpuIndexFormat[arg2], arg3);
    };
    imports.wbg.__wbg_setIndexBuffer_9f8493460611f96b = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setIndexBuffer(getObject(arg1), __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
    };
    imports.wbg.__wbg_setPipeline_18ce556bdea62cc5 = function(arg0, arg1) {
        getObject(arg0).setPipeline(getObject(arg1));
    };
    imports.wbg.__wbg_setVertexBuffer_2a2c84d65c1063f9 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).setVertexBuffer(arg1 >>> 0, getObject(arg2), arg3);
    };
    imports.wbg.__wbg_setVertexBuffer_176c2dff823c42c1 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setVertexBuffer(arg1 >>> 0, getObject(arg2), arg3, arg4);
    };
    imports.wbg.__wbg_width_2931aaedd21f1fff = function(arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_setwidth_a667a942dba6656e = function(arg0, arg1) {
        getObject(arg0).width = arg1 >>> 0;
    };
    imports.wbg.__wbg_height_0d36fbbeb60b0661 = function(arg0) {
        const ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_setheight_a747d440760fe5aa = function(arg0, arg1) {
        getObject(arg0).height = arg1 >>> 0;
    };
    imports.wbg.__wbg_getContext_7c5944ea807bf5d3 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setwidth_15266a5e81f43cf0 = function(arg0, arg1) {
        getObject(arg0).width = arg1 >>> 0;
    };
    imports.wbg.__wbg_setheight_2e9bab573f1775a6 = function(arg0, arg1) {
        getObject(arg0).height = arg1 >>> 0;
    };
    imports.wbg.__wbg_pointerId_701aab7b4fb073ff = function(arg0) {
        const ret = getObject(arg0).pointerId;
        return ret;
    };
    imports.wbg.__wbg_pressure_e388b6fd623a3917 = function(arg0) {
        const ret = getObject(arg0).pressure;
        return ret;
    };
    imports.wbg.__wbg_pointerType_0009b1e4e6b0f428 = function(arg0, arg1) {
        const ret = getObject(arg1).pointerType;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_message_c934153af8567cdb = function(arg0, arg1) {
        const ret = getObject(arg1).message;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_features_dfb2178c91fa1dd7 = function(arg0) {
        const ret = getObject(arg0).features;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_queue_f2aeb5c277e56f93 = function(arg0) {
        const ret = getObject(arg0).queue;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setonuncapturederror_b3c814f611d5e585 = function(arg0, arg1) {
        getObject(arg0).onuncapturederror = getObject(arg1);
    };
    imports.wbg.__wbg_createBindGroup_fa5515d52f9c6a69 = function(arg0, arg1) {
        const ret = getObject(arg0).createBindGroup(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createBindGroupLayout_af3b9d9ee0a1f5f9 = function(arg0, arg1) {
        const ret = getObject(arg0).createBindGroupLayout(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createBuffer_36e159f52cc644a7 = function(arg0, arg1) {
        const ret = getObject(arg0).createBuffer(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createCommandEncoder_a50a1dab2b499b95 = function(arg0, arg1) {
        const ret = getObject(arg0).createCommandEncoder(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createComputePipeline_89131452dfd12672 = function(arg0, arg1) {
        const ret = getObject(arg0).createComputePipeline(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createPipelineLayout_1e10c8281fb85c01 = function(arg0, arg1) {
        const ret = getObject(arg0).createPipelineLayout(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createQuerySet_ccb746122176f8e5 = function(arg0, arg1) {
        const ret = getObject(arg0).createQuerySet(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createRenderBundleEncoder_ad2d0237f581427b = function(arg0, arg1) {
        const ret = getObject(arg0).createRenderBundleEncoder(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createRenderPipeline_745f00bcb1ca6edf = function(arg0, arg1) {
        const ret = getObject(arg0).createRenderPipeline(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createSampler_09cd36835c9befb3 = function(arg0, arg1) {
        const ret = getObject(arg0).createSampler(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createShaderModule_59bbf537b8b5cf7c = function(arg0, arg1) {
        const ret = getObject(arg0).createShaderModule(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createTexture_dbd00b550944125c = function(arg0, arg1) {
        const ret = getObject(arg0).createTexture(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_popErrorScope_19075fb98a08b740 = function(arg0) {
        const ret = getObject(arg0).popErrorScope();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_pushErrorScope_0728aae3f2d3ed48 = function(arg0, arg1) {
        getObject(arg0).pushErrorScope(__wbindgen_enum_GpuErrorFilter[arg1]);
    };
    imports.wbg.__wbg_gpu_24536c9523d924b1 = function(arg0) {
        const ret = getObject(arg0).gpu;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_addEventListener_5651108fc3ffeb6e = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    }, arguments) };
    imports.wbg.__wbg_addEventListener_a5963e26cd7b176b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_1fa0d9594cdb0b1d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
    }, arguments) };
    imports.wbg.__wbg_label_c7970304720cf8b0 = function(arg0, arg1) {
        const ret = getObject(arg1).label;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_beginComputePass_579a2563c561da68 = function(arg0, arg1) {
        const ret = getObject(arg0).beginComputePass(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_beginRenderPass_d04327f7231bd5af = function(arg0, arg1) {
        const ret = getObject(arg0).beginRenderPass(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_clearBuffer_c370e7adb8398388 = function(arg0, arg1, arg2) {
        getObject(arg0).clearBuffer(getObject(arg1), arg2);
    };
    imports.wbg.__wbg_clearBuffer_b8e6751290709d43 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).clearBuffer(getObject(arg1), arg2, arg3);
    };
    imports.wbg.__wbg_copyBufferToBuffer_79ac12f409453cf0 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).copyBufferToBuffer(getObject(arg1), arg2, getObject(arg3), arg4, arg5);
    };
    imports.wbg.__wbg_copyBufferToTexture_ac956e6d47c24e73 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).copyBufferToTexture(getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_copyTextureToBuffer_787ec8d8c4c216f1 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).copyTextureToBuffer(getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_copyTextureToTexture_a86e849469b0ef38 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).copyTextureToTexture(getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_finish_5153789564a5eee5 = function(arg0) {
        const ret = getObject(arg0).finish();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_finish_d1049a13335e8326 = function(arg0, arg1) {
        const ret = getObject(arg0).finish(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_resolveQuerySet_8ac49c71e15cdf6a = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).resolveQuerySet(getObject(arg1), arg2 >>> 0, arg3 >>> 0, getObject(arg4), arg5 >>> 0);
    };
    imports.wbg.__wbg_writeTimestamp_107647519ce52436 = function(arg0, arg1, arg2) {
        getObject(arg0).writeTimestamp(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_finish_863657abae52896e = function(arg0) {
        const ret = getObject(arg0).finish();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_finish_e580ef236d53f04b = function(arg0, arg1) {
        const ret = getObject(arg0).finish(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setBindGroup_6bc8944422dbb3cd = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).setBindGroup(arg1 >>> 0, getObject(arg2), getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
    };
    imports.wbg.__wbg_draw_3958097471a10642 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_drawIndexed_8856cc4ccffa3498 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
    };
    imports.wbg.__wbg_drawIndexedIndirect_0404fa6cb9a6db25 = function(arg0, arg1, arg2) {
        getObject(arg0).drawIndexedIndirect(getObject(arg1), arg2);
    };
    imports.wbg.__wbg_drawIndirect_95c6eb1494a44d06 = function(arg0, arg1, arg2) {
        getObject(arg0).drawIndirect(getObject(arg1), arg2);
    };
    imports.wbg.__wbg_setIndexBuffer_4dc5432dc348458d = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).setIndexBuffer(getObject(arg1), __wbindgen_enum_GpuIndexFormat[arg2], arg3);
    };
    imports.wbg.__wbg_setIndexBuffer_f3bae4da9e407eaf = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setIndexBuffer(getObject(arg1), __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
    };
    imports.wbg.__wbg_setPipeline_66f1e900256fc946 = function(arg0, arg1) {
        getObject(arg0).setPipeline(getObject(arg1));
    };
    imports.wbg.__wbg_setVertexBuffer_c782d133fd439184 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).setVertexBuffer(arg1 >>> 0, getObject(arg2), arg3);
    };
    imports.wbg.__wbg_setVertexBuffer_4da0a96267ce82db = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setVertexBuffer(arg1 >>> 0, getObject(arg2), arg3, arg4);
    };
    imports.wbg.__wbg_getBindGroupLayout_dfc1b97f78c04beb = function(arg0, arg1) {
        const ret = getObject(arg0).getBindGroupLayout(arg1 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_maxTextureDimension1D_4d1ddb46ed9dc470 = function(arg0) {
        const ret = getObject(arg0).maxTextureDimension1D;
        return ret;
    };
    imports.wbg.__wbg_maxTextureDimension2D_37a46e61490c8297 = function(arg0) {
        const ret = getObject(arg0).maxTextureDimension2D;
        return ret;
    };
    imports.wbg.__wbg_maxTextureDimension3D_7e3a97204d211743 = function(arg0) {
        const ret = getObject(arg0).maxTextureDimension3D;
        return ret;
    };
    imports.wbg.__wbg_maxTextureArrayLayers_fee4db585706a5eb = function(arg0) {
        const ret = getObject(arg0).maxTextureArrayLayers;
        return ret;
    };
    imports.wbg.__wbg_maxBindGroups_dc8a5f97ba653c91 = function(arg0) {
        const ret = getObject(arg0).maxBindGroups;
        return ret;
    };
    imports.wbg.__wbg_maxBindingsPerBindGroup_3d5ab311420be5df = function(arg0) {
        const ret = getObject(arg0).maxBindingsPerBindGroup;
        return ret;
    };
    imports.wbg.__wbg_maxDynamicUniformBuffersPerPipelineLayout_6b839b7dc97f34f0 = function(arg0) {
        const ret = getObject(arg0).maxDynamicUniformBuffersPerPipelineLayout;
        return ret;
    };
    imports.wbg.__wbg_maxDynamicStorageBuffersPerPipelineLayout_5328cd2b9d884831 = function(arg0) {
        const ret = getObject(arg0).maxDynamicStorageBuffersPerPipelineLayout;
        return ret;
    };
    imports.wbg.__wbg_maxSampledTexturesPerShaderStage_ac006b00cf776b4a = function(arg0) {
        const ret = getObject(arg0).maxSampledTexturesPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxSamplersPerShaderStage_dc092d6a272be20a = function(arg0) {
        const ret = getObject(arg0).maxSamplersPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxStorageBuffersPerShaderStage_dc5b58734b9ab932 = function(arg0) {
        const ret = getObject(arg0).maxStorageBuffersPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxStorageTexturesPerShaderStage_2fec939cb0d5bbfd = function(arg0) {
        const ret = getObject(arg0).maxStorageTexturesPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxUniformBuffersPerShaderStage_b30d53cbf89caeae = function(arg0) {
        const ret = getObject(arg0).maxUniformBuffersPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxUniformBufferBindingSize_eec576e1342504b5 = function(arg0) {
        const ret = getObject(arg0).maxUniformBufferBindingSize;
        return ret;
    };
    imports.wbg.__wbg_maxStorageBufferBindingSize_1ef0cc5e43dad09b = function(arg0) {
        const ret = getObject(arg0).maxStorageBufferBindingSize;
        return ret;
    };
    imports.wbg.__wbg_maxVertexBuffers_b4d31be9e3f93990 = function(arg0) {
        const ret = getObject(arg0).maxVertexBuffers;
        return ret;
    };
    imports.wbg.__wbg_maxVertexAttributes_904c5eb19a6f6c65 = function(arg0) {
        const ret = getObject(arg0).maxVertexAttributes;
        return ret;
    };
    imports.wbg.__wbg_maxVertexBufferArrayStride_6800975c373d83bc = function(arg0) {
        const ret = getObject(arg0).maxVertexBufferArrayStride;
        return ret;
    };
    imports.wbg.__wbg_instanceof_GpuValidationError_af2aa2e306669317 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof GPUValidationError;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_appendChild_51339d4cde00ee22 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_get_c77649dd3862b63a = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_target_f171e89c61e2bccf = function(arg0) {
        const ret = getObject(arg0).target;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_cancelBubble_90d1c3aa2a76cbeb = function(arg0) {
        const ret = getObject(arg0).cancelBubble;
        return ret;
    };
    imports.wbg.__wbg_preventDefault_24104f3f0a54546a = function(arg0) {
        getObject(arg0).preventDefault();
    };
    imports.wbg.__wbg_stopPropagation_55539cfa2506c867 = function(arg0) {
        getObject(arg0).stopPropagation();
    };
    imports.wbg.__wbg_dispatchWorkgroups_c484cd3530a3801d = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).dispatchWorkgroups(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
    };
    imports.wbg.__wbg_dispatchWorkgroupsIndirect_2b89ee1731fab5f8 = function(arg0, arg1, arg2) {
        getObject(arg0).dispatchWorkgroupsIndirect(getObject(arg1), arg2);
    };
    imports.wbg.__wbg_end_dab719019df5969c = function(arg0) {
        getObject(arg0).end();
    };
    imports.wbg.__wbg_setPipeline_598117fdeb73cf8f = function(arg0, arg1) {
        getObject(arg0).setPipeline(getObject(arg1));
    };
    imports.wbg.__wbg_setBindGroup_dffce83253968cdd = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).setBindGroup(arg1 >>> 0, getObject(arg2), getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
    };
    imports.wbg.__wbg_instanceof_GpuOutOfMemoryError_45166ef4e2774fbe = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof GPUOutOfMemoryError;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_copyExternalImageToTexture_819ec294d299f624 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).copyExternalImageToTexture(getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_submit_3104e9b014f75846 = function(arg0, arg1) {
        getObject(arg0).submit(getObject(arg1));
    };
    imports.wbg.__wbg_writeBuffer_becf0c8f0323ffd7 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).writeBuffer(getObject(arg1), arg2, getObject(arg3), arg4, arg5);
    };
    imports.wbg.__wbg_writeTexture_465ecc6146e5052c = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).writeTexture(getObject(arg1), getObject(arg2), getObject(arg3), getObject(arg4));
    };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_new_034f913e7636e987 = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_1ede4bf2ebbaaf43 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_ef828680c64da212 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_a9ef466721e824f2 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_e69b5f66fda8f13c = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_bf91bf94d9e04084 = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_52dd9f07d03fd5f8 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_05c129bf37fcf1be = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_3eca19bb09e9c484 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_push_36cf4d81d7da33d1 = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_call_3bfa248576352471 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getTime_41225036a0393d63 = function(arg0) {
        const ret = getObject(arg0).getTime();
        return ret;
    };
    imports.wbg.__wbg_getTimezoneOffset_93f7d384c8ade3be = function(arg0) {
        const ret = getObject(arg0).getTimezoneOffset();
        return ret;
    };
    imports.wbg.__wbg_new_6fb55f037293191b = function(arg0) {
        const ret = new Date(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new0_218ada33b570be35 = function() {
        const ret = new Date();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Object_4bbac482eda9b711 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_is_4b64bc96710d6a0f = function(arg0, arg1) {
        const ret = Object.is(getObject(arg0), getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_valueOf_caadbb280a0b350a = function(arg0) {
        const ret = getObject(arg0).valueOf();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_resolve_0aad7c1484731c99 = function(arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_748f75edfb032440 = function(arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_4866a7d9f55d8f3e = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_ccaed51a635d8a2d = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_7e3eb787208af730 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_fec2611eb9180f95 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_ec2fcf81bc573fd9 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_9254c4bd3b9f23c4 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_76462a666eca145f = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_95102df5554646dc = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_975a06f9dbd16995 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_e864d25d9b399c9f = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper524 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 147, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper526 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 147, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper528 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 147, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper530 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 147, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper532 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 147, __wbg_adapter_39);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper534 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 147, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper536 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 147, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper538 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 147, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper540 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 147, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper2125 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 807, __wbg_adapter_50);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper2127 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 807, __wbg_adapter_50);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper2158 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 814, __wbg_adapter_55);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper3209 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 999, __wbg_adapter_58);
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;



    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('PS_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
