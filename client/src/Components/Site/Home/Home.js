//Files
import React, {Component} from 'react';
//Components
import Site from '../Site';
import Navigation from '../Navigation/Navigation';
//Styles
import styles from './Home.module.css';
//Assets
import bannerArt from '../../../resources/bannerArt.png';

class Home extends Component {

    render() {
        return ( 
            <Site>
                <Navigation url={this.props.url} displayLogin={true}/>
                <div className={styles.homeBannerContainer}>
                    <div className={styles.callToAction}>
                        <h2>
                            Unify Your Moderation Team In One Place
                        </h2>
                        <p>
                            Currently in Beta
                        </p>
                        <button onClick={()=> {window.location = '/login'}}>
                            Try the Demo
                        </button>
                    </div>
                    <div className={styles.bannerArtContainer}>
                        <img src={bannerArt} className={styles.bannerArt} alt="banner"/>
                    </div>
                </div>
            </Site>
        );
    }
}
    
export default Home;