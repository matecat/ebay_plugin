if ( ReviewImproved.enabled() && !config.isReview)
(function($, root, undefined) {

    var unmountReactButtons = function( segment_el ) {
        console.log( 'unmountReactButtons', segment_el );
        var mountpoint = segment_el.find('[data-mount="main-buttons"]')[0];
        ReactDOM.unmountComponentAtNode( mountpoint );
    };

    // var original_createButtons = UI.createButtons ;

    var originalBindShortcuts = UI.bindShortcuts ;

    var clickOnRebutted = function(sid) {
        var el = UI.getSegmentById(sid);
        SegmentActions.removeClassToSegment(sid, 'modified');
        UI.changeStatus(el, 'rebutted');
        UI.gotoNextSegment();
    };

    var clickOnFixed = function(sid) {
        var el = UI.getSegmentById( sid );
        if ( el.find('.button-fixed').attr('disabled') == 'disabled' ) {
            return ;
        }

        SegmentActions.removeClassToSegment(sid, 'modified');
        el.data('modified',  false);
        UI.changeStatus(el, 'fixed');
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

})(jQuery, window);
