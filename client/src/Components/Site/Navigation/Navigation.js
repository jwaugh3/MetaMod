//Files
import React, {Component} from 'react';
//Components

//Styles
import styles from './Navigation.module.css';
//Assets


class Navigation extends Component {

    render() {

        console.log(window.location.pathname)

        return ( 
            <nav className={styles.navContainer}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.logoText} onClick={()=>window.location = 'home'}>
                        MetaMod
                        <div className={styles.activeLogo} style={window.location.pathname === '/home' || window.location.pathname === '/' ? {visibility: 'visible'} : {visibility: 'hidden'}}></div>
                    </h1>
                    
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