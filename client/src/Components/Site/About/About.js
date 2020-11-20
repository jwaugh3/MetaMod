//Files
import React, {Component} from 'react';
//Components
import Site from '../Site';
import Navigation from '../Navigation/Navigation';
//Styles
import styles from './About.module.css';
//Assets


class About extends Component {

    render() {
        return ( 
            <Site>
                <Navigation url={this.props.url} displayLogin={true}/>
                <div className={styles.aboutContainer}>
                    <h1 className={styles.notice}>Page In Progress :O</h1>
                </div>
            </Site>
        );
    }
}
    
export default About;