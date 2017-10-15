import React, { Component } from 'react';
import MNav from './MNav';
import './MPlay.scss';
import Toast from '../component/Toast';

class MPlay extends Component {
    constructor(props){
        super(props);

        this.state = {
            mid: this.props.match.params.id,
            cover: {
                backgroundImage: 'url()'
            },
            title: '',
            singermid: '',
            singer: '',
            currentTime: sessionStorage.getItem('currentTime_'+this.props.match.params.id) ? sessionStorage.getItem('currentTime_'+this.props.match.params.id) : 0,
            totalTime: '00:00',
            currentTimeLength: 0,
            paused: false,
            albumlist: [],
            song_list: [],
            offset: 0,
            finish: false,
            loading: false
        };

        this.continue = true;

        this.update = false;

        this.audio = document.createElement('audio');
        this.audio.preload = 'metadata';

        this.postX = 0;
        this.postO = null;
        this.move = false;

        this.changeTime = this.changeTime.bind(this);
        this.seeked = this.seeked.bind(this);
        this.changePlayStatus = this.changePlayStatus.bind(this);
        this.loadSongs = this.loadSongs.bind(this);
        this.onScrollHandle = this.onScrollHandle.bind(this);
        this.changeMusic = this.changeMusic.bind(this);
        this.songInfo = this.songInfo.bind(this);

        this._touchStart = this._touchStart.bind(this);
        this._touchMove = this._touchMove.bind(this);
        this._touchEnd = this._touchEnd.bind(this);

        this.keep = this.keep.bind(this);
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

    loadSongs(){

        this.setState({
            loading: true
        });

        //歌手歌曲
        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=fcg_v8_singer_track_cp.fcg&num=10&singermid='+this.state.singermid+'&begin='+this.state.offset).then((res)=>res.json()).then((json)=>{

            if(this.state.albumlist.length==0){
                for(let i=0;i<json.data.albumlist.length;i++){
                    this.state.albumlist.push({
                        albummid: json.data.albumlist[i].albummid,
                        albumpic: json.data.albumlist[i].pic,
                        albunmame: json.data.albumlist[i].name
                    });
                }
            }

            if(json.data.list.length>0){

                for(let i=0;i<json.data.list.length;i++){
                    this.state.song_list.push({
                        songmid: json.data.list[i].musicData.songmid,
                        uid: json.data.list[i].musicData.singer.id,
                        cover: '//y.gtimg.cn/music/photo_new/T002R300x300M000'+json.data.list[i].musicData.albummid+'.jpg',
                        title: json.data.list[i].musicData.songname,
                        singer: json.data.list[i].musicData.singer[0].name,
                        albumname: json.data.list[i].musicData.albumname,
                        duration: this.changeTime(json.data.list[i].musicData.interval)
                    });
                }

                this.setState({
                    offset: this.state.offset + 10
                })
            }
            else{
                this.setState({
                    finish: true
                });
                Toast('已全部加载完毕');
            }

            this.setState({
                loading: false
            });

            console.log(json);

        }).catch((error)=>{
            console.log(error)
        });
    }

    onScrollHandle(event){
        if(this.state.finish){
            return;
        }
        let clientHeight = event.target.clientHeight;
        let scrollHeight = event.target.scrollHeight;
        let scrollTop = event.target.scrollTop;
        if(clientHeight + scrollTop === scrollHeight){
            this.loadSongs();
        }
    }

    changeMusic(event){
        console.log(event.target);
        this.audio.pause();
        this.setState({
            mid: event.target.dataset.mid
        });
        this.update = true;
    }

    songInfo(isLoadSongs=true){
        //歌曲信息
        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=fcg_play_single_song.fcg&songmid=' + this.state.mid).then((res)=>res.json()).then((json)=>{

            let singer = '';
            if(json.data[0].singer.length>1){
                for(let i=0;i<json.data[0].singer.length;i++){
                    singer += json.data[0].singer[i].name;
                    if(i!=json.data[0].singer.length-1){
                        singer += '/';
                    }
                }
            }
            else{
                singer = json.data[0].singer[0].name;
            }

            this.setState({
                cover: {
                    backgroundImage: 'url(//y.gtimg.cn/music/photo_new/T002R300x300M000'+json.data[0].album.mid+'.jpg)'
                },
                title: json.data[0].title,
                singer: singer,
                totalTime: this.changeTime(json.data[0].interval),
                singermid: json.data[0].singer[0].mid
            });

            document.title = json.data[0].title + '/' + singer;

            for(let i in json.url){
                if(json.data[0].id == parseInt(i)){
                    this.audio.src = '//ws.stream.qqmusic.qq.com/C100'+json.data[0].mid+'.m4a?fromtag=38';
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

                    //播放结束
                    this.audio.addEventListener('ended',()=>{
                        if(this.continue){
                            this.setState({
                                paused: true
                            });
                        }
                    },false);
                }

            }

            if(isLoadSongs){
                this.loadSongs();
            }

            console.log(json);

        }).catch((error)=>{
            console.log(error)
        });
    }

    _touchStart(event){
        this.postX = event.touches[0].clientX;
        this.postO = document.getElementById('item_'+event.target.dataset.key);
        this.move = true;
    }

    _touchMove(event){
        if(!this.move){
            return;
        }
        let newPostX = event.changedTouches[0].clientX;
        if(this.postO.getAttribute('data-left')==1&&newPostX-this.postX<0){
            return;
        }
        if(newPostX-this.postX<-document.documentElement.clientWidth/2){
            this.move = false;
            this.postX = 0;
            this.postO.style.transform = 'translateX(-80px)';
            this.postO.style.transitionDuration = document.documentElement.clientWidth * 1.5 + 'ms';
            this.postO.setAttribute('data-left',1);
        }
        else if (newPostX-this.postX>0){
            this.move = false;
            this.postX = 0;
            this.postO.style.transform = 'translateX(0)';
            this.postO.setAttribute('data-left',2);
            if(newPostX-this.postX>document.documentElement.clientWidth/2){
                this.postO.style.transitionDuration = document.documentElement.clientWidth + 'ms';
            }
            else{
                this.postO.style.transitionDuration = '300ms';
            }
        }
        else{
            this.postO.style.transform = 'translateX('+(newPostX-this.postX)+'px)';
            this.postO.style.transitionDuration = '0ms';
        }
    }

    _touchEnd(event){
        if(!this.move){
            return;
        }
        let newPostX = event.changedTouches[0].clientX;
        if(newPostX-this.postX>-40){
            this.postO.style.transform = 'translateX(0)';
            this.postO.style.transitionDuration = '150ms';
            this.postO.setAttribute('data-left',2);
        }
        else{
            this.postO.style.transform = 'translateX(-80px)';
            this.postO.style.transitionDuration = '300ms';
            this.postO.setAttribute('data-left',1);
        }
        this.move = false;
        this.postX = 0;
    }

    keep(event){
        let newSongList = [];
        if(localStorage.song_list){
            newSongList = JSON.parse(localStorage.song_list);
        }
        if(newSongList.length>0){
            for(let i=0;i<newSongList.length;i++){
                if(newSongList[i].songmid == event.target.dataset.mid){
                    this.postO.style.transform = 'translateX(0)';
                    this.postO.style.transitionDuration = '300ms';
                    Toast('已收藏');
                    return;
                }
            }
        }
        newSongList.push({
            songmid: event.target.dataset.mid,
            cover: event.target.dataset.cover,
            title: event.target.dataset.title,
            singer: event.target.dataset.singer,
            albumname: event.target.dataset.albumname,
            duration: event.target.dataset.duration
        });
        localStorage.song_list = JSON.stringify(newSongList);

        console.log(localStorage.song_list);
        this.postO.style.transform = 'translateX(0)';
        this.postO.style.transitionDuration = '300ms';

        Toast('收藏成功');
    }

    render(){
        return (
            <div className="content">
                <MNav type="2"/>
                <div className="mBody mAudio" ref={ node => this.contentNode = node } style={this.state.cover}>

                    <div className="items">
                        <dl>
                            {
                                this.state.song_list.length ==0 || this.state.loading ? (
                                    <div className="loading">
                                        <span/>
                                        <span/>
                                        <span/>
                                        <span/>
                                        <span/>
                                        <span/>
                                    </div>
                                ) : ''
                            }
                            {
                                this.state.song_list.map((value,index)=>{
                                    return (
                                        <dt key={index} id={'item_'+index}>
                                            <div className="mSong" onTouchStart={this._touchStart} onTouchMove={this._touchMove} onTouchEnd={this._touchEnd}>
                                                <a data-key={index} data-mid={value.songmid} onClick={this.changeMusic}/>
                                                <i style={{backgroundImage: 'url('+value.cover+')'}}/>
                                                <div className="detail column">
                                                    <div className="title">{value.title}</div>
                                                    <div className="singer">{value.singer} - 《{value.albumname}》</div>
                                                </div>
                                                <div className="time">{value.duration}</div>
                                            </div>
                                            <a className="mButton keep" data-mid={value.songmid} data-cover={value.cover} data-title={value.title} data-singer={value.singer} data-albumname={value.albumname} data-duration={value.duration} onClick={this.keep}>收藏</a>
                                        </dt>
                                    )
                                })
                            }
                        </dl>
                    </div>

                </div>
                <div className="controlbars">
                    <div className={this.state.paused?'cover playStatue play':'cover playStatue pause'} onClick={this.changePlayStatus} style={this.state.cover}/>
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
        )
    }

    componentDidMount(){

        this.songInfo();

        if (this.contentNode) {
            this.contentNode.addEventListener('scroll', this.onScrollHandle);
        }
    }

    componentDidUpdate(){
        if(this.update){
            this.update = false;
            this.songInfo(false);
            console.log(123)
        }
    }

    componentWillUnmount(){
        this.continue = false;
        this.audio.pause();

        if (this.contentNode) {
            this.contentNode.removeEventListener('scroll', this.onScrollHandle);
        }
    }
}

export default MPlay;