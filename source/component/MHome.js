import React, { Component } from 'react';
import MNav from './MNav';

class MHome extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="content">
                <MNav/>
            </div>
        )
    }
}

export default MHome;