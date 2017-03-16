import React, {Component} from 'react'
import Login from './Login'
import {GovernmentBar, Header, Footer} from './Common.js'
import SignUpForm from './SignUpForm.js'
import SignUp from './SignUp.js'

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <GovernmentBar />
        <div>
          <Header />
          <SignUpForm />
          <Footer />
        </div>
      </div>
    )
  }
}
