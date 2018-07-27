import React, {Component} from 'react'
import styles from './styles/SpreadsheetIcon.css'


class SpreadsheetIcon extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return(
            <div>
                <img className='spreadsheet-img' src={this.props.icon} alt={this.props.alt} />
                <a id="download-button" onClick={this.props.function} className="waves-effect button-green btn"><i className="material-icons left">file_download</i>{this.props.children}</a>
            </div>
        )
    }
}

export default SpreadsheetIcon
