//Files
import React, {Component} from 'react';
//Styles
import styles from './ModChatModule.module.css';
//Assets


class ModChatModule extends Component {

    scrollToBottom = () => { 
        let lastModCard = document.getElementById('lastModCard'+this.props.moduleNum)
        lastModCard.scrollIntoView()
    }

    componentDidUpdate(){
        this.scrollToBottom()
    }

    drop = (event) =>{
        event.preventDefault();
        const data = event.dataTransfer.getData('transfer')
        // console.log(data)
        if(data.includes('twitchCard')){
            let nodeCopy = document.getElementById(data).cloneNode(true)
            // console.log(nodeCopy)
            let copiedDiv = nodeCopy.innerHTML
            
            this.props.transferTwitchMsg(copiedDiv)
        }
    }

    dragOver = (event) => {
        event.preventDefault();
    }


    render() {

        let roomUsers = this.props.roomUsers.map((user)=>{
            return(
                <div className={styles.roomUserImageContainer} key={user.username}>
                    <img src={user.profileImage} className={styles.roomUserImage} alt='User'/>
                </div>
            )
        })

        return ( 
            <div className={styles.mainContainer} 
                style={this.props.visibility ? {display: 'inline-block'} : {display: 'none'}}
                id={this.props.id}
                draggable='false'
                onDrop={this.drop}
                onDragOver={this.dragOver}
                >
                <div className={styles.headerContainer}>
                    <h3 className={styles.chatHeader}>Mod Chat</h3>
                    <div className={styles.roomUserContainer}>
                        {roomUsers}
                    </div>
                </div>
                <div className={styles.chatContainer}>

                    {this.props.children}

                    <div ref={(el)=> {this.messagesEnd = el}}></div>
                </div>
                    <div className={styles.inputContainer}>
                        <form onSubmit={this.props.onMessageSubmit} id="modTextInput">
                            <input placeholder='Send a message' type='text' onChange={this.props.inputChangedHandler} value={this.props.modMsg} className={styles.inputBox}/>
                        </form>
                    </div>
                </div>
        );
    }
}
    
export default ModChatModule;