import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Row, Col} from 'react-materialize';
import { browserHistory } from 'react-router';
import parse from 'csv-parse';
import Dropzone from 'react-dropzone'
import UserForm from '../../utils/UserForm'

class getProfessionalUserUpload extends Component {
  constructor(props) {
      super(props)
      this.state = {
          lines: [],
          files: [],
          num_entries: 0
      };
      this.onDrop = this.onDrop.bind(this)
  }

  mainComponent() {
    return (
      <div className='card card-user'>
         <div className='card-content'>

           <section>
             <div className="dropzone">
               <Dropzone onDrop={this.onDrop.bind(this)}>
                 <p>Try dropping some files here, or click to select files to upload.</p>
               </Dropzone>
             </div>
            <aside>
              <h2>Dropped files</h2>
              <ul>{this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)}</ul>
            </aside>
          </section>
          {/* <h2 className='card-title h2-title-home'> Cidadãos</h2>
          {this.filterCitizen()}
          {this.state.citizens.length > 0 ? this.tableList() : 'Nenhum cidadão encontrado'} */}
        </div>
        {/* <div className="card-action">
          {this.newCitizenButton()}
        </div> */}
      </div>
      )
  }


  onDrop(file) {
    const reader = new FileReader();
    reader.onload = () => {

      var text = reader.result;                 // the entire file
      var firstLine = text.split('\n').shift(); // first line
      console.log("linha: " + firstLine);
      parse(reader.result, {delimiter: '|'}, (err, data) => {

        console.log("teste" + data[0][1]);
        console.log((data[0]).length);
        this.setState({lines:data});
        });
    };

    reader.readAsText(file, 'UTF-8');
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
  return {
    user
  }
}
const ProfessionalUserUpload = connect(
  mapStateToProps
)(getProfessionalUserUpload)
export default ProfessionalUserUpload
