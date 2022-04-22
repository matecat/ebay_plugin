import {sprintf} from 'sprintf-js'
import moment from 'moment'
import ModalsActions from '../../../../../../public/js/cat_source/es6/actions/ModalsActions'

if (ReviewImproved.enabled())
  (function ($, ReviewImproved) {
    var prev_getStatusForAutoSave = UI.getStatusForAutoSave
    var originalRegisterFooterTabs = UI.registerFooterTabs
    /**
     * Split segment feature is not compatible with ReviewImproved.
     */
    window.config.splitSegmentEnabled = false

    $.extend(UI, {
      mountPanelComponent: function () {
        UI.issuesMountPoint = $('[data-mount=review-side-panel]')[0]
        ReactDOM.render(
          React.createElement(ReviewSidePanel, {
            closePanel: this.closeIssuesPanel,
            reviewType: Review.type,
            isReview: config.isReview,
          }),
          UI.issuesMountPoint,
        )
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
      getStatusForAutoSave: function (segment) {
        var status = prev_getStatusForAutoSave(segment)

        if (segment.hasClass('status-fixed')) {
          status = 'fixed'
        } else if (segment.hasClass('status-rebutted')) {
          status = 'rebutted'
        }
        return status
      },

      getSegmentVersionsIssuesHandler: function (e, data) {
        var versions_path = sprintf(
          '/api/v2/jobs/%s/%s/segments/%s/translation-versions',
          config.id_job,
          config.password,
          data.segmentId,
        )

        $.getJSON(versions_path).done(UI.updateLocalTranslationVersions)
      },
      updateLocalTranslationVersions: function (data) {
        $(data.versions).each(function () {
          MateCat.db.upsert('segment_versions', 'id', this)
        })
      },
      submitComment: function (id_segment, id_issue, data) {
        return ReviewImproved.submitComment(id_segment, id_issue, data)
      },
      openIssuesPanel: function (data, openSegment) {
        $('body').addClass('review-improved-opened')
        CatToolActions.closeSearch()

        $('body').addClass('side-tools-opened review-side-panel-opened')
        window.dispatchEvent(new Event('resize'))
        if (data && openSegment) {
          SegmentActions.openSegment(data.sid)
          window.setTimeout(
            function (data) {
              SegmentActions.scrollToSegment(data.sid)
            },
            500,
            data,
          )
        }
        return true
      },
      closeIssuesPanel: function () {
        SegmentActions.closeIssuesPanel()
        $('body').removeClass(
          'side-tools-opened review-side-panel-opened review-improved-opened',
        )
        if (UI.currentSegmentId) {
          setTimeout(function () {
            SegmentActions.scrollToSegment(UI.currentSegmentId)
          }, 100)
        }
        window.dispatchEvent(new Event('resize'))
      },

      deleteIssue: function (issue, sid) {
        var message = ''
        if (issue.target_text) {
          message = sprintf(
            "You are about to delete the issue on string <span style='font-style: italic;'>'%s'</span> " +
              'posted on %s.',
            issue.target_text,
            moment(issue.created_at).format('lll'),
          )
        } else {
          message = sprintf(
            'You are about to delete the issue posted on %s.',
            moment(issue.created_at).format('lll'),
          )
        }

        ModalsActions.showModalComponent(ConfirmMessageModal, {
          successText: 'Yes delete this issue',
          successCallback: () => UI.deleteTranslationIssue(sid, issue.id),
          text: message,
          cancelText: 'Cancel',
        })
      },
      showFixedAndRebuttedButtons(status) {
        status = status.toLowerCase()
        return status == 'rejected' || status == 'fixed' || status == 'rebutted'
      },
      registerFooterTabs: function () {
        originalRegisterFooterTabs.apply(this)
        SegmentActions.registerTab('messages', true, true)
      },
    })

    $(document).ready(function () {
      UI.mountPanelComponent()
    })
  })(jQuery, ReviewImproved)
