import {sprintf} from 'sprintf-js'

if (ReviewImproved.enabled() && config.isReview) {
  ;(function ($) {
    var originalBindShortcuts = UI.bindShortcuts

    var rejectKeyDownEvent = function (e) {
      e.preventDefault()

      if ($('.button-reject:visible').length) {
        UI.rejectAndGoToNext()
      }
    }

    $.extend(UI, {
      alertNotTranslatedMessage:
        'This segment is not translated yet.<br /> Only translated or post-edited segments can be revised. ' +
        ' <br />If needed, you can force the status by clicking on the coloured bar on the right of the segment ',

      /**
       * translationIsToSave
       *
       * only check if translation is queued
       */
      translationIsToSave: function (segment) {
        var alreadySet = UI.alreadyInSetTranslationTail(segment.id)
        return !alreadySet
      },
      deleteTranslationIssue: function (id_segment, id_issue) {
        var issue_path = sprintf(
          '/api/v2/jobs/%s/%s/segments/%s/translation-issues/%s',
          config.id_job,
          config.review_password,
          id_segment,
          id_issue,
        )

        $.ajax({
          url: issue_path,
          type: 'DELETE',
        }).done(function (data) {
          var record = MateCat.db.segment_translation_issues.by(
            'id',
            parseInt(id_issue),
          )
          MateCat.db.segment_translation_issues.remove(record)
          ReviewImproved.reloadQualityReport()
          CatToolActions.reloadQualityReport()
        })
      },
      // createButtons: function(segment) {
      //     ReviewImproved.renderButtons();
      //     UI.currentSegment.trigger('buttonsCreation');
      //
      // },
      targetContainerSelector: function () {
        return '.errorTaggingArea'
      },

      /**
       * Never ask for propagation when in revise page
       * @returns {boolean}
       */
      shouldSegmentAutoPropagate: function () {
        return false
      },
      rejectAndGoToNext: function () {
        UI.setTranslation(
          {
            id_segment: UI.currentSegmentId,
            status: 'rejected',
            caller: false,
            byStatus: false,
            propagate: false,
          },
          UI.gotoNextSegment,
        )
      },

      bindShortcuts: function () {
        originalBindShortcuts()

        $('body').on(
          'keydown.shortcuts',
          null,
          'ctrl+shift+down',
          rejectKeyDownEvent,
        )
        $('body').on(
          'keydown.shortcuts',
          null,
          'meta+shift+down',
          rejectKeyDownEvent,
        )
      },

      unlockIceSegment: function (elem) {
        elem
          .removeClass('locked')
          .removeClass('icon-lock')
          .addClass('unlocked')
          .addClass('icon-unlocked3')
        var section = elem.closest('section')
        section
          .removeClass('ice-locked')
          .removeClass('readonly')
          .addClass('ice-unlocked')
        section.find('.targetarea').click()
      },
      lockIceSegment: function (elem) {
        elem
          .removeClass('unlocked')
          .removeClass('icon-unlocked3')
          .addClass('locked')
          .addClass('icon-lock')
        var section = elem.closest('section')
        section
          .addClass('ice-locked')
          .addClass('readonly')
          .removeClass('ice-unlocked')
        UI.closeSegment(section, 1)
      },

      submitIssues: function (sid, data) {
        return ReviewImproved.submitIssue(sid, data)
      },
    })
  })(jQuery, window, ReviewImproved)
}
