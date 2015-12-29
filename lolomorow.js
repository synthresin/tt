LolomoRow = React.createClass({
            displayName: "LolomoRow",
            mixins: [FalkorFetch, IsoContext, Animation, Scheduler, FalkorPureRender, AkiraContext],
            statics: {
                getPaths: getPaths,
                defaultStrategy: defaultStrategy,
                prefetchStrategies: prefetchStrategies
            },
            getInitialState: function() {
                return {
                    fullDataLoaded: !1
                }
            },
            childContextTypes: {
                trackId: React.PropTypes.number,
                jawBoneTrackId: React.PropTypes.number,
                jawBoneEpisodeTrackId: React.PropTypes.number,
                jawBoneTrailerTrackId: React.PropTypes.number,
                listContext: React.PropTypes.string
            },
            getChildContext: function() {
                var e = this.getTrackIds();
                return {
                    trackId: e.trackId,
                    jawBoneTrackId: e.trackId_jaw,
                    jawBoneEpisodeTrackId: e.trackId_jawEpisode,
                    jawBoneTrailerTrackId: e.trackId_jawTrailer,
                    listContext: this.props.listContext
                }
            },
            componentDidMount: function() {
                this.setCustomModelChangeDetector(new LolomoRowChangeDetector(this.props.model))
            },
            getId: function() {
                var e = this.props.model,
                    t = e.getValueSync(["genreId"]),
                    o = e.getValueSync(["videoId"]);
                return t ? t : o ? o : void 0
            },
            getWatchedEvidenceModel: function() {
                var e, t = this.props.model,
                    o = t.bind(["watchedEvidence"]),
                    i = o.bind([0]);
                return e = o.getBoundValue() && i.getBoundValue() && this.props.listContext !== LolomoConstants.LIST_CONTEXTS.SIMILIARS, e && o
            },
            hasWatchedEvidence: function() {
                return !!this.getWatchedEvidenceModel()
            },
            getWatchedEvidence: function() {
                var e = this.getWatchedEvidenceModel();
                return e ? React.createElement(WatchedEvidence, {
                    key: "watchedEvidence",
                    model: e,
                    pqls: WatchedEvidence.getPaths(),
                    rankNum: 0
                }) : null
            },
            getTrackIds: function() {
                var e = this.props.model,
                    t = e.getValueSync(["trackIds"]);
                return t || {}
            },
            getTitles: function() {
                for (var e, t, o, i, r, a = this.props.model, s = a.getValueSync(["length"]), n = {}, l = [], d = RichOriginalsRowTest.isPanelsOriginalsRow(this.context, this.props.listContext), c = d ? TitleCardOriginalsPanel : TitleCard, h = 0; s > h; h++)
                    if (e = a.bind([h]), t = e.getValueSync(["summary"]), t && t.id) {
                        o = t ? t.id : "ph" + h, i = t && t.id, r = "title_" + o + "_" + this.props.rowNum + "_" + h, n[i] = h;
                        try {
                            l.push(React.createElement(c, {
                                key: r,
                                model: e,
                                showVideoEvidence: this.props.showVideoEvidence,
                                rowNum: this.props.rowNum,
                                rankNum: h,
                                videoId: i
                            }))
                        } catch (u) {}
                    }
                return {
                    titleList: l,
                    orderedItemList: n
                }
            },
            getRowItems: function() {
                var e, t, o = [];
                return e = this.getWatchedEvidence(), e && o.push(e), t = this.getTitles(), {
                    rowItems: o.concat(t.titleList).slice(0, MAX_ROW_TITLES),
                    orderedItemList: t.orderedItemList || {}
                }
            },
            getTotalItemsInRow: function() {
                var e = this.props.model,
                    t = e.getValueSync(["length"]);
                return this.hasWatchedEvidence() && t++, t > MAX_ROW_TITLES && (t = MAX_ROW_TITLES), t
            },
            handleSliderMove: function() {
                var e, t = this;
                this.state.fullDataLoaded || (t.state.fullDataLoaded = !0, this.queue(function() {
                    e = nfProps.get("netflix.ui.akira.prefetch.rowSlide"), t.fetchData(t.props.model, getPaths(t.getContext(), e))
                }))
            },
            showJawBone: function() {
                return this.props.showJawBone
            },
            render: function() {
                var e = React.addons.classSet,
                    t = this.props.model,
                    o = {
                        lolomoRow: !0,
                        lolomoRow_title_card: !0,
                        jawBoneOpen: this.props.showJawBone,
                        "small-title-cards": OptimizationTest.hasSmallTitleCard(this.context),
                        "large-title-cards": OptimizationTest.hasLargeTitleCard(_.assign({}, this.context, this.props)),
                        "originals-panels-row": RichOriginalsRowTest.isPanelsOriginalsRow(this.context, this.props.listContext)
                    },
                    i = this.props.jawBoneRankNum,
                    r = this.props.listContext === LolomoConstants.LIST_CONTEXTS.MY_LIST,
                    a = this.getRowItems() || {},
                    s = a.rowItems || [],
                    n = r && a.orderedItemList,
                    l = this.state.fullDataLoaded ? s.length : this.getTotalItemsInRow();
                return 0 === l ? null : React.createElement("div", {
                    key: this.props.listContext + this.props.rowNum,
                    className: e(o)
                }, this.props.hideRowHeader ? null : React.createElement(RowHeader, {
                    id: this.getId(),
                    title: this.props.title ? this.props.title : t.getValueSync(["displayName"])
                }), React.createElement(Row, {
                    model: t,
                    pqls: this.props.pqls,
                    totalItems: l,
                    rowNum: this.props.rowNum,
                    jawBoneRankNum: this.props.jawBoneRankNum,
                    showJawBone: this.props.showJawBone,
                    handleSliderMove: this.handleSliderMove,
                    jawBoneModelIndex: i,
                    columnsInRow: this.context.columnsInRow,
                    enablePaginationIndicator: !0,
                    isMyListRow: r,
                    orderedItemList: r ? n : null
                }, s))
            }
        });
    module.exports = LolomoRow;


});
