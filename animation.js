Requireify.register('js/reactMixins/cssAnimation.jsx', function(require, requireAsync, module, exports) {


    "use strict";
    var React = require("react"),
        inNode = require("../utils/inNode"),
        isClientContext = !inNode,
        NON_CSS_PROPERTIES, CSS_PROPERTIES_MAP, KEYFRAMES_PROPERTIES_MAP, EASING_MAP, TRANSFORM_PROPERTY_MAP, TRANSITION_END_EVENTS_MAP, ANIMATION_END_EVENTS_MAP, VENDOR_PREFIXES, CSSAnimations, animationEndEvent, transitionEndEvent, requestAnimationFrame;
    NON_CSS_PROPERTIES = ["target", "callback", "animation", "after", "before"], CSS_PROPERTIES_MAP = {
            translate: "transform",
            translateX: "transform",
            translateY: "transform",
            rotate: "transform",
            scale: "transform",
            scaleX: "transform",
            scaleY: "transform",
            skewX: "transform",
            skewY: "transform",
            translateZ: "transform",
            translate3d: "transform",
            rotateX: "transform",
            rotateY: "transform",
            scale3d: "transform",
            scaleZ: "transform",
            matrix: "transform",
            matrix3d: "transform",
            origin: "transformOrigin",
            perspective: "perspective",
            easing: "transitionTimingFunction",
            duration: "transitionDuration",
            delay: "transitionDelay"
        }, KEYFRAMES_PROPERTIES_MAP = {
            name: "animationName",
            duration: "animationDuration",
            delay: "animationDelay",
            easing: "animationTimingFunction",
            repeat: "animationIterationCount",
            direction: "animationDirection",
            fillMode: "animationFillMode"
        }, EASING_MAP = {
            ease: "ease",
            linear: "linear",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
            stepStart: "step-start",
            stepEnd: "step-end",
            steps: "steps",
            snap: "cubic-bezier(0,1,.5,1)",
            easeInCubic: "cubic-bezier(.550,.055,.675,.190)",
            easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
            easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
            easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
            easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
            easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
            easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
            easeOutExpo: "cubic-bezier(.19,1,.22,1)",
            easeInOutExpo: "cubic-bezier(1,0,0,1)",
            easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
            easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
            easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
            easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
            easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
            easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
            easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
            easeOutQuint: "cubic-bezier(.23,1,.32,1)",
            easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
            easeInSine: "cubic-bezier(.47,0,.745,.715)",
            easeOutSine: "cubic-bezier(.39,.575,.565,1)",
            easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
            easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
            easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
            easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
        }, TRANSFORM_PROPERTY_MAP = {
            transform: "transform",
            WebkitTransform: "-webkit-transform",
            MozTransform: "-moz-transform",
            OTransform: "-o-transform",
            msTransform: "-ms-transform"
        }, TRANSITION_END_EVENTS_MAP = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "mozTransitionEnd",
            OTransition: "oTransitionEnd",
            msTransition: "MSTransitionEnd"
        }, ANIMATION_END_EVENTS_MAP = {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "mozAnimationEnd",
            OAnimation: "oAnimationEnd",
            msAnimation: "MSAnimationEnd"
        }, VENDOR_PREFIXES = ["Webkit", "Moz", "O", "ms"],
        function() {
            if (!isClientContext) return "";
            var n, e, t, i, a, r;
            n = document.createElement("div"), e = n.style, t = "", VENDOR_PREFIXES.forEach(function(n) {
                return n + "Transition" in e ? void(t = n) : void 0
            });
            for (i in CSS_PROPERTIES_MAP) CSS_PROPERTIES_MAP.hasOwnProperty(i) && (a = CSS_PROPERTIES_MAP[i], r = t + a.charAt(0).toUpperCase() + a.substr(1), r in e && (CSS_PROPERTIES_MAP[i] = r));
            for (i in KEYFRAMES_PROPERTIES_MAP) CSS_PROPERTIES_MAP.hasOwnProperty(i) && (a = KEYFRAMES_PROPERTIES_MAP[i], r = t + a.charAt(0).toUpperCase() + a.substr(1), r in e && (KEYFRAMES_PROPERTIES_MAP[i] = r));
            transitionEndEvent = "TransitionEvent" in window ? "transitionend" : TRANSITION_END_EVENTS_MAP[t + "Transition"], animationEndEvent = "AnimationEvent" in window ? "animationend" : ANIMATION_END_EVENTS_MAP[t + "Animation"]
        }(), requestAnimationFrame = function() {
            if (!isClientContext) return function() {};
            var n = 0;
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
                var t = Date.now(),
                    i = Math.max(0, 16 - (t - n));
                return n = t + i, setTimeout(function() {
                    e(Date.now())
                }, i)
            }
        }(), CSSAnimations = {
            animate: function(n) {
                var e, t, i, a;
                if (!n) throw new TypeError("React Component - " + this.constructor.displayName + ": 'animation' argument must be an object.");
                if (this.isMounted() && (e = this._getDOMNode(n.target), e.addEventListener)) {
                    n.before && this._applyStyle(e, n.before);
                    var r = this;
                    (n.callback || n.animation || "undefined" != typeof n.opacity || n.after) && (t = this._transitionEndCallback.bind(this, n.callback, n.animation), i = this._transitionEndHandler.bind(this, e, t, function() {
                        n.after && r._applyStyle(e, n.after), e.removeEventListener(transitionEndEvent, i)
                    }), e.addEventListener(transitionEndEvent, i)), n.keyframes && n.keyframes.callback && (a = this._animationEndHandler.bind(this, e, n.keyframes.callback, function(n) {
                        e.removeEventListener(animationEndEvent, a)
                    }), e.addEventListener(animationEndEvent, a)), requestAnimationFrame(function() {
                        r._applyStyle(e, n)
                    })
                }
            },
            _getDOMNode: function(n) {
                if (n) {
                    if ("string" == typeof n) {
                        if (!this.refs[n]) throw new Error("React Component - " + this.constructor.displayName + ": 'animation' argument's 'target' property '" + n + "' not found in this.refs.");
                        return React.findDOMNode(this.refs[n])
                    }
                    return n
                }
                return React.findDOMNode(this)
            },
            getAnimationStyle: function(n) {
                var e, t, i, a;
                a = {}, "number" == typeof n.duration && (n.duration += "ms"), "number" == typeof n.delay && (n.delay += "ms"), n.keyframes && "number" == typeof n.keyframes.duration && (n.keyframes.duration += "ms");
                for (e in n)
                    if (-1 === NON_CSS_PROPERTIES.indexOf(e))
                        if (t = CSS_PROPERTIES_MAP[e], i = n[e], t) t in TRANSFORM_PROPERTY_MAP ? (a[t] || (a[t] = ""), a[t] += e + "(" + i + ") ") : "easing" === t ? a[t] = EASING_MAP[i] : a[t] = i;
                        else if ("keyframes" === e)
                    for (e in i) e in KEYFRAMES_PROPERTIES_MAP && ("easing" === e ? a[KEYFRAMES_PROPERTIES_MAP[e]] = EASING_MAP[i[e]] : a[KEYFRAMES_PROPERTIES_MAP[e]] = i[e]);
                else a[e] = i;
                return a
            },
            _transitionEndCallback: function(n, e) {
                if (n && "function" != typeof n) throw new Error("React Component - " + this.constructor.displayName + ": 'animation' argument's 'callback' property must be a function.");
                n && n.call(this), e && this.animate(e)
            },
            _transitionEndHandler: function(n, e, t, i) {
                i.target === n && (t(), e())
            },
            _animationEndHandler: function(n, e, t, i) {
                i.target === n && (t(), e.call(this))
            },
            css: function(n) {
                var e = this._getDOMNode(n.target);
                return this._applyStyle(e, n)
            },
            clearStyles: function(n) {
                n.removeAttribute("style")
            },
            _applyStyle: function(n, e) {
                return requestAnimationFrame(function() {
                    e.reset && (n.removeAttribute("style"), delete e.reset);
                    var t = this.getAnimationStyle(e);
                    for (var i in t) t.hasOwnProperty(i) && (n.style[i] = t[i])
                }.bind(this)), n
            }
        }, module.exports = CSSAnimations;


});
