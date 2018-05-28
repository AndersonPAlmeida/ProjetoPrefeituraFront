import React, {Component} from 'react'
import { connect } from 'react-redux'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import update from 'react-addons-update';
import styles from './styles/CityHallForm.css'
import { browserHistory } from 'react-router';
import MaskedInput from 'react-maskedinput';
import { Button, Card, Row, Col, Dropdown, Input, CardPanel } from 'react-materialize'

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }


class editCityHall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aux: {
        logo: undefined,
        logo_obj: undefined,
        logo_has_changed: 0
      },
      city_hall: {
        name: "",
        cep: "",
        state: "",
        address: "",
        email_hours: 0,
        phone2: "",
        phone1: "",
        support_email: "",
        choose_professional: true,
        web_singup: true,
        name: "",
        district_name: "",
        address_number: 0,
        schedule_days_interval: 0,
        email: "",
        site: "",
        description: "",
        allow_web: true,
        active: true
      },
      name:""
    };
    this.handleCityHallInputChange = this.handleCityHallInputChange.bind(this);
    this.fileUpload = null;
    this.dispatchUploadFileClick = this.dispatchUploadFileClick.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.checkErrors = this.checkErrors.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.setButtonFile = element =>{
      this.fileUpload = element;
    };

  }

  handleCityHallInputChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value
    if(target.validity.valid) {
      this.setState({
        city_hall: update(this.state.city_hall, { [name]: {$set: value} })
      })
    }
  }

  dispatchUploadFileClick(){
    this.fileUpload.click();
  }

  handleFile(event) {
    const target = event.target;
    const name = target.name;
    var value = target.files[0];
    var reader = new FileReader();
    console.log(value.name);
    if(value != undefined){
      const onLoad = function(e) {
        var dataURL = reader.result;
        this.setState({
          aux: update(
            this.state.aux, {
              [name]: {$set: value.name},
              logo_obj: {$set: dataURL},
              logo_has_changed: {$set: 1}
            }
          )
        },
        function(){
          console.log(this.state);
        })
      };
      reader.onload = onLoad.bind(this);
      reader.readAsDataURL(value);
    }
  }


  checkErrors(){
    let errors = []
    let data = this.state.city_hall;
    let today_1month, selectedDayStart, selectedDayEnd;
    let testDate = true;

    //name
    if(data.name.length == 0)
        errors.push('Nome é um campo obrigatório');

    //CEP
    if(data.cep.length == 0)
        errors.push('CEP é um campo obrigatório');

    //address text
    if(data.address.length == 0)
        errors.push('Endereço da sede é um campo obrigatório');

    //district_name
    if(data.district_name.length == 0)
        errors.push('Bairro é um campo obrigatório');


    //address_number
    if(!isNumber(data.address_number) || data.address_number < 0 || data.address_number != Number(data.address_number))
        errors.push('O número do endereço deve ser um número positivo');

    //email_hours
    if(!isNumber(data.email_hours) || data.email_hours < 0 || data.email_hours != Number(data.email_hours))
        errors.push('O número de horas para o email de aviso deve ser um número positivo');

    //periodo para contagem de agendamentos
    if(!isNumber(data.schedule_days_interval) || data.schedule_days_interval < 0
      || data.schedule_days_interval != Number(data.schedule_days_interval))
        errors.push('O número de dias para o periodo de agendamento deve ser um número positivo');


    //Telefone
    if(data.phone1.length == 0)
        errors.push('O Telefone 1 é um campo obrigatório');

    //email e email de suporte
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!re.test(data.email)){
      errors.push('Digite um email válido para a prefeitura');
    }

    if(!re.test(data.support_email)){
      errors.push('Digite um email válido para o suporte');
    }

    return errors;
  }

  handleSubmit(){
    //validar
    //receber dados (generateBody)
    //enviar dados para o servidor
    let errors = this.checkErrors();
    console.log(this.props);

    if(errors.length > 0){
      //show errors
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      $("#toast-container").remove();
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    }else{
      //send data to server.
      let fetch_body = this.generateBody();
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'city_halls/1?permission=1';
      var params = '';

      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        if(this.props.is_edit){
          $("#toast-container").remove();
          Materialize.toast('Escala editada com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        }
        else{
          $("#toast-container").remove();
          Materialize.toast('Escala criada com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        }
        browserHistory.push(this.props.submit_url);
      }).catch(({errors}) => { // TODO: UPDATE ERRORS ARRAY ACCORDING TO API
        if(errors) {
          let full_error_msg = "";
          errors.forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
          throw errors;
        }
      });




    }

  }

  generateBody(formData){

    if(this.props.is_edit)
      data['city_hall_id'] = this.state.city_hall.id;

    let data = {};
    data['name'] = this.state.city_hall.name;
    data['cep'] = this.state.city_hall.cep;
    data['active'] = this.state.city_hall.active;
    data['phone1'] = this.state.city_hall.phone1;
    data['phone2'] = this.state.city_hall.phone2;
    data['address_number'] = this.state.city_hall.address_number;

    if(this.state.aux.photo_has_changed) {

      let image = {};
      image['content'] = this.state.aux.photo_obj.split(',')[1];
      image['content_type'] = this.state.aux.photo_obj.split(",")[0].split(":")[1].split(";")[0];
      image['filename'] = this.state.aux.photo;;
      formData['image'] = image;
    }

    formData['city_hall'] = data;
  }

  render(){
    return(
      <main>
        <Row>
          <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                <Row className='city-hall-content' >
                    <h2 className="card-title">Alterar Prefeitura: {this.state.name}</h2>
                    <Col s={12} m={6}>
                      <Row className='city-hall-first-row'>
                        <Col s={12}>
                          <h6>Situação*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name='active' type='select' className='city-hall'
                            onChange={this.handleCityHallInputChange}
                            value={this.state.city_hall.active}
                            >
                              <option key={1} value={true}>Ativo</option>
                              <option key={0} value={false}>Inativo</option>
                          </Input>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>CEP*:</h6>
                        </Col>
                        <Col s={12}>
                          <div className='col input-field'>
                            <MaskedInput
                              type="text"
                              className='city-hall'
                              mask="11111-111"
                              name="cep"
                              onChange={this.handleCityHallInputChange}
                              value={this.state.city_hall.cep}
                              />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Estado:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="state" type='text' disabled value={this.state.city_hall.state}
                            className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Endereço da sede*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="address" type='text' value={this.state.city_hall.address}
                            className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Complemento:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="complement" type='text' value={this.state.city_hall.complement}
                            className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Antecedência para enviar email avisando de um agendamento (horas)*: </h6>
                        </Col>
                        <Col s={12}>
                          <Input name="email_hours" type='number' value={this.state.city_hall.email_hours}
                            min={0} className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Telefone 2:</h6>
                        </Col>
                        <Col s={12}>
                          <div className='col input-field'>
                            <MaskedInput
                              name="phone2"
                              type="text"
                              className='city-hall'
                              mask="(11) 1111-11111"
                              onChange={this.handleCityHallInputChange}
                              value={this.state.city_hall.phone2}
                              />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Email de suporte:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="support_email" type='email' value={this.state.city_hall.support_email}
                            className='city-hall' onChange={this.handleCityHallInputChange} />
                        </Col>
                      </Row>
                      <Row>
                        <input
                          type='file'
                          name='logo'
                          accept='image/png'
                          style={{display: "none"}}
                          ref={this.setButtonFile}
                          onChange={this.handleFile}
                          />
                        <Col s={12} className="clear">
                          <Button s={6} className="waves button-color auto-size file-input" onClick={this.dispatchUploadFileClick}>
                            Logotipo
                          </Button>
                          <Input  s={6} type="text" disabled value={this.state.aux.logo} className="file-name"/>

                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <Input name="choose_professional" className='city-hall' value={this.state.city_hall.choose_professional}
                             type='switch' offLabel=' ' onLabel='Escolher profissional ao fazer agendamento' onChange={this.handleCityHallInputChange}/>
                        </Col>
                        <Col s={12}>
                          <Input name="web_singup" className='city-hall' value={this.state.city_hall.web_singup}
                            type='switch' offLabel=' ' onLabel='Permitir que o cidadão se cadastre pela internet' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                    </Col>
                    <Col s={12} m={6}>
                      <Row className='city-hall-first-row'>
                        <Col s={12}>
                          <h6>Nome*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="name" type='text' value={this.state.city_hall.name}
                            className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Bairro*:</h6>
                        </Col>
                        <Col s={12}>
                         <Input name="district_name" type='text' value={this.state.city_hall.district_name}
                           className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Munícipio*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="city_name" type='text' disabled value={this.state.city_hall.city_name}
                            className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Número:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="address_number" type='number' value={this.state.city_hall.address_number}
                            min={0} className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Período para contagem de agendamentos (dias)*: </h6>
                        </Col>
                        <Col s={12}>
                          <Input name="schedule_days_interval" type='number' value={this.state.city_hall.schedule_days_interval}
                            min={0} className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Telefone 1*:</h6>
                        </Col>
                        <Col s={12}>
                          <div className='col input-field'>
                            <MaskedInput
                              type="text"
                              className='city-hall'
                              mask="(11) 1111-11111"
                              name="phone1"
                              onChange={this.handleCityHallInputChange}
                              value={this.state.city_hall.phone1}
                              />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Email:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="email" type='text' value={this.state.city_hall.email}
                            className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Site:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="site" type='text' value={this.state.city_hall.site}
                            className='city-hall' onChange={this.handleCityHallInputChange} />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Descrição*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="description" type='text' value={this.state.city_hall.description}
                            className='city-hall' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <Input type='switch' name="allow_web" className='city-hall' value={this.state.city_hall.allow_web}
                            className='city-hall' offLabel=' '
                            onLabel='Permitir que utilize o agendador pela internet' onChange={this.handleCityHallInputChange}/>
                        </Col>
                      </Row>
                    </Col>
                    <p className="red-text">Campos com (*) são de preenchimento obrigatório.</p>
                </Row>
                <div>
                  {this.confirmButton()}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </main>

    );
  }


  confirmButton() {

    return (
      <div className="card-action">
        <button className="waves-effect btn right button-color auto-size"  name="commit"  onClick={this.handleSubmit}
          type="submit">Atualizar prefeitura</button>
        <div className="clear"></div>
      </div>
    )
  }

  prev() {
    browserHistory.push(`/city_hall`)
  }

}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const EditCityHall = connect(
  mapStateToProps
)(editCityHall)
export default EditCityHall
