import React, { Component } from 'react';
import { Route } from 'react-router';
import { HashRouter } from 'react-router-dom';
import MHome from './component/MHome';
import MRankings from './component/MRankings';
import MPlay from './component/MPlay';

class MIndex extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="mMain">
                <header>
                    <h1>music player</h1>
                </header>
                <HashRouter>
                    <section>
                        <Route exact path="/" component={MHome} />
                        <Route path="/ranking/:id" component={MRankings} />
                        <Route path="/v/:id" component={MPlay} />
                    </section>
                </HashRouter>
            </div>
        )
    }
}

export default MIndex;