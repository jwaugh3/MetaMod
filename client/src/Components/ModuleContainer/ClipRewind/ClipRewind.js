import React, { Component } from 'react'
import { getClipRewind } from '../../../api/apiCall';
import queryString from 'querystring';
//Components
import Clip from './Clip/Clip';
import Loading from '../../AssetComponents/Loading/Loading';
import Auxiliary from '../../../hoc/Auxiliary';
//Style
import styles from './ClipRewind.module.scss';
//Assets
import presentedBy from '../../../resources/presentedBy.png';
import rewind from '../../../resources/rewind.png';
import welcomeSign from '../../../resources/welcomeSign.png';
//State Management
import { connect } from 'react-redux'

export class ClipRewind extends Component {

    state = {
        loading: true,
        topClips: [],
        clipView: 0,
        noClips: false,
        timer: false,
        user: '',
        search: '',
        searching: true
    }

    componentDidMount = async () =>{

         //Get query from url
        let parsed = queryString.parse(window.location.search);
        var username = parsed['?user']

        this.setState({username: username, search: username}, async ()=>{
            await getClipRewind('https://api.metamoderation.com', this.state.search, this.state.username).then((response)=>{
            if(response === 'error' || response.clips.length === 0){
                this.setState({noClips: true, loading: false, searching: false})
            } else {
                this.setState({topClips: response.clips, loading: false, clipView: response.clips.length-1, searching: false})
            }
        })
        })


        setTimeout(()=>{
            this.setState({time: true})
        }, 4000)
    }

    changeClip = (action) => {
        switch(action){
            case 'next':
                if(this.state.clipView !== 0){
                    this.setState({clipView: this.state.clipView - 1})
                    this.setState({loading: true})

                    setTimeout(()=>{
                        this.setState({loading: false})
                    }, 2000)
                }
                return
            case 'back':
                if(this.state.clipView !== 4){
                    this.setState({clipView: this.state.clipView + 1})
                }
                return
        }
    }

    getClips = async (event) => {
        event.preventDefault()
        this.setState({loading: true, searching: true})

        await getClipRewind('https://api.metamoderation.com', this.state.username, this.state.search).then((response)=>{
            if(response === 'error' || response.clips.length === 0){
                this.setState({noClips: true, loading: false, searching: false})
            } else {
                this.setState({topClips: response.clips, loading: false, clipView: response.clips.length-1, noClips: false, searching: false})
            }
        })
    }

    render() {  
        let renderedClips
        let clipCount

        if(this.state.loading === false && this.state.noClips === false && this.state.time){
            renderedClips = <Clip slugID={this.state.topClips[this.state.clipView].id} changeClip={this.changeClip} clipCount={this.state.clipView+1}/>
        } else if(this.state.search === this.state.username) {
            renderedClips = 
            <div className={styles.welcome} id="welcomeID">
            <img className={styles.dance} src='https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x' alt="dance"/>
            <img className={styles.dance} src='https://cdn.betterttv.net/emote/5f1b0186cf6d2144653d2970/3x' alt="dance"/>
            <img className={styles.dance} src='https://cdn.betterttv.net/emote/55898e122612142e6aaa935b/3x' alt="dance"/>
            <img className={styles.dance} src='https://cdn.betterttv.net/emote/5a6edb51f730010d194bdd46/3x' alt="dance"/>
            <img className={styles.dance} src='https://cdn.betterttv.net/emote/5a6edb51f730010d194bdd46/3x' alt="dance"/>
            <img className={styles.dance} src='https://cdn.betterttv.net/emote/55898e122612142e6aaa935b/3x' alt="dance"/>
            <img className={styles.dance} src='https://cdn.betterttv.net/emote/5ada077451d4120ea3918426/3x' alt="dance"/>
            <img className={styles.dance} src='https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x' alt="dance"/>
                <img src={welcomeSign} className={styles.welcomeSign} alt="welcome"/>
                <img className={styles.dance} src='https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x' alt="dance"/>
                <img className={styles.dance} src='https://cdn.betterttv.net/emote/5f1b0186cf6d2144653d2970/3x' alt="dance"/>
                <img className={styles.dance} src='https://cdn.betterttv.net/emote/55898e122612142e6aaa935b/3x' alt="dance"/>
                <img className={styles.dance} src='https://cdn.betterttv.net/emote/5a6edb51f730010d194bdd46/3x' alt="dance"/>
                <img className={styles.dance} src='https://cdn.betterttv.net/emote/5a6edb51f730010d194bdd46/3x' alt="dance"/>
                <img className={styles.dance} src='https://cdn.betterttv.net/emote/55898e122612142e6aaa935b/3x' alt="dance"/>
                <img className={styles.dance} src='https://cdn.betterttv.net/emote/5ada077451d4120ea3918426/3x' alt="dance"/>
                <img className={styles.dance} src='https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x' alt="dance"/>
            </div>
        } else {
            renderedClips = null
        }

        //set background star pattern
        let backgroundMask = Array(105)
        let iterator = backgroundMask.keys()
        for(const key of iterator){
            backgroundMask[key] = <div className={styles.star} key={key}>+</div>
        }

        let floatingIcons = Array(45)
        let iconIterator = floatingIcons.keys()
        for(const key of iconIterator){
            floatingIcons[key] = <div className={styles.icon} key={key}>
                <img className={styles.dance} src='https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x' alt="dance"/>
            </div>
        }

        return (
            <div className={styles.pageContainer}>
                <div>
                    <img onClick={()=>window.location = 'https://metamoderation.com'} className={styles.presentedBy} src={presentedBy} alt="Presented By"/>
                    
                </div>
                <div className={styles.rewindContainer}>
                    <div className={styles.rewindText}>{this.state.search.charAt(0).toUpperCase() + this.state.search.slice(1)}'s 2020 Clip Rewind</div>
                    <img className={styles.rewindImg} src={rewind} alt="Rewind Icon"/>
                </div>

                {this.state.noClips && !this.state.loading ? <div className={styles.noClips}>hmmm.. Twitch didn't have any clip for {this.state.search}</div> 
                : 
                <Auxiliary>
                    {renderedClips}
                </Auxiliary>
                }

                <form className={styles.formInput}>
                    <input type="text" value={this.state.search} onChange={(event)=>this.setState({search: event.target.value})}/>
                    <button type="submit" className={styles.getClipsButton} onClick={(event)=>this.getClips(event)}>Get Rewind</button>
                </form>

                {this.state.loading && this.state.clipView !== this.state.topClips.length && !this.state.searching ? 
                <div className={styles.iconContainer}>
                    {floatingIcons}
                    <div className={styles.loadingContainer}>
                        <img className={styles.next} src='https://cdn.betterttv.net/emote/5abd36396723dc149c678e90/3x' alt="dance"/>
                        <div className={styles.nextClip}>NEXT CLIP!</div>
                        <img className={styles.next} src='https://cdn.betterttv.net/emote/5abd36396723dc149c678e90/3x' alt="dance"/>
                    </div>
                </div>
                : null}
                
                {backgroundMask}

                {/* {floatingIcons} */}

    
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentChannel: state.applicationReducer.currentChannel
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ClipRewind)
