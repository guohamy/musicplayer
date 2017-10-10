import React, { Component } from 'react';
import { Route } from 'react-router';
import { HashRouter } from 'react-router-dom';
import MHome from './component/MHome';
import MRanking from './component/MRanking';
import MRankings from './component/MRankings';

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
                        <Route exact path="/ranking" component={MRanking} />
                        <Route path="/ranking/:id" component={MRankings} />
                    </section>
                </HashRouter>
            </div>
        )
    }
}

export default MIndex;