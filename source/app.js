import React, { Component } from 'react';
import Index from  './index';
import MIndex from  './mIndex';

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            mobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false
        };
    }

    render(){
        return this.state.mobile ? (
            <MIndex/>
        ) : (
            <Index/>
        )
    }
}

export default App;