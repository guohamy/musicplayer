import React, { Component } from 'react';
import Toast from "./component/Toast";
import './mStyle.scss';

class mApp extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="main">
                Hello
            </div>
        )
    }
}

export default mApp;