import React, { Component } from 'react';
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
            currentTime: '00:00',
            totalTime: '00:00',
            currentTimeLength: 0
        };

        this.audio = document.createElement('audio');
        this.audio.preload = 'metadata';

        this.changeTime = this.changeTime.bind(this);
    }

    changeTime(t){
        let minutes = Math.floor(t/60);
        minutes = minutes<=9 ? '0' + minutes : minutes;
        let seconds = Math.floor(t % 60);
        seconds = seconds<=9 ? '0' + seconds : seconds;
        return minutes + ':' +seconds;
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
                                    <time className="currentTime" ref="currentTime">{this.state.currentTime}</time>
                                    <div className="progress" ref="progress">
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
        fetch('//www.guohamy.cn/api/music.php?action=tingapi&method=baidu.ting.song.play&songid='+this.props.match.params.id,{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            this.setState({
                cover: {
                    backgroundImage: 'url('+json.songinfo.pic_big+')'
                },
                title: json.songinfo.album_title,
                singer: json.songinfo.author,
                totalTime: this.changeTime(json.bitrate.file_duration)
            });

            this.audio.src = '//www.guohamy.cn/api/music.php?action=tingmusic&url=' + json.bitrate.file_link;
            this.audio.play();

            //播放时间改变
            this.audio.addEventListener('timeupdate',()=>{
                this.setState({
                    currentTime: this.changeTime(this.audio.currentTime),
                    currentTimeLength: this.audio.currentTime/json.bitrate.file_duration*100+'%'
                });
            },false);
            console.log(json);


        }).catch((error)=>{
            console.log(error)
        });
    }

    componentWillUnmount(){
        this.audio.pause();
    }
}

export default MPlay;