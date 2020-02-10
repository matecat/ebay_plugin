let ReviewTranslationIssue =  require("./ReviewTranslationIssue").default;
class ReviewIssuesContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            issues : this.getIssuesFromDb(this.props.sid,
                this.props.versionNumber)
        };
    }

    getIssuesFromDb ( sid, versionNumber ) {
        return db.segment_translation_issues.findObjects({
            'id_segment' : parseInt(sid),
            'translation_version' : '' + versionNumber
        });
    }

    static getDerivedStateFromProps(props, state) {
        let getIssuesFromDb = function ( sid, versionNumber ) {
            return db.segment_translation_issues.findObjects({
                'id_segment' : parseInt(sid),
                'translation_version' : '' + versionNumber
            });
        };
        var issues = getIssuesFromDb( props.sid, props.versionNumber) ;
        return { issues: issues };
    }

    componentDidMount () {
        MateCat.db.addListener('segment_translation_issues',
            ['delete'], this.issueDeleted.bind(this) );


    }

    componentWillUnmount () {
        MateCat.db.removeListener('segment_translation_issues',
            ['delete'], this.issueDeleted );
    }

    issueDeleted  (issue) {
        var issues = this.getIssuesFromDb( this.props.sid, this.props.versionNumber) ;
        this.setState({ issues: issues });
    }

    render () {

        var cs = classnames({
            'review-issues-container' : true,
        });
        var issues;

        if (this.state.issues.length > 0 ) {
            var sorted_issues = this.state.issues.sort(function(a,b) {
                return parseInt( a.id ) < parseInt( b.id );
            });

            issues = sorted_issues.map(function( item, index ) {
                var prog = sorted_issues.length - index;

                return <ReviewTranslationIssue
                    issueMouseEnter={this.props.issueMouseEnter}
                    issueMouseLeave={this.props.issueMouseLeave}
                    sid={this.props.sid}
                    progressiveNumber={prog}
                    issueId={item.id}
                    key={item.id}
                />

            }.bind(this) );

        }
        else {
            issues = <div className="review-no-issues">No issues on this version</div>;
        }

        return <div className={cs} >
            {issues}
        </div>;

    }
}

export default ReviewIssuesContainer;
