
let SegmentRebuttedButton = require('./SegmentRebuttedButton').default;
let SegmentFixedButton = require('./SegmentFixedButton').default;

class SegmentMainButtons extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            status : this.props.status.toUpperCase(),
            anyRebuttedIssue : this.anyRebuttedIssue(),
            buttonDisabled : true,
        }
    }

    handleSegmentUpdate (data) {
        if ( this.props.sid == data.sid ) {
            this.setState( { status : data.status.toUpperCase() } );
        }
    }

    anyRebuttedIssue ( data ) {
        var issuesRebutted = MateCat.db.segment_translation_issues.find( {
            '$and': [
                { id_segment: parseInt(this.props.sid)  },
                {
                    rebutted_at: {  '$ne': null }
                }
            ]
        } );

        return !!( issuesRebutted && issuesRebutted.length ) ;
    }

    updateButtonToShow ( data ) {
        this.setState( { anyRebuttedIssue : this.anyRebuttedIssue() } );
    }

    componentDidMount() {
        MateCat.db.addListener('segments', ['insert', 'update'], this.handleSegmentUpdate.bind(this) );
        MateCat.db.addListener('segment_translation_issues', ['insert', 'update', 'delete'], this.updateButtonToShow.bind(this) );

        var el = UI.getSegmentById(this.props.sid);
    }

    componentWillUnmount() {
        MateCat.db.removeListener('segments', ['insert', 'update'], this.handleSegmentUpdate );
        MateCat.db.removeListener('segment_translation_issues', ['insert', 'update', 'delete'], this.updateButtonToShow );

        var el = UI.getSegmentById(this.props.sid);
    }

    render () {
        var disabledButton ;

        if ( this.state.anyRebuttedIssue ) {
            return  <div className="react-buttons">
                <SegmentRebuttedButton status={this.state.status} sid={this.props.sid} />
            </div>
        } else {

            return <div className="react-buttons">
                <SegmentFixedButton status={this.state.status} sid={this.props.sid} disabled={this.props.segment.modified}  />
            </div>
        }
    }

    isSegmentModified() {
        var el = UI.getSegmentById(this.props.sid);
        var isModified = el.data('modified');
        return isModified === true ;
    }
}

export default SegmentMainButtons;

window.MC.SegmentMainButtons = require('./SegmentMainButtons').default ;
