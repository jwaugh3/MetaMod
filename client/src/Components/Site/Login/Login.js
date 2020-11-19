//Files
import React, {Component} from 'react';
//Components
import Site from '../Site';
import Navigation from '../Navigation/Navigation';
//Styles
import styles from './Login.module.css';
//Assets
import twitchLoginButton from '../../../resources/twitchLoginButton.png';
import loginArt from '../../../resources/loginArt.png';

class Login extends Component {

    render() {

		let backendLink = []
		if(window.location.host !== 'localhost:3000'){
			// console.log('here')
			backendLink.push(
				<div className={styles.twitchLoginButton} key="prod" onClick={()=>window.location = 'https://api.metamoderation.com/auth/login'}>
					<img src={twitchLoginButton} className={styles.twitchLoginButtonImg} alt="twitch login"/>
				</div>
			)
		} else {
			// console.log('local')
			backendLink.push(
				<div className={styles.twitchLoginButton} key='local' onClick={()=>window.location = 'http://localhost:5000/auth/login'}>
					<img src={twitchLoginButton} className={styles.twitchLoginButtonImg} alt="twitch login"/>
				</div>
			)
		}
		
        return ( 
			<Site>
				<Navigation url={this.props.url} displayLogin={false}/>
				<div className={styles.loginContainer}>
					<div className={styles.loginArtContainer}>
						<img src={loginArt} className={styles.loginArt} alt="login"/>
						<div className={styles.twitchLoginButtonContainer}>
							{backendLink}
						</div>
					</div>
				</div>
			</Site>
        );
    }
}
    
export default Login;