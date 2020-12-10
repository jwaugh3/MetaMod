import React, { Component } from 'react'
//Styling
import styles from './Loading.module.css';

export default class Loading extends Component {
    render() {
        return (
            <div className={styles['lds-ellipsis']}><div></div><div></div><div></div><div></div></div> 
        )
    }
}
