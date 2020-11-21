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

	state={
		accepted: false
	}


    render() {

		let backendLink = []
		if(window.location.host !== 'localhost:3000'){
			let link = ''
			if(this.state.accepted){
				link = 'https://api.metamoderation.com/auth/login'
			}

			backendLink.push(
				<div className={styles.twitchLoginButton} key="prod" onClick={()=>window.location = link}>
					<img src={twitchLoginButton} className={styles.twitchLoginButtonImg} alt="twitch login"/>
				</div>
			)
		} else {
			let link = ''
			if(this.state.accepted){
				link = 'https://api.metamoderation.com/auth/login'
			}

			backendLink.push(
				<div className={styles.twitchLoginButton} key='local' onClick={()=>window.location = link}>
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
						<div className={styles.accept} onClick={()=>this.setState({accepted: !this.state.accepted},()=>{console.log(this.state.accepted)})}>
							
							<label>By logging in, you accept the <a onClick={()=>window.location = '/policy'} className={styles.policyLink}>Terms and Conditions and Privacy Policy</a></label>
						</div>
					</div>
				</div>
			</Site>
        );
    }
}
    
export default Login;