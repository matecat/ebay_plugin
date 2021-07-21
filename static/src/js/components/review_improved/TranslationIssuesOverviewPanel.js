import _ from 'lodash'

let ReviewTranslationVersion = require("./ReviewTranslationVersion").default;
class TranslationIssuesOverviewPanel extends React.Component {


    constructor(props) {
        super(props);

    }
    closePanelClick(e, data) {
        this.props.closePanel();
    }
    getVersions ( sid ) {
        let versions = MateCat.db.segment_versions.findObjects({
            id_segment : parseInt(sid)
        });

        let sorted = _.sortBy(versions, function(version) {
            return parseInt(version.version_number);
        }).reverse();
        return sorted;
    }

    getOriginalTarget ( segment ) {
        let version_number = segment.version_number ;
        if ( version_number == "0" ) {
            return segment.translation ;
        }
        else {
            // query versions to find original target
            let root_version = MateCat.db.segment_versions.findObject({
                id_segment : parseInt(segment.sid),
                version_number : 0
            });

            if (! root_version ) {
                throw 'Unable to find root version';
            }
            return root_version.translation ;
        }
    }

    originalTarget () {
        let segment = MateCat.db.segments.by('sid', this.props.sid);
        let original_target = this.getOriginalTarget( segment );
        return { __html : TagUtils.decodePlaceholdersToTextSimple( original_target ) };
    }

    getTrackChangesForCurrentVersion () {
        let segment = MateCat.db.segments.by('sid', this.props.sid);
        if ( segment.version_number != '0' ) {
            // no track changes possibile for first version
            let previous = this.findPreviousVersion( segment.version_number );
            return TextUtils.trackChangesHTML(
                TextUtils.clenaupTextFromPleaceholders( previous.translation ),
                TextUtils.clenaupTextFromPleaceholders(
                    this.cleanupSplitMarker( segment.translation )
                ));
        }
    }

    cleanupSplitMarker( string ) {
        return string.split( UI.splittedTranslationPlaceholder ).join();
    }

    findPreviousVersion ( version_number ) {
        let segment = MateCat.db.segments.by('sid', this.props.sid);
        let versions = this.getVersions( this.props.sid );
        if ( segment.version_number !== '0' && version_number !== 0) {
            return versions.filter(function (item) {
                return parseInt(item.version_number) === parseInt(version_number) - 1;
            }.bind(this))[0];
        } else {
            return versions[versions.length - 1];
        }
    }

    getTrackChangesForOldVersion (version) {
        if ( version.version_number != "0" ) {
            let previous = this.findPreviousVersion( version.version_number );
            return TextUtils.trackChangesHTML(
                TextUtils.clenaupTextFromPleaceholders( previous.translation ),
                TextUtils.clenaupTextFromPleaceholders( version.translation )
            );
        }
    }

    getListVersionsReviewImproved() {
        let versions = this.getVersions( this.props.sid );
        let segment = MateCat.db.segments.by('sid', this.props.sid);
        let previousVersions = versions.map( function(v) {
            let key = 'version-' + v.id + '-' + this.props.sid ;

            return (
                <ReviewTranslationVersion
                    trackChangesMarkup={this.getTrackChangesForOldVersion( v )}
                    sid={segment.sid}
                    key={key}
                    versionNumber={v.version_number}
                    isCurrent={false}
                    translation={v.translation}
                    reviewType={this.props.reviewType}
                />
            );
        }.bind(this) );
        let currentVersion = <ReviewTranslationVersion
            trackChangesMarkup={this.getTrackChangesForCurrentVersion()}
            sid={segment.sid}
            key={'version-0'}
            versionNumber={segment.version_number}
            isCurrent={true}
            translation={this.cleanupSplitMarker( segment.translation ) }
            reviewType={this.props.reviewType}/>

        return [currentVersion].concat(previousVersions);

    }

    render() {
        let fullList = this.getListVersionsReviewImproved();


        return <div className="review-issues-overview-panel">
                <div className="review-version-wrapper">
                    <h3>Original target</h3>
                    <div className="ui ignored message" dangerouslySetInnerHTML={this.originalTarget()} />
                    <div className="review-side-panel-close" onClick={this.closePanelClick.bind(this)}>x</div>
                </div>
                {fullList}
        </div>
        ;
    }
}

export default TranslationIssuesOverviewPanel
