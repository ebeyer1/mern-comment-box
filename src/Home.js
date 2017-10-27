//Home.js
import React, { Component } from 'react';
import axios from 'axios';
import style from './style';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [] };
        this.loadUsersFromServer = this.loadUsersFromServer.bind(this);
        this.createUser = this.createUser.bind(this);
    }
    loadUsersFromServer() {
        axios.get('/api/users').then(res => {
            this.setState({users: res.data});
        });
    }
    createUser() {
        axios.post('/api/users').then(res => {
            var users = this.state.users;
            users.push(res.data);
            this.setState({users: users});
        });
    }
    deleteUser(id) {
        axios.delete('/api/users/' + id).then(res => {
            var users = this.state.users.filter(function (item) {
                return item._id !== id;
            });
            this.setState({users: users});
        });
    }
    componentDidMount() {
        this.loadUsersFromServer();
    }
    render() {
        var that = this;
        let users = this.state.users.map(function(item) {
           return (
               <li>
                <strong>{item._id} - ({item.counter})</strong>
                <button onClick={that.deleteUser.bind(that, item._id)}>Del</button>
               </li>
           )
        });
        return (
            <div>
                <h2>Home</h2>
            
                <h3>Users</h3>
                <ul style={ style.userList }>
                    { users }
                </ul>
            
                <br />
                <button onClick={this.createUser}>Add New User</button>
            </div>
        )
    }
}

export default Home;