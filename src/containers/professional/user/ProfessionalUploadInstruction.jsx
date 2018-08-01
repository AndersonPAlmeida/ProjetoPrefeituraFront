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
import { Card, Row, Col, Collapsible, CollapsibleItem, Collection, CollectionItem} from 'react-materialize'
import styles from './styles/ProfessionalUploadInstruction.css'
import 'react-day-picker/lib/style.css'
import {apiHost, apiPort, apiVer } from '../../../../config/env';
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';
import update from 'react-addons-update';
import { ErrorTable, SpreadsheetIcon } from '../../components/AgendadorComponents'
import { ExcelIcon,CalcIcon} from '../../images'
class getProfessionalUploadInstruction extends Component {
  constructor(props) {
      super(props)

      this.downloadFile = this.downloadFile.bind(this);
  }

  componentDidMount(){

   }


  mainComponent() {
    return (
      <div className='card card-user'>
          <div className='card-content'>
        <div className='no-border card-action'>
            <h2 className='card-title h2-title-home'>Instruções para importação </h2>
            {this.generalInstruction()}
            {this.examplesFiles()}
            {this.observations()}
        </div>
        </div>
        <div className="card-action">
            <a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)}> Voltar </a>
        </div>
      </div>
      )
  }

prev() {
      browserHistory.push(`/professionals/users/upload`)
}
observations(){
    return(
        <div className="observations">
                        <p><strong>Observações:</strong></p>
                        <p>1) A data de nascimento deve ser preenchida utilizando números e barras ("/"), seguindo o formato brasileiro, ou seja dia/mês/ano </p>
                        <p>2) As únicas colunas opcionais são: Telefone 2, Deficiência, E-mail e Observações</p>
                        <p>3) Não preencha a coluna Deficiência se o cidadão não tiver deficiência</p>
                        <p>4) Não mude o cabeçalho do modelo</p>
                        <p>5) Não pule linhas, isso dificultará para encontrar o erro, caso ocorra algum</p>
                    </div>
    )
}
examplesFiles(){
    return(
        <Collection id='examples-collection'>
            <CollectionItem className='center-align' id='green-header'>Modelos para Download</CollectionItem>
            <CollectionItem  className='center-align'>
                <Row>
                    <Col className='center-align' offset={'s3 m3'} s={3} m={3}>
                        <SpreadsheetIcon icon={ExcelIcon} alt="Excel Icon" function={this.downloadExampleFile.bind(this,'xls')} >
                            xls
                        </SpreadsheetIcon>
                    </Col>
                    <Col className='center-align' s={3}  m={3}>
                        <SpreadsheetIcon icon={CalcIcon} alt="Calc Icon" function={this.downloadExampleFile.bind(this,'ods')}>
                            ods
                        </SpreadsheetIcon>
                    </Col>
                </Row>
            </CollectionItem>
        </Collection>

    )
}

downloadExampleFile(extension) {
   const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
   const params = `permission=${this.props.user.current_role}`
   let collection = `citizen_uploads/example_${extension}`;
   let example_file;
   fetch(`${apiUrl}/${collection}?${params}`, {
       headers: {
         "Accept": `application/${extension}`,
         "Content-Type": "application/json" },
       method: "get",
   }).then(resp => {
     var contentType = resp.headers.get("content-type");
     if(resp.status == 200 && contentType && ( contentType.indexOf(`application/xls`) !== -1 || contentType.indexOf(`application/vnd.oasis.opendocument.spreadsheet`) !== -1)) {
       resp.blob().then(content => {
         example_file = URL.createObjectURL(content);
         this.downloadFile(example_file,extension)
       })
     }
   }).catch(e => {})
}

downloadFile(absoluteUrl,extension) {
    let link = document.createElement('a');
    link.href = absoluteUrl;
    link.data = `application/${extension}`;
    link.download = `Importacao.${extension}` ;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
 }

generalInstruction(){
    return(
        <Collapsible>
            <CollapsibleItem  className='collapsible-green' header='1) Instrução geral para importar' >
                <Collection>
                  <CollectionItem>1 - Baixe uma das versões do modelo</CollectionItem>
                  <CollectionItem>2 - Complete as colunas¹²³</CollectionItem>
                  <CollectionItem>3 - Salve utilizando o formato .csv</CollectionItem>
                  <CollectionItem>4 - Importe para o sistema</CollectionItem>
                  <CollectionItem>5 - Peça ao usuário que atualize sua senha o mais rápido possível, pois todos os usuário importados tem a senha <b>123456</b></CollectionItem>
                </Collection>
            </CollapsibleItem>
            <CollapsibleItem className='collapsible-green' header='2) Possíveis mensagens de erro'>
                <ErrorTable></ErrorTable>
            </CollapsibleItem>
            <CollapsibleItem  className='collapsible-green' header='3) Instrução para salvar em .csv'>
                <Collection>
                  <CollectionItem>1 - Clique em salvar como</CollectionItem>
                  <CollectionItem>2 - Digite o nome do arquivo e mude o formato para CSV (comma-separated value) </CollectionItem>
                  <CollectionItem>3 - Clique em salvar</CollectionItem>
                  <CollectionItem>4 - Se alguma janela aparecer pedindo confirmação para salvar no formato .csv, confirme</CollectionItem>
                  <CollectionItem>5 - Caso apareça uma tela de configuração de CSV, configure-o como:<br/>
                                  <b>Conjunto de caracteres</b>: UTF-8<br/>
                                  <b>Delimitador de campos</b>: Vírgula ( , )<br/>
                                  <b>Delimitador de texto</b>: Aspas duplas ( '"' )<br/>
                                  <b>Salvar apenas o conteúdo mostrado</b>
                  </CollectionItem>
                  <CollectionItem>6 - Clique em OK ou Salvar</CollectionItem>
                </Collection>
            </CollapsibleItem>
        </Collapsible>
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

const ProfessionalUploadInstruction = connect(
  mapStateToProps
)(getProfessionalUploadInstruction)
export default ProfessionalUploadInstruction
