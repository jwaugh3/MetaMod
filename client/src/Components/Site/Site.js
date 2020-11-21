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
                    <div>
                        <p className={styles.policyLink}><a onClick={()=>window.location = '/policy'}>Review our Policies</a></p>
                    </div>
                </div>
            </div>
        );
    }
}
    
export default Site;