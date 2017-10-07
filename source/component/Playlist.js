import React, { Component } from 'react';
import './Playlist.scss';
import DefaultImage from '../images/default.jpg';
require('babel-polyfill');
require('es6-promise').polyfill();

class Playlist extends Component {
    constructor(props){
        super(props);
        this.state = {
            playlist: this.props.playlist
        };

        this.sendDetail = this.sendDetail.bind(this);
        this.removeSong = this.removeSong.bind(this);
    }

    sendDetail(event){
        this.props.changeMusic({
            mid: event.target.dataset.mid,
            pid: event.target.dataset.pid,
            duration: event.target.dataset.duration,
            title: event.target.dataset.title,
            singer: event.target.dataset.singer
        });
    }

    removeSong(event){
        this.props.removeSong(event.target.dataset.mid);
    }

    render(){
        return (
            <div className="playlist">
                <div className="nav">
                    <div className="title">播放列表</div>
                    <button className="gButton" onClick={this.props.clearPlaylist}>清空</button>
                    {/*<button className="gButton">收起</button>*/}
                </div>
                <div className="items">
                    {
                        this.state.playlist.map((value,index)=>{
                            return (
                                <div className="item" key={index}>
                                    <i className="cover" style={{backgroundImage: 'url(//imgcache.qq.com/music/photo/mid_album_300/'+value.pid.substr(-2,1)+'/'+value.pid.substr(-1)+'/'+value.pid+'.jpg)'}} />
                                    <div className="detail">
                                        <em>{value.title}</em>
                                        <cite>{value.singer}</cite>
                                    </div>
                                    {
                                        this.props.playMid == value.mid ? (
                                            <div className="playIcon">
                                                <span/>
                                                <span/>
                                                <span/>
                                            </div>
                                        ) : ''
                                    }
                                    <a className="removeSong" data-mid={value.mid} onClick={this.removeSong}/>
                                    <a className="playSong" data-mid={value.mid} data-pid={value.pid} data-title={value.title} data-singer={value.singer} data-duration={value.duration} onClick={this.sendDetail} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    componentDidMount(){
    }
}

export default Playlist;