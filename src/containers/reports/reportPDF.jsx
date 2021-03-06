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

import React, {Component, PropTypes} from 'react'
import {Button} from 'react-materialize'
import { findDOMNode } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import { LogoImage } from '../images';

class ReportPDF extends Component{
  constructor(props) {
    super(props)
    this.pdfToHTML=this.pdfToHTML.bind(this);
    this.typeofButton=this.typeofButton.bind(this)
  }

   convertImgToDataURLviaCanvas(url, callback, outputFormat) {
   var img = new Image();
   img.crossOrigin = 'Anonymous';
   img.onload = function() {
     var canvas = document.createElement('CANVAS');
     var ctx = canvas.getContext('2d');
     var dataURL;
     canvas.height = this.height;
     canvas.width = this.width;
     ctx.drawImage(this, 0, 0);
     dataURL = canvas.toDataURL(outputFormat);
     canvas = null;
     return(dataURL);
   };
   img.src = url;
   return(img)
  }

  addZeroBefore(time){
    var newTime = time.toString()
    if(newTime.length == 1){
      newTime = "0" + time
    }
    return(newTime)
  }


  formatDateTime(dateTime){
    var dateText = new Date(dateTime)
    var returnText = this.addZeroBefore(dateText.getHours()) + ":" + this.addZeroBefore(dateText.getMinutes()) + " - " + dateText.getDate() + "/" + (dateText.getMonth() + 1) + "/" + dateText.getFullYear()
    //console.log(returnText)
    return(returnText)
  }

  pdfToHTML(h1, h2, cols, rows, filename, o){
    var orientation
    if(o){
      orientation = o
    }else{
      orientation = 'p'
    }

    var jspdf = require('jspdf')
    var jspdfautotable = require('jspdf-autotable')
    var doc = new jspdf(orientation, 'pt','a4');
    var nowTime = new Date()
    var dateURL = "Criado em " + window.location.href + "  " + this.formatDateTime(nowTime)
    var dataImage = this.convertImgToDataURLviaCanvas(LogoImage, function(image){return(image)}, 'png')

    doc.autoTable(cols, rows, {
      headerStyles: {fillColor: [146, 191, 35]},
      margin: {top: 60},
      addPageContent: function(data) {
      //header
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      doc.text(h1, data.settings.margin.left + 50, 30);
      doc.text(h2, data.settings.margin.left + 50, 50);
      if (dataImage) {
              doc.addImage(dataImage, 'png', data.settings.margin.left, 15, 35, 35);
      }

      //footer
      var str = "Página " + data.pageCount;
      doc.setFontSize(10);
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      doc.text(dateURL, data.settings.margin.left + 100, doc.internal.pageSize.height - 10)
    }
  })
    console.log(doc)
    doc.save(filename);
  }

  typeofButton(icon=null){
      //If you want another icon you need to specif them here
      if(icon === "print"){
          return (
              <a className='back-bt waves-effect btn-flat' onClick={() => {this.pdfToHTML(this.props.h1, this.props.h2, this.props.cols, this.props.rows, this.props.filename, this.props.o)}}>
                  <i className="waves-effect material-icons tooltipped">
                    print
                  </i>
              </a>
          );
      }else {
          return (
            <Button onClick={() => {this.pdfToHTML(this.props.h1, this.props.h2, this.props.cols, this.props.rows, this.props.filename, this.props.o)}}>
            Relatório em PDF
          </Button>
      );
      }

  }

  render(){
    return(
        this.typeofButton(this.props.icon)
    );
  }

}

export default ReportPDF
