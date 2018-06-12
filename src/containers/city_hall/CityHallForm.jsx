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


/*
  TODO:
  - Show logo preview on image upload.
  - Check back-end filter( & error msg) for file type on image upload.

*/

class editCityHall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aux: {
        logo: undefined,
        logo_obj: undefined,
        logo_has_changed: 0
      },
      block_text_changed: false,
      city_hall: {
        id: 0,
        name: "",
        cep: "",
        state: "",
        address: "",
        email_hours: 0,
        phone2: "",
        phone1: "",
        support_email: "",
        choose_professional: true,
        city_name: "",
        web_singup: true,
        district_name: "",
        address_number: 0,
        complement: "",
        schedule_days_interval: 0,
        email: "",
        site: "",
        description: "",
        allow_web: true,
        active: true,
        block_text: "Para realizar seu agendamento, entre em contato com a prefeitura."
      },
      name:""
    };
    this.handleCityHallInputChange = this.handleCityHallInputChange.bind(this);
    this.fileUpload = null;
    this.dispatchUploadFileClick = this.dispatchUploadFileClick.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.checkErrors = this.checkErrors.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSuccesfulOperation = this.onSuccesfulOperation.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.setButtonFile = element =>{
      this.fileUpload = element;
    };

  }

  componentDidMount() {
    if(this.props.is_edit){
      this.setState({
        name: this.props.data.name,
        city_hall: update(this.state.city_hall,{
          id: {$set: this.props.data.id},
          active: {$set: this.props.data.active},
          name: {$set: this.props.data.name},
          cep: {$set: (this.props.data.address.zipcode != null ? this.props.data.address.zipcode : "")},
          district_name: {$set: (this.props.data.address.neighborhood != null ? this.props.data.address.neighborhood : "" )},
          state: {$set: (this.props.data.state.name != null ? this.props.data.state.name : "")},
          city_name : {$set: this.props.data.city.name},
          address: {$set: (this.props.data.address.address != null ? this.props.data.address.address : "")},
          address_number: {$set: (this.props.data.address_number != null ? this.props.data.address_number : 0)},
          complement: {$set: (this.props.data.address_complement != null ? this.props.data.address_complement : "" )},
          schedule_days_interval: {$set: ( this.props.data.schedule_period != null ? this.props.data.schedule_period : 0)},
          phone2: {$set: (this.props.data.phone2 != null ? this.props.data.phone2 : "")},
          phone1: {$set: (this.props.data.phone1 != null ? this.props.data.phone1 : "")},
          support_email: {$set: (this.props.data.support_email != null ? this.props.data.support_email : "")},
          email: {$set: (this.props.data.email != null ? this.props.data.email : "")},
          site: {$set: (this.props.data.url != null ? this.props.data.url : "")},
          description: {$set: (this.props.data.description != null ? this.props.data.description : "")},
          choose_professional: {$set: (this.props.data.show_professional != null ? this.props.data.show_professional : "")},
          web_singup: {$set: (this.props.data.citizen_register != null ? this.props.data.citizen_register : false)},
          allow_web: {$set: (this.props.data.citizen_access != null ? this.props.data.citizen_access : false)},
          block_text: {$set: this.props.data.block_text}
        })
      });

      /*
      ----- Code snippet to load logo preview, if/when a image component is added to the html.


      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      let params = this.props.fetch_params;

      fetch(`${apiUrl}/city_halls/${this.props.data.id}/picture?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: 'get'
      }).then(resp => {
        var contentType = resp.headers.get("content-type");
        if(resp.status == 200 && contentType && contentType.indexOf("image") !== -1) {
          resp.blob().then(photo => {
            console.log(photo);
            this.setState({ photo: URL.createObjectURL(photo), fetching: false });
          })
        }

      }).catch(e => {});

      */

    }
  }

  updateAddress() {
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'validate_cep';
    var formData = {};
    let cep = this.state.city_hall.cep.replace(/(\.|-|_)/g,'');
    formData["cep"] = {};
    formData["cep"]["number"] = cep;
    $("#toast-container").remove();
    fetch(`${apiUrl}/${collection}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify(formData)
    }).then(parseResponse).then(resp => {
      $("#toast-container").remove();
      Materialize.toast('CEP inválido, deve ser de uma prefeitura não registrada.', 10000, "red",function(){$("#toast-container").remove()});
      this.setState({
        city_hall: update(this.state.city_hall,{
          address: {$set: ""},
          district_name: {$set: ""},
          city_name: {$set: ""},
          state: {$set: ""}
        })
      });
    }).catch(() => {
      formData["cep"]["only_registered"] = false;
      fetch(`${apiUrl}/${collection}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "post",
          body: JSON.stringify(formData)
        }).then(parseResponse).then(resp => {
          this.setState({
            city_hall: update(this.state.city_hall,{
              address: {$set: resp.address},
              district_name: {$set: resp.neighborhood},
              city_name: {$set: resp.city_name},
              state: {$set: resp.state_name}
            })
          });
        }).catch(() => {
          $("#toast-container").remove();
          Materialize.toast('CEP inválido, não encontramos o endereço.', 10000, "red",function(){$("#toast-container").remove()});
        })
    })




  }

  handleCityHallInputChange(event){
    const target = event.target;
    const name = target.name;
    let value = target.value;
    if(target.validity.valid) {
      if(target.type === "checkbox"){
        value = !this.state.city_hall[name];
      }
      this.setState({
        city_hall: update(this.state.city_hall, { [name]: {$set: value} })
      },
        function(){
          if(name === 'cep' && value.replace(/(\.|-|_)/g,'').length >= 8){
            this.updateAddress();
          }
          else if(name === 'cep' && value.replace(/(\.|-|_)/g,'').length == 0){
            this.setState({
              city_hall: update(this.state.city_hall,{
                address: {$set: ""},
                district_name: {$set: ""},
                city_name: {$set: ""},
                state: {$set: ""}
              })
            });
          }
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
    if(data.cep.replace(/(\.|-|_)/g,'').length < 8)
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

    //schedule_days_interval
    if(!isNumber(data.schedule_days_interval) || data.schedule_days_interval <= 0
      || data.schedule_days_interval != Number(data.schedule_days_interval))
        errors.push('O número de dias para contagem de agendamentos deve ser um número positivo');

    //phone
    if(data.phone1.length == 0)
        errors.push('O Telefone 1 é um campo obrigatório');

    //email & support_email
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(data.email.length > 0 && !re.test(data.email)){
      errors.push('Digite um email válido para a prefeitura');
    }

    if(data.support_email.length > 0 && !re.test(data.support_email)){
      errors.push('Digite um email válido para o suporte');
    }

    //allow_web
    if(!this.state.city_hall.allow_web && this.state.block_text === undefined){
      errors.push('Digite uma mensagem que justifica porque o cidadão não pode acessar o Agendador');
    }

    return errors;
  }

  onSuccesfulOperation(){
    $("#toast-container").remove();
    if(this.props.is_edit){
      Materialize.toast('Prefeitura editada com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
    }
    else{
      Materialize.toast('Prefeitura criada com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
    }
    browserHistory.push(this.props.submit_url);
  }

  showErrors(errors){
    let full_error_msg = "";
    errors.forEach(function(elem){ full_error_msg += elem + '\n' });
    $("#toast-container").remove();
    Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    throw errors;
  }

  updateLogo(id){
    let data = {};
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var params = this.props.fetch_params;
    let image = {};
    image['content'] = this.state.aux.logo_obj.split(',')[1];
    image['content_type'] = this.state.aux.logo_obj.split(",")[0].split(":")[1].split(";")[0];
    image['filename'] = this.state.aux.logo;
    data['avatar'] = image;
    fetch(`${apiUrl}/city_halls/${id}/picture?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: 'post',
      body: JSON.stringify(data)
    }).then(parseResponse).then(resp => {
      this.onSuccesfulOperation();
    }).catch(({errors}) => { // TODO: UPDATE ERRORS ARRAY ACCORDING TO API
      if(errors) {
        this.showErrors(errors);
      }
    });

  }

  handleSubmit(){

    let errors = this.checkErrors();

    if(errors.length > 0){
      //show errors
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      $("#toast-container").remove();
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    }else{
      let fetch_body = this.generateBody();
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      let params = this.props.fetch_params;
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {

        if(this.state.aux.logo_has_changed){
          this.updateLogo(resp.id).bind(this);
        }else{
          this.onSuccesfulOperation();
        }

      }).catch(({errors}) => { // TODO: UPDATE ERRORS ARRAY ACCORDING TO API

        if(errors) {
          this.showErrors(errors);
        }
      });
    }

  }

  generateBody(){
    let data = {};
    let formData = {};

    if(this.props.is_edit){
      data['id'] = this.state.city_hall.id;
      data['active'] = this.state.city_hall.active;
    }

    data['name'] = this.state.city_hall.name;
    data['cep'] = this.state.city_hall.cep.replace(/(\.|-|_)/g,'');

    data['phone1'] = this.state.city_hall.phone1.replace(/[^0-9]+/g,'');
    data['phone2'] = this.state.city_hall.phone2.replace(/[^0-9]+/g,'');
    data['address_number'] = this.state.city_hall.address_number;
    data['citizen_access'] = this.state.city_hall.allow_web;
    data['citizen_register'] = this.state.city_hall.web_singup;
    data['schedule_period'] = this.state.city_hall.schedule_days_interval;
    data['address_complement'] = this.state.city_hall.complement;
    data['description'] = this.state.city_hall.description;
    data['email'] = this.state.city_hall.email;
    data['support_email'] = this.state.city_hall.support_email;
    data['url']  = this.state.city_hall.site;
    data['show_professional'] = this.state.city_hall.choose_professional;

    if(!this.props.is_edit && this.state.city_hall.allow_web){
      data['block_text'] = "Para realizar seu agendamento, entre em contato com a prefeitura.";

    } else if(!this.props.is_edit || !this.state.city_hall.allow_web){
      data['block_text'] = this.state.city_hall.block_text;

    }


    formData['city_hall'] = data;
    return formData;
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
                          <Input name="address" type='text' disabled value={this.state.city_hall.address}
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
                          <Input name="choose_professional" className='city-hall' checked={this.state.city_hall.choose_professional}
                             type='switch' offLabel=' ' onLabel='Escolher profissional ao fazer agendamento' onChange={this.handleCityHallInputChange}/>
                        </Col>
                        <Col s={12}>
                          <Input name="web_singup" className='city-hall' checked={this.state.city_hall.web_singup}
                            type='switch' offLabel=' ' onLabel='Permitir que o cidadão se cadastre pela internet' onChange={this.handleCityHallInputChange}/>
                        </Col>
                        <Col s={12}>
                          <Input type='switch' name="allow_web" className='city-hall' checked={this.state.city_hall.allow_web}
                            className='city-hall' offLabel=' '
                            onLabel='Permitir que utilize o agendador pela internet' onChange={this.handleCityHallInputChange}/>
                        </Col>
                        <Col s={12}>
                          <h6 className="allow-web-header" style={(this.state.city_hall.allow_web ? {display : 'none'} : {})}>Mensagem que justifica porque o cidadão não pode acessar o Agendador*:</h6>
                        </Col>
                        <Col s={12} style={this.state.city_hall.allow_web ? {display : 'none'} : {}}>
                          <Input type="textarea" name="block_text" value={this.state.city_hall.block_text} onChange={this.handleCityHallInputChange}/>
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
                         <Input name="district_name" type='text' disabled value={this.state.city_hall.district_name}
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
                          <h6>Descrição:</h6>
                        </Col>
                        <Col s={12}>
                          <Input name="description" type='textarea' value={this.state.city_hall.description}
                            className='city-hall' onChange={this.handleCityHallInputChange}/>
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
        {
          this.props.current_role.role === "adm_c3sl" ?
          <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
          :
          <div/>
        }
        <button className="waves-effect btn right button-color auto-size"  name="commit"  onClick={this.handleSubmit}
          type="submit"> {this.props.is_edit ? "Atualizar prefeitura" : "Criar prefeitura"}</button>
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
