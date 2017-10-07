import React, { Component } from 'react';
import './Controlbar.scss';
import DefaultImage from '../images/default.jpg';

class Controlbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            playType: localStorage.playType ? localStorage.playType : 1,//1 单曲循环，2列表循环，3或其他随机播放
            paused: false,
            currentTime: 0,
            currentTimeLength: 0,
            loadTimeLength: 0,
            loadProgressTime: 0,
            loadProgressStyle: {
                display: 'none'
            },
            duration: 0,
            volumeLength: '50%',
            volumeLv: 2
        };

        this.audio = document.createElement('audio');
        this.audio.volume = 0.5;
        this.audio.src = '//ws.stream.qqmusic.qq.com/'+this.props.song.mid+'.m4a?fromtag=46';
        this.audio.preload = 'metadata';
        this.audio.currentTime = localStorage.currentTime ? localStorage.currentTime : 0;

        this.loadXML = this.loadXML.bind(this);
        this.parseLyric = this.parseLyric.bind(this);
        this.createLyric = this.createLyric.bind(this);

        this.changePlayStatus = this.changePlayStatus.bind(this);
        this.changeTime = this.changeTime.bind(this);

        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.seeking = this.seeking.bind(this);
        this.seeked = this.seeked.bind(this);
        this.unseek = this.unseek.bind(this);
        this.changePlayType = this.changePlayType.bind(this);
        this.muted = this.muted.bind(this);
        this.seekingVolume = this.seekingVolume.bind(this);
        this.seekedVolume = this.seekedVolume.bind(this);
        this.unseekVolume = this.unseekVolume.bind(this);
        this.setVolumeLv = this.setVolumeLv.bind(this);
    }

    loadXML(xmlFile){
        let xmlDoc;
        let defaultObj = document.createElement('div');
        defaultObj.innerHTML = '[00:00.00]暂无歌词</lyric>';
        if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE浏览器
            xmlDoc.async = false;
            xmlDoc.load(xmlFile);
        }
        else if (navigator.userAgent.indexOf("Firefox")>0) { //火狐浏览器
            xmlDoc = document.implementation.createDocument('', '', null);
            xmlDoc.load(xmlFile);
        }
        else{ //谷歌浏览器
            let xmlhttp = new window.XMLHttpRequest();
            xmlhttp.open("GET",xmlFile,false);
            xmlhttp.send(null);
            if(xmlhttp.readyState == 4){
                console.log(xmlhttp.responseXML)
                xmlDoc = xmlhttp.responseXML!=null?xmlhttp.responseXML.documentElement:defaultObj;
            }
        }
        if (xmlDoc == null) {
            alert('您的浏览器不支持xml文件读取,于是本页面禁止您的操作,推荐使用IE5.0以上可以解决此问题!');
        }
        return xmlDoc;
    }

    parseLyric(lrc){
        let lyrics = lrc.split("\n");
        let lrcObj = {};
        for(let i=0;i<lyrics.length;i++){
            let lyric = decodeURIComponent(lyrics[i]);
            let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
            let timeRegExpArr = lyric.match(timeReg);
            if(!timeRegExpArr)continue;
            let clause = lyric.replace(timeReg,'').replace(']]>','');
            for(let k = 0,h = timeRegExpArr.length;k < h;k++) {
                let t = timeRegExpArr[k];
                let min = Number(String(t.match(/\[\d*/i)).slice(1)),
                    sec = Number(String(t.match(/\:\d*/i)).slice(1));
                let time = min * 60 + sec;
                lrcObj[time] = clause;
            }
        }
        return lrcObj;
    }

    createLyric(mid){
        let xmlDoc = this.loadXML('http://127.0.0.2/php/data.php?action=lyric&id='+mid);
        console.log(xmlDoc)
        let eleHTML = xmlDoc.innerHTML;
        let lrcObj = this.parseLyric(eleHTML);
        let lyric = [];
        for(let key in lrcObj){
            lyric.push({
                time: key,
                text: lrcObj[key]
            })
        }

        this.props.setLyric(lyric);
    }

    prev(){
        for(let i=0;i<this.props.playlist.length;i++){
            console.log(i);
            if(this.props.playlist[i].mid===this.props.song.mid){
                let j = i == 0 ? this.props.playlist.length - 1 : i - 1;
                this.props.changeMusic(this.props.playlist[j]);
                break;
            }
            if(i==this.props.playlist.length-1){
                this.props.changeMusic(this.props.playlist[0]);
            }
        }
    }

    next(){
        for(let i=0;i<this.props.playlist.length;i++){
            if(this.props.playlist[i].mid===this.props.song.mid){
                let j = i == (this.props.playlist.length - 1) ? 0 : i + 1;
                this.props.changeMusic(this.props.playlist[j]);
                break;
            }
            if(i==this.props.playlist.length-1){
                this.props.changeMusic(this.props.playlist[0]);
            }
        }
    }

    seeking(event){
        let progress = this.refs.progress;
        let progressLen = (event.clientX-progress.offsetLeft)/progress.offsetWidth;
        this.setState({
            loadTimeLength: progressLen*100+'%',
            loadProgressTime: progressLen*this.audio.duration,
            loadProgressStyle: {
                display: 'block',
                left: event.clientX-20+'px',
                top: event.clientY-32+'px'
            }
        })
    }

    seeked(event){
        let progress = this.refs.progress;
        this.audio.currentTime = (event.clientX-progress.offsetLeft)/progress.offsetWidth*this.audio.duration;
    }

    unseek(){
        this.setState({
            loadTimeLength: this.audio.currentTime/this.audio.duration*100+'%',
            loadProgressStyle: {
                display: 'none'
            }
        })
    }

    changePlayType(event){
        let playType = parseInt(event.target.dataset.type);
        this.setState({
            playType: playType+1>3?1:playType+1
        });
        localStorage.playType = playType+1>3?1:playType+1;
    }

    setVolumeLv(p){
        if(p>66.66){
            this.setState({
                volumeLv: 3
            });
        }
        else if(p>33.3333){
            this.setState({
                volumeLv: 2
            });
        }
        else{
            this.setState({
                volumeLv: 1
            });
        }
    }

    muted(){
        this.audio.muted = true;
        this.setVolumeLv(0);
        this.setState({
            volumeLength: 0
        })
    }

    seekingVolume(event){
        let volumeProgress = this.refs.volumeProgress;
        let p = (event.clientX-volumeProgress.offsetLeft)/volumeProgress.offsetWidth*100;
        this.setVolumeLv(p);
        this.setState({
            volumeLength: p+'%'
        })
    }

    seekedVolume(event){
        let volumeProgress = this.refs.volumeProgress;
        let p = (event.clientX-volumeProgress.offsetLeft)/volumeProgress.offsetWidth;
        this.setVolumeLv(p*100);
        this.audio.muted = false;
        this.audio.volume = p;
    }

    unseekVolume(){
        let p = this.audio.volume*100;
        this.setVolumeLv(p);
        this.setState({
            volumeLength: p+'%'
        })
    }

    changeTime(t){
        let hours = Math.floor(t/3600);
        hours = hours<=9 ? '0' + hours : hours;
        let minutes = Math.floor(t/60);
        minutes = minutes<=9 ? '0' + minutes : minutes;
        let seconds = Math.floor(t % 60);
        seconds = seconds<=9 ? '0' + seconds : seconds;
        return hours + ':' + minutes + ':' +seconds;
    }

    changePlayStatus(){
        if(this.audio.paused){
            this.setState({
                paused: false
            });
            this.audio.play();
        }
        else{
            this.setState({
                paused: true
            });
            this.audio.pause();
        }
    }

    render(){
        return (
            <div className="controlbars">
                <div className="cover" style={{backgroundImage: 'url(//imgcache.qq.com/music/photo/mid_album_300/'+this.props.song.pid.substr(-2,1)+'/'+this.props.song.pid.substr(-1)+'/'+this.props.song.pid+'.jpg)'}} />
                <div className="controlbar">
                    <div className="singDesc">
                        <span>{this.props.song.title}</span>
                        <span>{this.props.song.singer}</span>
                    </div>
                    <div className="control">
                        <button className="prev" onClick={this.prev}/>
                        <button className={this.state.paused?'playStatue play':'playStatue pause'} onClick={this.changePlayStatus}/>
                        <button className="next" onClick={this.next}/>
                        <div className="progressControl">
                            <time className="currentTime" ref="currentTime">{this.state.currentTime}</time>
                            <div className="progress" ref="progress" onMouseLeave={this.unseek} onMouseMove={this.seeking} onClick={this.seeked}>
                                <div className="normalProgress"/>
                                <div className="loadProgress" style={{width: this.state.loadTimeLength}} />
                                <div className="loadProgressTime" style={this.state.loadProgressStyle}>{this.changeTime(this.state.loadProgressTime)}</div>
                                <div className="currentProgress" style={{width: this.state.currentTimeLength}}/>
                            </div>
                            <time className="totalTime" ref="totalTime">{this.state.duration}</time>
                        </div>
                        <button className={"playOrder "+(this.state.playType==1?"single":(this.state.playType==2?"cycle":"random"))} data-type={this.state.playType} onClick={this.changePlayType}/>
                        <button className={'volumeControl lv_'+this.state.volumeLv} onClick={this.muted}/>
                        <div className="volumeProgress" ref="volumeProgress" onMouseLeave={this.unseekVolume} onMouseMove={this.seekingVolume} onClick={this.seekedVolume}>
                            <div className="currentVolume" style={{width: this.state.volumeLength}}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){

        this.createLyric(this.props.song.mid);

        let progress = this.refs.progress;

        this.setState({
            duration: this.changeTime(this.props.song.duration)
        });

         let currentTime = this.refs.currentTime;
         //let totalTime = this.refs.totalTime;

         this.audio.play();

        //开始请求数据
        this.audio.addEventListener('loadstart',()=>{
            console.log(this.audio.duration)
        },false);

        //正在请求数据
        this.audio.addEventListener('progress',()=>{
            //console.log(this.audio.buffered.length)
            /*if(this.audio.duration){
                totalTime.innerHTML = this.changeTime(this.audio.duration);
            }*/
            //console.log(this.audio.duration)
        },false);

        //开始播放时触发
         this.audio.addEventListener('play',()=>{
             console.log(this.audio.duration,this.audio.buffered)
         },false);

        //暂停播放时触发
         this.audio.addEventListener('pause',()=>{
             console.log(3)
         },false);

         //播放结束时触发
         this.audio.addEventListener('ended',()=>{
             if(this.state.playType===1){
                 this.audio.play();
             }
             else if(this.state.playType===2){
                 this.next();
             }
             else {
                 this.props.changeMusic(this.props.playlist[Math.floor(Math.random()*this.props.playlist.length)]);
             }
             this.setState({
                 loadTimeLength: 0
             })
         },false);

        //寻找中
        this.audio.addEventListener('seeking',()=>{
            //alert(4)
        },false);

        //寻找完毕
        this.audio.addEventListener('seeked',()=>{
            //alert(4)
        },false);

        //播放时间改变
        this.audio.addEventListener('timeupdate',()=>{
            currentTime.innerHTML = this.changeTime(this.audio.currentTime);
            localStorage.currentTime = this.audio.currentTime;
            this.setState({
                currentTimeLength: this.audio.currentTime/this.audio.duration*100+'%'
            });
            this.props.sendCurrentTime(this.audio.currentTime);

            let lyric = document.getElementById('lyric');
            let lyricHeight = lyric.offsetHeight;
            let lyricItem = lyric.getElementsByClassName('active');
            if(lyricItem.length>=2){
                lyricItem[lyricItem.length-2].style.color = '#666';
            }
            if(lyricItem.length>=1){
                lyricItem[lyricItem.length-1].style.color = '#f00';
                lyric.scrollTop = lyricItem[lyricItem.length-1].offsetTop - lyricHeight/2;
            }

        },false);

        //音量改变
        this.audio.addEventListener('volumechange',()=>{
            console.log(this.audio.currentTime)
        },false);

         //请求数据时遇到错误
        this.audio.addEventListener('error',()=>{

        },false)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.updatePlayStatus){
            this.setState({
                duration: this.changeTime(nextProps.song.duration)
            });
            this.audio.pause();
            this.audio.src = '//ws.stream.qqmusic.qq.com/'+nextProps.song.mid+'.m4a?fromtag=46';
            this.audio.play();

            this.createLyric(nextProps.song.mid);
        }
    }
}

Controlbar.defaultProps = {
    song: {
        cover: DefaultImage,
        mid: '101369814'
    }
};

export default Controlbar;