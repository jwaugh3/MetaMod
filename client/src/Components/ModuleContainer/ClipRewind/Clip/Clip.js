import React, { Component } from 'react'
//Style
import styles from './Clip.module.scss';
//Assets
import nextButton from '../../../../resources/nextClipButton.png';
import backButton from '../../../../resources/backClipButton.png';
import snowDrifts from '../../../../resources/snowDrifts.png';
import smallSnow from '../../../../resources/smallSnowDrift.png';
//State Management
import { connect } from 'react-redux'

export class Clip extends Component {

    render() {
        let iframe = `<iframe src='https://clips.twitch.tv/embed?clip=${this.props.slugID}&parent=metamoderation.com' width="840" height="500" frameborder="0" scrolling="no" allowfullscreen="false" autoplay="false" preload="auto"></iframe>`
        
        return (
            <div className={styles.clipContainer}>                
                    {{
                        '1': <div className={styles.topClip + ' ' + styles.fade}>
                            <img src="https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x" alt='pepeD'/>
                            Top Clip of 2020
                            <img src="https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x" alt='pepeD'/>
                            </div> ,
                        '2': <div className={styles.clipCount}>{this.props.clipCount}</div>,
                        '3': <div className={styles.clipCount}>{this.props.clipCount}</div>,
                        '4': <div className={styles.clipCount}>{this.props.clipCount}</div>,
                        '5': <div className={styles.clipCount}>{this.props.clipCount}</div>
                        }[this.props.clipCount]}

                <img className={styles.leftSmallSnow} src={smallSnow} alt="snow drift"/>
                <div className={styles.backButton} onClick={(event)=>this.props.changeClip('back', event)}>
                    <img className={styles.backButtonImg} src={backButton} atl="back button"/>
                </div>
                <img className={styles.snowDrifts} src={snowDrifts} alt="snow drifts"/>
                <div className={styles.iframeContainer} dangerouslySetInnerHTML={{__html: iframe}}></div>
                <img className={styles.rightSmallSnow} src={smallSnow} alt="snow drift"/>
                <div className={styles.nextButton} onClick={(event)=>this.props.changeClip('next', event)}>
                    
                    <img className={styles.nextButtonImg} src={nextButton} atl="next button"/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Clip)
