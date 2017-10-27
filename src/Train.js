//Train.js
import React, { Component } from 'react';
import axios from 'axios';

class Train extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: '59f2da990810ea184cc36b75', counter: 0 };
        this.loadUserFromServer = this.loadUserFromServer.bind(this);
        this.incrementCounter = this.incrementCounter.bind(this);
    }
    loadUserFromServer() {
        // userId should perhaps be passed in and used as this.props.userId?
        // TODO - allow clicking a user from the list in Home.js to load the Train.js page with that user id.
        axios.get('/api/users/' + this.state.userId).then(res => {
            this.setState({userId: res.data._id, counter: res.data.counter});
        });
    }
    incrementCounter() {
        // TODO - disable button until request finishes
        axios.put('/api/users/' + this.state.userId).then(res => {
            this.setState({counter: res.data.counter});
        });
    }
    componentDidMount() {
        this.loadUserFromServer();
    }
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