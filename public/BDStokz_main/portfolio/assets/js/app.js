/**
 * SimpleBar.js - v5.3.0
 * Scrollbars, simpler.
 * https://grsmto.github.io/simplebar/
 *
 * Made by Adrien Denat from a fork by Jonathan Nicol
 * Under MIT License
 */

! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = t || self).SimpleBar = e()
}(this, (function() {
    "use strict";
    var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

    function e(t, e) {
        return t(e = {
            exports: {}
        }, e.exports), e.exports
    }
    var r, n, i, o = "object",
        s = function(t) {
            return t && t.Math == Math && t
        },
        a = s(typeof globalThis == o && globalThis) || s(typeof window == o && window) || s(typeof self == o && self) || s(typeof t == o && t) || Function("return this")(),
        c = function(t) {
            try {
                return !!t()
            } catch (t) {
                return !0
            }
        },
        l = !c((function() {
            return 7 != Object.defineProperty({}, "a", {
                get: function() {
                    return 7
                }
            }).a
        })),
        u = {}.propertyIsEnumerable,
        f = Object.getOwnPropertyDescriptor,
        h = {
            f: f && !u.call({
                1: 2
            }, 1) ? function(t) {
                var e = f(this, t);
                return !!e && e.enumerable
            } : u
        },
        d = function(t, e) {
            return {
                enumerable: !(1 & t),
                configurable: !(2 & t),
                writable: !(4 & t),
                value: e
            }
        },
        p = {}.toString,
        v = function(t) {
            return p.call(t).slice(8, -1)
        },
        g = "".split,
        y = c((function() {
            return !Object("z").propertyIsEnumerable(0)
        })) ? function(t) {
            return "String" == v(t) ? g.call(t, "") : Object(t)
        } : Object,
        b = function(t) {
            if (null == t) throw TypeError("Can't call method on " + t);
            return t
        },
        m = function(t) {
            return y(b(t))
        },
        x = function(t) {
            return "object" == typeof t ? null !== t : "function" == typeof t
        },
        E = function(t, e) {
            if (!x(t)) return t;
            var r, n;
            if (e && "function" == typeof(r = t.toString) && !x(n = r.call(t))) return n;
            if ("function" == typeof(r = t.valueOf) && !x(n = r.call(t))) return n;
            if (!e && "function" == typeof(r = t.toString) && !x(n = r.call(t))) return n;
            throw TypeError("Can't convert object to primitive value")
        },
        w = {}.hasOwnProperty,
        O = function(t, e) {
            return w.call(t, e)
        },
        _ = a.document,
        S = x(_) && x(_.createElement),
        A = function(t) {
            return S ? _.createElement(t) : {}
        },
        k = !l && !c((function() {
            return 7 != Object.defineProperty(A("div"), "a", {
                get: function() {
                    return 7
                }
            }).a
        })),
        L = Object.getOwnPropertyDescriptor,
        M = {
            f: l ? L : function(t, e) {
                if (t = m(t), e = E(e, !0), k) try {
                    return L(t, e)
                } catch (t) {}
                if (O(t, e)) return d(!h.f.call(t, e), t[e])
            }
        },
        T = function(t) {
            if (!x(t)) throw TypeError(String(t) + " is not an object");
            return t
        },
        j = Object.defineProperty,
        R = {
            f: l ? j : function(t, e, r) {
                if (T(t), e = E(e, !0), T(r), k) try {
                    return j(t, e, r)
                } catch (t) {}
                if ("get" in r || "set" in r) throw TypeError("Accessors not supported");
                return "value" in r && (t[e] = r.value), t
            }
        },
        W = l ? function(t, e, r) {
            return R.f(t, e, d(1, r))
        } : function(t, e, r) {
            return t[e] = r, t
        },
        z = function(t, e) {
            try {
                W(a, t, e)
            } catch (r) {
                a[t] = e
            }
            return e
        },
        C = e((function(t) {
            var e = a["__core-js_shared__"] || z("__core-js_shared__", {});
            (t.exports = function(t, r) {
                return e[t] || (e[t] = void 0 !== r ? r : {})
            })("versions", []).push({
                version: "3.2.1",
                mode: "global",
                copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
            })
        })),
        N = C("native-function-to-string", Function.toString),
        I = a.WeakMap,
        D = "function" == typeof I && /native code/.test(N.call(I)),
        P = 0,
        V = Math.random(),
        F = function(t) {
            return "Symbol(" + String(void 0 === t ? "" : t) + ")_" + (++P + V).toString(36)
        },
        B = C("keys"),
        H = function(t) {
            return B[t] || (B[t] = F(t))
        },
        q = {},
        $ = a.WeakMap;
    if (D) {
        var X = new $,
            Y = X.get,
            G = X.has,
            U = X.set;
        r = function(t, e) {
            return U.call(X, t, e), e
        }, n = function(t) {
            return Y.call(X, t) || {}
        }, i = function(t) {
            return G.call(X, t)
        }
    } else {
        var Q = H("state");
        q[Q] = !0, r = function(t, e) {
            return W(t, Q, e), e
        }, n = function(t) {
            return O(t, Q) ? t[Q] : {}
        }, i = function(t) {
            return O(t, Q)
        }
    }
    var K = {
            set: r,
            get: n,
            has: i,
            enforce: function(t) {
                return i(t) ? n(t) : r(t, {})
            },
            getterFor: function(t) {
                return function(e) {
                    var r;
                    if (!x(e) || (r = n(e)).type !== t) throw TypeError("Incompatible receiver, " + t + " required");
                    return r
                }
            }
        },
        J = e((function(t) {
            var e = K.get,
                r = K.enforce,
                n = String(N).split("toString");
            C("inspectSource", (function(t) {
                return N.call(t)
            })), (t.exports = function(t, e, i, o) {
                var s = !!o && !!o.unsafe,
                    c = !!o && !!o.enumerable,
                    l = !!o && !!o.noTargetGet;
                "function" == typeof i && ("string" != typeof e || O(i, "name") || W(i, "name", e), r(i).source = n.join("string" == typeof e ? e : "")), t !== a ? (s ? !l && t[e] && (c = !0) : delete t[e], c ? t[e] = i : W(t, e, i)) : c ? t[e] = i : z(e, i)
            })(Function.prototype, "toString", (function() {
                return "function" == typeof this && e(this).source || N.call(this)
            }))
        })),
        Z = a,
        tt = function(t) {
            return "function" == typeof t ? t : void 0
        },
        et = function(t, e) {
            return arguments.length < 2 ? tt(Z[t]) || tt(a[t]) : Z[t] && Z[t][e] || a[t] && a[t][e]
        },
        rt = Math.ceil,
        nt = Math.floor,
        it = function(t) {
            return isNaN(t = +t) ? 0 : (t > 0 ? nt : rt)(t)
        },
        ot = Math.min,
        st = function(t) {
            return t > 0 ? ot(it(t), 9007199254740991) : 0
        },
        at = Math.max,
        ct = Math.min,
        lt = function(t) {
            return function(e, r, n) {
                var i, o = m(e),
                    s = st(o.length),
                    a = function(t, e) {
                        var r = it(t);
                        return r < 0 ? at(r + e, 0) : ct(r, e)
                    }(n, s);
                if (t && r != r) {
                    for (; s > a;)
                        if ((i = o[a++]) != i) return !0
                } else
                    for (; s > a; a++)
                        if ((t || a in o) && o[a] === r) return t || a || 0;
                return !t && -1
            }
        },
        ut = {
            includes: lt(!0),
            indexOf: lt(!1)
        }.indexOf,
        ft = function(t, e) {
            var r, n = m(t),
                i = 0,
                o = [];
            for (r in n) !O(q, r) && O(n, r) && o.push(r);
            for (; e.length > i;) O(n, r = e[i++]) && (~ut(o, r) || o.push(r));
            return o
        },
        ht = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],
        dt = ht.concat("length", "prototype"),
        pt = {
            f: Object.getOwnPropertyNames || function(t) {
                return ft(t, dt)
            }
        },
        vt = {
            f: Object.getOwnPropertySymbols
        },
        gt = et("Reflect", "ownKeys") || function(t) {
            var e = pt.f(T(t)),
                r = vt.f;
            return r ? e.concat(r(t)) : e
        },
        yt = function(t, e) {
            for (var r = gt(e), n = R.f, i = M.f, o = 0; o < r.length; o++) {
                var s = r[o];
                O(t, s) || n(t, s, i(e, s))
            }
        },
        bt = /#|\.prototype\./,
        mt = function(t, e) {
            var r = Et[xt(t)];
            return r == Ot || r != wt && ("function" == typeof e ? c(e) : !!e)
        },
        xt = mt.normalize = function(t) {
            return String(t).replace(bt, ".").toLowerCase()
        },
        Et = mt.data = {},
        wt = mt.NATIVE = "N",
        Ot = mt.POLYFILL = "P",
        _t = mt,
        St = M.f,
        At = function(t, e) {
            var r, n, i, o, s, c = t.target,
                l = t.global,
                u = t.stat;
            if (r = l ? a : u ? a[c] || z(c, {}) : (a[c] || {}).prototype)
                for (n in e) {
                    if (o = e[n], i = t.noTargetGet ? (s = St(r, n)) && s.value : r[n], !_t(l ? n : c + (u ? "." : "#") + n, t.forced) && void 0 !== i) {
                        if (typeof o == typeof i) continue;
                        yt(o, i)
                    }(t.sham || i && i.sham) && W(o, "sham", !0), J(r, n, o, t)
                }
        },
        kt = function(t) {
            if ("function" != typeof t) throw TypeError(String(t) + " is not a function");
            return t
        },
        Lt = function(t, e, r) {
            if (kt(t), void 0 === e) return t;
            switch (r) {
                case 0:
                    return function() {
                        return t.call(e)
                    };
                case 1:
                    return function(r) {
                        return t.call(e, r)
                    };
                case 2:
                    return function(r, n) {
                        return t.call(e, r, n)
                    };
                case 3:
                    return function(r, n, i) {
                        return t.call(e, r, n, i)
                    }
            }
            return function() {
                return t.apply(e, arguments)
            }
        },
        Mt = function(t) {
            return Object(b(t))
        },
        Tt = Array.isArray || function(t) {
            return "Array" == v(t)
        },
        jt = !!Object.getOwnPropertySymbols && !c((function() {
            return !String(Symbol())
        })),
        Rt = a.Symbol,
        Wt = C("wks"),
        zt = function(t) {
            return Wt[t] || (Wt[t] = jt && Rt[t] || (jt ? Rt : F)("Symbol." + t))
        },
        Ct = zt("species"),
        Nt = function(t, e) {
            var r;
            return Tt(t) && ("function" != typeof(r = t.constructor) || r !== Array && !Tt(r.prototype) ? x(r) && null === (r = r[Ct]) && (r = void 0) : r = void 0), new(void 0 === r ? Array : r)(0 === e ? 0 : e)
        },
        It = [].push,
        Dt = function(t) {
            var e = 1 == t,
                r = 2 == t,
                n = 3 == t,
                i = 4 == t,
                o = 6 == t,
                s = 5 == t || o;
            return function(a, c, l, u) {
                for (var f, h, d = Mt(a), p = y(d), v = Lt(c, l, 3), g = st(p.length), b = 0, m = u || Nt, x = e ? m(a, g) : r ? m(a, 0) : void 0; g > b; b++)
                    if ((s || b in p) && (h = v(f = p[b], b, d), t))
                        if (e) x[b] = h;
                        else if (h) switch (t) {
                    case 3:
                        return !0;
                    case 5:
                        return f;
                    case 6:
                        return b;
                    case 2:
                        It.call(x, f)
                } else if (i) return !1;
                return o ? -1 : n || i ? i : x
            }
        },
        Pt = {
            forEach: Dt(0),
            map: Dt(1),
            filter: Dt(2),
            some: Dt(3),
            every: Dt(4),
            find: Dt(5),
            findIndex: Dt(6)
        },
        Vt = function(t, e) {
            var r = [][t];
            return !r || !c((function() {
                r.call(null, e || function() {
                    throw 1
                }, 1)
            }))
        },
        Ft = Pt.forEach,
        Bt = Vt("forEach") ? function(t) {
            return Ft(this, t, arguments.length > 1 ? arguments[1] : void 0)
        } : [].forEach;
    At({
        target: "Array",
        proto: !0,
        forced: [].forEach != Bt
    }, {
        forEach: Bt
    });
    var Ht = {
        CSSRuleList: 0,
        CSSStyleDeclaration: 0,
        CSSValueList: 0,
        ClientRectList: 0,
        DOMRectList: 0,
        DOMStringList: 0,
        DOMTokenList: 1,
        DataTransferItemList: 0,
        FileList: 0,
        HTMLAllCollection: 0,
        HTMLCollection: 0,
        HTMLFormElement: 0,
        HTMLSelectElement: 0,
        MediaList: 0,
        MimeTypeArray: 0,
        NamedNodeMap: 0,
        NodeList: 1,
        PaintRequestList: 0,
        Plugin: 0,
        PluginArray: 0,
        SVGLengthList: 0,
        SVGNumberList: 0,
        SVGPathSegList: 0,
        SVGPointList: 0,
        SVGStringList: 0,
        SVGTransformList: 0,
        SourceBufferList: 0,
        StyleSheetList: 0,
        TextTrackCueList: 0,
        TextTrackList: 0,
        TouchList: 0
    };
    for (var qt in Ht) {
        var $t = a[qt],
            Xt = $t && $t.prototype;
        if (Xt && Xt.forEach !== Bt) try {
            W(Xt, "forEach", Bt)
        } catch (t) {
            Xt.forEach = Bt
        }
    }
    var Yt = !("undefined" == typeof window || !window.document || !window.document.createElement),
        Gt = zt("species"),
        Ut = Pt.filter;
    At({
        target: "Array",
        proto: !0,
        forced: ! function(t) {
            return !c((function() {
                var e = [];
                return (e.constructor = {})[Gt] = function() {
                    return {
                        foo: 1
                    }
                }, 1 !== e[t](Boolean).foo
            }))
        }("filter")
    }, {
        filter: function(t) {
            return Ut(this, t, arguments.length > 1 ? arguments[1] : void 0)
        }
    });
    var Qt = Object.keys || function(t) {
            return ft(t, ht)
        },
        Kt = l ? Object.defineProperties : function(t, e) {
            T(t);
            for (var r, n = Qt(e), i = n.length, o = 0; i > o;) R.f(t, r = n[o++], e[r]);
            return t
        },
        Jt = et("document", "documentElement"),
        Zt = H("IE_PROTO"),
        te = function() {},
        ee = function() {
            var t, e = A("iframe"),
                r = ht.length;
            for (e.style.display = "none", Jt.appendChild(e), e.src = String("javascript:"), (t = e.contentWindow.document).open(), t.write("<script>document.F=Object<\/script>"), t.close(), ee = t.F; r--;) delete ee.prototype[ht[r]];
            return ee()
        },
        re = Object.create || function(t, e) {
            var r;
            return null !== t ? (te.prototype = T(t), r = new te, te.prototype = null, r[Zt] = t) : r = ee(), void 0 === e ? r : Kt(r, e)
        };
    q[Zt] = !0;
    var ne = zt("unscopables"),
        ie = Array.prototype;
    null == ie[ne] && W(ie, ne, re(null));
    var oe, se, ae, ce = function(t) {
            ie[ne][t] = !0
        },
        le = {},
        ue = !c((function() {
            function t() {}
            return t.prototype.constructor = null, Object.getPrototypeOf(new t) !== t.prototype
        })),
        fe = H("IE_PROTO"),
        he = Object.prototype,
        de = ue ? Object.getPrototypeOf : function(t) {
            return t = Mt(t), O(t, fe) ? t[fe] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? he : null
        },
        pe = zt("iterator"),
        ve = !1;
    [].keys && ("next" in (ae = [].keys()) ? (se = de(de(ae))) !== Object.prototype && (oe = se) : ve = !0), null == oe && (oe = {}), O(oe, pe) || W(oe, pe, (function() {
        return this
    }));
    var ge = {
            IteratorPrototype: oe,
            BUGGY_SAFARI_ITERATORS: ve
        },
        ye = R.f,
        be = zt("toStringTag"),
        me = function(t, e, r) {
            t && !O(t = r ? t : t.prototype, be) && ye(t, be, {
                configurable: !0,
                value: e
            })
        },
        xe = ge.IteratorPrototype,
        Ee = function() {
            return this
        },
        we = Object.setPrototypeOf || ("__proto__" in {} ? function() {
            var t, e = !1,
                r = {};
            try {
                (t = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set).call(r, []), e = r instanceof Array
            } catch (t) {}
            return function(r, n) {
                return T(r),
                    function(t) {
                        if (!x(t) && null !== t) throw TypeError("Can't set " + String(t) + " as a prototype")
                    }(n), e ? t.call(r, n) : r.__proto__ = n, r
            }
        }() : void 0),
        Oe = ge.IteratorPrototype,
        _e = ge.BUGGY_SAFARI_ITERATORS,
        Se = zt("iterator"),
        Ae = function() {
            return this
        },
        ke = function(t, e, r, n, i, o, s) {
            ! function(t, e, r) {
                var n = e + " Iterator";
                t.prototype = re(xe, {
                    next: d(1, r)
                }), me(t, n, !1), le[n] = Ee
            }(r, e, n);
            var a, c, l, u = function(t) {
                    if (t === i && g) return g;
                    if (!_e && t in p) return p[t];
                    switch (t) {
                        case "keys":
                        case "values":
                        case "entries":
                            return function() {
                                return new r(this, t)
                            }
                    }
                    return function() {
                        return new r(this)
                    }
                },
                f = e + " Iterator",
                h = !1,
                p = t.prototype,
                v = p[Se] || p["@@iterator"] || i && p[i],
                g = !_e && v || u(i),
                y = "Array" == e && p.entries || v;
            if (y && (a = de(y.call(new t)), Oe !== Object.prototype && a.next && (de(a) !== Oe && (we ? we(a, Oe) : "function" != typeof a[Se] && W(a, Se, Ae)), me(a, f, !0))), "values" == i && v && "values" !== v.name && (h = !0, g = function() {
                    return v.call(this)
                }), p[Se] !== g && W(p, Se, g), le[e] = g, i)
                if (c = {
                        values: u("values"),
                        keys: o ? g : u("keys"),
                        entries: u("entries")
                    }, s)
                    for (l in c) !_e && !h && l in p || J(p, l, c[l]);
                else At({
                    target: e,
                    proto: !0,
                    forced: _e || h
                }, c);
            return c
        },
        Le = K.set,
        Me = K.getterFor("Array Iterator"),
        Te = ke(Array, "Array", (function(t, e) {
            Le(this, {
                type: "Array Iterator",
                target: m(t),
                index: 0,
                kind: e
            })
        }), (function() {
            var t = Me(this),
                e = t.target,
                r = t.kind,
                n = t.index++;
            return !e || n >= e.length ? (t.target = void 0, {
                value: void 0,
                done: !0
            }) : "keys" == r ? {
                value: n,
                done: !1
            } : "values" == r ? {
                value: e[n],
                done: !1
            } : {
                value: [n, e[n]],
                done: !1
            }
        }), "values");
    le.Arguments = le.Array, ce("keys"), ce("values"), ce("entries");
    var je = Object.assign,
        Re = !je || c((function() {
            var t = {},
                e = {},
                r = Symbol();
            return t[r] = 7, "abcdefghijklmnopqrst".split("").forEach((function(t) {
                e[t] = t
            })), 7 != je({}, t)[r] || "abcdefghijklmnopqrst" != Qt(je({}, e)).join("")
        })) ? function(t, e) {
            for (var r = Mt(t), n = arguments.length, i = 1, o = vt.f, s = h.f; n > i;)
                for (var a, c = y(arguments[i++]), u = o ? Qt(c).concat(o(c)) : Qt(c), f = u.length, d = 0; f > d;) a = u[d++], l && !s.call(c, a) || (r[a] = c[a]);
            return r
        } : je;
    At({
        target: "Object",
        stat: !0,
        forced: Object.assign !== Re
    }, {
        assign: Re
    });
    var We = zt("toStringTag"),
        ze = "Arguments" == v(function() {
            return arguments
        }()),
        Ce = function(t) {
            var e, r, n;
            return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof(r = function(t, e) {
                try {
                    return t[e]
                } catch (t) {}
            }(e = Object(t), We)) ? r : ze ? v(e) : "Object" == (n = v(e)) && "function" == typeof e.callee ? "Arguments" : n
        },
        Ne = {};
    Ne[zt("toStringTag")] = "z";
    var Ie = "[object z]" !== String(Ne) ? function() {
            return "[object " + Ce(this) + "]"
        } : Ne.toString,
        De = Object.prototype;
    Ie !== De.toString && J(De, "toString", Ie, {
        unsafe: !0
    });
    var Pe = "\t\n\v\f\r                　\u2028\u2029\ufeff",
        Ve = "[" + Pe + "]",
        Fe = RegExp("^" + Ve + Ve + "*"),
        Be = RegExp(Ve + Ve + "*$"),
        He = function(t) {
            return function(e) {
                var r = String(b(e));
                return 1 & t && (r = r.replace(Fe, "")), 2 & t && (r = r.replace(Be, "")), r
            }
        },
        qe = {
            start: He(1),
            end: He(2),
            trim: He(3)
        }.trim,
        $e = a.parseInt,
        Xe = /^[+-]?0[Xx]/,
        Ye = 8 !== $e(Pe + "08") || 22 !== $e(Pe + "0x16") ? function(t, e) {
            var r = qe(String(t));
            return $e(r, e >>> 0 || (Xe.test(r) ? 16 : 10))
        } : $e;
    At({
        global: !0,
        forced: parseInt != Ye
    }, {
        parseInt: Ye
    });
    var Ge = function(t) {
            return function(e, r) {
                var n, i, o = String(b(e)),
                    s = it(r),
                    a = o.length;
                return s < 0 || s >= a ? t ? "" : void 0 : (n = o.charCodeAt(s)) < 55296 || n > 56319 || s + 1 === a || (i = o.charCodeAt(s + 1)) < 56320 || i > 57343 ? t ? o.charAt(s) : n : t ? o.slice(s, s + 2) : i - 56320 + (n - 55296 << 10) + 65536
            }
        },
        Ue = {
            codeAt: Ge(!1),
            charAt: Ge(!0)
        },
        Qe = Ue.charAt,
        Ke = K.set,
        Je = K.getterFor("String Iterator");
    ke(String, "String", (function(t) {
        Ke(this, {
            type: "String Iterator",
            string: String(t),
            index: 0
        })
    }), (function() {
        var t, e = Je(this),
            r = e.string,
            n = e.index;
        return n >= r.length ? {
            value: void 0,
            done: !0
        } : (t = Qe(r, n), e.index += t.length, {
            value: t,
            done: !1
        })
    }));
    var Ze = function(t, e, r) {
            for (var n in e) J(t, n, e[n], r);
            return t
        },
        tr = !c((function() {
            return Object.isExtensible(Object.preventExtensions({}))
        })),
        er = e((function(t) {
            var e = R.f,
                r = F("meta"),
                n = 0,
                i = Object.isExtensible || function() {
                    return !0
                },
                o = function(t) {
                    e(t, r, {
                        value: {
                            objectID: "O" + ++n,
                            weakData: {}
                        }
                    })
                },
                s = t.exports = {
                    REQUIRED: !1,
                    fastKey: function(t, e) {
                        if (!x(t)) return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;
                        if (!O(t, r)) {
                            if (!i(t)) return "F";
                            if (!e) return "E";
                            o(t)
                        }
                        return t[r].objectID
                    },
                    getWeakData: function(t, e) {
                        if (!O(t, r)) {
                            if (!i(t)) return !0;
                            if (!e) return !1;
                            o(t)
                        }
                        return t[r].weakData
                    },
                    onFreeze: function(t) {
                        return tr && s.REQUIRED && i(t) && !O(t, r) && o(t), t
                    }
                };
            q[r] = !0
        })),
        rr = (er.REQUIRED, er.fastKey, er.getWeakData, er.onFreeze, zt("iterator")),
        nr = Array.prototype,
        ir = zt("iterator"),
        or = function(t, e, r, n) {
            try {
                return n ? e(T(r)[0], r[1]) : e(r)
            } catch (e) {
                var i = t.return;
                throw void 0 !== i && T(i.call(t)), e
            }
        },
        sr = e((function(t) {
            var e = function(t, e) {
                this.stopped = t, this.result = e
            };
            (t.exports = function(t, r, n, i, o) {
                var s, a, c, l, u, f, h, d = Lt(r, n, i ? 2 : 1);
                if (o) s = t;
                else {
                    if ("function" != typeof(a = function(t) {
                            if (null != t) return t[ir] || t["@@iterator"] || le[Ce(t)]
                        }(t))) throw TypeError("Target is not iterable");
                    if (void 0 !== (h = a) && (le.Array === h || nr[rr] === h)) {
                        for (c = 0, l = st(t.length); l > c; c++)
                            if ((u = i ? d(T(f = t[c])[0], f[1]) : d(t[c])) && u instanceof e) return u;
                        return new e(!1)
                    }
                    s = a.call(t)
                }
                for (; !(f = s.next()).done;)
                    if ((u = or(s, d, f.value, i)) && u instanceof e) return u;
                return new e(!1)
            }).stop = function(t) {
                return new e(!0, t)
            }
        })),
        ar = function(t, e, r) {
            if (!(t instanceof e)) throw TypeError("Incorrect " + (r ? r + " " : "") + "invocation");
            return t
        },
        cr = zt("iterator"),
        lr = !1;
    try {
        var ur = 0,
            fr = {
                next: function() {
                    return {
                        done: !!ur++
                    }
                },
                return: function() {
                    lr = !0
                }
            };
        fr[cr] = function() {
            return this
        }, Array.from(fr, (function() {
            throw 2
        }))
    } catch (t) {}
    var hr = function(t, e, r, n, i) {
            var o = a[t],
                s = o && o.prototype,
                l = o,
                u = n ? "set" : "add",
                f = {},
                h = function(t) {
                    var e = s[t];
                    J(s, t, "add" == t ? function(t) {
                        return e.call(this, 0 === t ? 0 : t), this
                    } : "delete" == t ? function(t) {
                        return !(i && !x(t)) && e.call(this, 0 === t ? 0 : t)
                    } : "get" == t ? function(t) {
                        return i && !x(t) ? void 0 : e.call(this, 0 === t ? 0 : t)
                    } : "has" == t ? function(t) {
                        return !(i && !x(t)) && e.call(this, 0 === t ? 0 : t)
                    } : function(t, r) {
                        return e.call(this, 0 === t ? 0 : t, r), this
                    })
                };
            if (_t(t, "function" != typeof o || !(i || s.forEach && !c((function() {
                    (new o).entries().next()
                }))))) l = r.getConstructor(e, t, n, u), er.REQUIRED = !0;
            else if (_t(t, !0)) {
                var d = new l,
                    p = d[u](i ? {} : -0, 1) != d,
                    v = c((function() {
                        d.has(1)
                    })),
                    g = function(t, e) {
                        if (!e && !lr) return !1;
                        var r = !1;
                        try {
                            var n = {};
                            n[cr] = function() {
                                return {
                                    next: function() {
                                        return {
                                            done: r = !0
                                        }
                                    }
                                }
                            }, t(n)
                        } catch (t) {}
                        return r
                    }((function(t) {
                        new o(t)
                    })),
                    y = !i && c((function() {
                        for (var t = new o, e = 5; e--;) t[u](e, e);
                        return !t.has(-0)
                    }));
                g || ((l = e((function(e, r) {
                    ar(e, l, t);
                    var i = function(t, e, r) {
                        var n, i;
                        return we && "function" == typeof(n = e.constructor) && n !== r && x(i = n.prototype) && i !== r.prototype && we(t, i), t
                    }(new o, e, l);
                    return null != r && sr(r, i[u], i, n), i
                }))).prototype = s, s.constructor = l), (v || y) && (h("delete"), h("has"), n && h("get")), (y || p) && h(u), i && s.clear && delete s.clear
            }
            return f[t] = l, At({
                global: !0,
                forced: l != o
            }, f), me(l, t), i || r.setStrong(l, t, n), l
        },
        dr = er.getWeakData,
        pr = K.set,
        vr = K.getterFor,
        gr = Pt.find,
        yr = Pt.findIndex,
        br = 0,
        mr = function(t) {
            return t.frozen || (t.frozen = new xr)
        },
        xr = function() {
            this.entries = []
        },
        Er = function(t, e) {
            return gr(t.entries, (function(t) {
                return t[0] === e
            }))
        };
    xr.prototype = {
        get: function(t) {
            var e = Er(this, t);
            if (e) return e[1]
        },
        has: function(t) {
            return !!Er(this, t)
        },
        set: function(t, e) {
            var r = Er(this, t);
            r ? r[1] = e : this.entries.push([t, e])
        },
        delete: function(t) {
            var e = yr(this.entries, (function(e) {
                return e[0] === t
            }));
            return ~e && this.entries.splice(e, 1), !!~e
        }
    };
    var wr = {
            getConstructor: function(t, e, r, n) {
                var i = t((function(t, o) {
                        ar(t, i, e), pr(t, {
                            type: e,
                            id: br++,
                            frozen: void 0
                        }), null != o && sr(o, t[n], t, r)
                    })),
                    o = vr(e),
                    s = function(t, e, r) {
                        var n = o(t),
                            i = dr(T(e), !0);
                        return !0 === i ? mr(n).set(e, r) : i[n.id] = r, t
                    };
                return Ze(i.prototype, {
                    delete: function(t) {
                        var e = o(this);
                        if (!x(t)) return !1;
                        var r = dr(t);
                        return !0 === r ? mr(e).delete(t) : r && O(r, e.id) && delete r[e.id]
                    },
                    has: function(t) {
                        var e = o(this);
                        if (!x(t)) return !1;
                        var r = dr(t);
                        return !0 === r ? mr(e).has(t) : r && O(r, e.id)
                    }
                }), Ze(i.prototype, r ? {
                    get: function(t) {
                        var e = o(this);
                        if (x(t)) {
                            var r = dr(t);
                            return !0 === r ? mr(e).get(t) : r ? r[e.id] : void 0
                        }
                    },
                    set: function(t, e) {
                        return s(this, t, e)
                    }
                } : {
                    add: function(t) {
                        return s(this, t, !0)
                    }
                }), i
            }
        },
        Or = (e((function(t) {
            var e, r = K.enforce,
                n = !a.ActiveXObject && "ActiveXObject" in a,
                i = Object.isExtensible,
                o = function(t) {
                    return function() {
                        return t(this, arguments.length ? arguments[0] : void 0)
                    }
                },
                s = t.exports = hr("WeakMap", o, wr, !0, !0);
            if (D && n) {
                e = wr.getConstructor(o, "WeakMap", !0), er.REQUIRED = !0;
                var c = s.prototype,
                    l = c.delete,
                    u = c.has,
                    f = c.get,
                    h = c.set;
                Ze(c, {
                    delete: function(t) {
                        if (x(t) && !i(t)) {
                            var n = r(this);
                            return n.frozen || (n.frozen = new e), l.call(this, t) || n.frozen.delete(t)
                        }
                        return l.call(this, t)
                    },
                    has: function(t) {
                        if (x(t) && !i(t)) {
                            var n = r(this);
                            return n.frozen || (n.frozen = new e), u.call(this, t) || n.frozen.has(t)
                        }
                        return u.call(this, t)
                    },
                    get: function(t) {
                        if (x(t) && !i(t)) {
                            var n = r(this);
                            return n.frozen || (n.frozen = new e), u.call(this, t) ? f.call(this, t) : n.frozen.get(t)
                        }
                        return f.call(this, t)
                    },
                    set: function(t, n) {
                        if (x(t) && !i(t)) {
                            var o = r(this);
                            o.frozen || (o.frozen = new e), u.call(this, t) ? h.call(this, t, n) : o.frozen.set(t, n)
                        } else h.call(this, t, n);
                        return this
                    }
                })
            }
        })), zt("iterator")),
        _r = zt("toStringTag"),
        Sr = Te.values;
    for (var Ar in Ht) {
        var kr = a[Ar],
            Lr = kr && kr.prototype;
        if (Lr) {
            if (Lr[Or] !== Sr) try {
                W(Lr, Or, Sr)
            } catch (t) {
                Lr[Or] = Sr
            }
            if (Lr[_r] || W(Lr, _r, Ar), Ht[Ar])
                for (var Mr in Te)
                    if (Lr[Mr] !== Te[Mr]) try {
                        W(Lr, Mr, Te[Mr])
                    } catch (t) {
                        Lr[Mr] = Te[Mr]
                    }
        }
    }
    var Tr = "Expected a function",
        jr = NaN,
        Rr = "[object Symbol]",
        Wr = /^\s+|\s+$/g,
        zr = /^[-+]0x[0-9a-f]+$/i,
        Cr = /^0b[01]+$/i,
        Nr = /^0o[0-7]+$/i,
        Ir = parseInt,
        Dr = "object" == typeof t && t && t.Object === Object && t,
        Pr = "object" == typeof self && self && self.Object === Object && self,
        Vr = Dr || Pr || Function("return this")(),
        Fr = Object.prototype.toString,
        Br = Math.max,
        Hr = Math.min,
        qr = function() {
            return Vr.Date.now()
        };

    function $r(t, e, r) {
        var n, i, o, s, a, c, l = 0,
            u = !1,
            f = !1,
            h = !0;
        if ("function" != typeof t) throw new TypeError(Tr);

        function d(e) {
            var r = n,
                o = i;
            return n = i = void 0, l = e, s = t.apply(o, r)
        }

        function p(t) {
            var r = t - c;
            return void 0 === c || r >= e || r < 0 || f && t - l >= o
        }

        function v() {
            var t = qr();
            if (p(t)) return g(t);
            a = setTimeout(v, function(t) {
                var r = e - (t - c);
                return f ? Hr(r, o - (t - l)) : r
            }(t))
        }

        function g(t) {
            return a = void 0, h && n ? d(t) : (n = i = void 0, s)
        }

        function y() {
            var t = qr(),
                r = p(t);
            if (n = arguments, i = this, c = t, r) {
                if (void 0 === a) return function(t) {
                    return l = t, a = setTimeout(v, e), u ? d(t) : s
                }(c);
                if (f) return a = setTimeout(v, e), d(c)
            }
            return void 0 === a && (a = setTimeout(v, e)), s
        }
        return e = Yr(e) || 0, Xr(r) && (u = !!r.leading, o = (f = "maxWait" in r) ? Br(Yr(r.maxWait) || 0, e) : o, h = "trailing" in r ? !!r.trailing : h), y.cancel = function() {
            void 0 !== a && clearTimeout(a), l = 0, n = c = i = a = void 0
        }, y.flush = function() {
            return void 0 === a ? s : g(qr())
        }, y
    }

    function Xr(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e)
    }

    function Yr(t) {
        if ("number" == typeof t) return t;
        if (function(t) {
                return "symbol" == typeof t || function(t) {
                    return !!t && "object" == typeof t
                }(t) && Fr.call(t) == Rr
            }(t)) return jr;
        if (Xr(t)) {
            var e = "function" == typeof t.valueOf ? t.valueOf() : t;
            t = Xr(e) ? e + "" : e
        }
        if ("string" != typeof t) return 0 === t ? t : +t;
        t = t.replace(Wr, "");
        var r = Cr.test(t);
        return r || Nr.test(t) ? Ir(t.slice(2), r ? 2 : 8) : zr.test(t) ? jr : +t
    }
    var Gr = function(t, e, r) {
            var n = !0,
                i = !0;
            if ("function" != typeof t) throw new TypeError(Tr);
            return Xr(r) && (n = "leading" in r ? !!r.leading : n, i = "trailing" in r ? !!r.trailing : i), $r(t, e, {
                leading: n,
                maxWait: e,
                trailing: i
            })
        },
        Ur = "Expected a function",
        Qr = NaN,
        Kr = "[object Symbol]",
        Jr = /^\s+|\s+$/g,
        Zr = /^[-+]0x[0-9a-f]+$/i,
        tn = /^0b[01]+$/i,
        en = /^0o[0-7]+$/i,
        rn = parseInt,
        nn = "object" == typeof t && t && t.Object === Object && t,
        on = "object" == typeof self && self && self.Object === Object && self,
        sn = nn || on || Function("return this")(),
        an = Object.prototype.toString,
        cn = Math.max,
        ln = Math.min,
        un = function() {
            return sn.Date.now()
        };

    function fn(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e)
    }

    function hn(t) {
        if ("number" == typeof t) return t;
        if (function(t) {
                return "symbol" == typeof t || function(t) {
                    return !!t && "object" == typeof t
                }(t) && an.call(t) == Kr
            }(t)) return Qr;
        if (fn(t)) {
            var e = "function" == typeof t.valueOf ? t.valueOf() : t;
            t = fn(e) ? e + "" : e
        }
        if ("string" != typeof t) return 0 === t ? t : +t;
        t = t.replace(Jr, "");
        var r = tn.test(t);
        return r || en.test(t) ? rn(t.slice(2), r ? 2 : 8) : Zr.test(t) ? Qr : +t
    }
    var dn = function(t, e, r) {
            var n, i, o, s, a, c, l = 0,
                u = !1,
                f = !1,
                h = !0;
            if ("function" != typeof t) throw new TypeError(Ur);

            function d(e) {
                var r = n,
                    o = i;
                return n = i = void 0, l = e, s = t.apply(o, r)
            }

            function p(t) {
                var r = t - c;
                return void 0 === c || r >= e || r < 0 || f && t - l >= o
            }

            function v() {
                var t = un();
                if (p(t)) return g(t);
                a = setTimeout(v, function(t) {
                    var r = e - (t - c);
                    return f ? ln(r, o - (t - l)) : r
                }(t))
            }

            function g(t) {
                return a = void 0, h && n ? d(t) : (n = i = void 0, s)
            }

            function y() {
                var t = un(),
                    r = p(t);
                if (n = arguments, i = this, c = t, r) {
                    if (void 0 === a) return function(t) {
                        return l = t, a = setTimeout(v, e), u ? d(t) : s
                    }(c);
                    if (f) return a = setTimeout(v, e), d(c)
                }
                return void 0 === a && (a = setTimeout(v, e)), s
            }
            return e = hn(e) || 0, fn(r) && (u = !!r.leading, o = (f = "maxWait" in r) ? cn(hn(r.maxWait) || 0, e) : o, h = "trailing" in r ? !!r.trailing : h), y.cancel = function() {
                void 0 !== a && clearTimeout(a), l = 0, n = c = i = a = void 0
            }, y.flush = function() {
                return void 0 === a ? s : g(un())
            }, y
        },
        pn = "Expected a function",
        vn = "__lodash_hash_undefined__",
        gn = "[object Function]",
        yn = "[object GeneratorFunction]",
        bn = /^\[object .+?Constructor\]$/,
        mn = "object" == typeof t && t && t.Object === Object && t,
        xn = "object" == typeof self && self && self.Object === Object && self,
        En = mn || xn || Function("return this")();
    var wn = Array.prototype,
        On = Function.prototype,
        _n = Object.prototype,
        Sn = En["__core-js_shared__"],
        An = function() {
            var t = /[^.]+$/.exec(Sn && Sn.keys && Sn.keys.IE_PROTO || "");
            return t ? "Symbol(src)_1." + t : ""
        }(),
        kn = On.toString,
        Ln = _n.hasOwnProperty,
        Mn = _n.toString,
        Tn = RegExp("^" + kn.call(Ln).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
        jn = wn.splice,
        Rn = Vn(En, "Map"),
        Wn = Vn(Object, "create");

    function zn(t) {
        var e = -1,
            r = t ? t.length : 0;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }

    function Cn(t) {
        var e = -1,
            r = t ? t.length : 0;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }

    function Nn(t) {
        var e = -1,
            r = t ? t.length : 0;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }

    function In(t, e) {
        for (var r, n, i = t.length; i--;)
            if ((r = t[i][0]) === (n = e) || r != r && n != n) return i;
        return -1
    }

    function Dn(t) {
        return !(!Bn(t) || (e = t, An && An in e)) && (function(t) {
            var e = Bn(t) ? Mn.call(t) : "";
            return e == gn || e == yn
        }(t) || function(t) {
            var e = !1;
            if (null != t && "function" != typeof t.toString) try {
                e = !!(t + "")
            } catch (t) {}
            return e
        }(t) ? Tn : bn).test(function(t) {
            if (null != t) {
                try {
                    return kn.call(t)
                } catch (t) {}
                try {
                    return t + ""
                } catch (t) {}
            }
            return ""
        }(t));
        var e
    }

    function Pn(t, e) {
        var r, n, i = t.__data__;
        return ("string" == (n = typeof(r = e)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== r : null === r) ? i["string" == typeof e ? "string" : "hash"] : i.map
    }

    function Vn(t, e) {
        var r = function(t, e) {
            return null == t ? void 0 : t[e]
        }(t, e);
        return Dn(r) ? r : void 0
    }

    function Fn(t, e) {
        if ("function" != typeof t || e && "function" != typeof e) throw new TypeError(pn);
        var r = function() {
            var n = arguments,
                i = e ? e.apply(this, n) : n[0],
                o = r.cache;
            if (o.has(i)) return o.get(i);
            var s = t.apply(this, n);
            return r.cache = o.set(i, s), s
        };
        return r.cache = new(Fn.Cache || Nn), r
    }

    function Bn(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e)
    }
    zn.prototype.clear = function() {
        this.__data__ = Wn ? Wn(null) : {}
    }, zn.prototype.delete = function(t) {
        return this.has(t) && delete this.__data__[t]
    }, zn.prototype.get = function(t) {
        var e = this.__data__;
        if (Wn) {
            var r = e[t];
            return r === vn ? void 0 : r
        }
        return Ln.call(e, t) ? e[t] : void 0
    }, zn.prototype.has = function(t) {
        var e = this.__data__;
        return Wn ? void 0 !== e[t] : Ln.call(e, t)
    }, zn.prototype.set = function(t, e) {
        return this.__data__[t] = Wn && void 0 === e ? vn : e, this
    }, Cn.prototype.clear = function() {
        this.__data__ = []
    }, Cn.prototype.delete = function(t) {
        var e = this.__data__,
            r = In(e, t);
        return !(r < 0) && (r == e.length - 1 ? e.pop() : jn.call(e, r, 1), !0)
    }, Cn.prototype.get = function(t) {
        var e = this.__data__,
            r = In(e, t);
        return r < 0 ? void 0 : e[r][1]
    }, Cn.prototype.has = function(t) {
        return In(this.__data__, t) > -1
    }, Cn.prototype.set = function(t, e) {
        var r = this.__data__,
            n = In(r, t);
        return n < 0 ? r.push([t, e]) : r[n][1] = e, this
    }, Nn.prototype.clear = function() {
        this.__data__ = {
            hash: new zn,
            map: new(Rn || Cn),
            string: new zn
        }
    }, Nn.prototype.delete = function(t) {
        return Pn(this, t).delete(t)
    }, Nn.prototype.get = function(t) {
        return Pn(this, t).get(t)
    }, Nn.prototype.has = function(t) {
        return Pn(this, t).has(t)
    }, Nn.prototype.set = function(t, e) {
        return Pn(this, t).set(t, e), this
    }, Fn.Cache = Nn;
    var Hn = Fn,
        qn = function() {
            if ("undefined" != typeof Map) return Map;

            function t(t, e) {
                var r = -1;
                return t.some((function(t, n) {
                    return t[0] === e && (r = n, !0)
                })), r
            }
            return function() {
                function e() {
                    this.__entries__ = []
                }
                return Object.defineProperty(e.prototype, "size", {
                    get: function() {
                        return this.__entries__.length
                    },
                    enumerable: !0,
                    configurable: !0
                }), e.prototype.get = function(e) {
                    var r = t(this.__entries__, e),
                        n = this.__entries__[r];
                    return n && n[1]
                }, e.prototype.set = function(e, r) {
                    var n = t(this.__entries__, e);
                    ~n ? this.__entries__[n][1] = r : this.__entries__.push([e, r])
                }, e.prototype.delete = function(e) {
                    var r = this.__entries__,
                        n = t(r, e);
                    ~n && r.splice(n, 1)
                }, e.prototype.has = function(e) {
                    return !!~t(this.__entries__, e)
                }, e.prototype.clear = function() {
                    this.__entries__.splice(0)
                }, e.prototype.forEach = function(t, e) {
                    void 0 === e && (e = null);
                    for (var r = 0, n = this.__entries__; r < n.length; r++) {
                        var i = n[r];
                        t.call(e, i[1], i[0])
                    }
                }, e
            }()
        }(),
        $n = "undefined" != typeof window && "undefined" != typeof document && window.document === document,
        Xn = "undefined" != typeof global && global.Math === Math ? global : "undefined" != typeof self && self.Math === Math ? self : "undefined" != typeof window && window.Math === Math ? window : Function("return this")(),
        Yn = "function" == typeof requestAnimationFrame ? requestAnimationFrame.bind(Xn) : function(t) {
            return setTimeout((function() {
                return t(Date.now())
            }), 1e3 / 60)
        },
        Gn = 2;
    var Un = 20,
        Qn = ["top", "right", "bottom", "left", "width", "height", "size", "weight"],
        Kn = "undefined" != typeof MutationObserver,
        Jn = function() {
            function t() {
                this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = function(t, e) {
                    var r = !1,
                        n = !1,
                        i = 0;

                    function o() {
                        r && (r = !1, t()), n && a()
                    }

                    function s() {
                        Yn(o)
                    }

                    function a() {
                        var t = Date.now();
                        if (r) {
                            if (t - i < Gn) return;
                            n = !0
                        } else r = !0, n = !1, setTimeout(s, e);
                        i = t
                    }
                    return a
                }(this.refresh.bind(this), Un)
            }
            return t.prototype.addObserver = function(t) {
                ~this.observers_.indexOf(t) || this.observers_.push(t), this.connected_ || this.connect_()
            }, t.prototype.removeObserver = function(t) {
                var e = this.observers_,
                    r = e.indexOf(t);
                ~r && e.splice(r, 1), !e.length && this.connected_ && this.disconnect_()
            }, t.prototype.refresh = function() {
                this.updateObservers_() && this.refresh()
            }, t.prototype.updateObservers_ = function() {
                var t = this.observers_.filter((function(t) {
                    return t.gatherActive(), t.hasActive()
                }));
                return t.forEach((function(t) {
                    return t.broadcastActive()
                })), t.length > 0
            }, t.prototype.connect_ = function() {
                $n && !this.connected_ && (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), Kn ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
                    attributes: !0,
                    childList: !0,
                    characterData: !0,
                    subtree: !0
                })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0)
            }, t.prototype.disconnect_ = function() {
                $n && this.connected_ && (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1)
            }, t.prototype.onTransitionEnd_ = function(t) {
                var e = t.propertyName,
                    r = void 0 === e ? "" : e;
                Qn.some((function(t) {
                    return !!~r.indexOf(t)
                })) && this.refresh()
            }, t.getInstance = function() {
                return this.instance_ || (this.instance_ = new t), this.instance_
            }, t.instance_ = null, t
        }(),
        Zn = function(t, e) {
            for (var r = 0, n = Object.keys(e); r < n.length; r++) {
                var i = n[r];
                Object.defineProperty(t, i, {
                    value: e[i],
                    enumerable: !1,
                    writable: !1,
                    configurable: !0
                })
            }
            return t
        },
        ti = function(t) {
            return t && t.ownerDocument && t.ownerDocument.defaultView || Xn
        },
        ei = ai(0, 0, 0, 0);

    function ri(t) {
        return parseFloat(t) || 0
    }

    function ni(t) {
        for (var e = [], r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
        return e.reduce((function(e, r) {
            return e + ri(t["border-" + r + "-width"])
        }), 0)
    }

    function ii(t) {
        var e = t.clientWidth,
            r = t.clientHeight;
        if (!e && !r) return ei;
        var n = ti(t).getComputedStyle(t),
            i = function(t) {
                for (var e = {}, r = 0, n = ["top", "right", "bottom", "left"]; r < n.length; r++) {
                    var i = n[r],
                        o = t["padding-" + i];
                    e[i] = ri(o)
                }
                return e
            }(n),
            o = i.left + i.right,
            s = i.top + i.bottom,
            a = ri(n.width),
            c = ri(n.height);
        if ("border-box" === n.boxSizing && (Math.round(a + o) !== e && (a -= ni(n, "left", "right") + o), Math.round(c + s) !== r && (c -= ni(n, "top", "bottom") + s)), ! function(t) {
                return t === ti(t).document.documentElement
            }(t)) {
            var l = Math.round(a + o) - e,
                u = Math.round(c + s) - r;
            1 !== Math.abs(l) && (a -= l), 1 !== Math.abs(u) && (c -= u)
        }
        return ai(i.left, i.top, a, c)
    }
    var oi = "undefined" != typeof SVGGraphicsElement ? function(t) {
        return t instanceof ti(t).SVGGraphicsElement
    } : function(t) {
        return t instanceof ti(t).SVGElement && "function" == typeof t.getBBox
    };

    function si(t) {
        return $n ? oi(t) ? function(t) {
            var e = t.getBBox();
            return ai(0, 0, e.width, e.height)
        }(t) : ii(t) : ei
    }

    function ai(t, e, r, n) {
        return {
            x: t,
            y: e,
            width: r,
            height: n
        }
    }
    var ci = function() {
            function t(t) {
                this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = ai(0, 0, 0, 0), this.target = t
            }
            return t.prototype.isActive = function() {
                var t = si(this.target);
                return this.contentRect_ = t, t.width !== this.broadcastWidth || t.height !== this.broadcastHeight
            }, t.prototype.broadcastRect = function() {
                var t = this.contentRect_;
                return this.broadcastWidth = t.width, this.broadcastHeight = t.height, t
            }, t
        }(),
        li = function(t, e) {
            var r, n, i, o, s, a, c, l = (n = (r = e).x, i = r.y, o = r.width, s = r.height, a = "undefined" != typeof DOMRectReadOnly ? DOMRectReadOnly : Object, c = Object.create(a.prototype), Zn(c, {
                x: n,
                y: i,
                width: o,
                height: s,
                top: i,
                right: n + o,
                bottom: s + i,
                left: n
            }), c);
            Zn(this, {
                target: t,
                contentRect: l
            })
        },
        ui = function() {
            function t(t, e, r) {
                if (this.activeObservations_ = [], this.observations_ = new qn, "function" != typeof t) throw new TypeError("The callback provided as parameter 1 is not a function.");
                this.callback_ = t, this.controller_ = e, this.callbackCtx_ = r
            }
            return t.prototype.observe = function(t) {
                if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
                if ("undefined" != typeof Element && Element instanceof Object) {
                    if (!(t instanceof ti(t).Element)) throw new TypeError('parameter 1 is not of type "Element".');
                    var e = this.observations_;
                    e.has(t) || (e.set(t, new ci(t)), this.controller_.addObserver(this), this.controller_.refresh())
                }
            }, t.prototype.unobserve = function(t) {
                if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
                if ("undefined" != typeof Element && Element instanceof Object) {
                    if (!(t instanceof ti(t).Element)) throw new TypeError('parameter 1 is not of type "Element".');
                    var e = this.observations_;
                    e.has(t) && (e.delete(t), e.size || this.controller_.removeObserver(this))
                }
            }, t.prototype.disconnect = function() {
                this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this)
            }, t.prototype.gatherActive = function() {
                var t = this;
                this.clearActive(), this.observations_.forEach((function(e) {
                    e.isActive() && t.activeObservations_.push(e)
                }))
            }, t.prototype.broadcastActive = function() {
                if (this.hasActive()) {
                    var t = this.callbackCtx_,
                        e = this.activeObservations_.map((function(t) {
                            return new li(t.target, t.broadcastRect())
                        }));
                    this.callback_.call(t, e, t), this.clearActive()
                }
            }, t.prototype.clearActive = function() {
                this.activeObservations_.splice(0)
            }, t.prototype.hasActive = function() {
                return this.activeObservations_.length > 0
            }, t
        }(),
        fi = "undefined" != typeof WeakMap ? new WeakMap : new qn,
        hi = function t(e) {
            if (!(this instanceof t)) throw new TypeError("Cannot call a class as a function.");
            if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
            var r = Jn.getInstance(),
                n = new ui(e, r, this);
            fi.set(this, n)
        };
    ["observe", "unobserve", "disconnect"].forEach((function(t) {
        hi.prototype[t] = function() {
            var e;
            return (e = fi.get(this))[t].apply(e, arguments)
        }
    }));
    var di = void 0 !== Xn.ResizeObserver ? Xn.ResizeObserver : hi,
        pi = null,
        vi = null;

    function gi() {
        if (null === pi) {
            if ("undefined" == typeof document) return pi = 0;
            var t = document.body,
                e = document.createElement("div");
            e.classList.add("simplebar-hide-scrollbar"), t.appendChild(e);
            var r = e.getBoundingClientRect().right;
            t.removeChild(e), pi = r
        }
        return pi
    }
    Yt && window.addEventListener("resize", (function() {
        vi !== window.devicePixelRatio && (vi = window.devicePixelRatio, pi = null)
    }));
    var yi = function(t) {
            return function(e, r, n, i) {
                kt(r);
                var o = Mt(e),
                    s = y(o),
                    a = st(o.length),
                    c = t ? a - 1 : 0,
                    l = t ? -1 : 1;
                if (n < 2)
                    for (;;) {
                        if (c in s) {
                            i = s[c], c += l;
                            break
                        }
                        if (c += l, t ? c < 0 : a <= c) throw TypeError("Reduce of empty array with no initial value")
                    }
                for (; t ? c >= 0 : a > c; c += l) c in s && (i = r(i, s[c], c, o));
                return i
            }
        },
        bi = {
            left: yi(!1),
            right: yi(!0)
        }.left;
    At({
        target: "Array",
        proto: !0,
        forced: Vt("reduce")
    }, {
        reduce: function(t) {
            return bi(this, t, arguments.length, arguments.length > 1 ? arguments[1] : void 0)
        }
    });
    var mi = R.f,
        xi = Function.prototype,
        Ei = xi.toString,
        wi = /^\s*function ([^ (]*)/;
    !l || "name" in xi || mi(xi, "name", {
        configurable: !0,
        get: function() {
            try {
                return Ei.call(this).match(wi)[1]
            } catch (t) {
                return ""
            }
        }
    });
    var Oi, _i, Si = function() {
            var t = T(this),
                e = "";
            return t.global && (e += "g"), t.ignoreCase && (e += "i"), t.multiline && (e += "m"), t.dotAll && (e += "s"), t.unicode && (e += "u"), t.sticky && (e += "y"), e
        },
        Ai = RegExp.prototype.exec,
        ki = String.prototype.replace,
        Li = Ai,
        Mi = (Oi = /a/, _i = /b*/g, Ai.call(Oi, "a"), Ai.call(_i, "a"), 0 !== Oi.lastIndex || 0 !== _i.lastIndex),
        Ti = void 0 !== /()??/.exec("")[1];
    (Mi || Ti) && (Li = function(t) {
        var e, r, n, i, o = this;
        return Ti && (r = new RegExp("^" + o.source + "$(?!\\s)", Si.call(o))), Mi && (e = o.lastIndex), n = Ai.call(o, t), Mi && n && (o.lastIndex = o.global ? n.index + n[0].length : e), Ti && n && n.length > 1 && ki.call(n[0], r, (function() {
            for (i = 1; i < arguments.length - 2; i++) void 0 === arguments[i] && (n[i] = void 0)
        })), n
    });
    var ji = Li;
    At({
        target: "RegExp",
        proto: !0,
        forced: /./.exec !== ji
    }, {
        exec: ji
    });
    var Ri = zt("species"),
        Wi = !c((function() {
            var t = /./;
            return t.exec = function() {
                var t = [];
                return t.groups = {
                    a: "7"
                }, t
            }, "7" !== "".replace(t, "$<a>")
        })),
        zi = !c((function() {
            var t = /(?:)/,
                e = t.exec;
            t.exec = function() {
                return e.apply(this, arguments)
            };
            var r = "ab".split(t);
            return 2 !== r.length || "a" !== r[0] || "b" !== r[1]
        })),
        Ci = function(t, e, r, n) {
            var i = zt(t),
                o = !c((function() {
                    var e = {};
                    return e[i] = function() {
                        return 7
                    }, 7 != "" [t](e)
                })),
                s = o && !c((function() {
                    var e = !1,
                        r = /a/;
                    return r.exec = function() {
                        return e = !0, null
                    }, "split" === t && (r.constructor = {}, r.constructor[Ri] = function() {
                        return r
                    }), r[i](""), !e
                }));
            if (!o || !s || "replace" === t && !Wi || "split" === t && !zi) {
                var a = /./ [i],
                    l = r(i, "" [t], (function(t, e, r, n, i) {
                        return e.exec === ji ? o && !i ? {
                            done: !0,
                            value: a.call(e, r, n)
                        } : {
                            done: !0,
                            value: t.call(r, e, n)
                        } : {
                            done: !1
                        }
                    })),
                    u = l[0],
                    f = l[1];
                J(String.prototype, t, u), J(RegExp.prototype, i, 2 == e ? function(t, e) {
                    return f.call(t, this, e)
                } : function(t) {
                    return f.call(t, this)
                }), n && W(RegExp.prototype[i], "sham", !0)
            }
        },
        Ni = Ue.charAt,
        Ii = function(t, e, r) {
            return e + (r ? Ni(t, e).length : 1)
        },
        Di = function(t, e) {
            var r = t.exec;
            if ("function" == typeof r) {
                var n = r.call(t, e);
                if ("object" != typeof n) throw TypeError("RegExp exec method returned something other than an Object or null");
                return n
            }
            if ("RegExp" !== v(t)) throw TypeError("RegExp#exec called on incompatible receiver");
            return ji.call(t, e)
        };
    Ci("match", 1, (function(t, e, r) {
        return [function(e) {
            var r = b(this),
                n = null == e ? void 0 : e[t];
            return void 0 !== n ? n.call(e, r) : new RegExp(e)[t](String(r))
        }, function(t) {
            var n = r(e, t, this);
            if (n.done) return n.value;
            var i = T(t),
                o = String(this);
            if (!i.global) return Di(i, o);
            var s = i.unicode;
            i.lastIndex = 0;
            for (var a, c = [], l = 0; null !== (a = Di(i, o));) {
                var u = String(a[0]);
                c[l] = u, "" === u && (i.lastIndex = Ii(o, st(i.lastIndex), s)), l++
            }
            return 0 === l ? null : c
        }]
    }));
    var Pi = Math.max,
        Vi = Math.min,
        Fi = Math.floor,
        Bi = /\$([$&'`]|\d\d?|<[^>]*>)/g,
        Hi = /\$([$&'`]|\d\d?)/g;
    Ci("replace", 2, (function(t, e, r) {
        return [function(r, n) {
            var i = b(this),
                o = null == r ? void 0 : r[t];
            return void 0 !== o ? o.call(r, i, n) : e.call(String(i), r, n)
        }, function(t, i) {
            var o = r(e, t, this, i);
            if (o.done) return o.value;
            var s = T(t),
                a = String(this),
                c = "function" == typeof i;
            c || (i = String(i));
            var l = s.global;
            if (l) {
                var u = s.unicode;
                s.lastIndex = 0
            }
            for (var f = [];;) {
                var h = Di(s, a);
                if (null === h) break;
                if (f.push(h), !l) break;
                "" === String(h[0]) && (s.lastIndex = Ii(a, st(s.lastIndex), u))
            }
            for (var d, p = "", v = 0, g = 0; g < f.length; g++) {
                h = f[g];
                for (var y = String(h[0]), b = Pi(Vi(it(h.index), a.length), 0), m = [], x = 1; x < h.length; x++) m.push(void 0 === (d = h[x]) ? d : String(d));
                var E = h.groups;
                if (c) {
                    var w = [y].concat(m, b, a);
                    void 0 !== E && w.push(E);
                    var O = String(i.apply(void 0, w))
                } else O = n(y, a, b, m, E, i);
                b >= v && (p += a.slice(v, b) + O, v = b + y.length)
            }
            return p + a.slice(v)
        }];

        function n(t, r, n, i, o, s) {
            var a = n + t.length,
                c = i.length,
                l = Hi;
            return void 0 !== o && (o = Mt(o), l = Bi), e.call(s, l, (function(e, s) {
                var l;
                switch (s.charAt(0)) {
                    case "$":
                        return "$";
                    case "&":
                        return t;
                    case "`":
                        return r.slice(0, n);
                    case "'":
                        return r.slice(a);
                    case "<":
                        l = o[s.slice(1, -1)];
                        break;
                    default:
                        var u = +s;
                        if (0 === u) return e;
                        if (u > c) {
                            var f = Fi(u / 10);
                            return 0 === f ? e : f <= c ? void 0 === i[f - 1] ? s.charAt(1) : i[f - 1] + s.charAt(1) : e
                        }
                        l = i[u - 1]
                }
                return void 0 === l ? "" : l
            }))
        }
    }));
    var qi = function(t) {
        return Array.prototype.reduce.call(t, (function(t, e) {
            var r = e.name.match(/data-simplebar-(.+)/);
            if (r) {
                var n = r[1].replace(/\W+(.)/g, (function(t, e) {
                    return e.toUpperCase()
                }));
                switch (e.value) {
                    case "true":
                        t[n] = !0;
                        break;
                    case "false":
                        t[n] = !1;
                        break;
                    case void 0:
                        t[n] = !0;
                        break;
                    default:
                        t[n] = e.value
                }
            }
            return t
        }), {})
    };

    function $i(t) {
        return t && t.ownerDocument && t.ownerDocument.defaultView ? t.ownerDocument.defaultView : window
    }

    function Xi(t) {
        return t && t.ownerDocument ? t.ownerDocument : document
    }
    var Yi = function() {
        function t(e, r) {
            var n = this;
            this.onScroll = function() {
                var t = $i(n.el);
                n.scrollXTicking || (t.requestAnimationFrame(n.scrollX), n.scrollXTicking = !0), n.scrollYTicking || (t.requestAnimationFrame(n.scrollY), n.scrollYTicking = !0)
            }, this.scrollX = function() {
                n.axis.x.isOverflowing && (n.showScrollbar("x"), n.positionScrollbar("x")), n.scrollXTicking = !1
            }, this.scrollY = function() {
                n.axis.y.isOverflowing && (n.showScrollbar("y"), n.positionScrollbar("y")), n.scrollYTicking = !1
            }, this.onMouseEnter = function() {
                n.showScrollbar("x"), n.showScrollbar("y")
            }, this.onMouseMove = function(t) {
                n.mouseX = t.clientX, n.mouseY = t.clientY, (n.axis.x.isOverflowing || n.axis.x.forceVisible) && n.onMouseMoveForAxis("x"), (n.axis.y.isOverflowing || n.axis.y.forceVisible) && n.onMouseMoveForAxis("y")
            }, this.onMouseLeave = function() {
                n.onMouseMove.cancel(), (n.axis.x.isOverflowing || n.axis.x.forceVisible) && n.onMouseLeaveForAxis("x"), (n.axis.y.isOverflowing || n.axis.y.forceVisible) && n.onMouseLeaveForAxis("y"), n.mouseX = -1, n.mouseY = -1
            }, this.onWindowResize = function() {
                n.scrollbarWidth = n.getScrollbarWidth(), n.hideNativeScrollbar()
            }, this.hideScrollbars = function() {
                n.axis.x.track.rect = n.axis.x.track.el.getBoundingClientRect(), n.axis.y.track.rect = n.axis.y.track.el.getBoundingClientRect(), n.isWithinBounds(n.axis.y.track.rect) || (n.axis.y.scrollbar.el.classList.remove(n.classNames.visible), n.axis.y.isVisible = !1), n.isWithinBounds(n.axis.x.track.rect) || (n.axis.x.scrollbar.el.classList.remove(n.classNames.visible), n.axis.x.isVisible = !1)
            }, this.onPointerEvent = function(t) {
                var e, r;
                n.axis.x.track.rect = n.axis.x.track.el.getBoundingClientRect(), n.axis.y.track.rect = n.axis.y.track.el.getBoundingClientRect(), (n.axis.x.isOverflowing || n.axis.x.forceVisible) && (e = n.isWithinBounds(n.axis.x.track.rect)), (n.axis.y.isOverflowing || n.axis.y.forceVisible) && (r = n.isWithinBounds(n.axis.y.track.rect)), (e || r) && (t.preventDefault(), t.stopPropagation(), "mousedown" === t.type && (e && (n.axis.x.scrollbar.rect = n.axis.x.scrollbar.el.getBoundingClientRect(), n.isWithinBounds(n.axis.x.scrollbar.rect) ? n.onDragStart(t, "x") : n.onTrackClick(t, "x")), r && (n.axis.y.scrollbar.rect = n.axis.y.scrollbar.el.getBoundingClientRect(), n.isWithinBounds(n.axis.y.scrollbar.rect) ? n.onDragStart(t, "y") : n.onTrackClick(t, "y"))))
            }, this.drag = function(e) {
                var r = n.axis[n.draggedAxis].track,
                    i = r.rect[n.axis[n.draggedAxis].sizeAttr],
                    o = n.axis[n.draggedAxis].scrollbar,
                    s = n.contentWrapperEl[n.axis[n.draggedAxis].scrollSizeAttr],
                    a = parseInt(n.elStyles[n.axis[n.draggedAxis].sizeAttr], 10);
                e.preventDefault(), e.stopPropagation();
                var c = (("y" === n.draggedAxis ? e.pageY : e.pageX) - r.rect[n.axis[n.draggedAxis].offsetAttr] - n.axis[n.draggedAxis].dragOffset) / (i - o.size) * (s - a);
                "x" === n.draggedAxis && (c = n.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? c - (i + o.size) : c, c = n.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -c : c), n.contentWrapperEl[n.axis[n.draggedAxis].scrollOffsetAttr] = c
            }, this.onEndDrag = function(t) {
                var e = Xi(n.el),
                    r = $i(n.el);
                t.preventDefault(), t.stopPropagation(), n.el.classList.remove(n.classNames.dragging), e.removeEventListener("mousemove", n.drag, !0), e.removeEventListener("mouseup", n.onEndDrag, !0), n.removePreventClickId = r.setTimeout((function() {
                    e.removeEventListener("click", n.preventClick, !0), e.removeEventListener("dblclick", n.preventClick, !0), n.removePreventClickId = null
                }))
            }, this.preventClick = function(t) {
                t.preventDefault(), t.stopPropagation()
            }, this.el = e, this.minScrollbarWidth = 20, this.options = Object.assign({}, t.defaultOptions, {}, r), this.classNames = Object.assign({}, t.defaultOptions.classNames, {}, this.options.classNames), this.axis = {
                x: {
                    scrollOffsetAttr: "scrollLeft",
                    sizeAttr: "width",
                    scrollSizeAttr: "scrollWidth",
                    offsetSizeAttr: "offsetWidth",
                    offsetAttr: "left",
                    overflowAttr: "overflowX",
                    dragOffset: 0,
                    isOverflowing: !0,
                    isVisible: !1,
                    forceVisible: !1,
                    track: {},
                    scrollbar: {}
                },
                y: {
                    scrollOffsetAttr: "scrollTop",
                    sizeAttr: "height",
                    scrollSizeAttr: "scrollHeight",
                    offsetSizeAttr: "offsetHeight",
                    offsetAttr: "top",
                    overflowAttr: "overflowY",
                    dragOffset: 0,
                    isOverflowing: !0,
                    isVisible: !1,
                    forceVisible: !1,
                    track: {},
                    scrollbar: {}
                }
            }, this.removePreventClickId = null, t.instances.has(this.el) || (this.recalculate = Gr(this.recalculate.bind(this), 64), this.onMouseMove = Gr(this.onMouseMove.bind(this), 64), this.hideScrollbars = dn(this.hideScrollbars.bind(this), this.options.timeout), this.onWindowResize = dn(this.onWindowResize.bind(this), 64, {
                leading: !0
            }), t.getRtlHelpers = Hn(t.getRtlHelpers), this.init())
        }
        t.getRtlHelpers = function() {
            var e = document.createElement("div");
            e.innerHTML = '<div class="hs-dummy-scrollbar-size"><div style="height: 200%; width: 200%; margin: 10px 0;"></div></div>';
            var r = e.firstElementChild;
            document.body.appendChild(r);
            var n = r.firstElementChild;
            r.scrollLeft = 0;
            var i = t.getOffset(r),
                o = t.getOffset(n);
            r.scrollLeft = 999;
            var s = t.getOffset(n);
            return {
                isRtlScrollingInverted: i.left !== o.left && o.left - s.left != 0,
                isRtlScrollbarInverted: i.left !== o.left
            }
        }, t.getOffset = function(t) {
            var e = t.getBoundingClientRect(),
                r = Xi(t),
                n = $i(t);
            return {
                top: e.top + (n.pageYOffset || r.documentElement.scrollTop),
                left: e.left + (n.pageXOffset || r.documentElement.scrollLeft)
            }
        };
        var e = t.prototype;
        return e.init = function() {
            t.instances.set(this.el, this), Yt && (this.initDOM(), this.scrollbarWidth = this.getScrollbarWidth(), this.recalculate(), this.initListeners())
        }, e.initDOM = function() {
            var t = this;
            if (Array.prototype.filter.call(this.el.children, (function(e) {
                    return e.classList.contains(t.classNames.wrapper)
                })).length) this.wrapperEl = this.el.querySelector("." + this.classNames.wrapper), this.contentWrapperEl = this.options.scrollableNode || this.el.querySelector("." + this.classNames.contentWrapper), this.contentEl = this.options.contentNode || this.el.querySelector("." + this.classNames.contentEl), this.offsetEl = this.el.querySelector("." + this.classNames.offset), this.maskEl = this.el.querySelector("." + this.classNames.mask), this.placeholderEl = this.findChild(this.wrapperEl, "." + this.classNames.placeholder), this.heightAutoObserverWrapperEl = this.el.querySelector("." + this.classNames.heightAutoObserverWrapperEl), this.heightAutoObserverEl = this.el.querySelector("." + this.classNames.heightAutoObserverEl), this.axis.x.track.el = this.findChild(this.el, "." + this.classNames.track + "." + this.classNames.horizontal), this.axis.y.track.el = this.findChild(this.el, "." + this.classNames.track + "." + this.classNames.vertical);
            else {
                for (this.wrapperEl = document.createElement("div"), this.contentWrapperEl = document.createElement("div"), this.offsetEl = document.createElement("div"), this.maskEl = document.createElement("div"), this.contentEl = document.createElement("div"), this.placeholderEl = document.createElement("div"), this.heightAutoObserverWrapperEl = document.createElement("div"), this.heightAutoObserverEl = document.createElement("div"), this.wrapperEl.classList.add(this.classNames.wrapper), this.contentWrapperEl.classList.add(this.classNames.contentWrapper), this.offsetEl.classList.add(this.classNames.offset), this.maskEl.classList.add(this.classNames.mask), this.contentEl.classList.add(this.classNames.contentEl), this.placeholderEl.classList.add(this.classNames.placeholder), this.heightAutoObserverWrapperEl.classList.add(this.classNames.heightAutoObserverWrapperEl), this.heightAutoObserverEl.classList.add(this.classNames.heightAutoObserverEl); this.el.firstChild;) this.contentEl.appendChild(this.el.firstChild);
                this.contentWrapperEl.appendChild(this.contentEl), this.offsetEl.appendChild(this.contentWrapperEl), this.maskEl.appendChild(this.offsetEl), this.heightAutoObserverWrapperEl.appendChild(this.heightAutoObserverEl), this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl), this.wrapperEl.appendChild(this.maskEl), this.wrapperEl.appendChild(this.placeholderEl), this.el.appendChild(this.wrapperEl)
            }
            if (!this.axis.x.track.el || !this.axis.y.track.el) {
                var e = document.createElement("div"),
                    r = document.createElement("div");
                e.classList.add(this.classNames.track), r.classList.add(this.classNames.scrollbar), e.appendChild(r), this.axis.x.track.el = e.cloneNode(!0), this.axis.x.track.el.classList.add(this.classNames.horizontal), this.axis.y.track.el = e.cloneNode(!0), this.axis.y.track.el.classList.add(this.classNames.vertical), this.el.appendChild(this.axis.x.track.el), this.el.appendChild(this.axis.y.track.el)
            }
            this.axis.x.scrollbar.el = this.axis.x.track.el.querySelector("." + this.classNames.scrollbar), this.axis.y.scrollbar.el = this.axis.y.track.el.querySelector("." + this.classNames.scrollbar), this.options.autoHide || (this.axis.x.scrollbar.el.classList.add(this.classNames.visible), this.axis.y.scrollbar.el.classList.add(this.classNames.visible)), this.el.setAttribute("data-simplebar", "init")
        }, e.initListeners = function() {
            var t = this,
                e = $i(this.el);
            this.options.autoHide && this.el.addEventListener("mouseenter", this.onMouseEnter), ["mousedown", "click", "dblclick"].forEach((function(e) {
                t.el.addEventListener(e, t.onPointerEvent, !0)
            })), ["touchstart", "touchend", "touchmove"].forEach((function(e) {
                t.el.addEventListener(e, t.onPointerEvent, {
                    capture: !0,
                    passive: !0
                })
            })), this.el.addEventListener("mousemove", this.onMouseMove), this.el.addEventListener("mouseleave", this.onMouseLeave), this.contentWrapperEl.addEventListener("scroll", this.onScroll), e.addEventListener("resize", this.onWindowResize);
            var r = !1,
                n = e.ResizeObserver || di;
            this.resizeObserver = new n((function() {
                r && t.recalculate()
            })), this.resizeObserver.observe(this.el), this.resizeObserver.observe(this.contentEl), e.requestAnimationFrame((function() {
                r = !0
            })), this.mutationObserver = new e.MutationObserver(this.recalculate), this.mutationObserver.observe(this.contentEl, {
                childList: !0,
                subtree: !0,
                characterData: !0
            })
        }, e.recalculate = function() {
            var t = $i(this.el);
            this.elStyles = t.getComputedStyle(this.el), this.isRtl = "rtl" === this.elStyles.direction;
            var e = this.heightAutoObserverEl.offsetHeight <= 1,
                r = this.heightAutoObserverEl.offsetWidth <= 1,
                n = this.contentEl.offsetWidth,
                i = this.contentWrapperEl.offsetWidth,
                o = this.elStyles.overflowX,
                s = this.elStyles.overflowY;
            this.contentEl.style.padding = this.elStyles.paddingTop + " " + this.elStyles.paddingRight + " " + this.elStyles.paddingBottom + " " + this.elStyles.paddingLeft, this.wrapperEl.style.margin = "-" + this.elStyles.paddingTop + " -" + this.elStyles.paddingRight + " -" + this.elStyles.paddingBottom + " -" + this.elStyles.paddingLeft;
            var a = this.contentEl.scrollHeight,
                c = this.contentEl.scrollWidth;
            this.contentWrapperEl.style.height = e ? "auto" : "100%", this.placeholderEl.style.width = r ? n + "px" : "auto", this.placeholderEl.style.height = a + "px";
            var l = this.contentWrapperEl.offsetHeight;
            this.axis.x.isOverflowing = c > n, this.axis.y.isOverflowing = a > l, this.axis.x.isOverflowing = "hidden" !== o && this.axis.x.isOverflowing, this.axis.y.isOverflowing = "hidden" !== s && this.axis.y.isOverflowing, this.axis.x.forceVisible = "x" === this.options.forceVisible || !0 === this.options.forceVisible, this.axis.y.forceVisible = "y" === this.options.forceVisible || !0 === this.options.forceVisible, this.hideNativeScrollbar();
            var u = this.axis.x.isOverflowing ? this.scrollbarWidth : 0,
                f = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
            this.axis.x.isOverflowing = this.axis.x.isOverflowing && c > i - f, this.axis.y.isOverflowing = this.axis.y.isOverflowing && a > l - u, this.axis.x.scrollbar.size = this.getScrollbarSize("x"), this.axis.y.scrollbar.size = this.getScrollbarSize("y"), this.axis.x.scrollbar.el.style.width = this.axis.x.scrollbar.size + "px", this.axis.y.scrollbar.el.style.height = this.axis.y.scrollbar.size + "px", this.positionScrollbar("x"), this.positionScrollbar("y"), this.toggleTrackVisibility("x"), this.toggleTrackVisibility("y")
        }, e.getScrollbarSize = function(t) {
            if (void 0 === t && (t = "y"), !this.axis[t].isOverflowing) return 0;
            var e, r = this.contentEl[this.axis[t].scrollSizeAttr],
                n = this.axis[t].track.el[this.axis[t].offsetSizeAttr],
                i = n / r;
            return e = Math.max(~~(i * n), this.options.scrollbarMinSize), this.options.scrollbarMaxSize && (e = Math.min(e, this.options.scrollbarMaxSize)), e
        }, e.positionScrollbar = function(e) {
            if (void 0 === e && (e = "y"), this.axis[e].isOverflowing) {
                var r = this.contentWrapperEl[this.axis[e].scrollSizeAttr],
                    n = this.axis[e].track.el[this.axis[e].offsetSizeAttr],
                    i = parseInt(this.elStyles[this.axis[e].sizeAttr], 10),
                    o = this.axis[e].scrollbar,
                    s = this.contentWrapperEl[this.axis[e].scrollOffsetAttr],
                    a = (s = "x" === e && this.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -s : s) / (r - i),
                    c = ~~((n - o.size) * a);
                c = "x" === e && this.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? c + (n - o.size) : c, o.el.style.transform = "x" === e ? "translate3d(" + c + "px, 0, 0)" : "translate3d(0, " + c + "px, 0)"
            }
        }, e.toggleTrackVisibility = function(t) {
            void 0 === t && (t = "y");
            var e = this.axis[t].track.el,
                r = this.axis[t].scrollbar.el;
            this.axis[t].isOverflowing || this.axis[t].forceVisible ? (e.style.visibility = "visible", this.contentWrapperEl.style[this.axis[t].overflowAttr] = "scroll") : (e.style.visibility = "hidden", this.contentWrapperEl.style[this.axis[t].overflowAttr] = "hidden"), this.axis[t].isOverflowing ? r.style.display = "block" : r.style.display = "none"
        }, e.hideNativeScrollbar = function() {
            this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-" + this.scrollbarWidth + "px" : 0, this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-" + this.scrollbarWidth + "px" : 0
        }, e.onMouseMoveForAxis = function(t) {
            void 0 === t && (t = "y"), this.axis[t].track.rect = this.axis[t].track.el.getBoundingClientRect(), this.axis[t].scrollbar.rect = this.axis[t].scrollbar.el.getBoundingClientRect(), this.isWithinBounds(this.axis[t].scrollbar.rect) ? this.axis[t].scrollbar.el.classList.add(this.classNames.hover) : this.axis[t].scrollbar.el.classList.remove(this.classNames.hover), this.isWithinBounds(this.axis[t].track.rect) ? (this.showScrollbar(t), this.axis[t].track.el.classList.add(this.classNames.hover)) : this.axis[t].track.el.classList.remove(this.classNames.hover)
        }, e.onMouseLeaveForAxis = function(t) {
            void 0 === t && (t = "y"), this.axis[t].track.el.classList.remove(this.classNames.hover), this.axis[t].scrollbar.el.classList.remove(this.classNames.hover)
        }, e.showScrollbar = function(t) {
            void 0 === t && (t = "y");
            var e = this.axis[t].scrollbar.el;
            this.axis[t].isVisible || (e.classList.add(this.classNames.visible), this.axis[t].isVisible = !0), this.options.autoHide && this.hideScrollbars()
        }, e.onDragStart = function(t, e) {
            void 0 === e && (e = "y");
            var r = Xi(this.el),
                n = $i(this.el),
                i = this.axis[e].scrollbar,
                o = "y" === e ? t.pageY : t.pageX;
            this.axis[e].dragOffset = o - i.rect[this.axis[e].offsetAttr], this.draggedAxis = e, this.el.classList.add(this.classNames.dragging), r.addEventListener("mousemove", this.drag, !0), r.addEventListener("mouseup", this.onEndDrag, !0), null === this.removePreventClickId ? (r.addEventListener("click", this.preventClick, !0), r.addEventListener("dblclick", this.preventClick, !0)) : (n.clearTimeout(this.removePreventClickId), this.removePreventClickId = null)
        }, e.onTrackClick = function(t, e) {
            var r = this;
            if (void 0 === e && (e = "y"), this.options.clickOnTrack) {
                var n = $i(this.el);
                this.axis[e].scrollbar.rect = this.axis[e].scrollbar.el.getBoundingClientRect();
                var i = this.axis[e].scrollbar.rect[this.axis[e].offsetAttr],
                    o = parseInt(this.elStyles[this.axis[e].sizeAttr], 10),
                    s = this.contentWrapperEl[this.axis[e].scrollOffsetAttr],
                    a = ("y" === e ? this.mouseY - i : this.mouseX - i) < 0 ? -1 : 1,
                    c = -1 === a ? s - o : s + o;
                ! function t() {
                    var i, o; - 1 === a ? s > c && (s -= r.options.clickOnTrackSpeed, r.contentWrapperEl.scrollTo(((i = {})[r.axis[e].offsetAttr] = s, i)), n.requestAnimationFrame(t)) : s < c && (s += r.options.clickOnTrackSpeed, r.contentWrapperEl.scrollTo(((o = {})[r.axis[e].offsetAttr] = s, o)), n.requestAnimationFrame(t))
                }()
            }
        }, e.getContentElement = function() {
            return this.contentEl
        }, e.getScrollElement = function() {
            return this.contentWrapperEl
        }, e.getScrollbarWidth = function() {
            try {
                return "none" === getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar").display || "scrollbarWidth" in document.documentElement.style || "-ms-overflow-style" in document.documentElement.style ? 0 : gi()
            } catch (t) {
                return gi()
            }
        }, e.removeListeners = function() {
            var t = this,
                e = $i(this.el);
            this.options.autoHide && this.el.removeEventListener("mouseenter", this.onMouseEnter), ["mousedown", "click", "dblclick"].forEach((function(e) {
                t.el.removeEventListener(e, t.onPointerEvent, !0)
            })), ["touchstart", "touchend", "touchmove"].forEach((function(e) {
                t.el.removeEventListener(e, t.onPointerEvent, {
                    capture: !0,
                    passive: !0
                })
            })), this.el.removeEventListener("mousemove", this.onMouseMove), this.el.removeEventListener("mouseleave", this.onMouseLeave), this.contentWrapperEl && this.contentWrapperEl.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onWindowResize), this.mutationObserver && this.mutationObserver.disconnect(), this.resizeObserver && this.resizeObserver.disconnect(), this.recalculate.cancel(), this.onMouseMove.cancel(), this.hideScrollbars.cancel(), this.onWindowResize.cancel()
        }, e.unMount = function() {
            this.removeListeners(), t.instances.delete(this.el)
        }, e.isWithinBounds = function(t) {
            return this.mouseX >= t.left && this.mouseX <= t.left + t.width && this.mouseY >= t.top && this.mouseY <= t.top + t.height
        }, e.findChild = function(t, e) {
            var r = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector;
            return Array.prototype.filter.call(t.children, (function(t) {
                return r.call(t, e)
            }))[0]
        }, t
    }();
    return Yi.defaultOptions = {
        autoHide: !0,
        forceVisible: !1,
        clickOnTrack: !0,
        clickOnTrackSpeed: 40,
        classNames: {
            contentEl: "simplebar-content",
            contentWrapper: "simplebar-content-wrapper",
            offset: "simplebar-offset",
            mask: "simplebar-mask",
            wrapper: "simplebar-wrapper",
            placeholder: "simplebar-placeholder",
            scrollbar: "simplebar-scrollbar",
            track: "simplebar-track",
            heightAutoObserverWrapperEl: "simplebar-height-auto-observer-wrapper",
            heightAutoObserverEl: "simplebar-height-auto-observer",
            visible: "simplebar-visible",
            horizontal: "simplebar-horizontal",
            vertical: "simplebar-vertical",
            hover: "simplebar-hover",
            dragging: "simplebar-dragging"
        },
        scrollbarMinSize: 25,
        scrollbarMaxSize: 0,
        timeout: 1e3
    }, Yi.instances = new WeakMap, Yi.initDOMLoadedElements = function() {
        document.removeEventListener("DOMContentLoaded", this.initDOMLoadedElements), window.removeEventListener("load", this.initDOMLoadedElements), Array.prototype.forEach.call(document.querySelectorAll("[data-simplebar]"), (function(t) {
            "init" === t.getAttribute("data-simplebar") || Yi.instances.has(t) || new Yi(t, qi(t.attributes))
        }))
    }, Yi.removeObserver = function() {
        this.globalObserver.disconnect()
    }, Yi.initHtmlApi = function() {
        this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this), "undefined" != typeof MutationObserver && (this.globalObserver = new MutationObserver(Yi.handleMutations), this.globalObserver.observe(document, {
            childList: !0,
            subtree: !0
        })), "complete" === document.readyState || "loading" !== document.readyState && !document.documentElement.doScroll ? window.setTimeout(this.initDOMLoadedElements) : (document.addEventListener("DOMContentLoaded", this.initDOMLoadedElements), window.addEventListener("load", this.initDOMLoadedElements))
    }, Yi.handleMutations = function(t) {
        t.forEach((function(t) {
            Array.prototype.forEach.call(t.addedNodes, (function(t) {
                1 === t.nodeType && (t.hasAttribute("data-simplebar") ? !Yi.instances.has(t) && new Yi(t, qi(t.attributes)) : Array.prototype.forEach.call(t.querySelectorAll("[data-simplebar]"), (function(t) {
                    "init" === t.getAttribute("data-simplebar") || Yi.instances.has(t) || new Yi(t, qi(t.attributes))
                })))
            })), Array.prototype.forEach.call(t.removedNodes, (function(t) {
                1 === t.nodeType && (t.hasAttribute('[data-simplebar="init"]') ? Yi.instances.has(t) && Yi.instances.get(t).unMount() : Array.prototype.forEach.call(t.querySelectorAll('[data-simplebar="init"]'), (function(t) {
                    Yi.instances.has(t) && Yi.instances.get(t).unMount()
                })))
            }))
        }))
    }, Yi.getOptions = qi, Yt && Yi.initHtmlApi(), Yi
}));

