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
