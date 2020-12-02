import React, { Component } from 'react'
//Styling
import styles from './Dropdown.module.scss';

export default class Dropdown extends Component {
      
      state = {
        showMenu: false
      }

    showMenu = (event) => {
      event.preventDefault();
      this.setState({ showMenu: true });
    }
    
    closeMenu = (event) => {
        this.setState({ showMenu: false });   
    }


    render() {

        let renderOptions = this.props.options.map((option)=>{
            return <label htmlFor={option} key={option} className={styles.option}><input type="checkbox" id={option} onChange={(event)=>this.props.onSelect(event, option)} checked={this.props.filter.includes(option) ? true : false}/>{option}</label>
        })

        return (
          <div className={styles.dropdownContainer}>
            <button className={styles.dropdownButton} onClick={this.state.showMenu ? this.closeMenu : this.showMenu}>
              Filter
            </button>
            
            {
              this.state.showMenu
                ? (
                    <div className={styles.formContainer}>
                        <form>
                            {renderOptions}
                        </form>
                    </div>
                )
                : (
                  null
                )
            }
          </div>
        );
      }
    }
