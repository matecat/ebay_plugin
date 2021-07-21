// common events
//
if ( ReviewImproved.enabled() ) {

    $(document).on('segment-filter:filter-data:load', function() {
        UI.closeIssuesPanel();
    });

    var updateLocalTranslationVersions = function( data ) {
        $(data.versions).each(function() {
            MateCat.db.upsert('segment_versions', 'id', this ) ;
        });
    };

    $(document).on('click', function( e ) {
        if ($(e.target).closest('body') == null ) {
            // it's a detatched element, likely the APPROVE button.
            return ;
        }
        if ($(e.target).closest('header, .modal, section, #review-side-panel') == null) {
            UI.closeIssuesPanel( );
        }
    });

    $(document).on('translation:change', function(e, data) {
        var versions_path =  sprintf(
            '/api/v2/jobs/%s/%s/segments/%s/translation-versions',
            config.id_job, config.password, data.sid
        );

        $.getJSON( versions_path ).done( updateLocalTranslationVersions );
    });

    $(document).on('sidepanel:close', function() {
        UI.closeIssuesPanel();
    });

    $( document ).on( 'keydown', function ( e ) {
        var esc = '27' ;
        if ( e.which == esc ) {
            if (!$('.modal').is(':visible')) {
                UI.closeIssuesPanel();
            }
        }
    });

    $(window).on('segmentOpened', UI.getSegmentVersionsIssuesHandler);

}
