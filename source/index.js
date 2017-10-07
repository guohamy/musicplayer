import React, { Component } from 'react';
import Header from  './component/Header';
import Controlbar from  './component/Controlbar';
import Playlist from  './component/Playlist';
import Songcon from "./component/Songcon";
import './style.scss';
import DefaultImage from './images/default.jpg';

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            updatePlayStatus: false,
            playlist: localStorage.playlist ? JSON.parse(localStorage.playlist) : [
                {
                    mid: '101369814',
                    pid: '001uqejs3d6EID',
                    title: '算什么男人',
                    singer: '周杰伦',
                    duration: 154
                }
            ],
            song: localStorage.song ? JSON.parse(localStorage.song) : {
                mid: '101369814',
                pid: '001uqejs3d6EID',
                title: '算什么男人',
                singer: '周杰伦',
                duration: 154
            },
            songcon: localStorage.songcon ? JSON.parse(localStorage.songcon) : [
                {
                    mid: '101369814',
                    pid: '001uqejs3d6EID',
                    title: '算什么男人',
                    singer: '周杰伦',
                    cover: {
                        backgroundImage: 'url(//imgcache.qq.com/music/photo/mid_album_300/I/D/001uqejs3d6EID.jpg)'
                    },
                    duration: 154
                }
            ],
            page: localStorage.page ? parseInt(localStorage.page) : this.props.page,
            keyword: localStorage.keyword ? localStorage.keyword : '为你推荐',
            isBtn: localStorage.songcon ? true : false,
            finish: parseInt(localStorage.finish)!==1 ? 0 : 1,
            currentTime: 0,
            lyricStatus: 0,
            lyric: []
        };

        this.fastClick = this.fastClick.bind(this);
        this.addPlayList = this.addPlayList.bind(this);
        this.removeSong = this.removeSong.bind(this);
        this.changeMusic = this.changeMusic.bind(this);
        this.musicData = this.musicData.bind(this);
        this.search = this.search.bind(this);
        this.sendCurrentTime = this.sendCurrentTime.bind(this);
        this.changeLyricStatus = this.changeLyricStatus.bind(this);
        this.setLyric = this.setLyric.bind(this);
        this.clearPlaylist = this.clearPlaylist.bind(this);

        if(!localStorage.playlist) {
            localStorage.playlist = JSON.stringify(this.state.playlist);
        }
    }

    fastClick(keyword){
        this.setState({
            lyricStatus: 0,
            updatePlayStatus: false,
            songcon: [],
            keyword: keyword,
            page: 2,
            isBtn: true
        });
        this.musicData(20,1,keyword);
        localStorage.keyword = keyword;
    }

    search(event){
        if(event.keyCode===13){
            this.setState({
                lyricStatus: 0,
                updatePlayStatus: false,
                songcon: [],
                keyword: event.target.value,
                page: 2,
                isBtn: true
            });
            this.musicData(20,1,event.target.value);
        }
        localStorage.keyword = event.target.value;
    }

    addPlayList(o){
        for(let i =0;i<this.state.playlist.length;i++){
            if(this.state.playlist[i].mid===o.mid){
                return;
            }
        }
        this.setState({
            updatePlayStatus: false
        });
        this.state.playlist.push(o);
        localStorage.playlist = JSON.stringify(this.state.playlist);
    }

    removeSong(mid){
        for(let i =0;i<this.state.playlist.length;i++){
            if(this.state.playlist[i].mid==mid){
                this.setState({
                    updatePlayStatus: false,
                    playlist: this.state.playlist.splice(i,1)
                });
                break;
            }
        }
        localStorage.playlist = JSON.stringify(this.state.playlist);
    }

    changeMusic(o){
        this.setState({
            updatePlayStatus: true,
            song: {
                mid: o.mid,
                pid: o.pid,
                duration: o.duration,
                title: o.title,
                singer: o.singer
            }
        });
        localStorage.song = JSON.stringify({
            mid: o.mid,
            pid: o.pid,
            duration: o.duration,
            title: o.title,
            singer: o.singer
        });
    }

    musicData(showposts, page, keyword){
        fetch('//www.guohamy.cn/api/music.php?action=search&num='+showposts+'&page='+page+'&keyword='+keyword,{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            if(json.data.song.list.length>0){
                this.setState({
                    updatePlayStatus: false,
                    songcon: this.state.songcon.concat(json.data.song.list.map((value)=>{
                        let pid = value.f.split('|')[22];
                        return (
                            {
                                mid: value.f.split('|')[0],
                                pid: pid,
                                title: value.fsong,
                                singer: value.f.split('|')[3].split(';').join('/'),
                                duration: value.f.split('|')[7],
                                cover: {
                                    backgroundImage: 'url(//imgcache.qq.com/music/photo/mid_album_300/'+pid.substr(-2,1)+'/'+pid.substr(-1)+'/'+pid+'.jpg)'
                                }
                            }
                        )
                    })),
                    page: page + 1,
                    finish: 0
                });
                localStorage.songcon = JSON.stringify(this.state.songcon);
                localStorage.page = this.state.page;
                localStorage.finish = 0;
            }
            else {
                this.setState({
                    updatePlayStatus: false,
                    finish: 1
                });
                localStorage.finish = 1;
            }

        }).catch((error)=>{
            console.log(error)
        });
    }

    sendCurrentTime(currentTime){
        this.setState({
            updatePlayStatus: false,
            currentTime: currentTime
        })
    }

    changeLyricStatus(){
        this.setState({
            lyricStatus: !this.state.lyricStatus
        });
    }

    setLyric(lyric){
        this.setState({
            updatePlayStatus: false,
            lyric: lyric
        });
    }

    clearPlaylist(){
        this.state.playlist.splice(0,this.state.playlist.length);
        localStorage.playlist = '[]';
    }

    render(){
        return (
            <div className="main">
                <Header search={this.search} changeLyricStatus={this.changeLyricStatus} lyricStatus={this.state.lyricStatus} fastClick={this.fastClick}/>
                <section>
                    <Playlist playlist={this.state.playlist} changeMusic={this.changeMusic} playMid={this.state.song.mid} removeSong={this.removeSong} clearPlaylist={this.clearPlaylist} />
                    <Songcon addPlayList={this.addPlayList} changeMusic={this.changeMusic} musicData={this.musicData} songcon={this.state.songcon} keyword={this.state.keyword} isBtn={this.state.isBtn} finish={this.state.finish} page={this.state.page} currentTime={this.state.currentTime} lyricStatus={this.state.lyricStatus} lyric={this.state.lyric} />
                </section>
                <Controlbar playlist={this.state.playlist} changeMusic={this.changeMusic} song={this.state.song} updatePlayStatus={this.state.updatePlayStatus} sendCurrentTime={this.sendCurrentTime} setLyric={this.setLyric} />
            </div>
        )
    }
}

export default App;