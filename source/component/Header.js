import React, { Component } from 'react';
import './Header.scss';

class Header extends Component {
    constructor(props){
        super(props);

        this.changeLyricStatus = this.changeLyricStatus.bind(this);
        this.search = this.search.bind(this);
    }

    changeLyricStatus(){
        this.props.changeLyricStatus();
    }

    search(event){
        this.props.fastClick(event.target.dataset.keyword);
    }

    render(){
        return (
            <header>
                <h1>Music Player</h1>
                <div className="header">
                    <div className="header-left">
                        <i className="logo"/>
                        <input type="text" className="search" placeholder="输入关键字" onKeyDown={this.props.search}/>
                    </div>
                    <div className="header-right">
                        <span>热门歌手</span>
                        <button className="gButton" onClick={this.search} data-keyword="薛之谦">薛之谦</button>
                        <button className="gButton" onClick={this.search} data-keyword="邓紫棋">邓紫棋</button>
                        <button className="gButton" onClick={this.search} data-keyword="SNH48">SNH48</button>
                        <span className="dividingLine">|</span>
                        <button className={this.props.lyricStatus?'gButton active':'gButton'} onClick={this.changeLyricStatus}>歌词</button>
                    </div>
                </div>
            </header>
        )
    }
}

export default Header;