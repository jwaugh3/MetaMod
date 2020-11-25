//Files
import React, {Component} from 'react';
//Components

//Styles
import styles from './TopNav.module.css';
//Assets

class TopNav extends Component {

    render() {
        return ( 
            <div className={styles.topNavbar}>
                <div className={styles.topNavButtonContainer}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default TopNav;