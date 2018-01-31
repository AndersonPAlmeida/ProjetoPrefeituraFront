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
        </div>
      </div>
      )
  }


  onDrop(file) {
    const reader = new FileReader();
    reader.onload = () => {
      // var firstLine = reader.result.split('\n').shift();
      console.log("Começo: " + Date());
      var secondLine = reader.result.split('\n')[1];
      const regex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}.[0-9]{5}-[0-9]{3}/g;

      var result = regex.exec(secondLine.toString())[0];

      if (result == null){
        console.log("error: NULL: ");
      }else{
        var delimiter = result[10];
      }

      parse(reader.result,{delimiter: delimiter}, (err,data) =>{

        console.log("Final: " + Date());
        this.setState({lines:data});
      });
    };

    reader.readAsBinaryString(file[0]);
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
