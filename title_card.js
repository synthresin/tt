var _extends = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var i = arguments[t];
                for (var o in i) Object.prototype.hasOwnProperty.call(i, o) && (e[o] = i[o])
            }
            return e
        },
        React = require("react"),
        _ = require("lodash"),
        classNames = require("classnames"),
        PathEvaluatorUtils = require("../../../utils/pathEvaluatorUtils"),
        ErrorTitleCard = require("./errorTitleCard.jsx"),
        BobCard = require("./bobCard.jsx"),
        Progress = require("../jawBone/progress.jsx"),
        MotionBoxArt = require("./motionBoxArt.jsx"),
        JawBone = require("../jawBone/jawBone.jsx"),
        ImageExtension = require("../../../common/imageExtension"),
        JawBoneLink = require("../../../reactMixins/jawBoneLink"),
        AkiraContext = require("../../../reactMixins/akiraContext"),
        PlayButton = require("../controls/playbutton.jsx"),
        FalkorFetch = require("../../../reactMixins/falkor-fetch"),
        IsomorphicContext = require("../../../reactMixins/isomorphicContextWithDeps"),
        FalkorPureRender = require("../../../reactMixins/falkorPureRenderMixin"),
        Scheduler = require("../../../reactMixins/scheduler"),
        EventBus = require("../../../reactMixins/eventBus"),
        I18N = require("../../../reactMixins/i18n"),
        Watched = require("../../../reactMixins/video/watched"),
        MotionBoxArtTest = require("../../../reactMixins/ab/motionBoxArtTest"),
        KeyCodes = require("../../../common/keyCodes"),
        OptimizationTest = require("../../../utils/ab/optimizationTest"),
        CSSAnimation = require("../../../reactMixins/cssAnimation.jsx"),
        PresTrackedElement = require("../../../components/presentationTracking/presentationTrackingElement.jsx"),
        TitleCardFocus = require("./titleCardFocus.jsx"),
        PlayPrediction = require("../../../common/playPrediction/playPrediction"),
        ReactTransitionGroup = React.addons.TransitionGroup,
        SIZE = "_342x192",
        DELAY_JAWBONE = 300,
        BUNDLE = "discovery/akira/Common",
        DELAY_OPEN_FAST = 100,
        DELAY_OPEN_SLOW = 400,
        DELAY_OPEN_WITH_INTENT = 60,
        MAX_DIST_TO_OPEN_BOB_PX = 3,
        MOUSE_MOVE_INTERVAL_MS = 50,
        BOB_TRIGGER_CLICK = "click",
        BOB_TRIGGER_INTENT = "intent",
        prefetchStrategies = {
            bobs: {
                bobs: !0
            },
            jawBones: {
                jawBones: !0
            }
        },
        getPaths = function(e, t, i) {
            t || (t = {}), i || (i = {});
            var o, n, s = [
                    ["summary"],
                    ["title"],
                    ["boxarts", SIZE, ImageExtension.getExtensionForOpaqueImage(e)]
                ],
                a = _.assign({}, e, {
                    listContext: "continueWatching"
                });
            return "under" === OptimizationTest.getBookmarkLocation(a) ? s = s.concat([
                ["current", ["runtime", "bookmarkPosition"]]
            ]) : OptimizationTest.hasNoGrowBOB(a) && (s = s.concat(PlayButton.getPaths())), t.bobs && (o = BobCard.getPaths(e, t, i), s = s.concat(o)), t.jawBones && (n = JawBone.getPaths(e, t, {
                isShow: i.isShow
            }), s = s.concat(n)), s
        },
        TitleCard = React.createClass({
            displayName: "TitleCard",
            mixins: [I18N, JawBoneLink, CSSAnimation, FalkorFetch, IsomorphicContext, FalkorPureRender, Scheduler, AkiraContext, MotionBoxArtTest, Watched],
            isHovering: !1,
            statics: {
                extension: function(e) {
                    return ImageExtension.getExtensionForOpaqueImage(e)
                },
                getPaths: getPaths,
                getSize: function() {
                    return SIZE
                },
                __meta__: {
                    strings: [{
                        bundle: "discovery/akira/Common",
                        ids: ["loading", "evidence.mylist", "evidence.continueWatching", "evidence.dayEvidence"]
                    }]
                }
            },
            childContextTypes: {
                rankNum: React.PropTypes.number
            },
            getChildContext: function() {
                return {
                    rankNum: this.props.rankNum
                }
            },
            getInitialState: function() {
                return {
                    hasBob: !1,
                    hideJawFocus: !1
                }
            },
            placeHolder: function() {
                var e = "lockup title_card " + (this.props.className || "");
                return React.createElement("div", {
                    className: e
                }, React.createElement("div", {
                    className: "video-artwork tc-load"
                }, this.getString(BUNDLE, "loading")))
            },
            eventOpenJaw: function(e) {
                var t, i;
                this.props.myJawBoneOpen || "keydown" !== e.type && this.state.hasBob || (t = (this.props.model.getValueSync(["userRating"]) || {}).matchScore, i = (this.props.model.getValueSync(["userRating"]) || {}).tooNewForMatchScore, EventBus.emit("jawbone:open", _.assign({}, this.context, this.props, {
                    trigger: "miniBob"
                }, void 0 !== t ? {
                    matchScore: t
                } : {}, void 0 !== i ? {
                    tooNewForMatchScore: i
                } : {})), this.openJawBoneAtRankNum(this.props.rankNum, this.props.videoId, e.type), this.onOpenJaw(!0))
            },
            handleKeyDown: function(e) {
                var t = this;
                switch (e && e.which) {
                    case KeyCodes.ENTER:
                        this.eventOpenJaw(e);
                        break;
                    case KeyCodes.ESC:
                        this.props.myJawBoneOpen && (EventBus.emit("jawbone:close", {
                            reason: "explicit"
                        }), this.closeJawBone(function() {
                            React.findDOMNode(t).focus()
                        }))
                }
            },
            handleClick: function(e) {
                OptimizationTest.getBobOpenTrigger(this.context) === BOB_TRIGGER_CLICK ? this.handleEnter(e, BOB_TRIGGER_CLICK) : OptimizationTest.hasNoGrowBOB(this.context) ? React.findDOMNode(this.refs.playButton).click() : this.eventOpenJaw(e)
            },
            handleMouseOver: function(e) {
                var t = React.findDOMNode(this.refs.titleCard),
                    i = document.activeElement || document.body;
                e.preventDefault(), e && e.currentTarget && t.contains(e.currentTarget) && !this.state.hasBob && (i !== document.body && i.blur(), this.handleEnter(e))
            },
            handleMouseOut: function(e) {
                var t = React.findDOMNode(this.refs.titleCard);
                e.preventDefault(), (e && !e.relatedTarget || e.relatedTarget.location || e.relatedTarget && !t.contains(e.relatedTarget)) && this.handleLeave()
            },
            handleBlur: function(e) {
                var t = React.findDOMNode(this.refs.titleCard),
                    i = e && e.relatedTarget || document.activeElement;
                e && "blur" === e.type && i && t.contains(i) && i !== t || this.handleLeave()
            },
            handleMouseMove: function(e) {
                this.currentMouseX = e.screenX, this.currentMouseY = e.screenY
            },
            checkHoverIntent: function() {
                var e = Math.abs(this.currentMouseX - this.lastMouseX),
                    t = Math.abs(this.currentMouseY - this.lastMouseY);
                Math.sqrt(e * e + t * t) < MAX_DIST_TO_OPEN_BOB_PX ? this.queueBobOpen(BOB_TRIGGER_INTENT) : (clearTimeout(this.bobTimeout), this.bobTimeout = null), this.isHovering && (this.lastMouseX = this.currentMouseX, this.lastMouseY = this.currentMouseY, this.checkHoverIntentTimer = setTimeout(this.checkHoverIntent, MOUSE_MOVE_INTERVAL_MS))
            },
            handleEnter: function(e, t) {
                var i = this,
                    o = this.getContext();
                this.isHovering = !0, this.fetchedBOBData || (this.fetchedBOBData = !0, this.queue(function() {
                    var e = prefetchStrategies.bobs;
                    i.fetchData(i.props.model, getPaths(o, e), "titleCardEnter1", null, e.forceUpdate)
                }), this.queue(function() {
                    var e = prefetchStrategies.jawBones,
                        t = getPaths(o, e);
                    i.fetchData(i.props.model, t, "titleCardEnter2", null, e.forceUpdate)
                })), this.props.aJawBoneOpen ? this.jawBoneTimeout || this.props.myJawBoneOpen || (this.jawBoneTimeout = setTimeout(function() {
                    EventBus.emit("jawbone:open", _.assign({}, i.context, i.props, {
                        trigger: "miniBob"
                    })), i.openJawBoneAtRankNum(i.props.rankNum, i.props.videoId), i.clearDelays()
                }, DELAY_JAWBONE)) : OptimizationTest.getBobOpenTrigger(this.context) === BOB_TRIGGER_INTENT ? (this.lastMouseX = e.screenX, this.lastMouseY = e.screenY, this.checkHoverIntentTimer = setTimeout(this.checkHoverIntent, MOUSE_MOVE_INTERVAL_MS)) : OptimizationTest.getBobOpenTrigger(this.context) === BOB_TRIGGER_CLICK ? t === BOB_TRIGGER_CLICK && this.openBob() : this.queueBobOpen(t)
            },
            queueBobOpen: function(e) {
                if (!this.bobTimeout && !this.state.hasBob) {
                    var t;
                    t = OptimizationTest.hasNoGrowBOB(this.context) ? DELAY_OPEN_FAST : OptimizationTest.getBobOpenTrigger(this.context) === BOB_TRIGGER_INTENT ? DELAY_OPEN_WITH_INTENT : this.props.getRowHasBobOpen && this.props.getRowHasBobOpen() ? DELAY_OPEN_FAST : DELAY_OPEN_SLOW, this.bobTimeout = setTimeout(this.openBob, t)
                }
            },
            openBob: function() {
                var e = this;
                if (this.isHovering && this.isMounted()) {
                    var t = this.props.model.getValueSync(["userRating"]) || {},
                        i = t.matchScore,
                        o = t.tooNewForMatchScore,
                        n = t.predicted;
                    EventBus.emit("bob:open", _.assign({}, this.context, this.props, void 0 !== n ? {
                        predictedRating: n
                    } : {}, void 0 !== i ? {
                        matchScore: i
                    } : {}, void 0 !== o ? {
                        tooNewForMatchScore: o
                    } : {})), this.setState({
                        hasBob: !0
                    }), EventBus.once("bob:open", function(t) {
                        var i = _.get(e.getData(), "summary.id", null),
                            o = _.get(t, "videoId", null);
                        i && o && i !== o && e.handleLeave()
                    }), PlayPrediction.stub || EventBus.emit("play:focus", _.assign({}, this.props))
                }
                this.clearDelays()
            },
            clearDelays: function() {
                OptimizationTest.getBobOpenTrigger(this.context) === BOB_TRIGGER_INTENT && (clearTimeout(this.checkHoverIntentTimer), this.checkHoverIntentTimer = null), clearTimeout(this.jawBoneTimeout), clearTimeout(this.bobTimeout), this.jawBoneTimeout = 0, this.bobTimeout = 0
            },
            handleLeave: function() {
                this.isHovering = !1, this.clearDelays();
                var e = this;
                this.state.hasBob && -1 === window.location.search.indexOf("stickybob") && (EventBus.emit("bob:close", _.assign({}, this.context, this.props)), this.props.onBobLeave(this.props.rankNum, function() {
                    e.isMounted() && e.setState({
                        hasBob: !1
                    })
                }))
            },
            onBobOpenJaw: function() {
                this.onOpenJaw(!1)
            },
            onOpenJaw: function(e) {
                this.handleLeave(), this.setState({
                    hideJawFocus: !e,
                    hasBob: !1
                })
            },
            componentDidMount: function() {
                if (this.motionBoxArtVideoId = this.getMotionVideoId(this.getVideoId()), this.motionBoxArtVideoId) {
                    var e = this;
                    EventBus.emit("motion-boxart:register", {
                        component: this,
                        element: React.findDOMNode(this),
                        videoId: this.motionBoxArtVideoId,
                        sortIndex: 100 * this.props.rowNum + this.props.rankNum,
                        getVideo: function() {
                            return e.isMounted() ? React.findDOMNode(e.refs.motion) : null
                        }
                    }), this.forceUpdate()
                }
                EventBus.on("rating:set", this.onRating)
            },
            componentWillUnmount: function() {
                this.clearDelays(), EventBus.removeListener("rating:set", this.onRating)
            },
            handleWindowVisibilityChange: function(e) {
                e || this.handleLeave()
            },
            componentWillUpdate: function(e, t) {
                t.hasBob && !this.state.hasBob ? EventBus.once("window-visibility:changed", this.handleWindowVisibilityChange) : !t.hasBob && this.state.hasBob && EventBus.removeListener("window-visibility:changed", this.handleWindowVisibilityChange)
            },
            onBobOpen: function(e, t, i) {
                this.props.onBobOpen && this.props.sliderItemId && this.props.onBobOpen(this.props.sliderItemId, e, t, i)
            },
            onBobClose: function(e, t) {
                var i = this,
                    o = function() {
                        i.props.myJawBoneOpen && i.setState({
                            hideJawFocus: !1
                        }), t && t()
                    };
                this.props.onBobClose && this.props.sliderItemId && this.props.onBobClose(this.props.sliderItemId, e, o)
            },
            getVideoId: function() {
                var e = this.props.model.getValueSync(["summary"]);
                return e && e.id ? e.id : 0
            },
            getBoxArt: function(e) {
                var t = e.getValueSync(["boxarts"]),
                    i = TitleCard.extension(this.getContext()),
                    o = {};
                return t && t[SIZE] && t[SIZE][i] ? (o.boxart = t[SIZE][i].url, o.imageKey = t[SIZE][i].image_key) : (o.boxart = null, o.imageKey = null), o
            },
            getTitle: function(e) {
                return e && e.getValueSync(["title"])
            },
            getWatchedEvidence: function(e) {
                if (!e) return this.getString(BUNDLE, "evidence.continueWatching");
                var t = {
                        hour: 36e5,
                        day: 864e5
                    },
                    i = new Date,
                    o = i - e,
                    n = parseInt(o / t.day, 10);
                return o < t.day ? this.getString(BUNDLE, "evidence.continueWatching") : this.getString(BUNDLE, "evidence.dayEvidence", {
                    numDays: n
                })
            },
            getEvidence: function(e) {
                var t = e && e.getBoundValue(),
                    i = t && t.queue && t.queue.inQueue,
                    o = t && t.playListEvidence,
                    n = o && o.name,
                    s = {};
                return n ? ("galleryPlaylistVideo" === n && i && (s.evidenceString = this.getString(BUNDLE, "evidence.mylist"), s.isMyList = !0), "galleryContinueWatchingVideo" === n && (e.getValueSync(["bookmark"]) && e.getValueSync(["bookmark"]).bookmarkLastModified ? s.evidenceString = this.getWatchedEvidence(e.getValueSync(["bookmark"]).bookmarkLastModified) : s.evidenceString = this.getString(BUNDLE, "evidence.continueWatching")), s) : s
            },
            getData: function() {
                var e = this.props.model,
                    t = {},
                    i = this.getBoxArt(e),
                    o = {
                        model: e,
                        summary: e.getValueSync(["summary"]),
                        boxart: i.boxart,
                        imageKey: i.imageKey,
                        title: this.getTitle(e)
                    };
                return this.props.showVideoEvidence && (t = this.getEvidence(e), o.evidence = t.evidenceString, o.isMyList = t.isMyList), "under" === OptimizationTest.getBookmarkLocation(this.context) && (o.episodeRuntime = e.getValueSync(["current", "runtime"]), o.episodeBookmark = e.getValueSync(["current", "bookmarkPosition"])), this.motionBoxArtVideoId && (o.boxart = this.getMotionAsset("static", this.motionBoxArtVideoId)), o
            },
            getInnerContent: function() {
                return !this.motionBoxArtVideoId || this.props.aJawBoneOpen || this.state.hasBob ? null : React.createElement(MotionBoxArt, {
                    ref: "motion",
                    videoId: this.motionBoxArtVideoId
                })
            },
            onRating: function() {
                this.isMounted() && this.forceUpdate()
            },
            isDisliked: function() {
                var e = this.props.model.getValueSync(["userRating"]);
                return e && "thumb" === e.type && 1 === e.userRating ? !0 : !1
            },
            render: function() {
                var e, t = this.getData(),
                    i = classNames({
                        hasBob: this.state.hasBob,
                        smallTitleCard: !0,
                        lockup: !0,
                        title_card: !0,
                        sliderRefocus: !0,
                        "pop-in": this.props.animateIn,
                        highlighted: this.props.myJawBoneOpen,
                        "not-highlighted": this.props.aJawBoneOpen && !this.props.myJawBoneOpen,
                        disliked: this.isDisliked()
                    }),
                    o = null,
                    n = null,
                    s = null,
                    a = {},
                    r = {};
                if (PathEvaluatorUtils.isValueError(t.summary)) return React.createElement(ErrorTitleCard, {
                    classes: i,
                    errorMessage: t.summary.message
                });
                if (!t.summary || !t.boxart) return React.createElement(ErrorTitleCard, {
                    classes: i,
                    errorMessage: "Summary or boxart is undefined"
                });
                this.props.animateIn && (e = t.summary.id % 20 * 2.5 / 100 + .3, a = CSSAnimation.getAnimationStyle({
                    keyframes: {
                        delay: e + "s"
                    }
                }));
                var c = "title-card-" + this.props.rowNum + "-" + this.props.rankNum,
                    u = this.props.myJawBoneOpen && !this.state.hideJawFocus,
                    h = {
                        backgroundImage: "url(" + t.boxart + ")"
                    };
                return this.props.showVideoEvidence && (o = t.isMyList ? React.createElement("div", {
                    className: "video-evidence "
                }, React.createElement("span", {
                    className: "icon-button-mylist-no-ring"
                }, React.createElement("span", {
                    className: "icon-button-mylist-added evidence-icon"
                })), React.createElement("span", null, t.evidence)) : React.createElement("div", {
                    className: "video-evidence"
                }, React.createElement("span", null, t.evidence))), "under" === OptimizationTest.getBookmarkLocation(this.context) && t.episodeRuntime && (n = React.createElement(Progress, {
                    runtime: t.episodeRuntime,
                    bookmarkPosition: t.episodeBookmark,
                    current: !0,
                    showSummary: !1
                })), OptimizationTest.getBobOpenTrigger(this.context) === BOB_TRIGGER_INTENT && (r.onMouseMove = this.handleMouseMove), OptimizationTest.hasNoGrowBOB(this.context) && (s = React.createElement(PlayButton, {
                    ref: "playButton",
                    model: this.props.model,
                    style: {
                        display: "none"
                    }
                })), React.createElement("div", {
                    className: "title-card-container"
                }, React.createElement("div", _extends({
                    id: c,
                    key: c,
                    className: i + " " + (this.props.className || ""),
                    style: a,
                    tabIndex: this.props.itemTabbable ? 0 : -1,
                    "aria-label": t.title ? t.title : null,
                    role: this.props.itemTabbable ? "link" : null,
                    ref: "titleCard",
                    onMouseEnter: this.handleMouseOver,
                    onMouseLeave: this.handleMouseOut,
                    onClick: this.handleClick,
                    onKeyDown: this.handleKeyDown
                }, r), React.createElement(PresTrackedElement, {
                    videoId: t.summary.id,
                    imageKey: t.imageKey
                }, React.createElement("div", {
                    className: "video-artwork",
                    style: h
                }, this.getInnerContent())), u ? React.createElement(TitleCardFocus, {
                    model: t.model
                }) : null, React.createElement(ReactTransitionGroup, null, this.state.hasBob ? React.createElement(BobCard, {
                    model: t.model,
                    parentTitleCard: this,
                    titleArt: t.boxart,
                    onBobOpen: this.onBobOpen,
                    onBobClose: this.onBobClose,
                    onJawOpen: this.onBobOpenJaw,
                    videoId: this.props.videoId
                }) : null)), o, n, s)
            }
        });
    module.exports = TitleCard;
