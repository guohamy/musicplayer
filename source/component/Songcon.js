import React, { Component } from 'react';
import './Songcon.scss';
require('babel-polyfill');
require('es6-promise').polyfill();

class Songcon extends Component {
    constructor(props){
        super(props);

        this.addPlayList = this.addPlayList.bind(this);
        this.sendDetail = this.sendDetail.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    addPlayList(event){
        this.props.addPlayList({
            mid: event.target.dataset.mid,
            pid: event.target.dataset.pid,
            duration: event.target.dataset.duration,
            title: event.target.dataset.title,
            singer: event.target.dataset.singer
        })
    }

    sendDetail(event){
        this.props.changeMusic({
            mid: event.target.dataset.mid,
            pid: event.target.dataset.pid,
            duration: event.target.dataset.duration,
            title: event.target.dataset.title,
            singer: event.target.dataset.singer
        })
    }

    loadMore(){
        this.props.musicData(20,this.props.page,this.props.keyword);
    }

    render(){
        return (
            <div className="songcon">
                <h1>{this.props.keyword!='为你推荐' ? '关于 ”'+this.props.keyword+'“ 的歌曲' : '为你推荐'}</h1>
                <div className="items">
                    {
                        this.props.songcon.map((value,index)=>{
                            return (
                                <div className="item" key={index}>
                                    <div className="cover">
                                        <div className="button">
                                            <a className="add" data-mid={value.mid} data-pid={value.pid} data-title={value.title} data-singer={value.singer} data-duration={value.duration} onClick={this.addPlayList}/>
                                            <a className="play" data-mid={value.mid} data-pid={value.pid} data-title={value.title} data-singer={value.singer} data-duration={value.duration} onClick={this.sendDetail}/>
                                        </div>
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURUxpcU3H2DoAAAABdFJOUwBA5thmAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==" style={value.cover} alt=""/>
                                    </div>
                                    <div className="detail">
                                        <em>{value.title}</em>
                                        <cite>{value.singer}</cite>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="loadMore">
                        {
                            this.props.isBtn ? (
                                !this.props.finish ? (
                                    <a onClick={this.loadMore}>点击读取更多</a>
                                ) : (
                                    <p>已全部加载完毕</p>
                                )
                            ) : ''
                        }
                    </div>
                </div>
                <div className={this.props.lyricStatus?'lyric show':'lyric'} id="lyric">
                    {
                        this.props.lyric.map((value,index)=>{
                            return (
                                <div className={Math.floor(this.props.currentTime)>=value.time?'lyricItem active':'lyricItem'} key={index}>{value.text}</div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
    }
}

export default Songcon;