Requireify.register('js/akira/components/row.jsx', function(require, requireAsync, module, exports) {


    "use strict";
    var React = require("react"),
        classNames = require("classnames"),
        IsomorphicContext = require("../../reactMixins/isomorphicContextWithDeps"),
        JawBoneLink = require("../../reactMixins/jawBoneLink"),
        Animation = require("../../reactMixins/cssAnimation.jsx"),
        AkiraContext = require("../../reactMixins/akiraContext"),
        EventBus = require("../../reactMixins/eventBus"),
        OptimizationTest = require("../../utils/ab/optimizationTest"),
        FalkorPureRender = require("../../reactMixins/falkorPureRenderMixin"),
        Slider = require("./slider/slider.jsx"),
        JawBone = require("./jawBone/jawBone.jsx"),
        JawBoneOnRow = require("./jawBone/jawBoneOnRow.jsx"),
        PresTrackedContainer = require("../../components/presentationTracking/presentationTrackingContainer.jsx"),
        BOB_CLOSE_TIMEOUT = 500,
        Row = React.createClass({
            displayName: "Row",
            sliderMoveDirection: null,
            mixins: [IsomorphicContext, JawBoneLink, Animation, FalkorPureRender, AkiraContext],
            getInitialState: function() {
                return {
                    lowestVisibleItemIndex: 0,
                    isBobOpen: !1
                }
            },
            componentDidMount: function() {
                this.props.isMyListRow && (EventBus.on("myList:remove:end", this._decreaseSelectedIndex), EventBus.on("myList:add:end", this._increaseSelectedIndex))
            },
            componentWillUnmount: function() {
                this.props.isMyListRow && (EventBus.removeListener("myList:remove:end", this._decreaseSelectedIndex), EventBus.removeListener("myList:add:end", this._increaseSelectedIndex))
            },
            _increaseSelectedIndex: function() {
                var e = this.props.totalItems;
                this.props.showJawBone && null !== this.props.jawBoneRankNum && void 0 !== this.props.jawBoneRankNum && e && (this.props.isGallery ? (this.context.columnsInRow && this.context.columnsInRow > e && (e = this.context.columnsInRow), this.props.jawBoneRankNum + 1 < e ? this.openJawBoneAtRankNum(this.props.jawBoneRankNum + 1) : this.openJawBoneAtRankNum(0)) : this.props.jawBoneRankNum + 1 <= e && this.openJawBoneAtRankNum(this.props.jawBoneRankNum + 1))
            },
            _decreaseSelectedIndex: function(e) {
                var t, o = this.props.orderedItemList[e.videoId],
                    n = this.props.totalItems,
                    s = this.props.jawBoneRankNum;
                this.props.showJawBone && this.props.orderedItemList && void 0 !== o && (t = this.props.isGallery ? (s + 1) * (this.props.rowNum + 1) : s, s - 1 >= 0 && (t > o || s + 1 >= n) && this.openJawBoneAtRankNum(s - 1))
            },
            childContextTypes: {
                rowNum: React.PropTypes.number
            },
            getChildContext: function() {
                return {
                    rowNum: this.props.rowNum
                }
            },
            handleSliderMove: function(e, t) {
                this.setState({
                    lowestVisibleItemIndex: e
                }), this.sliderMoveDirection = t, "function" == typeof this.props.handleSliderMove && this.props.handleSliderMove(e, t)
            },
            closingBobs: [],
            onBobLeave: function(e, t) {
                var o = this,
                    n = {
                        position: e,
                        callback: t,
                        closeTimeout: setTimeout(function() {
                            o.isMounted() && o.closePrevBobs(!1)
                        }, BOB_CLOSE_TIMEOUT)
                    };
                this.closingBobs.push(n)
            },
            onBobOpen: function(e, t, o, n, s) {
                this.pushSliderItems(e, t, o, n, s), this.closePrevBobs(!0), this.setState({
                    isBobOpen: !0
                })
            },
            onBobClose: function(e, t, o) {
                !this.ignoreClosingPush || this.isJawBoneOpen() ? this.pushSliderItems(e, 0, 0, t, o) : o(), this.ignoreClosingPush = !1
            },
            closePrevBobs: function(e) {
                this.ignoreClosingPush = e;
                for (var t = 0, o = this.closingBobs.length; o > t; t++) {
                    var n = this.closingBobs[t];
                    clearTimeout(n.closeTimeout), n.callback && n.callback()
                }
                this.closingBobs = []
            },
            cleanUpAllBobStyles: function() {
                var e, t;
                this.isMounted() && (e = this.refs.slider, e && (t = e.getAllSliderItems() || [], t.map(function(e) {
                    Animation.clearStyles(React.findDOMNode(e))
                })))
            },
            getIsBobOpen: function() {
                return this.state.isBobOpen
            },
            pushSliderItems: function(e, t, o, n, s) {
                var i = this.refs.slider,
                    r = i.getItem(e);
                if (r && n) {
                    var a, l = r.props.viewportPosition;
                    a = "leftEdge" === l ? 1 : "rightEdge" === l ? -1 : 0;
                    for (var p, c = i.getSliderItemsInViewport(), h = 0; p = c[h]; h++) {
                        var d = 0;
                        if (p === r) d = a * t;
                        else {
                            var u = a ? 2 : 1,
                                m = p.props.viewportIndex > r.props.viewportIndex ? 1 : -1;
                            a && m !== a && (u = 0), d = m * t * o * u
                        }
                        this.context.isRtl && (d = -1 * d), this.animate({
                            target: React.findDOMNode(p),
                            translate3d: Math.floor(d) + "px, 0,0",
                            duration: n,
                            callback: s,
                            easing: "cubic-bezier(0.5, 0, 0.1, 1)"
                        })
                    }
                }
            },
            isJawBoneOpen: function() {
                return this.props.showJawBone
            },
            getJawBoneModel: function() {
                return this.props.jawBoneModelIndex >= 0 ? this.props.model.bind([this.props.jawBoneModelIndex]) : void 0
            },
            handleRowBlur: function() {
                this.closePrevBobs(!1), this.getIsBobOpen() && setTimeout(this.cleanUpAllBobStyles, BOB_CLOSE_TIMEOUT), this.setState({
                    isBobOpen: !1
                })
            },
            wrapChildItems: function(e) {
                var t = this;
                return e.map(function(e) {
                    return React.addons.cloneWithProps(e, {
                        key: e.key,
                        onBobOpen: t.onBobOpen,
                        onBobClose: t.onBobClose,
                        onBobLeave: t.onBobLeave,
                        getRowHasBobOpen: t.getIsBobOpen,
                        aJawBoneOpen: t.isJawBoneOpen(),
                        myJawBoneOpen: t.isJawBoneOpen() && t.props.jawBoneRankNum === e.props.rankNum
                    })
                })
            },
            render: function() {
                var e, t, o, n, s, i, r = this.props.model,
                    a = OptimizationTest.getColumnsInRowModifier(this.context),
                    l = this.context.columnsInRow;
                return a && (l += a), this.isJawBoneOpen() && (o = this.getJawBoneModel(), e = o && o.getValueSync(["summary"]), n = e && "show" === e.type, s = JawBone.getPaths(this.getContext(), null, {
                    isShow: n
                }), i = o && s), t = classNames({
                    rowContainer: !0,
                    jawBoneOpen: i && this.props.isGallery,
                    bobOpen: this.state.isBobOpen,
                    rowContainer_title_card: !0
                }), React.createElement("div", {
                    className: t,
                    id: "row-" + this.props.rowNum
                }, React.createElement(PresTrackedContainer, null, React.createElement("div", {
                    className: "rowContent slider-hover-trigger-layer",
                    onMouseLeave: this.handleRowBlur
                }, React.createElement(Slider, {
                    ref: "slider",
                    itemsInRow: l,
                    totalItems: this.props.totalItems,
                    onSliderMove: this.handleSliderMove,
                    enableLooping: !0,
                    enablePeek: !0,
                    enablePaginationIndicator: this.props.enablePaginationIndicator
                }, this.wrapChildItems(this.props.children))), React.createElement(JawBoneOnRow, {
                    model: r,
                    sliderRef: this.refs.slider,
                    jawBoneRankNum: this.props.jawBoneRankNum,
                    showJawBone: this.isJawBoneOpen(),
                    lowestVisibleItemIndex: this.state.lowestVisibleItemIndex,
                    sliderMoveDirection: this.sliderMoveDirection,
                    infinite: !this.props.isGallery,
                    jawBoneModelIndex: this.props.jawBoneModelIndex
                })))
            }
        });
    module.exports = Row;


});
