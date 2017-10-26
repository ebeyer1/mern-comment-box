//Train.js
import React, { Component } from 'react';
//import axios from 'axios';

class Train extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: 1, counter: 0 };
//        this.loadUserFromServer = this.loadUserFromServer.bind(this);
        this.incrementCounter = this.incrementCounter.bind(this);
    }
//    loadUserFromServer() {
//        // userId should perhaps be passed in and used as this.props.userId?
//        axios.get('/api/user/' + this.state.userId).then(res => {
//            this.setState({userId: res.data._id, counter: res.data.counter});
//        });
//    }
    incrementCounter() {
        // make API call.. set new val on return. Disable button until req finishes
        this.setState(prevState => ({
            counter: prevState.counter+1
        }));
    }
//    componentDidMount() {
//        this.loadUserFromServer();
//    }
    render() {
        return (
            <div>
                <h2>Train</h2>
                
                User Id: { this.state.userId }
                <br /><br />
                <button onClick={this.incrementCounter}>Click Me!</button>
                Counter: { this.state.counter }
            </div>
        )
    }
}

export default Train;