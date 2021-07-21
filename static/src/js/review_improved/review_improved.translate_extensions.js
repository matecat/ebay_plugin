if ( ReviewImproved.enabled() && !config.isReview)
(function($) {


    var originalBindShortcuts = UI.bindShortcuts ;

    var clickOnRebutted = function(sid) {
        var segment = SegmentStore.getSegmentByIdToJS(sid);
        SegmentActions.removeClassToSegment(sid, 'modified');
        UI.changeStatus(segment, 'rebutted');
        UI.gotoNextSegment();
    };

    var clickOnFixed = function(sid) {
        var el = UI.getSegmentById( sid );
        if ( el.find('.button-fixed').attr('disabled') == 'disabled' ) {
            return ;
        }
        var segment = SegmentStore.getSegmentByIdToJS(sid);
        SegmentActions.removeClassToSegment(sid, 'modified');
        UI.changeStatus(segment, 'fixed');
        UI.gotoNextSegment(); // NOT ideal behaviour, would be better to have a callback chain of sort.

    };
    var handleKeyPressOnMainButton = function(e) {
        if ( $('.editor .buttons .button-rebutted').length ) {
            clickOnRebutted(UI.currentSegmentId);
        }
        else if ( $('.editor .buttons .button-fixed').length ) {
            clickOnFixed(UI.currentSegmentId);
        }
    };

    $.extend(ReviewImproved, {
        clickOnRebutted : clickOnRebutted,
        clickOnFixed : clickOnFixed,
    });

    $.extend(UI, {

        bindShortcuts: function() {
            originalBindShortcuts();
            $("body").on('keydown.shortcuts', null, Shortcuts.cattol.events.translate.keystrokes.standard, handleKeyPressOnMainButton );
            $("body").on('keydown.shortcuts', null, Shortcuts.cattol.events.translate.keystrokes.mac, handleKeyPressOnMainButton );
        }
    })

})(jQuery);
