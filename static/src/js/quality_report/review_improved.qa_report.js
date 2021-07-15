import ReactDOM from 'react-dom'
import React from 'react'
let QualityReportVersions = require('../components/review_improved/QualityReportVersions').default ;

let QAReportVersions = {
    init:  function () {
        this.getVersions().done(function (response) {
            ReactDOM.render(
                React.createElement(QualityReportVersions, {
                    versions: response.versions
                }),
                document.getElementById('quality-report-select')
            );
        });

    },

    getVersions: function () {
        return $.ajax({
            type: "get",
            url : "/api/v2/jobs/"+config.id_job +"/"+ config.password +"/quality-report/versions"
        });
    }
};

$(document).ready(function(){
    QAReportVersions.init();
});