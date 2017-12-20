import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/OccupationForm.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { OccupationImg } from '../images';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';

class getOccupationForm extends Component {

 constructor(props) {
    super(props)
    this.state = {
      occupation: {
        id: '',
        description: '',
        name: '',
        active: true,
        city_hall_name: '',
        city_hall_id: 0

      },
      city_halls: []
    };
  }
  // if(this.props.is_edit) {
  //   console.log(this.props.data);
  //   self.setState({ occupation: this.props.data })
  // }
  // if(this.props.current_role && this.props.current_role.role != 'adm_c3sl') {
  //   this.setState({
  //     occupation: update(this.state.occupation, { ['city_hall_id']: {$set: this.props.current_role.city_hall_id} })
  //   })
  // }

  componentDidMount() {
    var self = this;
    var occupation = this.props.is_edit ? this.props.data : this.state.occupation;

    if(this.props.current_role && this.props.current_role.role != 'adm_c3sl') {
      occupation['city_hall_id'] = this.props.current_role.city_hall_id;
    } else {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'forms/service_type_index';
      const params = this.props.fetch_params;
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        self.setState({ city_halls: resp.city_halls })
      });
    }

    self.setState({ occupation: occupation },() => console.log(this.state.occupation));
  }

  handleInputOccupationChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      occupation: update(this.state.occupation, { [name]: {$set: value} })
    })
  }

  handleSubmit() {
    let errors = [];
    let formData = {};
    formData = this.state.occupation;

    if(!formData['name'])
      errors.push("Campo Nome é obrigatório.");
    if(!formData['description'])
      errors.push("Campo Descrição é obrigatório.");
    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    } else {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params;
      let fetch_body = {}
      if(this.props.is_edit) {
        fetch_body['occupation'] = formData
      }
      else {
        fetch_body = formData
      }
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        if(this.props.is_edit)
          Materialize.toast('Cargo editado com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        else
          Materialize.toast('Cargo criado com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        browserHistory.push(this.props.submit_url)
      }).catch(({errors}) => {
        if(errors) {
          let full_error_msg = "";
          errors['full_messages'].forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
          throw errors;
        }
      });
    }
  }

  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
        <button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">{this.props.is_edit ? "Atualizar" : "Criar"}</button>
      </div>
    )
  }

  pickCityHall() {
      if(this.props.current_role && this.props.current_role.role != 'adm_c3sl') {
        return (
          <input disabled
             name="selected_city_hall"
             type='text'
             className='input-field'
             value={this.props.current_role.city_hall_name}
          />
        )
      }

      const cityHallsList = (
        this.state.city_halls.map((city_hall) => {
          return (
            <option value={city_hall.id}>{city_hall.name}</option>
          )
        })
      )
      return (
        <Input
          name="city_hall_id"
          type='select'
          value={this.state.sector.city_hall_id}
          onChange={
            (event) => {
              if(event.target.value != this.state.selected_city_hall) {
                  this.handleInputSectorChange(event);
              }
            }
          }
        >
          <option value='0' disabled>Escolha a prefeitura</option>
          {cityHallsList}
        </Input>
      )
    }


  render() {
    return (
      <main>
      	<Row>
	        <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                {this.props.is_edit ?
                  <h2 className="card-title">Alterar cargo: {this.props.data.name}</h2>
                  :
                  <h2 className="card-title">Cadastrar cargo</h2>
                }
                <Row className='first-line'>
                  <Col s={12} m={12} l={6}>
                    <div className="field-input" >
                      <h6>Prefeitura:</h6>
                      <div>
                        {this.pickCityHall()}
                      </div>
                    </div>

                    <div className="field-input" >
                      <h6>Situação:</h6>
                      <div>
                        <Input s={6} m={32} l={6}
                               type='select'
                               name='active'
                               value={this.state.occupation.active}
                               onChange={this.handleInputOccupationChange.bind(this)}
                        >
                          <option key={0} value={true}>Ativo</option>
                          <option key={1} value={false}>Inativo</option>
                        </Input>
                      </div>
                    </div>

                    <div className="field-input" >
                      <h6>Nome*:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="name"
                          value={this.state.occupation.name}
                          onChange={this.handleInputOccupationChange.bind(this)}
                        />
                      </label>
                    </div>

                    <div>
                      <h6>Descrição*:</h6>
                      <label>
                        <textarea
                          className='input-field materialize-textarea'
                          name="description"
                          value={this.state.occupation.description}
                          onChange={this.handleInputOccupationChange.bind(this)}
                        />
                      </label>
                    </div>
                    <p><font color="red"> Campos com (*) são de preenchimento obrigatório.</font></p>
                  </Col>
                </Row>
                {this.confirmButton()}
              </div>
            </div>
          </Col>
        </Row>
      </main>
    )
  }
}

const OccupationForm = connect()(getOccupationForm)
export default OccupationForm
