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
import {GovernmentBar, Header, Footer} from './Common.js'
import Menu from './Menu'
export default class Home extends React.Component {
  render() {
    return (
      <div>
        <GovernmentBar />
        <div>
          {this.props.showHeader ? <Header /> : <div />}
          {this.props.showMenu ? <Menu /> : <div />}
          {this.props.children}
          <Footer footerItems={this.props.footerItems} />
        </div>
      </div>
    )
  }
}
