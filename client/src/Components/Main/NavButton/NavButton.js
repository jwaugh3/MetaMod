import React, { Component } from 'react'
//Styles
import styles from './NavButton.module.css';
//State Management
import { connect } from 'react-redux';

class NavButton extends Component {

    switchComponent = (newComponent) => {
        this.props.setActiveTab(newComponent)
      }

    render() {
        return (
            <div className={styles.buttonContainer} onClick={()=>this.switchComponent(this.props.title)} style={this.props.title === this.props.activeTab ? {width: '105%', backgroundColor: '#535353'} : {}}>
              <div className={styles.navText}>{this.props.title}</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        activeTab: state.applicationReducer.activeTab
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setActiveTab: (newTab) => dispatch({type: 'SET_ACTIVE_TAB', payload: newTab})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavButton);