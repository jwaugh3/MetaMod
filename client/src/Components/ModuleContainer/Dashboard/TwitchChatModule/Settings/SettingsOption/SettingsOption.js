//Files
import React, {Component} from 'react';
//Components
import Auxiliary from '../../../../../../hoc/Auxiliary';
//Styles
import styles from './SettingsOption.module.css';
//Assets


class SettingsOption extends Component {
    render() {
        return ( 
            <Auxiliary>
                <h4 className={styles.settingsText}>{this.props.settingsLabel}</h4>
                <div className={styles.toggleBtn}>
                    <input className={styles.tglflip} id={this.props.settingsLabel + this.props.moduleNum} type="checkbox" checked={this.props.selected} onChange={()=>this.props.settingsHandler(this.props.moduleNum, this.props.selected)}/>
                    <label className={styles.tglbtn} data-tg-off="Nope!" data-tg-on="Yep!" htmlFor={this.props.settingsLabel + this.props.moduleNum}></label>
                </div>
            </Auxiliary>
        );
    }
}
    
export default SettingsOption;