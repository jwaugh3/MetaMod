//Files
import React, {Component} from 'react';
//Components
import Site from '../Site';
import Navigation from '../Navigation/Navigation';
//Styles
import styles from './Contact.module.css';
//Assets


class Contact extends Component {

    render() {
        return ( 
            <Site>
                <Navigation url={this.props.url} displayLogin={true}/>
                <div className={styles.contactContainer}>
                    <h1 className={styles.notice}>Page In Progress :P</h1>
                </div>
            </Site>
        );
    }
}
    
export default Contact;