import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import About from './About';
import Topics from './Topics';
import CommentPage from './CommentPage';
import registerServiceWorker from './registerServiceWorker';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

ReactDOM.render((
    <Router>
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/topics">Topics</Link></li>
                <li><Link to="/comments">Comments</Link></li>
            </ul>
    
            <hr />
    
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/topics" component={Topics} />
            <Route exact path="/comments" component={CommentPage} />
        </div>
    </Router>
), document.getElementById('root'));
registerServiceWorker();