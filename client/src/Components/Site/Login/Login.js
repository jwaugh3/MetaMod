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
        return ( 
			<Site>
				<Navigation url={this.props.url} displayLogin={false}/>
				<div className={styles.loginContainer}>
					<div className={styles.loginArtContainer}>
						<img src={loginArt} className={styles.loginArt} alt="login"/>
						<div className={styles.twitchLoginButtonContainer}>
							<div className={styles.twitchLoginButton}  onClick={()=>window.location = 'http://localhost:5000/auth/login'}>
								<img src={twitchLoginButton} className={styles.twitchLoginButtonImg} alt="twitch login"/>
							</div>
						</div>
					</div>
				</div>
			</Site>
        );
    }
}
    
export default Login;