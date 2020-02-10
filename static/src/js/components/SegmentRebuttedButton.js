class SegmentRebuttedButton extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
        };
    }

    handleClick() {
        ReviewImproved.clickOnRebutted(this.props.sid);
    }

    render() {
        var cmd = ((UI.isMac) ? 'CMD' : 'CTRL');

        return <li>
            <a className="button button-rebutted status-rebutted"
               onClick={this.handleClick.bind(this)}
               disabled={!this.state.disabled}
               draggable="false"
            >
                Rebutted
            </a>
            <p>{window.UI.shortcutLeader}+ENTER</p>
        </li>
            ;

    }
}

export default SegmentRebuttedButton ;
