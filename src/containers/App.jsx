import React from 'react';
import styles from './App.css';
export default class App extends React.Component {
  render() {
    return <div className={styles.app}>{this.props.children}</div>;
  }
}
App.propTypes = {
  children: React.PropTypes.any,
};
