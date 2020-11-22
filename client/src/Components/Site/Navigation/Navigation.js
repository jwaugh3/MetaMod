//Files
import React, {Component} from 'react';
//Components

//Styles
import styles from './Navigation.module.scss';
//Assets
import logo from '../../../resources/Logo.png';


class Navigation extends Component {

    render() {

        return ( 
            <nav className={styles.navContainer}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoSubContainer} onClick={()=>window.location = 'home'}>
                        <img src={logo} className={styles.logo} alt="logo"/>
                        <div className={styles.textContainer}>
                            <h1 className={styles.logoText}>MetaMod</h1>
                        </div>
                    </div>
                    
                </div>
                <div className={styles.navOptionsContainer}>
                    <ul className={styles.optionsList}>
                        <li className={styles.optionContainer} onClick={()=>window.location = 'beta'}>
                            <p className={styles.optionText}>Beta</p>
                            <div className={styles.active} style={window.location.pathname === '/beta' ? {visibility: 'visible'} : {visibility: 'hidden'}}></div>
                        </li>
                        <li className={styles.optionContainer} onClick={()=>window.location = 'about'}>
                            <p className={styles.optionText}>Wth is MetaMod?</p>
                            <div className={styles.active} style={window.location.pathname === '/about' ? {visibility: 'visible'} : {visibility: 'hidden'}}></div>
                        </li>
                        <li className={styles.optionContainer} onClick={()=>window.location = 'contact'}>
                            <p className={styles.optionText}>Contact</p>
                            <div className={styles.active} style={window.location.pathname === '/contact' ? {visibility: 'visible'} : {visibility: 'hidden'}}></div>
                        </li>
                    </ul>
                </div>
                <div className={styles.loginButtonContainer}>
                    <button className={styles.loginButton} onClick={()=>window.location = 'login'} style={this.props.displayLogin ? {visibility: 'visible'} : {visibility: 'hidden'}}>Login</button>
                </div>
            </nav>
        );
    }
}
    
export default Navigation;