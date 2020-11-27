//Files
import React, {Component} from 'react';
//Components
//Styles
import styles from './ModuleContainer.module.scss';
//Assets


class ModuleContainer extends Component {

    render() {
        return ( 
            <div className={styles.moduleContainer}>
                {this.props.children}
            </div>
        );
    }
}
    
export default ModuleContainer;