//CommentPage.js
import React, { Component } from 'react';
import CommentBox from './CommentBox';

class CommentPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <CommentBox
                url='/api/comments'
                pollInterval={2000} />
        )
    }
}

export default CommentPage;