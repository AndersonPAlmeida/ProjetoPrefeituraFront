import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/SectorList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getSectorList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          sectors: []
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `sectors`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ sectors: resp })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Setor </h2>
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newSectorButton()}
        </div>
      </div>
      )
  }
  
	tableList() {
    const data = (
      this.state.sectors.map((sector) => {
        return (
          <tr>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/sectors/${sector.id}`) 
                }>
                {sector.name}
              </a>
            </td>
            <td className='description-column' >
              {sector.description}
            </td>
            <td>
              {sector.situation}
            </td>
            <td>
              {sector.schedules_by_sector}
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                 href='#' 
                 onClick={ () => 
                 browserHistory.push(`/sectors/${sector.id}/edit`) 
                }>
                  <i className="waves-effect material-icons tooltipped">
                    edit
                  </i>
              </a> 
            </td>
          </tr>
        )
      })
    )

    // Fields to show in the table, and what object properties in the data they bind to
    const fields = (
      <tr>
        <th>Nome</th>
        <th>Descrição</th>
        <th>Situação</th>
        <th>Agendamentos por setor</th>
        <th></th>
      </tr>
    )

    return (
      <table className={styles['table-list']}>
        <thead>
          {fields}
        </thead>
        <tbody>
          {data}
        </tbody>
      </table>
    )
	}

  prev() {
    browserHistory.push("citizens/schedules/agreement")
  }

	newSectorButton() {
		return (
			<button 
        onClick={() =>
          browserHistory.push({ pathname: `/sectors/new`}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR NOVO SETOR
      </button>
		)
	}

  render() {
    return (
      <main>
      	<Row>
	        <Col s={12}>
		      	<div>
		      		{this.mainComponent()}
		      	</div>
	      	</Col>
	    </Row>
	  </main>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}

const SectorList = connect(
  mapStateToProps
)(getSectorList)
export default SectorList
