//Files
import React, {Component} from 'react';
//Components

//Styles
import styles from './Site.module.css';
//Assets


class Site extends Component {
    
//general styling wrapper

    render() {
        return ( 
            <div className={styles.homeBackground}>
                <div className={styles.homePageContainer}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
    
export default Site;