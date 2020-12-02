import React, { Component } from 'react';
import apiCall from '../../../api/apiCall';
//Components
import Auxiliary from '../../../hoc/Auxiliary';
import TopNav from '../TopNav/TopNav'
import ModerationLog from './ModerationLog/ModerationLog';
import Loading from '../../Loading/Loading';
import Dropdown from '../TopNav/Dropdown/Dropdown';
//Styles
import styles from './ModLog.module.css';
//State Management
import { connect } from 'react-redux';

class ModLog extends Component {

    state = {
        loading: true,
        options: [],
        filter: []
    }

    componentDidMount = () => {
        this.setState({loading: true}, async () => {
            await apiCall.getModRecords(this.props.apiEndpoint, this.props.currentChannel)
            .then((response)=>{
                if(response === null){
                    this.props.setModLogs(null)
                } else {
                    let sortedResponse = response.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    this.props.setModLogs(sortedResponse)

                    //set filter options
                    const unique = [...new Set(response.map(item => item.mod))];
                    this.setState({options: unique, filter: unique})
                }

                this.setState({loading: false})
            })
        })
    }    

    componentDidUpdate = (prevProps) => {
        if(this.props.currentChannel !== prevProps.currentChannel) {

            this.setState({loading: true}, async () => {
                await apiCall.getModRecords(this.props.apiEndpoint, this.props.currentChannel)
                .then((response)=>{
                    if(response === null){
                        this.props.setModLogs(null)
                    } else {
                        let sortedResponse = response.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        this.props.setModLogs(sortedResponse)
    
                        //set filter options
                        const unique = [...new Set(response.map(item => item.mod))];
                        this.setState({options: unique}, ()=>{
                            console.log(this.state.options)
                        })
                    }

                    this.setState({loading: false})
                })
            })
        }
    } 

    onSelect = (event, option) => {

        if(event.target.checked === true){
            //add filter to state
            this.setState({filter: [...this.state.filter, option]}, ()=>{
                console.log(this.state.filter)
            })
        } else if (event.target.checked === false){
            //remove filter from state
            let newFilter = [...this.state.filter]
            newFilter.splice(newFilter.indexOf(option), 1)

            this.setState({filter: newFilter}, ()=>{
                console.log(this.state.filter)
            })
        }
    }

    render() {
        return (
            <Auxiliary>
                <TopNav>
                    <Dropdown className={styles.dropdownButton} onSelect={this.onSelect} options={this.state.options} filter={this.state.filter}/>
                </TopNav>

                {this.state.loading ? 
                    <Loading/>
                    :
                    <ModerationLog filter={this.state.filter}/>
                }

            </Auxiliary>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentChannel: state.applicationReducer.currentChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setModLogs: (records) => dispatch({type: 'SET_MOD_LOGS', payload: records})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModLog)
