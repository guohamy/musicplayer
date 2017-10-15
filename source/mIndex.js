import React, { Component } from 'react';
import { Route } from 'react-router';
import { HashRouter } from 'react-router-dom';
import MHome from './component/MHome';
import MRankings from './component/MRankings';
import MPlay from './component/MPlay';

class MIndex extends Component {
    constructor(props){
        super(props);
        this.state = {
            tips: sessionStorage.getItem('tips') ? false : true,
            box: false
        };

        this.showTips = this.showTips.bind(this);
        this.close = this.close.bind(this);
        sessionStorage.setItem('tips',1);
    }

    showTips(){
        this.setState({
            tips: false,
            box: true
        });
    }

    close(){
        this.setState({
            box: false
        });
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
                {
                    this.state.tips ? (
                        <a className="firstTips" onClick={this.showTips}/>
                    ) : ''
                }
                {
                    this.state.box ? (
                        <div className="tipsBox" onClick={this.close}>
                            <div className="tipsBoxc">
                                create by React + router + ES2015 + PHP
                                <br/>
                                data from y.qq.com
                                <br/>
                                <br/>
                                <p>
                                    guohamy @music.guohamy.cn / ver 1.0.0
                                    <br/>
                                    <b>for learning only</b>
                                </p>
                            </div>
                        </div>
                    ) : ''
                }
            </div>
        )
    }
}

export default MIndex;