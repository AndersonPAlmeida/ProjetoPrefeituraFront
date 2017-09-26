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
import strftime from 'strftime';


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

  formatCPF(n) {
    n = n.replace(/\D/g,"");
    n = n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/,"$1.$2.$3-$4");
    return (n);
  }

	tableList() {
    const data = (
      this.state.dependants.map((dependant) => {
        return (
          { name: <a className='back-bt waves-effect btn-flat' href='#' 
          		onClick={ () => browserHistory.push(`/dependants/${dependant.id}`) }>{dependant.name}</a>, 
          	birth: strftime.timezone('+0000')('%d/%m/%Y', new Date(dependant.birth_date)), 
          	cpf: this.formatCPF(dependant.cpf), 
          	edit: <a className='back-bt waves-effect btn-flat' href='#' 
          		onClick={ () => browserHistory.push(`/dependants/${dependant.id}/edit`) }>
          		<i className="waves-effect material-icons tooltipped">edit</i></a> }
        )
      })
    )

    // Fields to show in the table, and what object properties in the data they bind to
    const fields = [
        { name: 'name', displayName: "Nome", inputFilterable: true, sortable: true },
        { name: 'birth', displayName: "Data de Nascimento", inputFilterable: true, exactFilterable: true, sortable: true },
        { name: 'cpf', displayName: "CPF", inputFilterable: true, exactFilterable: true, sortable: true },
        { name: 'edit', displayName: "" }
    ];

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

  prev() {
    browserHistory.push("citizens/schedules/agreement")
  }

	newDependantButton() {
		return (
			<button onClick={() =>browserHistory.push(`/dependants/new`)} className="btn waves-effect btn button-color" name="anterior" type="submit">CADASTRAR NOVO DEPENDENTE</button>
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