/*!
 * Bootstrap v5.1.0 (https://getbootstrap.com/)
 * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).bootstrap = e()
}(this, (function() {
    "use strict";
    const t = t => {
            let e = t.getAttribute("data-bs-target");
            if (!e || "#" === e) {
                let i = t.getAttribute("href");
                if (!i || !i.includes("#") && !i.startsWith(".")) return null;
                i.includes("#") && !i.startsWith("#") && (i = "#" + i.split("#")[1]), e = i && "#" !== i ? i.trim() : null
            }
            return e
        },
        e = e => {
            const i = t(e);
            return i && document.querySelector(i) ? i : null
        },
        i = e => {
            const i = t(e);
            return i ? document.querySelector(i) : null
        },
        n = t => {
            t.dispatchEvent(new Event("transitionend"))
        },
        s = t => !(!t || "object" != typeof t) && (void 0 !== t.jquery && (t = t[0]), void 0 !== t.nodeType),
        o = t => s(t) ? t.jquery ? t[0] : t : "string" == typeof t && t.length > 0 ? document.querySelector(t) : null,
        r = (t, e, i) => {
            Object.keys(i).forEach(n => {
                const o = i[n],
                    r = e[n],
                    a = r && s(r) ? "element" : null == (l = r) ? "" + l : {}.toString.call(l).match(/\s([a-z]+)/i)[1].toLowerCase();
                var l;
                if (!new RegExp(o).test(a)) throw new TypeError(`${t.toUpperCase()}: Option "${n}" provided type "${a}" but expected type "${o}".`)
            })
        },
        a = t => !(!s(t) || 0 === t.getClientRects().length) && "visible" === getComputedStyle(t).getPropertyValue("visibility"),
        l = t => !t || t.nodeType !== Node.ELEMENT_NODE || !!t.classList.contains("disabled") || (void 0 !== t.disabled ? t.disabled : t.hasAttribute("disabled") && "false" !== t.getAttribute("disabled")),
        c = t => {
            if (!document.documentElement.attachShadow) return null;
            if ("function" == typeof t.getRootNode) {
                const e = t.getRootNode();
                return e instanceof ShadowRoot ? e : null
            }
            return t instanceof ShadowRoot ? t : t.parentNode ? c(t.parentNode) : null
        },
        h = () => {},
        d = t => {
            t.offsetHeight
        },
        u = () => {
            const {
                jQuery: t
            } = window;
            return t && !document.body.hasAttribute("data-bs-no-jquery") ? t : null
        },
        f = [],
        p = () => "rtl" === document.documentElement.dir,
        m = t => {
            var e;
            e = () => {
                const e = u();
                if (e) {
                    const i = t.NAME,
                        n = e.fn[i];
                    e.fn[i] = t.jQueryInterface, e.fn[i].Constructor = t, e.fn[i].noConflict = () => (e.fn[i] = n, t.jQueryInterface)
                }
            }, "loading" === document.readyState ? (f.length || document.addEventListener("DOMContentLoaded", () => {
                f.forEach(t => t())
            }), f.push(e)) : e()
        },
        g = t => {
            "function" == typeof t && t()
        },
        _ = (t, e, i = !0) => {
            if (!i) return void g(t);
            const s = (t => {
                if (!t) return 0;
                let {
                    transitionDuration: e,
                    transitionDelay: i
                } = window.getComputedStyle(t);
                const n = Number.parseFloat(e),
                    s = Number.parseFloat(i);
                return n || s ? (e = e.split(",")[0], i = i.split(",")[0], 1e3 * (Number.parseFloat(e) + Number.parseFloat(i))) : 0
            })(e) + 5;
            let o = !1;
            const r = ({
                target: i
            }) => {
                i === e && (o = !0, e.removeEventListener("transitionend", r), g(t))
            };
            e.addEventListener("transitionend", r), setTimeout(() => {
                o || n(e)
            }, s)
        },
        b = (t, e, i, n) => {
            let s = t.indexOf(e);
            if (-1 === s) return t[!i && n ? t.length - 1 : 0];
            const o = t.length;
            return s += i ? 1 : -1, n && (s = (s + o) % o), t[Math.max(0, Math.min(s, o - 1))]
        },
        v = /[^.]*(?=\..*)\.|.*/,
        y = /\..*/,
        w = /::\d+$/,
        E = {};
    let A = 1;
    const T = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        },
        O = /^(mouseenter|mouseleave)/i,
        C = new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);

    function k(t, e) {
        return e && `${e}::${A++}` || t.uidEvent || A++
    }

    function L(t) {
        const e = k(t);
        return t.uidEvent = e, E[e] = E[e] || {}, E[e]
    }

    function x(t, e, i = null) {
        const n = Object.keys(t);
        for (let s = 0, o = n.length; s < o; s++) {
            const o = t[n[s]];
            if (o.originalHandler === e && o.delegationSelector === i) return o
        }
        return null
    }

    function D(t, e, i) {
        const n = "string" == typeof e,
            s = n ? i : e;
        let o = I(t);
        return C.has(o) || (o = t), [n, s, o]
    }

    function S(t, e, i, n, s) {
        if ("string" != typeof e || !t) return;
        if (i || (i = n, n = null), O.test(e)) {
            const t = t => function(e) {
                if (!e.relatedTarget || e.relatedTarget !== e.delegateTarget && !e.delegateTarget.contains(e.relatedTarget)) return t.call(this, e)
            };
            n ? n = t(n) : i = t(i)
        }
        const [o, r, a] = D(e, i, n), l = L(t), c = l[a] || (l[a] = {}), h = x(c, r, o ? i : null);
        if (h) return void(h.oneOff = h.oneOff && s);
        const d = k(r, e.replace(v, "")),
            u = o ? function(t, e, i) {
                return function n(s) {
                    const o = t.querySelectorAll(e);
                    for (let {
                            target: r
                        } = s; r && r !== this; r = r.parentNode)
                        for (let a = o.length; a--;)
                            if (o[a] === r) return s.delegateTarget = r, n.oneOff && P.off(t, s.type, e, i), i.apply(r, [s]);
                    return null
                }
            }(t, i, n) : function(t, e) {
                return function i(n) {
                    return n.delegateTarget = t, i.oneOff && P.off(t, n.type, e), e.apply(t, [n])
                }
            }(t, i);
        u.delegationSelector = o ? i : null, u.originalHandler = r, u.oneOff = s, u.uidEvent = d, c[d] = u, t.addEventListener(a, u, o)
    }

    function N(t, e, i, n, s) {
        const o = x(e[i], n, s);
        o && (t.removeEventListener(i, o, Boolean(s)), delete e[i][o.uidEvent])
    }

    function I(t) {
        return t = t.replace(y, ""), T[t] || t
    }
    const P = {
            on(t, e, i, n) {
                S(t, e, i, n, !1)
            },
            one(t, e, i, n) {
                S(t, e, i, n, !0)
            },
            off(t, e, i, n) {
                if ("string" != typeof e || !t) return;
                const [s, o, r] = D(e, i, n), a = r !== e, l = L(t), c = e.startsWith(".");
                if (void 0 !== o) {
                    if (!l || !l[r]) return;
                    return void N(t, l, r, o, s ? i : null)
                }
                c && Object.keys(l).forEach(i => {
                    ! function(t, e, i, n) {
                        const s = e[i] || {};
                        Object.keys(s).forEach(o => {
                            if (o.includes(n)) {
                                const n = s[o];
                                N(t, e, i, n.originalHandler, n.delegationSelector)
                            }
                        })
                    }(t, l, i, e.slice(1))
                });
                const h = l[r] || {};
                Object.keys(h).forEach(i => {
                    const n = i.replace(w, "");
                    if (!a || e.includes(n)) {
                        const e = h[i];
                        N(t, l, r, e.originalHandler, e.delegationSelector)
                    }
                })
            },
            trigger(t, e, i) {
                if ("string" != typeof e || !t) return null;
                const n = u(),
                    s = I(e),
                    o = e !== s,
                    r = C.has(s);
                let a, l = !0,
                    c = !0,
                    h = !1,
                    d = null;
                return o && n && (a = n.Event(e, i), n(t).trigger(a), l = !a.isPropagationStopped(), c = !a.isImmediatePropagationStopped(), h = a.isDefaultPrevented()), r ? (d = document.createEvent("HTMLEvents"), d.initEvent(s, l, !0)) : d = new CustomEvent(e, {
                    bubbles: l,
                    cancelable: !0
                }), void 0 !== i && Object.keys(i).forEach(t => {
                    Object.defineProperty(d, t, {
                        get: () => i[t]
                    })
                }), h && d.preventDefault(), c && t.dispatchEvent(d), d.defaultPrevented && void 0 !== a && a.preventDefault(), d
            }
        },
        j = new Map;
    var M = {
        set(t, e, i) {
            j.has(t) || j.set(t, new Map);
            const n = j.get(t);
            n.has(e) || 0 === n.size ? n.set(e, i) : console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(n.keys())[0]}.`)
        },
        get: (t, e) => j.has(t) && j.get(t).get(e) || null,
        remove(t, e) {
            if (!j.has(t)) return;
            const i = j.get(t);
            i.delete(e), 0 === i.size && j.delete(t)
        }
    };
    class H {
        constructor(t) {
            (t = o(t)) && (this._element = t, M.set(this._element, this.constructor.DATA_KEY, this))
        }
        dispose() {
            M.remove(this._element, this.constructor.DATA_KEY), P.off(this._element, this.constructor.EVENT_KEY), Object.getOwnPropertyNames(this).forEach(t => {
                this[t] = null
            })
        }
        _queueCallback(t, e, i = !0) {
            _(t, e, i)
        }
        static getInstance(t) {
            return M.get(o(t), this.DATA_KEY)
        }
        static getOrCreateInstance(t, e = {}) {
            return this.getInstance(t) || new this(t, "object" == typeof e ? e : null)
        }
        static get VERSION() {
            return "5.1.0"
        }
        static get NAME() {
            throw new Error('You have to implement the static method "NAME", for each component!')
        }
        static get DATA_KEY() {
            return "bs." + this.NAME
        }
        static get EVENT_KEY() {
            return "." + this.DATA_KEY
        }
    }
    const B = (t, e = "hide") => {
        const n = "click.dismiss" + t.EVENT_KEY,
            s = t.NAME;
        P.on(document, n, `[data-bs-dismiss="${s}"]`, (function(n) {
            if (["A", "AREA"].includes(this.tagName) && n.preventDefault(), l(this)) return;
            const o = i(this) || this.closest("." + s);
            t.getOrCreateInstance(o)[e]()
        }))
    };
    class R extends H {
        static get NAME() {
            return "alert"
        }
        close() {
            if (P.trigger(this._element, "close.bs.alert").defaultPrevented) return;
            this._element.classList.remove("show");
            const t = this._element.classList.contains("fade");
            this._queueCallback(() => this._destroyElement(), this._element, t)
        }
        _destroyElement() {
            this._element.remove(), P.trigger(this._element, "closed.bs.alert"), this.dispose()
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = R.getOrCreateInstance(this);
                if ("string" == typeof t) {
                    if (void 0 === e[t] || t.startsWith("_") || "constructor" === t) throw new TypeError(`No method named "${t}"`);
                    e[t](this)
                }
            }))
        }
    }
    B(R, "close"), m(R);
    class W extends H {
        static get NAME() {
            return "button"
        }
        toggle() {
            this._element.setAttribute("aria-pressed", this._element.classList.toggle("active"))
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = W.getOrCreateInstance(this);
                "toggle" === t && e[t]()
            }))
        }
    }

    function z(t) {
        return "true" === t || "false" !== t && (t === Number(t).toString() ? Number(t) : "" === t || "null" === t ? null : t)
    }

    function q(t) {
        return t.replace(/[A-Z]/g, t => "-" + t.toLowerCase())
    }
    P.on(document, "click.bs.button.data-api", '[data-bs-toggle="button"]', t => {
        t.preventDefault();
        const e = t.target.closest('[data-bs-toggle="button"]');
        W.getOrCreateInstance(e).toggle()
    }), m(W);
    const F = {
            setDataAttribute(t, e, i) {
                t.setAttribute("data-bs-" + q(e), i)
            },
            removeDataAttribute(t, e) {
                t.removeAttribute("data-bs-" + q(e))
            },
            getDataAttributes(t) {
                if (!t) return {};
                const e = {};
                return Object.keys(t.dataset).filter(t => t.startsWith("bs")).forEach(i => {
                    let n = i.replace(/^bs/, "");
                    n = n.charAt(0).toLowerCase() + n.slice(1, n.length), e[n] = z(t.dataset[i])
                }), e
            },
            getDataAttribute: (t, e) => z(t.getAttribute("data-bs-" + q(e))),
            offset(t) {
                const e = t.getBoundingClientRect();
                return {
                    top: e.top + window.pageYOffset,
                    left: e.left + window.pageXOffset
                }
            },
            position: t => ({
                top: t.offsetTop,
                left: t.offsetLeft
            })
        },
        U = {
            find: (t, e = document.documentElement) => [].concat(...Element.prototype.querySelectorAll.call(e, t)),
            findOne: (t, e = document.documentElement) => Element.prototype.querySelector.call(e, t),
            children: (t, e) => [].concat(...t.children).filter(t => t.matches(e)),
            parents(t, e) {
                const i = [];
                let n = t.parentNode;
                for (; n && n.nodeType === Node.ELEMENT_NODE && 3 !== n.nodeType;) n.matches(e) && i.push(n), n = n.parentNode;
                return i
            },
            prev(t, e) {
                let i = t.previousElementSibling;
                for (; i;) {
                    if (i.matches(e)) return [i];
                    i = i.previousElementSibling
                }
                return []
            },
            next(t, e) {
                let i = t.nextElementSibling;
                for (; i;) {
                    if (i.matches(e)) return [i];
                    i = i.nextElementSibling
                }
                return []
            },
            focusableChildren(t) {
                const e = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map(t => t + ':not([tabindex^="-"])').join(", ");
                return this.find(e, t).filter(t => !l(t) && a(t))
            }
        },
        $ = {
            interval: 5e3,
            keyboard: !0,
            slide: !1,
            pause: "hover",
            wrap: !0,
            touch: !0
        },
        V = {
            interval: "(number|boolean)",
            keyboard: "boolean",
            slide: "(boolean|string)",
            pause: "(string|boolean)",
            wrap: "boolean",
            touch: "boolean"
        },
        K = "next",
        X = "prev",
        Y = "left",
        Q = "right",
        G = {
            ArrowLeft: Q,
            ArrowRight: Y
        };
    class Z extends H {
        constructor(t, e) {
            super(t), this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(e), this._indicatorsElement = U.findOne(".carousel-indicators", this._element), this._touchSupported = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0, this._pointerEvent = Boolean(window.PointerEvent), this._addEventListeners()
        }
        static get Default() {
            return $
        }
        static get NAME() {
            return "carousel"
        }
        next() {
            this._slide(K)
        }
        nextWhenVisible() {
            !document.hidden && a(this._element) && this.next()
        }
        prev() {
            this._slide(X)
        }
        pause(t) {
            t || (this._isPaused = !0), U.findOne(".carousel-item-next, .carousel-item-prev", this._element) && (n(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null
        }
        cycle(t) {
            t || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config && this._config.interval && !this._isPaused && (this._updateInterval(), this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
        }
        to(t) {
            this._activeElement = U.findOne(".active.carousel-item", this._element);
            const e = this._getItemIndex(this._activeElement);
            if (t > this._items.length - 1 || t < 0) return;
            if (this._isSliding) return void P.one(this._element, "slid.bs.carousel", () => this.to(t));
            if (e === t) return this.pause(), void this.cycle();
            const i = t > e ? K : X;
            this._slide(i, this._items[t])
        }
        _getConfig(t) {
            return t = { ...$,
                ...F.getDataAttributes(this._element),
                ..."object" == typeof t ? t : {}
            }, r("carousel", t, V), t
        }
        _handleSwipe() {
            const t = Math.abs(this.touchDeltaX);
            if (t <= 40) return;
            const e = t / this.touchDeltaX;
            this.touchDeltaX = 0, e && this._slide(e > 0 ? Q : Y)
        }
        _addEventListeners() {
            this._config.keyboard && P.on(this._element, "keydown.bs.carousel", t => this._keydown(t)), "hover" === this._config.pause && (P.on(this._element, "mouseenter.bs.carousel", t => this.pause(t)), P.on(this._element, "mouseleave.bs.carousel", t => this.cycle(t))), this._config.touch && this._touchSupported && this._addTouchEventListeners()
        }
        _addTouchEventListeners() {
            const t = t => {
                    !this._pointerEvent || "pen" !== t.pointerType && "touch" !== t.pointerType ? this._pointerEvent || (this.touchStartX = t.touches[0].clientX) : this.touchStartX = t.clientX
                },
                e = t => {
                    this.touchDeltaX = t.touches && t.touches.length > 1 ? 0 : t.touches[0].clientX - this.touchStartX
                },
                i = t => {
                    !this._pointerEvent || "pen" !== t.pointerType && "touch" !== t.pointerType || (this.touchDeltaX = t.clientX - this.touchStartX), this._handleSwipe(), "hover" === this._config.pause && (this.pause(), this.touchTimeout && clearTimeout(this.touchTimeout), this.touchTimeout = setTimeout(t => this.cycle(t), 500 + this._config.interval))
                };
            U.find(".carousel-item img", this._element).forEach(t => {
                P.on(t, "dragstart.bs.carousel", t => t.preventDefault())
            }), this._pointerEvent ? (P.on(this._element, "pointerdown.bs.carousel", e => t(e)), P.on(this._element, "pointerup.bs.carousel", t => i(t)), this._element.classList.add("pointer-event")) : (P.on(this._element, "touchstart.bs.carousel", e => t(e)), P.on(this._element, "touchmove.bs.carousel", t => e(t)), P.on(this._element, "touchend.bs.carousel", t => i(t)))
        }
        _keydown(t) {
            if (/input|textarea/i.test(t.target.tagName)) return;
            const e = G[t.key];
            e && (t.preventDefault(), this._slide(e))
        }
        _getItemIndex(t) {
            return this._items = t && t.parentNode ? U.find(".carousel-item", t.parentNode) : [], this._items.indexOf(t)
        }
        _getItemByOrder(t, e) {
            const i = t === K;
            return b(this._items, e, i, this._config.wrap)
        }
        _triggerSlideEvent(t, e) {
            const i = this._getItemIndex(t),
                n = this._getItemIndex(U.findOne(".active.carousel-item", this._element));
            return P.trigger(this._element, "slide.bs.carousel", {
                relatedTarget: t,
                direction: e,
                from: n,
                to: i
            })
        }
        _setActiveIndicatorElement(t) {
            if (this._indicatorsElement) {
                const e = U.findOne(".active", this._indicatorsElement);
                e.classList.remove("active"), e.removeAttribute("aria-current");
                const i = U.find("[data-bs-target]", this._indicatorsElement);
                for (let e = 0; e < i.length; e++)
                    if (Number.parseInt(i[e].getAttribute("data-bs-slide-to"), 10) === this._getItemIndex(t)) {
                        i[e].classList.add("active"), i[e].setAttribute("aria-current", "true");
                        break
                    }
            }
        }
        _updateInterval() {
            const t = this._activeElement || U.findOne(".active.carousel-item", this._element);
            if (!t) return;
            const e = Number.parseInt(t.getAttribute("data-bs-interval"), 10);
            e ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = e) : this._config.interval = this._config.defaultInterval || this._config.interval
        }
        _slide(t, e) {
            const i = this._directionToOrder(t),
                n = U.findOne(".active.carousel-item", this._element),
                s = this._getItemIndex(n),
                o = e || this._getItemByOrder(i, n),
                r = this._getItemIndex(o),
                a = Boolean(this._interval),
                l = i === K,
                c = l ? "carousel-item-start" : "carousel-item-end",
                h = l ? "carousel-item-next" : "carousel-item-prev",
                u = this._orderToDirection(i);
            if (o && o.classList.contains("active")) return void(this._isSliding = !1);
            if (this._isSliding) return;
            if (this._triggerSlideEvent(o, u).defaultPrevented) return;
            if (!n || !o) return;
            this._isSliding = !0, a && this.pause(), this._setActiveIndicatorElement(o), this._activeElement = o;
            const f = () => {
                P.trigger(this._element, "slid.bs.carousel", {
                    relatedTarget: o,
                    direction: u,
                    from: s,
                    to: r
                })
            };
            if (this._element.classList.contains("slide")) {
                o.classList.add(h), d(o), n.classList.add(c), o.classList.add(c);
                const t = () => {
                    o.classList.remove(c, h), o.classList.add("active"), n.classList.remove("active", h, c), this._isSliding = !1, setTimeout(f, 0)
                };
                this._queueCallback(t, n, !0)
            } else n.classList.remove("active"), o.classList.add("active"), this._isSliding = !1, f();
            a && this.cycle()
        }
        _directionToOrder(t) {
            return [Q, Y].includes(t) ? p() ? t === Y ? X : K : t === Y ? K : X : t
        }
        _orderToDirection(t) {
            return [K, X].includes(t) ? p() ? t === X ? Y : Q : t === X ? Q : Y : t
        }
        static carouselInterface(t, e) {
            const i = Z.getOrCreateInstance(t, e);
            let {
                _config: n
            } = i;
            "object" == typeof e && (n = { ...n,
                ...e
            });
            const s = "string" == typeof e ? e : n.slide;
            if ("number" == typeof e) i.to(e);
            else if ("string" == typeof s) {
                if (void 0 === i[s]) throw new TypeError(`No method named "${s}"`);
                i[s]()
            } else n.interval && n.ride && (i.pause(), i.cycle())
        }
        static jQueryInterface(t) {
            return this.each((function() {
                Z.carouselInterface(this, t)
            }))
        }
        static dataApiClickHandler(t) {
            const e = i(this);
            if (!e || !e.classList.contains("carousel")) return;
            const n = { ...F.getDataAttributes(e),
                    ...F.getDataAttributes(this)
                },
                s = this.getAttribute("data-bs-slide-to");
            s && (n.interval = !1), Z.carouselInterface(e, n), s && Z.getInstance(e).to(s), t.preventDefault()
        }
    }
    P.on(document, "click.bs.carousel.data-api", "[data-bs-slide], [data-bs-slide-to]", Z.dataApiClickHandler), P.on(window, "load.bs.carousel.data-api", () => {
        const t = U.find('[data-bs-ride="carousel"]');
        for (let e = 0, i = t.length; e < i; e++) Z.carouselInterface(t[e], Z.getInstance(t[e]))
    }), m(Z);
    const J = {
            toggle: !0,
            parent: null
        },
        tt = {
            toggle: "boolean",
            parent: "(null|element)"
        };
    class et extends H {
        constructor(t, i) {
            super(t), this._isTransitioning = !1, this._config = this._getConfig(i), this._triggerArray = [];
            const n = U.find('[data-bs-toggle="collapse"]');
            for (let t = 0, i = n.length; t < i; t++) {
                const i = n[t],
                    s = e(i),
                    o = U.find(s).filter(t => t === this._element);
                null !== s && o.length && (this._selector = s, this._triggerArray.push(i))
            }
            this._initializeChildren(), this._config.parent || this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()), this._config.toggle && this.toggle()
        }
        static get Default() {
            return J
        }
        static get NAME() {
            return "collapse"
        }
        toggle() {
            this._isShown() ? this.hide() : this.show()
        }
        show() {
            if (this._isTransitioning || this._isShown()) return;
            let t, e = [];
            if (this._config.parent) {
                const t = U.find(".collapse .collapse", this._config.parent);
                e = U.find(".show, .collapsing", this._config.parent).filter(e => !t.includes(e))
            }
            const i = U.findOne(this._selector);
            if (e.length) {
                const n = e.find(t => i !== t);
                if (t = n ? et.getInstance(n) : null, t && t._isTransitioning) return
            }
            if (P.trigger(this._element, "show.bs.collapse").defaultPrevented) return;
            e.forEach(e => {
                i !== e && et.getOrCreateInstance(e, {
                    toggle: !1
                }).hide(), t || M.set(e, "bs.collapse", null)
            });
            const n = this._getDimension();
            this._element.classList.remove("collapse"), this._element.classList.add("collapsing"), this._element.style[n] = 0, this._addAriaAndCollapsedClass(this._triggerArray, !0), this._isTransitioning = !0;
            const s = "scroll" + (n[0].toUpperCase() + n.slice(1));
            this._queueCallback(() => {
                this._isTransitioning = !1, this._element.classList.remove("collapsing"), this._element.classList.add("collapse", "show"), this._element.style[n] = "", P.trigger(this._element, "shown.bs.collapse")
            }, this._element, !0), this._element.style[n] = this._element[s] + "px"
        }
        hide() {
            if (this._isTransitioning || !this._isShown()) return;
            if (P.trigger(this._element, "hide.bs.collapse").defaultPrevented) return;
            const t = this._getDimension();
            this._element.style[t] = this._element.getBoundingClientRect()[t] + "px", d(this._element), this._element.classList.add("collapsing"), this._element.classList.remove("collapse", "show");
            const e = this._triggerArray.length;
            for (let t = 0; t < e; t++) {
                const e = this._triggerArray[t],
                    n = i(e);
                n && !this._isShown(n) && this._addAriaAndCollapsedClass([e], !1)
            }
            this._isTransitioning = !0, this._element.style[t] = "", this._queueCallback(() => {
                this._isTransitioning = !1, this._element.classList.remove("collapsing"), this._element.classList.add("collapse"), P.trigger(this._element, "hidden.bs.collapse")
            }, this._element, !0)
        }
        _isShown(t = this._element) {
            return t.classList.contains("show")
        }
        _getConfig(t) {
            return (t = { ...J,
                ...F.getDataAttributes(this._element),
                ...t
            }).toggle = Boolean(t.toggle), t.parent = o(t.parent), r("collapse", t, tt), t
        }
        _getDimension() {
            return this._element.classList.contains("collapse-horizontal") ? "width" : "height"
        }
        _initializeChildren() {
            if (!this._config.parent) return;
            const t = U.find(".collapse .collapse", this._config.parent);
            U.find('[data-bs-toggle="collapse"]', this._config.parent).filter(e => !t.includes(e)).forEach(t => {
                const e = i(t);
                e && this._addAriaAndCollapsedClass([t], this._isShown(e))
            })
        }
        _addAriaAndCollapsedClass(t, e) {
            t.length && t.forEach(t => {
                e ? t.classList.remove("collapsed") : t.classList.add("collapsed"), t.setAttribute("aria-expanded", e)
            })
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = {};
                "string" == typeof t && /show|hide/.test(t) && (e.toggle = !1);
                const i = et.getOrCreateInstance(this, e);
                if ("string" == typeof t) {
                    if (void 0 === i[t]) throw new TypeError(`No method named "${t}"`);
                    i[t]()
                }
            }))
        }
    }
    P.on(document, "click.bs.collapse.data-api", '[data-bs-toggle="collapse"]', (function(t) {
        ("A" === t.target.tagName || t.delegateTarget && "A" === t.delegateTarget.tagName) && t.preventDefault();
        const i = e(this);
        U.find(i).forEach(t => {
            et.getOrCreateInstance(t, {
                toggle: !1
            }).toggle()
        })
    })), m(et);
    var it = "top",
        nt = "bottom",
        st = "right",
        ot = "left",
        rt = [it, nt, st, ot],
        at = rt.reduce((function(t, e) {
            return t.concat([e + "-start", e + "-end"])
        }), []),
        lt = [].concat(rt, ["auto"]).reduce((function(t, e) {
            return t.concat([e, e + "-start", e + "-end"])
        }), []),
        ct = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];

    function ht(t) {
        return t ? (t.nodeName || "").toLowerCase() : null
    }

    function dt(t) {
        if (null == t) return window;
        if ("[object Window]" !== t.toString()) {
            var e = t.ownerDocument;
            return e && e.defaultView || window
        }
        return t
    }

    function ut(t) {
        return t instanceof dt(t).Element || t instanceof Element
    }

    function ft(t) {
        return t instanceof dt(t).HTMLElement || t instanceof HTMLElement
    }

    function pt(t) {
        return "undefined" != typeof ShadowRoot && (t instanceof dt(t).ShadowRoot || t instanceof ShadowRoot)
    }
    var mt = {
        name: "applyStyles",
        enabled: !0,
        phase: "write",
        fn: function(t) {
            var e = t.state;
            Object.keys(e.elements).forEach((function(t) {
                var i = e.styles[t] || {},
                    n = e.attributes[t] || {},
                    s = e.elements[t];
                ft(s) && ht(s) && (Object.assign(s.style, i), Object.keys(n).forEach((function(t) {
                    var e = n[t];
                    !1 === e ? s.removeAttribute(t) : s.setAttribute(t, !0 === e ? "" : e)
                })))
            }))
        },
        effect: function(t) {
            var e = t.state,
                i = {
                    popper: {
                        position: e.options.strategy,
                        left: "0",
                        top: "0",
                        margin: "0"
                    },
                    arrow: {
                        position: "absolute"
                    },
                    reference: {}
                };
            return Object.assign(e.elements.popper.style, i.popper), e.styles = i, e.elements.arrow && Object.assign(e.elements.arrow.style, i.arrow),
                function() {
                    Object.keys(e.elements).forEach((function(t) {
                        var n = e.elements[t],
                            s = e.attributes[t] || {},
                            o = Object.keys(e.styles.hasOwnProperty(t) ? e.styles[t] : i[t]).reduce((function(t, e) {
                                return t[e] = "", t
                            }), {});
                        ft(n) && ht(n) && (Object.assign(n.style, o), Object.keys(s).forEach((function(t) {
                            n.removeAttribute(t)
                        })))
                    }))
                }
        },
        requires: ["computeStyles"]
    };

    function gt(t) {
        return t.split("-")[0]
    }
    var _t = Math.round;

    function bt(t, e) {
        void 0 === e && (e = !1);
        var i = t.getBoundingClientRect(),
            n = 1,
            s = 1;
        return ft(t) && e && (n = i.width / t.offsetWidth || 1, s = i.height / t.offsetHeight || 1), {
            width: _t(i.width / n),
            height: _t(i.height / s),
            top: _t(i.top / s),
            right: _t(i.right / n),
            bottom: _t(i.bottom / s),
            left: _t(i.left / n),
            x: _t(i.left / n),
            y: _t(i.top / s)
        }
    }

    function vt(t) {
        var e = bt(t),
            i = t.offsetWidth,
            n = t.offsetHeight;
        return Math.abs(e.width - i) <= 1 && (i = e.width), Math.abs(e.height - n) <= 1 && (n = e.height), {
            x: t.offsetLeft,
            y: t.offsetTop,
            width: i,
            height: n
        }
    }

    function yt(t, e) {
        var i = e.getRootNode && e.getRootNode();
        if (t.contains(e)) return !0;
        if (i && pt(i)) {
            var n = e;
            do {
                if (n && t.isSameNode(n)) return !0;
                n = n.parentNode || n.host
            } while (n)
        }
        return !1
    }

    function wt(t) {
        return dt(t).getComputedStyle(t)
    }

    function Et(t) {
        return ["table", "td", "th"].indexOf(ht(t)) >= 0
    }

    function At(t) {
        return ((ut(t) ? t.ownerDocument : t.document) || window.document).documentElement
    }

    function Tt(t) {
        return "html" === ht(t) ? t : t.assignedSlot || t.parentNode || (pt(t) ? t.host : null) || At(t)
    }

    function Ot(t) {
        return ft(t) && "fixed" !== wt(t).position ? t.offsetParent : null
    }

    function Ct(t) {
        for (var e = dt(t), i = Ot(t); i && Et(i) && "static" === wt(i).position;) i = Ot(i);
        return i && ("html" === ht(i) || "body" === ht(i) && "static" === wt(i).position) ? e : i || function(t) {
            var e = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox");
            if (-1 !== navigator.userAgent.indexOf("Trident") && ft(t) && "fixed" === wt(t).position) return null;
            for (var i = Tt(t); ft(i) && ["html", "body"].indexOf(ht(i)) < 0;) {
                var n = wt(i);
                if ("none" !== n.transform || "none" !== n.perspective || "paint" === n.contain || -1 !== ["transform", "perspective"].indexOf(n.willChange) || e && "filter" === n.willChange || e && n.filter && "none" !== n.filter) return i;
                i = i.parentNode
            }
            return null
        }(t) || e
    }

    function kt(t) {
        return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y"
    }
    var Lt = Math.max,
        xt = Math.min,
        Dt = Math.round;

    function St(t, e, i) {
        return Lt(t, xt(e, i))
    }

    function Nt(t) {
        return Object.assign({}, {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }, t)
    }

    function It(t, e) {
        return e.reduce((function(e, i) {
            return e[i] = t, e
        }), {})
    }
    var Pt = {
            name: "arrow",
            enabled: !0,
            phase: "main",
            fn: function(t) {
                var e, i = t.state,
                    n = t.name,
                    s = t.options,
                    o = i.elements.arrow,
                    r = i.modifiersData.popperOffsets,
                    a = gt(i.placement),
                    l = kt(a),
                    c = [ot, st].indexOf(a) >= 0 ? "height" : "width";
                if (o && r) {
                    var h = function(t, e) {
                            return Nt("number" != typeof(t = "function" == typeof t ? t(Object.assign({}, e.rects, {
                                placement: e.placement
                            })) : t) ? t : It(t, rt))
                        }(s.padding, i),
                        d = vt(o),
                        u = "y" === l ? it : ot,
                        f = "y" === l ? nt : st,
                        p = i.rects.reference[c] + i.rects.reference[l] - r[l] - i.rects.popper[c],
                        m = r[l] - i.rects.reference[l],
                        g = Ct(o),
                        _ = g ? "y" === l ? g.clientHeight || 0 : g.clientWidth || 0 : 0,
                        b = p / 2 - m / 2,
                        v = h[u],
                        y = _ - d[c] - h[f],
                        w = _ / 2 - d[c] / 2 + b,
                        E = St(v, w, y),
                        A = l;
                    i.modifiersData[n] = ((e = {})[A] = E, e.centerOffset = E - w, e)
                }
            },
            effect: function(t) {
                var e = t.state,
                    i = t.options.element,
                    n = void 0 === i ? "[data-popper-arrow]" : i;
                null != n && ("string" != typeof n || (n = e.elements.popper.querySelector(n))) && yt(e.elements.popper, n) && (e.elements.arrow = n)
            },
            requires: ["popperOffsets"],
            requiresIfExists: ["preventOverflow"]
        },
        jt = {
            top: "auto",
            right: "auto",
            bottom: "auto",
            left: "auto"
        };

    function Mt(t) {
        var e, i = t.popper,
            n = t.popperRect,
            s = t.placement,
            o = t.offsets,
            r = t.position,
            a = t.gpuAcceleration,
            l = t.adaptive,
            c = t.roundOffsets,
            h = !0 === c ? function(t) {
                var e = t.x,
                    i = t.y,
                    n = window.devicePixelRatio || 1;
                return {
                    x: Dt(Dt(e * n) / n) || 0,
                    y: Dt(Dt(i * n) / n) || 0
                }
            }(o) : "function" == typeof c ? c(o) : o,
            d = h.x,
            u = void 0 === d ? 0 : d,
            f = h.y,
            p = void 0 === f ? 0 : f,
            m = o.hasOwnProperty("x"),
            g = o.hasOwnProperty("y"),
            _ = ot,
            b = it,
            v = window;
        if (l) {
            var y = Ct(i),
                w = "clientHeight",
                E = "clientWidth";
            y === dt(i) && "static" !== wt(y = At(i)).position && (w = "scrollHeight", E = "scrollWidth"), y = y, s === it && (b = nt, p -= y[w] - n.height, p *= a ? 1 : -1), s === ot && (_ = st, u -= y[E] - n.width, u *= a ? 1 : -1)
        }
        var A, T = Object.assign({
            position: r
        }, l && jt);
        return a ? Object.assign({}, T, ((A = {})[b] = g ? "0" : "", A[_] = m ? "0" : "", A.transform = (v.devicePixelRatio || 1) < 2 ? "translate(" + u + "px, " + p + "px)" : "translate3d(" + u + "px, " + p + "px, 0)", A)) : Object.assign({}, T, ((e = {})[b] = g ? p + "px" : "", e[_] = m ? u + "px" : "", e.transform = "", e))
    }
    var Ht = {
            name: "computeStyles",
            enabled: !0,
            phase: "beforeWrite",
            fn: function(t) {
                var e = t.state,
                    i = t.options,
                    n = i.gpuAcceleration,
                    s = void 0 === n || n,
                    o = i.adaptive,
                    r = void 0 === o || o,
                    a = i.roundOffsets,
                    l = void 0 === a || a,
                    c = {
                        placement: gt(e.placement),
                        popper: e.elements.popper,
                        popperRect: e.rects.popper,
                        gpuAcceleration: s
                    };
                null != e.modifiersData.popperOffsets && (e.styles.popper = Object.assign({}, e.styles.popper, Mt(Object.assign({}, c, {
                    offsets: e.modifiersData.popperOffsets,
                    position: e.options.strategy,
                    adaptive: r,
                    roundOffsets: l
                })))), null != e.modifiersData.arrow && (e.styles.arrow = Object.assign({}, e.styles.arrow, Mt(Object.assign({}, c, {
                    offsets: e.modifiersData.arrow,
                    position: "absolute",
                    adaptive: !1,
                    roundOffsets: l
                })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
                    "data-popper-placement": e.placement
                })
            },
            data: {}
        },
        Bt = {
            passive: !0
        },
        Rt = {
            name: "eventListeners",
            enabled: !0,
            phase: "write",
            fn: function() {},
            effect: function(t) {
                var e = t.state,
                    i = t.instance,
                    n = t.options,
                    s = n.scroll,
                    o = void 0 === s || s,
                    r = n.resize,
                    a = void 0 === r || r,
                    l = dt(e.elements.popper),
                    c = [].concat(e.scrollParents.reference, e.scrollParents.popper);
                return o && c.forEach((function(t) {
                        t.addEventListener("scroll", i.update, Bt)
                    })), a && l.addEventListener("resize", i.update, Bt),
                    function() {
                        o && c.forEach((function(t) {
                            t.removeEventListener("scroll", i.update, Bt)
                        })), a && l.removeEventListener("resize", i.update, Bt)
                    }
            },
            data: {}
        },
        Wt = {
            left: "right",
            right: "left",
            bottom: "top",
            top: "bottom"
        };

    function zt(t) {
        return t.replace(/left|right|bottom|top/g, (function(t) {
            return Wt[t]
        }))
    }
    var qt = {
        start: "end",
        end: "start"
    };

    function Ft(t) {
        return t.replace(/start|end/g, (function(t) {
            return qt[t]
        }))
    }

    function Ut(t) {
        var e = dt(t);
        return {
            scrollLeft: e.pageXOffset,
            scrollTop: e.pageYOffset
        }
    }

    function $t(t) {
        return bt(At(t)).left + Ut(t).scrollLeft
    }

    function Vt(t) {
        var e = wt(t),
            i = e.overflow,
            n = e.overflowX,
            s = e.overflowY;
        return /auto|scroll|overlay|hidden/.test(i + s + n)
    }

    function Kt(t, e) {
        var i;
        void 0 === e && (e = []);
        var n = function t(e) {
                return ["html", "body", "#document"].indexOf(ht(e)) >= 0 ? e.ownerDocument.body : ft(e) && Vt(e) ? e : t(Tt(e))
            }(t),
            s = n === (null == (i = t.ownerDocument) ? void 0 : i.body),
            o = dt(n),
            r = s ? [o].concat(o.visualViewport || [], Vt(n) ? n : []) : n,
            a = e.concat(r);
        return s ? a : a.concat(Kt(Tt(r)))
    }

    function Xt(t) {
        return Object.assign({}, t, {
            left: t.x,
            top: t.y,
            right: t.x + t.width,
            bottom: t.y + t.height
        })
    }

    function Yt(t, e) {
        return "viewport" === e ? Xt(function(t) {
            var e = dt(t),
                i = At(t),
                n = e.visualViewport,
                s = i.clientWidth,
                o = i.clientHeight,
                r = 0,
                a = 0;
            return n && (s = n.width, o = n.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (r = n.offsetLeft, a = n.offsetTop)), {
                width: s,
                height: o,
                x: r + $t(t),
                y: a
            }
        }(t)) : ft(e) ? function(t) {
            var e = bt(t);
            return e.top = e.top + t.clientTop, e.left = e.left + t.clientLeft, e.bottom = e.top + t.clientHeight, e.right = e.left + t.clientWidth, e.width = t.clientWidth, e.height = t.clientHeight, e.x = e.left, e.y = e.top, e
        }(e) : Xt(function(t) {
            var e, i = At(t),
                n = Ut(t),
                s = null == (e = t.ownerDocument) ? void 0 : e.body,
                o = Lt(i.scrollWidth, i.clientWidth, s ? s.scrollWidth : 0, s ? s.clientWidth : 0),
                r = Lt(i.scrollHeight, i.clientHeight, s ? s.scrollHeight : 0, s ? s.clientHeight : 0),
                a = -n.scrollLeft + $t(t),
                l = -n.scrollTop;
            return "rtl" === wt(s || i).direction && (a += Lt(i.clientWidth, s ? s.clientWidth : 0) - o), {
                width: o,
                height: r,
                x: a,
                y: l
            }
        }(At(t)))
    }

    function Qt(t) {
        return t.split("-")[1]
    }

    function Gt(t) {
        var e, i = t.reference,
            n = t.element,
            s = t.placement,
            o = s ? gt(s) : null,
            r = s ? Qt(s) : null,
            a = i.x + i.width / 2 - n.width / 2,
            l = i.y + i.height / 2 - n.height / 2;
        switch (o) {
            case it:
                e = {
                    x: a,
                    y: i.y - n.height
                };
                break;
            case nt:
                e = {
                    x: a,
                    y: i.y + i.height
                };
                break;
            case st:
                e = {
                    x: i.x + i.width,
                    y: l
                };
                break;
            case ot:
                e = {
                    x: i.x - n.width,
                    y: l
                };
                break;
            default:
                e = {
                    x: i.x,
                    y: i.y
                }
        }
        var c = o ? kt(o) : null;
        if (null != c) {
            var h = "y" === c ? "height" : "width";
            switch (r) {
                case "start":
                    e[c] = e[c] - (i[h] / 2 - n[h] / 2);
                    break;
                case "end":
                    e[c] = e[c] + (i[h] / 2 - n[h] / 2)
            }
        }
        return e
    }

    function Zt(t, e) {
        void 0 === e && (e = {});
        var i = e,
            n = i.placement,
            s = void 0 === n ? t.placement : n,
            o = i.boundary,
            r = void 0 === o ? "clippingParents" : o,
            a = i.rootBoundary,
            l = void 0 === a ? "viewport" : a,
            c = i.elementContext,
            h = void 0 === c ? "popper" : c,
            d = i.altBoundary,
            u = void 0 !== d && d,
            f = i.padding,
            p = void 0 === f ? 0 : f,
            m = Nt("number" != typeof p ? p : It(p, rt)),
            g = "popper" === h ? "reference" : "popper",
            _ = t.elements.reference,
            b = t.rects.popper,
            v = t.elements[u ? g : h],
            y = function(t, e, i) {
                var n = "clippingParents" === e ? function(t) {
                        var e = Kt(Tt(t)),
                            i = ["absolute", "fixed"].indexOf(wt(t).position) >= 0 && ft(t) ? Ct(t) : t;
                        return ut(i) ? e.filter((function(t) {
                            return ut(t) && yt(t, i) && "body" !== ht(t)
                        })) : []
                    }(t) : [].concat(e),
                    s = [].concat(n, [i]),
                    o = s[0],
                    r = s.reduce((function(e, i) {
                        var n = Yt(t, i);
                        return e.top = Lt(n.top, e.top), e.right = xt(n.right, e.right), e.bottom = xt(n.bottom, e.bottom), e.left = Lt(n.left, e.left), e
                    }), Yt(t, o));
                return r.width = r.right - r.left, r.height = r.bottom - r.top, r.x = r.left, r.y = r.top, r
            }(ut(v) ? v : v.contextElement || At(t.elements.popper), r, l),
            w = bt(_),
            E = Gt({
                reference: w,
                element: b,
                strategy: "absolute",
                placement: s
            }),
            A = Xt(Object.assign({}, b, E)),
            T = "popper" === h ? A : w,
            O = {
                top: y.top - T.top + m.top,
                bottom: T.bottom - y.bottom + m.bottom,
                left: y.left - T.left + m.left,
                right: T.right - y.right + m.right
            },
            C = t.modifiersData.offset;
        if ("popper" === h && C) {
            var k = C[s];
            Object.keys(O).forEach((function(t) {
                var e = [st, nt].indexOf(t) >= 0 ? 1 : -1,
                    i = [it, nt].indexOf(t) >= 0 ? "y" : "x";
                O[t] += k[i] * e
            }))
        }
        return O
    }

    function Jt(t, e) {
        void 0 === e && (e = {});
        var i = e,
            n = i.placement,
            s = i.boundary,
            o = i.rootBoundary,
            r = i.padding,
            a = i.flipVariations,
            l = i.allowedAutoPlacements,
            c = void 0 === l ? lt : l,
            h = Qt(n),
            d = h ? a ? at : at.filter((function(t) {
                return Qt(t) === h
            })) : rt,
            u = d.filter((function(t) {
                return c.indexOf(t) >= 0
            }));
        0 === u.length && (u = d);
        var f = u.reduce((function(e, i) {
            return e[i] = Zt(t, {
                placement: i,
                boundary: s,
                rootBoundary: o,
                padding: r
            })[gt(i)], e
        }), {});
        return Object.keys(f).sort((function(t, e) {
            return f[t] - f[e]
        }))
    }
    var te = {
        name: "flip",
        enabled: !0,
        phase: "main",
        fn: function(t) {
            var e = t.state,
                i = t.options,
                n = t.name;
            if (!e.modifiersData[n]._skip) {
                for (var s = i.mainAxis, o = void 0 === s || s, r = i.altAxis, a = void 0 === r || r, l = i.fallbackPlacements, c = i.padding, h = i.boundary, d = i.rootBoundary, u = i.altBoundary, f = i.flipVariations, p = void 0 === f || f, m = i.allowedAutoPlacements, g = e.options.placement, _ = gt(g), b = l || (_ !== g && p ? function(t) {
                        if ("auto" === gt(t)) return [];
                        var e = zt(t);
                        return [Ft(t), e, Ft(e)]
                    }(g) : [zt(g)]), v = [g].concat(b).reduce((function(t, i) {
                        return t.concat("auto" === gt(i) ? Jt(e, {
                            placement: i,
                            boundary: h,
                            rootBoundary: d,
                            padding: c,
                            flipVariations: p,
                            allowedAutoPlacements: m
                        }) : i)
                    }), []), y = e.rects.reference, w = e.rects.popper, E = new Map, A = !0, T = v[0], O = 0; O < v.length; O++) {
                    var C = v[O],
                        k = gt(C),
                        L = "start" === Qt(C),
                        x = [it, nt].indexOf(k) >= 0,
                        D = x ? "width" : "height",
                        S = Zt(e, {
                            placement: C,
                            boundary: h,
                            rootBoundary: d,
                            altBoundary: u,
                            padding: c
                        }),
                        N = x ? L ? st : ot : L ? nt : it;
                    y[D] > w[D] && (N = zt(N));
                    var I = zt(N),
                        P = [];
                    if (o && P.push(S[k] <= 0), a && P.push(S[N] <= 0, S[I] <= 0), P.every((function(t) {
                            return t
                        }))) {
                        T = C, A = !1;
                        break
                    }
                    E.set(C, P)
                }
                if (A)
                    for (var j = function(t) {
                            var e = v.find((function(e) {
                                var i = E.get(e);
                                if (i) return i.slice(0, t).every((function(t) {
                                    return t
                                }))
                            }));
                            if (e) return T = e, "break"
                        }, M = p ? 3 : 1; M > 0 && "break" !== j(M); M--);
                e.placement !== T && (e.modifiersData[n]._skip = !0, e.placement = T, e.reset = !0)
            }
        },
        requiresIfExists: ["offset"],
        data: {
            _skip: !1
        }
    };

    function ee(t, e, i) {
        return void 0 === i && (i = {
            x: 0,
            y: 0
        }), {
            top: t.top - e.height - i.y,
            right: t.right - e.width + i.x,
            bottom: t.bottom - e.height + i.y,
            left: t.left - e.width - i.x
        }
    }

    function ie(t) {
        return [it, st, nt, ot].some((function(e) {
            return t[e] >= 0
        }))
    }
    var ne = {
            name: "hide",
            enabled: !0,
            phase: "main",
            requiresIfExists: ["preventOverflow"],
            fn: function(t) {
                var e = t.state,
                    i = t.name,
                    n = e.rects.reference,
                    s = e.rects.popper,
                    o = e.modifiersData.preventOverflow,
                    r = Zt(e, {
                        elementContext: "reference"
                    }),
                    a = Zt(e, {
                        altBoundary: !0
                    }),
                    l = ee(r, n),
                    c = ee(a, s, o),
                    h = ie(l),
                    d = ie(c);
                e.modifiersData[i] = {
                    referenceClippingOffsets: l,
                    popperEscapeOffsets: c,
                    isReferenceHidden: h,
                    hasPopperEscaped: d
                }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
                    "data-popper-reference-hidden": h,
                    "data-popper-escaped": d
                })
            }
        },
        se = {
            name: "offset",
            enabled: !0,
            phase: "main",
            requires: ["popperOffsets"],
            fn: function(t) {
                var e = t.state,
                    i = t.options,
                    n = t.name,
                    s = i.offset,
                    o = void 0 === s ? [0, 0] : s,
                    r = lt.reduce((function(t, i) {
                        return t[i] = function(t, e, i) {
                            var n = gt(t),
                                s = [ot, it].indexOf(n) >= 0 ? -1 : 1,
                                o = "function" == typeof i ? i(Object.assign({}, e, {
                                    placement: t
                                })) : i,
                                r = o[0],
                                a = o[1];
                            return r = r || 0, a = (a || 0) * s, [ot, st].indexOf(n) >= 0 ? {
                                x: a,
                                y: r
                            } : {
                                x: r,
                                y: a
                            }
                        }(i, e.rects, o), t
                    }), {}),
                    a = r[e.placement],
                    l = a.x,
                    c = a.y;
                null != e.modifiersData.popperOffsets && (e.modifiersData.popperOffsets.x += l, e.modifiersData.popperOffsets.y += c), e.modifiersData[n] = r
            }
        },
        oe = {
            name: "popperOffsets",
            enabled: !0,
            phase: "read",
            fn: function(t) {
                var e = t.state,
                    i = t.name;
                e.modifiersData[i] = Gt({
                    reference: e.rects.reference,
                    element: e.rects.popper,
                    strategy: "absolute",
                    placement: e.placement
                })
            },
            data: {}
        },
        re = {
            name: "preventOverflow",
            enabled: !0,
            phase: "main",
            fn: function(t) {
                var e = t.state,
                    i = t.options,
                    n = t.name,
                    s = i.mainAxis,
                    o = void 0 === s || s,
                    r = i.altAxis,
                    a = void 0 !== r && r,
                    l = i.boundary,
                    c = i.rootBoundary,
                    h = i.altBoundary,
                    d = i.padding,
                    u = i.tether,
                    f = void 0 === u || u,
                    p = i.tetherOffset,
                    m = void 0 === p ? 0 : p,
                    g = Zt(e, {
                        boundary: l,
                        rootBoundary: c,
                        padding: d,
                        altBoundary: h
                    }),
                    _ = gt(e.placement),
                    b = Qt(e.placement),
                    v = !b,
                    y = kt(_),
                    w = "x" === y ? "y" : "x",
                    E = e.modifiersData.popperOffsets,
                    A = e.rects.reference,
                    T = e.rects.popper,
                    O = "function" == typeof m ? m(Object.assign({}, e.rects, {
                        placement: e.placement
                    })) : m,
                    C = {
                        x: 0,
                        y: 0
                    };
                if (E) {
                    if (o || a) {
                        var k = "y" === y ? it : ot,
                            L = "y" === y ? nt : st,
                            x = "y" === y ? "height" : "width",
                            D = E[y],
                            S = E[y] + g[k],
                            N = E[y] - g[L],
                            I = f ? -T[x] / 2 : 0,
                            P = "start" === b ? A[x] : T[x],
                            j = "start" === b ? -T[x] : -A[x],
                            M = e.elements.arrow,
                            H = f && M ? vt(M) : {
                                width: 0,
                                height: 0
                            },
                            B = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0
                            },
                            R = B[k],
                            W = B[L],
                            z = St(0, A[x], H[x]),
                            q = v ? A[x] / 2 - I - z - R - O : P - z - R - O,
                            F = v ? -A[x] / 2 + I + z + W + O : j + z + W + O,
                            U = e.elements.arrow && Ct(e.elements.arrow),
                            $ = U ? "y" === y ? U.clientTop || 0 : U.clientLeft || 0 : 0,
                            V = e.modifiersData.offset ? e.modifiersData.offset[e.placement][y] : 0,
                            K = E[y] + q - V - $,
                            X = E[y] + F - V;
                        if (o) {
                            var Y = St(f ? xt(S, K) : S, D, f ? Lt(N, X) : N);
                            E[y] = Y, C[y] = Y - D
                        }
                        if (a) {
                            var Q = "x" === y ? it : ot,
                                G = "x" === y ? nt : st,
                                Z = E[w],
                                J = Z + g[Q],
                                tt = Z - g[G],
                                et = St(f ? xt(J, K) : J, Z, f ? Lt(tt, X) : tt);
                            E[w] = et, C[w] = et - Z
                        }
                    }
                    e.modifiersData[n] = C
                }
            },
            requiresIfExists: ["offset"]
        };

    function ae(t, e, i) {
        void 0 === i && (i = !1);
        var n, s, o = ft(e),
            r = ft(e) && function(t) {
                var e = t.getBoundingClientRect(),
                    i = e.width / t.offsetWidth || 1,
                    n = e.height / t.offsetHeight || 1;
                return 1 !== i || 1 !== n
            }(e),
            a = At(e),
            l = bt(t, r),
            c = {
                scrollLeft: 0,
                scrollTop: 0
            },
            h = {
                x: 0,
                y: 0
            };
        return (o || !o && !i) && (("body" !== ht(e) || Vt(a)) && (c = (n = e) !== dt(n) && ft(n) ? {
            scrollLeft: (s = n).scrollLeft,
            scrollTop: s.scrollTop
        } : Ut(n)), ft(e) ? ((h = bt(e, !0)).x += e.clientLeft, h.y += e.clientTop) : a && (h.x = $t(a))), {
            x: l.left + c.scrollLeft - h.x,
            y: l.top + c.scrollTop - h.y,
            width: l.width,
            height: l.height
        }
    }
    var le = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
    };

    function ce() {
        for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
        return !e.some((function(t) {
            return !(t && "function" == typeof t.getBoundingClientRect)
        }))
    }

    function he(t) {
        void 0 === t && (t = {});
        var e = t,
            i = e.defaultModifiers,
            n = void 0 === i ? [] : i,
            s = e.defaultOptions,
            o = void 0 === s ? le : s;
        return function(t, e, i) {
            void 0 === i && (i = o);
            var s, r, a = {
                    placement: "bottom",
                    orderedModifiers: [],
                    options: Object.assign({}, le, o),
                    modifiersData: {},
                    elements: {
                        reference: t,
                        popper: e
                    },
                    attributes: {},
                    styles: {}
                },
                l = [],
                c = !1,
                h = {
                    state: a,
                    setOptions: function(i) {
                        d(), a.options = Object.assign({}, o, a.options, i), a.scrollParents = {
                            reference: ut(t) ? Kt(t) : t.contextElement ? Kt(t.contextElement) : [],
                            popper: Kt(e)
                        };
                        var s, r, c = function(t) {
                            var e = function(t) {
                                var e = new Map,
                                    i = new Set,
                                    n = [];
                                return t.forEach((function(t) {
                                    e.set(t.name, t)
                                })), t.forEach((function(t) {
                                    i.has(t.name) || function t(s) {
                                        i.add(s.name), [].concat(s.requires || [], s.requiresIfExists || []).forEach((function(n) {
                                            if (!i.has(n)) {
                                                var s = e.get(n);
                                                s && t(s)
                                            }
                                        })), n.push(s)
                                    }(t)
                                })), n
                            }(t);
                            return ct.reduce((function(t, i) {
                                return t.concat(e.filter((function(t) {
                                    return t.phase === i
                                })))
                            }), [])
                        }((s = [].concat(n, a.options.modifiers), r = s.reduce((function(t, e) {
                            var i = t[e.name];
                            return t[e.name] = i ? Object.assign({}, i, e, {
                                options: Object.assign({}, i.options, e.options),
                                data: Object.assign({}, i.data, e.data)
                            }) : e, t
                        }), {}), Object.keys(r).map((function(t) {
                            return r[t]
                        }))));
                        return a.orderedModifiers = c.filter((function(t) {
                            return t.enabled
                        })), a.orderedModifiers.forEach((function(t) {
                            var e = t.name,
                                i = t.options,
                                n = void 0 === i ? {} : i,
                                s = t.effect;
                            if ("function" == typeof s) {
                                var o = s({
                                    state: a,
                                    name: e,
                                    instance: h,
                                    options: n
                                });
                                l.push(o || function() {})
                            }
                        })), h.update()
                    },
                    forceUpdate: function() {
                        if (!c) {
                            var t = a.elements,
                                e = t.reference,
                                i = t.popper;
                            if (ce(e, i)) {
                                a.rects = {
                                    reference: ae(e, Ct(i), "fixed" === a.options.strategy),
                                    popper: vt(i)
                                }, a.reset = !1, a.placement = a.options.placement, a.orderedModifiers.forEach((function(t) {
                                    return a.modifiersData[t.name] = Object.assign({}, t.data)
                                }));
                                for (var n = 0; n < a.orderedModifiers.length; n++)
                                    if (!0 !== a.reset) {
                                        var s = a.orderedModifiers[n],
                                            o = s.fn,
                                            r = s.options,
                                            l = void 0 === r ? {} : r,
                                            d = s.name;
                                        "function" == typeof o && (a = o({
                                            state: a,
                                            options: l,
                                            name: d,
                                            instance: h
                                        }) || a)
                                    } else a.reset = !1, n = -1
                            }
                        }
                    },
                    update: (s = function() {
                        return new Promise((function(t) {
                            h.forceUpdate(), t(a)
                        }))
                    }, function() {
                        return r || (r = new Promise((function(t) {
                            Promise.resolve().then((function() {
                                r = void 0, t(s())
                            }))
                        }))), r
                    }),
                    destroy: function() {
                        d(), c = !0
                    }
                };
            if (!ce(t, e)) return h;

            function d() {
                l.forEach((function(t) {
                    return t()
                })), l = []
            }
            return h.setOptions(i).then((function(t) {
                !c && i.onFirstUpdate && i.onFirstUpdate(t)
            })), h
        }
    }
    var de = he(),
        ue = he({
            defaultModifiers: [Rt, oe, Ht, mt]
        }),
        fe = he({
            defaultModifiers: [Rt, oe, Ht, mt, se, te, re, Pt, ne]
        }),
        pe = Object.freeze({
            __proto__: null,
            popperGenerator: he,
            detectOverflow: Zt,
            createPopperBase: de,
            createPopper: fe,
            createPopperLite: ue,
            top: it,
            bottom: nt,
            right: st,
            left: ot,
            auto: "auto",
            basePlacements: rt,
            start: "start",
            end: "end",
            clippingParents: "clippingParents",
            viewport: "viewport",
            popper: "popper",
            reference: "reference",
            variationPlacements: at,
            placements: lt,
            beforeRead: "beforeRead",
            read: "read",
            afterRead: "afterRead",
            beforeMain: "beforeMain",
            main: "main",
            afterMain: "afterMain",
            beforeWrite: "beforeWrite",
            write: "write",
            afterWrite: "afterWrite",
            modifierPhases: ct,
            applyStyles: mt,
            arrow: Pt,
            computeStyles: Ht,
            eventListeners: Rt,
            flip: te,
            hide: ne,
            offset: se,
            popperOffsets: oe,
            preventOverflow: re
        });
    const me = new RegExp("ArrowUp|ArrowDown|Escape"),
        ge = p() ? "top-end" : "top-start",
        _e = p() ? "top-start" : "top-end",
        be = p() ? "bottom-end" : "bottom-start",
        ve = p() ? "bottom-start" : "bottom-end",
        ye = p() ? "left-start" : "right-start",
        we = p() ? "right-start" : "left-start",
        Ee = {
            offset: [0, 2],
            boundary: "clippingParents",
            reference: "toggle",
            display: "dynamic",
            popperConfig: null,
            autoClose: !0
        },
        Ae = {
            offset: "(array|string|function)",
            boundary: "(string|element)",
            reference: "(string|element|object)",
            display: "string",
            popperConfig: "(null|object|function)",
            autoClose: "(boolean|string)"
        };
    class Te extends H {
        constructor(t, e) {
            super(t), this._popper = null, this._config = this._getConfig(e), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar()
        }
        static get Default() {
            return Ee
        }
        static get DefaultType() {
            return Ae
        }
        static get NAME() {
            return "dropdown"
        }
        toggle() {
            return this._isShown() ? this.hide() : this.show()
        }
        show() {
            if (l(this._element) || this._isShown(this._menu)) return;
            const t = {
                relatedTarget: this._element
            };
            if (P.trigger(this._element, "show.bs.dropdown", t).defaultPrevented) return;
            const e = Te.getParentFromElement(this._element);
            this._inNavbar ? F.setDataAttribute(this._menu, "popper", "none") : this._createPopper(e), "ontouchstart" in document.documentElement && !e.closest(".navbar-nav") && [].concat(...document.body.children).forEach(t => P.on(t, "mouseover", h)), this._element.focus(), this._element.setAttribute("aria-expanded", !0), this._menu.classList.add("show"), this._element.classList.add("show"), P.trigger(this._element, "shown.bs.dropdown", t)
        }
        hide() {
            if (l(this._element) || !this._isShown(this._menu)) return;
            const t = {
                relatedTarget: this._element
            };
            this._completeHide(t)
        }
        dispose() {
            this._popper && this._popper.destroy(), super.dispose()
        }
        update() {
            this._inNavbar = this._detectNavbar(), this._popper && this._popper.update()
        }
        _completeHide(t) {
            P.trigger(this._element, "hide.bs.dropdown", t).defaultPrevented || ("ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach(t => P.off(t, "mouseover", h)), this._popper && this._popper.destroy(), this._menu.classList.remove("show"), this._element.classList.remove("show"), this._element.setAttribute("aria-expanded", "false"), F.removeDataAttribute(this._menu, "popper"), P.trigger(this._element, "hidden.bs.dropdown", t))
        }
        _getConfig(t) {
            if (t = { ...this.constructor.Default,
                    ...F.getDataAttributes(this._element),
                    ...t
                }, r("dropdown", t, this.constructor.DefaultType), "object" == typeof t.reference && !s(t.reference) && "function" != typeof t.reference.getBoundingClientRect) throw new TypeError("dropdown".toUpperCase() + ': Option "reference" provided type "object" without a required "getBoundingClientRect" method.');
            return t
        }
        _createPopper(t) {
            if (void 0 === pe) throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
            let e = this._element;
            "parent" === this._config.reference ? e = t : s(this._config.reference) ? e = o(this._config.reference) : "object" == typeof this._config.reference && (e = this._config.reference);
            const i = this._getPopperConfig(),
                n = i.modifiers.find(t => "applyStyles" === t.name && !1 === t.enabled);
            this._popper = fe(e, this._menu, i), n && F.setDataAttribute(this._menu, "popper", "static")
        }
        _isShown(t = this._element) {
            return t.classList.contains("show")
        }
        _getMenuElement() {
            return U.next(this._element, ".dropdown-menu")[0]
        }
        _getPlacement() {
            const t = this._element.parentNode;
            if (t.classList.contains("dropend")) return ye;
            if (t.classList.contains("dropstart")) return we;
            const e = "end" === getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();
            return t.classList.contains("dropup") ? e ? _e : ge : e ? ve : be
        }
        _detectNavbar() {
            return null !== this._element.closest(".navbar")
        }
        _getOffset() {
            const {
                offset: t
            } = this._config;
            return "string" == typeof t ? t.split(",").map(t => Number.parseInt(t, 10)) : "function" == typeof t ? e => t(e, this._element) : t
        }
        _getPopperConfig() {
            const t = {
                placement: this._getPlacement(),
                modifiers: [{
                    name: "preventOverflow",
                    options: {
                        boundary: this._config.boundary
                    }
                }, {
                    name: "offset",
                    options: {
                        offset: this._getOffset()
                    }
                }]
            };
            return "static" === this._config.display && (t.modifiers = [{
                name: "applyStyles",
                enabled: !1
            }]), { ...t,
                ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(t) : this._config.popperConfig
            }
        }
        _selectMenuItem({
            key: t,
            target: e
        }) {
            const i = U.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)", this._menu).filter(a);
            i.length && b(i, e, "ArrowDown" === t, !i.includes(e)).focus()
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = Te.getOrCreateInstance(this, t);
                if ("string" == typeof t) {
                    if (void 0 === e[t]) throw new TypeError(`No method named "${t}"`);
                    e[t]()
                }
            }))
        }
        static clearMenus(t) {
            if (t && (2 === t.button || "keyup" === t.type && "Tab" !== t.key)) return;
            const e = U.find('[data-bs-toggle="dropdown"]');
            for (let i = 0, n = e.length; i < n; i++) {
                const n = Te.getInstance(e[i]);
                if (!n || !1 === n._config.autoClose) continue;
                if (!n._isShown()) continue;
                const s = {
                    relatedTarget: n._element
                };
                if (t) {
                    const e = t.composedPath(),
                        i = e.includes(n._menu);
                    if (e.includes(n._element) || "inside" === n._config.autoClose && !i || "outside" === n._config.autoClose && i) continue;
                    if (n._menu.contains(t.target) && ("keyup" === t.type && "Tab" === t.key || /input|select|option|textarea|form/i.test(t.target.tagName))) continue;
                    "click" === t.type && (s.clickEvent = t)
                }
                n._completeHide(s)
            }
        }
        static getParentFromElement(t) {
            return i(t) || t.parentNode
        }
        static dataApiKeydownHandler(t) {
            if (/input|textarea/i.test(t.target.tagName) ? "Space" === t.key || "Escape" !== t.key && ("ArrowDown" !== t.key && "ArrowUp" !== t.key || t.target.closest(".dropdown-menu")) : !me.test(t.key)) return;
            const e = this.classList.contains("show");
            if (!e && "Escape" === t.key) return;
            if (t.preventDefault(), t.stopPropagation(), l(this)) return;
            const i = this.matches('[data-bs-toggle="dropdown"]') ? this : U.prev(this, '[data-bs-toggle="dropdown"]')[0],
                n = Te.getOrCreateInstance(i);
            if ("Escape" !== t.key) return "ArrowUp" === t.key || "ArrowDown" === t.key ? (e || n.show(), void n._selectMenuItem(t)) : void(e && "Space" !== t.key || Te.clearMenus());
            n.hide()
        }
    }
    P.on(document, "keydown.bs.dropdown.data-api", '[data-bs-toggle="dropdown"]', Te.dataApiKeydownHandler), P.on(document, "keydown.bs.dropdown.data-api", ".dropdown-menu", Te.dataApiKeydownHandler), P.on(document, "click.bs.dropdown.data-api", Te.clearMenus), P.on(document, "keyup.bs.dropdown.data-api", Te.clearMenus), P.on(document, "click.bs.dropdown.data-api", '[data-bs-toggle="dropdown"]', (function(t) {
        t.preventDefault(), Te.getOrCreateInstance(this).toggle()
    })), m(Te);
    class Oe {
        constructor() {
            this._element = document.body
        }
        getWidth() {
            const t = document.documentElement.clientWidth;
            return Math.abs(window.innerWidth - t)
        }
        hide() {
            const t = this.getWidth();
            this._disableOverFlow(), this._setElementAttributes(this._element, "paddingRight", e => e + t), this._setElementAttributes(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", "paddingRight", e => e + t), this._setElementAttributes(".sticky-top", "marginRight", e => e - t)
        }
        _disableOverFlow() {
            this._saveInitialAttribute(this._element, "overflow"), this._element.style.overflow = "hidden"
        }
        _setElementAttributes(t, e, i) {
            const n = this.getWidth();
            this._applyManipulationCallback(t, t => {
                if (t !== this._element && window.innerWidth > t.clientWidth + n) return;
                this._saveInitialAttribute(t, e);
                const s = window.getComputedStyle(t)[e];
                t.style[e] = i(Number.parseFloat(s)) + "px"
            })
        }
        reset() {
            this._resetElementAttributes(this._element, "overflow"), this._resetElementAttributes(this._element, "paddingRight"), this._resetElementAttributes(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", "paddingRight"), this._resetElementAttributes(".sticky-top", "marginRight")
        }
        _saveInitialAttribute(t, e) {
            const i = t.style[e];
            i && F.setDataAttribute(t, e, i)
        }
        _resetElementAttributes(t, e) {
            this._applyManipulationCallback(t, t => {
                const i = F.getDataAttribute(t, e);
                void 0 === i ? t.style.removeProperty(e) : (F.removeDataAttribute(t, e), t.style[e] = i)
            })
        }
        _applyManipulationCallback(t, e) {
            s(t) ? e(t) : U.find(t, this._element).forEach(e)
        }
        isOverflowing() {
            return this.getWidth() > 0
        }
    }
    const Ce = {
            className: "modal-backdrop",
            isVisible: !0,
            isAnimated: !1,
            rootElement: "body",
            clickCallback: null
        },
        ke = {
            className: "string",
            isVisible: "boolean",
            isAnimated: "boolean",
            rootElement: "(element|string)",
            clickCallback: "(function|null)"
        };
    class Le {
        constructor(t) {
            this._config = this._getConfig(t), this._isAppended = !1, this._element = null
        }
        show(t) {
            this._config.isVisible ? (this._append(), this._config.isAnimated && d(this._getElement()), this._getElement().classList.add("show"), this._emulateAnimation(() => {
                g(t)
            })) : g(t)
        }
        hide(t) {
            this._config.isVisible ? (this._getElement().classList.remove("show"), this._emulateAnimation(() => {
                this.dispose(), g(t)
            })) : g(t)
        }
        _getElement() {
            if (!this._element) {
                const t = document.createElement("div");
                t.className = this._config.className, this._config.isAnimated && t.classList.add("fade"), this._element = t
            }
            return this._element
        }
        _getConfig(t) {
            return (t = { ...Ce,
                ..."object" == typeof t ? t : {}
            }).rootElement = o(t.rootElement), r("backdrop", t, ke), t
        }
        _append() {
            this._isAppended || (this._config.rootElement.append(this._getElement()), P.on(this._getElement(), "mousedown.bs.backdrop", () => {
                g(this._config.clickCallback)
            }), this._isAppended = !0)
        }
        dispose() {
            this._isAppended && (P.off(this._element, "mousedown.bs.backdrop"), this._element.remove(), this._isAppended = !1)
        }
        _emulateAnimation(t) {
            _(t, this._getElement(), this._config.isAnimated)
        }
    }
    const xe = {
            trapElement: null,
            autofocus: !0
        },
        De = {
            trapElement: "element",
            autofocus: "boolean"
        };
    class Se {
        constructor(t) {
            this._config = this._getConfig(t), this._isActive = !1, this._lastTabNavDirection = null
        }
        activate() {
            const {
                trapElement: t,
                autofocus: e
            } = this._config;
            this._isActive || (e && t.focus(), P.off(document, ".bs.focustrap"), P.on(document, "focusin.bs.focustrap", t => this._handleFocusin(t)), P.on(document, "keydown.tab.bs.focustrap", t => this._handleKeydown(t)), this._isActive = !0)
        }
        deactivate() {
            this._isActive && (this._isActive = !1, P.off(document, ".bs.focustrap"))
        }
        _handleFocusin(t) {
            const {
                target: e
            } = t, {
                trapElement: i
            } = this._config;
            if (e === document || e === i || i.contains(e)) return;
            const n = U.focusableChildren(i);
            0 === n.length ? i.focus() : "backward" === this._lastTabNavDirection ? n[n.length - 1].focus() : n[0].focus()
        }
        _handleKeydown(t) {
            "Tab" === t.key && (this._lastTabNavDirection = t.shiftKey ? "backward" : "forward")
        }
        _getConfig(t) {
            return t = { ...xe,
                ..."object" == typeof t ? t : {}
            }, r("focustrap", t, De), t
        }
    }
    const Ne = {
            backdrop: !0,
            keyboard: !0,
            focus: !0
        },
        Ie = {
            backdrop: "(boolean|string)",
            keyboard: "boolean",
            focus: "boolean"
        };
    class Pe extends H {
        constructor(t, e) {
            super(t), this._config = this._getConfig(e), this._dialog = U.findOne(".modal-dialog", this._element), this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._isShown = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollBar = new Oe
        }
        static get Default() {
            return Ne
        }
        static get NAME() {
            return "modal"
        }
        toggle(t) {
            return this._isShown ? this.hide() : this.show(t)
        }
        show(t) {
            this._isShown || this._isTransitioning || P.trigger(this._element, "show.bs.modal", {
                relatedTarget: t
            }).defaultPrevented || (this._isShown = !0, this._isAnimated() && (this._isTransitioning = !0), this._scrollBar.hide(), document.body.classList.add("modal-open"), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), P.on(this._dialog, "mousedown.dismiss.bs.modal", () => {
                P.one(this._element, "mouseup.dismiss.bs.modal", t => {
                    t.target === this._element && (this._ignoreBackdropClick = !0)
                })
            }), this._showBackdrop(() => this._showElement(t)))
        }
        hide() {
            if (!this._isShown || this._isTransitioning) return;
            if (P.trigger(this._element, "hide.bs.modal").defaultPrevented) return;
            this._isShown = !1;
            const t = this._isAnimated();
            t && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), this._focustrap.deactivate(), this._element.classList.remove("show"), P.off(this._element, "click.dismiss.bs.modal"), P.off(this._dialog, "mousedown.dismiss.bs.modal"), this._queueCallback(() => this._hideModal(), this._element, t)
        }
        dispose() {
            [window, this._dialog].forEach(t => P.off(t, ".bs.modal")), this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose()
        }
        handleUpdate() {
            this._adjustDialog()
        }
        _initializeBackDrop() {
            return new Le({
                isVisible: Boolean(this._config.backdrop),
                isAnimated: this._isAnimated()
            })
        }
        _initializeFocusTrap() {
            return new Se({
                trapElement: this._element
            })
        }
        _getConfig(t) {
            return t = { ...Ne,
                ...F.getDataAttributes(this._element),
                ..."object" == typeof t ? t : {}
            }, r("modal", t, Ie), t
        }
        _showElement(t) {
            const e = this._isAnimated(),
                i = U.findOne(".modal-body", this._dialog);
            this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.append(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.scrollTop = 0, i && (i.scrollTop = 0), e && d(this._element), this._element.classList.add("show"), this._queueCallback(() => {
                this._config.focus && this._focustrap.activate(), this._isTransitioning = !1, P.trigger(this._element, "shown.bs.modal", {
                    relatedTarget: t
                })
            }, this._dialog, e)
        }
        _setEscapeEvent() {
            this._isShown ? P.on(this._element, "keydown.dismiss.bs.modal", t => {
                this._config.keyboard && "Escape" === t.key ? (t.preventDefault(), this.hide()) : this._config.keyboard || "Escape" !== t.key || this._triggerBackdropTransition()
            }) : P.off(this._element, "keydown.dismiss.bs.modal")
        }
        _setResizeEvent() {
            this._isShown ? P.on(window, "resize.bs.modal", () => this._adjustDialog()) : P.off(window, "resize.bs.modal")
        }
        _hideModal() {
            this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._isTransitioning = !1, this._backdrop.hide(() => {
                document.body.classList.remove("modal-open"), this._resetAdjustments(), this._scrollBar.reset(), P.trigger(this._element, "hidden.bs.modal")
            })
        }
        _showBackdrop(t) {
            P.on(this._element, "click.dismiss.bs.modal", t => {
                this._ignoreBackdropClick ? this._ignoreBackdropClick = !1 : t.target === t.currentTarget && (!0 === this._config.backdrop ? this.hide() : "static" === this._config.backdrop && this._triggerBackdropTransition())
            }), this._backdrop.show(t)
        }
        _isAnimated() {
            return this._element.classList.contains("fade")
        }
        _triggerBackdropTransition() {
            if (P.trigger(this._element, "hidePrevented.bs.modal").defaultPrevented) return;
            const {
                classList: t,
                scrollHeight: e,
                style: i
            } = this._element, n = e > document.documentElement.clientHeight;
            !n && "hidden" === i.overflowY || t.contains("modal-static") || (n || (i.overflowY = "hidden"), t.add("modal-static"), this._queueCallback(() => {
                t.remove("modal-static"), n || this._queueCallback(() => {
                    i.overflowY = ""
                }, this._dialog)
            }, this._dialog), this._element.focus())
        }
        _adjustDialog() {
            const t = this._element.scrollHeight > document.documentElement.clientHeight,
                e = this._scrollBar.getWidth(),
                i = e > 0;
            (!i && t && !p() || i && !t && p()) && (this._element.style.paddingLeft = e + "px"), (i && !t && !p() || !i && t && p()) && (this._element.style.paddingRight = e + "px")
        }
        _resetAdjustments() {
            this._element.style.paddingLeft = "", this._element.style.paddingRight = ""
        }
        static jQueryInterface(t, e) {
            return this.each((function() {
                const i = Pe.getOrCreateInstance(this, t);
                if ("string" == typeof t) {
                    if (void 0 === i[t]) throw new TypeError(`No method named "${t}"`);
                    i[t](e)
                }
            }))
        }
    }
    P.on(document, "click.bs.modal.data-api", '[data-bs-toggle="modal"]', (function(t) {
        const e = i(this);
        ["A", "AREA"].includes(this.tagName) && t.preventDefault(), P.one(e, "show.bs.modal", t => {
            t.defaultPrevented || P.one(e, "hidden.bs.modal", () => {
                a(this) && this.focus()
            })
        }), Pe.getOrCreateInstance(e).toggle(this)
    })), B(Pe), m(Pe);
    const je = {
            backdrop: !0,
            keyboard: !0,
            scroll: !1
        },
        Me = {
            backdrop: "boolean",
            keyboard: "boolean",
            scroll: "boolean"
        };
    class He extends H {
        constructor(t, e) {
            super(t), this._config = this._getConfig(e), this._isShown = !1, this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._addEventListeners()
        }
        static get NAME() {
            return "offcanvas"
        }
        static get Default() {
            return je
        }
        toggle(t) {
            return this._isShown ? this.hide() : this.show(t)
        }
        show(t) {
            this._isShown || P.trigger(this._element, "show.bs.offcanvas", {
                relatedTarget: t
            }).defaultPrevented || (this._isShown = !0, this._element.style.visibility = "visible", this._backdrop.show(), this._config.scroll || (new Oe).hide(), this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.classList.add("show"), this._queueCallback(() => {
                this._config.scroll || this._focustrap.activate(), P.trigger(this._element, "shown.bs.offcanvas", {
                    relatedTarget: t
                })
            }, this._element, !0))
        }
        hide() {
            this._isShown && (P.trigger(this._element, "hide.bs.offcanvas").defaultPrevented || (this._focustrap.deactivate(), this._element.blur(), this._isShown = !1, this._element.classList.remove("show"), this._backdrop.hide(), this._queueCallback(() => {
                this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._element.style.visibility = "hidden", this._config.scroll || (new Oe).reset(), P.trigger(this._element, "hidden.bs.offcanvas")
            }, this._element, !0)))
        }
        dispose() {
            this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose()
        }
        _getConfig(t) {
            return t = { ...je,
                ...F.getDataAttributes(this._element),
                ..."object" == typeof t ? t : {}
            }, r("offcanvas", t, Me), t
        }
        _initializeBackDrop() {
            return new Le({
                className: "offcanvas-backdrop",
                isVisible: this._config.backdrop,
                isAnimated: !0,
                rootElement: this._element.parentNode,
                clickCallback: () => this.hide()
            })
        }
        _initializeFocusTrap() {
            return new Se({
                trapElement: this._element
            })
        }
        _addEventListeners() {
            P.on(this._element, "keydown.dismiss.bs.offcanvas", t => {
                this._config.keyboard && "Escape" === t.key && this.hide()
            })
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = He.getOrCreateInstance(this, t);
                if ("string" == typeof t) {
                    if (void 0 === e[t] || t.startsWith("_") || "constructor" === t) throw new TypeError(`No method named "${t}"`);
                    e[t](this)
                }
            }))
        }
    }
    P.on(document, "click.bs.offcanvas.data-api", '[data-bs-toggle="offcanvas"]', (function(t) {
        const e = i(this);
        if (["A", "AREA"].includes(this.tagName) && t.preventDefault(), l(this)) return;
        P.one(e, "hidden.bs.offcanvas", () => {
            a(this) && this.focus()
        });
        const n = U.findOne(".offcanvas.show");
        n && n !== e && He.getInstance(n).hide(), He.getOrCreateInstance(e).toggle(this)
    })), P.on(window, "load.bs.offcanvas.data-api", () => U.find(".offcanvas.show").forEach(t => He.getOrCreateInstance(t).show())), B(He), m(He);
    const Be = new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]),
        Re = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i,
        We = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,
        ze = (t, e) => {
            const i = t.nodeName.toLowerCase();
            if (e.includes(i)) return !Be.has(i) || Boolean(Re.test(t.nodeValue) || We.test(t.nodeValue));
            const n = e.filter(t => t instanceof RegExp);
            for (let t = 0, e = n.length; t < e; t++)
                if (n[t].test(i)) return !0;
            return !1
        };

    function qe(t, e, i) {
        if (!t.length) return t;
        if (i && "function" == typeof i) return i(t);
        const n = (new window.DOMParser).parseFromString(t, "text/html"),
            s = Object.keys(e),
            o = [].concat(...n.body.querySelectorAll("*"));
        for (let t = 0, i = o.length; t < i; t++) {
            const i = o[t],
                n = i.nodeName.toLowerCase();
            if (!s.includes(n)) {
                i.remove();
                continue
            }
            const r = [].concat(...i.attributes),
                a = [].concat(e["*"] || [], e[n] || []);
            r.forEach(t => {
                ze(t, a) || i.removeAttribute(t.nodeName)
            })
        }
        return n.body.innerHTML
    }
    const Fe = new Set(["sanitize", "allowList", "sanitizeFn"]),
        Ue = {
            animation: "boolean",
            template: "string",
            title: "(string|element|function)",
            trigger: "string",
            delay: "(number|object)",
            html: "boolean",
            selector: "(string|boolean)",
            placement: "(string|function)",
            offset: "(array|string|function)",
            container: "(string|element|boolean)",
            fallbackPlacements: "array",
            boundary: "(string|element)",
            customClass: "(string|function)",
            sanitize: "boolean",
            sanitizeFn: "(null|function)",
            allowList: "object",
            popperConfig: "(null|object|function)"
        },
        $e = {
            AUTO: "auto",
            TOP: "top",
            RIGHT: p() ? "left" : "right",
            BOTTOM: "bottom",
            LEFT: p() ? "right" : "left"
        },
        Ve = {
            animation: !0,
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            selector: !1,
            placement: "top",
            offset: [0, 0],
            container: !1,
            fallbackPlacements: ["top", "right", "bottom", "left"],
            boundary: "clippingParents",
            customClass: "",
            sanitize: !0,
            sanitizeFn: null,
            allowList: {
                "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
                a: ["target", "href", "title", "rel"],
                area: [],
                b: [],
                br: [],
                col: [],
                code: [],
                div: [],
                em: [],
                hr: [],
                h1: [],
                h2: [],
                h3: [],
                h4: [],
                h5: [],
                h6: [],
                i: [],
                img: ["src", "srcset", "alt", "title", "width", "height"],
                li: [],
                ol: [],
                p: [],
                pre: [],
                s: [],
                small: [],
                span: [],
                sub: [],
                sup: [],
                strong: [],
                u: [],
                ul: []
            },
            popperConfig: null
        },
        Ke = {
            HIDE: "hide.bs.tooltip",
            HIDDEN: "hidden.bs.tooltip",
            SHOW: "show.bs.tooltip",
            SHOWN: "shown.bs.tooltip",
            INSERTED: "inserted.bs.tooltip",
            CLICK: "click.bs.tooltip",
            FOCUSIN: "focusin.bs.tooltip",
            FOCUSOUT: "focusout.bs.tooltip",
            MOUSEENTER: "mouseenter.bs.tooltip",
            MOUSELEAVE: "mouseleave.bs.tooltip"
        };
    class Xe extends H {
        constructor(t, e) {
            if (void 0 === pe) throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
            super(t), this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this._config = this._getConfig(e), this.tip = null, this._setListeners()
        }
        static get Default() {
            return Ve
        }
        static get NAME() {
            return "tooltip"
        }
        static get Event() {
            return Ke
        }
        static get DefaultType() {
            return Ue
        }
        enable() {
            this._isEnabled = !0
        }
        disable() {
            this._isEnabled = !1
        }
        toggleEnabled() {
            this._isEnabled = !this._isEnabled
        }
        toggle(t) {
            if (this._isEnabled)
                if (t) {
                    const e = this._initializeOnDelegatedTarget(t);
                    e._activeTrigger.click = !e._activeTrigger.click, e._isWithActiveTrigger() ? e._enter(null, e) : e._leave(null, e)
                } else {
                    if (this.getTipElement().classList.contains("show")) return void this._leave(null, this);
                    this._enter(null, this)
                }
        }
        dispose() {
            clearTimeout(this._timeout), P.off(this._element.closest(".modal"), "hide.bs.modal", this._hideModalHandler), this.tip && this.tip.remove(), this._popper && this._popper.destroy(), super.dispose()
        }
        show() {
            if ("none" === this._element.style.display) throw new Error("Please use show on visible elements");
            if (!this.isWithContent() || !this._isEnabled) return;
            const t = P.trigger(this._element, this.constructor.Event.SHOW),
                e = c(this._element),
                i = null === e ? this._element.ownerDocument.documentElement.contains(this._element) : e.contains(this._element);
            if (t.defaultPrevented || !i) return;
            const n = this.getTipElement(),
                s = (t => {
                    do {
                        t += Math.floor(1e6 * Math.random())
                    } while (document.getElementById(t));
                    return t
                })(this.constructor.NAME);
            n.setAttribute("id", s), this._element.setAttribute("aria-describedby", s), this._config.animation && n.classList.add("fade");
            const o = "function" == typeof this._config.placement ? this._config.placement.call(this, n, this._element) : this._config.placement,
                r = this._getAttachment(o);
            this._addAttachmentClass(r);
            const {
                container: a
            } = this._config;
            M.set(n, this.constructor.DATA_KEY, this), this._element.ownerDocument.documentElement.contains(this.tip) || (a.append(n), P.trigger(this._element, this.constructor.Event.INSERTED)), this._popper ? this._popper.update() : this._popper = fe(this._element, n, this._getPopperConfig(r)), n.classList.add("show");
            const l = this._resolvePossibleFunction(this._config.customClass);
            l && n.classList.add(...l.split(" ")), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach(t => {
                P.on(t, "mouseover", h)
            });
            const d = this.tip.classList.contains("fade");
            this._queueCallback(() => {
                const t = this._hoverState;
                this._hoverState = null, P.trigger(this._element, this.constructor.Event.SHOWN), "out" === t && this._leave(null, this)
            }, this.tip, d)
        }
        hide() {
            if (!this._popper) return;
            const t = this.getTipElement();
            if (P.trigger(this._element, this.constructor.Event.HIDE).defaultPrevented) return;
            t.classList.remove("show"), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach(t => P.off(t, "mouseover", h)), this._activeTrigger.click = !1, this._activeTrigger.focus = !1, this._activeTrigger.hover = !1;
            const e = this.tip.classList.contains("fade");
            this._queueCallback(() => {
                this._isWithActiveTrigger() || ("show" !== this._hoverState && t.remove(), this._cleanTipClass(), this._element.removeAttribute("aria-describedby"), P.trigger(this._element, this.constructor.Event.HIDDEN), this._popper && (this._popper.destroy(), this._popper = null))
            }, this.tip, e), this._hoverState = ""
        }
        update() {
            null !== this._popper && this._popper.update()
        }
        isWithContent() {
            return Boolean(this.getTitle())
        }
        getTipElement() {
            if (this.tip) return this.tip;
            const t = document.createElement("div");
            t.innerHTML = this._config.template;
            const e = t.children[0];
            return this.setContent(e), e.classList.remove("fade", "show"), this.tip = e, this.tip
        }
        setContent(t) {
            this._sanitizeAndSetContent(t, this.getTitle(), ".tooltip-inner")
        }
        _sanitizeAndSetContent(t, e, i) {
            const n = U.findOne(i, t);
            e || !n ? this.setElementContent(n, e) : n.remove()
        }
        setElementContent(t, e) {
            if (null !== t) return s(e) ? (e = o(e), void(this._config.html ? e.parentNode !== t && (t.innerHTML = "", t.append(e)) : t.textContent = e.textContent)) : void(this._config.html ? (this._config.sanitize && (e = qe(e, this._config.allowList, this._config.sanitizeFn)), t.innerHTML = e) : t.textContent = e)
        }
        getTitle() {
            const t = this._element.getAttribute("data-bs-original-title") || this._config.title;
            return this._resolvePossibleFunction(t)
        }
        updateAttachment(t) {
            return "right" === t ? "end" : "left" === t ? "start" : t
        }
        _initializeOnDelegatedTarget(t, e) {
            return e || this.constructor.getOrCreateInstance(t.delegateTarget, this._getDelegateConfig())
        }
        _getOffset() {
            const {
                offset: t
            } = this._config;
            return "string" == typeof t ? t.split(",").map(t => Number.parseInt(t, 10)) : "function" == typeof t ? e => t(e, this._element) : t
        }
        _resolvePossibleFunction(t) {
            return "function" == typeof t ? t.call(this._element) : t
        }
        _getPopperConfig(t) {
            const e = {
                placement: t,
                modifiers: [{
                    name: "flip",
                    options: {
                        fallbackPlacements: this._config.fallbackPlacements
                    }
                }, {
                    name: "offset",
                    options: {
                        offset: this._getOffset()
                    }
                }, {
                    name: "preventOverflow",
                    options: {
                        boundary: this._config.boundary
                    }
                }, {
                    name: "arrow",
                    options: {
                        element: `.${this.constructor.NAME}-arrow`
                    }
                }, {
                    name: "onChange",
                    enabled: !0,
                    phase: "afterWrite",
                    fn: t => this._handlePopperPlacementChange(t)
                }],
                onFirstUpdate: t => {
                    t.options.placement !== t.placement && this._handlePopperPlacementChange(t)
                }
            };
            return { ...e,
                ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(e) : this._config.popperConfig
            }
        }
        _addAttachmentClass(t) {
            this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(t)}`)
        }
        _getAttachment(t) {
            return $e[t.toUpperCase()]
        }
        _setListeners() {
            this._config.trigger.split(" ").forEach(t => {
                if ("click" === t) P.on(this._element, this.constructor.Event.CLICK, this._config.selector, t => this.toggle(t));
                else if ("manual" !== t) {
                    const e = "hover" === t ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN,
                        i = "hover" === t ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
                    P.on(this._element, e, this._config.selector, t => this._enter(t)), P.on(this._element, i, this._config.selector, t => this._leave(t))
                }
            }), this._hideModalHandler = () => {
                this._element && this.hide()
            }, P.on(this._element.closest(".modal"), "hide.bs.modal", this._hideModalHandler), this._config.selector ? this._config = { ...this._config,
                trigger: "manual",
                selector: ""
            } : this._fixTitle()
        }
        _fixTitle() {
            const t = this._element.getAttribute("title"),
                e = typeof this._element.getAttribute("data-bs-original-title");
            (t || "string" !== e) && (this._element.setAttribute("data-bs-original-title", t || ""), !t || this._element.getAttribute("aria-label") || this._element.textContent || this._element.setAttribute("aria-label", t), this._element.setAttribute("title", ""))
        }
        _enter(t, e) {
            e = this._initializeOnDelegatedTarget(t, e), t && (e._activeTrigger["focusin" === t.type ? "focus" : "hover"] = !0), e.getTipElement().classList.contains("show") || "show" === e._hoverState ? e._hoverState = "show" : (clearTimeout(e._timeout), e._hoverState = "show", e._config.delay && e._config.delay.show ? e._timeout = setTimeout(() => {
                "show" === e._hoverState && e.show()
            }, e._config.delay.show) : e.show())
        }
        _leave(t, e) {
            e = this._initializeOnDelegatedTarget(t, e), t && (e._activeTrigger["focusout" === t.type ? "focus" : "hover"] = e._element.contains(t.relatedTarget)), e._isWithActiveTrigger() || (clearTimeout(e._timeout), e._hoverState = "out", e._config.delay && e._config.delay.hide ? e._timeout = setTimeout(() => {
                "out" === e._hoverState && e.hide()
            }, e._config.delay.hide) : e.hide())
        }
        _isWithActiveTrigger() {
            for (const t in this._activeTrigger)
                if (this._activeTrigger[t]) return !0;
            return !1
        }
        _getConfig(t) {
            const e = F.getDataAttributes(this._element);
            return Object.keys(e).forEach(t => {
                Fe.has(t) && delete e[t]
            }), (t = { ...this.constructor.Default,
                ...e,
                ..."object" == typeof t && t ? t : {}
            }).container = !1 === t.container ? document.body : o(t.container), "number" == typeof t.delay && (t.delay = {
                show: t.delay,
                hide: t.delay
            }), "number" == typeof t.title && (t.title = t.title.toString()), "number" == typeof t.content && (t.content = t.content.toString()), r("tooltip", t, this.constructor.DefaultType), t.sanitize && (t.template = qe(t.template, t.allowList, t.sanitizeFn)), t
        }
        _getDelegateConfig() {
            const t = {};
            for (const e in this._config) this.constructor.Default[e] !== this._config[e] && (t[e] = this._config[e]);
            return t
        }
        _cleanTipClass() {
            const t = this.getTipElement(),
                e = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, "g"),
                i = t.getAttribute("class").match(e);
            null !== i && i.length > 0 && i.map(t => t.trim()).forEach(e => t.classList.remove(e))
        }
        _getBasicClassPrefix() {
            return "bs-tooltip"
        }
        _handlePopperPlacementChange(t) {
            const {
                state: e
            } = t;
            e && (this.tip = e.elements.popper, this._cleanTipClass(), this._addAttachmentClass(this._getAttachment(e.placement)))
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = Xe.getOrCreateInstance(this, t);
                if ("string" == typeof t) {
                    if (void 0 === e[t]) throw new TypeError(`No method named "${t}"`);
                    e[t]()
                }
            }))
        }
    }
    m(Xe);
    const Ye = { ...Xe.Default,
            placement: "right",
            offset: [0, 8],
            trigger: "click",
            content: "",
            template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        },
        Qe = { ...Xe.DefaultType,
            content: "(string|element|function)"
        },
        Ge = {
            HIDE: "hide.bs.popover",
            HIDDEN: "hidden.bs.popover",
            SHOW: "show.bs.popover",
            SHOWN: "shown.bs.popover",
            INSERTED: "inserted.bs.popover",
            CLICK: "click.bs.popover",
            FOCUSIN: "focusin.bs.popover",
            FOCUSOUT: "focusout.bs.popover",
            MOUSEENTER: "mouseenter.bs.popover",
            MOUSELEAVE: "mouseleave.bs.popover"
        };
    class Ze extends Xe {
        static get Default() {
            return Ye
        }
        static get NAME() {
            return "popover"
        }
        static get Event() {
            return Ge
        }
        static get DefaultType() {
            return Qe
        }
        isWithContent() {
            return this.getTitle() || this._getContent()
        }
        setContent(t) {
            this._sanitizeAndSetContent(t, this.getTitle(), ".popover-header"), this._sanitizeAndSetContent(t, this._getContent(), ".popover-body")
        }
        _getContent() {
            return this._resolvePossibleFunction(this._config.content)
        }
        _getBasicClassPrefix() {
            return "bs-popover"
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = Ze.getOrCreateInstance(this, t);
                if ("string" == typeof t) {
                    if (void 0 === e[t]) throw new TypeError(`No method named "${t}"`);
                    e[t]()
                }
            }))
        }
    }
    m(Ze);
    const Je = {
            offset: 10,
            method: "auto",
            target: ""
        },
        ti = {
            offset: "number",
            method: "string",
            target: "(string|element)"
        },
        ei = ".nav-link, .list-group-item, .dropdown-item";
    class ii extends H {
        constructor(t, e) {
            super(t), this._scrollElement = "BODY" === this._element.tagName ? window : this._element, this._config = this._getConfig(e), this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, P.on(this._scrollElement, "scroll.bs.scrollspy", () => this._process()), this.refresh(), this._process()
        }
        static get Default() {
            return Je
        }
        static get NAME() {
            return "scrollspy"
        }
        refresh() {
            const t = this._scrollElement === this._scrollElement.window ? "offset" : "position",
                i = "auto" === this._config.method ? t : this._config.method,
                n = "position" === i ? this._getScrollTop() : 0;
            this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), U.find(ei, this._config.target).map(t => {
                const s = e(t),
                    o = s ? U.findOne(s) : null;
                if (o) {
                    const t = o.getBoundingClientRect();
                    if (t.width || t.height) return [F[i](o).top + n, s]
                }
                return null
            }).filter(t => t).sort((t, e) => t[0] - e[0]).forEach(t => {
                this._offsets.push(t[0]), this._targets.push(t[1])
            })
        }
        dispose() {
            P.off(this._scrollElement, ".bs.scrollspy"), super.dispose()
        }
        _getConfig(t) {
            return (t = { ...Je,
                ...F.getDataAttributes(this._element),
                ..."object" == typeof t && t ? t : {}
            }).target = o(t.target) || document.documentElement, r("scrollspy", t, ti), t
        }
        _getScrollTop() {
            return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
        }
        _getScrollHeight() {
            return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
        }
        _getOffsetHeight() {
            return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
        }
        _process() {
            const t = this._getScrollTop() + this._config.offset,
                e = this._getScrollHeight(),
                i = this._config.offset + e - this._getOffsetHeight();
            if (this._scrollHeight !== e && this.refresh(), t >= i) {
                const t = this._targets[this._targets.length - 1];
                this._activeTarget !== t && this._activate(t)
            } else {
                if (this._activeTarget && t < this._offsets[0] && this._offsets[0] > 0) return this._activeTarget = null, void this._clear();
                for (let e = this._offsets.length; e--;) this._activeTarget !== this._targets[e] && t >= this._offsets[e] && (void 0 === this._offsets[e + 1] || t < this._offsets[e + 1]) && this._activate(this._targets[e])
            }
        }
        _activate(t) {
            this._activeTarget = t, this._clear();
            const e = ei.split(",").map(e => `${e}[data-bs-target="${t}"],${e}[href="${t}"]`),
                i = U.findOne(e.join(","), this._config.target);
            i.classList.add("active"), i.classList.contains("dropdown-item") ? U.findOne(".dropdown-toggle", i.closest(".dropdown")).classList.add("active") : U.parents(i, ".nav, .list-group").forEach(t => {
                U.prev(t, ".nav-link, .list-group-item").forEach(t => t.classList.add("active")), U.prev(t, ".nav-item").forEach(t => {
                    U.children(t, ".nav-link").forEach(t => t.classList.add("active"))
                })
            }), P.trigger(this._scrollElement, "activate.bs.scrollspy", {
                relatedTarget: t
            })
        }
        _clear() {
            U.find(ei, this._config.target).filter(t => t.classList.contains("active")).forEach(t => t.classList.remove("active"))
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = ii.getOrCreateInstance(this, t);
                if ("string" == typeof t) {
                    if (void 0 === e[t]) throw new TypeError(`No method named "${t}"`);
                    e[t]()
                }
            }))
        }
    }
    P.on(window, "load.bs.scrollspy.data-api", () => {
        U.find('[data-bs-spy="scroll"]').forEach(t => new ii(t))
    }), m(ii);
    class ni extends H {
        static get NAME() {
            return "tab"
        }
        show() {
            if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains("active")) return;
            let t;
            const e = i(this._element),
                n = this._element.closest(".nav, .list-group");
            if (n) {
                const e = "UL" === n.nodeName || "OL" === n.nodeName ? ":scope > li > .active" : ".active";
                t = U.find(e, n), t = t[t.length - 1]
            }
            const s = t ? P.trigger(t, "hide.bs.tab", {
                relatedTarget: this._element
            }) : null;
            if (P.trigger(this._element, "show.bs.tab", {
                    relatedTarget: t
                }).defaultPrevented || null !== s && s.defaultPrevented) return;
            this._activate(this._element, n);
            const o = () => {
                P.trigger(t, "hidden.bs.tab", {
                    relatedTarget: this._element
                }), P.trigger(this._element, "shown.bs.tab", {
                    relatedTarget: t
                })
            };
            e ? this._activate(e, e.parentNode, o) : o()
        }
        _activate(t, e, i) {
            const n = (!e || "UL" !== e.nodeName && "OL" !== e.nodeName ? U.children(e, ".active") : U.find(":scope > li > .active", e))[0],
                s = i && n && n.classList.contains("fade"),
                o = () => this._transitionComplete(t, n, i);
            n && s ? (n.classList.remove("show"), this._queueCallback(o, t, !0)) : o()
        }
        _transitionComplete(t, e, i) {
            if (e) {
                e.classList.remove("active");
                const t = U.findOne(":scope > .dropdown-menu .active", e.parentNode);
                t && t.classList.remove("active"), "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", !1)
            }
            t.classList.add("active"), "tab" === t.getAttribute("role") && t.setAttribute("aria-selected", !0), d(t), t.classList.contains("fade") && t.classList.add("show");
            let n = t.parentNode;
            if (n && "LI" === n.nodeName && (n = n.parentNode), n && n.classList.contains("dropdown-menu")) {
                const e = t.closest(".dropdown");
                e && U.find(".dropdown-toggle", e).forEach(t => t.classList.add("active")), t.setAttribute("aria-expanded", !0)
            }
            i && i()
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = ni.getOrCreateInstance(this);
                if ("string" == typeof t) {
                    if (void 0 === e[t]) throw new TypeError(`No method named "${t}"`);
                    e[t]()
                }
            }))
        }
    }
    P.on(document, "click.bs.tab.data-api", '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]', (function(t) {
        ["A", "AREA"].includes(this.tagName) && t.preventDefault(), l(this) || ni.getOrCreateInstance(this).show()
    })), m(ni);
    const si = {
            animation: "boolean",
            autohide: "boolean",
            delay: "number"
        },
        oi = {
            animation: !0,
            autohide: !0,
            delay: 5e3
        };
    class ri extends H {
        constructor(t, e) {
            super(t), this._config = this._getConfig(e), this._timeout = null, this._hasMouseInteraction = !1, this._hasKeyboardInteraction = !1, this._setListeners()
        }
        static get DefaultType() {
            return si
        }
        static get Default() {
            return oi
        }
        static get NAME() {
            return "toast"
        }
        show() {
            P.trigger(this._element, "show.bs.toast").defaultPrevented || (this._clearTimeout(), this._config.animation && this._element.classList.add("fade"), this._element.classList.remove("hide"), d(this._element), this._element.classList.add("show"), this._element.classList.add("showing"), this._queueCallback(() => {
                this._element.classList.remove("showing"), P.trigger(this._element, "shown.bs.toast"), this._maybeScheduleHide()
            }, this._element, this._config.animation))
        }
        hide() {
            this._element.classList.contains("show") && (P.trigger(this._element, "hide.bs.toast").defaultPrevented || (this._element.classList.add("showing"), this._queueCallback(() => {
                this._element.classList.add("hide"), this._element.classList.remove("showing"), this._element.classList.remove("show"), P.trigger(this._element, "hidden.bs.toast")
            }, this._element, this._config.animation)))
        }
        dispose() {
            this._clearTimeout(), this._element.classList.contains("show") && this._element.classList.remove("show"), super.dispose()
        }
        _getConfig(t) {
            return t = { ...oi,
                ...F.getDataAttributes(this._element),
                ..."object" == typeof t && t ? t : {}
            }, r("toast", t, this.constructor.DefaultType), t
        }
        _maybeScheduleHide() {
            this._config.autohide && (this._hasMouseInteraction || this._hasKeyboardInteraction || (this._timeout = setTimeout(() => {
                this.hide()
            }, this._config.delay)))
        }
        _onInteraction(t, e) {
            switch (t.type) {
                case "mouseover":
                case "mouseout":
                    this._hasMouseInteraction = e;
                    break;
                case "focusin":
                case "focusout":
                    this._hasKeyboardInteraction = e
            }
            if (e) return void this._clearTimeout();
            const i = t.relatedTarget;
            this._element === i || this._element.contains(i) || this._maybeScheduleHide()
        }
        _setListeners() {
            P.on(this._element, "mouseover.bs.toast", t => this._onInteraction(t, !0)), P.on(this._element, "mouseout.bs.toast", t => this._onInteraction(t, !1)), P.on(this._element, "focusin.bs.toast", t => this._onInteraction(t, !0)), P.on(this._element, "focusout.bs.toast", t => this._onInteraction(t, !1))
        }
        _clearTimeout() {
            clearTimeout(this._timeout), this._timeout = null
        }
        static jQueryInterface(t) {
            return this.each((function() {
                const e = ri.getOrCreateInstance(this, t);
                if ("string" == typeof t) {
                    if (void 0 === e[t]) throw new TypeError(`No method named "${t}"`);
                    e[t](this)
                }
            }))
        }
    }
    return B(ri), m(ri), {
        Alert: R,
        Button: W,
        Carousel: Z,
        Collapse: et,
        Dropdown: Te,
        Modal: Pe,
        Offcanvas: He,
        Popover: Ze,
        ScrollSpy: ii,
        Tab: ni,
        Toast: ri,
        Tooltip: Xe
    }
}));
//# sourceMappingURL=bootstrap.bundle.min.js.map
/**
 * Theme: Bullkit - Responsive Bootstrap 5 Admin Dashboard
 * Author: Mannatthemes
 * Module/App: Main Js
 */


document.querySelectorAll('.navigation-menu a').forEach(function(element) {
    var pageUrl = window.location.href;
    console.log(pageUrl);

    if (element.href == pageUrl || (!pageUrl.includes('html') && element.href.includes('index'))) {
        element.parentElement.classList.add('active');
    }
});


var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

//Menu
// Toggle menu
function toggleMenu() {
    document.getElementById('mobileToggle').classList.toggle('open');
    var isOpen = document.getElementById('navigation')
    if (isOpen.style.display === "block") {
        isOpen.style.display = "none";
    } else {
        isOpen.style.display = "block";
    }
};