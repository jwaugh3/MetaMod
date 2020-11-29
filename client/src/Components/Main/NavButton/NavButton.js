import React, { Component } from 'react'

//Styles
import styles from './NavButton.module.css';

class NavButton extends Component {
    render() {
        return (
            <div className={styles.buttonContainer} onClick={()=>this.props.switchComponent(this.props.title)} style={this.props.title === this.props.activeTab ? {width: '105%', backgroundColor: '#535353'} : {}}>
              <div className={styles.navText}>{this.props.title}</div>
            </div>
        )
    }
}

export default NavButton;