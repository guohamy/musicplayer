import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './MNav.scss';

class MNav extends Component {
    constructor(props){
        super(props);

        this.state = {
            type: this.props.type ? parseInt(this.props.type) : 1
        }

        this.changePage = this.changePage.bind(this);
        this.sessionStorage = this.sessionStorage.bind(this);
    }

    changePage(event){
        this.props.changePage(parseInt(event.target.dataset.page));
    }

    sessionStorage(event){
        sessionStorage.setItem('page',parseInt(event.target.dataset.page));
    }

    render(){
        return (
            <div>
                {
                    this.state.type === 1 ? (
                        <nav className="nav">
                            <a data-page="1" onClick={this.changePage} className={this.props.page===1?'active':''}>我的收藏</a>
                            <a data-page="2" onClick={this.changePage} className={this.props.page===2?'active':''}>排行榜</a>
                            <a data-page="3" onClick={this.changePage} className={this.props.page===3?'active':''}>搜索</a>
                        </nav>
                    ) : (
                        <nav className="nav">
                            <Link data-page="1" to="/" onClick={this.sessionStorage}>我的收藏</Link>
                            <Link data-page="2" to="/" onClick={this.sessionStorage}>排行榜</Link>
                            <Link data-page="3" to="/" onClick={this.sessionStorage}>搜索</Link>
                        </nav>
                    )
                }
            </div>
        )
    }
}

export default MNav;