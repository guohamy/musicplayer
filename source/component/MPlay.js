import React, { Component } from 'react';
import URLConsts from '../api/URLConst'
import MNav from './MNav';

class MPlay extends Component {
    constructor(props){
        super(props);

        this.state = {
            cover: {
                backgroundImage: 'url()'
            },
            title: '',
            singer: '',
            currentTime: sessionStorage.getItem('currentTime_'+this.props.match.params.id) ? sessionStorage.getItem('currentTime_'+this.props.match.params.id) : 0,
            totalTime: '00:00',
            currentTimeLength: 0
        };

        this.continue = true;

        this.audio = document.createElement('audio');
        this.audio.preload = 'metadata';

        this.changeTime = this.changeTime.bind(this);
        this.seeked = this.seeked.bind(this);
    }

    changeTime(t){
        let minutes = Math.floor(t/60);
        minutes = minutes<=9 ? '0' + minutes : minutes;
        let seconds = Math.floor(t % 60);
        seconds = seconds<=9 ? '0' + seconds : seconds;
        return minutes + ':' +seconds;
    }

    seeked(event){
        let progress = this.refs.progress;
        console.log(this.audio,event.clientX,progress.offsetLeft,progress.offsetWidth,this.audio.duration);
        this.audio.currentTime = (event.clientX-progress.offsetLeft)/progress.offsetWidth*this.audio.duration;
    }

    render(){
        return (
            <div className="content">
                <MNav type="2"/>
                <div className="mBody mAudio">


                    <div className="controlbars">
                        <div className="cover" style={this.state.cover}/>
                        <div className="controlbar">
                            <div className="singDesc">
                                <span>{this.state.title}</span>
                                <span>{this.state.singer}</span>
                            </div>
                            <div className="control">
                                <div className="progressControl">
                                    <time className="currentTime" ref="currentTime">{this.changeTime(this.state.currentTime)}</time>
                                    <div className="progress" ref="progress" onClick={this.seeked}>
                                        <div className="normalProgress"/>
                                        <div className="currentProgress" style={{width: this.state.currentTimeLength}}/>
                                    </div>
                                    <time className="totalTime" ref="totalTime">{this.state.totalTime}</time>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){

        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=fcg_query_lyric.fcg',{
            headers: {
                '_referer': 'https://i.y.qq.com/v8/playsong.html'
            }
        }).then((res)=>res.json()).then((json)=>{

            console.log(json);

        }).catch((error)=>{
            console.log(error)
        });

        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=fcg_play_single_song.fcg&songmid=' + this.props.match.params.id).then((res)=>res.json()).then((json)=>{

            this.setState({
                cover: {
                    backgroundImage: 'url(//imgcache.qq.com/music/photo/album_300/'+parseInt(json.data[0].album.id)%100+'/300_albumpic_'+json.data[0].album.id+'_0.jpg)'
                },
                title: json.data[0].title,
                singer: json.data[0].singer[0].title,
                totalTime: this.changeTime(json.data[0].interval)
            })

            for(let i in json.url){
                if(json.data[0].id == parseInt(i)){
                    this.audio.src = '//' + json.url[i].indexOf("//") > -1 ? json.url[i] : '//' + json.url[i];
                    this.audio.play();




                    //播放时间改变
                    this.audio.addEventListener('timeupdate',()=>{
                        if(this.continue){
                            this.setState({
                                currentTime: this.audio.currentTime,
                                currentTimeLength: this.audio.currentTime/json.data[0].interval*100+'%'
                            });
                        }
                    },false);
                }

            }

            console.log(json);

        }).catch((error)=>{
            console.log(error)
        });

        /*fetch('//www.guohamy.cn/api/music.php?action=tingapi&method=baidu.ting.song.play&songid='+this.props.match.params.id,{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            this.setState({
                cover: {
                    backgroundImage: 'url('+json.songinfo.pic_big+')'
                },
                title: json.songinfo.title,
                singer: json.songinfo.author,
                totalTime: this.changeTime(json.bitrate.file_duration)
            });

            this.loadAudio = document.createElement('audio');
            this.loadAudio.src = '//www.guohamy.cn/api/music.php?action=tingmusic&url=' + json.bitrate.file_link;

            this.audio.src = '//www.guohamy.cn/api/music.php?action=tingmusic&url=' + json.bitrate.file_link;
            this.audio.src = 'http://dl.stream.qqmusic.qq.com/C400101qjdRZ4ZswWO.m4a?fromtag=38&vkey=834D366E6D1A6ABB17EE066D800492D1D9BE16D965B5DB762226BB95FB4053EFD5C564CAF9F14D002CEA2695A4BC67D1D614945837E8E187&guid=3516311478';
            this.audio.play();

            //播放时间改变
            this.audio.addEventListener('timeupdate',()=>{
                if(this.continue){
                    this.setState({
                        currentTime: this.audio.currentTime,
                        currentTimeLength: this.audio.currentTime/json.bitrate.file_duration*100+'%'
                    });
                }
            },false);

            console.log(json);


        }).catch((error)=>{
            console.log(error)
        });*/
    }

    componentWillUnmount(){
        this.continue = false;
        this.audio.pause();
    }
}

export default MPlay;