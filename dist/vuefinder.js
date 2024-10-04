var er = Object.defineProperty;
var tr = (t, e, n) => e in t ? er(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var vs = (t, e, n) => tr(t, typeof e != "symbol" ? e + "" : e, n);
import { reactive as yt, watch as He, ref as C, shallowRef as nr, onMounted as Se, onUnmounted as Gn, onUpdated as Ls, nextTick as ct, computed as rt, inject as re, openBlock as v, createElementBlock as g, withKeys as kt, unref as o, createElementVNode as r, withModifiers as st, renderSlot as At, normalizeClass as ae, toDisplayString as b, createBlock as Y, resolveDynamicComponent as Fs, withCtx as ne, createVNode as P, Fragment as ge, renderList as ye, createCommentVNode as q, withDirectives as ue, vModelCheckbox as zt, createTextVNode as Q, vModelSelect as Jt, vModelText as xt, onBeforeUnmount as Hs, customRef as sr, vShow as Ne, isRef as or, TransitionGroup as rr, normalizeStyle as an, mergeModels as lr, useModel as Rs, resolveComponent as ar, provide as ir, Transition as cr } from "vue";
import dr from "mitt";
import ur from "dragselect";
import vr from "@uppy/core";
import _r from "@uppy/xhr-upload";
import fr from "vanilla-lazyload";
import "cropperjs/dist/cropper.css";
import mr from "cropperjs";
var Os;
const xn = (Os = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : Os.getAttribute("content");
class pr {
  /** @param {RequestConfig} config */
  constructor(e) {
    /** @type {RequestConfig} */
    vs(this, "config");
    this.config = e;
  }
  /** @type {RequestConfig} */
  get config() {
    return this.config;
  }
  /**
   * Transform request params
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {Record<String,?String>|FormData=} input.body
   * @return {RequestTransformResultInternal}
   */
  transformRequestParams(e) {
    const n = this.config, l = {};
    xn != null && xn !== "" && (l[n.xsrfHeaderName] = xn);
    const s = Object.assign({}, n.headers, l, e.headers), c = Object.assign({}, n.params, e.params), i = e.body, d = n.baseUrl + e.url, a = e.method;
    let u;
    a !== "get" && (i instanceof FormData ? (u = i, n.body != null && Object.entries(this.config.body).forEach(([_, p]) => {
      u.append(_, p);
    })) : (u = { ...i }, n.body != null && Object.assign(u, this.config.body)));
    const m = {
      url: d,
      method: a,
      headers: s,
      params: c,
      body: u
    };
    if (n.transformRequest != null) {
      const _ = n.transformRequest({
        url: d,
        method: a,
        headers: s,
        params: c,
        body: u
      });
      _.url != null && (m.url = _.url), _.method != null && (m.method = _.method), _.params != null && (m.params = _.params ?? {}), _.headers != null && (m.headers = _.headers ?? {}), _.body != null && (m.body = _.body);
    }
    return m;
  }
  /**
   * Get download url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getDownloadUrl(e, n) {
    if (n.url != null)
      return n.url;
    const l = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: e, path: n.path }
    });
    return l.url + "?" + new URLSearchParams(l.params).toString();
  }
  /**
   * Get preview url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getPreviewUrl(e, n) {
    if (n.url != null)
      return n.url;
    const l = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: n.path }
    });
    return l.url + "?" + new URLSearchParams(l.params).toString();
  }
  /**
   * Send request
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {(Record<String,?String>|FormData|null)=} input.body
   * @param {'arrayBuffer'|'blob'|'json'|'text'=} input.responseType
   * @param {AbortSignal=} input.abortSignal
   * @returns {Promise<(ArrayBuffer|Blob|Record<String,?String>|String|null)>}
   * @throws {Record<String,?String>|null} resp json error
   */
  async send(e) {
    const n = this.transformRequestParams(e), l = e.responseType || "json", s = {
      method: e.method,
      headers: n.headers,
      signal: e.abortSignal
    }, c = n.url + "?" + new URLSearchParams(n.params);
    if (n.method !== "get" && n.body != null) {
      let d;
      n.body instanceof FormData ? d = e.body : (d = JSON.stringify(n.body), s.headers["Content-Type"] = "application/json"), s.body = d;
    }
    const i = await fetch(c, s);
    if (i.ok)
      return await i[l]();
    throw await i.json();
  }
}
function hr(t) {
  const e = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token"
  };
  return typeof t == "string" ? Object.assign(e, { baseUrl: t }) : Object.assign(e, t), new pr(e);
}
function gr(t) {
  let e = localStorage.getItem(t + "_storage");
  const n = yt(JSON.parse(e ?? "{}"));
  He(n, l);
  function l() {
    Object.keys(n).length ? localStorage.setItem(t + "_storage", JSON.stringify(n)) : localStorage.removeItem(t + "_storage");
  }
  function s(a, u) {
    n[a] = u;
  }
  function c(a) {
    delete n[a];
  }
  function i() {
    Object.keys(n).map((a) => c(a));
  }
  return { getStore: (a, u = null) => n.hasOwnProperty(a) ? n[a] : u, setStore: s, removeStore: c, clearStore: i };
}
async function br(t, e) {
  const n = e[t];
  return typeof n == "function" ? (await n()).default : n;
}
function wr(t, e, n, l) {
  const { getStore: s, setStore: c } = t, i = C({}), d = C(s("locale", e)), a = (_, p = e) => {
    br(_, l).then((f) => {
      i.value = f, c("locale", _), d.value = _, c("translations", f), Object.values(l).length > 1 && (n.emit("vf-toast-push", { label: "The language is set to " + _ }), n.emit("vf-language-saved"));
    }).catch((f) => {
      p ? (n.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), a(p, null)) : n.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  He(d, (_) => {
    a(_);
  }), !s("locale") && !l.length ? a(e) : i.value = s("translations");
  const u = (_, ...p) => p.length ? u(_ = _.replace("%s", p.shift()), ...p) : _;
  function m(_, ...p) {
    return i.value && i.value.hasOwnProperty(_) ? u(i.value[_], ...p) : u(_, ...p);
  }
  return yt({ t: m, locale: d });
}
const de = {
  EDIT: "edit",
  NEW_FILE: "newfile",
  NEW_FOLDER: "newfolder",
  PREVIEW: "preview",
  ARCHIVE: "archive",
  UNARCHIVE: "unarchive",
  SEARCH: "search",
  RENAME: "rename",
  UPLOAD: "upload",
  DELETE: "delete",
  FULL_SCREEN: "fullscreen",
  DOWNLOAD: "download",
  LANGUAGE: "language"
}, yr = Object.values(de), kr = "2.5.16";
function Bs(t, e, n, l, s) {
  return (e = Math, n = e.log, l = 1024, s = n(t) / n(l) | 0, t / e.pow(l, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "iB" : "B");
}
function Is(t, e, n, l, s) {
  return (e = Math, n = e.log, l = 1e3, s = n(t) / n(l) | 0, t / e.pow(l, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "B" : "B");
}
function xr(t) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, l = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(t);
  return l[1] * Math.pow(1024, e[l[2].toLowerCase()]);
}
const tt = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function Sr(t, e) {
  const n = C(tt.SYSTEM), l = C(tt.LIGHT);
  n.value = t.getStore("theme", e ?? tt.SYSTEM);
  const s = window.matchMedia("(prefers-color-scheme: dark)"), c = (i) => {
    n.value === tt.DARK || n.value === tt.SYSTEM && i.matches ? l.value = tt.DARK : l.value = tt.LIGHT;
  };
  return c(s), s.addEventListener("change", c), {
    /**
     * @type {import('vue').Ref<Theme>}
     */
    value: n,
    /**
     * @type {import('vue').Ref<Theme>}
     */
    actualValue: l,
    /**
     * @param {Theme} value
     */
    set(i) {
      n.value = i, i !== tt.SYSTEM ? t.setStore("theme", i) : t.removeStore("theme"), c(s);
    }
  };
}
function $r() {
  const t = nr(null), e = C(!1), n = C();
  return { visible: e, type: t, data: n, open: (c, i = null) => {
    document.querySelector("body").style.overflow = "hidden", e.value = !0, t.value = c, n.value = i;
  }, close: () => {
    document.querySelector("body").style.overflow = "", e.value = !1, t.value = null;
  } };
}
/*!
 * OverlayScrollbars
 * Version: 2.10.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
const Me = (t, e) => {
  const { o: n, i: l, u: s } = t;
  let c = n, i;
  const d = (m, _) => {
    const p = c, f = m, h = _ || (l ? !l(p, f) : p !== f);
    return (h || s) && (c = f, i = p), [c, h, i];
  };
  return [e ? (m) => d(e(c, i), m) : d, (m) => [c, !!m, i]];
}, Cr = typeof window < "u" && typeof HTMLElement < "u" && !!window.document, De = Cr ? window : {}, Us = Math.max, Er = Math.min, An = Math.round, Zt = Math.abs, _s = Math.sign, Ns = De.cancelAnimationFrame, Kn = De.requestAnimationFrame, Qt = De.setTimeout, Dn = De.clearTimeout, cn = (t) => typeof De[t] < "u" ? De[t] : void 0, Tr = cn("MutationObserver"), fs = cn("IntersectionObserver"), en = cn("ResizeObserver"), Kt = cn("ScrollTimeline"), Wn = (t) => t === void 0, dn = (t) => t === null, ze = (t) => typeof t == "number", Ot = (t) => typeof t == "string", Yn = (t) => typeof t == "boolean", Re = (t) => typeof t == "function", Pe = (t) => Array.isArray(t), tn = (t) => typeof t == "object" && !Pe(t) && !dn(t), Xn = (t) => {
  const e = !!t && t.length, n = ze(e) && e > -1 && e % 1 == 0;
  return Pe(t) || !Re(t) && n ? e > 0 && tn(t) ? e - 1 in t : !0 : !1;
}, nn = (t) => !!t && t.constructor === Object, sn = (t) => t instanceof HTMLElement, un = (t) => t instanceof Element;
function ie(t, e) {
  if (Xn(t))
    for (let n = 0; n < t.length && e(t[n], n, t) !== !1; n++)
      ;
  else t && ie(Object.keys(t), (n) => e(t[n], n, t));
  return t;
}
const qs = (t, e) => t.indexOf(e) >= 0, Dt = (t, e) => t.concat(e), pe = (t, e, n) => (!Ot(e) && Xn(e) ? Array.prototype.push.apply(t, e) : t.push(e), t), lt = (t) => Array.from(t || []), Jn = (t) => Pe(t) ? t : !Ot(t) && Xn(t) ? lt(t) : [t], Mn = (t) => !!t && !t.length, Vn = (t) => lt(new Set(t)), Le = (t, e, n) => {
  ie(t, (s) => s ? s.apply(void 0, e || []) : !0), !n && (t.length = 0);
}, zs = "paddingTop", Ps = "paddingRight", js = "paddingLeft", Gs = "paddingBottom", Ks = "marginLeft", Ws = "marginRight", Ys = "marginBottom", Xs = "overflowX", Js = "overflowY", vn = "width", _n = "height", nt = "visible", it = "hidden", gt = "scroll", Ar = (t) => {
  const e = String(t || "");
  return e ? e[0].toUpperCase() + e.slice(1) : "";
}, fn = (t, e, n, l) => {
  if (t && e) {
    let s = !0;
    return ie(n, (c) => {
      const i = t[c], d = e[c];
      i !== d && (s = !1);
    }), s;
  }
  return !1;
}, Zs = (t, e) => fn(t, e, ["w", "h"]), Wt = (t, e) => fn(t, e, ["x", "y"]), Dr = (t, e) => fn(t, e, ["t", "r", "b", "l"]), dt = () => {
}, J = (t, ...e) => t.bind(0, ...e), ft = (t) => {
  let e;
  const n = t ? Qt : Kn, l = t ? Dn : Ns;
  return [(s) => {
    l(e), e = n(() => s(), Re(t) ? t() : t);
  }, () => l(e)];
}, On = (t, e) => {
  const { _: n, v: l, p: s, S: c } = e || {};
  let i, d, a, u, m = dt;
  const _ = function(A) {
    m(), Dn(i), u = i = d = void 0, m = dt, t.apply(this, A);
  }, p = (x) => c && d ? c(d, x) : x, f = () => {
    m !== dt && _(p(a) || a);
  }, h = function() {
    const A = lt(arguments), M = Re(n) ? n() : n;
    if (ze(M) && M >= 0) {
      const E = Re(l) ? l() : l, w = ze(E) && E >= 0, V = M > 0 ? Qt : Kn, L = M > 0 ? Dn : Ns, O = p(A) || A, k = _.bind(0, O);
      let y;
      m(), s && !u ? (k(), u = !0, y = V(() => u = void 0, M)) : (y = V(k, M), w && !i && (i = Qt(f, E))), m = () => L(y), d = a = O;
    } else
      _(A);
  };
  return h.m = f, h;
}, Qs = (t, e) => Object.prototype.hasOwnProperty.call(t, e), Be = (t) => t ? Object.keys(t) : [], oe = (t, e, n, l, s, c, i) => {
  const d = [e, n, l, s, c, i];
  return (typeof t != "object" || dn(t)) && !Re(t) && (t = {}), ie(d, (a) => {
    ie(a, (u, m) => {
      const _ = a[m];
      if (t === _)
        return !0;
      const p = Pe(_);
      if (_ && nn(_)) {
        const f = t[m];
        let h = f;
        p && !Pe(f) ? h = [] : !p && !nn(f) && (h = {}), t[m] = oe(h, _);
      } else
        t[m] = p ? _.slice() : _;
    });
  }), t;
}, eo = (t, e) => ie(oe({}, t), (n, l, s) => {
  n === void 0 ? delete s[l] : n && nn(n) && (s[l] = eo(n));
}), Zn = (t) => !Be(t).length, to = (t, e, n) => Us(t, Er(e, n)), ut = (t) => Vn((Pe(t) ? t : (t || "").split(" ")).filter((e) => e)), Qn = (t, e) => t && t.getAttribute(e), ms = (t, e) => t && t.hasAttribute(e), Xe = (t, e, n) => {
  ie(ut(e), (l) => {
    t && t.setAttribute(l, String(n || ""));
  });
}, Ue = (t, e) => {
  ie(ut(e), (n) => t && t.removeAttribute(n));
}, mn = (t, e) => {
  const n = ut(Qn(t, e)), l = J(Xe, t, e), s = (c, i) => {
    const d = new Set(n);
    return ie(ut(c), (a) => {
      d[i](a);
    }), lt(d).join(" ");
  };
  return {
    O: (c) => l(s(c, "delete")),
    $: (c) => l(s(c, "add")),
    C: (c) => {
      const i = ut(c);
      return i.reduce((d, a) => d && n.includes(a), i.length > 0);
    }
  };
}, no = (t, e, n) => (mn(t, e).O(n), J(es, t, e, n)), es = (t, e, n) => (mn(t, e).$(n), J(no, t, e, n)), on = (t, e, n, l) => (l ? es : no)(t, e, n), ts = (t, e, n) => mn(t, e).C(n), so = (t) => mn(t, "class"), oo = (t, e) => {
  so(t).O(e);
}, ns = (t, e) => (so(t).$(e), J(oo, t, e)), ro = (t, e) => {
  const n = e ? un(e) && e : document;
  return n ? lt(n.querySelectorAll(t)) : [];
}, Mr = (t, e) => {
  const n = e ? un(e) && e : document;
  return n && n.querySelector(t);
}, Ln = (t, e) => un(t) && t.matches(e), lo = (t) => Ln(t, "body"), Fn = (t) => t ? lt(t.childNodes) : [], Mt = (t) => t && t.parentElement, mt = (t, e) => un(t) && t.closest(e), Hn = (t) => document.activeElement, Vr = (t, e, n) => {
  const l = mt(t, e), s = t && Mr(n, l), c = mt(s, e) === l;
  return l && s ? l === t || s === t || c && mt(mt(t, n), e) !== l : !1;
}, bt = (t) => {
  ie(Jn(t), (e) => {
    const n = Mt(e);
    e && n && n.removeChild(e);
  });
}, Ve = (t, e) => J(bt, t && e && ie(Jn(e), (n) => {
  n && t.appendChild(n);
})), pt = (t) => {
  const e = document.createElement("div");
  return Xe(e, "class", t), e;
}, ao = (t) => {
  const e = pt();
  return e.innerHTML = t.trim(), ie(Fn(e), (n) => bt(n));
}, ps = (t, e) => t.getPropertyValue(e) || t[e] || "", io = (t) => {
  const e = t || 0;
  return isFinite(e) ? e : 0;
}, Pt = (t) => io(parseFloat(t || "")), Rn = (t) => Math.round(t * 1e4) / 1e4, co = (t) => `${Rn(io(t))}px`;
function Vt(t, e) {
  t && e && ie(e, (n, l) => {
    try {
      const s = t.style, c = dn(n) || Yn(n) ? "" : ze(n) ? co(n) : n;
      l.indexOf("--") === 0 ? s.setProperty(l, c) : s[l] = c;
    } catch {
    }
  });
}
function Ze(t, e, n) {
  const l = Ot(e);
  let s = l ? "" : {};
  if (t) {
    const c = De.getComputedStyle(t, n) || t.style;
    s = l ? ps(c, e) : lt(e).reduce((i, d) => (i[d] = ps(c, d), i), s);
  }
  return s;
}
const hs = (t, e, n) => {
  const l = e ? `${e}-` : "", s = n ? `-${n}` : "", c = `${l}top${s}`, i = `${l}right${s}`, d = `${l}bottom${s}`, a = `${l}left${s}`, u = Ze(t, [c, i, d, a]);
  return {
    t: Pt(u[c]),
    r: Pt(u[i]),
    b: Pt(u[d]),
    l: Pt(u[a])
  };
}, Or = (t, e) => `translate${tn(t) ? `(${t.x},${t.y})` : `Y(${t})`}`, Lr = (t) => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length), Fr = {
  w: 0,
  h: 0
}, pn = (t, e) => e ? {
  w: e[`${t}Width`],
  h: e[`${t}Height`]
} : Fr, Hr = (t) => pn("inner", t || De), ht = J(pn, "offset"), uo = J(pn, "client"), rn = J(pn, "scroll"), ss = (t) => {
  const e = parseFloat(Ze(t, vn)) || 0, n = parseFloat(Ze(t, _n)) || 0;
  return {
    w: e - An(e),
    h: n - An(n)
  };
}, Sn = (t) => t.getBoundingClientRect(), Rr = (t) => !!t && Lr(t), Bn = (t) => !!(t && (t[_n] || t[vn])), vo = (t, e) => {
  const n = Bn(t);
  return !Bn(e) && n;
}, gs = (t, e, n, l) => {
  ie(ut(e), (s) => {
    t && t.removeEventListener(s, n, l);
  });
}, _e = (t, e, n, l) => {
  var s;
  const c = (s = l && l.H) != null ? s : !0, i = l && l.I || !1, d = l && l.A || !1, a = {
    passive: c,
    capture: i
  };
  return J(Le, ut(e).map((u) => {
    const m = d ? (_) => {
      gs(t, u, m, i), n && n(_);
    } : n;
    return t && t.addEventListener(u, m, a), J(gs, t, u, m, i);
  }));
}, _o = (t) => t.stopPropagation(), In = (t) => t.preventDefault(), fo = (t) => _o(t) || In(t), qe = (t, e) => {
  const { x: n, y: l } = ze(e) ? {
    x: e,
    y: e
  } : e || {};
  ze(n) && (t.scrollLeft = n), ze(l) && (t.scrollTop = l);
}, Oe = (t) => ({
  x: t.scrollLeft,
  y: t.scrollTop
}), mo = () => ({
  D: {
    x: 0,
    y: 0
  },
  M: {
    x: 0,
    y: 0
  }
}), Br = (t, e) => {
  const { D: n, M: l } = t, { w: s, h: c } = e, i = (_, p, f) => {
    let h = _s(_) * f, x = _s(p) * f;
    if (h === x) {
      const A = Zt(_), M = Zt(p);
      x = A > M ? 0 : x, h = A < M ? 0 : h;
    }
    return h = h === x ? 0 : h, [h + 0, x + 0];
  }, [d, a] = i(n.x, l.x, s), [u, m] = i(n.y, l.y, c);
  return {
    D: {
      x: d,
      y: u
    },
    M: {
      x: a,
      y: m
    }
  };
}, bs = ({ D: t, M: e }) => {
  const n = (l, s) => l === 0 && l <= s;
  return {
    x: n(t.x, e.x),
    y: n(t.y, e.y)
  };
}, ws = ({ D: t, M: e }, n) => {
  const l = (s, c, i) => to(0, 1, (s - i) / (s - c) || 0);
  return {
    x: l(t.x, e.x, n.x),
    y: l(t.y, e.y, n.y)
  };
}, Un = (t) => {
  t && t.focus && t.focus({
    preventScroll: !0
  });
}, ys = (t, e) => {
  ie(Jn(e), t);
}, Nn = (t) => {
  const e = /* @__PURE__ */ new Map(), n = (c, i) => {
    if (c) {
      const d = e.get(c);
      ys((a) => {
        d && d[a ? "delete" : "clear"](a);
      }, i);
    } else
      e.forEach((d) => {
        d.clear();
      }), e.clear();
  }, l = (c, i) => {
    if (Ot(c)) {
      const u = e.get(c) || /* @__PURE__ */ new Set();
      return e.set(c, u), ys((m) => {
        Re(m) && u.add(m);
      }, i), J(n, c, i);
    }
    Yn(i) && i && n();
    const d = Be(c), a = [];
    return ie(d, (u) => {
      const m = c[u];
      m && pe(a, l(u, m));
    }), J(Le, a);
  }, s = (c, i) => {
    ie(lt(e.get(c)), (d) => {
      i && !Mn(i) ? d.apply(0, i) : d();
    });
  };
  return l(t || {}), [l, n, s];
}, ks = (t) => JSON.stringify(t, (e, n) => {
  if (Re(n))
    throw 0;
  return n;
}), xs = (t, e) => t ? `${e}`.split(".").reduce((n, l) => n && Qs(n, l) ? n[l] : void 0, t) : void 0, Ir = {
  paddingAbsolute: !1,
  showNativeOverlaidScrollbars: !1,
  update: {
    elementEvents: [["img", "load"]],
    debounce: [0, 33],
    attributes: null,
    ignoreMutation: null
  },
  overflow: {
    x: "scroll",
    y: "scroll"
  },
  scrollbars: {
    theme: "os-theme-dark",
    visibility: "auto",
    autoHide: "never",
    autoHideDelay: 1300,
    autoHideSuspend: !1,
    dragScroll: !0,
    clickScroll: !1,
    pointers: ["mouse", "touch", "pen"]
  }
}, po = (t, e) => {
  const n = {}, l = Dt(Be(e), Be(t));
  return ie(l, (s) => {
    const c = t[s], i = e[s];
    if (tn(c) && tn(i))
      oe(n[s] = {}, po(c, i)), Zn(n[s]) && delete n[s];
    else if (Qs(e, s) && i !== c) {
      let d = !0;
      if (Pe(c) || Pe(i))
        try {
          ks(c) === ks(i) && (d = !1);
        } catch {
        }
      d && (n[s] = i);
    }
  }), n;
}, Ss = (t, e, n) => (l) => [xs(t, l), n || xs(e, l) !== void 0], St = "data-overlayscrollbars", Yt = "os-environment", jt = `${Yt}-scrollbar-hidden`, $n = `${St}-initialize`, Xt = "noClipping", $s = `${St}-body`, ot = St, Ur = "host", Je = `${St}-viewport`, Nr = Xs, qr = Js, zr = "arrange", ho = "measuring", Pr = "scrolling", go = "scrollbarHidden", jr = "noContent", qn = `${St}-padding`, Cs = `${St}-content`, os = "os-size-observer", Gr = `${os}-appear`, Kr = `${os}-listener`, Wr = "os-trinsic-observer", Yr = "os-theme-none", Fe = "os-scrollbar", Xr = `${Fe}-rtl`, Jr = `${Fe}-horizontal`, Zr = `${Fe}-vertical`, bo = `${Fe}-track`, rs = `${Fe}-handle`, Qr = `${Fe}-visible`, el = `${Fe}-cornerless`, Es = `${Fe}-interaction`, Ts = `${Fe}-unusable`, zn = `${Fe}-auto-hide`, As = `${zn}-hidden`, Ds = `${Fe}-wheel`, tl = `${bo}-interactive`, nl = `${rs}-interactive`;
let wo;
const sl = () => wo, ol = (t) => {
  wo = t;
};
let Cn;
const rl = () => {
  const t = (w, V, L) => {
    Ve(document.body, w), Ve(document.body, w);
    const j = uo(w), O = ht(w), k = ss(V);
    return L && bt(w), {
      x: O.h - j.h + k.h,
      y: O.w - j.w + k.w
    };
  }, e = (w) => {
    let V = !1;
    const L = ns(w, jt);
    try {
      V = Ze(w, "scrollbar-width") === "none" || Ze(w, "display", "::-webkit-scrollbar") === "none";
    } catch {
    }
    return L(), V;
  }, n = `.${Yt}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${Yt} div{width:200%;height:200%;margin:10px 0}.${jt}{scrollbar-width:none!important}.${jt}::-webkit-scrollbar,.${jt}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`, s = ao(`<div class="${Yt}"><div></div><style>${n}</style></div>`)[0], c = s.firstChild, i = s.lastChild, d = sl();
  d && (i.nonce = d);
  const [a, , u] = Nn(), [m, _] = Me({
    o: t(s, c),
    i: Wt
  }, J(t, s, c, !0)), [p] = _(), f = e(s), h = {
    x: p.x === 0,
    y: p.y === 0
  }, x = {
    elements: {
      host: null,
      padding: !f,
      viewport: (w) => f && lo(w) && w,
      content: !1
    },
    scrollbars: {
      slot: !0
    },
    cancel: {
      nativeScrollbarsOverlaid: !1,
      body: null
    }
  }, A = oe({}, Ir), M = J(oe, {}, A), D = J(oe, {}, x), E = {
    T: p,
    k: h,
    R: f,
    V: !!Kt,
    L: J(a, "r"),
    U: D,
    P: (w) => oe(x, w) && D(),
    N: M,
    q: (w) => oe(A, w) && M(),
    B: oe({}, x),
    F: oe({}, A)
  };
  if (Ue(s, "style"), bt(s), _e(De, "resize", () => {
    u("r", []);
  }), Re(De.matchMedia) && !f && (!h.x || !h.y)) {
    const w = (V) => {
      const L = De.matchMedia(`(resolution: ${De.devicePixelRatio}dppx)`);
      _e(L, "change", () => {
        V(), w(V);
      }, {
        A: !0
      });
    };
    w(() => {
      const [V, L] = m();
      oe(E.T, V), u("r", [L]);
    });
  }
  return E;
}, Ge = () => (Cn || (Cn = rl()), Cn), yo = (t, e) => Re(e) ? e.apply(0, t) : e, ll = (t, e, n, l) => {
  const s = Wn(l) ? n : l;
  return yo(t, s) || e.apply(0, t);
}, ko = (t, e, n, l) => {
  const s = Wn(l) ? n : l, c = yo(t, s);
  return !!c && (sn(c) ? c : e.apply(0, t));
}, al = (t, e) => {
  const { nativeScrollbarsOverlaid: n, body: l } = e || {}, { k: s, R: c, U: i } = Ge(), { nativeScrollbarsOverlaid: d, body: a } = i().cancel, u = n ?? d, m = Wn(l) ? a : l, _ = (s.x || s.y) && u, p = t && (dn(m) ? !c : m);
  return !!_ || !!p;
}, ls = /* @__PURE__ */ new WeakMap(), il = (t, e) => {
  ls.set(t, e);
}, cl = (t) => {
  ls.delete(t);
}, xo = (t) => ls.get(t), dl = (t, e, n) => {
  let l = !1;
  const s = n ? /* @__PURE__ */ new WeakMap() : !1, c = () => {
    l = !0;
  }, i = (d) => {
    if (s && n) {
      const a = n.map((u) => {
        const [m, _] = u || [];
        return [_ && m ? (d || ro)(m, t) : [], _];
      });
      ie(a, (u) => ie(u[0], (m) => {
        const _ = u[1], p = s.get(m) || [];
        if (t.contains(m) && _) {
          const h = _e(m, _, (x) => {
            l ? (h(), s.delete(m)) : e(x);
          });
          s.set(m, pe(p, h));
        } else
          Le(p), s.delete(m);
      }));
    }
  };
  return i(), [c, i];
}, Ms = (t, e, n, l) => {
  let s = !1;
  const { j: c, X: i, Y: d, W: a, J: u, G: m } = l || {}, _ = On(() => s && n(!0), {
    _: 33,
    v: 99
  }), [p, f] = dl(t, _, d), h = c || [], x = i || [], A = Dt(h, x), M = (E, w) => {
    if (!Mn(w)) {
      const V = u || dt, L = m || dt, j = [], O = [];
      let k = !1, y = !1;
      if (ie(w, ($) => {
        const { attributeName: R, target: Z, type: ee, oldValue: N, addedNodes: z, removedNodes: S } = $, I = ee === "attributes", U = ee === "childList", le = t === Z, F = I && R, H = F && Qn(Z, R || ""), B = Ot(H) ? H : null, G = F && N !== B, T = qs(x, R) && G;
        if (e && (U || !le)) {
          const W = I && G, K = W && a && Ln(Z, a), se = (K ? !V(Z, R, N, B) : !I || W) && !L($, !!K, t, l);
          ie(z, (ce) => pe(j, ce)), ie(S, (ce) => pe(j, ce)), y = y || se;
        }
        !e && le && G && !V(Z, R, N, B) && (pe(O, R), k = k || T);
      }), f(($) => Vn(j).reduce((R, Z) => (pe(R, ro($, Z)), Ln(Z, $) ? pe(R, Z) : R), [])), e)
        return !E && y && n(!1), [!1];
      if (!Mn(O) || k) {
        const $ = [Vn(O), k];
        return !E && n.apply(0, $), $;
      }
    }
  }, D = new Tr(J(M, !1));
  return [() => (D.observe(t, {
    attributes: !0,
    attributeOldValue: !0,
    attributeFilter: A,
    subtree: e,
    childList: e,
    characterData: e
  }), s = !0, () => {
    s && (p(), D.disconnect(), s = !1);
  }), () => {
    if (s)
      return _.m(), M(!0, D.takeRecords());
  }];
}, So = {}, $o = {}, ul = (t) => {
  ie(t, (e) => ie(e, (n, l) => {
    So[l] = e[l];
  }));
}, Co = (t, e, n) => Be(t).map((l) => {
  const { static: s, instance: c } = t[l], [i, d, a] = n || [], u = n ? c : s;
  if (u) {
    const m = n ? u(i, d, e) : u(e);
    return (a || $o)[l] = m;
  }
}), Lt = (t) => $o[t], vl = "__osOptionsValidationPlugin", _l = "__osSizeObserverPlugin", fl = (t, e) => {
  const { k: n } = e, [l, s] = t("showNativeOverlaidScrollbars");
  return [l && n.x && n.y, s];
}, wt = (t) => t.indexOf(nt) === 0, ml = (t, e) => {
  const n = (s, c, i, d) => {
    const a = s === nt ? it : s.replace(`${nt}-`, ""), u = wt(s), m = wt(i);
    return !c && !d ? it : u && m ? nt : u ? c && d ? a : c ? nt : it : c ? a : m && d ? nt : it;
  }, l = {
    x: n(e.x, t.x, e.y, t.y),
    y: n(e.y, t.y, e.x, t.x)
  };
  return {
    K: l,
    Z: {
      x: l.x === gt,
      y: l.y === gt
    }
  };
}, Eo = "__osScrollbarsHidingPlugin", pl = "__osClickScrollPlugin", To = (t, e, n) => {
  const { dt: l } = n || {}, s = Lt(_l), [c] = Me({
    o: !1,
    u: !0
  });
  return () => {
    const i = [], a = ao(`<div class="${os}"><div class="${Kr}"></div></div>`)[0], u = a.firstChild, m = (_) => {
      const p = _ instanceof ResizeObserverEntry;
      let f = !1, h = !1;
      if (p) {
        const [x, , A] = c(_.contentRect), M = Bn(x);
        h = vo(x, A), f = !h && !M;
      } else
        h = _ === !0;
      f || e({
        ft: !0,
        dt: h
      });
    };
    if (en) {
      const _ = new en((p) => m(p.pop()));
      _.observe(u), pe(i, () => {
        _.disconnect();
      });
    } else if (s) {
      const [_, p] = s(u, m, l);
      pe(i, Dt([ns(a, Gr), _e(a, "animationstart", _)], p));
    } else
      return dt;
    return J(Le, pe(i, Ve(t, a)));
  };
}, hl = (t, e) => {
  let n;
  const l = (a) => a.h === 0 || a.isIntersecting || a.intersectionRatio > 0, s = pt(Wr), [c] = Me({
    o: !1
  }), i = (a, u) => {
    if (a) {
      const m = c(l(a)), [, _] = m;
      return _ && !u && e(m) && [m];
    }
  }, d = (a, u) => i(u.pop(), a);
  return [() => {
    const a = [];
    if (fs)
      n = new fs(J(d, !1), {
        root: t
      }), n.observe(s), pe(a, () => {
        n.disconnect();
      });
    else {
      const u = () => {
        const m = ht(s);
        i(m);
      };
      pe(a, To(s, u)()), u();
    }
    return J(Le, pe(a, Ve(t, s)));
  }, () => n && d(!0, n.takeRecords())];
}, gl = (t, e, n, l) => {
  let s, c, i, d, a, u;
  const m = `[${ot}]`, _ = `[${Je}]`, p = ["id", "class", "style", "open", "wrap", "cols", "rows"], { vt: f, ht: h, ot: x, gt: A, bt: M, nt: D, wt: E, yt: w, St: V, Ot: L } = t, j = (T) => Ze(T, "direction") === "rtl", O = {
    $t: !1,
    ct: j(f)
  }, k = Ge(), y = Lt(Eo), [$] = Me({
    i: Zs,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const T = y && y.tt(t, e, O, k, n).ut, K = !(E && D) && ts(h, ot, Xt), X = !D && w(zr), se = X && Oe(A), ce = se && L(), be = V(ho, K), fe = X && T && T()[0], $e = rn(x), te = ss(x);
    return fe && fe(), qe(A, se), ce && ce(), K && be(), {
      w: $e.w + te.w,
      h: $e.h + te.h
    };
  }), R = On(l, {
    _: () => s,
    v: () => c,
    S(T, W) {
      const [K] = T, [X] = W;
      return [Dt(Be(K), Be(X)).reduce((se, ce) => (se[ce] = K[ce] || X[ce], se), {})];
    }
  }), Z = (T) => {
    const W = j(f);
    oe(T, {
      Ct: u !== W
    }), oe(O, {
      ct: W
    }), u = W;
  }, ee = (T, W) => {
    const [K, X] = T, se = {
      xt: X
    };
    return oe(O, {
      $t: K
    }), !W && l(se), se;
  }, N = ({ ft: T, dt: W }) => {
    const X = !(T && !W) && k.R ? R : l, se = {
      ft: T || W,
      dt: W
    };
    Z(se), X(se);
  }, z = (T, W) => {
    const [, K] = $(), X = {
      Ht: K
    };
    return Z(X), K && !W && (T ? l : R)(X), X;
  }, S = (T, W, K) => {
    const X = {
      Et: W
    };
    return Z(X), W && !K && R(X), X;
  }, [I, U] = M ? hl(h, ee) : [], le = !D && To(h, N, {
    dt: !0
  }), [F, H] = Ms(h, !1, S, {
    X: p,
    j: p
  }), B = D && en && new en((T) => {
    const W = T[T.length - 1].contentRect;
    N({
      ft: !0,
      dt: vo(W, a)
    }), a = W;
  }), G = On(() => {
    const [, T] = $();
    l({
      Ht: T
    });
  }, {
    _: 222,
    p: !0
  });
  return [() => {
    B && B.observe(h);
    const T = le && le(), W = I && I(), K = F(), X = k.L((se) => {
      se ? R({
        zt: se
      }) : G();
    });
    return () => {
      B && B.disconnect(), T && T(), W && W(), d && d(), K(), X();
    };
  }, ({ It: T, At: W, Dt: K }) => {
    const X = {}, [se] = T("update.ignoreMutation"), [ce, be] = T("update.attributes"), [fe, $e] = T("update.elementEvents"), [te, Ce] = T("update.debounce"), Te = $e || be, ke = W || K, Ee = (he) => Re(se) && se(he);
    if (Te) {
      i && i(), d && d();
      const [he, we] = Ms(M || x, !0, z, {
        j: Dt(p, ce || []),
        Y: fe,
        W: m,
        G: (ve, me) => {
          const { target: xe, attributeName: Ae } = ve;
          return (!me && Ae && !D ? Vr(xe, m, _) : !1) || !!mt(xe, `.${Fe}`) || !!Ee(ve);
        }
      });
      d = he(), i = we;
    }
    if (Ce)
      if (R.m(), Pe(te)) {
        const he = te[0], we = te[1];
        s = ze(he) && he, c = ze(we) && we;
      } else ze(te) ? (s = te, c = !1) : (s = !1, c = !1);
    if (ke) {
      const he = H(), we = U && U(), ve = i && i();
      he && oe(X, S(he[0], he[1], ke)), we && oe(X, ee(we[0], ke)), ve && oe(X, z(ve[0], ke));
    }
    return Z(X), X;
  }, O];
}, bl = (t, e, n, l) => {
  const s = "--os-viewport-percent", c = "--os-scroll-percent", i = "--os-scroll-direction", { U: d } = Ge(), { scrollbars: a } = d(), { slot: u } = a, { vt: m, ht: _, ot: p, Mt: f, gt: h, wt: x, nt: A } = e, { scrollbars: M } = f ? {} : t, { slot: D } = M || {}, E = [], w = [], V = [], L = ko([m, _, p], () => A && x ? m : _, u, D), j = (F) => {
    if (Kt) {
      const H = new Kt({
        source: h,
        axis: F
      });
      return {
        kt: (G) => {
          const T = G.Tt.animate({
            clear: ["left"],
            [c]: [0, 1]
          }, {
            timeline: H
          });
          return () => T.cancel();
        }
      };
    }
  }, O = {
    x: j("x"),
    y: j("y")
  }, k = () => {
    const { Rt: F, Vt: H } = n, B = (G, T) => to(0, 1, G / (G + T) || 0);
    return {
      x: B(H.x, F.x),
      y: B(H.y, F.y)
    };
  }, y = (F, H, B) => {
    const G = B ? ns : oo;
    ie(F, (T) => {
      G(T.Tt, H);
    });
  }, $ = (F, H) => {
    ie(F, (B) => {
      const [G, T] = H(B);
      Vt(G, T);
    });
  }, R = (F, H, B) => {
    const G = Yn(B), T = G ? B : !0, W = G ? !B : !0;
    T && y(w, F, H), W && y(V, F, H);
  }, Z = () => {
    const F = k(), H = (B) => (G) => [G.Tt, {
      [s]: Rn(B) + ""
    }];
    $(w, H(F.x)), $(V, H(F.y));
  }, ee = () => {
    if (!Kt) {
      const { Lt: F } = n, H = ws(F, Oe(h)), B = (G) => (T) => [T.Tt, {
        [c]: Rn(G) + ""
      }];
      $(w, B(H.x)), $(V, B(H.y));
    }
  }, N = () => {
    const { Lt: F } = n, H = bs(F), B = (G) => (T) => [T.Tt, {
      [i]: G ? "0" : "1"
    }];
    $(w, B(H.x)), $(V, B(H.y));
  }, z = () => {
    if (A && !x) {
      const { Rt: F, Lt: H } = n, B = bs(H), G = ws(H, Oe(h)), T = (W) => {
        const { Tt: K } = W, X = Mt(K) === p && K, se = (ce, be, fe) => {
          const $e = be * ce;
          return co(fe ? $e : -$e);
        };
        return [X, X && {
          transform: Or({
            x: se(G.x, F.x, B.x),
            y: se(G.y, F.y, B.y)
          })
        }];
      };
      $(w, T), $(V, T);
    }
  }, S = (F) => {
    const H = F ? "x" : "y", G = pt(`${Fe} ${F ? Jr : Zr}`), T = pt(bo), W = pt(rs), K = {
      Tt: G,
      Ut: T,
      Pt: W
    }, X = O[H];
    return pe(F ? w : V, K), pe(E, [Ve(G, T), Ve(T, W), J(bt, G), X && X.kt(K), l(K, R, F)]), K;
  }, I = J(S, !0), U = J(S, !1), le = () => (Ve(L, w[0].Tt), Ve(L, V[0].Tt), J(Le, E));
  return I(), U(), [{
    Nt: Z,
    qt: ee,
    Bt: N,
    Ft: z,
    jt: R,
    Xt: {
      Yt: w,
      Wt: I,
      Jt: J($, w)
    },
    Gt: {
      Yt: V,
      Wt: U,
      Jt: J($, V)
    }
  }, le];
}, wl = (t, e, n, l) => (s, c, i) => {
  const { ht: d, ot: a, nt: u, gt: m, Kt: _, Ot: p } = e, { Tt: f, Ut: h, Pt: x } = s, [A, M] = ft(333), [D, E] = ft(444), w = (j) => {
    Re(m.scrollBy) && m.scrollBy({
      behavior: "smooth",
      left: j.x,
      top: j.y
    });
  }, V = () => {
    const j = "pointerup pointercancel lostpointercapture", O = `client${i ? "X" : "Y"}`, k = i ? vn : _n, y = i ? "left" : "top", $ = i ? "w" : "h", R = i ? "x" : "y", Z = (N, z) => (S) => {
      const { Rt: I } = n, U = ht(h)[$] - ht(x)[$], F = z * S / U * I[R];
      qe(m, {
        [R]: N + F
      });
    }, ee = [];
    return _e(h, "pointerdown", (N) => {
      const z = mt(N.target, `.${rs}`) === x, S = z ? x : h, I = t.scrollbars, U = I[z ? "dragScroll" : "clickScroll"], { button: le, isPrimary: F, pointerType: H } = N, { pointers: B } = I;
      if (le === 0 && F && U && (B || []).includes(H)) {
        Le(ee), E();
        const T = !z && (N.shiftKey || U === "instant"), W = J(Sn, x), K = J(Sn, h), X = (me, xe) => (me || W())[y] - (xe || K())[y], se = An(Sn(m)[k]) / ht(m)[$] || 1, ce = Z(Oe(m)[R], 1 / se), be = N[O], fe = W(), $e = K(), te = fe[k], Ce = X(fe, $e) + te / 2, Te = be - $e[y], ke = z ? 0 : Te - Ce, Ee = (me) => {
          Le(ve), S.releasePointerCapture(me.pointerId);
        }, he = z || T, we = p(), ve = [_e(_, j, Ee), _e(_, "selectstart", (me) => In(me), {
          H: !1
        }), _e(h, j, Ee), he && _e(h, "pointermove", (me) => ce(ke + (me[O] - be))), he && (() => {
          const me = Oe(m);
          we();
          const xe = Oe(m), Ae = {
            x: xe.x - me.x,
            y: xe.y - me.y
          };
          (Zt(Ae.x) > 3 || Zt(Ae.y) > 3) && (p(), qe(m, me), w(Ae), D(we));
        })];
        if (S.setPointerCapture(N.pointerId), T)
          ce(ke);
        else if (!z) {
          const me = Lt(pl);
          if (me) {
            const xe = me(ce, ke, te, (Ae) => {
              Ae ? we() : pe(ve, we);
            });
            pe(ve, xe), pe(ee, J(xe, !0));
          }
        }
      }
    });
  };
  let L = !0;
  return J(Le, [_e(x, "pointermove pointerleave", l), _e(f, "pointerenter", () => {
    c(Es, !0);
  }), _e(f, "pointerleave pointercancel", () => {
    c(Es, !1);
  }), !u && _e(f, "mousedown", () => {
    const j = Hn();
    (ms(j, Je) || ms(j, ot) || j === document.body) && Qt(J(Un, a), 25);
  }), _e(f, "wheel", (j) => {
    const { deltaX: O, deltaY: k, deltaMode: y } = j;
    L && y === 0 && Mt(f) === d && w({
      x: O,
      y: k
    }), L = !1, c(Ds, !0), A(() => {
      L = !0, c(Ds);
    }), In(j);
  }, {
    H: !1,
    I: !0
  }), _e(f, "pointerdown", J(_e, _, "click", fo, {
    A: !0,
    I: !0,
    H: !1
  }), {
    I: !0
  }), V(), M, E]);
}, yl = (t, e, n, l, s, c) => {
  let i, d, a, u, m, _ = dt, p = 0;
  const f = (F) => F.pointerType === "mouse", [h, x] = ft(), [A, M] = ft(100), [D, E] = ft(100), [w, V] = ft(() => p), [L, j] = bl(t, s, l, wl(e, s, l, (F) => f(F) && S())), { ht: O, Qt: k, wt: y } = s, { jt: $, Nt: R, qt: Z, Bt: ee, Ft: N } = L, z = (F, H) => {
    if (V(), F)
      $(As);
    else {
      const B = J($, As, !0);
      p > 0 && !H ? w(B) : B();
    }
  }, S = () => {
    (a ? !i : !u) && (z(!0), A(() => {
      z(!1);
    }));
  }, I = (F) => {
    $(zn, F, !0), $(zn, F, !1);
  }, U = (F) => {
    f(F) && (i = a, a && z(!0));
  }, le = [V, M, E, x, () => _(), _e(O, "pointerover", U, {
    A: !0
  }), _e(O, "pointerenter", U), _e(O, "pointerleave", (F) => {
    f(F) && (i = !1, a && z(!1));
  }), _e(O, "pointermove", (F) => {
    f(F) && d && S();
  }), _e(k, "scroll", (F) => {
    h(() => {
      Z(), S();
    }), c(F), N();
  })];
  return [() => J(Le, pe(le, j())), ({ It: F, Dt: H, Zt: B, tn: G }) => {
    const { nn: T, sn: W, en: K, cn: X } = G || {}, { Ct: se, dt: ce } = B || {}, { ct: be } = n, { k: fe } = Ge(), { K: $e, rn: te } = l, [Ce, Te] = F("showNativeOverlaidScrollbars"), [ke, Ee] = F("scrollbars.theme"), [he, we] = F("scrollbars.visibility"), [ve, me] = F("scrollbars.autoHide"), [xe, Ae] = F("scrollbars.autoHideSuspend"), [$t] = F("scrollbars.autoHideDelay"), [Ft, Ht] = F("scrollbars.dragScroll"), [Rt, at] = F("scrollbars.clickScroll"), [vt, gn] = F("overflow"), bn = ce && !H, wn = te.x || te.y, yn = T || W || X || se || H, Ie = K || we || gn, kn = Ce && fe.x && fe.y, Ct = (Et, et, Bt) => {
      const Tt = Et.includes(gt) && (he === nt || he === "auto" && et === gt);
      return $(Qr, Tt, Bt), Tt;
    };
    if (p = $t, bn && (xe && wn ? (I(!1), _(), D(() => {
      _ = _e(k, "scroll", J(I, !0), {
        A: !0
      });
    })) : I(!0)), Te && $(Yr, kn), Ee && ($(m), $(ke, !0), m = ke), Ae && !xe && I(!0), me && (d = ve === "move", a = ve === "leave", u = ve === "never", z(u, !0)), Ht && $(nl, Ft), at && $(tl, !!Rt), Ie) {
      const Et = Ct(vt.x, $e.x, !0), et = Ct(vt.y, $e.y, !1);
      $(el, !(Et && et));
    }
    yn && (Z(), R(), N(), X && ee(), $(Ts, !te.x, !0), $(Ts, !te.y, !1), $(Xr, be && !y));
  }, {}, L];
}, kl = (t) => {
  const e = Ge(), { U: n, R: l } = e, { elements: s } = n(), { padding: c, viewport: i, content: d } = s, a = sn(t), u = a ? {} : t, { elements: m } = u, { padding: _, viewport: p, content: f } = m || {}, h = a ? t : u.target, x = lo(h), A = h.ownerDocument, M = A.documentElement, D = () => A.defaultView || De, E = J(ll, [h]), w = J(ko, [h]), V = J(pt, ""), L = J(E, V, i), j = J(w, V, d), O = (te) => {
    const Ce = ht(te), Te = rn(te), ke = Ze(te, Xs), Ee = Ze(te, Js);
    return Te.w - Ce.w > 0 && !wt(ke) || Te.h - Ce.h > 0 && !wt(Ee);
  }, k = L(p), y = k === h, $ = y && x, R = !y && j(f), Z = !y && k === R, ee = $ ? M : k, N = $ ? ee : h, z = !y && w(V, c, _), S = !Z && R, I = [S, ee, z, N].map((te) => sn(te) && !Mt(te) && te), U = (te) => te && qs(I, te), le = !U(ee) && O(ee) ? ee : h, F = $ ? M : ee, B = {
    vt: h,
    ht: N,
    ot: ee,
    ln: z,
    bt: S,
    gt: F,
    Qt: $ ? A : ee,
    an: x ? M : le,
    Kt: A,
    wt: x,
    Mt: a,
    nt: y,
    un: D,
    yt: (te) => ts(ee, Je, te),
    St: (te, Ce) => on(ee, Je, te, Ce),
    Ot: () => on(F, Je, Pr, !0)
  }, { vt: G, ht: T, ln: W, ot: K, bt: X } = B, se = [() => {
    Ue(T, [ot, $n]), Ue(G, $n), x && Ue(M, [$n, ot]);
  }];
  let ce = Fn([X, K, W, T, G].find((te) => te && !U(te)));
  const be = $ ? G : X || K, fe = J(Le, se);
  return [B, () => {
    const te = D(), Ce = Hn(), Te = (ve) => {
      Ve(Mt(ve), Fn(ve)), bt(ve);
    }, ke = (ve) => _e(ve, "focusin focusout focus blur", fo, {
      I: !0,
      H: !1
    }), Ee = "tabindex", he = Qn(K, Ee), we = ke(Ce);
    return Xe(T, ot, y ? "" : Ur), Xe(W, qn, ""), Xe(K, Je, ""), Xe(X, Cs, ""), y || (Xe(K, Ee, he || "-1"), x && Xe(M, $s, "")), Ve(be, ce), Ve(T, W), Ve(W || T, !y && K), Ve(K, X), pe(se, [we, () => {
      const ve = Hn(), me = U(K), xe = me && ve === K ? G : ve, Ae = ke(xe);
      Ue(W, qn), Ue(X, Cs), Ue(K, Je), x && Ue(M, $s), he ? Xe(K, Ee, he) : Ue(K, Ee), U(X) && Te(X), me && Te(K), U(W) && Te(W), Un(xe), Ae();
    }]), l && !y && (es(K, Je, go), pe(se, J(Ue, K, Je))), Un(!y && x && Ce === G && te.top === te ? K : Ce), we(), ce = 0, fe;
  }, fe];
}, xl = ({ bt: t }) => ({ Zt: e, _n: n, Dt: l }) => {
  const { xt: s } = e || {}, { $t: c } = n;
  t && (s || l) && Vt(t, {
    [_n]: c && "100%"
  });
}, Sl = ({ ht: t, ln: e, ot: n, nt: l }, s) => {
  const [c, i] = Me({
    i: Dr,
    o: hs()
  }, J(hs, t, "padding", ""));
  return ({ It: d, Zt: a, _n: u, Dt: m }) => {
    let [_, p] = i(m);
    const { R: f } = Ge(), { ft: h, Ht: x, Ct: A } = a || {}, { ct: M } = u, [D, E] = d("paddingAbsolute");
    (h || p || (m || x)) && ([_, p] = c(m));
    const V = !l && (E || A || p);
    if (V) {
      const L = !D || !e && !f, j = _.r + _.l, O = _.t + _.b, k = {
        [Ws]: L && !M ? -j : 0,
        [Ys]: L ? -O : 0,
        [Ks]: L && M ? -j : 0,
        top: L ? -_.t : 0,
        right: L ? M ? -_.r : "auto" : 0,
        left: L ? M ? "auto" : -_.l : 0,
        [vn]: L && `calc(100% + ${j}px)`
      }, y = {
        [zs]: L ? _.t : 0,
        [Ps]: L ? _.r : 0,
        [Gs]: L ? _.b : 0,
        [js]: L ? _.l : 0
      };
      Vt(e || n, k), Vt(n, y), oe(s, {
        ln: _,
        dn: !L,
        rt: e ? y : oe({}, k, y)
      });
    }
    return {
      fn: V
    };
  };
}, $l = (t, e) => {
  const n = Ge(), { ht: l, ln: s, ot: c, nt: i, Qt: d, gt: a, wt: u, St: m, un: _ } = t, { R: p } = n, f = u && i, h = J(Us, 0), x = {
    display: () => !1,
    direction: (H) => H !== "ltr",
    flexDirection: (H) => H.endsWith("-reverse"),
    writingMode: (H) => H !== "horizontal-tb"
  }, A = Be(x), M = {
    i: Zs,
    o: {
      w: 0,
      h: 0
    }
  }, D = {
    i: Wt,
    o: {}
  }, E = (H) => {
    m(ho, !f && H);
  }, w = (H) => {
    if (!A.some((be) => {
      const fe = H[be];
      return fe && x[be](fe);
    }))
      return {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 1,
          y: 1
        }
      };
    E(!0);
    const G = Oe(a), T = m(jr, !0), W = _e(d, gt, (be) => {
      const fe = Oe(a);
      be.isTrusted && fe.x === G.x && fe.y === G.y && _o(be);
    }, {
      I: !0,
      A: !0
    });
    qe(a, {
      x: 0,
      y: 0
    }), T();
    const K = Oe(a), X = rn(a);
    qe(a, {
      x: X.w,
      y: X.h
    });
    const se = Oe(a);
    qe(a, {
      x: se.x - K.x < 1 && -X.w,
      y: se.y - K.y < 1 && -X.h
    });
    const ce = Oe(a);
    return qe(a, G), Kn(() => W()), {
      D: K,
      M: ce
    };
  }, V = (H, B) => {
    const G = De.devicePixelRatio % 1 !== 0 ? 1 : 0, T = {
      w: h(H.w - B.w),
      h: h(H.h - B.h)
    };
    return {
      w: T.w > G ? T.w : 0,
      h: T.h > G ? T.h : 0
    };
  }, [L, j] = Me(M, J(ss, c)), [O, k] = Me(M, J(rn, c)), [y, $] = Me(M), [R] = Me(D), [Z, ee] = Me(M), [N] = Me(D), [z] = Me({
    i: (H, B) => fn(H, B, A),
    o: {}
  }, () => Rr(c) ? Ze(c, A) : {}), [S, I] = Me({
    i: (H, B) => Wt(H.D, B.D) && Wt(H.M, B.M),
    o: mo()
  }), U = Lt(Eo), le = (H, B) => `${B ? Nr : qr}${Ar(H)}`, F = (H) => {
    const B = (T) => [nt, it, gt].map((W) => le(W, T)), G = B(!0).concat(B()).join(" ");
    m(G), m(Be(H).map((T) => le(H[T], T === "x")).join(" "), !0);
  };
  return ({ It: H, Zt: B, _n: G, Dt: T }, { fn: W }) => {
    const { ft: K, Ht: X, Ct: se, dt: ce, zt: be } = B || {}, fe = U && U.tt(t, e, G, n, H), { it: $e, ut: te, _t: Ce } = fe || {}, [Te, ke] = fl(H, n), [Ee, he] = H("overflow"), we = wt(Ee.x), ve = wt(Ee.y), me = !0;
    let xe = j(T), Ae = k(T), $t = $(T), Ft = ee(T);
    ke && p && m(go, !Te);
    {
      ts(l, ot, Xt) && E(!0);
      const [ds] = te ? te() : [], [It] = xe = L(T), [Ut] = Ae = O(T), Nt = uo(c), qt = f && Hr(_()), Qo = {
        w: h(Ut.w + It.w),
        h: h(Ut.h + It.h)
      }, us = {
        w: h((qt ? qt.w : Nt.w + h(Nt.w - Ut.w)) + It.w),
        h: h((qt ? qt.h : Nt.h + h(Nt.h - Ut.h)) + It.h)
      };
      ds && ds(), Ft = Z(us), $t = y(V(Qo, us), T);
    }
    const [Ht, Rt] = Ft, [at, vt] = $t, [gn, bn] = Ae, [wn, yn] = xe, [Ie, kn] = R({
      x: at.w > 0,
      y: at.h > 0
    }), Ct = we && ve && (Ie.x || Ie.y) || we && Ie.x && !Ie.y || ve && Ie.y && !Ie.x, Et = W || se || be || yn || bn || Rt || vt || he || ke || me, et = ml(Ie, Ee), [Bt, Tt] = N(et.K), [Yo, Xo] = z(T), cs = se || ce || Xo || kn || T, [Jo, Zo] = cs ? S(w(Yo), T) : I();
    return Et && (Tt && F(et.K), Ce && $e && Vt(c, Ce(et, G, $e(et, gn, wn)))), E(!1), on(l, ot, Xt, Ct), on(s, qn, Xt, Ct), oe(e, {
      K: Bt,
      Vt: {
        x: Ht.w,
        y: Ht.h
      },
      Rt: {
        x: at.w,
        y: at.h
      },
      rn: Ie,
      Lt: Br(Jo, at)
    }), {
      en: Tt,
      nn: Rt,
      sn: vt,
      cn: Zo || vt,
      vn: cs
    };
  };
}, Cl = (t) => {
  const [e, n, l] = kl(t), s = {
    ln: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    dn: !1,
    rt: {
      [Ws]: 0,
      [Ys]: 0,
      [Ks]: 0,
      [zs]: 0,
      [Ps]: 0,
      [Gs]: 0,
      [js]: 0
    },
    Vt: {
      x: 0,
      y: 0
    },
    Rt: {
      x: 0,
      y: 0
    },
    K: {
      x: it,
      y: it
    },
    rn: {
      x: !1,
      y: !1
    },
    Lt: mo()
  }, { vt: c, gt: i, nt: d, Ot: a } = e, { R: u, k: m } = Ge(), _ = !u && (m.x || m.y), p = [xl(e), Sl(e, s), $l(e, s)];
  return [n, (f) => {
    const h = {}, A = _ && Oe(i), M = A && a();
    return ie(p, (D) => {
      oe(h, D(f, h) || {});
    }), qe(i, A), M && M(), !d && qe(c, 0), h;
  }, s, e, l];
}, El = (t, e, n, l, s) => {
  let c = !1;
  const i = Ss(e, {}), [d, a, u, m, _] = Cl(t), [p, f, h] = gl(m, u, i, (w) => {
    E({}, w);
  }), [x, A, , M] = yl(t, e, h, u, m, s), D = (w) => Be(w).some((V) => !!w[V]), E = (w, V) => {
    if (n())
      return !1;
    const { pn: L, Dt: j, At: O, hn: k } = w, y = L || {}, $ = !!j || !c, R = {
      It: Ss(e, y, $),
      pn: y,
      Dt: $
    };
    if (k)
      return A(R), !1;
    const Z = V || f(oe({}, R, {
      At: O
    })), ee = a(oe({}, R, {
      _n: h,
      Zt: Z
    }));
    A(oe({}, R, {
      Zt: Z,
      tn: ee
    }));
    const N = D(Z), z = D(ee), S = N || z || !Zn(y) || $;
    return c = !0, S && l(w, {
      Zt: Z,
      tn: ee
    }), S;
  };
  return [() => {
    const { an: w, gt: V, Ot: L } = m, j = Oe(w), O = [p(), d(), x()], k = L();
    return qe(V, j), k(), J(Le, O);
  }, E, () => ({
    gn: h,
    bn: u
  }), {
    wn: m,
    yn: M
  }, _];
}, je = (t, e, n) => {
  const { N: l } = Ge(), s = sn(t), c = s ? t : t.target, i = xo(c);
  if (e && !i) {
    let d = !1;
    const a = [], u = {}, m = (y) => {
      const $ = eo(y), R = Lt(vl);
      return R ? R($, !0) : $;
    }, _ = oe({}, l(), m(e)), [p, f, h] = Nn(), [x, A, M] = Nn(n), D = (y, $) => {
      M(y, $), h(y, $);
    }, [E, w, V, L, j] = El(t, _, () => d, ({ pn: y, Dt: $ }, { Zt: R, tn: Z }) => {
      const { ft: ee, Ct: N, xt: z, Ht: S, Et: I, dt: U } = R, { nn: le, sn: F, en: H, cn: B } = Z;
      D("updated", [k, {
        updateHints: {
          sizeChanged: !!ee,
          directionChanged: !!N,
          heightIntrinsicChanged: !!z,
          overflowEdgeChanged: !!le,
          overflowAmountChanged: !!F,
          overflowStyleChanged: !!H,
          scrollCoordinatesChanged: !!B,
          contentMutation: !!S,
          hostMutation: !!I,
          appear: !!U
        },
        changedOptions: y || {},
        force: !!$
      }]);
    }, (y) => D("scroll", [k, y])), O = (y) => {
      cl(c), Le(a), d = !0, D("destroyed", [k, y]), f(), A();
    }, k = {
      options(y, $) {
        if (y) {
          const R = $ ? l() : {}, Z = po(_, oe(R, m(y)));
          Zn(Z) || (oe(_, Z), w({
            pn: Z
          }));
        }
        return oe({}, _);
      },
      on: x,
      off: (y, $) => {
        y && $ && A(y, $);
      },
      state() {
        const { gn: y, bn: $ } = V(), { ct: R } = y, { Vt: Z, Rt: ee, K: N, rn: z, ln: S, dn: I, Lt: U } = $;
        return oe({}, {
          overflowEdge: Z,
          overflowAmount: ee,
          overflowStyle: N,
          hasOverflow: z,
          scrollCoordinates: {
            start: U.D,
            end: U.M
          },
          padding: S,
          paddingAbsolute: I,
          directionRTL: R,
          destroyed: d
        });
      },
      elements() {
        const { vt: y, ht: $, ln: R, ot: Z, bt: ee, gt: N, Qt: z } = L.wn, { Xt: S, Gt: I } = L.yn, U = (F) => {
          const { Pt: H, Ut: B, Tt: G } = F;
          return {
            scrollbar: G,
            track: B,
            handle: H
          };
        }, le = (F) => {
          const { Yt: H, Wt: B } = F, G = U(H[0]);
          return oe({}, G, {
            clone: () => {
              const T = U(B());
              return w({
                hn: !0
              }), T;
            }
          });
        };
        return oe({}, {
          target: y,
          host: $,
          padding: R || Z,
          viewport: Z,
          content: ee || Z,
          scrollOffsetElement: N,
          scrollEventElement: z,
          scrollbarHorizontal: le(S),
          scrollbarVertical: le(I)
        });
      },
      update: (y) => w({
        Dt: y,
        At: !0
      }),
      destroy: J(O, !1),
      plugin: (y) => u[Be(y)[0]]
    };
    return pe(a, [j]), il(c, k), Co(So, je, [k, p, u]), al(L.wn.wt, !s && t.cancel) ? (O(!0), k) : (pe(a, E()), D("initialized", [k]), k.update(), k);
  }
  return i;
};
je.plugin = (t) => {
  const e = Pe(t), n = e ? t : [t], l = n.map((s) => Co(s, je)[0]);
  return ul(n), e ? l : l[0];
};
je.valid = (t) => {
  const e = t && t.elements, n = Re(e) && e();
  return nn(n) && !!xo(n.target);
};
je.env = () => {
  const { T: t, k: e, R: n, V: l, B: s, F: c, U: i, P: d, N: a, q: u } = Ge();
  return oe({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: e,
    scrollbarsHiding: n,
    scrollTimeline: l,
    staticDefaultInitialization: s,
    staticDefaultOptions: c,
    getDefaultInitialization: i,
    setDefaultInitialization: d,
    getDefaultOptions: a,
    setDefaultOptions: u
  });
};
je.nonce = ol;
function Tl() {
  let t;
  const e = C(null), n = Math.floor(Math.random() * 2 ** 32), l = C(!1), s = C([]), c = () => s.value, i = () => t.getSelection(), d = () => s.value.length, a = () => t.clearSelection(!0), u = C(), m = C(null), _ = C(null), p = C(null), f = C(null);
  function h() {
    t = new ur({
      area: e.value,
      keyboardDrag: !1,
      selectedClass: "vf-explorer-selected",
      selectorClass: "vf-explorer-selector"
    }), t.subscribe("DS:start:pre", ({ items: V, event: L, isDragging: j }) => {
      if (j)
        t.Interaction._reset(L);
      else {
        l.value = !1;
        const O = e.value.offsetWidth - L.offsetX, k = e.value.offsetHeight - L.offsetY;
        O < 15 && k < 15 && t.Interaction._reset(L), L.target.classList.contains("os-scrollbar-handle") && t.Interaction._reset(L);
      }
    }), document.addEventListener("dragleave", (V) => {
      !V.buttons && l.value && (l.value = !1);
    });
  }
  const x = () => ct(() => {
    t.addSelection(
      t.getSelectables()
    ), A();
  }), A = () => {
    s.value = t.getSelection().map((V) => JSON.parse(V.dataset.item)), u.value(s.value);
  }, M = () => ct(() => {
    const V = c().map((L) => L.path);
    a(), t.setSettings({
      selectables: document.getElementsByClassName("vf-item-" + n)
    }), t.addSelection(
      t.getSelectables().filter((L) => V.includes(JSON.parse(L.dataset.item).path))
    ), A(), E();
  }), D = (V) => {
    u.value = V, t.subscribe("DS:end", ({ items: L, event: j, isDragging: O }) => {
      s.value = L.map((k) => JSON.parse(k.dataset.item)), V(L.map((k) => JSON.parse(k.dataset.item)));
    });
  }, E = () => {
    m.value && (e.value.getBoundingClientRect().height < e.value.scrollHeight ? (_.value.style.height = e.value.scrollHeight + "px", _.value.style.display = "block") : (_.value.style.height = "100%", _.value.style.display = "none"));
  }, w = (V) => {
    if (!m.value)
      return;
    const { scrollOffsetElement: L } = m.value.elements();
    L.scrollTo(
      {
        top: e.value.scrollTop,
        left: 0
      }
    );
  };
  return Se(() => {
    je(p.value, {
      scrollbars: {
        theme: "vf-theme-dark dark:vf-theme-light"
      },
      plugins: {
        OverlayScrollbars: je
        // ScrollbarsHidingPlugin,
        // SizeObserverPlugin,
        // ClickScrollPlugin
      }
    }, {
      initialized: (V) => {
        m.value = V;
      },
      scroll: (V, L) => {
        const { scrollOffsetElement: j } = V.elements();
        e.value.scrollTo({
          top: j.scrollTop,
          left: 0
        });
      }
    }), h(), E(), f.value = new ResizeObserver(E), f.value.observe(e.value), e.value.addEventListener("scroll", w), t.subscribe("DS:scroll", ({ isDragging: V }) => V || w());
  }), Gn(() => {
    t && t.stop(), f.value && f.value.disconnect();
  }), Ls(() => {
    t && t.Area.reset();
  }), {
    area: e,
    explorerId: n,
    isDraggingRef: l,
    scrollBar: _,
    scrollBarContainer: p,
    getSelected: c,
    getSelection: i,
    selectAll: x,
    clearSelection: a,
    refreshSelection: M,
    getCount: d,
    onSelect: D
  };
}
function Al(t, e) {
  const n = C(t), l = C(e), s = C([]), c = C([]), i = C([]), d = C(!1), a = C(5);
  let u = !1, m = !1;
  const _ = yt({
    adapter: n,
    storages: [],
    dirname: l,
    files: []
  });
  function p() {
    let D = [], E = [], w = l.value ?? n.value + "://";
    w.length === 0 && (s.value = []), w.replace(n.value + "://", "").split("/").forEach(function(j) {
      D.push(j), D.join("/") !== "" && E.push({
        basename: j,
        name: j,
        path: n.value + "://" + D.join("/"),
        type: "dir"
      });
    }), c.value = E;
    const [V, L] = h(E, a.value);
    i.value = L, s.value = V;
  }
  function f(D) {
    a.value = D, p();
  }
  function h(D, E) {
    return D.length > E ? [D.slice(-E), D.slice(0, -E)] : [D, []];
  }
  function x(D = null) {
    d.value = D ?? !d.value;
  }
  function A() {
    return s.value && s.value.length && !m;
  }
  const M = rt(() => {
    var D;
    return ((D = s.value[s.value.length - 2]) == null ? void 0 : D.path) ?? n.value + "://";
  });
  return Se(() => {
  }), He(l, p), Se(p), {
    adapter: n,
    path: l,
    loading: u,
    searchMode: m,
    data: _,
    breadcrumbs: s,
    breadcrumbItems: c,
    limitBreadcrumbItems: f,
    hiddenBreadcrumbs: i,
    showHiddenBreadcrumbs: d,
    toggleHiddenBreadcrumbs: x,
    isGoUpAvailable: A,
    parentFolderPath: M
  };
}
const Dl = (t, e) => {
  const n = gr(t.id), l = dr(), s = n.getStore("metricUnits", !1), c = Sr(n, t.theme), i = e.i18n, d = t.locale ?? e.locale, a = n.getStore("adapter"), u = (p) => Array.isArray(p) ? p : yr, m = n.getStore("persist-path", t.persist), _ = m ? n.getStore("path", t.path) : t.path;
  return yt({
    /** 
    * Core properties
    * */
    // app version
    version: kr,
    // root element
    root: null,
    // app id
    debug: t.debug,
    // Event Bus
    emitter: l,
    // storage
    storage: n,
    // localization object
    i18n: wr(n, d, l, i),
    // modal state
    modal: $r(),
    // dragSelect object, it is responsible for selecting items
    dragSelect: rt(() => Tl()),
    // http object
    requester: hr(t.request),
    // active features
    features: u(t.features),
    // view state
    view: n.getStore("viewport", "grid"),
    // fullscreen state
    fullScreen: n.getStore("full-screen", t.fullScreen),
    // show tree view
    showTreeView: n.getStore("show-tree-view", t.showTreeView),
    // pinnedFolders
    pinnedFolders: n.getStore("pinned-folders", t.pinnedFolders),
    // treeViewData
    treeViewData: [],
    // selectButton state
    selectButton: t.selectButton,
    // max file size
    maxFileSize: t.maxFileSize,
    /**
    * Settings
    * */
    // theme state
    theme: c,
    // unit state - for example: GB or GiB
    metricUnits: s,
    // human readable file sizes
    filesize: s ? Is : Bs,
    // show large icons in list view
    compactListView: n.getStore("compact-list-view", !0),
    // persist state
    persist: m,
    // show thumbnails
    showThumbnails: n.getStore("show-thumbnails", t.showThumbnails),
    // file system
    fs: Al(a, _)
  });
}, Ml = { class: "vuefinder__modal-layout__container" }, Vl = { class: "vuefinder__modal-layout__content" }, Ol = { class: "vuefinder__modal-layout__footer" }, Ke = {
  __name: "ModalLayout",
  setup(t) {
    const e = C(null), n = re("ServiceContainer");
    return Se(() => {
      const l = document.querySelector(".v-f-modal input");
      l && l.focus(), ct(() => {
        if (document.querySelector(".v-f-modal input") && window.innerWidth < 768) {
          const s = e.value.getBoundingClientRect().bottom + 16;
          window.scrollTo({
            top: s,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    }), (l, s) => (v(), g("div", {
      class: "vuefinder__modal-layout",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: s[1] || (s[1] = kt((c) => o(n).modal.close(), ["esc"])),
      tabindex: "0"
    }, [
      s[2] || (s[2] = r("div", { class: "vuefinder__modal-layout__overlay" }, null, -1)),
      r("div", Ml, [
        r("div", {
          class: "vuefinder__modal-layout__wrapper",
          onMousedown: s[0] || (s[0] = st((c) => o(n).modal.close(), ["self"]))
        }, [
          r("div", {
            ref_key: "modalBody",
            ref: e,
            class: "vuefinder__modal-layout__body"
          }, [
            r("div", Vl, [
              At(l.$slots, "default")
            ]),
            r("div", Ol, [
              At(l.$slots, "buttons")
            ])
          ], 512)
        ], 32)
      ])
    ], 32));
  }
}, Ll = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [l, s] of e)
    n[l] = s;
  return n;
}, Fl = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(t, { emit: e, slots: n }) {
    const l = re("ServiceContainer"), s = C(!1), { t: c } = l.i18n;
    let i = null;
    const d = () => {
      clearTimeout(i), s.value = !0, i = setTimeout(() => {
        s.value = !1;
      }, 2e3);
    };
    return Se(() => {
      l.emitter.on(t.on, d);
    }), Gn(() => {
      clearTimeout(i);
    }), {
      shown: s,
      t: c
    };
  }
}, Hl = { key: 1 };
function Rl(t, e, n, l, s, c) {
  return v(), g("div", {
    class: ae(["vuefinder__action-message", { "vuefinder__action-message--hidden": !l.shown }])
  }, [
    t.$slots.default ? At(t.$slots, "default", { key: 0 }) : (v(), g("span", Hl, b(l.t("Saved.")), 1))
  ], 2);
}
const _t = /* @__PURE__ */ Ll(Fl, [["render", Rl]]), Bl = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function Il(t, e) {
  return v(), g("svg", Bl, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87q.11.06.22.127c.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a8 8 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124q.108-.066.22-.128c.332-.183.582-.495.644-.869z"
    }, null, -1),
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
    }, null, -1)
  ]));
}
const Ul = { render: Il }, Nl = { class: "vuefinder__modal-header" }, ql = { class: "vuefinder__modal-header__icon-container" }, zl = {
  class: "vuefinder__modal-header__title",
  id: "modal-title"
}, Qe = {
  __name: "ModalHeader",
  props: {
    title: {
      type: String,
      required: !0
    },
    icon: {
      type: Object,
      required: !0
    }
  },
  setup(t) {
    return (e, n) => (v(), g("div", Nl, [
      r("div", ql, [
        (v(), Y(Fs(t.icon), { class: "vuefinder__modal-header__icon" }))
      ]),
      r("h3", zl, b(t.title), 1)
    ]));
  }
}, Pl = { class: "vuefinder__about-modal__content" }, jl = { class: "vuefinder__about-modal__main" }, Gl = {
  class: "vuefinder__about-modal__tabs",
  "aria-label": "Tabs"
}, Kl = ["onClick", "aria-current"], Wl = {
  key: 0,
  class: "vuefinder__about-modal__tab-content"
}, Yl = { class: "vuefinder__about-modal__description" }, Xl = {
  href: "https://vuefinder.ozdemir.be",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, Jl = {
  href: "https://github.com/n1crack/vuefinder",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, Zl = {
  key: 1,
  class: "vuefinder__about-modal__tab-content"
}, Ql = { class: "vuefinder__about-modal__description" }, ea = { class: "vuefinder__about-modal__settings" }, ta = { class: "vuefinder__about-modal__setting flex" }, na = { class: "vuefinder__about-modal__setting-input" }, sa = { class: "vuefinder__about-modal__setting-label" }, oa = {
  for: "metric_unit",
  class: "vuefinder__about-modal__label"
}, ra = { class: "vuefinder__about-modal__setting flex" }, la = { class: "vuefinder__about-modal__setting-input" }, aa = { class: "vuefinder__about-modal__setting-label" }, ia = {
  for: "large_icons",
  class: "vuefinder__about-modal__label"
}, ca = { class: "vuefinder__about-modal__setting flex" }, da = { class: "vuefinder__about-modal__setting-input" }, ua = { class: "vuefinder__about-modal__setting-label" }, va = {
  for: "persist_path",
  class: "vuefinder__about-modal__label"
}, _a = { class: "vuefinder__about-modal__setting flex" }, fa = { class: "vuefinder__about-modal__setting-input" }, ma = { class: "vuefinder__about-modal__setting-label" }, pa = {
  for: "show_thumbnails",
  class: "vuefinder__about-modal__label"
}, ha = { class: "vuefinder__about-modal__setting" }, ga = { class: "vuefinder__about-modal__setting-input" }, ba = {
  for: "theme",
  class: "vuefinder__about-modal__label"
}, wa = { class: "vuefinder__about-modal__setting-label" }, ya = ["label"], ka = ["value"], xa = {
  key: 0,
  class: "vuefinder__about-modal__setting"
}, Sa = { class: "vuefinder__about-modal__setting-input" }, $a = {
  for: "language",
  class: "vuefinder__about-modal__label"
}, Ca = { class: "vuefinder__about-modal__setting-label" }, Ea = ["label"], Ta = ["value"], Aa = {
  key: 2,
  class: "vuefinder__about-modal__tab-content"
}, Da = { class: "vuefinder__about-modal__shortcuts" }, Ma = { class: "vuefinder__about-modal__shortcut" }, Va = { class: "vuefinder__about-modal__shortcut" }, Oa = { class: "vuefinder__about-modal__shortcut" }, La = { class: "vuefinder__about-modal__shortcut" }, Fa = { class: "vuefinder__about-modal__shortcut" }, Ha = { class: "vuefinder__about-modal__shortcut" }, Ra = { class: "vuefinder__about-modal__shortcut" }, Ba = { class: "vuefinder__about-modal__shortcut" }, Ia = { class: "vuefinder__about-modal__shortcut" }, Ua = {
  key: 3,
  class: "vuefinder__about-modal__tab-content"
}, Na = { class: "vuefinder__about-modal__description" }, Ao = {
  __name: "ModalAbout",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n, clearStore: l } = e.storage, { t: s } = e.i18n, c = {
      ABOUT: "about",
      SETTINGS: "settings",
      SHORTCUTS: "shortcuts",
      RESET: "reset"
    }, i = rt(() => [
      { name: s("About"), key: c.ABOUT },
      { name: s("Settings"), key: c.SETTINGS },
      { name: s("Shortcuts"), key: c.SHORTCUTS },
      { name: s("Reset"), key: c.RESET }
    ]), d = C("about"), a = async () => {
      l(), location.reload();
    }, u = (D) => {
      e.theme.set(D), e.emitter.emit("vf-theme-saved");
    }, m = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? Is : Bs, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, _ = () => {
      e.compactListView = !e.compactListView, n("compactListView", e.compactListView), e.emitter.emit("vf-compact-view-saved");
    }, p = () => {
      e.showThumbnails = !e.showThumbnails, n("show-thumbnails", e.showThumbnails), e.emitter.emit("vf-show-thumbnails-saved");
    }, f = () => {
      e.persist = !e.persist, n("persist-path", e.persist), e.emitter.emit("vf-persist-path-saved");
    }, { i18n: h } = re("VueFinderOptions"), A = Object.fromEntries(
      Object.entries({
        en: "English",
        fr: "French (Français)",
        de: "German (Deutsch)",
        fa: "Persian (فارسی)",
        he: "Hebrew (עִברִית)",
        hi: "Hindi (हिंदी)",
        ru: "Russian (Pусский)",
        sv: "Swedish (Svenska)",
        tr: "Turkish (Türkçe)",
        zhCN: "Simplified Chinese (简体中文)",
        zhTW: "Traditional Chinese (繁體中文)"
      }).filter(([D]) => Object.keys(h).includes(D))
    ), M = rt(() => ({
      system: s("System"),
      light: s("Light"),
      dark: s("Dark")
    }));
    return (D, E) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          onClick: E[7] || (E[7] = (w) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(s)("Close")), 1)
      ]),
      default: ne(() => [
        r("div", Pl, [
          P(Qe, {
            icon: o(Ul),
            title: "Vuefinder " + o(e).version
          }, null, 8, ["icon", "title"]),
          r("div", jl, [
            r("div", null, [
              r("div", null, [
                r("nav", Gl, [
                  (v(!0), g(ge, null, ye(i.value, (w) => (v(), g("button", {
                    key: w.name,
                    onClick: (V) => d.value = w.key,
                    class: ae([w.key === d.value ? "vuefinder__about-modal__tab--active" : "vuefinder__about-modal__tab--inactive", "vuefinder__about-modal__tab"]),
                    "aria-current": w.current ? "page" : void 0
                  }, b(w.name), 11, Kl))), 128))
                ])
              ])
            ]),
            d.value === c.ABOUT ? (v(), g("div", Wl, [
              r("div", Yl, b(o(s)("Vuefinder is a simple, lightweight, and fast file manager library for Vue.js applications")), 1),
              r("a", Xl, b(o(s)("Project home")), 1),
              r("a", Jl, b(o(s)("Follow on GitHub")), 1)
            ])) : q("", !0),
            d.value === c.SETTINGS ? (v(), g("div", Zl, [
              r("div", Ql, b(o(s)("Customize your experience with the following settings")), 1),
              r("div", ea, [
                r("fieldset", null, [
                  r("div", ta, [
                    r("div", na, [
                      ue(r("input", {
                        id: "metric_unit",
                        name: "metric_unit",
                        type: "checkbox",
                        "onUpdate:modelValue": E[0] || (E[0] = (w) => o(e).metricUnits = w),
                        onClick: m,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).metricUnits]
                      ])
                    ]),
                    r("div", sa, [
                      r("label", oa, [
                        Q(b(o(s)("Use Metric Units")) + " ", 1),
                        P(_t, {
                          class: "ms-3",
                          on: "vf-metric-units-saved"
                        }, {
                          default: ne(() => [
                            Q(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  r("div", ra, [
                    r("div", la, [
                      ue(r("input", {
                        id: "large_icons",
                        name: "large_icons",
                        type: "checkbox",
                        "onUpdate:modelValue": E[1] || (E[1] = (w) => o(e).compactListView = w),
                        onClick: _,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).compactListView]
                      ])
                    ]),
                    r("div", aa, [
                      r("label", ia, [
                        Q(b(o(s)("Compact list view")) + " ", 1),
                        P(_t, {
                          class: "ms-3",
                          on: "vf-compact-view-saved"
                        }, {
                          default: ne(() => [
                            Q(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  r("div", ca, [
                    r("div", da, [
                      ue(r("input", {
                        id: "persist_path",
                        name: "persist_path",
                        type: "checkbox",
                        "onUpdate:modelValue": E[2] || (E[2] = (w) => o(e).persist = w),
                        onClick: f,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).persist]
                      ])
                    ]),
                    r("div", ua, [
                      r("label", va, [
                        Q(b(o(s)("Persist path on reload")) + " ", 1),
                        P(_t, {
                          class: "ms-3",
                          on: "vf-persist-path-saved"
                        }, {
                          default: ne(() => [
                            Q(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  r("div", _a, [
                    r("div", fa, [
                      ue(r("input", {
                        id: "show_thumbnails",
                        name: "show_thumbnails",
                        type: "checkbox",
                        "onUpdate:modelValue": E[3] || (E[3] = (w) => o(e).showThumbnails = w),
                        onClick: p,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).showThumbnails]
                      ])
                    ]),
                    r("div", ma, [
                      r("label", pa, [
                        Q(b(o(s)("Show thumbnails")) + " ", 1),
                        P(_t, {
                          class: "ms-3",
                          on: "vf-show-thumbnails-saved"
                        }, {
                          default: ne(() => [
                            Q(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  r("div", ha, [
                    r("div", ga, [
                      r("label", ba, b(o(s)("Theme")), 1)
                    ]),
                    r("div", wa, [
                      ue(r("select", {
                        id: "theme",
                        "onUpdate:modelValue": E[4] || (E[4] = (w) => o(e).theme.value = w),
                        onChange: E[5] || (E[5] = (w) => u(w.target.value)),
                        class: "vuefinder__about-modal__select"
                      }, [
                        r("optgroup", {
                          label: o(s)("Theme")
                        }, [
                          (v(!0), g(ge, null, ye(M.value, (w, V) => (v(), g("option", { value: V }, b(w), 9, ka))), 256))
                        ], 8, ya)
                      ], 544), [
                        [Jt, o(e).theme.value]
                      ]),
                      P(_t, {
                        class: "ms-3",
                        on: "vf-theme-saved"
                      }, {
                        default: ne(() => [
                          Q(b(o(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  o(e).features.includes(o(de).LANGUAGE) && Object.keys(o(A)).length > 1 ? (v(), g("div", xa, [
                    r("div", Sa, [
                      r("label", $a, b(o(s)("Language")), 1)
                    ]),
                    r("div", Ca, [
                      ue(r("select", {
                        id: "language",
                        "onUpdate:modelValue": E[6] || (E[6] = (w) => o(e).i18n.locale = w),
                        class: "vuefinder__about-modal__select"
                      }, [
                        r("optgroup", {
                          label: o(s)("Language")
                        }, [
                          (v(!0), g(ge, null, ye(o(A), (w, V) => (v(), g("option", { value: V }, b(w), 9, Ta))), 256))
                        ], 8, Ea)
                      ], 512), [
                        [Jt, o(e).i18n.locale]
                      ]),
                      P(_t, {
                        class: "ms-3",
                        on: "vf-language-saved"
                      }, {
                        default: ne(() => [
                          Q(b(o(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ])) : q("", !0)
                ])
              ])
            ])) : q("", !0),
            d.value === c.SHORTCUTS ? (v(), g("div", Aa, [
              r("div", Da, [
                r("div", Ma, [
                  r("div", null, b(o(s)("Rename")), 1),
                  E[8] || (E[8] = r("kbd", null, "F2", -1))
                ]),
                r("div", Va, [
                  r("div", null, b(o(s)("Refresh")), 1),
                  E[9] || (E[9] = r("kbd", null, "F5", -1))
                ]),
                r("div", Oa, [
                  Q(b(o(s)("Delete")) + " ", 1),
                  E[10] || (E[10] = r("kbd", null, "Del", -1))
                ]),
                r("div", La, [
                  Q(b(o(s)("Escape")) + " ", 1),
                  E[11] || (E[11] = r("div", null, [
                    r("kbd", null, "Esc")
                  ], -1))
                ]),
                r("div", Fa, [
                  Q(b(o(s)("Select All")) + " ", 1),
                  E[12] || (E[12] = r("div", null, [
                    r("kbd", null, "Ctrl"),
                    Q(" + "),
                    r("kbd", null, "A")
                  ], -1))
                ]),
                r("div", Ha, [
                  Q(b(o(s)("Search")) + " ", 1),
                  E[13] || (E[13] = r("div", null, [
                    r("kbd", null, "Ctrl"),
                    Q(" + "),
                    r("kbd", null, "F")
                  ], -1))
                ]),
                r("div", Ra, [
                  Q(b(o(s)("Toggle Sidebar")) + " ", 1),
                  E[14] || (E[14] = r("div", null, [
                    r("kbd", null, "Ctrl"),
                    Q(" + "),
                    r("kbd", null, "E")
                  ], -1))
                ]),
                r("div", Ba, [
                  Q(b(o(s)("Open Settings")) + " ", 1),
                  E[15] || (E[15] = r("div", null, [
                    r("kbd", null, "Ctrl"),
                    Q(" + "),
                    r("kbd", null, ",")
                  ], -1))
                ]),
                r("div", Ia, [
                  Q(b(o(s)("Toggle Full Screen")) + " ", 1),
                  E[16] || (E[16] = r("div", null, [
                    r("kbd", null, "Ctrl"),
                    Q(" + "),
                    r("kbd", null, "Enter")
                  ], -1))
                ])
              ])
            ])) : q("", !0),
            d.value === c.RESET ? (v(), g("div", Ua, [
              r("div", Na, b(o(s)("Reset all settings to default")), 1),
              r("button", {
                onClick: a,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(s)("Reset Settings")), 1)
            ])) : q("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, qa = ["title"], We = {
  __name: "Message",
  props: {
    error: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["hidden"],
  setup(t, { emit: e }) {
    var u;
    const n = e, l = re("ServiceContainer"), { t: s } = l.i18n, c = C(!1), i = C(null), d = C((u = i.value) == null ? void 0 : u.strMessage);
    He(d, () => c.value = !1);
    const a = () => {
      n("hidden"), c.value = !0;
    };
    return (m, _) => (v(), g("div", null, [
      c.value ? q("", !0) : (v(), g("div", {
        key: 0,
        ref_key: "strMessage",
        ref: i,
        class: ae(["vuefinder__message", t.error ? "vuefinder__message--error" : "vuefinder__message--success"])
      }, [
        At(m.$slots, "default"),
        r("div", {
          class: "vuefinder__message__close",
          onClick: a,
          title: o(s)("Close")
        }, _[0] || (_[0] = [
          r("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            stroke: "currentColor",
            class: "vuefinder__message__icon"
          }, [
            r("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M6 18L18 6M6 6l12 12"
            })
          ], -1)
        ]), 8, qa)
      ], 2))
    ]));
  }
}, za = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Pa(t, e) {
  return v(), g("svg", za, e[0] || (e[0] = [
    r("path", { d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" }, null, -1)
  ]));
}
const Do = { render: Pa }, ja = { class: "vuefinder__delete-modal__content" }, Ga = { class: "vuefinder__delete-modal__form" }, Ka = { class: "vuefinder__delete-modal__description" }, Wa = { class: "vuefinder__delete-modal__files vf-scrollbar" }, Ya = { class: "vuefinder__delete-modal__file" }, Xa = {
  key: 0,
  class: "vuefinder__delete-modal__icon vuefinder__delete-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ja = {
  key: 1,
  class: "vuefinder__delete-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Za = { class: "vuefinder__delete-modal__file-name" }, Qa = { class: "vuefinder__delete-modal__warning" }, as = {
  __name: "ModalDelete",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = C(e.modal.data.items), s = C(""), c = () => {
      l.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: l.value.map(({ path: i, type: d }) => ({ path: i, type: d }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files deleted.") });
        },
        onError: (i) => {
          s.value = n(i.message);
        }
      });
    };
    return (i, d) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-danger"
        }, b(o(n)("Yes, Delete!")), 1),
        r("button", {
          type: "button",
          onClick: d[1] || (d[1] = (a) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1),
        r("div", Qa, b(o(n)("This action cannot be undone.")), 1)
      ]),
      default: ne(() => [
        r("div", null, [
          P(Qe, {
            icon: o(Do),
            title: o(n)("Delete files")
          }, null, 8, ["icon", "title"]),
          r("div", ja, [
            r("div", Ga, [
              r("p", Ka, b(o(n)("Are you sure you want to delete these files?")), 1),
              r("div", Wa, [
                (v(!0), g(ge, null, ye(l.value, (a) => (v(), g("p", Ya, [
                  a.type === "dir" ? (v(), g("svg", Xa, d[2] || (d[2] = [
                    r("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (v(), g("svg", Ja, d[3] || (d[3] = [
                    r("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  r("span", Za, b(a.basename), 1)
                ]))), 256))
              ]),
              s.value.length ? (v(), Y(We, {
                key: 0,
                onHidden: d[0] || (d[0] = (a) => s.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  Q(b(s.value), 1)
                ]),
                _: 1
              })) : q("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ei = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function ti(t, e) {
  return v(), g("svg", ei, e[0] || (e[0] = [
    r("path", { d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }, null, -1)
  ]));
}
const Mo = { render: ti }, ni = { class: "vuefinder__rename-modal__content" }, si = { class: "vuefinder__rename-modal__item" }, oi = { class: "vuefinder__rename-modal__item-info" }, ri = {
  key: 0,
  class: "vuefinder__rename-modal__icon vuefinder__rename-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, li = {
  key: 1,
  class: "vuefinder__rename-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ai = { class: "vuefinder__rename-modal__item-name" }, ln = {
  __name: "ModalRename",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = C(e.modal.data.items[0]), s = C(e.modal.data.items[0].basename), c = C(""), i = () => {
      s.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: l.value.path,
          name: s.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is renamed.", s.value) });
        },
        onError: (d) => {
          c.value = n(d.message);
        }
      });
    };
    return (d, a) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Rename")), 1),
        r("button", {
          type: "button",
          onClick: a[2] || (a[2] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: ne(() => [
        r("div", null, [
          P(Qe, {
            icon: o(Mo),
            title: o(n)("Rename")
          }, null, 8, ["icon", "title"]),
          r("div", ni, [
            r("div", si, [
              r("p", oi, [
                l.value.type === "dir" ? (v(), g("svg", ri, a[3] || (a[3] = [
                  r("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (v(), g("svg", li, a[4] || (a[4] = [
                  r("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                r("span", ai, b(l.value.basename), 1)
              ]),
              ue(r("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (u) => s.value = u),
                onKeyup: kt(i, ["enter"]),
                class: "vuefinder__rename-modal__input",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [xt, s.value]
              ]),
              c.value.length ? (v(), Y(We, {
                key: 0,
                onHidden: a[1] || (a[1] = (u) => c.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  Q(b(c.value), 1)
                ]),
                _: 1
              })) : q("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Ye = {
  ESCAPE: "Escape",
  F2: "F2",
  F5: "F5",
  DELETE: "Delete",
  ENTER: "Enter",
  BACKSLASH: "Backslash",
  KEY_A: "KeyA",
  KEY_E: "KeyE",
  KEY_F: "KeyF"
};
function ii(t) {
  const e = (n) => {
    n.code === Ye.ESCAPE && (t.modal.close(), t.root.focus()), !t.modal.visible && (t.fs.searchMode || (n.code === Ye.F2 && t.features.includes(de.RENAME) && (t.dragSelect.getCount() !== 1 || t.modal.open(ln, { items: t.dragSelect.getSelected() })), n.code === Ye.F5 && t.emitter.emit("vf-fetch", { params: { q: "index", adapter: t.fs.adapter, path: t.fs.data.dirname } }), n.code === Ye.DELETE && (!t.dragSelect.getCount() || t.modal.open(as, { items: t.dragSelect.getSelected() })), n.metaKey && n.code === Ye.BACKSLASH && t.modal.open(Ao), n.metaKey && n.code === Ye.KEY_F && t.features.includes(de.SEARCH) && (t.fs.searchMode = !0, n.preventDefault()), n.metaKey && n.code === Ye.KEY_E && (t.showTreeView = !t.showTreeView, t.storage.setStore("show-tree-view", t.showTreeView)), n.metaKey && n.code === Ye.ENTER && (t.fullScreen = !t.fullScreen, t.root.focus()), n.metaKey && n.code === Ye.KEY_A && (t.dragSelect.selectAll(), n.preventDefault())));
  };
  Se(() => {
    t.root.addEventListener("keydown", e);
  });
}
const ci = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function di(t, e) {
  return v(), g("svg", ci, e[0] || (e[0] = [
    r("path", { d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" }, null, -1)
  ]));
}
const Vo = { render: di }, ui = { class: "vuefinder__new-folder-modal__content" }, vi = { class: "vuefinder__new-folder-modal__form" }, _i = { class: "vuefinder__new-folder-modal__description" }, fi = ["placeholder"], Oo = {
  __name: "ModalNewFolder",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, l = C(""), s = C(""), c = () => {
      l.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: l.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", l.value) });
        },
        onError: (i) => {
          s.value = n(i.message);
        }
      });
    };
    return (i, d) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        r("button", {
          type: "button",
          onClick: d[2] || (d[2] = (a) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: ne(() => [
        r("div", null, [
          P(Qe, {
            icon: o(Vo),
            title: o(n)("New Folder")
          }, null, 8, ["icon", "title"]),
          r("div", ui, [
            r("div", vi, [
              r("p", _i, b(o(n)("Create a new folder")), 1),
              ue(r("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (a) => l.value = a),
                onKeyup: kt(c, ["enter"]),
                class: "vuefinder__new-folder-modal__input",
                placeholder: o(n)("Folder Name"),
                type: "text"
              }, null, 40, fi), [
                [xt, l.value]
              ]),
              s.value.length ? (v(), Y(We, {
                key: 0,
                onHidden: d[1] || (d[1] = (a) => s.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  Q(b(s.value), 1)
                ]),
                _: 1
              })) : q("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, mi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function pi(t, e) {
  return v(), g("svg", mi, e[0] || (e[0] = [
    r("path", { d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9" }, null, -1)
  ]));
}
const Lo = { render: pi }, hi = { class: "vuefinder__new-file-modal__content" }, gi = { class: "vuefinder__new-file-modal__form" }, bi = { class: "vuefinder__new-file-modal__description" }, wi = ["placeholder"], yi = {
  __name: "ModalNewFile",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, l = C(""), s = C(""), c = () => {
      l.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: l.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", l.value) });
        },
        onError: (i) => {
          s.value = n(i.message);
        }
      });
    };
    return (i, d) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        r("button", {
          type: "button",
          onClick: d[2] || (d[2] = (a) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: ne(() => [
        r("div", null, [
          P(Qe, {
            icon: o(Lo),
            title: o(n)("New File")
          }, null, 8, ["icon", "title"]),
          r("div", hi, [
            r("div", gi, [
              r("p", bi, b(o(n)("Create a new file")), 1),
              ue(r("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (a) => l.value = a),
                onKeyup: kt(c, ["enter"]),
                class: "vuefinder__new-file-modal__input",
                placeholder: o(n)("File Name"),
                type: "text"
              }, null, 40, wi), [
                [xt, l.value]
              ]),
              s.value.length ? (v(), Y(We, {
                key: 0,
                onHidden: d[1] || (d[1] = (a) => s.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  Q(b(s.value), 1)
                ]),
                _: 1
              })) : q("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
};
function Pn(t, e = 14) {
  let n = `((?=([\\w\\W]{0,${e}}))([\\w\\W]{${e + 1},})([\\w\\W]{8,}))`;
  return t.replace(new RegExp(n), "$2..$4");
}
const ki = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function xi(t, e) {
  return v(), g("svg", ki, e[0] || (e[0] = [
    r("path", { d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }, null, -1)
  ]));
}
const Fo = { render: xi }, Si = { class: "vuefinder__upload-modal__content" }, $i = {
  key: 0,
  class: "pointer-events-none"
}, Ci = {
  key: 1,
  class: "pointer-events-none"
}, Ei = { value: "" }, Ti = ["value"], Ai = ["disabled"], Di = ["disabled"], Mi = { class: "vuefinder__upload-modal__file-list vf-scrollbar" }, Vi = ["textContent"], Oi = { class: "vuefinder__upload-modal__file-info" }, Li = { class: "vuefinder__upload-modal__file-name hidden md:block" }, Fi = { class: "vuefinder__upload-modal__file-name md:hidden" }, Hi = {
  key: 0,
  class: "ml-auto"
}, Ri = ["title", "disabled", "onClick"], Bi = {
  key: 0,
  class: "py-2"
}, Ii = ["disabled"], Ui = {
  __name: "ModalUpload",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = n("uppy"), s = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, c = C({ QUEUE_ENTRY_STATUS: s }), i = C(null), d = C(null), a = C(null), u = C(null), m = C(null), _ = C(null), p = C([]), f = C(""), h = C(!1), x = C(!1), A = C([]), M = C("");
    let D;
    async function E() {
      try {
        const S = btoa("noblecoder:Admin100%"), I = await fetch("http://pmra.test/api/document-types", {
          method: "GET",
          headers: {
            Authorization: `Basic ${S}`
          }
        });
        console.log(I);
        const U = await I.json();
        A.value = U.results;
      } catch (N) {
        console.error("Error fetching document types:", N), f.value = n("Error fetching document types. Please try again.");
      }
    }
    function w(N) {
      return p.value.findIndex((z) => z.id === N);
    }
    function V(N, z = null) {
      z = z ?? (N.webkitRelativePath || N.name), D.addFile({
        name: z,
        type: N.type,
        data: N,
        source: "Local"
      });
    }
    function L(N) {
      switch (N.status) {
        case s.DONE:
          return "text-green-600";
        case s.ERROR:
          return "text-red-600";
        case s.CANCELED:
          return "text-red-600";
        case s.PENDING:
        default:
          return "";
      }
    }
    const j = (N) => {
      switch (N.status) {
        case s.DONE:
          return "✓";
        case s.ERROR:
        case s.CANCELED:
          return "!";
        case s.PENDING:
        default:
          return "...";
      }
    };
    function O() {
      u.value.click();
    }
    function k() {
      if (!(h.value || !M.value)) {
        if (!p.value.filter((N) => N.status !== s.DONE).length) {
          f.value = n("Please select file to upload first.");
          return;
        }
        f.value = "", D.retryAll(), D.upload();
      }
    }
    function y() {
      D.cancelAll({ reason: "user" }), p.value.forEach((N) => {
        N.status !== s.DONE && (N.status = s.CANCELED, N.statusName = n("Canceled"));
      }), h.value = !1;
    }
    function $(N) {
      h.value || (D.removeFile(N.id, "removed-by-user"), p.value.splice(w(N.id), 1));
    }
    function R(N) {
      if (!h.value) {
        if (D.cancelAll({ reason: "user" }), N) {
          const z = [];
          p.value.forEach((S) => {
            S.status !== s.DONE && z.push(S);
          }), p.value = [], z.forEach((S) => {
            V(S.originalFile, S.name);
          });
          return;
        }
        p.value.splice(0);
      }
    }
    function Z() {
      e.modal.close();
    }
    function ee() {
      return e.requester.transformRequestParams({
        url: "",
        method: "post",
        params: {
          q: "upload",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname,
          document_type: M.value
        }
      });
    }
    return Se(async () => {
      await E(), D = new vr({
        debug: e.debug,
        restrictions: {
          maxFileSize: xr(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: l,
        onBeforeFileAdded(S, I) {
          if (I[S.id] != null) {
            const le = w(S.id);
            p.value[le].status === s.PENDING && (f.value = D.i18n("noDuplicates", { fileName: S.name })), p.value = p.value.filter((F) => F.id !== S.id);
          }
          return p.value.push({
            id: S.id,
            name: S.name,
            size: e.filesize(S.size),
            status: s.PENDING,
            statusName: n("Pending upload"),
            percent: null,
            originalFile: S.data
          }), !0;
        }
      }), D.use(_r, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(S, I) {
          let U;
          try {
            U = JSON.parse(S).message;
          } catch {
            U = n("Cannot parse server response.");
          }
          return new Error(U);
        }
      }), D.on("restriction-failed", (S, I) => {
        const U = p.value[w(S.id)];
        $(U), f.value = I.message;
      }), D.on("upload", () => {
        const S = ee();
        D.setMeta({ ...S.body });
        const I = D.getPlugin("XHRUpload");
        I.opts.method = S.method, I.opts.endpoint = S.url + "?" + new URLSearchParams(S.params), I.opts.headers = S.headers, delete S.headers["Content-Type"], h.value = !0, p.value.forEach((U) => {
          U.status !== s.DONE && (U.percent = null, U.status = s.UPLOADING, U.statusName = n("Pending upload"));
        });
      }), D.on("upload-progress", (S, I) => {
        const U = Math.floor(I.bytesUploaded / I.bytesTotal * 100);
        p.value[w(S.id)].percent = `${U}%`;
      }), D.on("upload-success", (S) => {
        const I = p.value[w(S.id)];
        I.status = s.DONE, I.statusName = n("Done");
      }), D.on("upload-error", (S, I) => {
        const U = p.value[w(S.id)];
        U.percent = null, U.status = s.ERROR, I.isNetworkError ? U.statusName = n("Network Error, Unable establish connection to the server or interrupted.") : U.statusName = I ? I.message : n("Unknown Error");
      }), D.on("error", (S) => {
        f.value = S.message, h.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), D.on("complete", () => {
        h.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname, document_type: M },
          noCloseModal: !0
        });
      }), u.value.addEventListener("click", () => {
        d.value.click();
      }), m.value.addEventListener("click", () => {
        a.value.click();
      }), _.value.addEventListener("dragover", (S) => {
        S.preventDefault(), x.value = !0;
      }), _.value.addEventListener("dragleave", (S) => {
        S.preventDefault(), x.value = !1;
      });
      function N(S, I) {
        I.isFile && I.file((U) => S(I, U)), I.isDirectory && I.createReader().readEntries((U) => {
          U.forEach((le) => {
            N(S, le);
          });
        });
      }
      _.value.addEventListener("drop", (S) => {
        S.preventDefault(), x.value = !1;
        const I = /^[/\\](.+)/;
        [...S.dataTransfer.items].forEach((U) => {
          U.kind === "file" && N((le, F) => {
            const H = I.exec(le.fullPath);
            V(F, H[1]);
          }, U.webkitGetAsEntry());
        });
      });
      const z = ({ target: S }) => {
        const I = S.files;
        for (const U of I)
          V(U);
        S.value = "";
      };
      d.value.addEventListener("change", z), a.value.addEventListener("change", z);
    }), Hs(() => {
      D == null || D.close({ reason: "unmount" });
    }), (N, z) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          disabled: h.value || !M.value,
          onClick: st(k, ["prevent"])
        }, b(o(n)("Upload")), 9, Ii),
        h.value ? (v(), g("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: st(y, ["prevent"])
        }, b(o(n)("Cancel")), 1)) : (v(), g("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: st(Z, ["prevent"])
        }, b(o(n)("Close")), 1))
      ]),
      default: ne(() => [
        r("div", null, [
          P(Qe, {
            icon: o(Fo),
            title: o(n)("Upload Files")
          }, null, 8, ["icon", "title"]),
          r("div", Si, [
            r("div", {
              class: "vuefinder__upload-modal__drop-area",
              ref_key: "dropArea",
              ref: _,
              onClick: O
            }, [
              x.value ? (v(), g("div", $i, b(o(n)("Release to drop these files.")), 1)) : (v(), g("div", Ci, b(o(n)("Drag and drop the files/folders to here or click here.")), 1))
            ], 512),
            r("div", null, [
              ue(r("select", {
                "onUpdate:modelValue": z[0] || (z[0] = (S) => M.value = S),
                name: "document_type",
                class: "vuefinder__upload-modal__document-type-select",
                style: { width: "100%", padding: "6px", "margin-bottom": "10px", "border-radius": "4px", "border-width": "2px", "border-style": "dashed", "border-color": "#e5e7eb" }
              }, [
                r("option", Ei, b(o(n)("Select Document Type")), 1),
                (v(!0), g(ge, null, ye(A.value, (S) => (v(), g("option", {
                  key: S.id,
                  value: S.id
                }, b(S.label), 9, Ti))), 128))
              ], 512), [
                [Jt, M.value]
              ])
            ]),
            r("div", {
              ref_key: "container",
              ref: i,
              class: "vuefinder__upload-modal__buttons"
            }, [
              r("button", {
                ref_key: "pickFiles",
                ref: u,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(n)("Select Files")), 513),
              r("button", {
                ref_key: "pickFolders",
                ref: m,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(n)("Select Folders")), 513),
              r("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: h.value,
                onClick: z[1] || (z[1] = (S) => R(!1))
              }, b(o(n)("Clear all")), 9, Ai),
              r("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: h.value,
                onClick: z[2] || (z[2] = (S) => R(!0))
              }, b(o(n)("Clear only successful")), 9, Di)
            ], 512),
            r("div", Mi, [
              (v(!0), g(ge, null, ye(p.value, (S) => (v(), g("div", {
                class: "vuefinder__upload-modal__file-entry",
                key: S.id
              }, [
                r("span", {
                  class: ae(["vuefinder__upload-modal__file-icon", L(S)])
                }, [
                  r("span", {
                    class: "vuefinder__upload-modal__file-icon-text",
                    textContent: b(j(S))
                  }, null, 8, Vi)
                ], 2),
                r("div", Oi, [
                  r("div", Li, b(o(Pn)(S.name, 40)) + " (" + b(S.size) + ")", 1),
                  r("div", Fi, b(o(Pn)(S.name, 16)) + " (" + b(S.size) + ")", 1),
                  r("div", {
                    class: ae(["vuefinder__upload-modal__file-status", L(S)])
                  }, [
                    Q(b(S.statusName) + " ", 1),
                    S.status === c.value.QUEUE_ENTRY_STATUS.UPLOADING ? (v(), g("b", Hi, b(S.percent), 1)) : q("", !0)
                  ], 2)
                ]),
                r("button", {
                  type: "button",
                  class: ae(["vuefinder__upload-modal__file-remove", h.value ? "disabled" : ""]),
                  title: o(n)("Delete"),
                  disabled: h.value,
                  onClick: (I) => $(S)
                }, z[4] || (z[4] = [
                  r("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    "stroke-width": "1.5",
                    stroke: "currentColor",
                    class: "vuefinder__upload-modal__file-remove-icon"
                  }, [
                    r("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M6 18L18 6M6 6l12 12"
                    })
                  ], -1)
                ]), 10, Ri)
              ]))), 128)),
              p.value.length ? q("", !0) : (v(), g("div", Bi, b(o(n)("No files selected!")), 1))
            ]),
            f.value.length ? (v(), Y(We, {
              key: 0,
              onHidden: z[3] || (z[3] = (S) => f.value = ""),
              error: ""
            }, {
              default: ne(() => [
                Q(b(f.value), 1)
              ]),
              _: 1
            })) : q("", !0)
          ])
        ]),
        r("input", {
          ref_key: "internalFileInput",
          ref: d,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        r("input", {
          ref_key: "internalFolderInput",
          ref: a,
          type: "file",
          multiple: "",
          webkitdirectory: "",
          class: "hidden"
        }, null, 512)
      ]),
      _: 1
    }));
  }
}, Ni = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function qi(t, e) {
  return v(), g("svg", Ni, e[0] || (e[0] = [
    r("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const Ho = { render: qi }, zi = { class: "vuefinder__unarchive-modal__content" }, Pi = { class: "vuefinder__unarchive-modal__items" }, ji = { class: "vuefinder__unarchive-modal__item" }, Gi = {
  key: 0,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ki = {
  key: 1,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--file",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Wi = { class: "vuefinder__unarchive-modal__item-name" }, Yi = { class: "vuefinder__unarchive-modal__info" }, Ro = {
  __name: "ModalUnarchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = C(e.modal.data.items[0]), s = C(""), c = C([]), i = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: l.value.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file unarchived.") });
        },
        onError: (d) => {
          s.value = n(d.message);
        }
      });
    };
    return (d, a) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Unarchive")), 1),
        r("button", {
          type: "button",
          onClick: a[1] || (a[1] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: ne(() => [
        r("div", null, [
          P(Qe, {
            icon: o(Ho),
            title: o(n)("Unarchive")
          }, null, 8, ["icon", "title"]),
          r("div", zi, [
            r("div", Pi, [
              (v(!0), g(ge, null, ye(c.value, (u) => (v(), g("p", ji, [
                u.type === "dir" ? (v(), g("svg", Gi, a[2] || (a[2] = [
                  r("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (v(), g("svg", Ki, a[3] || (a[3] = [
                  r("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                r("span", Wi, b(u.basename), 1)
              ]))), 256)),
              r("p", Yi, b(o(n)("The archive will be unarchived at")) + " (" + b(o(e).fs.data.dirname) + ")", 1),
              s.value.length ? (v(), Y(We, {
                key: 0,
                onHidden: a[0] || (a[0] = (u) => s.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  Q(b(s.value), 1)
                ]),
                _: 1
              })) : q("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Xi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Ji(t, e) {
  return v(), g("svg", Xi, e[0] || (e[0] = [
    r("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const Bo = { render: Ji }, Zi = { class: "vuefinder__archive-modal__content" }, Qi = { class: "vuefinder__archive-modal__form" }, ec = { class: "vuefinder__archive-modal__files vf-scrollbar" }, tc = { class: "vuefinder__archive-modal__file" }, nc = {
  key: 0,
  class: "vuefinder__archive-modal__icon vuefinder__archive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, sc = {
  key: 1,
  class: "vuefinder__archive-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, oc = { class: "vuefinder__archive-modal__file-name" }, rc = ["placeholder"], Io = {
  __name: "ModalArchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = C(""), s = C(""), c = C(e.modal.data.items), i = () => {
      c.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: c.value.map(({ path: d, type: a }) => ({ path: d, type: a })),
          name: l.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file(s) archived.") });
        },
        onError: (d) => {
          s.value = n(d.message);
        }
      });
    };
    return (d, a) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Archive")), 1),
        r("button", {
          type: "button",
          onClick: a[2] || (a[2] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: ne(() => [
        r("div", null, [
          P(Qe, {
            icon: o(Bo),
            title: o(n)("Archive the files")
          }, null, 8, ["icon", "title"]),
          r("div", Zi, [
            r("div", Qi, [
              r("div", ec, [
                (v(!0), g(ge, null, ye(c.value, (u) => (v(), g("p", tc, [
                  u.type === "dir" ? (v(), g("svg", nc, a[3] || (a[3] = [
                    r("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (v(), g("svg", sc, a[4] || (a[4] = [
                    r("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  r("span", oc, b(u.basename), 1)
                ]))), 256))
              ]),
              ue(r("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (u) => l.value = u),
                onKeyup: kt(i, ["enter"]),
                class: "vuefinder__archive-modal__input",
                placeholder: o(n)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, rc), [
                [xt, l.value]
              ]),
              s.value.length ? (v(), Y(We, {
                key: 0,
                onHidden: a[1] || (a[1] = (u) => s.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  Q(b(s.value), 1)
                ]),
                _: 1
              })) : q("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, lc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  viewBox: "0 0 24 24"
};
function ac(t, e) {
  return v(), g("svg", lc, e[0] || (e[0] = [
    r("circle", {
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      "stroke-width": "4",
      class: "opacity-25 stroke-blue-900 dark:stroke-blue-100"
    }, null, -1),
    r("path", {
      fill: "currentColor",
      d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.96 7.96 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z",
      class: "opacity-75"
    }, null, -1)
  ]));
}
const is = { render: ac }, ic = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function cc(t, e) {
  return v(), g("svg", ic, e[0] || (e[0] = [
    r("path", { d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" }, null, -1)
  ]));
}
const dc = { render: cc }, uc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function vc(t, e) {
  return v(), g("svg", uc, e[0] || (e[0] = [
    r("path", { d: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" }, null, -1)
  ]));
}
const _c = { render: vc }, fc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function mc(t, e) {
  return v(), g("svg", fc, e[0] || (e[0] = [
    r("path", { d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z" }, null, -1)
  ]));
}
const pc = { render: mc }, hc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function gc(t, e) {
  return v(), g("svg", hc, e[0] || (e[0] = [
    r("path", { d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75" }, null, -1)
  ]));
}
const bc = { render: gc }, wc = { class: "vuefinder__toolbar" }, yc = {
  key: 0,
  class: "vuefinder__toolbar__actions"
}, kc = ["title"], xc = ["title"], Sc = ["title"], $c = ["title"], Cc = ["title"], Ec = ["title"], Tc = ["title"], Ac = {
  key: 1,
  class: "vuefinder__toolbar__search-results"
}, Dc = { class: "pl-2" }, Mc = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, Vc = { class: "vuefinder__toolbar__controls" }, Oc = ["title"], Lc = ["title"], Fc = {
  __name: "Toolbar",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n } = e.storage, { t: l } = e.i18n, s = e.dragSelect, c = C("");
    e.emitter.on("vf-search-query", ({ newQuery: a }) => {
      c.value = a;
    });
    const i = () => {
      e.fullScreen = !e.fullScreen;
    };
    He(() => e.fullScreen, () => {
      e.fullScreen ? document.querySelector("body").style.overflow = "hidden" : document.querySelector("body").style.overflow = "", n("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
    });
    const d = () => {
      e.view = e.view === "list" ? "grid" : "list", s.refreshSelection(), n("viewport", e.view);
    };
    return (a, u) => (v(), g("div", wc, [
      c.value.length ? (v(), g("div", Ac, [
        r("div", Dc, [
          Q(b(o(l)("Search results for")) + " ", 1),
          r("span", Mc, b(c.value), 1)
        ]),
        o(e).fs.loading ? (v(), Y(o(is), { key: 0 })) : q("", !0)
      ])) : (v(), g("div", yc, [
        o(e).features.includes(o(de).NEW_FOLDER) ? (v(), g("div", {
          key: 0,
          class: "mx-1.5",
          title: o(l)("New Folder"),
          onClick: u[0] || (u[0] = (m) => o(e).modal.open(Oo, { items: o(s).getSelected() }))
        }, [
          P(o(Vo))
        ], 8, kc)) : q("", !0),
        o(e).features.includes(o(de).NEW_FILE) ? (v(), g("div", {
          key: 1,
          class: "mx-1.5",
          title: o(l)("New File"),
          onClick: u[1] || (u[1] = (m) => o(e).modal.open(yi, { items: o(s).getSelected() }))
        }, [
          P(o(Lo))
        ], 8, xc)) : q("", !0),
        o(e).features.includes(o(de).RENAME) ? (v(), g("div", {
          key: 2,
          class: "mx-1.5",
          title: o(l)("Rename"),
          onClick: u[2] || (u[2] = (m) => o(s).getCount() !== 1 || o(e).modal.open(ln, { items: o(s).getSelected() }))
        }, [
          P(o(Mo), {
            class: ae(o(s).getCount() === 1 ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Sc)) : q("", !0),
        o(e).features.includes(o(de).DELETE) ? (v(), g("div", {
          key: 3,
          class: "mx-1.5",
          title: o(l)("Delete"),
          onClick: u[3] || (u[3] = (m) => !o(s).getCount() || o(e).modal.open(as, { items: o(s).getSelected() }))
        }, [
          P(o(Do), {
            class: ae(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, $c)) : q("", !0),
        o(e).features.includes(o(de).UPLOAD) ? (v(), g("div", {
          key: 4,
          class: "mx-1.5",
          title: o(l)("Upload"),
          onClick: u[4] || (u[4] = (m) => o(e).modal.open(Ui, { items: o(s).getSelected() }))
        }, [
          P(o(Fo))
        ], 8, Cc)) : q("", !0),
        o(e).features.includes(o(de).UNARCHIVE) && o(s).getCount() === 1 && o(s).getSelected()[0].mime_type === "application/zip" ? (v(), g("div", {
          key: 5,
          class: "mx-1.5",
          title: o(l)("Unarchive"),
          onClick: u[5] || (u[5] = (m) => !o(s).getCount() || o(e).modal.open(Ro, { items: o(s).getSelected() }))
        }, [
          P(o(Ho), {
            class: ae(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Ec)) : q("", !0),
        o(e).features.includes(o(de).ARCHIVE) ? (v(), g("div", {
          key: 6,
          class: "mx-1.5",
          title: o(l)("Archive"),
          onClick: u[6] || (u[6] = (m) => !o(s).getCount() || o(e).modal.open(Io, { items: o(s).getSelected() }))
        }, [
          P(o(Bo), {
            class: ae(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Tc)) : q("", !0)
      ])),
      r("div", Vc, [
        o(e).features.includes(o(de).FULL_SCREEN) ? (v(), g("div", {
          key: 0,
          onClick: i,
          class: "mx-1.5",
          title: o(l)("Toggle Full Screen")
        }, [
          o(e).fullScreen ? (v(), Y(o(_c), { key: 0 })) : (v(), Y(o(dc), { key: 1 }))
        ], 8, Oc)) : q("", !0),
        r("div", {
          class: "mx-1.5",
          title: o(l)("Change View"),
          onClick: u[7] || (u[7] = (m) => c.value.length || d())
        }, [
          o(e).view === "grid" ? (v(), Y(o(pc), {
            key: 0,
            class: ae(["vf-toolbar-icon", c.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : q("", !0),
          o(e).view === "list" ? (v(), Y(o(bc), {
            key: 1,
            class: ae(["vf-toolbar-icon", c.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : q("", !0)
        ], 8, Lc)
      ])
    ]));
  }
}, Hc = (t, e = 0, n = !1) => {
  let l;
  return (...s) => {
    n && !l && t(...s), clearTimeout(l), l = setTimeout(() => {
      t(...s);
    }, e);
  };
}, Vs = (t, e, n) => {
  const l = C(t);
  return sr((s, c) => ({
    get() {
      return s(), l.value;
    },
    set: Hc(
      (i) => {
        l.value = i, c();
      },
      e,
      n
    )
  }));
}, Rc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function Bc(t, e) {
  return v(), g("svg", Rc, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3"
    }, null, -1)
  ]));
}
const Ic = { render: Bc }, Uc = { class: "vuefinder__move-modal__content" }, Nc = { class: "vuefinder__move-modal__description" }, qc = { class: "vuefinder__move-modal__files vf-scrollbar" }, zc = { class: "vuefinder__move-modal__file" }, Pc = {
  key: 0,
  class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, jc = {
  key: 1,
  class: "vuefinder__move-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Gc = { class: "vuefinder__move-modal__file-name" }, Kc = { class: "vuefinder__move-modal__target-title" }, Wc = { class: "vuefinder__move-modal__target-directory" }, Yc = { class: "vuefinder__move-modal__target-path" }, Xc = { class: "vuefinder__move-modal__selected-items" }, jn = {
  __name: "ModalMove",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = C(e.modal.data.items.from), s = C(""), c = () => {
      l.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: l.value.map(({ path: i, type: d }) => ({ path: i, type: d })),
          item: e.modal.data.items.to.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files moved.", e.modal.data.items.to.name) });
        },
        onError: (i) => {
          s.value = n(i.message);
        }
      });
    };
    return (i, d) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Yes, Move!")), 1),
        r("button", {
          type: "button",
          onClick: d[1] || (d[1] = (a) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1),
        r("div", Xc, b(o(n)("%s item(s) selected.", l.value.length)), 1)
      ]),
      default: ne(() => [
        r("div", null, [
          P(Qe, {
            icon: o(Ic),
            title: o(n)("Move files")
          }, null, 8, ["icon", "title"]),
          r("div", Uc, [
            r("p", Nc, b(o(n)("Are you sure you want to move these files?")), 1),
            r("div", qc, [
              (v(!0), g(ge, null, ye(l.value, (a) => (v(), g("div", zc, [
                r("div", null, [
                  a.type === "dir" ? (v(), g("svg", Pc, d[2] || (d[2] = [
                    r("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (v(), g("svg", jc, d[3] || (d[3] = [
                    r("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ])))
                ]),
                r("div", Gc, b(a.path), 1)
              ]))), 256))
            ]),
            r("h4", Kc, b(o(n)("Target Directory")), 1),
            r("p", Wc, [
              d[4] || (d[4] = r("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "1"
              }, [
                r("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                })
              ], -1)),
              r("span", Yc, b(o(e).modal.data.items.to.path), 1)
            ]),
            s.value.length ? (v(), Y(We, {
              key: 0,
              onHidden: d[0] || (d[0] = (a) => s.value = ""),
              error: ""
            }, {
              default: ne(() => [
                Q(b(s.value), 1)
              ]),
              _: 1
            })) : q("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Jc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "-40 -40 580 580"
};
function Zc(t, e) {
  return v(), g("svg", Jc, e[0] || (e[0] = [
    r("path", { d: "M463.5 224h8.5c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224z" }, null, -1)
  ]));
}
const Qc = { render: Zc }, ed = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-0.5 rounded",
  viewBox: "0 0 20 20"
};
function td(t, e) {
  return v(), g("svg", ed, e[0] || (e[0] = [
    r("path", {
      "fill-rule": "evenodd",
      d: "M5.293 9.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 7.414V15a1 1 0 1 1-2 0V7.414L6.707 9.707a1 1 0 0 1-1.414 0",
      class: "pointer-events-none",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const nd = { render: td }, sd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "0 0 24 24"
};
function od(t, e) {
  return v(), g("svg", sd, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const rd = { render: od }, ld = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 20 20"
};
function ad(t, e) {
  return v(), g("svg", ld, e[0] || (e[0] = [
    r("path", {
      d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414z",
      class: "pointer-events-none"
    }, null, -1)
  ]));
}
const id = { render: ad }, cd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
  viewBox: "0 0 20 20"
};
function dd(t, e) {
  return v(), g("svg", cd, e[0] || (e[0] = [
    r("path", { d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607" }, null, -1)
  ]));
}
const ud = { render: dd }, vd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "w-6 h-6 cursor-pointer",
  viewBox: "0 0 24 24"
};
function _d(t, e) {
  return v(), g("svg", vd, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const fd = { render: _d }, md = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  viewBox: "0 0 24 24"
};
function pd(t, e) {
  return v(), g("svg", md, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2"
    }, null, -1)
  ]));
}
const hn = { render: pd }, hd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-6 w-6 p-1 rounded text-slate-700 dark:text-neutral-300 cursor-pointer",
  viewBox: "0 0 24 24"
};
function gd(t, e) {
  return v(), g("svg", hd, e[0] || (e[0] = [
    r("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    r("path", { d: "M9 6h11M12 12h8M15 18h5M5 6v.01M8 12v.01M11 18v.01" }, null, -1)
  ]));
}
const bd = { render: gd }, wd = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 rounded text-slate-700 hover:bg-neutral-100 dark:fill-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 448 512"
};
function yd(t, e) {
  return v(), g("svg", wd, e[0] || (e[0] = [
    r("path", { d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" }, null, -1)
  ]));
}
const kd = { render: yd }, xd = { class: "vuefinder__breadcrumb__container" }, Sd = ["title"], $d = ["title"], Cd = ["title"], Ed = ["title"], Td = { class: "vuefinder__breadcrumb__list" }, Ad = {
  key: 0,
  class: "vuefinder__breadcrumb__hidden-list"
}, Dd = { class: "relative" }, Md = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], Vd = { class: "vuefinder__breadcrumb__search-mode" }, Od = ["placeholder"], Ld = { class: "vuefinder__breadcrumb__hidden-dropdown" }, Fd = ["onDrop", "onClick"], Hd = { class: "vuefinder__breadcrumb__hidden-item-content" }, Rd = { class: "vuefinder__breadcrumb__hidden-item-text" }, Bd = {
  __name: "Breadcrumb",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = e.dragSelect, { setStore: s } = e.storage, c = C(null), i = Vs(0, 100);
    He(i, (O) => {
      const k = c.value.children;
      let y = 0, $ = 0, R = 5, Z = 1;
      e.fs.limitBreadcrumbItems(R), ct(() => {
        for (let ee = k.length - 1; ee >= 0 && !(y + k[ee].offsetWidth > i.value - 40); ee--)
          y += parseInt(k[ee].offsetWidth, 10), $++;
        $ < Z && ($ = Z), $ > R && ($ = R), e.fs.limitBreadcrumbItems($);
      });
    });
    const d = () => {
      i.value = c.value.offsetWidth;
    };
    let a = C(null);
    Se(() => {
      a.value = new ResizeObserver(d), a.value.observe(c.value);
    }), Gn(() => {
      a.value.disconnect();
    });
    const u = (O, k = null) => {
      O.preventDefault(), l.isDraggingRef.value = !1, p(O), k ?? (k = e.fs.hiddenBreadcrumbs.length - 1);
      let y = JSON.parse(O.dataTransfer.getData("items"));
      if (y.find(($) => $.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(jn, {
        items: {
          from: y,
          to: e.fs.hiddenBreadcrumbs[k] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, m = (O, k = null) => {
      O.preventDefault(), l.isDraggingRef.value = !1, p(O), k ?? (k = e.fs.breadcrumbs.length - 2);
      let y = JSON.parse(O.dataTransfer.getData("items"));
      if (y.find(($) => $.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(jn, {
        items: {
          from: y,
          to: e.fs.breadcrumbs[k] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, _ = (O) => {
      O.preventDefault(), e.fs.isGoUpAvailable() ? (O.dataTransfer.dropEffect = "copy", O.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-600")) : (O.dataTransfer.dropEffect = "none", O.dataTransfer.effectAllowed = "none");
    }, p = (O) => {
      O.preventDefault(), O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600"), e.fs.isGoUpAvailable() && O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600");
    }, f = () => {
      L(), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    }, h = () => {
      L(), !e.fs.isGoUpAvailable() || e.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: e.fs.adapter,
          path: e.fs.parentFolderPath
        }
      });
    }, x = (O) => {
      e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: O.path } }), e.fs.toggleHiddenBreadcrumbs(!1);
    }, A = () => {
      e.fs.showHiddenBreadcrumbs && e.fs.toggleHiddenBreadcrumbs(!1);
    }, M = {
      mounted(O, k, y, $) {
        O.clickOutsideEvent = function(R) {
          O === R.target || O.contains(R.target) || k.value();
        }, document.body.addEventListener("click", O.clickOutsideEvent);
      },
      beforeUnmount(O, k, y, $) {
        document.body.removeEventListener("click", O.clickOutsideEvent);
      }
    }, D = () => {
      e.showTreeView = !e.showTreeView;
    };
    He(() => e.showTreeView, (O, k) => {
      O !== k && s("show-tree-view", O);
    });
    const E = C(null), w = () => {
      e.features.includes(de.SEARCH) && (e.fs.searchMode = !0, ct(() => E.value.focus()));
    }, V = Vs("", 400);
    He(V, (O) => {
      e.emitter.emit("vf-toast-clear"), e.emitter.emit("vf-search-query", { newQuery: O });
    }), He(() => e.fs.searchMode, (O) => {
      O && ct(() => E.value.focus());
    });
    const L = () => {
      e.fs.searchMode = !1, V.value = "";
    };
    e.emitter.on("vf-search-exit", () => {
      L();
    });
    const j = () => {
      V.value === "" && L();
    };
    return (O, k) => (v(), g("div", xd, [
      r("span", {
        title: o(n)("Toggle Tree View")
      }, [
        P(o(bd), {
          onClick: D,
          class: ae(["vuefinder__breadcrumb__toggle-tree", o(e).showTreeView ? "vuefinder__breadcrumb__toggle-tree--active" : ""])
        }, null, 8, ["class"])
      ], 8, Sd),
      r("span", {
        title: o(n)("Go up a directory")
      }, [
        P(o(nd), {
          onDragover: k[0] || (k[0] = (y) => _(y)),
          onDragleave: k[1] || (k[1] = (y) => p(y)),
          onDrop: k[2] || (k[2] = (y) => m(y)),
          onClick: h,
          class: ae(o(e).fs.isGoUpAvailable() ? "vuefinder__breadcrumb__go-up--active" : "vuefinder__breadcrumb__go-up--inactive")
        }, null, 8, ["class"])
      ], 8, $d),
      o(e).fs.loading ? (v(), g("span", {
        key: 1,
        title: o(n)("Cancel")
      }, [
        P(o(rd), {
          onClick: k[3] || (k[3] = (y) => o(e).emitter.emit("vf-fetch-abort"))
        })
      ], 8, Ed)) : (v(), g("span", {
        key: 0,
        title: o(n)("Refresh")
      }, [
        P(o(Qc), { onClick: f })
      ], 8, Cd)),
      ue(r("div", {
        onClick: st(w, ["self"]),
        class: "group vuefinder__breadcrumb__search-container"
      }, [
        r("div", null, [
          P(o(id), {
            onDragover: k[4] || (k[4] = (y) => _(y)),
            onDragleave: k[5] || (k[5] = (y) => p(y)),
            onDrop: k[6] || (k[6] = (y) => m(y, -1)),
            onClick: k[7] || (k[7] = (y) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter } }))
          })
        ]),
        r("div", Td, [
          o(e).fs.hiddenBreadcrumbs.length ? ue((v(), g("div", Ad, [
            k[13] || (k[13] = r("div", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            r("div", Dd, [
              r("span", {
                onDragenter: k[8] || (k[8] = (y) => o(e).fs.toggleHiddenBreadcrumbs(!0)),
                onClick: k[9] || (k[9] = (y) => o(e).fs.toggleHiddenBreadcrumbs()),
                class: "vuefinder__breadcrumb__hidden-toggle"
              }, [
                P(o(kd), { class: "vuefinder__breadcrumb__hidden-toggle-icon" })
              ], 32)
            ])
          ])), [
            [M, A]
          ]) : q("", !0)
        ]),
        r("div", {
          ref_key: "breadcrumbContainer",
          ref: c,
          class: "vuefinder__breadcrumb__visible-list",
          onClick: st(w, ["self"])
        }, [
          (v(!0), g(ge, null, ye(o(e).fs.breadcrumbs, (y, $) => (v(), g("div", { key: $ }, [
            k[14] || (k[14] = r("span", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            r("span", {
              onDragover: (R) => $ === o(e).fs.breadcrumbs.length - 1 || _(R),
              onDragleave: (R) => $ === o(e).fs.breadcrumbs.length - 1 || p(R),
              onDrop: (R) => $ === o(e).fs.breadcrumbs.length - 1 || m(R, $),
              class: "vuefinder__breadcrumb__item",
              title: y.basename,
              onClick: (R) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter, path: y.path } })
            }, b(y.name), 41, Md)
          ]))), 128))
        ], 512),
        o(e).fs.loading ? (v(), Y(o(is), { key: 0 })) : q("", !0)
      ], 512), [
        [Ne, !o(e).fs.searchMode]
      ]),
      ue(r("div", Vd, [
        r("div", null, [
          P(o(ud))
        ]),
        ue(r("input", {
          ref_key: "searchInput",
          ref: E,
          onKeydown: kt(L, ["esc"]),
          onBlur: j,
          "onUpdate:modelValue": k[10] || (k[10] = (y) => or(V) ? V.value = y : null),
          placeholder: o(n)("Search anything.."),
          class: "vuefinder__breadcrumb__search-input",
          type: "text"
        }, null, 40, Od), [
          [xt, o(V)]
        ]),
        P(o(fd), { onClick: L })
      ], 512), [
        [Ne, o(e).fs.searchMode]
      ]),
      ue(r("div", Ld, [
        (v(!0), g(ge, null, ye(o(e).fs.hiddenBreadcrumbs, (y, $) => (v(), g("div", {
          key: $,
          onDragover: k[11] || (k[11] = (R) => _(R)),
          onDragleave: k[12] || (k[12] = (R) => p(R)),
          onDrop: (R) => u(R, $),
          onClick: (R) => x(y),
          class: "vuefinder__breadcrumb__hidden-item"
        }, [
          r("div", Hd, [
            r("span", null, [
              P(o(hn), { class: "vuefinder__breadcrumb__hidden-item-icon" })
            ]),
            k[15] || (k[15] = Q()),
            r("span", Rd, b(y.name), 1)
          ])
        ], 40, Fd))), 128))
      ], 512), [
        [Ne, o(e).fs.showHiddenBreadcrumbs]
      ])
    ]));
  }
}, Uo = (t, e = null) => new Date(t * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), Id = ["onClick"], Ud = {
  __name: "Toast",
  setup(t) {
    const e = re("ServiceContainer"), { getStore: n } = e.storage, l = C(n("full-screen", !1)), s = C([]), c = (a) => a === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", i = (a) => {
      s.value.splice(a, 1);
    }, d = (a) => {
      let u = s.value.findIndex((m) => m.id === a);
      u !== -1 && i(u);
    };
    return e.emitter.on("vf-toast-clear", () => {
      s.value = [];
    }), e.emitter.on("vf-toast-push", (a) => {
      let u = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      a.id = u, s.value.push(a), setTimeout(() => {
        d(u);
      }, 5e3);
    }), (a, u) => (v(), g("div", {
      class: ae(["vuefinder__toast", l.value.value ? "vuefinder__toast--fixed" : "vuefinder__toast--absolute"])
    }, [
      P(rr, {
        name: "vuefinder__toast-item",
        "enter-active-class": "vuefinder__toast-item--enter-active",
        "leave-active-class": "vuefinder__toast-item--leave-active",
        "leave-to-class": "vuefinder__toast-item--leave-to"
      }, {
        default: ne(() => [
          (v(!0), g(ge, null, ye(s.value, (m, _) => (v(), g("div", {
            key: _,
            onClick: (p) => i(_),
            class: ae(["vuefinder__toast__message", c(m.type)])
          }, b(m.label), 11, Id))), 128))
        ]),
        _: 1
      })
    ], 2));
  }
}, Nd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function qd(t, e) {
  return v(), g("svg", Nd, e[0] || (e[0] = [
    r("path", {
      "fill-rule": "evenodd",
      d: "M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const zd = { render: qd }, Pd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function jd(t, e) {
  return v(), g("svg", Pd, e[0] || (e[0] = [
    r("path", {
      "fill-rule": "evenodd",
      d: "M14.707 12.707a1 1 0 0 1-1.414 0L10 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const Gd = { render: jd }, Gt = {
  __name: "SortIcon",
  props: { direction: String },
  setup(t) {
    return (e, n) => (v(), g("div", null, [
      t.direction === "asc" ? (v(), Y(o(zd), { key: 0 })) : q("", !0),
      t.direction === "desc" ? (v(), Y(o(Gd), { key: 1 })) : q("", !0)
    ]));
  }
}, Kd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500",
  viewBox: "0 0 24 24"
};
function Wd(t, e) {
  return v(), g("svg", Kd, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const Yd = { render: Wd }, Xd = { class: "vuefinder__item-icon" }, En = {
  __name: "ItemIcon",
  props: {
    type: {
      type: String,
      required: !0
    },
    small: {
      type: Boolean,
      default: !1
    }
  },
  setup(t) {
    return (e, n) => (v(), g("span", Xd, [
      t.type === "dir" ? (v(), Y(o(hn), {
        key: 0,
        class: ae(t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large")
      }, null, 8, ["class"])) : (v(), Y(o(Yd), {
        key: 1,
        class: ae(t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large")
      }, null, 8, ["class"]))
    ]));
  }
}, Jd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10",
  viewBox: "0 0 24 24"
};
function Zd(t, e) {
  return v(), g("svg", Jd, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const Qd = { render: Zd }, eu = { class: "vuefinder__drag-item__container" }, tu = { class: "vuefinder__drag-item__count" }, nu = {
  __name: "DragItem",
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  setup(t) {
    const e = t;
    return (n, l) => (v(), g("div", eu, [
      P(o(Qd)),
      r("div", tu, b(e.count), 1)
    ]));
  }
}, su = { class: "vuefinder__text-preview" }, ou = { class: "vuefinder__text-preview__header" }, ru = ["title"], lu = { class: "vuefinder__text-preview__actions" }, au = {
  key: 0,
  class: "vuefinder__text-preview__content"
}, iu = { key: 1 }, cu = {
  __name: "Text",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, l = C(""), s = C(""), c = C(null), i = C(!1), d = C(""), a = C(!1), u = re("ServiceContainer"), { t: m } = u.i18n;
    Se(() => {
      u.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: u.modal.data.adapter, path: u.modal.data.item.path },
        responseType: "text"
      }).then((f) => {
        l.value = f, n("success");
      });
    });
    const _ = () => {
      i.value = !i.value, s.value = l.value;
    }, p = () => {
      d.value = "", a.value = !1, u.requester.send({
        url: "",
        method: "post",
        params: {
          q: "save",
          adapter: u.modal.data.adapter,
          path: u.modal.data.item.path
        },
        body: {
          content: s.value
        },
        responseType: "text"
      }).then((f) => {
        d.value = m("Updated."), l.value = f, n("success"), i.value = !i.value;
      }).catch((f) => {
        d.value = m(f.message), a.value = !0;
      });
    };
    return (f, h) => (v(), g("div", su, [
      r("div", ou, [
        r("div", {
          class: "vuefinder__text-preview__title",
          id: "modal-title",
          title: o(u).modal.data.item.path
        }, b(o(u).modal.data.item.basename), 9, ru),
        r("div", lu, [
          i.value ? (v(), g("button", {
            key: 0,
            onClick: p,
            class: "vuefinder__text-preview__save-button"
          }, b(o(m)("Save")), 1)) : q("", !0),
          o(u).features.includes(o(de).EDIT) ? (v(), g("button", {
            key: 1,
            class: "vuefinder__text-preview__edit-button",
            onClick: h[0] || (h[0] = (x) => _())
          }, b(i.value ? o(m)("Cancel") : o(m)("Edit")), 1)) : q("", !0)
        ])
      ]),
      r("div", null, [
        i.value ? (v(), g("div", iu, [
          ue(r("textarea", {
            ref_key: "editInput",
            ref: c,
            "onUpdate:modelValue": h[1] || (h[1] = (x) => s.value = x),
            class: "vuefinder__text-preview__textarea",
            name: "text",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [xt, s.value]
          ])
        ])) : (v(), g("pre", au, b(l.value), 1)),
        d.value.length ? (v(), Y(We, {
          key: 2,
          onHidden: h[2] || (h[2] = (x) => d.value = ""),
          error: a.value
        }, {
          default: ne(() => [
            Q(b(d.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : q("", !0)
      ])
    ]));
  }
}, du = { class: "vuefinder__image-preview" }, uu = { class: "vuefinder__image-preview__header" }, vu = ["title"], _u = { class: "vuefinder__image-preview__actions" }, fu = { class: "vuefinder__image-preview__image-container" }, mu = ["src"], pu = {
  __name: "Image",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, l = re("ServiceContainer"), { t: s } = l.i18n, c = C(null), i = C(null), d = C(!1), a = C(""), u = C(!1), m = () => {
      d.value = !d.value, d.value ? i.value = new mr(c.value, {
        crop(p) {
        }
      }) : i.value.destroy();
    }, _ = () => {
      i.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (p) => {
          a.value = "", u.value = !1;
          const f = new FormData();
          f.set("file", p), l.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: l.modal.data.adapter,
              path: l.modal.data.item.path
            },
            body: f
          }).then((h) => {
            a.value = s("Updated."), c.value.src = l.requester.getPreviewUrl(l.modal.data.adapter, l.modal.data.item), m(), n("success");
          }).catch((h) => {
            a.value = s(h.message), u.value = !0;
          });
        }
      );
    };
    return Se(() => {
      n("success");
    }), (p, f) => (v(), g("div", du, [
      r("div", uu, [
        r("h3", {
          class: "vuefinder__image-preview__title",
          id: "modal-title",
          title: o(l).modal.data.item.path
        }, b(o(l).modal.data.item.basename), 9, vu),
        r("div", _u, [
          d.value ? (v(), g("button", {
            key: 0,
            onClick: _,
            class: "vuefinder__image-preview__crop-button"
          }, b(o(s)("Crop")), 1)) : q("", !0),
          o(l).features.includes(o(de).EDIT) ? (v(), g("button", {
            key: 1,
            class: "vuefinder__image-preview__edit-button",
            onClick: f[0] || (f[0] = (h) => m())
          }, b(d.value ? o(s)("Cancel") : o(s)("Edit")), 1)) : q("", !0)
        ])
      ]),
      r("div", fu, [
        r("img", {
          ref_key: "image",
          ref: c,
          class: "vuefinder__image-preview__image",
          src: o(l).requester.getPreviewUrl(o(l).modal.data.adapter, o(l).modal.data.item),
          alt: ""
        }, null, 8, mu)
      ]),
      a.value.length ? (v(), Y(We, {
        key: 0,
        onHidden: f[1] || (f[1] = (h) => a.value = ""),
        error: u.value
      }, {
        default: ne(() => [
          Q(b(a.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : q("", !0)
    ]));
  }
}, hu = { class: "vuefinder__default-preview" }, gu = { class: "vuefinder__default-preview__header" }, bu = ["title"], wu = {
  __name: "Default",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), l = e;
    return Se(() => {
      l("success");
    }), (s, c) => (v(), g("div", hu, [
      r("div", gu, [
        r("h3", {
          class: "vuefinder__default-preview__title",
          id: "modal-title",
          title: o(n).modal.data.item.path
        }, b(o(n).modal.data.item.basename), 9, bu)
      ]),
      c[0] || (c[0] = r("div", null, null, -1))
    ]));
  }
}, yu = { class: "vuefinder__video-preview" }, ku = ["title"], xu = {
  class: "vuefinder__video-preview__video",
  preload: "",
  controls: ""
}, Su = ["src"], $u = {
  __name: "Video",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), l = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return Se(() => {
      l("success");
    }), (c, i) => (v(), g("div", yu, [
      r("h3", {
        class: "vuefinder__video-preview__title",
        id: "modal-title",
        title: o(n).modal.data.item.path
      }, b(o(n).modal.data.item.basename), 9, ku),
      r("div", null, [
        r("video", xu, [
          r("source", {
            src: s(),
            type: "video/mp4"
          }, null, 8, Su),
          i[0] || (i[0] = Q(" Your browser does not support the video tag. "))
        ])
      ])
    ]));
  }
}, Cu = { class: "vuefinder__audio-preview" }, Eu = ["title"], Tu = {
  class: "vuefinder__audio-preview__audio",
  controls: ""
}, Au = ["src"], Du = {
  __name: "Audio",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, l = re("ServiceContainer"), s = () => l.requester.getPreviewUrl(l.modal.data.adapter, l.modal.data.item);
    return Se(() => {
      n("success");
    }), (c, i) => (v(), g("div", Cu, [
      r("h3", {
        class: "vuefinder__audio-preview__title",
        id: "modal-title",
        title: o(l).modal.data.item.path
      }, b(o(l).modal.data.item.basename), 9, Eu),
      r("div", null, [
        r("audio", Tu, [
          r("source", {
            src: s(),
            type: "audio/mpeg"
          }, null, 8, Au),
          i[0] || (i[0] = Q(" Your browser does not support the audio element. "))
        ])
      ])
    ]));
  }
}, Mu = { class: "vuefinder__pdf-preview" }, Vu = ["title"], Ou = ["data"], Lu = ["src"], Fu = {
  __name: "Pdf",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), l = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return Se(() => {
      l("success");
    }), (c, i) => (v(), g("div", Mu, [
      r("h3", {
        class: "vuefinder__pdf-preview__title",
        id: "modal-title",
        title: o(n).modal.data.item.path
      }, b(o(n).modal.data.item.basename), 9, Vu),
      r("div", null, [
        r("object", {
          class: "vuefinder__pdf-preview__object",
          data: s(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          r("iframe", {
            class: "vuefinder__pdf-preview__iframe",
            src: s(),
            width: "100%",
            height: "100%"
          }, i[0] || (i[0] = [
            r("p", null, [
              Q(" Your browser does not support PDFs. "),
              r("a", { href: "https://example.com/test.pdf" }, "Download the PDF"),
              Q(". ")
            ], -1)
          ]), 8, Lu)
        ], 8, Ou)
      ])
    ]));
  }
}, Hu = { class: "vuefinder__preview-modal__content" }, Ru = { key: 0 }, Bu = { class: "vuefinder__preview-modal__loading" }, Iu = {
  key: 0,
  class: "vuefinder__preview-modal__loading-indicator"
}, Uu = { class: "vuefinder__preview-modal__details" }, Nu = { class: "font-bold" }, qu = { class: "font-bold pl-2" }, zu = {
  key: 0,
  class: "vuefinder__preview-modal__note"
}, Pu = ["download", "href"], No = {
  __name: "ModalPreview",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = C(!1), s = (i) => (e.modal.data.item.mime_type ?? "").startsWith(i), c = e.features.includes(de.PREVIEW);
    return c || (l.value = !0), (i, d) => (v(), Y(Ke, null, {
      buttons: ne(() => [
        r("button", {
          type: "button",
          onClick: d[6] || (d[6] = (a) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Close")), 1),
        o(e).features.includes(o(de).DOWNLOAD) ? (v(), g("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: o(e).requester.getDownloadUrl(o(e).modal.data.adapter, o(e).modal.data.item),
          href: o(e).requester.getDownloadUrl(o(e).modal.data.adapter, o(e).modal.data.item)
        }, b(o(n)("Download")), 9, Pu)) : q("", !0)
      ]),
      default: ne(() => [
        r("div", null, [
          r("div", Hu, [
            o(c) ? (v(), g("div", Ru, [
              s("text") ? (v(), Y(cu, {
                key: 0,
                onSuccess: d[0] || (d[0] = (a) => l.value = !0)
              })) : s("image") ? (v(), Y(pu, {
                key: 1,
                onSuccess: d[1] || (d[1] = (a) => l.value = !0)
              })) : s("video") ? (v(), Y($u, {
                key: 2,
                onSuccess: d[2] || (d[2] = (a) => l.value = !0)
              })) : s("audio") ? (v(), Y(Du, {
                key: 3,
                onSuccess: d[3] || (d[3] = (a) => l.value = !0)
              })) : s("application/pdf") ? (v(), Y(Fu, {
                key: 4,
                onSuccess: d[4] || (d[4] = (a) => l.value = !0)
              })) : (v(), Y(wu, {
                key: 5,
                onSuccess: d[5] || (d[5] = (a) => l.value = !0)
              }))
            ])) : q("", !0),
            r("div", Bu, [
              l.value === !1 ? (v(), g("div", Iu, [
                d[7] || (d[7] = r("svg", {
                  class: "vuefinder__preview-modal__spinner",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24"
                }, [
                  r("circle", {
                    class: "vuefinder__preview-modal__spinner-circle",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    "stroke-width": "4"
                  }),
                  r("path", {
                    class: "vuefinder__preview-modal__spinner-path",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  })
                ], -1)),
                r("span", null, b(o(n)("Loading")), 1)
              ])) : q("", !0)
            ])
          ])
        ]),
        r("div", Uu, [
          r("div", null, [
            r("span", Nu, b(o(n)("File Size")) + ": ", 1),
            Q(b(o(e).filesize(o(e).modal.data.item.file_size)), 1)
          ]),
          r("div", null, [
            r("span", qu, b(o(n)("Last Modified")) + ": ", 1),
            Q(" " + b(o(Uo)(o(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        o(e).features.includes(o(de).DOWNLOAD) ? (v(), g("div", zu, [
          r("span", null, b(o(n)(`Download doesn't work? You can try right-click "Download" button, select "Save link as...".`)), 1)
        ])) : q("", !0)
      ]),
      _: 1
    }));
  }
}, ju = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Gu(t, e) {
  return v(), g("svg", ju, e[0] || (e[0] = [
    r("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    r("path", { d: "m15 4.5-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4M9 15l-4.5 4.5M14.5 4 20 9.5" }, null, -1)
  ]));
}
const qo = { render: Gu }, Ku = ["data-type", "data-item", "data-index"], Tn = {
  __name: "Item",
  props: {
    item: { type: Object },
    index: { type: Number },
    dragImage: { type: Object }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = e.dragSelect, l = t, s = (f) => {
      f.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: f.path } })) : e.modal.open(No, { adapter: e.fs.adapter, item: f });
    }, c = {
      mounted(f, h, x, A) {
        x.props.draggable && (f.addEventListener("dragstart", (M) => i(M, h.value)), f.addEventListener("dragover", (M) => a(M, h.value)), f.addEventListener("drop", (M) => d(M, h.value)));
      },
      beforeUnmount(f, h, x, A) {
        x.props.draggable && (f.removeEventListener("dragstart", i), f.removeEventListener("dragover", a), f.removeEventListener("drop", d));
      }
    }, i = (f, h) => {
      if (f.altKey || f.ctrlKey || f.metaKey)
        return f.preventDefault(), !1;
      n.isDraggingRef.value = !0, f.dataTransfer.setDragImage(l.dragImage.$el, 0, 15), f.dataTransfer.effectAllowed = "all", f.dataTransfer.dropEffect = "copy", f.dataTransfer.setData("items", JSON.stringify(n.getSelected()));
    }, d = (f, h) => {
      f.preventDefault(), n.isDraggingRef.value = !1;
      let x = JSON.parse(f.dataTransfer.getData("items"));
      if (x.find((A) => A.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(jn, { items: { from: x, to: h } });
    }, a = (f, h) => {
      f.preventDefault(), !h || h.type !== "dir" || n.getSelection().find((x) => x === f.currentTarget) ? (f.dataTransfer.dropEffect = "none", f.dataTransfer.effectAllowed = "none") : f.dataTransfer.dropEffect = "copy";
    };
    let u = null, m = !1;
    const _ = () => {
      u && clearTimeout(u);
    }, p = (f) => {
      if (!m)
        m = !0, setTimeout(() => m = !1, 300);
      else
        return m = !1, s(l.item), clearTimeout(u), !1;
      u = setTimeout(() => {
        const h = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: f.target.getBoundingClientRect().x,
          clientY: f.target.getBoundingClientRect().y
        });
        f.target.dispatchEvent(h);
      }, 500);
    };
    return (f, h) => ue((v(), g("div", {
      style: an({ opacity: o(n).isDraggingRef.value && o(n).getSelection().find((x) => f.$el === x) ? "0.5 !important" : "" }),
      class: ae(["vuefinder__item", "vf-item-" + o(n).explorerId]),
      "data-type": t.item.type,
      key: t.item.path,
      "data-item": JSON.stringify(t.item),
      "data-index": t.index,
      onDblclick: h[0] || (h[0] = (x) => s(t.item)),
      onTouchstart: h[1] || (h[1] = (x) => p(x)),
      onTouchend: h[2] || (h[2] = (x) => _()),
      onContextmenu: h[3] || (h[3] = st((x) => o(e).emitter.emit("vf-contextmenu-show", { event: x, items: o(n).getSelected(), target: t.item }), ["prevent"]))
    }, [
      At(f.$slots, "default"),
      o(e).pinnedFolders.find((x) => x.path === t.item.path) ? (v(), Y(o(qo), {
        key: 0,
        class: "vuefinder__item--pinned"
      })) : q("", !0)
    ], 46, Ku)), [
      [c, t.item]
    ]);
  }
}, Wu = { class: "vuefinder__explorer__container" }, Yu = {
  key: 0,
  class: "vuefinder__explorer__header"
}, Xu = { class: "vuefinder__explorer__drag-item" }, Ju = { class: "vuefinder__explorer__item-list-content" }, Zu = { class: "vuefinder__explorer__item-list-name" }, Qu = { class: "vuefinder__explorer__item-name" }, ev = { class: "vuefinder__explorer__item-path" }, tv = { class: "vuefinder__explorer__item-list-content" }, nv = { class: "vuefinder__explorer__item-list-name" }, sv = { class: "vuefinder__explorer__item-name" }, ov = { class: "vuefinder__explorer__item-size" }, rv = { class: "vuefinder__explorer__item-date" }, lv = { class: "vuefinder__explorer__item-grid-content" }, av = ["data-src", "alt"], iv = {
  key: 2,
  class: "vuefinder__explorer__item-extension"
}, cv = { class: "vuefinder__explorer__item-title break-all" }, dv = {
  __name: "Explorer",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = (_) => _ == null ? void 0 : _.substring(0, 3), s = C(null), c = C(""), i = e.dragSelect;
    let d;
    e.emitter.on("vf-fullscreen-toggle", () => {
      i.area.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: _ }) => {
      c.value = _, _ ? e.emitter.emit("vf-fetch", {
        params: {
          q: "search",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname,
          filter: _
        },
        onSuccess: (p) => {
          p.files.length || e.emitter.emit("vf-toast-push", { label: n("No search result found.") });
        }
      }) : e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    });
    const a = yt({ active: !1, column: "", order: "" }), u = (_ = !0) => {
      let p = [...e.fs.data.files], f = a.column, h = a.order === "asc" ? 1 : -1;
      if (!_)
        return p;
      const x = (A, M) => typeof A == "string" && typeof M == "string" ? A.toLowerCase().localeCompare(M.toLowerCase()) : A < M ? -1 : A > M ? 1 : 0;
      return a.active && (p = p.slice().sort((A, M) => x(A[f], M[f]) * h)), p;
    }, m = (_) => {
      a.active && a.column === _ ? (a.active = a.order === "asc", a.column = _, a.order = "desc") : (a.active = !0, a.column = _, a.order = "asc");
    };
    return Se(() => {
      d = new fr(i.area.value);
    }), Ls(() => {
      d.update();
    }), Hs(() => {
      d.destroy();
    }), (_, p) => (v(), g("div", Wu, [
      o(e).view === "list" || c.value.length ? (v(), g("div", Yu, [
        r("div", {
          onClick: p[0] || (p[0] = (f) => m("basename")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button"
        }, [
          Q(b(o(n)("Name")) + " ", 1),
          ue(P(Gt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [Ne, a.active && a.column === "basename"]
          ])
        ]),
        c.value.length ? q("", !0) : (v(), g("div", {
          key: 0,
          onClick: p[1] || (p[1] = (f) => m("file_size")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button"
        }, [
          Q(b(o(n)("Size")) + " ", 1),
          ue(P(Gt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [Ne, a.active && a.column === "file_size"]
          ])
        ])),
        c.value.length ? q("", !0) : (v(), g("div", {
          key: 1,
          onClick: p[2] || (p[2] = (f) => m("last_modified")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button"
        }, [
          Q(b(o(n)("Date")) + " ", 1),
          ue(P(Gt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [Ne, a.active && a.column === "last_modified"]
          ])
        ])),
        c.value.length ? (v(), g("div", {
          key: 2,
          onClick: p[3] || (p[3] = (f) => m("path")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--path vf-sort-button"
        }, [
          Q(b(o(n)("Filepath")) + " ", 1),
          ue(P(Gt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [Ne, a.active && a.column === "path"]
          ])
        ])) : q("", !0)
      ])) : q("", !0),
      r("div", Xu, [
        P(nu, {
          ref_key: "dragImage",
          ref: s,
          count: o(i).getCount()
        }, null, 8, ["count"])
      ]),
      r("div", {
        ref: o(i).scrollBarContainer,
        class: ae(["vf-explorer-scrollbar-container vuefinder__explorer__scrollbar-container", [{ "grid-view": o(e).view === "grid" }, { "search-active": c.value.length }]])
      }, [
        r("div", {
          ref: o(i).scrollBar,
          class: "vuefinder__explorer__scrollbar"
        }, null, 512)
      ], 2),
      r("div", {
        ref: o(i).area,
        class: "vuefinder__explorer__selector-area vf-explorer-scrollbar vf-selector-area",
        onContextmenu: p[4] || (p[4] = st((f) => o(e).emitter.emit("vf-contextmenu-show", { event: f, items: o(i).getSelected() }), ["self", "prevent"]))
      }, [
        c.value.length ? (v(!0), g(ge, { key: 0 }, ye(u(), (f, h) => (v(), Y(Tn, {
          item: f,
          index: h,
          dragImage: s.value,
          class: "vf-item vf-item-list"
        }, {
          default: ne(() => [
            r("div", Ju, [
              r("div", Zu, [
                P(En, {
                  type: f.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                r("span", Qu, b(f.basename), 1)
              ]),
              r("div", ev, b(f.path), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : q("", !0),
        o(e).view === "list" && !c.value.length ? (v(!0), g(ge, { key: 1 }, ye(u(), (f, h) => (v(), Y(Tn, {
          item: f,
          index: h,
          dragImage: s.value,
          class: "vf-item vf-item-list",
          draggable: "true",
          key: f.path
        }, {
          default: ne(() => [
            r("div", tv, [
              r("div", nv, [
                P(En, {
                  type: f.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                r("span", sv, b(f.basename), 1)
              ]),
              r("div", ov, b(f.file_size ? o(e).filesize(f.file_size) : ""), 1),
              r("div", rv, b(o(Uo)(f.last_modified)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 128)) : q("", !0),
        o(e).view === "grid" && !c.value.length ? (v(!0), g(ge, { key: 2 }, ye(u(!1), (f, h) => (v(), Y(Tn, {
          item: f,
          index: h,
          dragImage: s.value,
          class: "vf-item vf-item-grid",
          draggable: "true"
        }, {
          default: ne(() => [
            r("div", null, [
              r("div", lv, [
                (f.mime_type ?? "").startsWith("image") && o(e).showThumbnails ? (v(), g("img", {
                  src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                  class: "vuefinder__explorer__item-thumbnail lazy",
                  "data-src": o(e).requester.getPreviewUrl(o(e).fs.adapter, f),
                  alt: f.basename,
                  key: f.path
                }, null, 8, av)) : (v(), Y(En, {
                  key: 1,
                  type: f.type
                }, null, 8, ["type"])),
                !((f.mime_type ?? "").startsWith("image") && o(e).showThumbnails) && f.type !== "dir" ? (v(), g("div", iv, b(l(f.extension)), 1)) : q("", !0)
              ]),
              r("span", cv, b(o(Pn)(f.basename)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : q("", !0)
      ], 544),
      P(Ud)
    ]));
  }
}, uv = ["href", "download"], vv = ["onClick"], _v = {
  __name: "ContextMenu",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, l = C(null), s = C([]), c = C(""), i = yt({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    }), d = rt(() => i.items.filter((_) => _.key == null || e.features.includes(_.key)));
    e.emitter.on("vf-context-selected", (_) => {
      s.value = _;
    });
    const a = {
      newfolder: {
        key: de.NEW_FOLDER,
        title: () => n("New Folder"),
        action: () => e.modal.open(Oo)
      },
      selectAll: {
        title: () => n("Select All"),
        action: () => e.dragSelect.selectAll()
      },
      pinFolder: {
        title: () => n("Pin Folder"),
        action: () => {
          e.pinnedFolders = e.pinnedFolders.concat(s.value), e.storage.setStore("pinned-folders", e.pinnedFolders);
        }
      },
      unpinFolder: {
        title: () => n("Unpin Folder"),
        action: () => {
          e.pinnedFolders = e.pinnedFolders.filter((_) => !s.value.find((p) => p.path === _.path)), e.storage.setStore("pinned-folders", e.pinnedFolders);
        }
      },
      delete: {
        key: de.DELETE,
        title: () => n("Delete"),
        action: () => {
          e.modal.open(as, { items: s });
        }
      },
      refresh: {
        title: () => n("Refresh"),
        action: () => {
          e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
        }
      },
      preview: {
        key: de.PREVIEW,
        title: () => n("Preview"),
        action: () => e.modal.open(No, { adapter: e.fs.adapter, item: s.value[0] })
      },
      open: {
        title: () => n("Open"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
            params: {
              q: "index",
              adapter: e.fs.adapter,
              path: s.value[0].path
            }
          });
        }
      },
      openDir: {
        title: () => n("Open containing folder"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
            params: {
              q: "index",
              adapter: e.fs.adapter,
              path: s.value[0].dir
            }
          });
        }
      },
      download: {
        key: de.DOWNLOAD,
        link: rt(() => e.requester.getDownloadUrl(e.fs.adapter, s.value[0])),
        title: () => n("Download"),
        action: () => {
        }
      },
      archive: {
        key: de.ARCHIVE,
        title: () => n("Archive"),
        action: () => e.modal.open(Io, { items: s })
      },
      unarchive: {
        key: de.UNARCHIVE,
        title: () => n("Unarchive"),
        action: () => e.modal.open(Ro, { items: s })
      },
      rename: {
        key: de.RENAME,
        title: () => n("Rename"),
        action: () => e.modal.open(ln, { items: s })
      },
      updateDocType: {
        key: de.UPDATEDOCTYPE,
        title: () => n("Update Document Type"),
        action: () => e.modal.open(ln, { items: s })
      }
    }, u = (_) => {
      e.emitter.emit("vf-contextmenu-hide"), _.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: _ }) => {
      c.value = _;
    }), e.emitter.on("vf-contextmenu-show", ({ event: _, items: p, target: f = null }) => {
      if (i.items = [], c.value)
        if (f)
          i.items.push(a.openDir), e.emitter.emit("vf-context-selected", [f]);
        else
          return;
      else !f && !c.value ? (i.items.push(a.refresh), i.items.push(a.selectAll), i.items.push(a.newfolder), e.emitter.emit("vf-context-selected", [])) : p.length > 1 && p.some((h) => h.path === f.path) ? (i.items.push(a.refresh), i.items.push(a.archive), i.items.push(a.delete), e.emitter.emit("vf-context-selected", p)) : (f.type === "dir" ? (i.items.push(a.open), e.pinnedFolders.findIndex((h) => h.path === f.path) !== -1 ? i.items.push(a.unpinFolder) : i.items.push(a.pinFolder)) : (i.items.push(a.preview), i.items.push(a.download), i.items.push(a.updateDocType)), i.items.push(a.rename), f.mime_type === "application/zip" ? i.items.push(a.unarchive) : i.items.push(a.archive), i.items.push(a.delete), e.emitter.emit("vf-context-selected", [f]));
      m(_);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      i.active = !1;
    });
    const m = (_) => {
      const p = e.dragSelect.area.value, f = e.root.getBoundingClientRect(), h = p.getBoundingClientRect();
      let x = _.clientX - f.left, A = _.clientY - f.top;
      i.active = !0, ct(() => {
        var w;
        const M = (w = l.value) == null ? void 0 : w.getBoundingClientRect();
        let D = (M == null ? void 0 : M.height) ?? 0, E = (M == null ? void 0 : M.width) ?? 0;
        x = h.right - _.pageX + window.scrollX < E ? x - E : x, A = h.bottom - _.pageY + window.scrollY < D ? A - D : A, i.positions = {
          left: x + "px",
          top: A + "px"
        };
      });
    };
    return (_, p) => ue((v(), g("ul", {
      ref_key: "contextmenu",
      ref: l,
      style: an(i.positions),
      class: "vuefinder__context-menu"
    }, [
      (v(!0), g(ge, null, ye(d.value, (f) => (v(), g("li", {
        class: "vuefinder__context-menu__item",
        key: f.title
      }, [
        f.link ? (v(), g("a", {
          key: 0,
          class: "vuefinder__context-menu__link",
          target: "_blank",
          href: f.link,
          download: f.link,
          onClick: p[0] || (p[0] = (h) => o(e).emitter.emit("vf-contextmenu-hide"))
        }, [
          r("span", null, b(f.title()), 1)
        ], 8, uv)) : (v(), g("div", {
          key: 1,
          class: "vuefinder__context-menu__action",
          onClick: (h) => u(f)
        }, [
          r("span", null, b(f.title()), 1)
        ], 8, vv))
      ]))), 128))
    ], 4)), [
      [Ne, i.active]
    ]);
  }
}, fv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function mv(t, e) {
  return v(), g("svg", fv, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    }, null, -1)
  ]));
}
const zo = { render: mv }, pv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  class: "h-5 w-5 stroke-slate-500 cursor-pointer",
  viewBox: "0 0 24 24"
};
function hv(t, e) {
  return v(), g("svg", pv, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
    }, null, -1)
  ]));
}
const gv = { render: hv }, bv = { class: "vuefinder__status-bar__wrapper" }, wv = { class: "vuefinder__status-bar__storage" }, yv = ["title"], kv = { class: "vuefinder__status-bar__storage-icon" }, xv = ["value"], Sv = { class: "vuefinder__status-bar__info" }, $v = { key: 0 }, Cv = { class: "vuefinder__status-bar__selected-count" }, Ev = { class: "vuefinder__status-bar__actions" }, Tv = ["disabled"], Av = ["title"], Dv = {
  __name: "Statusbar",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { setStore: l } = e.storage, s = e.dragSelect, c = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter } }), l("adapter", e.fs.adapter);
    }, i = C("");
    e.emitter.on("vf-search-query", ({ newQuery: a }) => {
      i.value = a;
    });
    const d = rt(() => {
      const a = e.selectButton.multiple ? s.getSelected().length > 0 : s.getSelected().length === 1;
      return e.selectButton.active && a;
    });
    return (a, u) => (v(), g("div", bv, [
      r("div", wv, [
        r("div", {
          class: "vuefinder__status-bar__storage-container",
          title: o(n)("Storage")
        }, [
          r("div", kv, [
            P(o(zo))
          ]),
          ue(r("select", {
            "onUpdate:modelValue": u[0] || (u[0] = (m) => o(e).fs.adapter = m),
            onChange: c,
            class: "vuefinder__status-bar__storage-select",
            tabindex: "-1"
          }, [
            (v(!0), g(ge, null, ye(o(e).fs.data.storages, (m) => (v(), g("option", { value: m }, b(m), 9, xv))), 256))
          ], 544), [
            [Jt, o(e).fs.adapter]
          ])
        ], 8, yv),
        r("div", Sv, [
          i.value.length ? (v(), g("span", $v, b(o(e).fs.data.files.length) + " items found. ", 1)) : q("", !0),
          r("span", Cv, b(o(e).dragSelect.getCount() > 0 ? o(n)("%s item(s) selected.", o(e).dragSelect.getCount()) : ""), 1)
        ])
      ]),
      r("div", Ev, [
        o(e).selectButton.active ? (v(), g("button", {
          key: 0,
          class: ae(["vf-btn py-0 vf-btn-primary", { disabled: !d.value }]),
          disabled: !d.value,
          onClick: u[1] || (u[1] = (m) => o(e).selectButton.click(o(s).getSelected(), m))
        }, b(o(n)("Select")), 11, Tv)) : q("", !0),
        r("span", {
          class: "vuefinder__status-bar__about",
          title: o(n)("About"),
          onClick: u[2] || (u[2] = (m) => o(e).modal.open(Ao))
        }, [
          P(o(gv))
        ], 8, Av)
      ])
    ]));
  }
}, Mv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "text-neutral-500 fill-sky-500 stroke-gray-100/50 dark:stroke-slate-700/50 dark:fill-slate-500",
  viewBox: "0 0 24 24"
};
function Vv(t, e) {
  return v(), g("svg", Mv, e[0] || (e[0] = [
    r("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3.75 9.776q.168-.026.344-.026h15.812q.176 0 .344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
    }, null, -1)
  ]));
}
const Po = { render: Vv }, Ov = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Lv(t, e) {
  return v(), g("svg", Ov, e[0] || (e[0] = [
    r("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    r("path", { d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m3.6 5.2a1 1 0 0 0-1.4.2L12 10.333 9.8 7.4a1 1 0 1 0-1.6 1.2l2.55 3.4-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2-2.933 2.2 2.933a1 1 0 0 0 1.6-1.2L13.25 12l2.55-3.4a1 1 0 0 0-.2-1.4" }, null, -1)
  ]));
}
const Fv = { render: Lv }, Hv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function Rv(t, e) {
  return v(), g("svg", Hv, e[0] || (e[0] = [
    r("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    r("path", { d: "M15 12H9M12 9v6" }, null, -1)
  ]));
}
const jo = { render: Rv }, Bv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function Iv(t, e) {
  return v(), g("svg", Bv, e[0] || (e[0] = [
    r("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    r("path", { d: "M9 12h6" }, null, -1)
  ]));
}
const Go = { render: Iv };
function Ko(t, e) {
  const n = t.findIndex((l) => l.path === e.path);
  n > -1 ? t[n] = e : t.push(e);
}
const Uv = { class: "vuefinder__folder-loader-indicator" }, Nv = {
  key: 1,
  class: "vuefinder__folder-loader-indicator--icon"
}, Wo = {
  __name: "FolderLoaderIndicator",
  props: /* @__PURE__ */ lr({
    adapter: {
      type: String,
      required: !0
    },
    path: {
      type: String,
      required: !0
    }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const e = t, n = re("ServiceContainer");
    n.i18n;
    const l = Rs(t, "modelValue"), s = C(!1);
    He(
      () => l.value,
      () => {
        var d;
        return ((d = c()) == null ? void 0 : d.folders.length) || i();
      }
    );
    function c() {
      return n.treeViewData.find((d) => d.path === e.path);
    }
    const i = () => {
      s.value = !0, n.requester.send({
        url: "",
        method: "get",
        params: {
          q: "subfolders",
          adapter: e.adapter,
          path: e.path
        }
      }).then((d) => {
        Ko(n.treeViewData, { path: e.path, ...d });
      }).catch((d) => {
      }).finally(() => {
        s.value = !1;
      });
    };
    return (d, a) => {
      var u;
      return v(), g("div", Uv, [
        s.value ? (v(), Y(o(is), {
          key: 0,
          class: "vuefinder__folder-loader-indicator--loading"
        })) : (v(), g("div", Nv, [
          l.value && ((u = c()) != null && u.folders.length) ? (v(), Y(o(Go), {
            key: 0,
            class: "vuefinder__folder-loader-indicator--minus"
          })) : q("", !0),
          l.value ? q("", !0) : (v(), Y(o(jo), {
            key: 1,
            class: "vuefinder__folder-loader-indicator--plus"
          }))
        ]))
      ]);
    };
  }
}, qv = { class: "vuefinder__treesubfolderlist__item-content" }, zv = ["onClick"], Pv = ["title", "onClick"], jv = { class: "vuefinder__treesubfolderlist__item-icon" }, Gv = { class: "vuefinder__treesubfolderlist__subfolder" }, Kv = {
  __name: "TreeSubfolderList",
  props: {
    adapter: {
      type: String,
      required: !0
    },
    path: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = C([]), l = t, s = C(null);
    Se(() => {
      l.path === l.adapter + "://" && je(s.value, {
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    });
    const c = rt(() => {
      var i;
      return ((i = e.treeViewData.find((d) => d.path === l.path)) == null ? void 0 : i.folders) || [];
    });
    return (i, d) => {
      const a = ar("TreeSubfolderList", !0);
      return v(), g("ul", {
        ref_key: "parentSubfolderList",
        ref: s,
        class: "vuefinder__treesubfolderlist__container"
      }, [
        (v(!0), g(ge, null, ye(c.value, (u, m) => (v(), g("li", {
          key: u.path,
          class: "vuefinder__treesubfolderlist__item"
        }, [
          r("div", qv, [
            r("div", {
              class: "vuefinder__treesubfolderlist__item-toggle",
              onClick: (_) => n.value[u.path] = !n.value[u.path]
            }, [
              P(Wo, {
                adapter: t.adapter,
                path: u.path,
                modelValue: n.value[u.path],
                "onUpdate:modelValue": (_) => n.value[u.path] = _
              }, null, 8, ["adapter", "path", "modelValue", "onUpdate:modelValue"])
            ], 8, zv),
            r("div", {
              class: "vuefinder__treesubfolderlist__item-link",
              title: u.path,
              onClick: (_) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: l.adapter, path: u.path } })
            }, [
              r("div", jv, [
                o(e).fs.path === u.path ? (v(), Y(o(Po), { key: 0 })) : (v(), Y(o(hn), { key: 1 }))
              ]),
              r("div", {
                class: ae(["vuefinder__treesubfolderlist__item-text", {
                  "vuefinder__treesubfolderlist__item-text--active": o(e).fs.path === u.path
                }])
              }, b(u.basename), 3)
            ], 8, Pv)
          ]),
          r("div", Gv, [
            ue(P(a, {
              adapter: l.adapter,
              path: u.path
            }, null, 8, ["adapter", "path"]), [
              [Ne, n.value[u.path]]
            ])
          ])
        ]))), 128))
      ], 512);
    };
  }
}, Wv = { class: "vuefinder__treestorageitem__loader" }, Yv = {
  __name: "TreeStorageItem",
  props: {
    storage: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = C(!1);
    return (l, s) => (v(), g(ge, null, [
      r("div", {
        onClick: s[1] || (s[1] = (c) => n.value = !n.value),
        class: "vuefinder__treestorageitem__header"
      }, [
        r("div", {
          class: ae(["vuefinder__treestorageitem__info", t.storage === o(e).fs.adapter ? "vuefinder__treestorageitem__info--active" : ""])
        }, [
          r("div", {
            class: ae(["vuefinder__treestorageitem__icon", t.storage === o(e).fs.adapter ? "vuefinder__treestorageitem__icon--active" : ""])
          }, [
            P(o(zo))
          ], 2),
          r("div", null, b(t.storage), 1)
        ], 2),
        r("div", Wv, [
          P(Wo, {
            adapter: t.storage,
            path: t.storage + "://",
            modelValue: n.value,
            "onUpdate:modelValue": s[0] || (s[0] = (c) => n.value = c)
          }, null, 8, ["adapter", "path", "modelValue"])
        ])
      ]),
      ue(P(Kv, {
        adapter: t.storage,
        path: t.storage + "://",
        class: "vuefinder__treestorageitem__subfolder"
      }, null, 8, ["adapter", "path"]), [
        [Ne, n.value]
      ])
    ], 64));
  }
}, Xv = { class: "vuefinder__folder-indicator" }, Jv = { class: "vuefinder__folder-indicator--icon" }, Zv = {
  __name: "FolderIndicator",
  props: {
    modelValue: {},
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(t) {
    const e = Rs(t, "modelValue");
    return (n, l) => (v(), g("div", Xv, [
      r("div", Jv, [
        e.value ? (v(), Y(o(Go), {
          key: 0,
          class: "vuefinder__folder-indicator--minus"
        })) : q("", !0),
        e.value ? q("", !0) : (v(), Y(o(jo), {
          key: 1,
          class: "vuefinder__folder-indicator--plus"
        }))
      ])
    ]));
  }
}, Qv = { class: "vuefinder__treeview__header" }, e_ = { class: "vuefinder__treeview__pinned-label" }, t_ = { class: "vuefinder__treeview__pin-text text-nowrap" }, n_ = {
  key: 0,
  class: "vuefinder__treeview__pinned-list"
}, s_ = { class: "vuefinder__treeview__pinned-item" }, o_ = ["onClick"], r_ = ["title"], l_ = ["onClick"], a_ = { key: 0 }, i_ = { class: "vuefinder__treeview__no-pinned" }, c_ = { class: "vuefinder__treeview__storage" }, d_ = {
  __name: "TreeView",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { getStore: l, setStore: s } = e.storage, c = C(190), i = C(l("pinned-folders-opened", !0));
    He(i, (m) => s("pinned-folders-opened", m));
    const d = (m) => {
      e.pinnedFolders = e.pinnedFolders.filter((_) => _.path !== m.path), e.storage.setStore("pinned-folders", e.pinnedFolders);
    }, a = (m) => {
      const _ = m.clientX, p = m.target.parentElement, f = p.getBoundingClientRect().width;
      p.classList.remove("transition-[width]"), p.classList.add("transition-none");
      const h = (A) => {
        c.value = f + A.clientX - _, c.value < 50 && (c.value = 0, e.showTreeView = !1), c.value > 50 && (e.showTreeView = !0);
      }, x = () => {
        const A = p.getBoundingClientRect();
        c.value = A.width, p.classList.add("transition-[width]"), p.classList.remove("transition-none"), window.removeEventListener("mousemove", h), window.removeEventListener("mouseup", x);
      };
      window.addEventListener("mousemove", h), window.addEventListener("mouseup", x);
    }, u = C(null);
    return Se(() => {
      je(u.value, {
        overflow: {
          x: "hidden"
        },
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    }), He(e.fs.data, (m, _) => {
      const p = m.files.filter((f) => f.type === "dir");
      Ko(e.treeViewData, { path: e.fs.path, folders: p.map((f) => ({
        adapter: f.storage,
        path: f.path,
        basename: f.basename
      })) });
    }), (m, _) => (v(), g(ge, null, [
      r("div", {
        onClick: _[0] || (_[0] = (p) => o(e).showTreeView = !o(e).showTreeView),
        class: ae(["vuefinder__treeview__overlay", o(e).showTreeView ? "vuefinder__treeview__backdrop" : "hidden"])
      }, null, 2),
      r("div", {
        style: an(o(e).showTreeView ? "min-width:100px;max-width:75%; width: " + c.value + "px" : "width: 0"),
        class: "vuefinder__treeview__container"
      }, [
        r("div", {
          ref_key: "treeViewScrollElement",
          ref: u,
          class: "vuefinder__treeview__scroll"
        }, [
          r("div", Qv, [
            r("div", {
              onClick: _[2] || (_[2] = (p) => i.value = !i.value),
              class: "vuefinder__treeview__pinned-toggle"
            }, [
              r("div", e_, [
                P(o(qo), { class: "vuefinder__treeview__pin-icon" }),
                r("div", t_, b(o(n)("Pinned Folders")), 1)
              ]),
              P(Zv, {
                modelValue: i.value,
                "onUpdate:modelValue": _[1] || (_[1] = (p) => i.value = p)
              }, null, 8, ["modelValue"])
            ]),
            i.value ? (v(), g("ul", n_, [
              (v(!0), g(ge, null, ye(o(e).pinnedFolders, (p) => (v(), g("li", s_, [
                r("div", {
                  class: "vuefinder__treeview__pinned-folder",
                  onClick: (f) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: p.storage, path: p.path } })
                }, [
                  o(e).fs.path !== p.path ? (v(), Y(o(hn), {
                    key: 0,
                    class: "vuefinder__treeview__folder-icon"
                  })) : q("", !0),
                  o(e).fs.path === p.path ? (v(), Y(o(Po), {
                    key: 1,
                    class: "vuefinder__treeview__open-folder-icon"
                  })) : q("", !0),
                  r("div", {
                    title: p.path,
                    class: ae(["vuefinder__treeview__folder-name text-nowrap", {
                      "vuefinder__treeview__folder-name--active": o(e).fs.path === p.path
                    }])
                  }, b(p.basename), 11, r_)
                ], 8, o_),
                r("div", {
                  class: "vuefinder__treeview__remove-favorite",
                  onClick: (f) => d(p)
                }, [
                  P(o(Fv), { class: "vuefinder__treeview__remove-icon" })
                ], 8, l_)
              ]))), 256)),
              o(e).pinnedFolders.length ? q("", !0) : (v(), g("li", a_, [
                r("div", i_, b(o(n)("No folders pinned")), 1)
              ]))
            ])) : q("", !0)
          ]),
          (v(!0), g(ge, null, ye(o(e).fs.data.storages, (p) => (v(), g("div", c_, [
            P(Yv, { storage: p }, null, 8, ["storage"])
          ]))), 256))
        ], 512),
        r("div", {
          onMousedown: a,
          class: ae([(o(e).showTreeView, ""), "vuefinder__treeview__resize-handle"])
        }, null, 34)
      ], 4)
    ], 64));
  }
}, u_ = { class: "vuefinder__main__content" }, v_ = {
  __name: "VueFinder",
  props: {
    id: {
      type: String,
      default: "vf"
    },
    request: {
      type: [String, Object],
      required: !0
    },
    persist: {
      type: Boolean,
      default: !1
    },
    path: {
      type: String,
      default: ""
    },
    features: {
      type: [Array, Boolean],
      default: !0
    },
    debug: {
      type: Boolean,
      default: !1
    },
    theme: {
      type: String,
      default: "system"
    },
    locale: {
      type: String,
      default: null
    },
    maxHeight: {
      type: String,
      default: "600px"
    },
    maxFileSize: {
      type: String,
      default: "10mb"
    },
    fullScreen: {
      type: Boolean,
      default: !1
    },
    showTreeView: {
      type: Boolean,
      default: !1
    },
    pinnedFolders: {
      type: Array,
      default: []
    },
    showThumbnails: {
      type: Boolean,
      default: !0
    },
    selectButton: {
      type: Object,
      default(t) {
        return {
          active: !1,
          multiple: !1,
          click: (e) => {
          },
          ...t
        };
      }
    }
  },
  emits: ["select"],
  setup(t, { emit: e }) {
    const n = e, s = Dl(t, re("VueFinderOptions"));
    ir("ServiceContainer", s);
    const { setStore: c } = s.storage, i = C(null);
    s.root = i;
    const d = s.dragSelect;
    ii(s);
    const a = (m) => {
      Object.assign(s.fs.data, m), d.clearSelection(), d.refreshSelection();
    };
    let u;
    return s.emitter.on("vf-fetch-abort", () => {
      u.abort(), s.fs.loading = !1;
    }), s.emitter.on("vf-fetch", ({ params: m, body: _ = null, onSuccess: p = null, onError: f = null, noCloseModal: h = !1 }) => {
      ["index", "search"].includes(m.q) && (u && u.abort(), s.fs.loading = !0), u = new AbortController();
      const x = u.signal;
      s.requester.send({
        url: "",
        method: m.m || "get",
        params: m,
        body: _,
        abortSignal: x
      }).then((A) => {
        s.fs.adapter = A.adapter, s.persist && (s.fs.path = A.dirname, c("path", s.fs.path)), ["index", "search"].includes(m.q) && (s.fs.loading = !1), h || s.modal.close(), a(A), p && p(A);
      }).catch((A) => {
        console.error(A), f && f(A);
      });
    }), Se(() => {
      let m = {};
      s.fs.path.includes("://") && (m = {
        adapter: s.fs.path.split("://")[0],
        path: s.fs.path
      }), s.emitter.emit("vf-fetch", { params: { q: "index", adapter: s.fs.adapter, ...m } }), d.onSelect((_) => {
        n("select", _);
      });
    }), (m, _) => (v(), g("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: i,
      tabindex: "0"
    }, [
      r("div", {
        class: ae(o(s).theme.actualValue)
      }, [
        r("div", {
          class: ae([o(s).fullScreen ? "vuefinder__main__fixed" : "vuefinder__main__relative", "vuefinder__main__container"]),
          style: an(o(s).fullScreen ? "" : "max-height: " + t.maxHeight),
          onMousedown: _[0] || (_[0] = (p) => o(s).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: _[1] || (_[1] = (p) => o(s).emitter.emit("vf-contextmenu-hide"))
        }, [
          P(Fc),
          P(Bd),
          r("div", u_, [
            P(d_),
            P(dv)
          ]),
          P(Dv)
        ], 38),
        P(cr, { name: "fade" }, {
          default: ne(() => [
            o(s).modal.visible ? (v(), Y(Fs(o(s).modal.type), { key: 0 })) : q("", !0)
          ]),
          _: 1
        }),
        P(_v)
      ], 2)
    ], 512));
  }
}, k_ = {
  /**
   * @param {import('vue').App} app
   * @param options
   */
  install(t, e = {}) {
    e.i18n = e.i18n ?? {};
    let [n] = Object.keys(e.i18n);
    e.locale = e.locale ?? n ?? "en", t.provide("VueFinderOptions", e), t.component("VueFinder", v_);
  }
};
export {
  k_ as default
};
