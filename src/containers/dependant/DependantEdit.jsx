import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ScheduleCitizen.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

class DependantEdit extends Component {
  constructor(props) {
      super(props)
      this.state = {
          dependant: [],
          update_address: 0,
          address: [],
          cep: null
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.user.citizen.id}/dependants/this.props.params.dependant_id`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ dependant: resp })
    });
  }

  componentDidUpdate() {
    if(this.state.update_address != 0) { 
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'validate_cep';
      const params = `permission=${this.props.user.current_role}`
      var formData = {};
      formData["cep"] = {};
      formData["cep"]["number"] = this.state.cep.replace(/(\.|-)/g,'');
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: "body",
        body: JSON.stringify(formData)
      }).then(parseResponse).then(resp => {
        this.setState({ address: resp })
        this.setState({ update_address: 0 })
      }); 
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }


  handleSubmit() {
    browserHistory.push(`/dependants`)
  }

  prev() {
    browserHistory.push(`/dependants`)
  }

	confirmButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' href='#' onClick={this.prev}> Voltar </a>
				<button className="waves-effect btn right" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">Continuar</button>
      </div>
		)
	}

  render() {
    return (
      <main>
      	<Row>
	        <Col s={12}>
		      	<div>
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
const DependantEdit = connect(
  mapStateToProps
)(getScheduleCitizen)
export default DependantEdit
