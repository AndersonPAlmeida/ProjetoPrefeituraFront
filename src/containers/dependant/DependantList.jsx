import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/DependantList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import FilterableTable from 'react-filterable-table';


// Data for the table to display; can be anything
  const data = [
      { name: "Steve", birth: "09/01/2004", cpf: "Não informado",
        edit: <i className="waves-effect material-icons tooltipped">edit</i> },
      { name: "Gary", birth: "09/01/2004", cpf: "142.865.868-80",
        edit: <i className="waves-effect material-icons tooltipped">edit</i> },
      { name: "Greg", birth: "09/01/2014", cpf: "Não informado", 
        edit: <i className="waves-effect material-icons tooltipped">edit</i> }
  ];

  // Fields to show in the table, and what object properties in the data they bind to
  const fields = [
      { name: 'name', displayName: "Nome", inputFilterable: true, sortable: true },
      { name: 'birth', displayName: "Data de Nascimento", inputFilterable: true, exactFilterable: true, sortable: true },
      { name: 'cpf', displayName: "CPF", inputFilterable: true, exactFilterable: true, sortable: true },
      { name: 'edit', displayName: "" }
  ];

class getDependantList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          dependants: []
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.user.citizen.id}/dependants`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ dependants: resp })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Dependente </h2>
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newDependantButton()}
        </div>
      </div>
      )
  }

  tableList() {
    return (
      <FilterableTable
            namespace="People"
            initialSort="name"
            data={data}
            fields={fields}
            noRecordsMessage="Nenhum registro a ser mostrado!"
            noFilteredRecordsMessage="Nenhum registro encontrado!"
            topPagerVisible={false}
            bottomPagerVisible={false}
            tableClassName='table-list'
            className='table-div'
        />
      )
  }
  

	showList() {
    const dependantList = (
      this.state.dependants.map((dependant) => {
        return (
          <div>
            {dependant.name} 
            <a className='back-bt waves-effect btn-flat' href='#' onClick={ () => browserHistory.push(`/dependants/${dependant.id}/edit`) }> Editar </a>
          </div>
        )
      })
    )
		return (
			<div className='select-field'>
				<b>Dependentes:</b>
				<div>
          {dependantList}
				</div>
      </div>
    )
	}

  prev() {
    browserHistory.push("citizens/schedules/agreement")
  }

	newDependantButton() {
		return (
			<button onClick={() =>browserHistory.push(`/citizens`)} className="btn waves-effect btn button-color" name="anterior" type="submit">CADASTRAR NOVO DEPENDENTE</button>
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

const DependantList = connect(
  mapStateToProps
)(getDependantList)
export default DependantList
