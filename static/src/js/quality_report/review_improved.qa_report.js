import React from 'react'
import {createRoot} from 'react-dom/client'
let QualityReportVersions =
  require('../components/review_improved/QualityReportVersions').default

let QAReportVersions = {
  init: function () {
    this.getVersions().done(function (response) {
      const mountPoint = createRoot(
        document.getElementById('quality-report-select'),
      )
      mountPoint.render(
        React.createElement(QualityReportVersions, {
          versions: response.versions,
        }),
      )
    })
  },

  getVersions: function () {
    return $.ajax({
      type: 'get',
      url:
        '/api/v2/jobs/' +
        config.id_job +
        '/' +
        config.password +
        '/quality-report/versions',
    })
  },
}

$(document).ready(function () {
  QAReportVersions.init()
})
