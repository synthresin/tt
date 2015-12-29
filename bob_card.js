Requireify.register('js/akira/components/title/bobCard.jsx', function(require, requireAsync, module, exports) {


    "use strict";
    var React = require("react"),
        _ = require("lodash"),
        classNames = require("classnames"),
        VideoMeta = require("../title/videoMeta.jsx"),
        MyListButton = require("../title/myListButton.jsx"),
        Thumbs = require("../title/thumbs.jsx"),
        HeroImages = require("../title/heroImages.jsx"),
        PlayButton = require("../controls/playbutton.jsx"),
        Progress = require("../jawBone/progress.jsx"),
        SliderItem = require("../slider/sliderItem.jsx"),
        Link = require("../controls/mainViewLink.jsx"),
        Animation = require("../../../reactMixins/cssAnimation.jsx"),
        AkiraContext = require("../../../reactMixins/akiraContext"),
        Watched = require("../../../reactMixins/video/watched"),
        I18N = require("../../../reactMixins/i18n"),
        Context = require("../../../reactMixins/isomorphicContextWithDeps"),
        JawBoneLink = require("../../../reactMixins/jawBoneLink"),
        EventBus = require("../../../reactMixins/eventBus"),
        RatingsTest = require("../../../reactMixins/ab/ratingsRedesignTest"),
        LolomoConstants = require("../lolomo/lolomoConstants.jsx"),
        AB = require("../../../reactMixins/ab"),
        Position = require("../../../common/position"),
        OptimizationTest = require("../../../utils/ab/optimizationTest"),
        MouseUtils = require("../../../utils/mouseUtils"),
        SVGIcon = require("../../../common/svgIcon.jsx"),
        TextUtils = require("../../../utils/textUtils"),
        SIZE = "_665x375",
        HEIGHT = 470,
        IMAGE_ROTATOR_FIRST_DELAY = 2e3,
        IMAGE_ROTATOR_DURATION = 2e3,
        EXPAND_DURATION = 400,
        BOB_SCALE = 1.82,
        BOB_PRE_EXPAND_SCALE = .54945055,
        LARGE_BOB_SCALE = 2.1,
        LARGE_BOB_PRE_EXPAND_SCALE = .476190476,
        SMALL_BOB_SCALE = 1.65,
        SMALL_BOB_PRE_EXPAND_SCALE = .606060606,
        THUMBS_BOB_SCALE = 1.95,
        THUMBS_BOB_PRE_EXPAND_SCALE = .51282051282051,
        Z_INDEX_DEFAULT = null,
        Z_INDEX_CLOSING = 2,
        Z_INDEX_OPEN = 4,
        MAX_SYNOPSIS_LENGTH = 160,
        BUNDLE = "discovery/akira/Common",
        BobCard = React.createClass({
            displayName: "BobCard",
            mixins: [JawBoneLink, Animation, Watched, I18N, Context, AkiraContext, RatingsTest, AB],
            statics: {
                getPaths: function(e, t, i) {
                    return i || (i = {}), [
                        ["summary"],
                        ["title"],
                        ["availability"],
                        ["synopsis"],
                        ["queue"],
                        ["episodeCount"],
                        ["info"]
                    ].concat([
                        ["current", ["summary", "runtime", "bookmarkPosition", "creditsOffset"]]
                    ]).concat(VideoMeta.getPaths(e)).concat(HeroImages.getPaths(e, null, {
                        isShow: i.isShow,
                        height: HEIGHT,
                        size: SIZE
                    })).concat(Watched.getPaths()).concat(PlayButton.getPaths())
                },
                __meta__: {
                    strings: [{
                        bundle: BUNDLE,
                        ids: ["label.resume", "label.next.up", "watched.title.bob"]
                    }]
                }
            },
            getInitialState: function() {
                return {
                    disablePlayButton: !1
                }
            },
            componentDidMount: function() {
                this.openBOB()
            },
            openBOB: function() {
                var e = this,
                    t = this.getData(),
                    i = this.getFeatureSet(t),
                    a = EXPAND_DURATION,
                    s = BOB_SCALE;
                this.preExpandScale = BOB_PRE_EXPAND_SCALE, OptimizationTest.hasSmallTitleCard(this.context) && (s = LARGE_BOB_SCALE, this.preExpandScale = LARGE_BOB_PRE_EXPAND_SCALE), OptimizationTest.hasLargeTitleCard(this.context) && (s = SMALL_BOB_SCALE, this.preExpandScale = SMALL_BOB_PRE_EXPAND_SCALE), this.hasThumbInput() && (s = THUMBS_BOB_SCALE, this.preExpandScale = THUMBS_BOB_PRE_EXPAND_SCALE), OptimizationTest.hasNoGrowBOB(this.context) && (s = 1, this.preExpandScale = .9999);
                var n = 100 * s,
                    o = (n - 100) / -2;
                this.setParentZIndex(Z_INDEX_OPEN), OptimizationTest.hasNoGrowBOB(this.context) ? this.animate({
                    before: {
                        scale: this.preExpandScale,
                        opacity: 0,
                        visibility: "visible",
                        width: n + "%",
                        height: n + "%",
                        top: o + "%",
                        left: o + "%"
                    },
                    scale: 1,
                    opacity: 1,
                    easing: "cubic-bezier(0.5, 0, 0.1, 1)",
                    duration: a
                }) : (this.setState({
                    disablePlayButton: !0
                }), setTimeout(function() {
                    e.isMounted() && e.setState({
                        disablePlayButton: !1
                    })
                }, a + 250), this.animate({
                    before: {
                        scale: this.preExpandScale,
                        visibility: "visible",
                        width: n + "%",
                        height: n + "%",
                        top: o + "%",
                        left: o + "%"
                    },
                    scale: 1,
                    easing: "cubic-bezier(0.5, 0, 0.1, 1)",
                    duration: a
                })), this.animate({
                    target: "title-art",
                    opacity: 0,
                    duration: a,
                    easing: "linear",
                    after: {
                        display: "none"
                    }
                }), "none" !== i.jawButtonPosition && this.animate({
                    target: "jawbone-chevron",
                    before: {
                        translateY: "-10px",
                        opacity: 0
                    },
                    translateY: "0px",
                    opacity: 1,
                    duration: a,
                    delay: 200,
                    after: {
                        reset: !0
                    }
                }), this.pushSiblings(s)
            },
            pushSiblings: function(e) {
                var t = Position.getRect(React.findDOMNode(this.props.parentTitleCard)),
                    i = t.width * e,
                    a = (i - t.width) / 2,
                    s = 1;
                this.props.onBobOpen(a, s, EXPAND_DURATION)
            },
            getParentSliderItem: function() {
                for (var e = React.findDOMNode(this); e = e.parentNode;)
                    if (e.classList && e.classList.contains(SliderItem.className)) return e;
                return null
            },
            setParentZIndex: function(e) {
                var t = this.getParentSliderItem();
                t && this.css({
                    target: t,
                    zIndex: e
                })
            },
            componentWillLeave: function(e) {
                var t = EXPAND_DURATION;
                OptimizationTest.hasNoGrowBOB(this.context) && (t /= 2), this.animate({
                    scale: this.preExpandScale,
                    duration: t,
                    easing: "cubic-bezier(0.5, 0, 0.1, 1)"
                }), this.animate({
                    target: "title-art",
                    before: {
                        display: "block"
                    },
                    opacity: 1,
                    duration: t
                });
                var i = this;
                this.setParentZIndex(Z_INDEX_CLOSING), setTimeout(function() {
                    i.isMounted() && (i.setParentZIndex(Z_INDEX_DEFAULT), e())
                }, t), this.props.onBobClose(t)
            },
            onClickPlayHitZone: function(e) {
                this.isVideoPlayable() && React.findDOMNode(this.refs.playButton).click()
            },
            onClickJawHitZone: function(e) {
                var t, i;
                MouseUtils.modifiedClick(e) || (t = (this.props.model.getValueSync(["userRating"]) || {}).matchScore, i = (this.props.model.getValueSync(["userRating"]) || {}).tooNewForMatchScore, e && e.preventDefault(), EventBus.emit("jawbone:open", _.assign({}, this.context, this.props, {
                    trigger: "bob"
                }, void 0 !== t ? {
                    matchScore: t
                } : {}, void 0 !== i ? {
                    tooNewForMatchScore: i
                } : {})), this.props.onJawOpen && this.props.onJawOpen(), this.openJawBoneAtRankNum(this.context.rankNum, this.props.videoId))
            },
            getFeatureSet: function(e) {
                var t = {
                    meta: !0,
                    synopsis: OptimizationTest.hasBOBSynopsis(this.context, !0),
                    queue: OptimizationTest.hasBOBMyListButton(this.context, !!e.queue),
                    watchedTitle: !1,
                    progress: !1,
                    progressSummary: !1,
                    playPosition: OptimizationTest.getPlayButtonLocation(this.context, "top"),
                    jawButtonPosition: "bottom",
                    jawHitZone: OptimizationTest.getBOBJawHitzoneSize(this.context, "half"),
                    state: "play",
                    thumbs: !1
                };
                return "only-info" === t.jawHitZone || "only-button" === t.jawHitZone ? t.jawButtonPosition = "right" : "none" === t.jawHitZone && (t.jawButtonPosition = "none"), this.isInResumeState() ? (t.state = "resume", t.watchedTitle = !0, t.progress = !0, t.progressSummary = !0) : this.isInNextUpState() && (t.state = "nextup", t.watchedTitle = !0), "under" === OptimizationTest.getBookmarkLocation(this.context) && (t.progress = !1, t.progressSummary = !1), "play" !== t.state && (t.synopsis = !1, t.meta = !1), this.context.listContext === LolomoConstants.LIST_CONTEXTS.CONTINUE_WATCHING && (t.synopsis = !1), t.synopsis || "top" !== t.playPosition || (t.playPosition = "lowerTop"), this.hasThumbInput() && (t.queue = !1, t.progress || (t.thumbs = !0)), e.summary.isOriginal && !this.isVideoPlayable() && (t.meta = !1, t.queue = !1), t
            },
            getData: function() {
                var e = this.props.model;
                return {
                    title: e.getValueSync(["title"]),
                    summary: e.getValueSync(["summary"]),
                    heroImages: e.getValueSync(["heroImages"]),
                    queue: e.getValueSync(["queue"]),
                    bookmarkPosition: e.getValueSync(["bookmarkPosition"]),
                    episodeRuntime: e.getValueSync(["current", "runtime"]),
                    episodeBookmark: e.getValueSync(["current", "bookmarkPosition"]),
                    isStandalone: e.getValueSync(["episodeCount"]) <= 0,
                    info: e.getValueSync(["info"]),
                    synopsis: TextUtils.ellipsize(e.getValueSync(["synopsis"]), MAX_SYNOPSIS_LENGTH)
                }
            },
            isVideoPlayable: function() {
                var e = this.props.model.getValueSync(["availability"]),
                    t = e && e.isPlayable;
                return !e || t
            },
            getResumeBobTitle: function() {
                var e = this.getResumeParams();
                return this.getString(BUNDLE, "watched.title.bob", e)
            },
            renderHeroImages: function() {
                var e = this.props.model,
                    t = this.getData(),
                    i = OptimizationTest.getSliderShiftSpeedModifier(this.context),
                    a = IMAGE_ROTATOR_DURATION,
                    s = IMAGE_ROTATOR_FIRST_DELAY;
                return i && (a *= i, s *= i), React.createElement(HeroImages, {
                    model: e,
                    className: "bob-background",
                    auto: !0,
                    firstDelay: s,
                    duration: a,
                    isStandalone: t.isStandalone,
                    preloadImage: this.props.titleArt,
                    bookmarkPosition: t.bookmarkPosition,
                    height: HEIGHT,
                    size: SIZE,
                    watched: this.hasBeenWatched()
                })
            },
            renderBobInfo: function() {
                return React.createElement("div", {
                    className: "bob-info"
                }, React.createElement("div", {
                    className: "bob-info-main"
                }, this.renderBobFirstContent(), this.renderBobText(), this.renderBobLastContent()), this.renderBobBottomContent())
            },
            renderBobFirstContent: function() {
                var e = this.getData(),
                    t = this.getFeatureSet(e),
                    i = [];
                return "left" === t.playPosition && i.push(this.renderPlayButton()), 0 === i.length ? null : React.createElement("div", {
                    className: "bob-first-content"
                }, i)
            },
            renderBobText: function() {
                var e = this.props.model,
                    t = this.getData(),
                    i = this.getFeatureSet(t),
                    a = i.watchedTitle && !t.isStandalone ? this.getResumeBobTitle() : "";
                return React.createElement("div", {
                    className: "bob-text"
                }, React.createElement("div", {
                    className: classNames({
                        "bob-title": !0
                    })
                }, t.title), i.watchedTitle ? React.createElement("div", {
                    className: "watched-title",
                    dangerouslySetInnerHTML: {
                        __html: a
                    }
                }) : null, i.meta ? React.createElement(VideoMeta, {
                    model: e
                }) : null, i.synopsis ? React.createElement("div", {
                    className: "synopsis"
                }, t.synopsis) : null, i.progress ? React.createElement(Progress, {
                    runtime: t.episodeRuntime,
                    bookmarkPosition: t.episodeBookmark,
                    current: !0,
                    showSummary: i.progressSummary
                }) : null)
            },
            renderBobLastContent: function() {
                var e, t = this.props.model,
                    i = this.getData(),
                    a = this.getFeatureSet(i),
                    s = i.queue && i.queue.inQueue,
                    n = {
                        "bob-jawbone-right-chevron": !0
                    },
                    o = [];
                return "right" === a.jawButtonPosition ? (e = React.createElement("div", {
                    className: classNames(n),
                    ref: "jawbone-chevron",
                    key: "jawbone-button"
                }, React.createElement(SVGIcon, {
                    name: "chevron-down"
                })), "only-button" === a.jawHitZone && (e = this.renderJawboneLink(e)), o.push(e)) : a.thumbs ? o.push(React.createElement("div", {
                    className: "thumbs-bob-wrapper",
                    key: "thumbs"
                }, React.createElement(Thumbs, {
                    model: t,
                    videoId: i.summary.id,
                    extraClass: "thumbs-animated"
                }))) : a.queue && o.push(React.createElement("div", {
                    className: "mylist-wrapper",
                    key: "mylist"
                }, React.createElement(MyListButton, {
                    model: t,
                    videoId: i.summary.id,
                    inQueue: s,
                    showToolTip: !0
                }))), 0 === o.length ? null : React.createElement("div", {
                    className: "bob-last-content"
                }, o)
            },
            renderBobBottomContent: function() {
                var e = this.getData(),
                    t = this.getFeatureSet(e),
                    i = {
                        "bob-jawbone-bottom-chevron": !0
                    };
                return React.createElement("div", {
                    className: "bob-info-bottom"
                }, "bottom" === t.jawButtonPosition ? React.createElement("div", {
                    className: classNames(i),
                    ref: "jawbone-chevron"
                }, React.createElement(SVGIcon, {
                    name: "chevron-down"
                })) : null)
            },
            renderPlayButton: function() {
                var e = this.props.model,
                    t = this.getData(),
                    i = this.getFeatureSet(t),
                    a = {
                        "bob-play": !0,
                        "play-hidden": "none" === i.playPosition
                    };
                return a["bob-play-" + i.playPosition] = !0, this.isVideoPlayable() ? React.createElement(PlayButton, {
                    ref: "playButton",
                    model: e,
                    className: classNames(a),
                    disableClick: this.state.disablePlayButton,
                    tabIndex: 0,
                    key: "playbutton"
                }) : null
            },
            renderJawboneLink: function(e, t) {
                var i = this.getData(),
                    a = this.getFeatureSet(i),
                    s = _.assign({
                        "bob-jaw-hitzone": !0
                    }, t);
                return s["bob-jaw-hitzone-" + a.jawHitZone] = !0, React.createElement(Link, {
                    type: "title",
                    key: "jawbone-link",
                    params: {
                        id: i.summary.id
                    },
                    preventClick: !0,
                    className: classNames(s),
                    onClick: this.onClickJawHitZone
                }, e)
            },
            render: function() {
                var e = this.getData(),
                    t = this.getFeatureSet(e),
                    i = this.renderPlayButton(),
                    a = this.renderBobInfo(),
                    s = {
                        "bob-card": !0
                    },
                    n = {
                        "bob-overlay": !0
                    },
                    o = React.createElement("img", {
                        src: this.props.titleArt,
                        ref: "title-art",
                        className: "bob-title-art"
                    });
                return "only-info" === t.jawHitZone && (a = this.renderJawboneLink(a)), OptimizationTest.hasNoGrowBOB(this.context) && (n["no-grow"] = !0, o = React.createElement("div", {
                    className: "video-artwork bob-title-art",
                    ref: "title-art",
                    style: {
                        backgroundImage: "url(" + this.props.titleArt + ")"
                    }
                })), t.thumbs ? s["has-thumbs"] = !0 : "right" === t.jawButtonPosition && (s["has-right-jaw-button"] = !0), "left" === t.playPosition && (s["has-left-content"] = !0), React.createElement("div", {
                    className: classNames(s),
                    key: "bob-" + e.summary.id
                }, this.renderHeroImages(), React.createElement("div", {
                    className: "bob-outline"
                }), React.createElement("div", {
                    className: classNames(n),
                    ref: "overlay"
                }, React.createElement("div", {
                    className: classNames({
                        "bob-play-hitzone": !0
                    }),
                    onClick: this.onClickPlayHitZone
                }, "lowerTop" === t.playPosition || "top" === t.playPosition ? i : null), "half" === t.jawHitZone ? this.renderJawboneLink(null) : null, a), React.createElement("div", {
                    style: {
                        display: "none"
                    },
                    className: "hiddenActionItems"
                }, "none" === t.playPosition ? i : null), o)
            }
        });
    module.exports = BobCard;


});
