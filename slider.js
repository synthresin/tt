Requireify.register('js/akira/components/slider/slider.jsx', function(require, requireAsync, module, exports) {


    "use strict";
    var React = require("react"),
        classNames = require("classnames"),
        SliderItem = require("./sliderItem.jsx"),
        PaginationIndicator = require("./paginationIndicator.jsx"),
        LoadingTitle = require("../loaders/loadingTitle.jsx"),
        ScrollHorizontal = require("../../../reactMixins/scrollHorizontal.js"),
        SyntheticMouseEvent = require("../../../reactMixins/syntheticMouseEvent.js"),
        EventBus = require("../../../reactMixins/eventBus.js"),
        IsomorphicContext = require("../../../reactMixins/isomorphicContextWithDeps"),
        I18N = require("../../../reactMixins/i18n"),
        KeyBoardEvents = require("../../../utils/keyboardEventsWrapper"),
        presentationTracking = require("../../../common/presentationTracking/presentationTracking.js"),
        WIDTH_100_PERCENT = 100,
        isAnimating = !1,
        BUNDLE = "discovery/akira/Common:slider.handle",
        Slider = React.createClass({
            displayName: "Slider",
            animateHoverTimeout: null,
            touchStart: null,
            statics: {
                MOVE_DIRECTION_NEXT: 1,
                MOVE_DIRECTION_PREV: -1,
                __meta__: {
                    strings: [{
                        bundle: BUNDLE,
                        ids: ["previous", "next"]
                    }]
                }
            },
            contextTypes: {
                isRtl: React.PropTypes.bool
            },
            mixins: [I18N, ScrollHorizontal, SyntheticMouseEvent, IsomorphicContext],
            getInitialState: function() {
                var e = this.props.initialLowestVisibleIndex || 0,
                    t = this.getTotalItemCount();
                return !this.props.enableLooping && t && e + this.props.itemsInRow > t && (e = t - this.props.itemsInRow, 0 > e && (e = 0)), {
                    lowestVisibleItemIndex: e,
                    hasMovedOnce: this.props.initialLowestVisibleIndex || !1,
                    sliderHandleFocused: !1
                }
            },
            advanceNext: function(e) {
                var t, i = this.state.lowestVisibleItemIndex + this.props.itemsInRow,
                    s = this.state.lowestVisibleItemIndex + 2 * this.props.itemsInRow,
                    n = this.getTotalItemCount();
                e && e.preventDefault(), this.isNextNavActive() && !this.isAnimating && (this.isAnimating = !0, i !== n && s > n && (i = n - this.props.itemsInRow), t = this.getNewSliderOffset(i), i === n && (i = 0), e && "wheel" === e.type ? this.shiftSlider(i, t, Slider.MOVE_DIRECTION_NEXT, {
                    x: e.clientX,
                    y: e.clientY
                }) : e && "keydown" === e.type ? this.shiftSlider(i, t, Slider.MOVE_DIRECTION_NEXT, null, !0) : this.shiftSlider(i, t, Slider.MOVE_DIRECTION_NEXT))
            },
            advancePrev: function(e) {
                var t, i = this.state.lowestVisibleItemIndex - this.props.itemsInRow,
                    s = this.getTotalItemCount();
                e && e.preventDefault(), this.isPrevNavActive() && !this.isAnimating && (this.isAnimating = !0, 0 !== this.state.lowestVisibleItemIndex && 0 > i && (i = 0), t = this.getNewSliderOffset(i), 0 === this.state.lowestVisibleItemIndex && (i = s - this.props.itemsInRow), e && "wheel" === e.type ? this.shiftSlider(i, t, Slider.MOVE_DIRECTION_PREV, {
                    x: e.clientX,
                    y: e.clientY
                }) : e && "keydown" === e.type ? this.shiftSlider(i, t, Slider.MOVE_DIRECTION_PREV, null, !0) : this.shiftSlider(i, t, Slider.MOVE_DIRECTION_PREV))
            },
            shiftSlider: function(e, t, i, s, n) {
                var o = this,
                    r = React.findDOMNode(this.refs.sliderContent),
                    a = this.refs.handlePrev ? React.findDOMNode(this.refs.handlePrev) : null,
                    l = this.getAnimationStyle(t);
                clearTimeout(this.animateHoverTimeout), "function" == typeof this.props.onSliderMove && this.props.onSliderMove(e, i), a && a.classList.add("active"), r.addEventListener("transitionend", function h(t) {
                    t.target === this && (r.removeEventListener("transitionend", h), r.classList.remove("animating"), o.setState({
                        lowestVisibleItemIndex: e,
                        hasMovedOnce: !0
                    }), o.resetSliderPosition(), o.isAnimating = !1, o.refocusAfterShift(i), presentationTracking.requestScan(), EventBus.emit("motion-boxart:scan"), s && (clearTimeout(o.animateHoverTimeout), o.animateHoverTimeout = setTimeout(function() {
                        SyntheticMouseEvent.mouseOver(s)
                    }, 100)))
                }), r.classList.add("animating"), r.setAttribute("style", l)
            },
            refocusAfterShift: function(e) {
                var t, i, s = this.getSliderItemsInViewport();
                s && s.length > 1 && (i = e === Slider.MOVE_DIRECTION_NEXT ? 1 : s.length - 2, t = s[i].getDOMNode().querySelector(".sliderRefocus"), t && t.focus())
            },
            resetSliderPosition: function() {
                if (this.refs.sliderContent) {
                    var e = this.getBaseSliderOffset(),
                        t = this.getAnimationStyle(e);
                    React.findDOMNode(this.refs.sliderContent).setAttribute("style", t)
                }
            },
            getSliderItemWidth: function() {
                return WIDTH_100_PERCENT / this.props.itemsInRow
            },
            getHighestIndex: function() {
                return Math.min(this.getTotalItemCount(), this.state.lowestVisibleItemIndex + 2 * this.props.itemsInRow + 1)
            },
            getLowestIndex: function() {
                return Math.max(0, this.state.lowestVisibleItemIndex - this.props.itemsInRow - 1)
            },
            getTotalItemCount: function() {
                return this.props.totalItems
            },
            getTotalPages: function() {
                return Math.ceil(this.getTotalItemCount() / this.props.itemsInRow)
            },
            getPageNumber: function(e) {
                return Math.ceil(e / this.props.itemsInRow)
            },
            getBaseSliderOffset: function() {
                var e = 0,
                    t = this.props.itemsInRow,
                    i = this.getSliderItemWidth();
                return this.getTotalPages() > 1 && ((this.state.hasMovedOnce && 0 === this.state.lowestVisibleItemIndex && this.props.enableLooping || this.state.lowestVisibleItemIndex >= t) && (e = -WIDTH_100_PERCENT), this.state.hasMovedOnce && (this.props.enableLooping || this.state.lowestVisibleItemIndex > t) && (e -= i), this.state.lowestVisibleItemIndex > 0 && this.state.lowestVisibleItemIndex < t && (e -= this.state.lowestVisibleItemIndex * i)), e *= this.context.isRtl ? -1 : 1
            },
            getNewSliderOffset: function(e) {
                var t = this.state.lowestVisibleItemIndex - e,
                    i = this.getBaseSliderOffset(),
                    s = this.getSliderItemWidth(),
                    n = this.context.isRtl ? -1 : 1;
                return i + t * s * n
            },
            getSliderContents: function() {
                var e = [],
                    t = [],
                    i = this.props.itemsInRow,
                    s = this.getTotalItemCount(),
                    n = 0,
                    o = this.state.lowestVisibleItemIndex - this.getLowestIndex();
                if (this.props.children && this.props.children.length) {
                    e = this.props.children.slice(this.getLowestIndex(), this.getHighestIndex()), n = this.getHighestIndex() - this.getLowestIndex();
                    for (var r = 0; e.length < n && e.length < s;) e.push(React.createElement(LoadingTitle, {
                        className: "fullWidth",
                        delay: .2 * r,
                        pulsate: !1,
                        displayWhenNotPulsing: !0,
                        key: "loading-title-" + r
                    })), r++;
                    this.getTotalPages() > 1 && this.props.enableLooping && (this.getHighestIndex() - this.state.lowestVisibleItemIndex <= 2 * i && (t = this.state.lowestVisibleItemIndex + i === s ? this.props.children.slice(0, this.props.itemsInRow + 1) : this.props.children.slice(0, 1), t = this.cloneItemsWithNewKeys(t, "_appended"), e = e.concat(t)), this.state.hasMovedOnce && this.state.lowestVisibleItemIndex - i <= 0 && (t = 0 === this.state.lowestVisibleItemIndex ? this.props.children.slice(-this.props.itemsInRow - 1) : this.props.children.slice(-1), o += t.length, t = this.cloneItemsWithNewKeys(t, "_prepended"), e = t.concat(e)))
                }
                return this.wrapSliderItems(e, o)
            },
            cloneItemsWithNewKeys: function(e, t) {
                return e.map(function(e) {
                    return React.addons.cloneWithProps(e, {
                        key: e.key + t
                    })
                })
            },
            sliderWrappedItems: [],
            getSliderItemsInViewport: function() {
                return this.getSliderItems(this.sliderWrappedItems.filter(function(e) {
                    return e.inViewport
                }))
            },
            getAllSliderItems: function() {
                return this.getSliderItems(this.sliderWrappedItems)
            },
            getSliderItems: function(e) {
                var t, i, s = [];
                for (t = 0; i = e[t]; t++) this.refs[i.uid] && s.push(this.refs[i.uid]);
                return s
            },
            isTouchEnabled: function() {
                return "ontouchstart" in window || navigator.maxTouchPoints > 0
            },
            getItem: function(e) {
                return this.refs[e]
            },
            isItemInMiddle: function(e) {
                var t = this.getItem("item_" + e);
                return t && ("middle" === t.props.viewportPosition || "leftEdge" === t.props.viewportPosition || "rightEdge" === t.props.viewportPosition)
            },
            wrapSliderItems: function(e, t) {
                var i = t + this.props.itemsInRow - 1,
                    s = 0,
                    n = this;
                return this.sliderWrappedItems = [], React.Children.map(e, function(e, o) {
                    var r, a = "",
                        l = !1;
                    o === t ? (a = "leftEdge", l = !0) : o === t - 1 ? a = "leftPeek" : o === i + 1 ? a = "rightPeek" : o === i ? (a = "rightEdge", l = !0) : o >= t && i >= o && (a = "middle", l = !0);
                    var h = a ? s : "",
                        d = !1,
                        c = "item_" + o;
                    return a && (++s, d = !0), n.sliderWrappedItems.push({
                        uid: c,
                        inViewport: d
                    }), r = React.addons.cloneWithProps(e, {
                        sliderItemId: c,
                        itemTabbable: l
                    }), React.createElement(SliderItem, {
                        ref: c,
                        key: c,
                        viewportIndex: h,
                        viewportPosition: a
                    }, r)
                })
            },
            getAnimationStyle: function(e) {
                var t = e ? "translate3d(" + e + "%, 0px, 0px)" : "";
                return ["-webkit-transform: " + t, "-moz-transform: " + t, "-ms-transform: " + t, "-o-transform: " + t, "transform: " + t].join(";")
            },
            getReactAnimationStyle: function(e) {
                var t = e ? "translate3d(" + e + "%, 0px, 0px)" : "";
                return e ? {
                    WebkitTransform: t,
                    MozTransform: t,
                    MsTransform: t,
                    OTransform: t,
                    transform: t
                } : null
            },
            handleMouseLeaveSliderMask: function() {
                clearTimeout(this.animateHoverTimeout)
            },
            handleTouchStart: function(e) {
                var t = this.isTouchEnabled() && e.changedTouches ? e.changedTouches[0] : e;
                this.touchStart = {
                    x: parseInt(t.clientX),
                    y: parseInt(t.clientY)
                }
            },
            handleTouchMove: function(e) {
                var t = this.isTouchEnabled() && e.changedTouches ? e.changedTouches[0] : e,
                    i = this.touchStart ? this.touchStart.x - t.clientX : 0,
                    s = this.touchStart ? Math.abs(this.touchStart.y - t.clientY) : 0;
                i *= this.context.isRtl ? -1 : 1, isAnimating || (i > ScrollHorizontal.MIN_HORZ_SWIPE_THRESHOLD_IN_PX && s < ScrollHorizontal.MIN_VERT_SWIPE_THRESHOLD_IN_PX && this.isNextNavActive() ? (this.advanceNext(), this.touchStart = {}) : i < -ScrollHorizontal.MIN_HORZ_SWIPE_THRESHOLD_IN_PX && s < ScrollHorizontal.MIN_VERT_SWIPE_THRESHOLD_IN_PX && this.isPrevNavActive() && (this.advancePrev(), this.touchStart = {})), Math.abs(i) > Math.abs(s) && e.preventDefault()
            },
            handleMouseWheel: function(e) {
                if (!isAnimating) {
                    var t = this.advanceDirection(e);
                    "next" === t ? this.advanceNext(e) : "prev" === t && this.advancePrev(e)
                }
            },
            componentDidUpdate: function(e) {
                this.props.itemsInRow !== e.itemsInRow && this.resetSliderPosition()
            },
            componentWillReceiveProps: function(e) {
                e.totalItems < this.props.totalItems && this.isLastPage() && this.setState({
                    lowestVisibleItemIndex: e.totalItems - e.itemsInRow
                })
            },
            hasMorePrevPages: function() {
                var e = this.state.lowestVisibleItemIndex - this.props.itemsInRow;
                return this.props.enableLooping || e > -this.props.itemsInRow
            },
            hasMoreNextPages: function() {
                var e = this.state.lowestVisibleItemIndex + this.props.itemsInRow;
                return this.props.enableLooping || e < this.getTotalItemCount()
            },
            isPrevNavActive: function() {
                return this.getTotalPages() > 1 && this.state.hasMovedOnce && this.hasMorePrevPages()
            },
            isNextNavActive: function() {
                return this.getTotalPages() > 1 && this.hasMoreNextPages()
            },
            isLastPage: function() {
                return this.getPageNumber(this.state.lowestVisibleItemIndex) + 1 === this.getTotalPages()
            },
            componentDidMount: function() {
                var e = React.findDOMNode(this.refs.sliderContent);
                this.isTouchEnabled() && (e.addEventListener("pointerdown", this.handleTouchStart), e.addEventListener("pointermove", this.handleTouchMove))
            },
            componentWillUnmount: function() {
                var e = React.findDOMNode(this.refs.sliderContent);
                this.isTouchEnabled() && (e.removeEventListener("pointerdown", this.handleTouchStart), e.removeEventListener("pointermove", this.handleTouchMove))
            },
            renderPageHandle: function(e, t, i, s, n) {
                if (1 >= e || t && !this.state.hasMovedOnce) return null;
                var o = {
                        handle: !0,
                        handlePrev: t,
                        handleNext: !t,
                        active: s
                    },
                    r = {
                        "indicator-icon": !0,
                        "icon-leftCaret": this.context.isRtl ? !t : t,
                        "icon-rightCaret": this.context.isRtl ? t : !t
                    },
                    a = t ? "previous" : "next";
                return React.createElement("span", {
                    className: classNames(o),
                    tabIndex: !t || this.state.hasMovedOnce ? 0 : -1,
                    ref: i,
                    onClick: n,
                    onKeyDown: KeyBoardEvents.executeOnEnterOrSpace(n),
                    onMouseEnter: this.props.onMouseEnterSliderHandle,
                    onFocus: this.props.onMouseEnterSliderHandle,
                    onMouseLeave: this.props.onMouseLeaveSliderHandle,
                    onBlur: this.props.onMouseLeaveSliderHandle,
                    role: "button",
                    "aria-label": this.getString(BUNDLE, a)
                }, React.createElement("b", {
                    className: classNames(r)
                }))
            },
            render: function() {
                var e, t = this.getReactAnimationStyle(this.getBaseSliderOffset()),
                    i = "sliderContent row-with-x-columns",
                    s = this.getTotalPages(),
                    n = this.props.enablePaginationIndicator && s > 1;
                return e = {
                    sliderMask: !0,
                    showPeek: this.props.enablePeek
                }, React.createElement("div", {
                    className: "slider"
                }, this.renderPageHandle(s, !0, "handlePrev", this.isPrevNavActive(), this.advancePrev), n ? React.createElement(PaginationIndicator, {
                    totalPages: s,
                    activePage: this.getPageNumber(this.state.lowestVisibleItemIndex)
                }) : null, React.createElement("div", {
                    className: classNames(e),
                    onMouseLeave: this.handleMouseLeaveSliderMask
                }, React.createElement("div", {
                    className: i,
                    ref: "sliderContent",
                    style: t,
                    onTouchStart: this.handleTouchStart,
                    onTouchMove: this.handleTouchMove,
                    onWheel: this.handleMouseWheel
                }, this.getSliderContents())), this.renderPageHandle(s, !1, "handleNext", this.isNextNavActive(), this.advanceNext))
            }
        });
    module.exports = Slider;


});
