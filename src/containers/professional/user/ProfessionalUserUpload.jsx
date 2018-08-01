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
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination } from 'react-materialize'
import styles from './styles/ProfessionalUserUpload.css'
import 'react-day-picker/lib/style.css'
import {apiHost, apiPort, apiVer } from '../../../../config/env';
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';
import update from 'react-addons-update';

class getProfessionalUserUpload extends Component {
  constructor(props) {
      super(props)
      this.state = {
          aux: {
              file: undefined,
              file_obj: undefined,
              file_has_changed: 0,
              file_was_sended: 0
          },
          name:"",
          uploads: [],
          professionals: {},
          num_entries: 0,
          current_page: 1,
          timerID: null
      };
      this.fileUpload = null;
      this.handleFile = this.handleFile.bind(this);
      this.dispatchUploadFileClick = this.dispatchUploadFileClick.bind(this);
      this.uploadCitizens = this.uploadCitizens.bind(this);
      this.hashfyProfessionals = this.hashfyProfessionals.bind(this);
      this.downloadFile = this.downloadFile.bind(this);
      this.updatetable = this.updatetable.bind(this);
      this.setButtonFile = element =>{
          this.fileUpload = element;
      };


  }

  componentDidMount(){
       this.timerID = setInterval(()=> this.updatetable(), 5000)
       this.updatetable();
   }

//componentWillUnmount is used to destroy timers, to not continue running after go to other page 
componentWillUnmount(){
    clearInterval(this.timerID );
}

updatetable() {
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const params = `permission=${this.props.user.current_role}`
                        +`&page=${this.state.current_page}`
    var collection = `citizen_uploads`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
              uploads: resp.entries,
              num_entries: resp.num_entries
            })
    });
    if(this.props.current_role && this.props.current_role.role == 'adm_c3sl') {
        collection = `professionals`;
        fetch(`${apiUrl}/${collection}?${params}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json" },
            method: "get",
        }).then(parseResponse).then(resp => {
            let hash = this.hashfyProfessionals(resp.entries)
          this.setState({
                  professionals: hash,
            })
        });
    }
  }

  hashfyProfessionals(listProfessionals){
     //When getting all professional except the current on, so is needed to add him.
     let professional = {
            id:this.props.user.professional.id,
            registration:this.props.user.professional.registration,
            active:this.props.user.professional.active,
            cpf:this.props.user.citizen.cpf,
            name:this.props.user.citizen.name,
            email:this.props.user.citizen.email,
            occupation_name: this.props.user.professional.occupation_name,
            phone1:this.props.user.citizen.phone1,
            role_name:[]
        };

     listProfessionals.push(professional)
     let hash = {};

     listProfessionals.map((professional) => {
        hash[professional.id]=professional;
    })
    return hash;
  }

  mainComponent() {
    return (
      <div className='card card-user'>
          <div className='card-content'>
        <div className='no-border card-action'>
            <h2 className='card-title h2-title-home'> Upload de Cidadãos </h2>
            <p>Abaixo você poderá realizar o upload da tabela contendo vários cidadãos da sua cidade! <b><a className="red-link" onClick={() =>
             browserHistory.push({pathname: `/professionals/users/upload_instruction`})}>
              Instruções e Modelo</a></b></p>
        </div>
          {this.citizenUploadButton()}
          {this.state.uploads.length > 0 ? this.tableList() : 'Nenhum Upload encontrado'}
        </div>
        <div className="card-action">
        </div>
      </div>
      )
  }

  handleInputFilterChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(target.validity.valid) {
      this.setState({
        [name]: value
      })
    }
  }

  uploadCitizens() {
       const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
       const params = `permission=${this.props.user.current_role}`
       var collection = 'citizen_uploads';
       let file = this.state.aux.file_obj;

       var formData = new FormData();
       formData.append("file",file);
       if(!(this.state.aux.file_was_sended)){
         if(file){
               fetch(`${apiUrl}/${collection}?${params}`, {
                   method: 'post',
                   body: formData
                 }).then(parseResponse).then(resp => {
                    var full_succesful_msg = "Enviando Arquivo";
                    $("#toast-container").remove();
                    Materialize.toast(full_succesful_msg, 10000, "green",function(){$("#toast-container").remove()});
                    this.setState({
                        aux: update(
                            this.state.aux, {
                                file_was_sended: {$set: 1}
                             }
                        )
                     })
                    this.updatetable()
                     full_succesful_msg = "Arquivo enviado";
                     $("#toast-container").remove();
                     Materialize.toast(full_succesful_msg, 10000, "green",function(){$("#toast-container").remove()});
                 }).catch(({errors}) => { // TODO: UPDATE ERRORS ARRAY ACCORDING TO API
                   if(errors) {
                       let full_error_msg = "";
                       $("#toast-container").remove();
                       errors.forEach(function(elem){ full_error_msg += elem + '\n' });
                       Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
                   }
                 });
         }else{
             let full_error_msg = "Não existe arquivo para enviar";
             $("#toast-container").remove();
             Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
         }
       }else{
           let full_error_msg = "Arquivo já enviado";
           $("#toast-container").remove();
           Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
       }

  }

  dispatchUploadFileClick(){
    this.fileUpload.click();
  }


  handleFile(event) {
    const target = event.target;
    const name = target.name;
    var value = target.files[0];
    if(value != undefined){
    this.setState({
      aux: update(
        this.state.aux, {
          [name]: {$set: value.name},
          file_obj: {$set: value},
          file_has_changed: {$set: 1},
          file_was_sended: {$set: 0}
        }
      )
    })
    }
  }

citizenUploadButton() {
      return (
        <Row>
            <Col>
                <input
                    type='file'
                    name='file'
                    accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                    style={{display: "none"}}
                    ref={this.setButtonFile}
                    onChange={this.handleFile}
                />
            </Col>
            <Col>
                <a className="waves-effect button-green new-upload-button btn"  onClick={this.dispatchUploadFileClick}>Escolher Arquivo</a>
                <Input type="text" id="citizen_upload" disabled value={this.state.aux.file} className="file-name"/>
            </Col>
            <Col>
                <a className="waves-effect button-color new-upload-button send-button btn" onClick={this.uploadCitizens}>Enviar</a>
            </Col>
        </Row>
      )
  }

 citizenDownloadButton(upload_id) {
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const params = `permission=${this.props.user.current_role}`
    let collection = `citizen_uploads`;
    let error_file;
    fetch(`${apiUrl}/${collection}/${upload_id}?${params}`, {
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json" },
        method: "get",
    }).then(resp => {
      var contentType = resp.headers.get("content-type");
      if(resp.status == 200 && contentType && contentType.indexOf("text/plain") !== -1) {
        resp.blob().then(content => {
          error_file = URL.createObjectURL(content);
          this.downloadFile(error_file)
        })
      }
    }).catch(e => {})
}


downloadFile(absoluteUrl) {
    var link = document.createElement('a');
    link.href = absoluteUrl;
    link.data = "text/csv";
    link.download = 'log_de_erros.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
 }

sortableColumn(title, name) {
    return (
      <a
        href='#'
        onClick={
          () => {
            this.setState({
              ['filter_s']: this.state.filter_s == `${name}+asc` ? `${name}+desc` : `${name}+asc`
            })
          }
        }
      >
        {title}
        {
          this.state.filter_s == `${name}+asc` ?
            <i className="waves-effect material-icons tiny tooltipped">
              arrow_drop_down
            </i>
            :
            this.state.filter_s == `${name}+desc` ?
              <i className="waves-effect material-icons tiny tooltipped">
                arrow_drop_up
              </i>
              :
              <div />
        }
      </a>
    )
}

formatDate(uploaded_day) {
  let upload_day = strftime.timezone('+0000')('%d/%m/%Y - %H:%M', new Date(uploaded_day));
  return (upload_day);
}

formatStatus(status) {
  let status_text= "";
  if(status==0){
      status_text= "Aguardando";
  }
  if(status==1){
      status_text= "Pré-processamento";
  }
  if(status==2){
      status_text= "Em progresso";
  }
  if(status==3){
      status_text= "Terminado com sucesso";
  }
  if(status==4){
      status_text= "Terminado com erro";
  }
  return (status_text);
}

tableList() {
    var num_items_per_page = 25
    var num_pages = Math.ceil(this.state.num_entries/num_items_per_page)
    const data = (
        this.state.uploads.map((upload) => {
          return (
            <tr key={upload.id}>
            <td>
                {this.formatDate(upload.created_at)}
            </td>
              <td>
                 {this.formatStatus(upload.status)}
              </td>
              <td>
                 {Math.ceil(upload.progress)}%
              </td>
              {
                this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] &&
                this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
                <td>
                    {this.state.professionals[upload.professional_id].name}
                </td> :
                  null
              }
              <td>
                 {(upload.amount)} cidadãos
              </td>
              <td>
                  {upload.status !== 4 ?
                      <a  className=' btn-flat disabled'>
                        <i disabled value={upload.status !== 4}  className="material-icons">
                           insert_drive_file
                        </i>
                    </a>
                      :
                  <a className='back-bt waves-effect btn-flat'
                     onClick={(e) =>
                       {
                         e.preventDefault()
                         this.citizenDownloadButton(upload.id)
                       }
                     }>
                    <i  className="material-icons">
                       insert_drive_file
                    </i>
                  </a>
              }
              </td>

            </tr>
          )
        })
    )


    // Fields to show in the table, and what object properties in the data they bind to
    const fields = (
        <tr>
        <th>{this.sortableColumn.bind(this)('Data de upload','created_at')}</th>
        <th>{this.sortableColumn.bind(this)('Status','status')}</th>
        <th>Progresso</th>
        {
          this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] &&
          this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
          <th>
            Profissional
            </th> :
            null
        }
        <th>Quantidade</th>
        <th> Log </th>
      </tr>
    )
    return (
      <div>
          <p className={styles['description-column']}>
            Mostrando
            {
              num_pages != 0
                ?
                  this.state.current_page == num_pages
                    ?
                      this.state.num_entries % num_items_per_page == 0 ? ` ${num_items_per_page} ` : ` ${this.state.num_entries % num_items_per_page} `
                    :
                      ` ${num_items_per_page} `
                :
                  ' 0 '

            }
            de {this.state.num_entries} registros
          </p>
          <br />
            <div className='div-table'>
              <table className={styles['table-list']}>
                <thead>
                  {fields}
                </thead>
                <tbody>
                  {data}
                </tbody>
              </table>
            </div>
          <br />
          <Pagination
            value={this.state.current_page}
            onSelect={ (val) =>
              {
                this.setState(
                  {
                    current_page: val
                  },
                  () => {this.updatetable()}
                )
              }
            }
            className={styles['pagination']}
            items={Math.ceil(this.state.num_entries/num_items_per_page)}
            activePage={this.state.current_page}
            maxButtons={8}
          />

      </div>
    )
}


render() {
    return (
      <main>
          <Row>
            <Col s={12}>
            {this.mainComponent()}
              </Col>
        </Row>
      </main>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  const current_role = user.roles[user.current_role_idx]
  return {
    user,
    current_role
  }
}

const ProfessionalUserUpload = connect(
  mapStateToProps
)(getProfessionalUserUpload)
export default ProfessionalUserUpload
