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
                            Celebrate Your Amazing Year Of Streaming
                        </h2>
                        <img className={styles.dance} src='https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x' alt="dance"/>
                        <img className={styles.dance} src='https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x' alt="dance"/>
                        <img className={styles.dance} src='https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x' alt="dance"/>
                        <p>
                            Checkout Your Twitch Clip Rewind!
                        </p>
                        <button onClick={()=> {window.location = 'https://api.metamoderation.com/clipAuth/clipRewindLogin'}}>
                            See My Rewind
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