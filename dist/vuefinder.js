var tr = Object.defineProperty;
var nr = (t, e, n) => e in t ? tr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var vs = (t, e, n) => nr(t, typeof e != "symbol" ? e + "" : e, n);
import { reactive as yt, watch as Te, ref as F, shallowRef as sr, onMounted as Se, onUnmounted as Gn, onUpdated as Ls, nextTick as ct, computed as rt, inject as re, openBlock as v, createElementBlock as h, withKeys as kt, unref as o, createElementVNode as a, withModifiers as st, renderSlot as At, normalizeClass as oe, toDisplayString as b, createBlock as j, resolveDynamicComponent as Fs, withCtx as J, createVNode as P, Fragment as ge, renderList as ye, createCommentVNode as N, withDirectives as de, vModelCheckbox as zt, createTextVNode as W, vModelSelect as Jt, vModelText as xt, onBeforeUnmount as Rs, customRef as or, vShow as Ne, isRef as rr, TransitionGroup as ar, normalizeStyle as ln, mergeModels as lr, useModel as Bs, resolveComponent as ir, provide as cr, Transition as dr } from "vue";
import ur from "mitt";
import vr from "dragselect";
import _r from "@uppy/core";
import fr from "@uppy/xhr-upload";
import mr from "vanilla-lazyload";
import "cropperjs/dist/cropper.css";
import pr from "cropperjs";
var Vs;
const xn = (Vs = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : Vs.getAttribute("content");
class hr {
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
    const n = this.config, r = {};
    xn != null && xn !== "" && (r[n.xsrfHeaderName] = xn);
    const s = Object.assign({}, n.headers, r, e.headers), c = Object.assign({}, n.params, e.params), i = e.body, d = n.baseUrl + e.url, l = e.method;
    let u;
    l !== "get" && (i instanceof FormData ? (u = i, n.body != null && Object.entries(this.config.body).forEach(([_, m]) => {
      u.append(_, m);
    })) : (u = { ...i }, n.body != null && Object.assign(u, this.config.body)));
    const f = {
      url: d,
      method: l,
      headers: s,
      params: c,
      body: u
    };
    if (n.transformRequest != null) {
      const _ = n.transformRequest({
        url: d,
        method: l,
        headers: s,
        params: c,
        body: u
      });
      _.url != null && (f.url = _.url), _.method != null && (f.method = _.method), _.params != null && (f.params = _.params ?? {}), _.headers != null && (f.headers = _.headers ?? {}), _.body != null && (f.body = _.body);
    }
    return f;
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
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: e, path: n.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
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
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: n.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
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
    const n = this.transformRequestParams(e), r = e.responseType || "json", s = {
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
      return await i[r]();
    throw await i.json();
  }
}
function gr(t) {
  const e = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token"
  };
  return typeof t == "string" ? Object.assign(e, { baseUrl: t }) : Object.assign(e, t), new hr(e);
}
function br(t) {
  let e = localStorage.getItem(t + "_storage");
  const n = yt(JSON.parse(e ?? "{}"));
  Te(n, r);
  function r() {
    Object.keys(n).length ? localStorage.setItem(t + "_storage", JSON.stringify(n)) : localStorage.removeItem(t + "_storage");
  }
  function s(l, u) {
    n[l] = u;
  }
  function c(l) {
    delete n[l];
  }
  function i() {
    Object.keys(n).map((l) => c(l));
  }
  return { getStore: (l, u = null) => n.hasOwnProperty(l) ? n[l] : u, setStore: s, removeStore: c, clearStore: i };
}
async function wr(t, e) {
  const n = e[t];
  return typeof n == "function" ? (await n()).default : n;
}
function yr(t, e, n, r) {
  const { getStore: s, setStore: c } = t, i = F({}), d = F(s("locale", e)), l = (_, m = e) => {
    wr(_, r).then((p) => {
      i.value = p, c("locale", _), d.value = _, c("translations", p), Object.values(r).length > 1 && (n.emit("vf-toast-push", { label: "The language is set to " + _ }), n.emit("vf-language-saved"));
    }).catch((p) => {
      m ? (n.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), l(m, null)) : n.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  Te(d, (_) => {
    l(_);
  }), !s("locale") && !r.length ? l(e) : i.value = s("translations");
  const u = (_, ...m) => m.length ? u(_ = _.replace("%s", m.shift()), ...m) : _;
  function f(_, ...m) {
    return i.value && i.value.hasOwnProperty(_) ? u(i.value[_], ...m) : u(_, ...m);
  }
  return yt({ t: f, locale: d });
}
const ce = {
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
  UPDATEDOCTYPE: "update_doctype",
  LANGUAGE: "language"
}, kr = Object.values(ce), xr = "2.5.16";
function Hs(t, e, n, r, s) {
  return (e = Math, n = e.log, r = 1024, s = n(t) / n(r) | 0, t / e.pow(r, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "iB" : "B");
}
function Is(t, e, n, r, s) {
  return (e = Math, n = e.log, r = 1e3, s = n(t) / n(r) | 0, t / e.pow(r, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "B" : "B");
}
function Sr(t) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, r = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(t);
  return r[1] * Math.pow(1024, e[r[2].toLowerCase()]);
}
const tt = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function $r(t, e) {
  const n = F(tt.SYSTEM), r = F(tt.LIGHT);
  n.value = t.getStore("theme", e ?? tt.SYSTEM);
  const s = window.matchMedia("(prefers-color-scheme: dark)"), c = (i) => {
    n.value === tt.DARK || n.value === tt.SYSTEM && i.matches ? r.value = tt.DARK : r.value = tt.LIGHT;
  };
  return c(s), s.addEventListener("change", c), {
    /**
     * @type {import('vue').Ref<Theme>}
     */
    value: n,
    /**
     * @type {import('vue').Ref<Theme>}
     */
    actualValue: r,
    /**
     * @param {Theme} value
     */
    set(i) {
      n.value = i, i !== tt.SYSTEM ? t.setStore("theme", i) : t.removeStore("theme"), c(s);
    }
  };
}
function Cr() {
  const t = sr(null), e = F(!1), n = F();
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
const Oe = (t, e) => {
  const { o: n, i: r, u: s } = t;
  let c = n, i;
  const d = (f, _) => {
    const m = c, p = f, w = _ || (r ? !r(m, p) : m !== p);
    return (w || s) && (c = p, i = m), [c, w, i];
  };
  return [e ? (f) => d(e(c, i), f) : d, (f) => [c, !!f, i]];
}, Er = typeof window < "u" && typeof HTMLElement < "u" && !!window.document, Me = Er ? window : {}, Us = Math.max, Tr = Math.min, An = Math.round, Zt = Math.abs, _s = Math.sign, Ns = Me.cancelAnimationFrame, Kn = Me.requestAnimationFrame, Qt = Me.setTimeout, Dn = Me.clearTimeout, cn = (t) => typeof Me[t] < "u" ? Me[t] : void 0, Ar = cn("MutationObserver"), fs = cn("IntersectionObserver"), en = cn("ResizeObserver"), Kt = cn("ScrollTimeline"), Wn = (t) => t === void 0, dn = (t) => t === null, ze = (t) => typeof t == "number", Vt = (t) => typeof t == "string", Yn = (t) => typeof t == "boolean", Be = (t) => typeof t == "function", qe = (t) => Array.isArray(t), tn = (t) => typeof t == "object" && !qe(t) && !dn(t), Xn = (t) => {
  const e = !!t && t.length, n = ze(e) && e > -1 && e % 1 == 0;
  return qe(t) || !Be(t) && n ? e > 0 && tn(t) ? e - 1 in t : !0 : !1;
}, nn = (t) => !!t && t.constructor === Object, sn = (t) => t instanceof HTMLElement, un = (t) => t instanceof Element;
function le(t, e) {
  if (Xn(t))
    for (let n = 0; n < t.length && e(t[n], n, t) !== !1; n++)
      ;
  else t && le(Object.keys(t), (n) => e(t[n], n, t));
  return t;
}
const Ps = (t, e) => t.indexOf(e) >= 0, Dt = (t, e) => t.concat(e), pe = (t, e, n) => (!Vt(e) && Xn(e) ? Array.prototype.push.apply(t, e) : t.push(e), t), at = (t) => Array.from(t || []), Jn = (t) => qe(t) ? t : !Vt(t) && Xn(t) ? at(t) : [t], Mn = (t) => !!t && !t.length, On = (t) => at(new Set(t)), Fe = (t, e, n) => {
  le(t, (s) => s ? s.apply(void 0, e || []) : !0), !n && (t.length = 0);
}, zs = "paddingTop", qs = "paddingRight", js = "paddingLeft", Gs = "paddingBottom", Ks = "marginLeft", Ws = "marginRight", Ys = "marginBottom", Xs = "overflowX", Js = "overflowY", vn = "width", _n = "height", nt = "visible", it = "hidden", gt = "scroll", Dr = (t) => {
  const e = String(t || "");
  return e ? e[0].toUpperCase() + e.slice(1) : "";
}, fn = (t, e, n, r) => {
  if (t && e) {
    let s = !0;
    return le(n, (c) => {
      const i = t[c], d = e[c];
      i !== d && (s = !1);
    }), s;
  }
  return !1;
}, Zs = (t, e) => fn(t, e, ["w", "h"]), Wt = (t, e) => fn(t, e, ["x", "y"]), Mr = (t, e) => fn(t, e, ["t", "r", "b", "l"]), dt = () => {
}, G = (t, ...e) => t.bind(0, ...e), ft = (t) => {
  let e;
  const n = t ? Qt : Kn, r = t ? Dn : Ns;
  return [(s) => {
    r(e), e = n(() => s(), Be(t) ? t() : t);
  }, () => r(e)];
}, Vn = (t, e) => {
  const { _: n, v: r, p: s, S: c } = e || {};
  let i, d, l, u, f = dt;
  const _ = function(g) {
    f(), Dn(i), u = i = d = void 0, f = dt, t.apply(this, g);
  }, m = (R) => c && d ? c(d, R) : R, p = () => {
    f !== dt && _(m(l) || l);
  }, w = function() {
    const g = at(arguments), C = Be(n) ? n() : n;
    if (ze(C) && C >= 0) {
      const O = Be(r) ? r() : r, x = ze(O) && O >= 0, $ = C > 0 ? Qt : Kn, M = C > 0 ? Dn : Ns, H = m(g) || g, E = _.bind(0, H);
      let S;
      f(), s && !u ? (E(), u = !0, S = $(() => u = void 0, C)) : (S = $(E, C), x && !i && (i = Qt(p, O))), f = () => M(S), d = l = H;
    } else
      _(g);
  };
  return w.m = p, w;
}, Qs = (t, e) => Object.prototype.hasOwnProperty.call(t, e), He = (t) => t ? Object.keys(t) : [], se = (t, e, n, r, s, c, i) => {
  const d = [e, n, r, s, c, i];
  return (typeof t != "object" || dn(t)) && !Be(t) && (t = {}), le(d, (l) => {
    le(l, (u, f) => {
      const _ = l[f];
      if (t === _)
        return !0;
      const m = qe(_);
      if (_ && nn(_)) {
        const p = t[f];
        let w = p;
        m && !qe(p) ? w = [] : !m && !nn(p) && (w = {}), t[f] = se(w, _);
      } else
        t[f] = m ? _.slice() : _;
    });
  }), t;
}, eo = (t, e) => le(se({}, t), (n, r, s) => {
  n === void 0 ? delete s[r] : n && nn(n) && (s[r] = eo(n));
}), Zn = (t) => !He(t).length, to = (t, e, n) => Us(t, Tr(e, n)), ut = (t) => On((qe(t) ? t : (t || "").split(" ")).filter((e) => e)), Qn = (t, e) => t && t.getAttribute(e), ms = (t, e) => t && t.hasAttribute(e), Xe = (t, e, n) => {
  le(ut(e), (r) => {
    t && t.setAttribute(r, String(n || ""));
  });
}, Ue = (t, e) => {
  le(ut(e), (n) => t && t.removeAttribute(n));
}, mn = (t, e) => {
  const n = ut(Qn(t, e)), r = G(Xe, t, e), s = (c, i) => {
    const d = new Set(n);
    return le(ut(c), (l) => {
      d[i](l);
    }), at(d).join(" ");
  };
  return {
    O: (c) => r(s(c, "delete")),
    $: (c) => r(s(c, "add")),
    C: (c) => {
      const i = ut(c);
      return i.reduce((d, l) => d && n.includes(l), i.length > 0);
    }
  };
}, no = (t, e, n) => (mn(t, e).O(n), G(es, t, e, n)), es = (t, e, n) => (mn(t, e).$(n), G(no, t, e, n)), on = (t, e, n, r) => (r ? es : no)(t, e, n), ts = (t, e, n) => mn(t, e).C(n), so = (t) => mn(t, "class"), oo = (t, e) => {
  so(t).O(e);
}, ns = (t, e) => (so(t).$(e), G(oo, t, e)), ro = (t, e) => {
  const n = e ? un(e) && e : document;
  return n ? at(n.querySelectorAll(t)) : [];
}, Or = (t, e) => {
  const n = e ? un(e) && e : document;
  return n && n.querySelector(t);
}, Ln = (t, e) => un(t) && t.matches(e), ao = (t) => Ln(t, "body"), Fn = (t) => t ? at(t.childNodes) : [], Mt = (t) => t && t.parentElement, mt = (t, e) => un(t) && t.closest(e), Rn = (t) => document.activeElement, Vr = (t, e, n) => {
  const r = mt(t, e), s = t && Or(n, r), c = mt(s, e) === r;
  return r && s ? r === t || s === t || c && mt(mt(t, n), e) !== r : !1;
}, bt = (t) => {
  le(Jn(t), (e) => {
    const n = Mt(e);
    e && n && n.removeChild(e);
  });
}, Ve = (t, e) => G(bt, t && e && le(Jn(e), (n) => {
  n && t.appendChild(n);
})), pt = (t) => {
  const e = document.createElement("div");
  return Xe(e, "class", t), e;
}, lo = (t) => {
  const e = pt();
  return e.innerHTML = t.trim(), le(Fn(e), (n) => bt(n));
}, ps = (t, e) => t.getPropertyValue(e) || t[e] || "", io = (t) => {
  const e = t || 0;
  return isFinite(e) ? e : 0;
}, qt = (t) => io(parseFloat(t || "")), Bn = (t) => Math.round(t * 1e4) / 1e4, co = (t) => `${Bn(io(t))}px`;
function Ot(t, e) {
  t && e && le(e, (n, r) => {
    try {
      const s = t.style, c = dn(n) || Yn(n) ? "" : ze(n) ? co(n) : n;
      r.indexOf("--") === 0 ? s.setProperty(r, c) : s[r] = c;
    } catch {
    }
  });
}
function Ze(t, e, n) {
  const r = Vt(e);
  let s = r ? "" : {};
  if (t) {
    const c = Me.getComputedStyle(t, n) || t.style;
    s = r ? ps(c, e) : at(e).reduce((i, d) => (i[d] = ps(c, d), i), s);
  }
  return s;
}
const hs = (t, e, n) => {
  const r = e ? `${e}-` : "", s = n ? `-${n}` : "", c = `${r}top${s}`, i = `${r}right${s}`, d = `${r}bottom${s}`, l = `${r}left${s}`, u = Ze(t, [c, i, d, l]);
  return {
    t: qt(u[c]),
    r: qt(u[i]),
    b: qt(u[d]),
    l: qt(u[l])
  };
}, Lr = (t, e) => `translate${tn(t) ? `(${t.x},${t.y})` : `Y(${t})`}`, Fr = (t) => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length), Rr = {
  w: 0,
  h: 0
}, pn = (t, e) => e ? {
  w: e[`${t}Width`],
  h: e[`${t}Height`]
} : Rr, Br = (t) => pn("inner", t || Me), ht = G(pn, "offset"), uo = G(pn, "client"), rn = G(pn, "scroll"), ss = (t) => {
  const e = parseFloat(Ze(t, vn)) || 0, n = parseFloat(Ze(t, _n)) || 0;
  return {
    w: e - An(e),
    h: n - An(n)
  };
}, Sn = (t) => t.getBoundingClientRect(), Hr = (t) => !!t && Fr(t), Hn = (t) => !!(t && (t[_n] || t[vn])), vo = (t, e) => {
  const n = Hn(t);
  return !Hn(e) && n;
}, gs = (t, e, n, r) => {
  le(ut(e), (s) => {
    t && t.removeEventListener(s, n, r);
  });
}, ve = (t, e, n, r) => {
  var s;
  const c = (s = r && r.H) != null ? s : !0, i = r && r.I || !1, d = r && r.A || !1, l = {
    passive: c,
    capture: i
  };
  return G(Fe, ut(e).map((u) => {
    const f = d ? (_) => {
      gs(t, u, f, i), n && n(_);
    } : n;
    return t && t.addEventListener(u, f, l), G(gs, t, u, f, i);
  }));
}, _o = (t) => t.stopPropagation(), In = (t) => t.preventDefault(), fo = (t) => _o(t) || In(t), Pe = (t, e) => {
  const { x: n, y: r } = ze(e) ? {
    x: e,
    y: e
  } : e || {};
  ze(n) && (t.scrollLeft = n), ze(r) && (t.scrollTop = r);
}, Le = (t) => ({
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
}), Ir = (t, e) => {
  const { D: n, M: r } = t, { w: s, h: c } = e, i = (_, m, p) => {
    let w = _s(_) * p, R = _s(m) * p;
    if (w === R) {
      const g = Zt(_), C = Zt(m);
      R = g > C ? 0 : R, w = g < C ? 0 : w;
    }
    return w = w === R ? 0 : w, [w + 0, R + 0];
  }, [d, l] = i(n.x, r.x, s), [u, f] = i(n.y, r.y, c);
  return {
    D: {
      x: d,
      y: u
    },
    M: {
      x: l,
      y: f
    }
  };
}, bs = ({ D: t, M: e }) => {
  const n = (r, s) => r === 0 && r <= s;
  return {
    x: n(t.x, e.x),
    y: n(t.y, e.y)
  };
}, ws = ({ D: t, M: e }, n) => {
  const r = (s, c, i) => to(0, 1, (s - i) / (s - c) || 0);
  return {
    x: r(t.x, e.x, n.x),
    y: r(t.y, e.y, n.y)
  };
}, Un = (t) => {
  t && t.focus && t.focus({
    preventScroll: !0
  });
}, ys = (t, e) => {
  le(Jn(e), t);
}, Nn = (t) => {
  const e = /* @__PURE__ */ new Map(), n = (c, i) => {
    if (c) {
      const d = e.get(c);
      ys((l) => {
        d && d[l ? "delete" : "clear"](l);
      }, i);
    } else
      e.forEach((d) => {
        d.clear();
      }), e.clear();
  }, r = (c, i) => {
    if (Vt(c)) {
      const u = e.get(c) || /* @__PURE__ */ new Set();
      return e.set(c, u), ys((f) => {
        Be(f) && u.add(f);
      }, i), G(n, c, i);
    }
    Yn(i) && i && n();
    const d = He(c), l = [];
    return le(d, (u) => {
      const f = c[u];
      f && pe(l, r(u, f));
    }), G(Fe, l);
  }, s = (c, i) => {
    le(at(e.get(c)), (d) => {
      i && !Mn(i) ? d.apply(0, i) : d();
    });
  };
  return r(t || {}), [r, n, s];
}, ks = (t) => JSON.stringify(t, (e, n) => {
  if (Be(n))
    throw 0;
  return n;
}), xs = (t, e) => t ? `${e}`.split(".").reduce((n, r) => n && Qs(n, r) ? n[r] : void 0, t) : void 0, Ur = {
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
  const n = {}, r = Dt(He(e), He(t));
  return le(r, (s) => {
    const c = t[s], i = e[s];
    if (tn(c) && tn(i))
      se(n[s] = {}, po(c, i)), Zn(n[s]) && delete n[s];
    else if (Qs(e, s) && i !== c) {
      let d = !0;
      if (qe(c) || qe(i))
        try {
          ks(c) === ks(i) && (d = !1);
        } catch {
        }
      d && (n[s] = i);
    }
  }), n;
}, Ss = (t, e, n) => (r) => [xs(t, r), n || xs(e, r) !== void 0], St = "data-overlayscrollbars", Yt = "os-environment", jt = `${Yt}-scrollbar-hidden`, $n = `${St}-initialize`, Xt = "noClipping", $s = `${St}-body`, ot = St, Nr = "host", Je = `${St}-viewport`, Pr = Xs, zr = Js, qr = "arrange", ho = "measuring", jr = "scrolling", go = "scrollbarHidden", Gr = "noContent", Pn = `${St}-padding`, Cs = `${St}-content`, os = "os-size-observer", Kr = `${os}-appear`, Wr = `${os}-listener`, Yr = "os-trinsic-observer", Xr = "os-theme-none", Re = "os-scrollbar", Jr = `${Re}-rtl`, Zr = `${Re}-horizontal`, Qr = `${Re}-vertical`, bo = `${Re}-track`, rs = `${Re}-handle`, ea = `${Re}-visible`, ta = `${Re}-cornerless`, Es = `${Re}-interaction`, Ts = `${Re}-unusable`, zn = `${Re}-auto-hide`, As = `${zn}-hidden`, Ds = `${Re}-wheel`, na = `${bo}-interactive`, sa = `${rs}-interactive`;
let wo;
const oa = () => wo, ra = (t) => {
  wo = t;
};
let Cn;
const aa = () => {
  const t = (x, $, M) => {
    Ve(document.body, x), Ve(document.body, x);
    const z = uo(x), H = ht(x), E = ss($);
    return M && bt(x), {
      x: H.h - z.h + E.h,
      y: H.w - z.w + E.w
    };
  }, e = (x) => {
    let $ = !1;
    const M = ns(x, jt);
    try {
      $ = Ze(x, "scrollbar-width") === "none" || Ze(x, "display", "::-webkit-scrollbar") === "none";
    } catch {
    }
    return M(), $;
  }, n = `.${Yt}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${Yt} div{width:200%;height:200%;margin:10px 0}.${jt}{scrollbar-width:none!important}.${jt}::-webkit-scrollbar,.${jt}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`, s = lo(`<div class="${Yt}"><div></div><style>${n}</style></div>`)[0], c = s.firstChild, i = s.lastChild, d = oa();
  d && (i.nonce = d);
  const [l, , u] = Nn(), [f, _] = Oe({
    o: t(s, c),
    i: Wt
  }, G(t, s, c, !0)), [m] = _(), p = e(s), w = {
    x: m.x === 0,
    y: m.y === 0
  }, R = {
    elements: {
      host: null,
      padding: !p,
      viewport: (x) => p && ao(x) && x,
      content: !1
    },
    scrollbars: {
      slot: !0
    },
    cancel: {
      nativeScrollbarsOverlaid: !1,
      body: null
    }
  }, g = se({}, Ur), C = G(se, {}, g), D = G(se, {}, R), O = {
    T: m,
    k: w,
    R: p,
    V: !!Kt,
    L: G(l, "r"),
    U: D,
    P: (x) => se(R, x) && D(),
    N: C,
    q: (x) => se(g, x) && C(),
    B: se({}, R),
    F: se({}, g)
  };
  if (Ue(s, "style"), bt(s), ve(Me, "resize", () => {
    u("r", []);
  }), Be(Me.matchMedia) && !p && (!w.x || !w.y)) {
    const x = ($) => {
      const M = Me.matchMedia(`(resolution: ${Me.devicePixelRatio}dppx)`);
      ve(M, "change", () => {
        $(), x($);
      }, {
        A: !0
      });
    };
    x(() => {
      const [$, M] = f();
      se(O.T, $), u("r", [M]);
    });
  }
  return O;
}, Ge = () => (Cn || (Cn = aa()), Cn), yo = (t, e) => Be(e) ? e.apply(0, t) : e, la = (t, e, n, r) => {
  const s = Wn(r) ? n : r;
  return yo(t, s) || e.apply(0, t);
}, ko = (t, e, n, r) => {
  const s = Wn(r) ? n : r, c = yo(t, s);
  return !!c && (sn(c) ? c : e.apply(0, t));
}, ia = (t, e) => {
  const { nativeScrollbarsOverlaid: n, body: r } = e || {}, { k: s, R: c, U: i } = Ge(), { nativeScrollbarsOverlaid: d, body: l } = i().cancel, u = n ?? d, f = Wn(r) ? l : r, _ = (s.x || s.y) && u, m = t && (dn(f) ? !c : f);
  return !!_ || !!m;
}, as = /* @__PURE__ */ new WeakMap(), ca = (t, e) => {
  as.set(t, e);
}, da = (t) => {
  as.delete(t);
}, xo = (t) => as.get(t), ua = (t, e, n) => {
  let r = !1;
  const s = n ? /* @__PURE__ */ new WeakMap() : !1, c = () => {
    r = !0;
  }, i = (d) => {
    if (s && n) {
      const l = n.map((u) => {
        const [f, _] = u || [];
        return [_ && f ? (d || ro)(f, t) : [], _];
      });
      le(l, (u) => le(u[0], (f) => {
        const _ = u[1], m = s.get(f) || [];
        if (t.contains(f) && _) {
          const w = ve(f, _, (R) => {
            r ? (w(), s.delete(f)) : e(R);
          });
          s.set(f, pe(m, w));
        } else
          Fe(m), s.delete(f);
      }));
    }
  };
  return i(), [c, i];
}, Ms = (t, e, n, r) => {
  let s = !1;
  const { j: c, X: i, Y: d, W: l, J: u, G: f } = r || {}, _ = Vn(() => s && n(!0), {
    _: 33,
    v: 99
  }), [m, p] = ua(t, _, d), w = c || [], R = i || [], g = Dt(w, R), C = (O, x) => {
    if (!Mn(x)) {
      const $ = u || dt, M = f || dt, z = [], H = [];
      let E = !1, S = !1;
      if (le(x, (L) => {
        const { attributeName: I, target: K, type: Y, oldValue: ee, addedNodes: Q, removedNodes: ne } = L, ae = Y === "attributes", te = Y === "childList", _e = t === K, k = ae && I, V = k && Qn(K, I || ""), A = Vt(V) ? V : null, T = k && ee !== A, y = Ps(R, I) && T;
        if (e && (te || !_e)) {
          const B = ae && T, U = B && l && Ln(K, l), Z = (U ? !$(K, I, ee, A) : !ae || B) && !M(L, !!U, t, r);
          le(Q, (ie) => pe(z, ie)), le(ne, (ie) => pe(z, ie)), S = S || Z;
        }
        !e && _e && T && !$(K, I, ee, A) && (pe(H, I), E = E || y);
      }), p((L) => On(z).reduce((I, K) => (pe(I, ro(L, K)), Ln(K, L) ? pe(I, K) : I), [])), e)
        return !O && S && n(!1), [!1];
      if (!Mn(H) || E) {
        const L = [On(H), E];
        return !O && n.apply(0, L), L;
      }
    }
  }, D = new Ar(G(C, !1));
  return [() => (D.observe(t, {
    attributes: !0,
    attributeOldValue: !0,
    attributeFilter: g,
    subtree: e,
    childList: e,
    characterData: e
  }), s = !0, () => {
    s && (m(), D.disconnect(), s = !1);
  }), () => {
    if (s)
      return _.m(), C(!0, D.takeRecords());
  }];
}, So = {}, $o = {}, va = (t) => {
  le(t, (e) => le(e, (n, r) => {
    So[r] = e[r];
  }));
}, Co = (t, e, n) => He(t).map((r) => {
  const { static: s, instance: c } = t[r], [i, d, l] = n || [], u = n ? c : s;
  if (u) {
    const f = n ? u(i, d, e) : u(e);
    return (l || $o)[r] = f;
  }
}), Lt = (t) => $o[t], _a = "__osOptionsValidationPlugin", fa = "__osSizeObserverPlugin", ma = (t, e) => {
  const { k: n } = e, [r, s] = t("showNativeOverlaidScrollbars");
  return [r && n.x && n.y, s];
}, wt = (t) => t.indexOf(nt) === 0, pa = (t, e) => {
  const n = (s, c, i, d) => {
    const l = s === nt ? it : s.replace(`${nt}-`, ""), u = wt(s), f = wt(i);
    return !c && !d ? it : u && f ? nt : u ? c && d ? l : c ? nt : it : c ? l : f && d ? nt : it;
  }, r = {
    x: n(e.x, t.x, e.y, t.y),
    y: n(e.y, t.y, e.x, t.x)
  };
  return {
    K: r,
    Z: {
      x: r.x === gt,
      y: r.y === gt
    }
  };
}, Eo = "__osScrollbarsHidingPlugin", ha = "__osClickScrollPlugin", To = (t, e, n) => {
  const { dt: r } = n || {}, s = Lt(fa), [c] = Oe({
    o: !1,
    u: !0
  });
  return () => {
    const i = [], l = lo(`<div class="${os}"><div class="${Wr}"></div></div>`)[0], u = l.firstChild, f = (_) => {
      const m = _ instanceof ResizeObserverEntry;
      let p = !1, w = !1;
      if (m) {
        const [R, , g] = c(_.contentRect), C = Hn(R);
        w = vo(R, g), p = !w && !C;
      } else
        w = _ === !0;
      p || e({
        ft: !0,
        dt: w
      });
    };
    if (en) {
      const _ = new en((m) => f(m.pop()));
      _.observe(u), pe(i, () => {
        _.disconnect();
      });
    } else if (s) {
      const [_, m] = s(u, f, r);
      pe(i, Dt([ns(l, Kr), ve(l, "animationstart", _)], m));
    } else
      return dt;
    return G(Fe, pe(i, Ve(t, l)));
  };
}, ga = (t, e) => {
  let n;
  const r = (l) => l.h === 0 || l.isIntersecting || l.intersectionRatio > 0, s = pt(Yr), [c] = Oe({
    o: !1
  }), i = (l, u) => {
    if (l) {
      const f = c(r(l)), [, _] = f;
      return _ && !u && e(f) && [f];
    }
  }, d = (l, u) => i(u.pop(), l);
  return [() => {
    const l = [];
    if (fs)
      n = new fs(G(d, !1), {
        root: t
      }), n.observe(s), pe(l, () => {
        n.disconnect();
      });
    else {
      const u = () => {
        const f = ht(s);
        i(f);
      };
      pe(l, To(s, u)()), u();
    }
    return G(Fe, pe(l, Ve(t, s)));
  }, () => n && d(!0, n.takeRecords())];
}, ba = (t, e, n, r) => {
  let s, c, i, d, l, u;
  const f = `[${ot}]`, _ = `[${Je}]`, m = ["id", "class", "style", "open", "wrap", "cols", "rows"], { vt: p, ht: w, ot: R, gt: g, bt: C, nt: D, wt: O, yt: x, St: $, Ot: M } = t, z = (y) => Ze(y, "direction") === "rtl", H = {
    $t: !1,
    ct: z(p)
  }, E = Ge(), S = Lt(Eo), [L] = Oe({
    i: Zs,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const y = S && S.tt(t, e, H, E, n).ut, U = !(O && D) && ts(w, ot, Xt), q = !D && x(qr), Z = q && Le(g), ie = Z && M(), be = $(ho, U), fe = q && y && y()[0], $e = rn(R), X = ss(R);
    return fe && fe(), Pe(g, Z), ie && ie(), U && be(), {
      w: $e.w + X.w,
      h: $e.h + X.h
    };
  }), I = Vn(r, {
    _: () => s,
    v: () => c,
    S(y, B) {
      const [U] = y, [q] = B;
      return [Dt(He(U), He(q)).reduce((Z, ie) => (Z[ie] = U[ie] || q[ie], Z), {})];
    }
  }), K = (y) => {
    const B = z(p);
    se(y, {
      Ct: u !== B
    }), se(H, {
      ct: B
    }), u = B;
  }, Y = (y, B) => {
    const [U, q] = y, Z = {
      xt: q
    };
    return se(H, {
      $t: U
    }), !B && r(Z), Z;
  }, ee = ({ ft: y, dt: B }) => {
    const q = !(y && !B) && E.R ? I : r, Z = {
      ft: y || B,
      dt: B
    };
    K(Z), q(Z);
  }, Q = (y, B) => {
    const [, U] = L(), q = {
      Ht: U
    };
    return K(q), U && !B && (y ? r : I)(q), q;
  }, ne = (y, B, U) => {
    const q = {
      Et: B
    };
    return K(q), B && !U && I(q), q;
  }, [ae, te] = C ? ga(w, Y) : [], _e = !D && To(w, ee, {
    dt: !0
  }), [k, V] = Ms(w, !1, ne, {
    X: m,
    j: m
  }), A = D && en && new en((y) => {
    const B = y[y.length - 1].contentRect;
    ee({
      ft: !0,
      dt: vo(B, l)
    }), l = B;
  }), T = Vn(() => {
    const [, y] = L();
    r({
      Ht: y
    });
  }, {
    _: 222,
    p: !0
  });
  return [() => {
    A && A.observe(w);
    const y = _e && _e(), B = ae && ae(), U = k(), q = E.L((Z) => {
      Z ? I({
        zt: Z
      }) : T();
    });
    return () => {
      A && A.disconnect(), y && y(), B && B(), d && d(), U(), q();
    };
  }, ({ It: y, At: B, Dt: U }) => {
    const q = {}, [Z] = y("update.ignoreMutation"), [ie, be] = y("update.attributes"), [fe, $e] = y("update.elementEvents"), [X, Ce] = y("update.debounce"), Ae = $e || be, ke = B || U, Ee = (he) => Be(Z) && Z(he);
    if (Ae) {
      i && i(), d && d();
      const [he, we] = Ms(C || R, !0, Q, {
        j: Dt(m, ie || []),
        Y: fe,
        W: f,
        G: (ue, me) => {
          const { target: xe, attributeName: De } = ue;
          return (!me && De && !D ? Vr(xe, f, _) : !1) || !!mt(xe, `.${Re}`) || !!Ee(ue);
        }
      });
      d = he(), i = we;
    }
    if (Ce)
      if (I.m(), qe(X)) {
        const he = X[0], we = X[1];
        s = ze(he) && he, c = ze(we) && we;
      } else ze(X) ? (s = X, c = !1) : (s = !1, c = !1);
    if (ke) {
      const he = V(), we = te && te(), ue = i && i();
      he && se(q, ne(he[0], he[1], ke)), we && se(q, Y(we[0], ke)), ue && se(q, Q(ue[0], ke));
    }
    return K(q), q;
  }, H];
}, wa = (t, e, n, r) => {
  const s = "--os-viewport-percent", c = "--os-scroll-percent", i = "--os-scroll-direction", { U: d } = Ge(), { scrollbars: l } = d(), { slot: u } = l, { vt: f, ht: _, ot: m, Mt: p, gt: w, wt: R, nt: g } = e, { scrollbars: C } = p ? {} : t, { slot: D } = C || {}, O = [], x = [], $ = [], M = ko([f, _, m], () => g && R ? f : _, u, D), z = (k) => {
    if (Kt) {
      const V = new Kt({
        source: w,
        axis: k
      });
      return {
        kt: (T) => {
          const y = T.Tt.animate({
            clear: ["left"],
            [c]: [0, 1]
          }, {
            timeline: V
          });
          return () => y.cancel();
        }
      };
    }
  }, H = {
    x: z("x"),
    y: z("y")
  }, E = () => {
    const { Rt: k, Vt: V } = n, A = (T, y) => to(0, 1, T / (T + y) || 0);
    return {
      x: A(V.x, k.x),
      y: A(V.y, k.y)
    };
  }, S = (k, V, A) => {
    const T = A ? ns : oo;
    le(k, (y) => {
      T(y.Tt, V);
    });
  }, L = (k, V) => {
    le(k, (A) => {
      const [T, y] = V(A);
      Ot(T, y);
    });
  }, I = (k, V, A) => {
    const T = Yn(A), y = T ? A : !0, B = T ? !A : !0;
    y && S(x, k, V), B && S($, k, V);
  }, K = () => {
    const k = E(), V = (A) => (T) => [T.Tt, {
      [s]: Bn(A) + ""
    }];
    L(x, V(k.x)), L($, V(k.y));
  }, Y = () => {
    if (!Kt) {
      const { Lt: k } = n, V = ws(k, Le(w)), A = (T) => (y) => [y.Tt, {
        [c]: Bn(T) + ""
      }];
      L(x, A(V.x)), L($, A(V.y));
    }
  }, ee = () => {
    const { Lt: k } = n, V = bs(k), A = (T) => (y) => [y.Tt, {
      [i]: T ? "0" : "1"
    }];
    L(x, A(V.x)), L($, A(V.y));
  }, Q = () => {
    if (g && !R) {
      const { Rt: k, Lt: V } = n, A = bs(V), T = ws(V, Le(w)), y = (B) => {
        const { Tt: U } = B, q = Mt(U) === m && U, Z = (ie, be, fe) => {
          const $e = be * ie;
          return co(fe ? $e : -$e);
        };
        return [q, q && {
          transform: Lr({
            x: Z(T.x, k.x, A.x),
            y: Z(T.y, k.y, A.y)
          })
        }];
      };
      L(x, y), L($, y);
    }
  }, ne = (k) => {
    const V = k ? "x" : "y", T = pt(`${Re} ${k ? Zr : Qr}`), y = pt(bo), B = pt(rs), U = {
      Tt: T,
      Ut: y,
      Pt: B
    }, q = H[V];
    return pe(k ? x : $, U), pe(O, [Ve(T, y), Ve(y, B), G(bt, T), q && q.kt(U), r(U, I, k)]), U;
  }, ae = G(ne, !0), te = G(ne, !1), _e = () => (Ve(M, x[0].Tt), Ve(M, $[0].Tt), G(Fe, O));
  return ae(), te(), [{
    Nt: K,
    qt: Y,
    Bt: ee,
    Ft: Q,
    jt: I,
    Xt: {
      Yt: x,
      Wt: ae,
      Jt: G(L, x)
    },
    Gt: {
      Yt: $,
      Wt: te,
      Jt: G(L, $)
    }
  }, _e];
}, ya = (t, e, n, r) => (s, c, i) => {
  const { ht: d, ot: l, nt: u, gt: f, Kt: _, Ot: m } = e, { Tt: p, Ut: w, Pt: R } = s, [g, C] = ft(333), [D, O] = ft(444), x = (z) => {
    Be(f.scrollBy) && f.scrollBy({
      behavior: "smooth",
      left: z.x,
      top: z.y
    });
  }, $ = () => {
    const z = "pointerup pointercancel lostpointercapture", H = `client${i ? "X" : "Y"}`, E = i ? vn : _n, S = i ? "left" : "top", L = i ? "w" : "h", I = i ? "x" : "y", K = (ee, Q) => (ne) => {
      const { Rt: ae } = n, te = ht(w)[L] - ht(R)[L], k = Q * ne / te * ae[I];
      Pe(f, {
        [I]: ee + k
      });
    }, Y = [];
    return ve(w, "pointerdown", (ee) => {
      const Q = mt(ee.target, `.${rs}`) === R, ne = Q ? R : w, ae = t.scrollbars, te = ae[Q ? "dragScroll" : "clickScroll"], { button: _e, isPrimary: k, pointerType: V } = ee, { pointers: A } = ae;
      if (_e === 0 && k && te && (A || []).includes(V)) {
        Fe(Y), O();
        const y = !Q && (ee.shiftKey || te === "instant"), B = G(Sn, R), U = G(Sn, w), q = (me, xe) => (me || B())[S] - (xe || U())[S], Z = An(Sn(f)[E]) / ht(f)[L] || 1, ie = K(Le(f)[I], 1 / Z), be = ee[H], fe = B(), $e = U(), X = fe[E], Ce = q(fe, $e) + X / 2, Ae = be - $e[S], ke = Q ? 0 : Ae - Ce, Ee = (me) => {
          Fe(ue), ne.releasePointerCapture(me.pointerId);
        }, he = Q || y, we = m(), ue = [ve(_, z, Ee), ve(_, "selectstart", (me) => In(me), {
          H: !1
        }), ve(w, z, Ee), he && ve(w, "pointermove", (me) => ie(ke + (me[H] - be))), he && (() => {
          const me = Le(f);
          we();
          const xe = Le(f), De = {
            x: xe.x - me.x,
            y: xe.y - me.y
          };
          (Zt(De.x) > 3 || Zt(De.y) > 3) && (m(), Pe(f, me), x(De), D(we));
        })];
        if (ne.setPointerCapture(ee.pointerId), y)
          ie(ke);
        else if (!Q) {
          const me = Lt(ha);
          if (me) {
            const xe = me(ie, ke, X, (De) => {
              De ? we() : pe(ue, we);
            });
            pe(ue, xe), pe(Y, G(xe, !0));
          }
        }
      }
    });
  };
  let M = !0;
  return G(Fe, [ve(R, "pointermove pointerleave", r), ve(p, "pointerenter", () => {
    c(Es, !0);
  }), ve(p, "pointerleave pointercancel", () => {
    c(Es, !1);
  }), !u && ve(p, "mousedown", () => {
    const z = Rn();
    (ms(z, Je) || ms(z, ot) || z === document.body) && Qt(G(Un, l), 25);
  }), ve(p, "wheel", (z) => {
    const { deltaX: H, deltaY: E, deltaMode: S } = z;
    M && S === 0 && Mt(p) === d && x({
      x: H,
      y: E
    }), M = !1, c(Ds, !0), g(() => {
      M = !0, c(Ds);
    }), In(z);
  }, {
    H: !1,
    I: !0
  }), ve(p, "pointerdown", G(ve, _, "click", fo, {
    A: !0,
    I: !0,
    H: !1
  }), {
    I: !0
  }), $(), C, O]);
}, ka = (t, e, n, r, s, c) => {
  let i, d, l, u, f, _ = dt, m = 0;
  const p = (k) => k.pointerType === "mouse", [w, R] = ft(), [g, C] = ft(100), [D, O] = ft(100), [x, $] = ft(() => m), [M, z] = wa(t, s, r, ya(e, s, r, (k) => p(k) && ne())), { ht: H, Qt: E, wt: S } = s, { jt: L, Nt: I, qt: K, Bt: Y, Ft: ee } = M, Q = (k, V) => {
    if ($(), k)
      L(As);
    else {
      const A = G(L, As, !0);
      m > 0 && !V ? x(A) : A();
    }
  }, ne = () => {
    (l ? !i : !u) && (Q(!0), g(() => {
      Q(!1);
    }));
  }, ae = (k) => {
    L(zn, k, !0), L(zn, k, !1);
  }, te = (k) => {
    p(k) && (i = l, l && Q(!0));
  }, _e = [$, C, O, R, () => _(), ve(H, "pointerover", te, {
    A: !0
  }), ve(H, "pointerenter", te), ve(H, "pointerleave", (k) => {
    p(k) && (i = !1, l && Q(!1));
  }), ve(H, "pointermove", (k) => {
    p(k) && d && ne();
  }), ve(E, "scroll", (k) => {
    w(() => {
      K(), ne();
    }), c(k), ee();
  })];
  return [() => G(Fe, pe(_e, z())), ({ It: k, Dt: V, Zt: A, tn: T }) => {
    const { nn: y, sn: B, en: U, cn: q } = T || {}, { Ct: Z, dt: ie } = A || {}, { ct: be } = n, { k: fe } = Ge(), { K: $e, rn: X } = r, [Ce, Ae] = k("showNativeOverlaidScrollbars"), [ke, Ee] = k("scrollbars.theme"), [he, we] = k("scrollbars.visibility"), [ue, me] = k("scrollbars.autoHide"), [xe, De] = k("scrollbars.autoHideSuspend"), [$t] = k("scrollbars.autoHideDelay"), [Ft, Rt] = k("scrollbars.dragScroll"), [Bt, lt] = k("scrollbars.clickScroll"), [vt, gn] = k("overflow"), bn = ie && !V, wn = X.x || X.y, yn = y || B || q || Z || V, Ie = U || we || gn, kn = Ce && fe.x && fe.y, Ct = (Et, et, Ht) => {
      const Tt = Et.includes(gt) && (he === nt || he === "auto" && et === gt);
      return L(ea, Tt, Ht), Tt;
    };
    if (m = $t, bn && (xe && wn ? (ae(!1), _(), D(() => {
      _ = ve(E, "scroll", G(ae, !0), {
        A: !0
      });
    })) : ae(!0)), Ae && L(Xr, kn), Ee && (L(f), L(ke, !0), f = ke), De && !xe && ae(!0), me && (d = ue === "move", l = ue === "leave", u = ue === "never", Q(u, !0)), Rt && L(sa, Ft), lt && L(na, !!Bt), Ie) {
      const Et = Ct(vt.x, $e.x, !0), et = Ct(vt.y, $e.y, !1);
      L(ta, !(Et && et));
    }
    yn && (K(), I(), ee(), q && Y(), L(Ts, !X.x, !0), L(Ts, !X.y, !1), L(Jr, be && !S));
  }, {}, M];
}, xa = (t) => {
  const e = Ge(), { U: n, R: r } = e, { elements: s } = n(), { padding: c, viewport: i, content: d } = s, l = sn(t), u = l ? {} : t, { elements: f } = u, { padding: _, viewport: m, content: p } = f || {}, w = l ? t : u.target, R = ao(w), g = w.ownerDocument, C = g.documentElement, D = () => g.defaultView || Me, O = G(la, [w]), x = G(ko, [w]), $ = G(pt, ""), M = G(O, $, i), z = G(x, $, d), H = (X) => {
    const Ce = ht(X), Ae = rn(X), ke = Ze(X, Xs), Ee = Ze(X, Js);
    return Ae.w - Ce.w > 0 && !wt(ke) || Ae.h - Ce.h > 0 && !wt(Ee);
  }, E = M(m), S = E === w, L = S && R, I = !S && z(p), K = !S && E === I, Y = L ? C : E, ee = L ? Y : w, Q = !S && x($, c, _), ne = !K && I, ae = [ne, Y, Q, ee].map((X) => sn(X) && !Mt(X) && X), te = (X) => X && Ps(ae, X), _e = !te(Y) && H(Y) ? Y : w, k = L ? C : Y, A = {
    vt: w,
    ht: ee,
    ot: Y,
    ln: Q,
    bt: ne,
    gt: k,
    Qt: L ? g : Y,
    an: R ? C : _e,
    Kt: g,
    wt: R,
    Mt: l,
    nt: S,
    un: D,
    yt: (X) => ts(Y, Je, X),
    St: (X, Ce) => on(Y, Je, X, Ce),
    Ot: () => on(k, Je, jr, !0)
  }, { vt: T, ht: y, ln: B, ot: U, bt: q } = A, Z = [() => {
    Ue(y, [ot, $n]), Ue(T, $n), R && Ue(C, [$n, ot]);
  }];
  let ie = Fn([q, U, B, y, T].find((X) => X && !te(X)));
  const be = L ? T : q || U, fe = G(Fe, Z);
  return [A, () => {
    const X = D(), Ce = Rn(), Ae = (ue) => {
      Ve(Mt(ue), Fn(ue)), bt(ue);
    }, ke = (ue) => ve(ue, "focusin focusout focus blur", fo, {
      I: !0,
      H: !1
    }), Ee = "tabindex", he = Qn(U, Ee), we = ke(Ce);
    return Xe(y, ot, S ? "" : Nr), Xe(B, Pn, ""), Xe(U, Je, ""), Xe(q, Cs, ""), S || (Xe(U, Ee, he || "-1"), R && Xe(C, $s, "")), Ve(be, ie), Ve(y, B), Ve(B || y, !S && U), Ve(U, q), pe(Z, [we, () => {
      const ue = Rn(), me = te(U), xe = me && ue === U ? T : ue, De = ke(xe);
      Ue(B, Pn), Ue(q, Cs), Ue(U, Je), R && Ue(C, $s), he ? Xe(U, Ee, he) : Ue(U, Ee), te(q) && Ae(q), me && Ae(U), te(B) && Ae(B), Un(xe), De();
    }]), r && !S && (es(U, Je, go), pe(Z, G(Ue, U, Je))), Un(!S && R && Ce === T && X.top === X ? U : Ce), we(), ie = 0, fe;
  }, fe];
}, Sa = ({ bt: t }) => ({ Zt: e, _n: n, Dt: r }) => {
  const { xt: s } = e || {}, { $t: c } = n;
  t && (s || r) && Ot(t, {
    [_n]: c && "100%"
  });
}, $a = ({ ht: t, ln: e, ot: n, nt: r }, s) => {
  const [c, i] = Oe({
    i: Mr,
    o: hs()
  }, G(hs, t, "padding", ""));
  return ({ It: d, Zt: l, _n: u, Dt: f }) => {
    let [_, m] = i(f);
    const { R: p } = Ge(), { ft: w, Ht: R, Ct: g } = l || {}, { ct: C } = u, [D, O] = d("paddingAbsolute");
    (w || m || (f || R)) && ([_, m] = c(f));
    const $ = !r && (O || g || m);
    if ($) {
      const M = !D || !e && !p, z = _.r + _.l, H = _.t + _.b, E = {
        [Ws]: M && !C ? -z : 0,
        [Ys]: M ? -H : 0,
        [Ks]: M && C ? -z : 0,
        top: M ? -_.t : 0,
        right: M ? C ? -_.r : "auto" : 0,
        left: M ? C ? "auto" : -_.l : 0,
        [vn]: M && `calc(100% + ${z}px)`
      }, S = {
        [zs]: M ? _.t : 0,
        [qs]: M ? _.r : 0,
        [Gs]: M ? _.b : 0,
        [js]: M ? _.l : 0
      };
      Ot(e || n, E), Ot(n, S), se(s, {
        ln: _,
        dn: !M,
        rt: e ? S : se({}, E, S)
      });
    }
    return {
      fn: $
    };
  };
}, Ca = (t, e) => {
  const n = Ge(), { ht: r, ln: s, ot: c, nt: i, Qt: d, gt: l, wt: u, St: f, un: _ } = t, { R: m } = n, p = u && i, w = G(Us, 0), R = {
    display: () => !1,
    direction: (V) => V !== "ltr",
    flexDirection: (V) => V.endsWith("-reverse"),
    writingMode: (V) => V !== "horizontal-tb"
  }, g = He(R), C = {
    i: Zs,
    o: {
      w: 0,
      h: 0
    }
  }, D = {
    i: Wt,
    o: {}
  }, O = (V) => {
    f(ho, !p && V);
  }, x = (V) => {
    if (!g.some((be) => {
      const fe = V[be];
      return fe && R[be](fe);
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
    O(!0);
    const T = Le(l), y = f(Gr, !0), B = ve(d, gt, (be) => {
      const fe = Le(l);
      be.isTrusted && fe.x === T.x && fe.y === T.y && _o(be);
    }, {
      I: !0,
      A: !0
    });
    Pe(l, {
      x: 0,
      y: 0
    }), y();
    const U = Le(l), q = rn(l);
    Pe(l, {
      x: q.w,
      y: q.h
    });
    const Z = Le(l);
    Pe(l, {
      x: Z.x - U.x < 1 && -q.w,
      y: Z.y - U.y < 1 && -q.h
    });
    const ie = Le(l);
    return Pe(l, T), Kn(() => B()), {
      D: U,
      M: ie
    };
  }, $ = (V, A) => {
    const T = Me.devicePixelRatio % 1 !== 0 ? 1 : 0, y = {
      w: w(V.w - A.w),
      h: w(V.h - A.h)
    };
    return {
      w: y.w > T ? y.w : 0,
      h: y.h > T ? y.h : 0
    };
  }, [M, z] = Oe(C, G(ss, c)), [H, E] = Oe(C, G(rn, c)), [S, L] = Oe(C), [I] = Oe(D), [K, Y] = Oe(C), [ee] = Oe(D), [Q] = Oe({
    i: (V, A) => fn(V, A, g),
    o: {}
  }, () => Hr(c) ? Ze(c, g) : {}), [ne, ae] = Oe({
    i: (V, A) => Wt(V.D, A.D) && Wt(V.M, A.M),
    o: mo()
  }), te = Lt(Eo), _e = (V, A) => `${A ? Pr : zr}${Dr(V)}`, k = (V) => {
    const A = (y) => [nt, it, gt].map((B) => _e(B, y)), T = A(!0).concat(A()).join(" ");
    f(T), f(He(V).map((y) => _e(V[y], y === "x")).join(" "), !0);
  };
  return ({ It: V, Zt: A, _n: T, Dt: y }, { fn: B }) => {
    const { ft: U, Ht: q, Ct: Z, dt: ie, zt: be } = A || {}, fe = te && te.tt(t, e, T, n, V), { it: $e, ut: X, _t: Ce } = fe || {}, [Ae, ke] = ma(V, n), [Ee, he] = V("overflow"), we = wt(Ee.x), ue = wt(Ee.y), me = !0;
    let xe = z(y), De = E(y), $t = L(y), Ft = Y(y);
    ke && m && f(go, !Ae);
    {
      ts(r, ot, Xt) && O(!0);
      const [ds] = X ? X() : [], [It] = xe = M(y), [Ut] = De = H(y), Nt = uo(c), Pt = p && Br(_()), er = {
        w: w(Ut.w + It.w),
        h: w(Ut.h + It.h)
      }, us = {
        w: w((Pt ? Pt.w : Nt.w + w(Nt.w - Ut.w)) + It.w),
        h: w((Pt ? Pt.h : Nt.h + w(Nt.h - Ut.h)) + It.h)
      };
      ds && ds(), Ft = K(us), $t = S($(er, us), y);
    }
    const [Rt, Bt] = Ft, [lt, vt] = $t, [gn, bn] = De, [wn, yn] = xe, [Ie, kn] = I({
      x: lt.w > 0,
      y: lt.h > 0
    }), Ct = we && ue && (Ie.x || Ie.y) || we && Ie.x && !Ie.y || ue && Ie.y && !Ie.x, Et = B || Z || be || yn || bn || Bt || vt || he || ke || me, et = pa(Ie, Ee), [Ht, Tt] = ee(et.K), [Xo, Jo] = Q(y), cs = Z || ie || Jo || kn || y, [Zo, Qo] = cs ? ne(x(Xo), y) : ae();
    return Et && (Tt && k(et.K), Ce && $e && Ot(c, Ce(et, T, $e(et, gn, wn)))), O(!1), on(r, ot, Xt, Ct), on(s, Pn, Xt, Ct), se(e, {
      K: Ht,
      Vt: {
        x: Rt.w,
        y: Rt.h
      },
      Rt: {
        x: lt.w,
        y: lt.h
      },
      rn: Ie,
      Lt: Ir(Zo, lt)
    }), {
      en: Tt,
      nn: Bt,
      sn: vt,
      cn: Qo || vt,
      vn: cs
    };
  };
}, Ea = (t) => {
  const [e, n, r] = xa(t), s = {
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
      [qs]: 0,
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
  }, { vt: c, gt: i, nt: d, Ot: l } = e, { R: u, k: f } = Ge(), _ = !u && (f.x || f.y), m = [Sa(e), $a(e, s), Ca(e, s)];
  return [n, (p) => {
    const w = {}, g = _ && Le(i), C = g && l();
    return le(m, (D) => {
      se(w, D(p, w) || {});
    }), Pe(i, g), C && C(), !d && Pe(c, 0), w;
  }, s, e, r];
}, Ta = (t, e, n, r, s) => {
  let c = !1;
  const i = Ss(e, {}), [d, l, u, f, _] = Ea(t), [m, p, w] = ba(f, u, i, (x) => {
    O({}, x);
  }), [R, g, , C] = ka(t, e, w, u, f, s), D = (x) => He(x).some(($) => !!x[$]), O = (x, $) => {
    if (n())
      return !1;
    const { pn: M, Dt: z, At: H, hn: E } = x, S = M || {}, L = !!z || !c, I = {
      It: Ss(e, S, L),
      pn: S,
      Dt: L
    };
    if (E)
      return g(I), !1;
    const K = $ || p(se({}, I, {
      At: H
    })), Y = l(se({}, I, {
      _n: w,
      Zt: K
    }));
    g(se({}, I, {
      Zt: K,
      tn: Y
    }));
    const ee = D(K), Q = D(Y), ne = ee || Q || !Zn(S) || L;
    return c = !0, ne && r(x, {
      Zt: K,
      tn: Y
    }), ne;
  };
  return [() => {
    const { an: x, gt: $, Ot: M } = f, z = Le(x), H = [m(), d(), R()], E = M();
    return Pe($, z), E(), G(Fe, H);
  }, O, () => ({
    gn: w,
    bn: u
  }), {
    wn: f,
    yn: C
  }, _];
}, je = (t, e, n) => {
  const { N: r } = Ge(), s = sn(t), c = s ? t : t.target, i = xo(c);
  if (e && !i) {
    let d = !1;
    const l = [], u = {}, f = (S) => {
      const L = eo(S), I = Lt(_a);
      return I ? I(L, !0) : L;
    }, _ = se({}, r(), f(e)), [m, p, w] = Nn(), [R, g, C] = Nn(n), D = (S, L) => {
      C(S, L), w(S, L);
    }, [O, x, $, M, z] = Ta(t, _, () => d, ({ pn: S, Dt: L }, { Zt: I, tn: K }) => {
      const { ft: Y, Ct: ee, xt: Q, Ht: ne, Et: ae, dt: te } = I, { nn: _e, sn: k, en: V, cn: A } = K;
      D("updated", [E, {
        updateHints: {
          sizeChanged: !!Y,
          directionChanged: !!ee,
          heightIntrinsicChanged: !!Q,
          overflowEdgeChanged: !!_e,
          overflowAmountChanged: !!k,
          overflowStyleChanged: !!V,
          scrollCoordinatesChanged: !!A,
          contentMutation: !!ne,
          hostMutation: !!ae,
          appear: !!te
        },
        changedOptions: S || {},
        force: !!L
      }]);
    }, (S) => D("scroll", [E, S])), H = (S) => {
      da(c), Fe(l), d = !0, D("destroyed", [E, S]), p(), g();
    }, E = {
      options(S, L) {
        if (S) {
          const I = L ? r() : {}, K = po(_, se(I, f(S)));
          Zn(K) || (se(_, K), x({
            pn: K
          }));
        }
        return se({}, _);
      },
      on: R,
      off: (S, L) => {
        S && L && g(S, L);
      },
      state() {
        const { gn: S, bn: L } = $(), { ct: I } = S, { Vt: K, Rt: Y, K: ee, rn: Q, ln: ne, dn: ae, Lt: te } = L;
        return se({}, {
          overflowEdge: K,
          overflowAmount: Y,
          overflowStyle: ee,
          hasOverflow: Q,
          scrollCoordinates: {
            start: te.D,
            end: te.M
          },
          padding: ne,
          paddingAbsolute: ae,
          directionRTL: I,
          destroyed: d
        });
      },
      elements() {
        const { vt: S, ht: L, ln: I, ot: K, bt: Y, gt: ee, Qt: Q } = M.wn, { Xt: ne, Gt: ae } = M.yn, te = (k) => {
          const { Pt: V, Ut: A, Tt: T } = k;
          return {
            scrollbar: T,
            track: A,
            handle: V
          };
        }, _e = (k) => {
          const { Yt: V, Wt: A } = k, T = te(V[0]);
          return se({}, T, {
            clone: () => {
              const y = te(A());
              return x({
                hn: !0
              }), y;
            }
          });
        };
        return se({}, {
          target: S,
          host: L,
          padding: I || K,
          viewport: K,
          content: Y || K,
          scrollOffsetElement: ee,
          scrollEventElement: Q,
          scrollbarHorizontal: _e(ne),
          scrollbarVertical: _e(ae)
        });
      },
      update: (S) => x({
        Dt: S,
        At: !0
      }),
      destroy: G(H, !1),
      plugin: (S) => u[He(S)[0]]
    };
    return pe(l, [z]), ca(c, E), Co(So, je, [E, m, u]), ia(M.wn.wt, !s && t.cancel) ? (H(!0), E) : (pe(l, O()), D("initialized", [E]), E.update(), E);
  }
  return i;
};
je.plugin = (t) => {
  const e = qe(t), n = e ? t : [t], r = n.map((s) => Co(s, je)[0]);
  return va(n), e ? r : r[0];
};
je.valid = (t) => {
  const e = t && t.elements, n = Be(e) && e();
  return nn(n) && !!xo(n.target);
};
je.env = () => {
  const { T: t, k: e, R: n, V: r, B: s, F: c, U: i, P: d, N: l, q: u } = Ge();
  return se({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: e,
    scrollbarsHiding: n,
    scrollTimeline: r,
    staticDefaultInitialization: s,
    staticDefaultOptions: c,
    getDefaultInitialization: i,
    setDefaultInitialization: d,
    getDefaultOptions: l,
    setDefaultOptions: u
  });
};
je.nonce = ra;
function Aa() {
  let t;
  const e = F(null), n = Math.floor(Math.random() * 2 ** 32), r = F(!1), s = F([]), c = () => s.value, i = () => t.getSelection(), d = () => s.value.length, l = () => t.clearSelection(!0), u = F(), f = F(null), _ = F(null), m = F(null), p = F(null);
  function w() {
    t = new vr({
      area: e.value,
      keyboardDrag: !1,
      selectedClass: "vf-explorer-selected",
      selectorClass: "vf-explorer-selector"
    }), t.subscribe("DS:start:pre", ({ items: $, event: M, isDragging: z }) => {
      if (z)
        t.Interaction._reset(M);
      else {
        r.value = !1;
        const H = e.value.offsetWidth - M.offsetX, E = e.value.offsetHeight - M.offsetY;
        H < 15 && E < 15 && t.Interaction._reset(M), M.target.classList.contains("os-scrollbar-handle") && t.Interaction._reset(M);
      }
    }), document.addEventListener("dragleave", ($) => {
      !$.buttons && r.value && (r.value = !1);
    });
  }
  const R = () => ct(() => {
    t.addSelection(
      t.getSelectables()
    ), g();
  }), g = () => {
    s.value = t.getSelection().map(($) => JSON.parse($.dataset.item)), u.value(s.value);
  }, C = () => ct(() => {
    const $ = c().map((M) => M.path);
    l(), t.setSettings({
      selectables: document.getElementsByClassName("vf-item-" + n)
    }), t.addSelection(
      t.getSelectables().filter((M) => $.includes(JSON.parse(M.dataset.item).path))
    ), g(), O();
  }), D = ($) => {
    u.value = $, t.subscribe("DS:end", ({ items: M, event: z, isDragging: H }) => {
      s.value = M.map((E) => JSON.parse(E.dataset.item)), $(M.map((E) => JSON.parse(E.dataset.item)));
    });
  }, O = () => {
    f.value && (e.value.getBoundingClientRect().height < e.value.scrollHeight ? (_.value.style.height = e.value.scrollHeight + "px", _.value.style.display = "block") : (_.value.style.height = "100%", _.value.style.display = "none"));
  }, x = ($) => {
    if (!f.value)
      return;
    const { scrollOffsetElement: M } = f.value.elements();
    M.scrollTo(
      {
        top: e.value.scrollTop,
        left: 0
      }
    );
  };
  return Se(() => {
    je(m.value, {
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
      initialized: ($) => {
        f.value = $;
      },
      scroll: ($, M) => {
        const { scrollOffsetElement: z } = $.elements();
        e.value.scrollTo({
          top: z.scrollTop,
          left: 0
        });
      }
    }), w(), O(), p.value = new ResizeObserver(O), p.value.observe(e.value), e.value.addEventListener("scroll", x), t.subscribe("DS:scroll", ({ isDragging: $ }) => $ || x());
  }), Gn(() => {
    t && t.stop(), p.value && p.value.disconnect();
  }), Ls(() => {
    t && t.Area.reset();
  }), {
    area: e,
    explorerId: n,
    isDraggingRef: r,
    scrollBar: _,
    scrollBarContainer: m,
    getSelected: c,
    getSelection: i,
    selectAll: R,
    clearSelection: l,
    refreshSelection: C,
    getCount: d,
    onSelect: D
  };
}
function Da(t, e) {
  const n = F(t), r = F(e), s = F([]), c = F([]), i = F([]), d = F(!1), l = F(5);
  let u = !1, f = !1;
  const _ = yt({
    adapter: n,
    storages: [],
    dirname: r,
    files: []
  });
  function m() {
    let D = [], O = [], x = r.value ?? n.value + "://";
    x.length === 0 && (s.value = []), x.replace(n.value + "://", "").split("/").forEach(function(z) {
      D.push(z), D.join("/") !== "" && O.push({
        basename: z,
        name: z,
        path: n.value + "://" + D.join("/"),
        type: "dir"
      });
    }), c.value = O;
    const [$, M] = w(O, l.value);
    i.value = M, s.value = $;
  }
  function p(D) {
    l.value = D, m();
  }
  function w(D, O) {
    return D.length > O ? [D.slice(-O), D.slice(0, -O)] : [D, []];
  }
  function R(D = null) {
    d.value = D ?? !d.value;
  }
  function g() {
    return s.value && s.value.length && !f;
  }
  const C = rt(() => {
    var D;
    return ((D = s.value[s.value.length - 2]) == null ? void 0 : D.path) ?? n.value + "://";
  });
  return Se(() => {
  }), Te(r, m), Se(m), {
    adapter: n,
    path: r,
    loading: u,
    searchMode: f,
    data: _,
    breadcrumbs: s,
    breadcrumbItems: c,
    limitBreadcrumbItems: p,
    hiddenBreadcrumbs: i,
    showHiddenBreadcrumbs: d,
    toggleHiddenBreadcrumbs: R,
    isGoUpAvailable: g,
    parentFolderPath: C
  };
}
const Ma = (t, e) => {
  const n = br(t.id), r = ur(), s = n.getStore("metricUnits", !1), c = $r(n, t.theme), i = e.i18n, d = t.locale ?? e.locale, l = n.getStore("adapter"), u = (m) => Array.isArray(m) ? m : kr, f = n.getStore("persist-path", t.persist), _ = f ? n.getStore("path", t.path) : t.path;
  return yt({
    /** 
    * Core properties
    * */
    // app version
    version: xr,
    // root element
    root: null,
    // app id
    debug: t.debug,
    // Event Bus
    emitter: r,
    // storage
    storage: n,
    // localization object
    i18n: yr(n, d, r, i),
    // modal state
    modal: Cr(),
    // dragSelect object, it is responsible for selecting items
    dragSelect: rt(() => Aa()),
    // http object
    requester: gr(t.request),
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
    filesize: s ? Is : Hs,
    // show large icons in list view
    compactListView: n.getStore("compact-list-view", !0),
    // persist state
    persist: f,
    // show thumbnails
    showThumbnails: n.getStore("show-thumbnails", t.showThumbnails),
    // file system
    fs: Da(l, _)
  });
}, Oa = { class: "vuefinder__modal-layout__container" }, Va = { class: "vuefinder__modal-layout__content" }, La = { class: "vuefinder__modal-layout__footer" }, Ke = {
  __name: "ModalLayout",
  setup(t) {
    const e = F(null), n = re("ServiceContainer");
    return Se(() => {
      const r = document.querySelector(".v-f-modal input");
      r && r.focus(), ct(() => {
        if (document.querySelector(".v-f-modal input") && window.innerWidth < 768) {
          const s = e.value.getBoundingClientRect().bottom + 16;
          window.scrollTo({
            top: s,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    }), (r, s) => (v(), h("div", {
      class: "vuefinder__modal-layout",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: s[1] || (s[1] = kt((c) => o(n).modal.close(), ["esc"])),
      tabindex: "0"
    }, [
      s[2] || (s[2] = a("div", { class: "vuefinder__modal-layout__overlay" }, null, -1)),
      a("div", Oa, [
        a("div", {
          class: "vuefinder__modal-layout__wrapper",
          onMousedown: s[0] || (s[0] = st((c) => o(n).modal.close(), ["self"]))
        }, [
          a("div", {
            ref_key: "modalBody",
            ref: e,
            class: "vuefinder__modal-layout__body"
          }, [
            a("div", Va, [
              At(r.$slots, "default")
            ]),
            a("div", La, [
              At(r.$slots, "buttons")
            ])
          ], 512)
        ], 32)
      ])
    ], 32));
  }
}, Ao = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, s] of e)
    n[r] = s;
  return n;
}, Fa = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(t, { emit: e, slots: n }) {
    const r = re("ServiceContainer"), s = F(!1), { t: c } = r.i18n;
    let i = null;
    const d = () => {
      clearTimeout(i), s.value = !0, i = setTimeout(() => {
        s.value = !1;
      }, 2e3);
    };
    return Se(() => {
      r.emitter.on(t.on, d);
    }), Gn(() => {
      clearTimeout(i);
    }), {
      shown: s,
      t: c
    };
  }
}, Ra = { key: 1 };
function Ba(t, e, n, r, s, c) {
  return v(), h("div", {
    class: oe(["vuefinder__action-message", { "vuefinder__action-message--hidden": !r.shown }])
  }, [
    t.$slots.default ? At(t.$slots, "default", { key: 0 }) : (v(), h("span", Ra, b(r.t("Saved.")), 1))
  ], 2);
}
const _t = /* @__PURE__ */ Ao(Fa, [["render", Ba]]), Ha = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function Ia(t, e) {
  return v(), h("svg", Ha, e[0] || (e[0] = [
    a("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87q.11.06.22.127c.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a8 8 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124q.108-.066.22-.128c.332-.183.582-.495.644-.869z"
    }, null, -1),
    a("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
    }, null, -1)
  ]));
}
const Ua = { render: Ia }, Na = { class: "vuefinder__modal-header" }, Pa = { class: "vuefinder__modal-header__icon-container" }, za = {
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
    return (e, n) => (v(), h("div", Na, [
      a("div", Pa, [
        (v(), j(Fs(t.icon), { class: "vuefinder__modal-header__icon" }))
      ]),
      a("h3", za, b(t.title), 1)
    ]));
  }
}, qa = { class: "vuefinder__about-modal__content" }, ja = { class: "vuefinder__about-modal__main" }, Ga = {
  class: "vuefinder__about-modal__tabs",
  "aria-label": "Tabs"
}, Ka = ["onClick", "aria-current"], Wa = {
  key: 0,
  class: "vuefinder__about-modal__tab-content"
}, Ya = { class: "vuefinder__about-modal__description" }, Xa = {
  href: "https://vuefinder.ozdemir.be",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, Ja = {
  href: "https://github.com/n1crack/vuefinder",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, Za = {
  key: 1,
  class: "vuefinder__about-modal__tab-content"
}, Qa = { class: "vuefinder__about-modal__description" }, el = { class: "vuefinder__about-modal__settings" }, tl = { class: "vuefinder__about-modal__setting flex" }, nl = { class: "vuefinder__about-modal__setting-input" }, sl = { class: "vuefinder__about-modal__setting-label" }, ol = {
  for: "metric_unit",
  class: "vuefinder__about-modal__label"
}, rl = { class: "vuefinder__about-modal__setting flex" }, al = { class: "vuefinder__about-modal__setting-input" }, ll = { class: "vuefinder__about-modal__setting-label" }, il = {
  for: "large_icons",
  class: "vuefinder__about-modal__label"
}, cl = { class: "vuefinder__about-modal__setting flex" }, dl = { class: "vuefinder__about-modal__setting-input" }, ul = { class: "vuefinder__about-modal__setting-label" }, vl = {
  for: "persist_path",
  class: "vuefinder__about-modal__label"
}, _l = { class: "vuefinder__about-modal__setting flex" }, fl = { class: "vuefinder__about-modal__setting-input" }, ml = { class: "vuefinder__about-modal__setting-label" }, pl = {
  for: "show_thumbnails",
  class: "vuefinder__about-modal__label"
}, hl = { class: "vuefinder__about-modal__setting" }, gl = { class: "vuefinder__about-modal__setting-input" }, bl = {
  for: "theme",
  class: "vuefinder__about-modal__label"
}, wl = { class: "vuefinder__about-modal__setting-label" }, yl = ["label"], kl = ["value"], xl = {
  key: 0,
  class: "vuefinder__about-modal__setting"
}, Sl = { class: "vuefinder__about-modal__setting-input" }, $l = {
  for: "language",
  class: "vuefinder__about-modal__label"
}, Cl = { class: "vuefinder__about-modal__setting-label" }, El = ["label"], Tl = ["value"], Al = {
  key: 2,
  class: "vuefinder__about-modal__tab-content"
}, Dl = { class: "vuefinder__about-modal__shortcuts" }, Ml = { class: "vuefinder__about-modal__shortcut" }, Ol = { class: "vuefinder__about-modal__shortcut" }, Vl = { class: "vuefinder__about-modal__shortcut" }, Ll = { class: "vuefinder__about-modal__shortcut" }, Fl = { class: "vuefinder__about-modal__shortcut" }, Rl = { class: "vuefinder__about-modal__shortcut" }, Bl = { class: "vuefinder__about-modal__shortcut" }, Hl = { class: "vuefinder__about-modal__shortcut" }, Il = { class: "vuefinder__about-modal__shortcut" }, Ul = {
  key: 3,
  class: "vuefinder__about-modal__tab-content"
}, Nl = { class: "vuefinder__about-modal__description" }, Do = {
  __name: "ModalAbout",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n, clearStore: r } = e.storage, { t: s } = e.i18n, c = {
      ABOUT: "about",
      SETTINGS: "settings",
      SHORTCUTS: "shortcuts",
      RESET: "reset"
    }, i = rt(() => [
      { name: s("About"), key: c.ABOUT },
      { name: s("Settings"), key: c.SETTINGS },
      { name: s("Shortcuts"), key: c.SHORTCUTS },
      { name: s("Reset"), key: c.RESET }
    ]), d = F("about"), l = async () => {
      r(), location.reload();
    }, u = (D) => {
      e.theme.set(D), e.emitter.emit("vf-theme-saved");
    }, f = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? Is : Hs, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, _ = () => {
      e.compactListView = !e.compactListView, n("compactListView", e.compactListView), e.emitter.emit("vf-compact-view-saved");
    }, m = () => {
      e.showThumbnails = !e.showThumbnails, n("show-thumbnails", e.showThumbnails), e.emitter.emit("vf-show-thumbnails-saved");
    }, p = () => {
      e.persist = !e.persist, n("persist-path", e.persist), e.emitter.emit("vf-persist-path-saved");
    }, { i18n: w } = re("VueFinderOptions"), g = Object.fromEntries(
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
      }).filter(([D]) => Object.keys(w).includes(D))
    ), C = rt(() => ({
      system: s("System"),
      light: s("Light"),
      dark: s("Dark")
    }));
    return (D, O) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          onClick: O[7] || (O[7] = (x) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(s)("Close")), 1)
      ]),
      default: J(() => [
        a("div", qa, [
          P(Qe, {
            icon: o(Ua),
            title: "Vuefinder " + o(e).version
          }, null, 8, ["icon", "title"]),
          a("div", ja, [
            a("div", null, [
              a("div", null, [
                a("nav", Ga, [
                  (v(!0), h(ge, null, ye(i.value, (x) => (v(), h("button", {
                    key: x.name,
                    onClick: ($) => d.value = x.key,
                    class: oe([x.key === d.value ? "vuefinder__about-modal__tab--active" : "vuefinder__about-modal__tab--inactive", "vuefinder__about-modal__tab"]),
                    "aria-current": x.current ? "page" : void 0
                  }, b(x.name), 11, Ka))), 128))
                ])
              ])
            ]),
            d.value === c.ABOUT ? (v(), h("div", Wa, [
              a("div", Ya, b(o(s)("Vuefinder is a simple, lightweight, and fast file manager library for Vue.js applications")), 1),
              a("a", Xa, b(o(s)("Project home")), 1),
              a("a", Ja, b(o(s)("Follow on GitHub")), 1)
            ])) : N("", !0),
            d.value === c.SETTINGS ? (v(), h("div", Za, [
              a("div", Qa, b(o(s)("Customize your experience with the following settings")), 1),
              a("div", el, [
                a("fieldset", null, [
                  a("div", tl, [
                    a("div", nl, [
                      de(a("input", {
                        id: "metric_unit",
                        name: "metric_unit",
                        type: "checkbox",
                        "onUpdate:modelValue": O[0] || (O[0] = (x) => o(e).metricUnits = x),
                        onClick: f,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).metricUnits]
                      ])
                    ]),
                    a("div", sl, [
                      a("label", ol, [
                        W(b(o(s)("Use Metric Units")) + " ", 1),
                        P(_t, {
                          class: "ms-3",
                          on: "vf-metric-units-saved"
                        }, {
                          default: J(() => [
                            W(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  a("div", rl, [
                    a("div", al, [
                      de(a("input", {
                        id: "large_icons",
                        name: "large_icons",
                        type: "checkbox",
                        "onUpdate:modelValue": O[1] || (O[1] = (x) => o(e).compactListView = x),
                        onClick: _,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).compactListView]
                      ])
                    ]),
                    a("div", ll, [
                      a("label", il, [
                        W(b(o(s)("Compact list view")) + " ", 1),
                        P(_t, {
                          class: "ms-3",
                          on: "vf-compact-view-saved"
                        }, {
                          default: J(() => [
                            W(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  a("div", cl, [
                    a("div", dl, [
                      de(a("input", {
                        id: "persist_path",
                        name: "persist_path",
                        type: "checkbox",
                        "onUpdate:modelValue": O[2] || (O[2] = (x) => o(e).persist = x),
                        onClick: p,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).persist]
                      ])
                    ]),
                    a("div", ul, [
                      a("label", vl, [
                        W(b(o(s)("Persist path on reload")) + " ", 1),
                        P(_t, {
                          class: "ms-3",
                          on: "vf-persist-path-saved"
                        }, {
                          default: J(() => [
                            W(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  a("div", _l, [
                    a("div", fl, [
                      de(a("input", {
                        id: "show_thumbnails",
                        name: "show_thumbnails",
                        type: "checkbox",
                        "onUpdate:modelValue": O[3] || (O[3] = (x) => o(e).showThumbnails = x),
                        onClick: m,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).showThumbnails]
                      ])
                    ]),
                    a("div", ml, [
                      a("label", pl, [
                        W(b(o(s)("Show thumbnails")) + " ", 1),
                        P(_t, {
                          class: "ms-3",
                          on: "vf-show-thumbnails-saved"
                        }, {
                          default: J(() => [
                            W(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  a("div", hl, [
                    a("div", gl, [
                      a("label", bl, b(o(s)("Theme")), 1)
                    ]),
                    a("div", wl, [
                      de(a("select", {
                        id: "theme",
                        "onUpdate:modelValue": O[4] || (O[4] = (x) => o(e).theme.value = x),
                        onChange: O[5] || (O[5] = (x) => u(x.target.value)),
                        class: "vuefinder__about-modal__select"
                      }, [
                        a("optgroup", {
                          label: o(s)("Theme")
                        }, [
                          (v(!0), h(ge, null, ye(C.value, (x, $) => (v(), h("option", { value: $ }, b(x), 9, kl))), 256))
                        ], 8, yl)
                      ], 544), [
                        [Jt, o(e).theme.value]
                      ]),
                      P(_t, {
                        class: "ms-3",
                        on: "vf-theme-saved"
                      }, {
                        default: J(() => [
                          W(b(o(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  o(e).features.includes(o(ce).LANGUAGE) && Object.keys(o(g)).length > 1 ? (v(), h("div", xl, [
                    a("div", Sl, [
                      a("label", $l, b(o(s)("Language")), 1)
                    ]),
                    a("div", Cl, [
                      de(a("select", {
                        id: "language",
                        "onUpdate:modelValue": O[6] || (O[6] = (x) => o(e).i18n.locale = x),
                        class: "vuefinder__about-modal__select"
                      }, [
                        a("optgroup", {
                          label: o(s)("Language")
                        }, [
                          (v(!0), h(ge, null, ye(o(g), (x, $) => (v(), h("option", { value: $ }, b(x), 9, Tl))), 256))
                        ], 8, El)
                      ], 512), [
                        [Jt, o(e).i18n.locale]
                      ]),
                      P(_t, {
                        class: "ms-3",
                        on: "vf-language-saved"
                      }, {
                        default: J(() => [
                          W(b(o(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ])) : N("", !0)
                ])
              ])
            ])) : N("", !0),
            d.value === c.SHORTCUTS ? (v(), h("div", Al, [
              a("div", Dl, [
                a("div", Ml, [
                  a("div", null, b(o(s)("Rename")), 1),
                  O[8] || (O[8] = a("kbd", null, "F2", -1))
                ]),
                a("div", Ol, [
                  a("div", null, b(o(s)("Refresh")), 1),
                  O[9] || (O[9] = a("kbd", null, "F5", -1))
                ]),
                a("div", Vl, [
                  W(b(o(s)("Delete")) + " ", 1),
                  O[10] || (O[10] = a("kbd", null, "Del", -1))
                ]),
                a("div", Ll, [
                  W(b(o(s)("Escape")) + " ", 1),
                  O[11] || (O[11] = a("div", null, [
                    a("kbd", null, "Esc")
                  ], -1))
                ]),
                a("div", Fl, [
                  W(b(o(s)("Select All")) + " ", 1),
                  O[12] || (O[12] = a("div", null, [
                    a("kbd", null, "Ctrl"),
                    W(" + "),
                    a("kbd", null, "A")
                  ], -1))
                ]),
                a("div", Rl, [
                  W(b(o(s)("Search")) + " ", 1),
                  O[13] || (O[13] = a("div", null, [
                    a("kbd", null, "Ctrl"),
                    W(" + "),
                    a("kbd", null, "F")
                  ], -1))
                ]),
                a("div", Bl, [
                  W(b(o(s)("Toggle Sidebar")) + " ", 1),
                  O[14] || (O[14] = a("div", null, [
                    a("kbd", null, "Ctrl"),
                    W(" + "),
                    a("kbd", null, "E")
                  ], -1))
                ]),
                a("div", Hl, [
                  W(b(o(s)("Open Settings")) + " ", 1),
                  O[15] || (O[15] = a("div", null, [
                    a("kbd", null, "Ctrl"),
                    W(" + "),
                    a("kbd", null, ",")
                  ], -1))
                ]),
                a("div", Il, [
                  W(b(o(s)("Toggle Full Screen")) + " ", 1),
                  O[16] || (O[16] = a("div", null, [
                    a("kbd", null, "Ctrl"),
                    W(" + "),
                    a("kbd", null, "Enter")
                  ], -1))
                ])
              ])
            ])) : N("", !0),
            d.value === c.RESET ? (v(), h("div", Ul, [
              a("div", Nl, b(o(s)("Reset all settings to default")), 1),
              a("button", {
                onClick: l,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(s)("Reset Settings")), 1)
            ])) : N("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Pl = ["title"], We = {
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
    const n = e, r = re("ServiceContainer"), { t: s } = r.i18n, c = F(!1), i = F(null), d = F((u = i.value) == null ? void 0 : u.strMessage);
    Te(d, () => c.value = !1);
    const l = () => {
      n("hidden"), c.value = !0;
    };
    return (f, _) => (v(), h("div", null, [
      c.value ? N("", !0) : (v(), h("div", {
        key: 0,
        ref_key: "strMessage",
        ref: i,
        class: oe(["vuefinder__message", t.error ? "vuefinder__message--error" : "vuefinder__message--success"])
      }, [
        At(f.$slots, "default"),
        a("div", {
          class: "vuefinder__message__close",
          onClick: l,
          title: o(s)("Close")
        }, _[0] || (_[0] = [
          a("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            stroke: "currentColor",
            class: "vuefinder__message__icon"
          }, [
            a("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M6 18L18 6M6 6l12 12"
            })
          ], -1)
        ]), 8, Pl)
      ], 2))
    ]));
  }
}, zl = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function ql(t, e) {
  return v(), h("svg", zl, e[0] || (e[0] = [
    a("path", { d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" }, null, -1)
  ]));
}
const Mo = { render: ql }, jl = { class: "vuefinder__delete-modal__content" }, Gl = { class: "vuefinder__delete-modal__form" }, Kl = { class: "vuefinder__delete-modal__description" }, Wl = { class: "vuefinder__delete-modal__files vf-scrollbar" }, Yl = { class: "vuefinder__delete-modal__file" }, Xl = {
  key: 0,
  class: "vuefinder__delete-modal__icon vuefinder__delete-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Jl = {
  key: 1,
  class: "vuefinder__delete-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Zl = { class: "vuefinder__delete-modal__file-name" }, Ql = { class: "vuefinder__delete-modal__warning" }, ls = {
  __name: "ModalDelete",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = F(e.modal.data.items), s = F(""), c = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: r.value.map(({ path: i, type: d }) => ({ path: i, type: d }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files deleted.") });
        },
        onError: (i) => {
          s.value = n(i.message);
        }
      });
    };
    return (i, d) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-danger"
        }, b(o(n)("Yes, Delete!")), 1),
        a("button", {
          type: "button",
          onClick: d[1] || (d[1] = (l) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1),
        a("div", Ql, b(o(n)("This action cannot be undone.")), 1)
      ]),
      default: J(() => [
        a("div", null, [
          P(Qe, {
            icon: o(Mo),
            title: o(n)("Delete files")
          }, null, 8, ["icon", "title"]),
          a("div", jl, [
            a("div", Gl, [
              a("p", Kl, b(o(n)("Are you sure you want to delete these files?")), 1),
              a("div", Wl, [
                (v(!0), h(ge, null, ye(r.value, (l) => (v(), h("p", Yl, [
                  l.type === "dir" ? (v(), h("svg", Xl, d[2] || (d[2] = [
                    a("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (v(), h("svg", Jl, d[3] || (d[3] = [
                    a("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  a("span", Zl, b(l.basename), 1)
                ]))), 256))
              ]),
              s.value.length ? (v(), j(We, {
                key: 0,
                onHidden: d[0] || (d[0] = (l) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  W(b(s.value), 1)
                ]),
                _: 1
              })) : N("", !0)
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
  return v(), h("svg", ei, e[0] || (e[0] = [
    a("path", { d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }, null, -1)
  ]));
}
const Oo = { render: ti }, ni = { class: "vuefinder__rename-modal__content" }, si = { class: "vuefinder__rename-modal__item" }, oi = { class: "vuefinder__rename-modal__item-info" }, ri = {
  key: 0,
  class: "vuefinder__rename-modal__icon vuefinder__rename-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ai = {
  key: 1,
  class: "vuefinder__rename-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, li = { class: "vuefinder__rename-modal__item-name" }, an = {
  __name: "ModalRename",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = F(e.modal.data.items[0]), s = F(e.modal.data.items[0].basename), c = F(""), i = () => {
      s.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: r.value.path,
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
    return (d, l) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Rename")), 1),
        a("button", {
          type: "button",
          onClick: l[2] || (l[2] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        a("div", null, [
          P(Qe, {
            icon: o(Oo),
            title: o(n)("Rename")
          }, null, 8, ["icon", "title"]),
          a("div", ni, [
            a("div", si, [
              a("p", oi, [
                r.value.type === "dir" ? (v(), h("svg", ri, l[3] || (l[3] = [
                  a("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (v(), h("svg", ai, l[4] || (l[4] = [
                  a("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                a("span", li, b(r.value.basename), 1)
              ]),
              de(a("input", {
                "onUpdate:modelValue": l[0] || (l[0] = (u) => s.value = u),
                onKeyup: kt(i, ["enter"]),
                class: "vuefinder__rename-modal__input",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [xt, s.value]
              ]),
              c.value.length ? (v(), j(We, {
                key: 0,
                onHidden: l[1] || (l[1] = (u) => c.value = ""),
                error: ""
              }, {
                default: J(() => [
                  W(b(c.value), 1)
                ]),
                _: 1
              })) : N("", !0)
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
    n.code === Ye.ESCAPE && (t.modal.close(), t.root.focus()), !t.modal.visible && (t.fs.searchMode || (n.code === Ye.F2 && t.features.includes(ce.RENAME) && (t.dragSelect.getCount() !== 1 || t.modal.open(an, { items: t.dragSelect.getSelected() })), n.code === Ye.F5 && t.emitter.emit("vf-fetch", { params: { q: "index", adapter: t.fs.adapter, path: t.fs.data.dirname } }), n.code === Ye.DELETE && (!t.dragSelect.getCount() || t.modal.open(ls, { items: t.dragSelect.getSelected() })), n.metaKey && n.code === Ye.BACKSLASH && t.modal.open(Do), n.metaKey && n.code === Ye.KEY_F && t.features.includes(ce.SEARCH) && (t.fs.searchMode = !0, n.preventDefault()), n.metaKey && n.code === Ye.KEY_E && (t.showTreeView = !t.showTreeView, t.storage.setStore("show-tree-view", t.showTreeView)), n.metaKey && n.code === Ye.ENTER && (t.fullScreen = !t.fullScreen, t.root.focus()), n.metaKey && n.code === Ye.KEY_A && (t.dragSelect.selectAll(), n.preventDefault())));
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
  return v(), h("svg", ci, e[0] || (e[0] = [
    a("path", { d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" }, null, -1)
  ]));
}
const Vo = { render: di }, ui = { class: "vuefinder__new-folder-modal__content" }, vi = { class: "vuefinder__new-folder-modal__form" }, _i = { class: "vuefinder__new-folder-modal__description" }, fi = ["placeholder"], Lo = {
  __name: "ModalNewFolder",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, r = F(""), s = F(""), c = () => {
      r.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", r.value) });
        },
        onError: (i) => {
          s.value = n(i.message);
        }
      });
    };
    return (i, d) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        a("button", {
          type: "button",
          onClick: d[2] || (d[2] = (l) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        a("div", null, [
          P(Qe, {
            icon: o(Vo),
            title: o(n)("New Folder")
          }, null, 8, ["icon", "title"]),
          a("div", ui, [
            a("div", vi, [
              a("p", _i, b(o(n)("Create a new folder")), 1),
              de(a("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (l) => r.value = l),
                onKeyup: kt(c, ["enter"]),
                class: "vuefinder__new-folder-modal__input",
                placeholder: o(n)("Folder Name"),
                type: "text"
              }, null, 40, fi), [
                [xt, r.value]
              ]),
              s.value.length ? (v(), j(We, {
                key: 0,
                onHidden: d[1] || (d[1] = (l) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  W(b(s.value), 1)
                ]),
                _: 1
              })) : N("", !0)
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
  return v(), h("svg", mi, e[0] || (e[0] = [
    a("path", { d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9" }, null, -1)
  ]));
}
const Fo = { render: pi }, hi = { class: "vuefinder__new-file-modal__content" }, gi = { class: "vuefinder__new-file-modal__form" }, bi = { class: "vuefinder__new-file-modal__description" }, wi = ["placeholder"], yi = {
  __name: "ModalNewFile",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, r = F(""), s = F(""), c = () => {
      r.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", r.value) });
        },
        onError: (i) => {
          s.value = n(i.message);
        }
      });
    };
    return (i, d) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        a("button", {
          type: "button",
          onClick: d[2] || (d[2] = (l) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        a("div", null, [
          P(Qe, {
            icon: o(Fo),
            title: o(n)("New File")
          }, null, 8, ["icon", "title"]),
          a("div", hi, [
            a("div", gi, [
              a("p", bi, b(o(n)("Create a new file")), 1),
              de(a("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (l) => r.value = l),
                onKeyup: kt(c, ["enter"]),
                class: "vuefinder__new-file-modal__input",
                placeholder: o(n)("File Name"),
                type: "text"
              }, null, 40, wi), [
                [xt, r.value]
              ]),
              s.value.length ? (v(), j(We, {
                key: 0,
                onHidden: d[1] || (d[1] = (l) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  W(b(s.value), 1)
                ]),
                _: 1
              })) : N("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
};
function qn(t, e = 14) {
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
  return v(), h("svg", ki, e[0] || (e[0] = [
    a("path", { d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }, null, -1)
  ]));
}
const Ro = { render: xi }, Si = { class: "vuefinder__upload-modal__content" }, $i = { value: "" }, Ci = ["value"], Ei = {
  key: 0,
  class: "pointer-events-none"
}, Ti = {
  key: 1,
  class: "pointer-events-none"
}, Ai = ["disabled"], Di = ["disabled"], Mi = { class: "vuefinder__upload-modal__file-list vf-scrollbar" }, Oi = ["textContent"], Vi = { class: "vuefinder__upload-modal__file-info" }, Li = { class: "vuefinder__upload-modal__file-name hidden md:block" }, Fi = { class: "vuefinder__upload-modal__file-name md:hidden" }, Ri = {
  key: 0,
  class: "ml-auto"
}, Bi = ["title", "disabled", "onClick"], Hi = {
  key: 0,
  class: "py-2"
}, Ii = ["disabled"], Ui = {
  __name: "ModalUpload",
  setup(t, { expose: e }) {
    let n = "Default";
    const r = re("ServiceContainer"), { t: s } = r.i18n, c = F({
      prefix: "",
      // Optional prefix for all files
      suffix: "",
      // Optional suffix for all files
      dateFormat: "YYYY-MM-DD",
      // Date format for timestamp
      includeTimestamp: !0,
      // Whether to include timestamp
      customFormatter: null
      // Optional custom formatting function
    }), i = (k) => {
      c.value.includeTimestamp && (/* @__PURE__ */ new Date()).toISOString().split("T")[0] + "", k.substring(0, k.lastIndexOf("."));
      const V = k.substring(k.lastIndexOf("."));
      return c.value.customFormatter ? c.value.customFormatter(k) : `${n}${c.value.suffix}${V}`;
    }, d = s("uppy"), l = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, u = F({ QUEUE_ENTRY_STATUS: l }), f = F(null), _ = F(null), m = F(null), p = F(null), w = F(null), R = F(null), g = F([]), C = F(""), D = F(!1), O = F(!1), x = F([]), $ = F("");
    let M;
    function z(k, V = null) {
      const A = V || k.webkitRelativePath || k.name, T = i(A);
      M.addFile({
        name: T,
        type: k.type,
        data: k,
        source: "Local"
      });
    }
    async function H() {
      try {
        const A = btoa("noblecoder:Admin100%"), y = await (await fetch("http://pmra.test/api/document-types", {
          method: "GET",
          headers: {
            Authorization: `Basic ${A}`
          }
        })).json();
        x.value = y.results;
      } catch (k) {
        console.error("Error fetching document types:", k), C.value = s("Error fetching document types. Please try again.");
      }
    }
    Te($, async (k) => {
      k && await E();
    });
    async function E() {
      try {
        const A = btoa("noblecoder:Admin100%");
        n = (await (await fetch(`http://pmra.test/api/generate-document-name?document_type=${$.value}`, {
          method: "GET",
          headers: {
            Authorization: `Basic ${A}`
          }
        })).json()).filename;
      } catch (k) {
        console.error("Error generating document name:", k), C.value = s("Error generating document name. Please try again.");
      }
    }
    function S(k) {
      return g.value.findIndex((V) => V.id === k);
    }
    function L(k) {
      switch (k.status) {
        case l.DONE:
          return "text-green-600";
        case l.ERROR:
          return "text-red-600";
        case l.CANCELED:
          return "text-red-600";
        case l.PENDING:
        default:
          return "";
      }
    }
    const I = (k) => {
      switch (k.status) {
        case l.DONE:
          return "✓";
        case l.ERROR:
        case l.CANCELED:
          return "!";
        case l.PENDING:
        default:
          return "...";
      }
    };
    function K() {
      p.value.click();
    }
    function Y() {
      if (!(D.value || !$.value)) {
        if (!g.value.filter((k) => k.status !== l.DONE).length) {
          C.value = s("Please select file to upload first.");
          return;
        }
        C.value = "", M.retryAll(), M.upload();
      }
    }
    function ee() {
      M.cancelAll({ reason: "user" }), g.value.forEach((k) => {
        k.status !== l.DONE && (k.status = l.CANCELED, k.statusName = s("Canceled"));
      }), D.value = !1;
    }
    function Q(k) {
      D.value || (M.removeFile(k.id, "removed-by-user"), g.value.splice(S(k.id), 1));
    }
    function ne(k) {
      if (!D.value) {
        if (M.cancelAll({ reason: "user" }), k) {
          const V = [];
          g.value.forEach((A) => {
            A.status !== l.DONE && V.push(A);
          }), g.value = [], V.forEach((A) => {
            z(A.originalFile, A.name);
          });
          return;
        }
        g.value.splice(0);
      }
    }
    function ae() {
      r.modal.close();
    }
    function te() {
      return r.requester.transformRequestParams({
        url: "",
        method: "post",
        params: {
          q: "upload",
          adapter: r.fs.adapter,
          path: r.fs.data.dirname,
          document_type: $.value
        }
      });
    }
    return Se(async () => {
      await H(), M = new _r({
        debug: r.debug,
        restrictions: {
          maxFileSize: Sr(r.maxFileSize)
        },
        locale: d,
        onBeforeFileAdded(T, y) {
          if (y[T.id] != null) {
            const U = S(T.id);
            g.value[U].status === l.PENDING && (C.value = M.i18n("noDuplicates", { fileName: T.name })), g.value = g.value.filter((q) => q.id !== T.id);
          }
          return g.value.push({
            id: T.id,
            name: T.name,
            size: r.filesize(T.size),
            status: l.PENDING,
            statusName: s("Pending upload"),
            percent: null,
            originalFile: T.data
          }), !0;
        }
      }), M.use(fr, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(T, y) {
          let B;
          try {
            B = JSON.parse(T).message;
          } catch {
            B = s("Cannot parse server response.");
          }
          return new Error(B);
        }
      }), (() => {
        M.on("restriction-failed", (T, y) => {
          const B = g.value[S(T.id)];
          Q(B), C.value = y.message;
        }), M.on("upload", () => {
          const T = te();
          M.setMeta({ ...T.body });
          const y = M.getPlugin("XHRUpload");
          y.opts.method = T.method, y.opts.endpoint = T.url + "?" + new URLSearchParams(T.params), y.opts.headers = T.headers, delete T.headers["Content-Type"], D.value = !0, g.value.forEach((B) => {
            B.status !== l.DONE && (B.percent = null, B.status = l.UPLOADING, B.statusName = s("Pending upload"));
          });
        }), M.on("upload-progress", (T, y) => {
          const B = Math.floor(y.bytesUploaded / y.bytesTotal * 100);
          g.value[S(T.id)].percent = `${B}%`;
        }), M.on("upload-success", (T) => {
          const y = g.value[S(T.id)];
          y.status = l.DONE, y.statusName = s("Done");
        }), M.on("upload-error", (T, y) => {
          const B = g.value[S(T.id)];
          B.percent = null, B.status = l.ERROR, y.isNetworkError ? B.statusName = s("Network Error, Unable establish connection to the server or interrupted.") : B.statusName = y ? y.message : s("Unknown Error");
        }), M.on("error", (T) => {
          C.value = T.message, D.value = !1, r.emitter.emit("vf-fetch", {
            params: { q: "index", adapter: r.fs.adapter, path: r.fs.data.dirname },
            noCloseModal: !0
          });
        }), M.on("complete", () => {
          D.value = !1, r.emitter.emit("vf-fetch", {
            params: { q: "index", adapter: r.fs.adapter, path: r.fs.data.dirname, document_type: $ },
            noCloseModal: !0
          });
        });
      })(), p.value.addEventListener("click", () => {
        _.value.click();
      }), w.value.addEventListener("click", () => {
        m.value.click();
      }), R.value.addEventListener("dragover", (T) => {
        T.preventDefault(), O.value = !0;
      }), R.value.addEventListener("dragleave", (T) => {
        T.preventDefault(), O.value = !1;
      });
      function V(T, y) {
        y.isFile && y.file((B) => T(y, B)), y.isDirectory && y.createReader().readEntries((B) => {
          B.forEach((U) => {
            V(T, U);
          });
        });
      }
      R.value.addEventListener("drop", (T) => {
        T.preventDefault(), O.value = !1;
        const y = /^[/\\](.+)/;
        [...T.dataTransfer.items].forEach((B) => {
          B.kind === "file" && V((U, q) => {
            const Z = y.exec(U.fullPath);
            Z && z(q, Z[1]);
          }, B.webkitGetAsEntry());
        });
      });
      const A = ({ target: T }) => {
        const y = T.files;
        for (const B of y)
          z(B);
        T.value = "";
      };
      _.value.addEventListener("change", A), m.value.addEventListener("change", A);
    }), Rs(() => {
      M == null || M.close({ reason: "unmount" });
    }), e({
      configureFileNaming: (k) => {
        c.value = {
          ...c.value,
          ...k
        };
      }
    }), (k, V) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          disabled: D.value || !$.value,
          onClick: st(Y, ["prevent"])
        }, b(o(s)("Upload")), 9, Ii),
        D.value ? (v(), h("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: st(ee, ["prevent"])
        }, b(o(s)("Cancel")), 1)) : (v(), h("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: st(ae, ["prevent"])
        }, b(o(s)("Close")), 1))
      ]),
      default: J(() => [
        a("div", null, [
          P(Qe, {
            icon: o(Ro),
            title: o(s)("Upload Files")
          }, null, 8, ["icon", "title"]),
          a("div", Si, [
            a("div", null, [
              de(a("select", {
                "onUpdate:modelValue": V[0] || (V[0] = (A) => $.value = A),
                name: "document_type",
                class: "vuefinder__upload-modal__document-type-select",
                style: { width: "100%", padding: "6px", "margin-bottom": "10px", "border-radius": "4px", "border-width": "2px", "border-style": "dashed", "border-color": "#e5e7eb" }
              }, [
                a("option", $i, b(o(s)("Select Document Type")), 1),
                (v(!0), h(ge, null, ye(x.value, (A) => (v(), h("option", {
                  key: A.id,
                  value: A.id
                }, b(A.label), 9, Ci))), 128))
              ], 512), [
                [Jt, $.value]
              ])
            ]),
            a("div", {
              class: oe({ hidden: !$.value })
            }, [
              a("div", {
                class: "vuefinder__upload-modal__drop-area",
                ref_key: "dropArea",
                ref: R,
                onClick: K
              }, [
                O.value ? (v(), h("div", Ei, b(o(s)("Release to drop these files.")), 1)) : (v(), h("div", Ti, b(o(s)("Drag and drop the files/folders to here or click here.")), 1))
              ], 512),
              a("div", {
                ref_key: "container",
                ref: f,
                class: "vuefinder__upload-modal__buttons"
              }, [
                a("button", {
                  ref_key: "pickFiles",
                  ref: p,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, b(o(s)("Select Files")), 513),
                a("button", {
                  ref_key: "pickFolders",
                  ref: w,
                  type: "button",
                  class: "vf-btn hidden vf-btn-secondary"
                }, b(o(s)("Select Folders")), 513),
                a("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary hidden",
                  disabled: D.value,
                  onClick: V[1] || (V[1] = (A) => ne(!1))
                }, b(o(s)("Clear all")), 9, Ai),
                a("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary hidden",
                  disabled: D.value,
                  onClick: V[2] || (V[2] = (A) => ne(!0))
                }, b(o(s)("Clear only successful")), 9, Di)
              ], 512)
            ], 2),
            a("div", {
              class: oe([{ hidden: $.value }, "text-center p-4 text-gray-500"])
            }, b(o(s)("Please select a document type to begin uploading")), 3),
            a("div", Mi, [
              (v(!0), h(ge, null, ye(g.value, (A) => (v(), h("div", {
                class: "vuefinder__upload-modal__file-entry",
                key: A.id
              }, [
                a("span", {
                  class: oe(["vuefinder__upload-modal__file-icon", L(A)])
                }, [
                  a("span", {
                    class: "vuefinder__upload-modal__file-icon-text",
                    textContent: b(I(A))
                  }, null, 8, Oi)
                ], 2),
                a("div", Vi, [
                  a("div", Li, b(o(qn)(A.name, 40)) + " (" + b(A.size) + ")", 1),
                  a("div", Fi, b(o(qn)(A.name, 16)) + " (" + b(A.size) + ")", 1),
                  a("div", {
                    class: oe(["vuefinder__upload-modal__file-status", L(A)])
                  }, [
                    W(b(A.statusName) + " ", 1),
                    A.status === u.value.QUEUE_ENTRY_STATUS.UPLOADING ? (v(), h("b", Ri, b(A.percent), 1)) : N("", !0)
                  ], 2)
                ]),
                a("button", {
                  type: "button",
                  class: oe(["vuefinder__upload-modal__file-remove", D.value ? "disabled" : ""]),
                  title: o(s)("Delete"),
                  disabled: D.value,
                  onClick: (T) => Q(A)
                }, V[4] || (V[4] = [
                  a("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    "stroke-width": "1.5",
                    stroke: "currentColor",
                    class: "vuefinder__upload-modal__file-remove-icon"
                  }, [
                    a("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M6 18L18 6M6 6l12 12"
                    })
                  ], -1)
                ]), 10, Bi)
              ]))), 128)),
              g.value.length ? N("", !0) : (v(), h("div", Hi, b(o(s)("No files selected!")), 1))
            ]),
            C.value.length ? (v(), j(We, {
              key: 0,
              onHidden: V[3] || (V[3] = (A) => C.value = ""),
              error: ""
            }, {
              default: J(() => [
                W(b(C.value), 1)
              ]),
              _: 1
            })) : N("", !0)
          ])
        ]),
        a("input", {
          ref_key: "internalFileInput",
          ref: _,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        a("input", {
          ref_key: "internalFolderInput",
          ref: m,
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
function Pi(t, e) {
  return v(), h("svg", Ni, e[0] || (e[0] = [
    a("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const Bo = { render: Pi }, zi = { class: "vuefinder__unarchive-modal__content" }, qi = { class: "vuefinder__unarchive-modal__items" }, ji = { class: "vuefinder__unarchive-modal__item" }, Gi = {
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
}, Wi = { class: "vuefinder__unarchive-modal__item-name" }, Yi = { class: "vuefinder__unarchive-modal__info" }, Ho = {
  __name: "ModalUnarchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = F(e.modal.data.items[0]), s = F(""), c = F([]), i = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: r.value.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file unarchived.") });
        },
        onError: (d) => {
          s.value = n(d.message);
        }
      });
    };
    return (d, l) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Unarchive")), 1),
        a("button", {
          type: "button",
          onClick: l[1] || (l[1] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        a("div", null, [
          P(Qe, {
            icon: o(Bo),
            title: o(n)("Unarchive")
          }, null, 8, ["icon", "title"]),
          a("div", zi, [
            a("div", qi, [
              (v(!0), h(ge, null, ye(c.value, (u) => (v(), h("p", ji, [
                u.type === "dir" ? (v(), h("svg", Gi, l[2] || (l[2] = [
                  a("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (v(), h("svg", Ki, l[3] || (l[3] = [
                  a("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                a("span", Wi, b(u.basename), 1)
              ]))), 256)),
              a("p", Yi, b(o(n)("The archive will be unarchived at")) + " (" + b(o(e).fs.data.dirname) + ")", 1),
              s.value.length ? (v(), j(We, {
                key: 0,
                onHidden: l[0] || (l[0] = (u) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  W(b(s.value), 1)
                ]),
                _: 1
              })) : N("", !0)
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
  return v(), h("svg", Xi, e[0] || (e[0] = [
    a("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const Io = { render: Ji }, Zi = { class: "vuefinder__archive-modal__content" }, Qi = { class: "vuefinder__archive-modal__form" }, ec = { class: "vuefinder__archive-modal__files vf-scrollbar" }, tc = { class: "vuefinder__archive-modal__file" }, nc = {
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
}, oc = { class: "vuefinder__archive-modal__file-name" }, rc = ["placeholder"], Uo = {
  __name: "ModalArchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = F(""), s = F(""), c = F(e.modal.data.items), i = () => {
      c.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: c.value.map(({ path: d, type: l }) => ({ path: d, type: l })),
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file(s) archived.") });
        },
        onError: (d) => {
          s.value = n(d.message);
        }
      });
    };
    return (d, l) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Archive")), 1),
        a("button", {
          type: "button",
          onClick: l[2] || (l[2] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        a("div", null, [
          P(Qe, {
            icon: o(Io),
            title: o(n)("Archive the files")
          }, null, 8, ["icon", "title"]),
          a("div", Zi, [
            a("div", Qi, [
              a("div", ec, [
                (v(!0), h(ge, null, ye(c.value, (u) => (v(), h("p", tc, [
                  u.type === "dir" ? (v(), h("svg", nc, l[3] || (l[3] = [
                    a("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (v(), h("svg", sc, l[4] || (l[4] = [
                    a("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  a("span", oc, b(u.basename), 1)
                ]))), 256))
              ]),
              de(a("input", {
                "onUpdate:modelValue": l[0] || (l[0] = (u) => r.value = u),
                onKeyup: kt(i, ["enter"]),
                class: "vuefinder__archive-modal__input",
                placeholder: o(n)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, rc), [
                [xt, r.value]
              ]),
              s.value.length ? (v(), j(We, {
                key: 0,
                onHidden: l[1] || (l[1] = (u) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  W(b(s.value), 1)
                ]),
                _: 1
              })) : N("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ac = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  viewBox: "0 0 24 24"
};
function lc(t, e) {
  return v(), h("svg", ac, e[0] || (e[0] = [
    a("circle", {
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      "stroke-width": "4",
      class: "opacity-25 stroke-blue-900 dark:stroke-blue-100"
    }, null, -1),
    a("path", {
      fill: "currentColor",
      d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.96 7.96 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z",
      class: "opacity-75"
    }, null, -1)
  ]));
}
const is = { render: lc }, ic = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function cc(t, e) {
  return v(), h("svg", ic, e[0] || (e[0] = [
    a("path", { d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" }, null, -1)
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
  return v(), h("svg", uc, e[0] || (e[0] = [
    a("path", { d: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" }, null, -1)
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
  return v(), h("svg", fc, e[0] || (e[0] = [
    a("path", { d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z" }, null, -1)
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
  return v(), h("svg", hc, e[0] || (e[0] = [
    a("path", { d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75" }, null, -1)
  ]));
}
const bc = { render: gc }, wc = { class: "vuefinder__toolbar" }, yc = {
  key: 0,
  class: "vuefinder__toolbar__actions"
}, kc = ["title"], xc = ["title"], Sc = ["title"], $c = ["title"], Cc = ["title"], Ec = ["title"], Tc = ["title"], Ac = {
  key: 1,
  class: "vuefinder__toolbar__search-results"
}, Dc = { class: "pl-2" }, Mc = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, Oc = { class: "vuefinder__toolbar__controls" }, Vc = ["title"], Lc = ["title"], Fc = {
  __name: "Toolbar",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n } = e.storage, { t: r } = e.i18n, s = e.dragSelect, c = F("");
    e.emitter.on("vf-search-query", ({ newQuery: l }) => {
      c.value = l;
    });
    const i = () => {
      e.fullScreen = !e.fullScreen;
    };
    Te(() => e.fullScreen, () => {
      e.fullScreen ? document.querySelector("body").style.overflow = "hidden" : document.querySelector("body").style.overflow = "", n("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
    });
    const d = () => {
      e.view = e.view === "list" ? "grid" : "list", s.refreshSelection(), n("viewport", e.view);
    };
    return (l, u) => (v(), h("div", wc, [
      c.value.length ? (v(), h("div", Ac, [
        a("div", Dc, [
          W(b(o(r)("Search results for")) + " ", 1),
          a("span", Mc, b(c.value), 1)
        ]),
        o(e).fs.loading ? (v(), j(o(is), { key: 0 })) : N("", !0)
      ])) : (v(), h("div", yc, [
        o(e).features.includes(o(ce).NEW_FOLDER) ? (v(), h("div", {
          key: 0,
          class: "mx-1.5",
          title: o(r)("New Folder"),
          onClick: u[0] || (u[0] = (f) => o(e).modal.open(Lo, { items: o(s).getSelected() }))
        }, [
          P(o(Vo))
        ], 8, kc)) : N("", !0),
        o(e).features.includes(o(ce).NEW_FILE) ? (v(), h("div", {
          key: 1,
          class: "mx-1.5",
          title: o(r)("New File"),
          onClick: u[1] || (u[1] = (f) => o(e).modal.open(yi, { items: o(s).getSelected() }))
        }, [
          P(o(Fo))
        ], 8, xc)) : N("", !0),
        o(e).features.includes(o(ce).RENAME) ? (v(), h("div", {
          key: 2,
          class: "mx-1.5",
          title: o(r)("Rename"),
          onClick: u[2] || (u[2] = (f) => o(s).getCount() !== 1 || o(e).modal.open(an, { items: o(s).getSelected() }))
        }, [
          P(o(Oo), {
            class: oe(o(s).getCount() === 1 ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Sc)) : N("", !0),
        o(e).features.includes(o(ce).DELETE) ? (v(), h("div", {
          key: 3,
          class: "mx-1.5",
          title: o(r)("Delete"),
          onClick: u[3] || (u[3] = (f) => !o(s).getCount() || o(e).modal.open(ls, { items: o(s).getSelected() }))
        }, [
          P(o(Mo), {
            class: oe(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, $c)) : N("", !0),
        o(e).features.includes(o(ce).UPLOAD) ? (v(), h("div", {
          key: 4,
          class: "mx-1.5",
          title: o(r)("Upload"),
          onClick: u[4] || (u[4] = (f) => o(e).modal.open(Ui, { items: o(s).getSelected() }))
        }, [
          P(o(Ro))
        ], 8, Cc)) : N("", !0),
        o(e).features.includes(o(ce).UNARCHIVE) && o(s).getCount() === 1 && o(s).getSelected()[0].mime_type === "application/zip" ? (v(), h("div", {
          key: 5,
          class: "mx-1.5",
          title: o(r)("Unarchive"),
          onClick: u[5] || (u[5] = (f) => !o(s).getCount() || o(e).modal.open(Ho, { items: o(s).getSelected() }))
        }, [
          P(o(Bo), {
            class: oe(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Ec)) : N("", !0),
        o(e).features.includes(o(ce).ARCHIVE) ? (v(), h("div", {
          key: 6,
          class: "mx-1.5",
          title: o(r)("Archive"),
          onClick: u[6] || (u[6] = (f) => !o(s).getCount() || o(e).modal.open(Uo, { items: o(s).getSelected() }))
        }, [
          P(o(Io), {
            class: oe(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Tc)) : N("", !0)
      ])),
      a("div", Oc, [
        o(e).features.includes(o(ce).FULL_SCREEN) ? (v(), h("div", {
          key: 0,
          onClick: i,
          class: "mx-1.5",
          title: o(r)("Toggle Full Screen")
        }, [
          o(e).fullScreen ? (v(), j(o(_c), { key: 0 })) : (v(), j(o(dc), { key: 1 }))
        ], 8, Vc)) : N("", !0),
        a("div", {
          class: "mx-1.5",
          title: o(r)("Change View"),
          onClick: u[7] || (u[7] = (f) => c.value.length || d())
        }, [
          o(e).view === "grid" ? (v(), j(o(pc), {
            key: 0,
            class: oe(["vf-toolbar-icon", c.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : N("", !0),
          o(e).view === "list" ? (v(), j(o(bc), {
            key: 1,
            class: oe(["vf-toolbar-icon", c.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : N("", !0)
        ], 8, Lc)
      ])
    ]));
  }
}, Rc = (t, e = 0, n = !1) => {
  let r;
  return (...s) => {
    n && !r && t(...s), clearTimeout(r), r = setTimeout(() => {
      t(...s);
    }, e);
  };
}, Os = (t, e, n) => {
  const r = F(t);
  return or((s, c) => ({
    get() {
      return s(), r.value;
    },
    set: Rc(
      (i) => {
        r.value = i, c();
      },
      e,
      n
    )
  }));
}, Bc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function Hc(t, e) {
  return v(), h("svg", Bc, e[0] || (e[0] = [
    a("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3"
    }, null, -1)
  ]));
}
const Ic = { render: Hc }, Uc = { class: "vuefinder__move-modal__content" }, Nc = { class: "vuefinder__move-modal__description" }, Pc = { class: "vuefinder__move-modal__files vf-scrollbar" }, zc = { class: "vuefinder__move-modal__file" }, qc = {
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = F(e.modal.data.items.from), s = F(""), c = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: r.value.map(({ path: i, type: d }) => ({ path: i, type: d })),
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
    return (i, d) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Yes, Move!")), 1),
        a("button", {
          type: "button",
          onClick: d[1] || (d[1] = (l) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1),
        a("div", Xc, b(o(n)("%s item(s) selected.", r.value.length)), 1)
      ]),
      default: J(() => [
        a("div", null, [
          P(Qe, {
            icon: o(Ic),
            title: o(n)("Move files")
          }, null, 8, ["icon", "title"]),
          a("div", Uc, [
            a("p", Nc, b(o(n)("Are you sure you want to move these files?")), 1),
            a("div", Pc, [
              (v(!0), h(ge, null, ye(r.value, (l) => (v(), h("div", zc, [
                a("div", null, [
                  l.type === "dir" ? (v(), h("svg", qc, d[2] || (d[2] = [
                    a("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (v(), h("svg", jc, d[3] || (d[3] = [
                    a("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ])))
                ]),
                a("div", Gc, b(l.path), 1)
              ]))), 256))
            ]),
            a("h4", Kc, b(o(n)("Target Directory")), 1),
            a("p", Wc, [
              d[4] || (d[4] = a("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "1"
              }, [
                a("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                })
              ], -1)),
              a("span", Yc, b(o(e).modal.data.items.to.path), 1)
            ]),
            s.value.length ? (v(), j(We, {
              key: 0,
              onHidden: d[0] || (d[0] = (l) => s.value = ""),
              error: ""
            }, {
              default: J(() => [
                W(b(s.value), 1)
              ]),
              _: 1
            })) : N("", !0)
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
  return v(), h("svg", Jc, e[0] || (e[0] = [
    a("path", { d: "M463.5 224h8.5c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224z" }, null, -1)
  ]));
}
const Qc = { render: Zc }, ed = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-0.5 rounded",
  viewBox: "0 0 20 20"
};
function td(t, e) {
  return v(), h("svg", ed, e[0] || (e[0] = [
    a("path", {
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
  return v(), h("svg", sd, e[0] || (e[0] = [
    a("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const rd = { render: od }, ad = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 20 20"
};
function ld(t, e) {
  return v(), h("svg", ad, e[0] || (e[0] = [
    a("path", {
      d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414z",
      class: "pointer-events-none"
    }, null, -1)
  ]));
}
const id = { render: ld }, cd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
  viewBox: "0 0 20 20"
};
function dd(t, e) {
  return v(), h("svg", cd, e[0] || (e[0] = [
    a("path", { d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607" }, null, -1)
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
  return v(), h("svg", vd, e[0] || (e[0] = [
    a("path", {
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
  return v(), h("svg", md, e[0] || (e[0] = [
    a("path", {
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
  return v(), h("svg", hd, e[0] || (e[0] = [
    a("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    a("path", { d: "M9 6h11M12 12h8M15 18h5M5 6v.01M8 12v.01M11 18v.01" }, null, -1)
  ]));
}
const bd = { render: gd }, wd = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 rounded text-slate-700 hover:bg-neutral-100 dark:fill-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 448 512"
};
function yd(t, e) {
  return v(), h("svg", wd, e[0] || (e[0] = [
    a("path", { d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" }, null, -1)
  ]));
}
const kd = { render: yd }, xd = { class: "vuefinder__breadcrumb__container" }, Sd = ["title"], $d = ["title"], Cd = ["title"], Ed = ["title"], Td = { class: "vuefinder__breadcrumb__list" }, Ad = {
  key: 0,
  class: "vuefinder__breadcrumb__hidden-list"
}, Dd = { class: "relative" }, Md = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], Od = { class: "vuefinder__breadcrumb__search-mode" }, Vd = ["placeholder"], Ld = { class: "vuefinder__breadcrumb__hidden-dropdown" }, Fd = ["onDrop", "onClick"], Rd = { class: "vuefinder__breadcrumb__hidden-item-content" }, Bd = { class: "vuefinder__breadcrumb__hidden-item-text" }, Hd = {
  __name: "Breadcrumb",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = e.dragSelect, { setStore: s } = e.storage, c = F(null), i = Os(0, 100);
    Te(i, (H) => {
      const E = c.value.children;
      let S = 0, L = 0, I = 5, K = 1;
      e.fs.limitBreadcrumbItems(I), ct(() => {
        for (let Y = E.length - 1; Y >= 0 && !(S + E[Y].offsetWidth > i.value - 40); Y--)
          S += parseInt(E[Y].offsetWidth, 10), L++;
        L < K && (L = K), L > I && (L = I), e.fs.limitBreadcrumbItems(L);
      });
    });
    const d = () => {
      i.value = c.value.offsetWidth;
    };
    let l = F(null);
    Se(() => {
      l.value = new ResizeObserver(d), l.value.observe(c.value);
    }), Gn(() => {
      l.value.disconnect();
    });
    const u = (H, E = null) => {
      H.preventDefault(), r.isDraggingRef.value = !1, m(H), E ?? (E = e.fs.hiddenBreadcrumbs.length - 1);
      let S = JSON.parse(H.dataTransfer.getData("items"));
      if (S.find((L) => L.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(jn, {
        items: {
          from: S,
          to: e.fs.hiddenBreadcrumbs[E] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, f = (H, E = null) => {
      H.preventDefault(), r.isDraggingRef.value = !1, m(H), E ?? (E = e.fs.breadcrumbs.length - 2);
      let S = JSON.parse(H.dataTransfer.getData("items"));
      if (S.find((L) => L.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(jn, {
        items: {
          from: S,
          to: e.fs.breadcrumbs[E] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, _ = (H) => {
      H.preventDefault(), e.fs.isGoUpAvailable() ? (H.dataTransfer.dropEffect = "copy", H.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-600")) : (H.dataTransfer.dropEffect = "none", H.dataTransfer.effectAllowed = "none");
    }, m = (H) => {
      H.preventDefault(), H.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600"), e.fs.isGoUpAvailable() && H.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600");
    }, p = () => {
      M(), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    }, w = () => {
      M(), !e.fs.isGoUpAvailable() || e.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: e.fs.adapter,
          path: e.fs.parentFolderPath
        }
      });
    }, R = (H) => {
      e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: H.path } }), e.fs.toggleHiddenBreadcrumbs(!1);
    }, g = () => {
      e.fs.showHiddenBreadcrumbs && e.fs.toggleHiddenBreadcrumbs(!1);
    }, C = {
      mounted(H, E, S, L) {
        H.clickOutsideEvent = function(I) {
          H === I.target || H.contains(I.target) || E.value();
        }, document.body.addEventListener("click", H.clickOutsideEvent);
      },
      beforeUnmount(H, E, S, L) {
        document.body.removeEventListener("click", H.clickOutsideEvent);
      }
    }, D = () => {
      e.showTreeView = !e.showTreeView;
    };
    Te(() => e.showTreeView, (H, E) => {
      H !== E && s("show-tree-view", H);
    });
    const O = F(null), x = () => {
      e.features.includes(ce.SEARCH) && (e.fs.searchMode = !0, ct(() => O.value.focus()));
    }, $ = Os("", 400);
    Te($, (H) => {
      e.emitter.emit("vf-toast-clear"), e.emitter.emit("vf-search-query", { newQuery: H });
    }), Te(() => e.fs.searchMode, (H) => {
      H && ct(() => O.value.focus());
    });
    const M = () => {
      e.fs.searchMode = !1, $.value = "";
    };
    e.emitter.on("vf-search-exit", () => {
      M();
    });
    const z = () => {
      $.value === "" && M();
    };
    return (H, E) => (v(), h("div", xd, [
      a("span", {
        title: o(n)("Toggle Tree View")
      }, [
        P(o(bd), {
          onClick: D,
          class: oe(["vuefinder__breadcrumb__toggle-tree", o(e).showTreeView ? "vuefinder__breadcrumb__toggle-tree--active" : ""])
        }, null, 8, ["class"])
      ], 8, Sd),
      a("span", {
        title: o(n)("Go up a directory")
      }, [
        P(o(nd), {
          onDragover: E[0] || (E[0] = (S) => _(S)),
          onDragleave: E[1] || (E[1] = (S) => m(S)),
          onDrop: E[2] || (E[2] = (S) => f(S)),
          onClick: w,
          class: oe(o(e).fs.isGoUpAvailable() ? "vuefinder__breadcrumb__go-up--active" : "vuefinder__breadcrumb__go-up--inactive")
        }, null, 8, ["class"])
      ], 8, $d),
      o(e).fs.loading ? (v(), h("span", {
        key: 1,
        title: o(n)("Cancel")
      }, [
        P(o(rd), {
          onClick: E[3] || (E[3] = (S) => o(e).emitter.emit("vf-fetch-abort"))
        })
      ], 8, Ed)) : (v(), h("span", {
        key: 0,
        title: o(n)("Refresh")
      }, [
        P(o(Qc), { onClick: p })
      ], 8, Cd)),
      de(a("div", {
        onClick: st(x, ["self"]),
        class: "group vuefinder__breadcrumb__search-container"
      }, [
        a("div", null, [
          P(o(id), {
            onDragover: E[4] || (E[4] = (S) => _(S)),
            onDragleave: E[5] || (E[5] = (S) => m(S)),
            onDrop: E[6] || (E[6] = (S) => f(S, -1)),
            onClick: E[7] || (E[7] = (S) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter } }))
          })
        ]),
        a("div", Td, [
          o(e).fs.hiddenBreadcrumbs.length ? de((v(), h("div", Ad, [
            E[13] || (E[13] = a("div", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            a("div", Dd, [
              a("span", {
                onDragenter: E[8] || (E[8] = (S) => o(e).fs.toggleHiddenBreadcrumbs(!0)),
                onClick: E[9] || (E[9] = (S) => o(e).fs.toggleHiddenBreadcrumbs()),
                class: "vuefinder__breadcrumb__hidden-toggle"
              }, [
                P(o(kd), { class: "vuefinder__breadcrumb__hidden-toggle-icon" })
              ], 32)
            ])
          ])), [
            [C, g]
          ]) : N("", !0)
        ]),
        a("div", {
          ref_key: "breadcrumbContainer",
          ref: c,
          class: "vuefinder__breadcrumb__visible-list",
          onClick: st(x, ["self"])
        }, [
          (v(!0), h(ge, null, ye(o(e).fs.breadcrumbs, (S, L) => (v(), h("div", { key: L }, [
            E[14] || (E[14] = a("span", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            a("span", {
              onDragover: (I) => L === o(e).fs.breadcrumbs.length - 1 || _(I),
              onDragleave: (I) => L === o(e).fs.breadcrumbs.length - 1 || m(I),
              onDrop: (I) => L === o(e).fs.breadcrumbs.length - 1 || f(I, L),
              class: "vuefinder__breadcrumb__item",
              title: S.basename,
              onClick: (I) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter, path: S.path } })
            }, b(S.name), 41, Md)
          ]))), 128))
        ], 512),
        o(e).fs.loading ? (v(), j(o(is), { key: 0 })) : N("", !0)
      ], 512), [
        [Ne, !o(e).fs.searchMode]
      ]),
      de(a("div", Od, [
        a("div", null, [
          P(o(ud))
        ]),
        de(a("input", {
          ref_key: "searchInput",
          ref: O,
          onKeydown: kt(M, ["esc"]),
          onBlur: z,
          "onUpdate:modelValue": E[10] || (E[10] = (S) => rr($) ? $.value = S : null),
          placeholder: o(n)("Search anything.."),
          class: "vuefinder__breadcrumb__search-input",
          type: "text"
        }, null, 40, Vd), [
          [xt, o($)]
        ]),
        P(o(fd), { onClick: M })
      ], 512), [
        [Ne, o(e).fs.searchMode]
      ]),
      de(a("div", Ld, [
        (v(!0), h(ge, null, ye(o(e).fs.hiddenBreadcrumbs, (S, L) => (v(), h("div", {
          key: L,
          onDragover: E[11] || (E[11] = (I) => _(I)),
          onDragleave: E[12] || (E[12] = (I) => m(I)),
          onDrop: (I) => u(I, L),
          onClick: (I) => R(S),
          class: "vuefinder__breadcrumb__hidden-item"
        }, [
          a("div", Rd, [
            a("span", null, [
              P(o(hn), { class: "vuefinder__breadcrumb__hidden-item-icon" })
            ]),
            E[15] || (E[15] = W()),
            a("span", Bd, b(S.name), 1)
          ])
        ], 40, Fd))), 128))
      ], 512), [
        [Ne, o(e).fs.showHiddenBreadcrumbs]
      ])
    ]));
  }
}, No = (t, e = null) => new Date(t * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), Id = ["onClick"], Ud = {
  __name: "Toast",
  setup(t) {
    const e = re("ServiceContainer"), { getStore: n } = e.storage, r = F(n("full-screen", !1)), s = F([]), c = (l) => l === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", i = (l) => {
      s.value.splice(l, 1);
    }, d = (l) => {
      let u = s.value.findIndex((f) => f.id === l);
      u !== -1 && i(u);
    };
    return e.emitter.on("vf-toast-clear", () => {
      s.value = [];
    }), e.emitter.on("vf-toast-push", (l) => {
      let u = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      l.id = u, s.value.push(l), setTimeout(() => {
        d(u);
      }, 5e3);
    }), (l, u) => (v(), h("div", {
      class: oe(["vuefinder__toast", r.value.value ? "vuefinder__toast--fixed" : "vuefinder__toast--absolute"])
    }, [
      P(ar, {
        name: "vuefinder__toast-item",
        "enter-active-class": "vuefinder__toast-item--enter-active",
        "leave-active-class": "vuefinder__toast-item--leave-active",
        "leave-to-class": "vuefinder__toast-item--leave-to"
      }, {
        default: J(() => [
          (v(!0), h(ge, null, ye(s.value, (f, _) => (v(), h("div", {
            key: _,
            onClick: (m) => i(_),
            class: oe(["vuefinder__toast__message", c(f.type)])
          }, b(f.label), 11, Id))), 128))
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
function Pd(t, e) {
  return v(), h("svg", Nd, e[0] || (e[0] = [
    a("path", {
      "fill-rule": "evenodd",
      d: "M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const zd = { render: Pd }, qd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function jd(t, e) {
  return v(), h("svg", qd, e[0] || (e[0] = [
    a("path", {
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
    return (e, n) => (v(), h("div", null, [
      t.direction === "asc" ? (v(), j(o(zd), { key: 0 })) : N("", !0),
      t.direction === "desc" ? (v(), j(o(Gd), { key: 1 })) : N("", !0)
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
  return v(), h("svg", Kd, e[0] || (e[0] = [
    a("path", {
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
    return (e, n) => (v(), h("span", Xd, [
      t.type === "dir" ? (v(), j(o(hn), {
        key: 0,
        class: oe(t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large")
      }, null, 8, ["class"])) : (v(), j(o(Yd), {
        key: 1,
        class: oe(t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large")
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
  return v(), h("svg", Jd, e[0] || (e[0] = [
    a("path", {
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
    return (n, r) => (v(), h("div", eu, [
      P(o(Qd)),
      a("div", tu, b(e.count), 1)
    ]));
  }
}, su = { class: "vuefinder__text-preview" }, ou = { class: "vuefinder__text-preview__header" }, ru = ["title"], au = { class: "vuefinder__text-preview__actions" }, lu = {
  key: 0,
  class: "vuefinder__text-preview__content"
}, iu = { key: 1 }, cu = {
  __name: "Text",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, r = F(""), s = F(""), c = F(null), i = F(!1), d = F(""), l = F(!1), u = re("ServiceContainer"), { t: f } = u.i18n;
    Se(() => {
      u.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: u.modal.data.adapter, path: u.modal.data.item.path },
        responseType: "text"
      }).then((p) => {
        r.value = p, n("success");
      });
    });
    const _ = () => {
      i.value = !i.value, s.value = r.value;
    }, m = () => {
      d.value = "", l.value = !1, u.requester.send({
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
      }).then((p) => {
        d.value = f("Updated."), r.value = p, n("success"), i.value = !i.value;
      }).catch((p) => {
        d.value = f(p.message), l.value = !0;
      });
    };
    return (p, w) => (v(), h("div", su, [
      a("div", ou, [
        a("div", {
          class: "vuefinder__text-preview__title",
          id: "modal-title",
          title: o(u).modal.data.item.path
        }, b(o(u).modal.data.item.basename), 9, ru),
        a("div", au, [
          i.value ? (v(), h("button", {
            key: 0,
            onClick: m,
            class: "vuefinder__text-preview__save-button"
          }, b(o(f)("Save")), 1)) : N("", !0),
          o(u).features.includes(o(ce).EDIT) ? (v(), h("button", {
            key: 1,
            class: "vuefinder__text-preview__edit-button",
            onClick: w[0] || (w[0] = (R) => _())
          }, b(i.value ? o(f)("Cancel") : o(f)("Edit")), 1)) : N("", !0)
        ])
      ]),
      a("div", null, [
        i.value ? (v(), h("div", iu, [
          de(a("textarea", {
            ref_key: "editInput",
            ref: c,
            "onUpdate:modelValue": w[1] || (w[1] = (R) => s.value = R),
            class: "vuefinder__text-preview__textarea",
            name: "text",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [xt, s.value]
          ])
        ])) : (v(), h("pre", lu, b(r.value), 1)),
        d.value.length ? (v(), j(We, {
          key: 2,
          onHidden: w[2] || (w[2] = (R) => d.value = ""),
          error: l.value
        }, {
          default: J(() => [
            W(b(d.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : N("", !0)
      ])
    ]));
  }
}, du = { class: "vuefinder__image-preview" }, uu = { class: "vuefinder__image-preview__header" }, vu = ["title"], _u = { class: "vuefinder__image-preview__actions" }, fu = { class: "vuefinder__image-preview__image-container" }, mu = ["src"], pu = {
  __name: "Image",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, r = re("ServiceContainer"), { t: s } = r.i18n, c = F(null), i = F(null), d = F(!1), l = F(""), u = F(!1), f = () => {
      d.value = !d.value, d.value ? i.value = new pr(c.value, {
        crop(m) {
        }
      }) : i.value.destroy();
    }, _ = () => {
      i.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (m) => {
          l.value = "", u.value = !1;
          const p = new FormData();
          p.set("file", m), r.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: r.modal.data.adapter,
              path: r.modal.data.item.path
            },
            body: p
          }).then((w) => {
            l.value = s("Updated."), c.value.src = r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item), f(), n("success");
          }).catch((w) => {
            l.value = s(w.message), u.value = !0;
          });
        }
      );
    };
    return Se(() => {
      n("success");
    }), (m, p) => (v(), h("div", du, [
      a("div", uu, [
        a("h3", {
          class: "vuefinder__image-preview__title",
          id: "modal-title",
          title: o(r).modal.data.item.path
        }, b(o(r).modal.data.item.basename), 9, vu),
        a("div", _u, [
          d.value ? (v(), h("button", {
            key: 0,
            onClick: _,
            class: "vuefinder__image-preview__crop-button"
          }, b(o(s)("Crop")), 1)) : N("", !0),
          o(r).features.includes(o(ce).EDIT) ? (v(), h("button", {
            key: 1,
            class: "vuefinder__image-preview__edit-button",
            onClick: p[0] || (p[0] = (w) => f())
          }, b(d.value ? o(s)("Cancel") : o(s)("Edit")), 1)) : N("", !0)
        ])
      ]),
      a("div", fu, [
        a("img", {
          ref_key: "image",
          ref: c,
          class: "vuefinder__image-preview__image",
          src: o(r).requester.getPreviewUrl(o(r).modal.data.adapter, o(r).modal.data.item),
          alt: ""
        }, null, 8, mu)
      ]),
      l.value.length ? (v(), j(We, {
        key: 0,
        onHidden: p[1] || (p[1] = (w) => l.value = ""),
        error: u.value
      }, {
        default: J(() => [
          W(b(l.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : N("", !0)
    ]));
  }
}, hu = { class: "vuefinder__default-preview" }, gu = { class: "vuefinder__default-preview__header" }, bu = ["title"], wu = {
  __name: "Default",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), r = e;
    return Se(() => {
      r("success");
    }), (s, c) => (v(), h("div", hu, [
      a("div", gu, [
        a("h3", {
          class: "vuefinder__default-preview__title",
          id: "modal-title",
          title: o(n).modal.data.item.path
        }, b(o(n).modal.data.item.basename), 9, bu)
      ]),
      c[0] || (c[0] = a("div", null, null, -1))
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
    const n = re("ServiceContainer"), r = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return Se(() => {
      r("success");
    }), (c, i) => (v(), h("div", yu, [
      a("h3", {
        class: "vuefinder__video-preview__title",
        id: "modal-title",
        title: o(n).modal.data.item.path
      }, b(o(n).modal.data.item.basename), 9, ku),
      a("div", null, [
        a("video", xu, [
          a("source", {
            src: s(),
            type: "video/mp4"
          }, null, 8, Su),
          i[0] || (i[0] = W(" Your browser does not support the video tag. "))
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
    const n = e, r = re("ServiceContainer"), s = () => r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item);
    return Se(() => {
      n("success");
    }), (c, i) => (v(), h("div", Cu, [
      a("h3", {
        class: "vuefinder__audio-preview__title",
        id: "modal-title",
        title: o(r).modal.data.item.path
      }, b(o(r).modal.data.item.basename), 9, Eu),
      a("div", null, [
        a("audio", Tu, [
          a("source", {
            src: s(),
            type: "audio/mpeg"
          }, null, 8, Au),
          i[0] || (i[0] = W(" Your browser does not support the audio element. "))
        ])
      ])
    ]));
  }
}, Mu = { class: "vuefinder__pdf-preview" }, Ou = ["title"], Vu = ["data"], Lu = ["src"], Fu = {
  __name: "Pdf",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), r = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return Se(() => {
      r("success");
    }), (c, i) => (v(), h("div", Mu, [
      a("h3", {
        class: "vuefinder__pdf-preview__title",
        id: "modal-title",
        title: o(n).modal.data.item.path
      }, b(o(n).modal.data.item.basename), 9, Ou),
      a("div", null, [
        a("object", {
          class: "vuefinder__pdf-preview__object",
          data: s(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          a("iframe", {
            class: "vuefinder__pdf-preview__iframe",
            src: s(),
            width: "100%",
            height: "100%"
          }, i[0] || (i[0] = [
            a("p", null, [
              W(" Your browser does not support PDFs. "),
              a("a", { href: "https://example.com/test.pdf" }, "Download the PDF"),
              W(". ")
            ], -1)
          ]), 8, Lu)
        ], 8, Vu)
      ])
    ]));
  }
}, Ru = { class: "vuefinder__preview-modal__content" }, Bu = { key: 0 }, Hu = { class: "vuefinder__preview-modal__loading" }, Iu = {
  key: 0,
  class: "vuefinder__preview-modal__loading-indicator"
}, Uu = { class: "vuefinder__preview-modal__details" }, Nu = { class: "font-bold" }, Pu = { class: "font-bold pl-2" }, zu = {
  key: 0,
  class: "vuefinder__preview-modal__note"
}, qu = ["download", "href"], Po = {
  __name: "ModalPreview",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = F(!1), s = (i) => (e.modal.data.item.mime_type ?? "").startsWith(i), c = e.features.includes(ce.PREVIEW);
    return c || (r.value = !0), (i, d) => (v(), j(Ke, null, {
      buttons: J(() => [
        a("button", {
          type: "button",
          onClick: d[6] || (d[6] = (l) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Close")), 1),
        o(e).features.includes(o(ce).DOWNLOAD) ? (v(), h("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: o(e).requester.getDownloadUrl(o(e).modal.data.adapter, o(e).modal.data.item),
          href: o(e).requester.getDownloadUrl(o(e).modal.data.adapter, o(e).modal.data.item)
        }, b(o(n)("Download")), 9, qu)) : N("", !0)
      ]),
      default: J(() => [
        a("div", null, [
          a("div", Ru, [
            o(c) ? (v(), h("div", Bu, [
              s("text") ? (v(), j(cu, {
                key: 0,
                onSuccess: d[0] || (d[0] = (l) => r.value = !0)
              })) : s("image") ? (v(), j(pu, {
                key: 1,
                onSuccess: d[1] || (d[1] = (l) => r.value = !0)
              })) : s("video") ? (v(), j($u, {
                key: 2,
                onSuccess: d[2] || (d[2] = (l) => r.value = !0)
              })) : s("audio") ? (v(), j(Du, {
                key: 3,
                onSuccess: d[3] || (d[3] = (l) => r.value = !0)
              })) : s("application/pdf") ? (v(), j(Fu, {
                key: 4,
                onSuccess: d[4] || (d[4] = (l) => r.value = !0)
              })) : (v(), j(wu, {
                key: 5,
                onSuccess: d[5] || (d[5] = (l) => r.value = !0)
              }))
            ])) : N("", !0),
            a("div", Hu, [
              r.value === !1 ? (v(), h("div", Iu, [
                d[7] || (d[7] = a("svg", {
                  class: "vuefinder__preview-modal__spinner",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24"
                }, [
                  a("circle", {
                    class: "vuefinder__preview-modal__spinner-circle",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    "stroke-width": "4"
                  }),
                  a("path", {
                    class: "vuefinder__preview-modal__spinner-path",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  })
                ], -1)),
                a("span", null, b(o(n)("Loading")), 1)
              ])) : N("", !0)
            ])
          ])
        ]),
        a("div", Uu, [
          a("div", null, [
            a("span", Nu, b(o(n)("File Size")) + ": ", 1),
            W(b(o(e).filesize(o(e).modal.data.item.file_size)), 1)
          ]),
          a("div", null, [
            a("span", Pu, b(o(n)("Last Modified")) + ": ", 1),
            W(" " + b(o(No)(o(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        o(e).features.includes(o(ce).DOWNLOAD) ? (v(), h("div", zu, [
          a("span", null, b(o(n)(`Download doesn't work? You can try right-click "Download" button, select "Save link as...".`)), 1)
        ])) : N("", !0)
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
  return v(), h("svg", ju, e[0] || (e[0] = [
    a("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    a("path", { d: "m15 4.5-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4M9 15l-4.5 4.5M14.5 4 20 9.5" }, null, -1)
  ]));
}
const zo = { render: Gu }, Ku = ["data-type", "data-item", "data-index"], Wu = { class: "vuefinder__item-content relative" }, Yu = {
  __name: "Item",
  props: {
    item: { type: Object },
    index: { type: Number },
    dragImage: { type: Object }
  },
  setup(t) {
    const e = t, n = re("ServiceContainer"), r = n.dragSelect, s = F(""), c = F(""), i = async (g) => {
      if (g)
        try {
          const O = btoa("noblecoder:Admin100%"), x = await fetch("http://pmra.test/api/documents/check-expiry", {
            method: "POST",
            headers: {
              Authorization: `Basic ${O}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              filename: g.basename,
              path: g.path,
              full_path: `${n.fs.adapter}://${g.path}`
            })
          });
          if (!x.ok)
            throw new Error("Failed to check expiry status");
          const $ = await x.json();
          if ($.isExpiring) {
            const M = $.timeUnit;
            s.value = $.timeRemaining <= 0 ? "Expired" : `Expires in ${$.timeRemaining} ${M}`, $.timeRemaining <= 0 ? c.value = "text-red-600 font-bold" : $.timeUnit === "days" && $.timeRemaining <= 7 || $.timeUnit === "months" && $.timeRemaining === 1 || $.timeUnit === "years" && $.timeRemaining === 1 ? c.value = "text-orange-500" : $.timeUnit === "days" && $.timeRemaining <= 30 || $.timeUnit === "months" && $.timeRemaining <= 3 || $.timeUnit === "years" && $.timeRemaining <= 1 ? c.value = "text-yellow-500" : c.value = "text-blue-500";
          } else
            s.value = "", c.value = "";
        } catch (C) {
          console.error("Error checking file expiry:", C), s.value = "", c.value = "";
        }
    }, d = (g) => {
      g.type === "dir" ? (n.emitter.emit("vf-search-exit"), n.emitter.emit("vf-fetch", { params: { q: "index", adapter: n.fs.adapter, path: g.path } })) : n.modal.open(Po, { adapter: n.fs.adapter, item: g });
    }, l = {
      mounted(g, C, D, O) {
        D.props.draggable && (g.addEventListener("dragstart", (x) => u(x, C.value)), g.addEventListener("dragover", (x) => _(x, C.value)), g.addEventListener("drop", (x) => f(x, C.value)));
      },
      beforeUnmount(g, C, D, O) {
        D.props.draggable && (g.removeEventListener("dragstart", u), g.removeEventListener("dragover", _), g.removeEventListener("drop", f));
      }
    }, u = (g, C) => {
      if (g.altKey || g.ctrlKey || g.metaKey)
        return g.preventDefault(), !1;
      r.isDraggingRef.value = !0, g.dataTransfer.setDragImage(e.dragImage.$el, 0, 15), g.dataTransfer.effectAllowed = "all", g.dataTransfer.dropEffect = "copy", g.dataTransfer.setData("items", JSON.stringify(r.getSelected()));
    }, f = (g, C) => {
      g.preventDefault(), r.isDraggingRef.value = !1;
      let D = JSON.parse(g.dataTransfer.getData("items"));
      if (D.find((O) => O.storage !== n.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      n.modal.open(jn, { items: { from: D, to: C } });
    }, _ = (g, C) => {
      g.preventDefault(), !C || C.type !== "dir" || r.getSelection().find((D) => D === g.currentTarget) ? (g.dataTransfer.dropEffect = "none", g.dataTransfer.effectAllowed = "none") : g.dataTransfer.dropEffect = "copy";
    };
    let m = null, p = !1;
    const w = () => {
      m && clearTimeout(m);
    }, R = (g) => {
      if (!p)
        p = !0, setTimeout(() => p = !1, 300);
      else
        return p = !1, d(e.item), clearTimeout(m), !1;
      m = setTimeout(() => {
        const C = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: g.target.getBoundingClientRect().x,
          clientY: g.target.getBoundingClientRect().y
        });
        g.target.dispatchEvent(C);
      }, 500);
    };
    return Te(() => e.item, (g) => {
      g && i(g);
    }, { immediate: !0, deep: !0 }), Te(() => n.fs.path, () => {
      e.item && i(e.item);
    }), Te(() => n.fs.data, () => {
      e.item && i(e.item);
    }, { deep: !0 }), Se(() => {
      e.item && i(e.item);
    }), (g, C) => de((v(), h("div", {
      style: ln({ opacity: o(r).isDraggingRef.value && o(r).getSelection().find((D) => g.$el === D) ? "0.5 !important" : "" }),
      class: oe(["vuefinder__item", "vf-item-" + o(r).explorerId]),
      "data-type": t.item.type,
      key: t.item.path,
      "data-item": JSON.stringify(t.item),
      "data-index": t.index,
      onDblclick: C[0] || (C[0] = (D) => d(t.item)),
      onTouchstart: C[1] || (C[1] = (D) => R(D)),
      onTouchend: C[2] || (C[2] = (D) => w()),
      onContextmenu: C[3] || (C[3] = st((D) => o(n).emitter.emit("vf-contextmenu-show", { event: D, items: o(r).getSelected(), target: t.item }), ["prevent"]))
    }, [
      a("div", Wu, [
        At(g.$slots, "default", {}, void 0, !0),
        o(n).pinnedFolders.find((D) => D.path === t.item.path) ? (v(), j(o(zo), {
          key: 0,
          class: "vuefinder__item--pinned"
        })) : N("", !0),
        s.value ? (v(), h("div", {
          key: 1,
          class: oe(["vuefinder__item-expiry-status", [c.value, o(n).view === "grid" ? "grid-view" : "list-view"]])
        }, b(s.value), 3)) : N("", !0)
      ])
    ], 46, Ku)), [
      [l, t.item]
    ]);
  }
}, Tn = /* @__PURE__ */ Ao(Yu, [["__scopeId", "data-v-237733c0"]]), Xu = { class: "vuefinder__explorer__container" }, Ju = {
  key: 0,
  class: "vuefinder__explorer__header"
}, Zu = { class: "vuefinder__explorer__drag-item" }, Qu = { class: "vuefinder__explorer__item-list-content" }, ev = { class: "vuefinder__explorer__item-list-name" }, tv = { class: "vuefinder__explorer__item-name" }, nv = { class: "vuefinder__explorer__item-path" }, sv = { class: "vuefinder__explorer__item-list-content" }, ov = { class: "vuefinder__explorer__item-list-name" }, rv = { class: "vuefinder__explorer__item-name" }, av = { class: "vuefinder__explorer__item-size" }, lv = { class: "vuefinder__explorer__item-date" }, iv = { class: "vuefinder__explorer__item-grid-content" }, cv = ["data-src", "alt"], dv = {
  key: 2,
  class: "vuefinder__explorer__item-extension"
}, uv = { class: "vuefinder__explorer__item-title break-all" }, vv = {
  __name: "Explorer",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = (_) => _ == null ? void 0 : _.substring(0, 3), s = F(null), c = F(""), i = e.dragSelect;
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
        onSuccess: (m) => {
          m.files.length || e.emitter.emit("vf-toast-push", { label: n("No search result found.") });
        }
      }) : e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    });
    const l = yt({ active: !1, column: "", order: "" }), u = (_ = !0) => {
      let m = [...e.fs.data.files], p = l.column, w = l.order === "asc" ? 1 : -1;
      if (!_)
        return m;
      const R = (g, C) => typeof g == "string" && typeof C == "string" ? g.toLowerCase().localeCompare(C.toLowerCase()) : g < C ? -1 : g > C ? 1 : 0;
      return l.active && (m = m.slice().sort((g, C) => R(g[p], C[p]) * w)), m;
    }, f = (_) => {
      l.active && l.column === _ ? (l.active = l.order === "asc", l.column = _, l.order = "desc") : (l.active = !0, l.column = _, l.order = "asc");
    };
    return Se(() => {
      d = new mr(i.area.value);
    }), Ls(() => {
      d.update();
    }), Rs(() => {
      d.destroy();
    }), (_, m) => (v(), h("div", Xu, [
      o(e).view === "list" || c.value.length ? (v(), h("div", Ju, [
        a("div", {
          onClick: m[0] || (m[0] = (p) => f("basename")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button"
        }, [
          W(b(o(n)("Name")) + " ", 1),
          de(P(Gt, {
            direction: l.order
          }, null, 8, ["direction"]), [
            [Ne, l.active && l.column === "basename"]
          ])
        ]),
        c.value.length ? N("", !0) : (v(), h("div", {
          key: 0,
          onClick: m[1] || (m[1] = (p) => f("file_size")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button"
        }, [
          W(b(o(n)("Size")) + " ", 1),
          de(P(Gt, {
            direction: l.order
          }, null, 8, ["direction"]), [
            [Ne, l.active && l.column === "file_size"]
          ])
        ])),
        c.value.length ? N("", !0) : (v(), h("div", {
          key: 1,
          onClick: m[2] || (m[2] = (p) => f("last_modified")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button"
        }, [
          W(b(o(n)("Date")) + " ", 1),
          de(P(Gt, {
            direction: l.order
          }, null, 8, ["direction"]), [
            [Ne, l.active && l.column === "last_modified"]
          ])
        ])),
        c.value.length ? (v(), h("div", {
          key: 2,
          onClick: m[3] || (m[3] = (p) => f("path")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--path vf-sort-button"
        }, [
          W(b(o(n)("Filepath")) + " ", 1),
          de(P(Gt, {
            direction: l.order
          }, null, 8, ["direction"]), [
            [Ne, l.active && l.column === "path"]
          ])
        ])) : N("", !0)
      ])) : N("", !0),
      a("div", Zu, [
        P(nu, {
          ref_key: "dragImage",
          ref: s,
          count: o(i).getCount()
        }, null, 8, ["count"])
      ]),
      a("div", {
        ref: o(i).scrollBarContainer,
        class: oe(["vf-explorer-scrollbar-container vuefinder__explorer__scrollbar-container", [{ "grid-view": o(e).view === "grid" }, { "search-active": c.value.length }]])
      }, [
        a("div", {
          ref: o(i).scrollBar,
          class: "vuefinder__explorer__scrollbar"
        }, null, 512)
      ], 2),
      a("div", {
        ref: o(i).area,
        class: "vuefinder__explorer__selector-area vf-explorer-scrollbar vf-selector-area",
        onContextmenu: m[4] || (m[4] = st((p) => o(e).emitter.emit("vf-contextmenu-show", { event: p, items: o(i).getSelected() }), ["self", "prevent"]))
      }, [
        c.value.length ? (v(!0), h(ge, { key: 0 }, ye(u(), (p, w) => (v(), j(Tn, {
          item: p,
          index: w,
          dragImage: s.value,
          class: "vf-item vf-item-list"
        }, {
          default: J(() => [
            a("div", Qu, [
              a("div", ev, [
                P(En, {
                  type: p.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                a("span", tv, b(p.basename), 1)
              ]),
              a("div", nv, b(p.path), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : N("", !0),
        o(e).view === "list" && !c.value.length ? (v(!0), h(ge, { key: 1 }, ye(u(), (p, w) => (v(), j(Tn, {
          item: p,
          index: w,
          dragImage: s.value,
          class: "vf-item vf-item-list",
          draggable: "true",
          key: p.path
        }, {
          default: J(() => [
            a("div", sv, [
              a("div", ov, [
                P(En, {
                  type: p.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                a("span", rv, b(p.basename), 1)
              ]),
              a("div", av, b(p.file_size ? o(e).filesize(p.file_size) : ""), 1),
              a("div", lv, b(o(No)(p.last_modified)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 128)) : N("", !0),
        o(e).view === "grid" && !c.value.length ? (v(!0), h(ge, { key: 2 }, ye(u(!1), (p, w) => (v(), j(Tn, {
          item: p,
          index: w,
          dragImage: s.value,
          class: "vf-item vf-item-grid",
          draggable: "true"
        }, {
          default: J(() => [
            a("div", null, [
              a("div", iv, [
                (p.mime_type ?? "").startsWith("image") && o(e).showThumbnails ? (v(), h("img", {
                  src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                  class: "vuefinder__explorer__item-thumbnail lazy",
                  "data-src": o(e).requester.getPreviewUrl(o(e).fs.adapter, p),
                  alt: p.basename,
                  key: p.path
                }, null, 8, cv)) : (v(), j(En, {
                  key: 1,
                  type: p.type
                }, null, 8, ["type"])),
                !((p.mime_type ?? "").startsWith("image") && o(e).showThumbnails) && p.type !== "dir" ? (v(), h("div", dv, b(r(p.extension)), 1)) : N("", !0)
              ]),
              a("span", uv, b(o(qn)(p.basename)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : N("", !0)
      ], 544),
      P(Ud)
    ]));
  }
}, _v = ["href", "download"], fv = ["onClick"], mv = {
  __name: "ContextMenu",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = F(null), s = F([]), c = F(""), i = yt({
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
    const l = {
      newfolder: {
        key: ce.NEW_FOLDER,
        title: () => n("New Folder"),
        action: () => e.modal.open(Lo)
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
          e.pinnedFolders = e.pinnedFolders.filter((_) => !s.value.find((m) => m.path === _.path)), e.storage.setStore("pinned-folders", e.pinnedFolders);
        }
      },
      delete: {
        key: ce.DELETE,
        title: () => n("Delete"),
        action: () => {
          e.modal.open(ls, { items: s });
        }
      },
      refresh: {
        title: () => n("Refresh"),
        action: () => {
          e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
        }
      },
      preview: {
        key: ce.PREVIEW,
        title: () => n("Preview"),
        action: () => e.modal.open(Po, { adapter: e.fs.adapter, item: s.value[0] })
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
        key: ce.DOWNLOAD,
        link: rt(() => e.requester.getDownloadUrl(e.fs.adapter, s.value[0])),
        title: () => n("Download"),
        action: () => {
        }
      },
      archive: {
        key: ce.ARCHIVE,
        title: () => n("Archive"),
        action: () => e.modal.open(Uo, { items: s })
      },
      unarchive: {
        key: ce.UNARCHIVE,
        title: () => n("Unarchive"),
        action: () => e.modal.open(Ho, { items: s })
      },
      rename: {
        key: ce.RENAME,
        title: () => n("Rename"),
        action: () => e.modal.open(an, { items: s })
      },
      updateDocType: {
        key: ce.UPDATEDOCTYPE,
        title: () => n("Update Document Type"),
        action: () => e.modal.open(an, { items: s })
      }
    }, u = (_) => {
      e.emitter.emit("vf-contextmenu-hide"), _.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: _ }) => {
      c.value = _;
    }), e.emitter.on("vf-contextmenu-show", ({ event: _, items: m, target: p = null }) => {
      if (i.items = [], c.value)
        if (p)
          i.items.push(l.openDir), e.emitter.emit("vf-context-selected", [p]);
        else
          return;
      else !p && !c.value ? (i.items.push(l.refresh), i.items.push(l.selectAll), i.items.push(l.newfolder), e.emitter.emit("vf-context-selected", [])) : m.length > 1 && m.some((w) => w.path === p.path) ? (i.items.push(l.refresh), i.items.push(l.archive), i.items.push(l.delete), e.emitter.emit("vf-context-selected", m)) : (p.type === "dir" ? (i.items.push(l.open), e.pinnedFolders.findIndex((w) => w.path === p.path) !== -1 ? i.items.push(l.unpinFolder) : i.items.push(l.pinFolder)) : (i.items.push(l.preview), i.items.push(l.download), i.items.push(l.updateDocType)), i.items.push(l.rename), p.mime_type === "application/zip" ? i.items.push(l.unarchive) : i.items.push(l.archive), i.items.push(l.delete), e.emitter.emit("vf-context-selected", [p]));
      f(_);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      i.active = !1;
    });
    const f = (_) => {
      const m = e.dragSelect.area.value, p = e.root.getBoundingClientRect(), w = m.getBoundingClientRect();
      let R = _.clientX - p.left, g = _.clientY - p.top;
      i.active = !0, ct(() => {
        var x;
        const C = (x = r.value) == null ? void 0 : x.getBoundingClientRect();
        let D = (C == null ? void 0 : C.height) ?? 0, O = (C == null ? void 0 : C.width) ?? 0;
        R = w.right - _.pageX + window.scrollX < O ? R - O : R, g = w.bottom - _.pageY + window.scrollY < D ? g - D : g, i.positions = {
          left: R + "px",
          top: g + "px"
        };
      });
    };
    return (_, m) => de((v(), h("ul", {
      ref_key: "contextmenu",
      ref: r,
      style: ln(i.positions),
      class: "vuefinder__context-menu"
    }, [
      (v(!0), h(ge, null, ye(d.value, (p) => (v(), h("li", {
        class: "vuefinder__context-menu__item",
        key: p.title
      }, [
        p.link ? (v(), h("a", {
          key: 0,
          class: "vuefinder__context-menu__link",
          target: "_blank",
          href: p.link,
          download: p.link,
          onClick: m[0] || (m[0] = (w) => o(e).emitter.emit("vf-contextmenu-hide"))
        }, [
          a("span", null, b(p.title()), 1)
        ], 8, _v)) : (v(), h("div", {
          key: 1,
          class: "vuefinder__context-menu__action",
          onClick: (w) => u(p)
        }, [
          a("span", null, b(p.title()), 1)
        ], 8, fv))
      ]))), 128))
    ], 4)), [
      [Ne, i.active]
    ]);
  }
}, pv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function hv(t, e) {
  return v(), h("svg", pv, e[0] || (e[0] = [
    a("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    }, null, -1)
  ]));
}
const qo = { render: hv }, gv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  class: "h-5 w-5 stroke-slate-500 cursor-pointer",
  viewBox: "0 0 24 24"
};
function bv(t, e) {
  return v(), h("svg", gv, e[0] || (e[0] = [
    a("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
    }, null, -1)
  ]));
}
const wv = { render: bv }, yv = { class: "vuefinder__status-bar__wrapper" }, kv = { class: "vuefinder__status-bar__storage" }, xv = ["title"], Sv = { class: "vuefinder__status-bar__storage-icon" }, $v = ["value"], Cv = { class: "vuefinder__status-bar__info" }, Ev = { key: 0 }, Tv = { class: "vuefinder__status-bar__selected-count" }, Av = { class: "vuefinder__status-bar__actions" }, Dv = ["disabled"], Mv = ["title"], Ov = {
  __name: "Statusbar",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { setStore: r } = e.storage, s = e.dragSelect, c = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter } }), r("adapter", e.fs.adapter);
    }, i = F("");
    e.emitter.on("vf-search-query", ({ newQuery: l }) => {
      i.value = l;
    });
    const d = rt(() => {
      const l = e.selectButton.multiple ? s.getSelected().length > 0 : s.getSelected().length === 1;
      return e.selectButton.active && l;
    });
    return (l, u) => (v(), h("div", yv, [
      a("div", kv, [
        a("div", {
          class: "vuefinder__status-bar__storage-container",
          title: o(n)("Storage")
        }, [
          a("div", Sv, [
            P(o(qo))
          ]),
          de(a("select", {
            "onUpdate:modelValue": u[0] || (u[0] = (f) => o(e).fs.adapter = f),
            onChange: c,
            class: "vuefinder__status-bar__storage-select",
            tabindex: "-1"
          }, [
            (v(!0), h(ge, null, ye(o(e).fs.data.storages, (f) => (v(), h("option", { value: f }, b(f), 9, $v))), 256))
          ], 544), [
            [Jt, o(e).fs.adapter]
          ])
        ], 8, xv),
        a("div", Cv, [
          i.value.length ? (v(), h("span", Ev, b(o(e).fs.data.files.length) + " items found. ", 1)) : N("", !0),
          a("span", Tv, b(o(e).dragSelect.getCount() > 0 ? o(n)("%s item(s) selected.", o(e).dragSelect.getCount()) : ""), 1)
        ])
      ]),
      a("div", Av, [
        o(e).selectButton.active ? (v(), h("button", {
          key: 0,
          class: oe(["vf-btn py-0 vf-btn-primary", { disabled: !d.value }]),
          disabled: !d.value,
          onClick: u[1] || (u[1] = (f) => o(e).selectButton.click(o(s).getSelected(), f))
        }, b(o(n)("Select")), 11, Dv)) : N("", !0),
        a("span", {
          class: "vuefinder__status-bar__about",
          title: o(n)("About"),
          onClick: u[2] || (u[2] = (f) => o(e).modal.open(Do))
        }, [
          P(o(wv))
        ], 8, Mv)
      ])
    ]));
  }
}, Vv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "text-neutral-500 fill-sky-500 stroke-gray-100/50 dark:stroke-slate-700/50 dark:fill-slate-500",
  viewBox: "0 0 24 24"
};
function Lv(t, e) {
  return v(), h("svg", Vv, e[0] || (e[0] = [
    a("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3.75 9.776q.168-.026.344-.026h15.812q.176 0 .344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
    }, null, -1)
  ]));
}
const jo = { render: Lv }, Fv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Rv(t, e) {
  return v(), h("svg", Fv, e[0] || (e[0] = [
    a("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    a("path", { d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m3.6 5.2a1 1 0 0 0-1.4.2L12 10.333 9.8 7.4a1 1 0 1 0-1.6 1.2l2.55 3.4-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2-2.933 2.2 2.933a1 1 0 0 0 1.6-1.2L13.25 12l2.55-3.4a1 1 0 0 0-.2-1.4" }, null, -1)
  ]));
}
const Bv = { render: Rv }, Hv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function Iv(t, e) {
  return v(), h("svg", Hv, e[0] || (e[0] = [
    a("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    a("path", { d: "M15 12H9M12 9v6" }, null, -1)
  ]));
}
const Go = { render: Iv }, Uv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function Nv(t, e) {
  return v(), h("svg", Uv, e[0] || (e[0] = [
    a("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    a("path", { d: "M9 12h6" }, null, -1)
  ]));
}
const Ko = { render: Nv };
function Wo(t, e) {
  const n = t.findIndex((r) => r.path === e.path);
  n > -1 ? t[n] = e : t.push(e);
}
const Pv = { class: "vuefinder__folder-loader-indicator" }, zv = {
  key: 1,
  class: "vuefinder__folder-loader-indicator--icon"
}, Yo = {
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
    const r = Bs(t, "modelValue"), s = F(!1);
    Te(
      () => r.value,
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
        Wo(n.treeViewData, { path: e.path, ...d });
      }).catch((d) => {
      }).finally(() => {
        s.value = !1;
      });
    };
    return (d, l) => {
      var u;
      return v(), h("div", Pv, [
        s.value ? (v(), j(o(is), {
          key: 0,
          class: "vuefinder__folder-loader-indicator--loading"
        })) : (v(), h("div", zv, [
          r.value && ((u = c()) != null && u.folders.length) ? (v(), j(o(Ko), {
            key: 0,
            class: "vuefinder__folder-loader-indicator--minus"
          })) : N("", !0),
          r.value ? N("", !0) : (v(), j(o(Go), {
            key: 1,
            class: "vuefinder__folder-loader-indicator--plus"
          }))
        ]))
      ]);
    };
  }
}, qv = { class: "vuefinder__treesubfolderlist__item-content" }, jv = ["onClick"], Gv = ["title", "onClick"], Kv = { class: "vuefinder__treesubfolderlist__item-icon" }, Wv = { class: "vuefinder__treesubfolderlist__subfolder" }, Yv = {
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
    const e = re("ServiceContainer"), n = F([]), r = t, s = F(null);
    Se(() => {
      r.path === r.adapter + "://" && je(s.value, {
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    });
    const c = rt(() => {
      var i;
      return ((i = e.treeViewData.find((d) => d.path === r.path)) == null ? void 0 : i.folders) || [];
    });
    return (i, d) => {
      const l = ir("TreeSubfolderList", !0);
      return v(), h("ul", {
        ref_key: "parentSubfolderList",
        ref: s,
        class: "vuefinder__treesubfolderlist__container"
      }, [
        (v(!0), h(ge, null, ye(c.value, (u, f) => (v(), h("li", {
          key: u.path,
          class: "vuefinder__treesubfolderlist__item"
        }, [
          a("div", qv, [
            a("div", {
              class: "vuefinder__treesubfolderlist__item-toggle",
              onClick: (_) => n.value[u.path] = !n.value[u.path]
            }, [
              P(Yo, {
                adapter: t.adapter,
                path: u.path,
                modelValue: n.value[u.path],
                "onUpdate:modelValue": (_) => n.value[u.path] = _
              }, null, 8, ["adapter", "path", "modelValue", "onUpdate:modelValue"])
            ], 8, jv),
            a("div", {
              class: "vuefinder__treesubfolderlist__item-link",
              title: u.path,
              onClick: (_) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: r.adapter, path: u.path } })
            }, [
              a("div", Kv, [
                o(e).fs.path === u.path ? (v(), j(o(jo), { key: 0 })) : (v(), j(o(hn), { key: 1 }))
              ]),
              a("div", {
                class: oe(["vuefinder__treesubfolderlist__item-text", {
                  "vuefinder__treesubfolderlist__item-text--active": o(e).fs.path === u.path
                }])
              }, b(u.basename), 3)
            ], 8, Gv)
          ]),
          a("div", Wv, [
            de(P(l, {
              adapter: r.adapter,
              path: u.path
            }, null, 8, ["adapter", "path"]), [
              [Ne, n.value[u.path]]
            ])
          ])
        ]))), 128))
      ], 512);
    };
  }
}, Xv = { class: "vuefinder__treestorageitem__loader" }, Jv = {
  __name: "TreeStorageItem",
  props: {
    storage: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = F(!1);
    return (r, s) => (v(), h(ge, null, [
      a("div", {
        onClick: s[1] || (s[1] = (c) => n.value = !n.value),
        class: "vuefinder__treestorageitem__header"
      }, [
        a("div", {
          class: oe(["vuefinder__treestorageitem__info", t.storage === o(e).fs.adapter ? "vuefinder__treestorageitem__info--active" : ""])
        }, [
          a("div", {
            class: oe(["vuefinder__treestorageitem__icon", t.storage === o(e).fs.adapter ? "vuefinder__treestorageitem__icon--active" : ""])
          }, [
            P(o(qo))
          ], 2),
          a("div", null, b(t.storage), 1)
        ], 2),
        a("div", Xv, [
          P(Yo, {
            adapter: t.storage,
            path: t.storage + "://",
            modelValue: n.value,
            "onUpdate:modelValue": s[0] || (s[0] = (c) => n.value = c)
          }, null, 8, ["adapter", "path", "modelValue"])
        ])
      ]),
      de(P(Yv, {
        adapter: t.storage,
        path: t.storage + "://",
        class: "vuefinder__treestorageitem__subfolder"
      }, null, 8, ["adapter", "path"]), [
        [Ne, n.value]
      ])
    ], 64));
  }
}, Zv = { class: "vuefinder__folder-indicator" }, Qv = { class: "vuefinder__folder-indicator--icon" }, e_ = {
  __name: "FolderIndicator",
  props: {
    modelValue: {},
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(t) {
    const e = Bs(t, "modelValue");
    return (n, r) => (v(), h("div", Zv, [
      a("div", Qv, [
        e.value ? (v(), j(o(Ko), {
          key: 0,
          class: "vuefinder__folder-indicator--minus"
        })) : N("", !0),
        e.value ? N("", !0) : (v(), j(o(Go), {
          key: 1,
          class: "vuefinder__folder-indicator--plus"
        }))
      ])
    ]));
  }
}, t_ = { class: "vuefinder__treeview__header" }, n_ = { class: "vuefinder__treeview__pinned-label" }, s_ = { class: "vuefinder__treeview__pin-text text-nowrap" }, o_ = {
  key: 0,
  class: "vuefinder__treeview__pinned-list"
}, r_ = { class: "vuefinder__treeview__pinned-item" }, a_ = ["onClick"], l_ = ["title"], i_ = ["onClick"], c_ = { key: 0 }, d_ = { class: "vuefinder__treeview__no-pinned" }, u_ = { class: "vuefinder__treeview__storage" }, v_ = {
  __name: "TreeView",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { getStore: r, setStore: s } = e.storage, c = F(190), i = F(r("pinned-folders-opened", !0));
    Te(i, (f) => s("pinned-folders-opened", f));
    const d = (f) => {
      e.pinnedFolders = e.pinnedFolders.filter((_) => _.path !== f.path), e.storage.setStore("pinned-folders", e.pinnedFolders);
    }, l = (f) => {
      const _ = f.clientX, m = f.target.parentElement, p = m.getBoundingClientRect().width;
      m.classList.remove("transition-[width]"), m.classList.add("transition-none");
      const w = (g) => {
        c.value = p + g.clientX - _, c.value < 50 && (c.value = 0, e.showTreeView = !1), c.value > 50 && (e.showTreeView = !0);
      }, R = () => {
        const g = m.getBoundingClientRect();
        c.value = g.width, m.classList.add("transition-[width]"), m.classList.remove("transition-none"), window.removeEventListener("mousemove", w), window.removeEventListener("mouseup", R);
      };
      window.addEventListener("mousemove", w), window.addEventListener("mouseup", R);
    }, u = F(null);
    return Se(() => {
      je(u.value, {
        overflow: {
          x: "hidden"
        },
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    }), Te(e.fs.data, (f, _) => {
      const m = f.files.filter((p) => p.type === "dir");
      Wo(e.treeViewData, { path: e.fs.path, folders: m.map((p) => ({
        adapter: p.storage,
        path: p.path,
        basename: p.basename
      })) });
    }), (f, _) => (v(), h(ge, null, [
      a("div", {
        onClick: _[0] || (_[0] = (m) => o(e).showTreeView = !o(e).showTreeView),
        class: oe(["vuefinder__treeview__overlay", o(e).showTreeView ? "vuefinder__treeview__backdrop" : "hidden"])
      }, null, 2),
      a("div", {
        style: ln(o(e).showTreeView ? "min-width:100px;max-width:75%; width: " + c.value + "px" : "width: 0"),
        class: "vuefinder__treeview__container"
      }, [
        a("div", {
          ref_key: "treeViewScrollElement",
          ref: u,
          class: "vuefinder__treeview__scroll"
        }, [
          a("div", t_, [
            a("div", {
              onClick: _[2] || (_[2] = (m) => i.value = !i.value),
              class: "vuefinder__treeview__pinned-toggle"
            }, [
              a("div", n_, [
                P(o(zo), { class: "vuefinder__treeview__pin-icon" }),
                a("div", s_, b(o(n)("Pinned Folders")), 1)
              ]),
              P(e_, {
                modelValue: i.value,
                "onUpdate:modelValue": _[1] || (_[1] = (m) => i.value = m)
              }, null, 8, ["modelValue"])
            ]),
            i.value ? (v(), h("ul", o_, [
              (v(!0), h(ge, null, ye(o(e).pinnedFolders, (m) => (v(), h("li", r_, [
                a("div", {
                  class: "vuefinder__treeview__pinned-folder",
                  onClick: (p) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: m.storage, path: m.path } })
                }, [
                  o(e).fs.path !== m.path ? (v(), j(o(hn), {
                    key: 0,
                    class: "vuefinder__treeview__folder-icon"
                  })) : N("", !0),
                  o(e).fs.path === m.path ? (v(), j(o(jo), {
                    key: 1,
                    class: "vuefinder__treeview__open-folder-icon"
                  })) : N("", !0),
                  a("div", {
                    title: m.path,
                    class: oe(["vuefinder__treeview__folder-name text-nowrap", {
                      "vuefinder__treeview__folder-name--active": o(e).fs.path === m.path
                    }])
                  }, b(m.basename), 11, l_)
                ], 8, a_),
                a("div", {
                  class: "vuefinder__treeview__remove-favorite",
                  onClick: (p) => d(m)
                }, [
                  P(o(Bv), { class: "vuefinder__treeview__remove-icon" })
                ], 8, i_)
              ]))), 256)),
              o(e).pinnedFolders.length ? N("", !0) : (v(), h("li", c_, [
                a("div", d_, b(o(n)("No folders pinned")), 1)
              ]))
            ])) : N("", !0)
          ]),
          (v(!0), h(ge, null, ye(o(e).fs.data.storages, (m) => (v(), h("div", u_, [
            P(Jv, { storage: m }, null, 8, ["storage"])
          ]))), 256))
        ], 512),
        a("div", {
          onMousedown: l,
          class: oe([(o(e).showTreeView, ""), "vuefinder__treeview__resize-handle"])
        }, null, 34)
      ], 4)
    ], 64));
  }
}, __ = { class: "vuefinder__main__content" }, f_ = {
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
    const n = e, s = Ma(t, re("VueFinderOptions"));
    cr("ServiceContainer", s);
    const { setStore: c } = s.storage, i = F(null);
    s.root = i;
    const d = s.dragSelect;
    ii(s);
    const l = (f) => {
      Object.assign(s.fs.data, f), d.clearSelection(), d.refreshSelection();
    };
    let u;
    return s.emitter.on("vf-fetch-abort", () => {
      u.abort(), s.fs.loading = !1;
    }), s.emitter.on("vf-fetch", ({ params: f, body: _ = null, onSuccess: m = null, onError: p = null, noCloseModal: w = !1 }) => {
      ["index", "search"].includes(f.q) && (u && u.abort(), s.fs.loading = !0), u = new AbortController();
      const R = u.signal;
      s.requester.send({
        url: "",
        method: f.m || "get",
        params: f,
        body: _,
        abortSignal: R
      }).then((g) => {
        s.fs.adapter = g.adapter, s.persist && (s.fs.path = g.dirname, c("path", s.fs.path)), ["index", "search"].includes(f.q) && (s.fs.loading = !1), w || s.modal.close(), l(g), m && m(g);
      }).catch((g) => {
        console.error(g), p && p(g);
      });
    }), Se(() => {
      let f = {};
      s.fs.path.includes("://") && (f = {
        adapter: s.fs.path.split("://")[0],
        path: s.fs.path
      }), s.emitter.emit("vf-fetch", { params: { q: "index", adapter: s.fs.adapter, ...f } }), d.onSelect((_) => {
        n("select", _);
      });
    }), (f, _) => (v(), h("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: i,
      tabindex: "0"
    }, [
      a("div", {
        class: oe(o(s).theme.actualValue)
      }, [
        a("div", {
          class: oe([o(s).fullScreen ? "vuefinder__main__fixed" : "vuefinder__main__relative", "vuefinder__main__container"]),
          style: ln(o(s).fullScreen ? "" : "max-height: " + t.maxHeight),
          onMousedown: _[0] || (_[0] = (m) => o(s).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: _[1] || (_[1] = (m) => o(s).emitter.emit("vf-contextmenu-hide"))
        }, [
          P(Fc),
          P(Hd),
          a("div", __, [
            P(v_),
            P(vv)
          ]),
          P(Ov)
        ], 38),
        P(dr, { name: "fade" }, {
          default: J(() => [
            o(s).modal.visible ? (v(), j(Fs(o(s).modal.type), { key: 0 })) : N("", !0)
          ]),
          _: 1
        }),
        P(mv)
      ], 2)
    ], 512));
  }
}, S_ = {
  /**
   * @param {import('vue').App} app
   * @param options
   */
  install(t, e = {}) {
    e.i18n = e.i18n ?? {};
    let [n] = Object.keys(e.i18n);
    e.locale = e.locale ?? n ?? "en", t.provide("VueFinderOptions", e), t.component("VueFinder", f_);
  }
};
export {
  S_ as default
};
