if ( ReviewImproved.enabled() )
    (function($, ReviewImproved) {

    var prev_getStatusForAutoSave = UI.getStatusForAutoSave ;
    /**
     * Split segment feature is not compatible with ReviewImproved.
     */
    window.config.splitSegmentEnabled = false;

    $.extend(UI, {

        mountPanelComponent : function() {
            UI.issuesMountPoint =   $('[data-mount=review-side-panel]')[0];
            ReactDOM.render(
                React.createElement( ReviewSidePanel, {
                    closePanel: this.closeIssuesPanel,
                    reviewType: Review.type,
                    isReview: config.isReview
                } ),
                UI.issuesMountPoint );
        },
        /**
         * getStatusForAutoSave
         *
         * XXX: Overriding this here does not make sens anymore when fixed and
         * rebutted states will enter MateCat's core.
         *
         * @param segment
         * @returns {*}
         */
        getStatusForAutoSave : function( segment ) {
            var status = prev_getStatusForAutoSave( segment );

            if (segment.hasClass('status-fixed')) {
                status = 'fixed';
            }
            else if (segment.hasClass('status-rebutted')) {
                status = 'rebutted' ;
            }
            return status;
        },

        getSegmentVersionsIssuesHandler: function (sid) {
            // TODO Uniform behavior of ReviewExtended and ReviewImproved
            var segment = SegmentStore.getSegmentByIdToJS(sid);
            SegmentActions.addTranslationIssuesToSegment(segment.id_file, segment.original_sid,  []);
        },
        submitComment : function(id_segment, id_issue, data) {
            return ReviewImproved.submitComment(id_segment, id_issue, data)
        },
        openIssuesPanel : function(data, openSegment) {
            $('body').addClass('review-improved-opened');
            hackIntercomButton( true );
            SearchUtils.closeSearch();

            $('body').addClass('side-tools-opened review-side-panel-opened');
            window.dispatchEvent(new Event('resize'));
            if (data && openSegment) {
                SegmentActions.openSegment(data.sid);
                window.setTimeout( function ( data ) {
                    UI.scrollSegment( data.sid );
                }, 500, data );
            }
            return true;
        },

        closeIssuesPanel : function() {

            hackIntercomButton( false );
            SegmentActions.closeIssuesPanel();
            $('body').removeClass('side-tools-opened review-side-panel-opened review-improved-opened');
            if ( UI.currentSegmentId ) {
                setTimeout( function() {
                    UI.scrollSegment( UI.currentSegmentId );
                }, 100 );
            }
            window.dispatchEvent(new Event('resize'));
        },

        deleteIssue : function( issue, sid, dontShowMessage) {
            var message = '';
            if ( issue.target_text ) {
                message = sprintf(
                    "You are about to delete the issue on string <span style='font-style: italic;'>'%s'</span> " +
                    "posted on %s." ,
                    issue.target_text,
                    moment( issue.created_at ).format('lll')
                );
            } else {
                message = sprintf(
                    "You are about to delete the issue posted on %s." ,
                    moment( issue.created_at ).format('lll')
                );
            }
            if ( !dontShowMessage) {
                APP.confirm({
                    name : 'Confirm issue deletion',
                    callback : 'deleteTranslationIssue',
                    msg: message,
                    okTxt: 'Yes delete this issue',
                    context: JSON.stringify({
                        id_segment : sid,
                        id_issue : issue.id
                    })
                });
            } else {
                UI.deleteTranslationIssue(JSON.stringify({
                    id_segment : sid,
                    id_issue : issue.id
                }));
            }
        },
        setRevision: function( data ){
            APP.doRequest({
                data: data,
                error: function() {
                    UI.failedConnection( data, 'setRevision' );
                },
                success: function(d) {
                    window.quality_report_btn_component.setState({
                        vote: d.data.overall_quality_class
                    });
                }
            });
        },
        /**
         *
         * @param d Data response from the SetCurrentSegment request
         * @param id_segment
         */
        addOriginalTranslation: function (d, id_segment) {
            if (d.original !== '') {
                setTimeout(function (  ) {
                    SegmentActions.addOriginalTranslation(id_segment, UI.getSegmentFileId($('#segment-' + id_segment)), d.original);
                });
            }
        },
        showFixedAndRebuttedButtons ( status ) {
            status = status.toLowerCase();
            return status == 'rejected' || status == 'fixed' || status == 'rebutted' ;
        }
    });

    $(document).ready(function() {
        UI.mountPanelComponent();
    });

})(jQuery, ReviewImproved);

