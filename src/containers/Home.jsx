import React, {Component} from 'react'
import {GovernmentBar, Header, Footer} from './Common.js'
export default class Home extends React.Component {
  render() {
  const footerItems = [
                        { 'name': 'Perguntas e Respostas', 'link': '/agendador/faq' },
                        { 'name': 'Contato', 'link': '/agendador/contact' },
                        { 'name': 'Comunicar um erro', 'link': '/agendador/report' },
                        { 'name': 'Manual', 'link': '/agendador/manual' }
                      ]
    return (
      <div>
        <GovernmentBar />
        <div>
          <Header />
          {this.props.children}
          <Footer footerItems={footerItems} />
        </div>
      </div>
    )
  }
}
