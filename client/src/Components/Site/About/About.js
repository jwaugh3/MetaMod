//Files
import React, {Component} from 'react';
//Components
import Site from '../Site';
import Navigation from '../Navigation/Navigation';
//Styles
// import styles from './About.module.css';
//Assets


class About extends Component {

    render() {
        return ( 
            <Site>
                <Navigation url={this.props.url} displayLogin={true}/>
                <div>

                </div>
            </Site>
        );
    }
}
    
export default About;