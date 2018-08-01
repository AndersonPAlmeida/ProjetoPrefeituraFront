/*
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
 */

import React from "react";
import PropTypes from 'prop-types';
import Spinner from "react-loader";
import extend from "extend";

class ButtonLoader extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    spinConfig: PropTypes.object,
    spinColorDark: PropTypes.string,
    spinColorLight: PropTypes.string,
    spinColorDisabled: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    loading: false,
    spinConfig: {
      lines: 10,
      length: 4,
      width: 2,
      radius: 3
    },
    spinColorDark: "#444",
    spinColorLight: "#444",
    spinColorDisabled: "#999",
    children: <span>Submit</span>,
    style: {}
  };

  getColor () {
    if (this.props.disabled) {
      return this.props.spinColorDisabled;
    } else if (this.props.primary || this.props.secondary) {
      return this.props.spinColorLight;
    } else {
      return this.props.spinColorDark;
    }
  }

  handleClick (ev) {
    ev.preventDefault();
    this.props.onClick(ev);
  }

  render () {
    let color = this.getColor();
    var { loading, primary, spinConfig, spinColorDark, spinColorLight, spinColorDisabled, ...other } = this.props;
    return (
      <div className='clear'>
        <button
          className='login-button right waves-effect btn'
          disabled={this.props.disabled || this.props.loading}
          {...other}
          onClick={this.handleClick.bind(this)}>
          {this.props.children}
        </button>
      </div>
    );
  }
}

export default ButtonLoader;
