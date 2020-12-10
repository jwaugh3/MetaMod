import React, { Component } from 'react';
//Style
import styles from './SingleSelectDropdown.module.css';

export default class SingleSelectDropdown extends Component {

    state={
        showMenu: false
    }

    toggleMenu = () => {
        this.setState({showMenu: !this.state.showMenu})
    }
    
    render() {
        
        let renderedOptions = []
        renderedOptions = this.props.options.map((option)=>{
            if(option !== this.props.selected){
                return <div className={styles.option} key={option} onClick={()=>{
                    this.props.onSelect(option, this.props.badgeNum)
                    this.toggleMenu()
                }}> {option} </div>
            } else {
                return null
            }
        })

        return (
            <div className={styles.menuContainer}>
                <div className={styles.menu} onClick={this.toggleMenu}>{this.props.selected}</div>
                {this.state.showMenu ? 
                    <div className={styles.menu}>
                        {renderedOptions}
                    </div>
                : null
                }
            </div>
        )
    }
}
