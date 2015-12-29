   "use strict";

    function appliesToListContext(e) {
        return !AB["in"](e, TEST_ID, [11, 12]) || AB["in"](e, TEST_ID, [11, 12]) && e.listContext === LolomoConstants.LIST_CONTEXTS.CONTINUE_WATCHING
    }
    var AB = require("./ab"),
        LolomoConstants = require("../../akira/components/lolomo/lolomoConstants.jsx"),
        TEST_ID = 6586,
        akiraOptimizationHelpers = {
            getPlayButtonLocation: function(e, o) {
                return AB.resolveABValue(e, TEST_ID, "playButtonLocation", o)
            },
            hasBOBSynopsis: function(e, o) {
                var t = !AB.resolveABValue(e, TEST_ID, "noSynopsis", !o);
                return appliesToListContext(e) ? t : o
            },
            hasBOBMyListButton: function(e, o) {
                var t = AB.resolveABValue(e, TEST_ID, "noMyListButton");
                return appliesToListContext(e) ? !t : o
            },
            getBOBJawHitzoneSize: function(e, o) {
                var t = AB.resolveABValue(e, TEST_ID, "jawHitZoneSize", o);
                return appliesToListContext(e) ? t : o
            },
            getColumnsInRowModifier: function(e) {
                var o = AB.resolveABValue(e, TEST_ID, "columnsInRowModifier", 0);
                return appliesToListContext(e) ? o : 0
            },
            getJawPlayButtonLocation: function(e, o) {
                return AB.resolveABValue(e, TEST_ID, "jawPlayButtonLocation", o)
            },
            getBillboardPlayButtonLocation: function(e, o) {
                return AB.resolveABValue(e, TEST_ID, "billboardPlayButtonLocation", o)
            },
            hasBackgroundImageStartsPlay: function(e) {
                return AB.resolveABValue(e, TEST_ID, "backgroundImageStartsPlay")
            },
            getJawMenuLocation: function(e, o) {
                return AB.resolveABValue(e, TEST_ID, "jawBoneMenuLocation", o)
            },
            getJawOverviewTextSize: function(e, o) {
                return AB.resolveABValue(e, TEST_ID, "jawOverviewText", o)
            },
            getJawOverviewColorModifier: function(e, o) {
                return AB.resolveABValue(e, TEST_ID, "jawOverviewColorModifier", o)
            },
            getMaxTitlesInRow: function(e, o) {
                return AB.resolveABValue(e, TEST_ID, "maxTitlesInRow", o)
            },
            hasLargeTitleCard: function(e) {
                var o = AB.resolveABValue(e, TEST_ID, "hasLargeTitleCard");
                return appliesToListContext(e) ? o : !1
            },
            hasSmallTitleCard: function(e) {
                return AB.resolveABValue(e, TEST_ID, "hasSmallTitleCard")
            },
            getBookmarkLocation: function(e) {
                var o = AB.resolveABValue(e, TEST_ID, "bookmarkLocation");
                return appliesToListContext(e) ? o : null
            },
            hasNoGrowBOB: function(e) {
                var o = AB.resolveABValue(e, TEST_ID, "noGrowBob");
                return appliesToListContext(e) ? o : !1
            },
            getSliderShiftSpeedModifier: function(e, o) {
                return AB.resolveABValue(e, TEST_ID, "slideShowSpeedModifier", o)
            },
            getBobOpenTrigger: function(e, o) {
                return AB.resolveABValue(e, TEST_ID, "bobOpenTrigger", o)
            }
        };
    module.exports = akiraOptimizationHelpers;


});
