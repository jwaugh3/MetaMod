import React, { Component } from 'react'
import { connect } from 'react-redux'
//Components
import Auxiliary from '../../../hoc/Auxiliary';
import TopNav from '../TopNav/TopNav'
import ModerationLog from './ModerationLog/ModerationLog';

class ModLog extends Component {
    render() {
        return (
            <Auxiliary>
                <TopNav>

                </TopNav>

                <ModerationLog/>
            </Auxiliary>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ModLog)
