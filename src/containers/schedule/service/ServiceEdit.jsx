{/*
  * This file is part of Agendador.
  *
  * Agendador is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * Agendador is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
  */}

import React, {Component} from 'react'
import {apiHost, apiPort, apiVer } from '../../../../config/env';
import { Col, Row, Input} from 'react-materialize'
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import styles from './styles/ServiceEdit.css'



class getServiceEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      situations: [],
      schedule: [],
      selected_situation_id: '',
      fetching: true
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `schedules/${this.props.params.schedule_id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({ schedule: resp, fetching: false })
    });
    this.getSituations.bind(this)(this.props.user.current_role);
  }

  getSituations(role) {
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `forms/schedule_index`;
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({situations: resp.situation})
    });
  }

  mainComponent() {
    return (
    <div className='card'>
      <div className='card-content'>
        <h2 className='card-title h2-title-home'> Alterar situação do agendamento </h2>
            <p>
              Escolha a situação do agendamento, mas tenha certeza do que está
              fazendo, já que não poderá mudar novamente. Por padrão um agendamento é considerado agendado.
            </p>
            <Row></Row>
            {this.pickSituation()}
      </div>
          {this.actionsButtons()}
    </div>
    )
  }


  actionsButtons() {
      return (
          <div className="card-action">
              <a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)}> VOLTAR </a>
              <button className="waves-effect btn button-color right" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">Atualizar</button>
          </div>
      )
  }

  changeSituationSubmit() {
    let errors = [];
    var selected_situation
  }

  handleSubmit() {
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `schedules/${this.props.params.schedule_id}`;
    const params = `permission=${this.props.user.current_role}`;
    let fetch_body = {}
    fetch_body["schedule"] = {}
    if(this.state.selected_situation_id){
      if (this.state.selected_situation_id === '2'){
        Materialize.toast('A situação do Atendimento já é agendado', 10000, 'red',function(){$('#toast-container').remove();});
      }else{
        fetch_body["schedule"]["situation_id"] =  this.state.selected_situation_id;
        fetch(`${apiUrl}/${collection}?${params}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify(fetch_body)
        }).then(parseResponse).then(resp => {
          Materialize.toast('Situação de Atendimento alterada com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
          browserHistory.push(`/schedules/service`);
        }).catch(({errors}) => {
          if(errors) {
            let full_error_msg = '';
            errors['full_messages'].forEach(function(elem){ full_error_msg += elem + '\n'; });
            Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove();});
            throw errors;
          }
        });
      }
    }
  }

  pickSituation() {
    //The situation cames with available so slice skip the first element
    const situationList = (this.state.situations.slice(1).map((situation) => {
      return (<option key={situation.id} value={situation.id}>{situation.description}</option>)
    }))
    return (
    <Row>
        <Col l={5} m={5} s={11}>
                <h6 className={styles['situation-text']} >Situação:</h6>
        </Col>
         <Col l={7} m={7} s={13}>
            <Input type='select' value={this.state.selected_situation_id} onChange={(event) => {
                   var selected_situation = event.target.value

                   if (this.state.selected_situation_id != selected_situation) {

                     this.setState({selected_situation_id: selected_situation});
                   }
                 }
               }>
                 {situationList}
               </Input>
        </Col>
    </Row>
    )
  }


  prev() {
    browserHistory.push(`/schedules/service`)
  }

  render() {
    return (<main>
      <Row>
        <Col s={12}>
          {this.mainComponent()}
        </Col>
      </Row>
    </main>)
  }
}



const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const ServiceEdit = connect(
  mapStateToProps
)(getServiceEdit)
export default ServiceEdit
