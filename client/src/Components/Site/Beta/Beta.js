//Files
import React, {Component} from 'react';
//Components
import Site from '../Site';
import Navigation from '../Navigation/Navigation';
//Styles
import styles from './Beta.module.css';
//Assets


class Beta extends Component {

    render() {
        return ( 
            <Site>
                <Navigation url={this.props.url} displayLogin={true}/>
                <div className={styles.betaContainer}>
                    <h1 className={styles.notice}>Page In Progress :D</h1>
                </div>
            </Site>
        );
    }
}
    
export default Beta;