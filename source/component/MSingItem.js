import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Toast from './Toast';
import './MSingItem.scss';

class MSingItem extends Component {
    constructor(props){
        super(props);

        this.postX = 0;
        this.postO = null;
        this.move = false;

        this._touchStart = this._touchStart.bind(this);
        this._touchMove = this._touchMove.bind(this);
        this._touchEnd = this._touchEnd.bind(this);
        this.remove = this.remove.bind(this);
        this.keep = this.keep.bind(this);

        this.changeMusic = this.changeMusic.bind(this);
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
            this.postO.style.webkitTransform = 'translateX(-80px)';
            this.postO.style.transitionDuration = document.documentElement.clientWidth * 1.5 + 'ms';
            this.postO.style.webkitTransitionDuration = document.documentElement.clientWidth * 1.5 + 'ms';
            this.postO.setAttribute('data-left',1);
        }
        else if (newPostX-this.postX>0){
            this.move = false;
            this.postX = 0;
            this.postO.style.transform = 'translateX(0)';
            this.postO.setAttribute('data-left',2);
            if(newPostX-this.postX>document.documentElement.clientWidth/2){
                this.postO.style.transitionDuration = document.documentElement.clientWidth + 'ms';
                this.postO.style.webkitTransitionDuration = document.documentElement.clientWidth + 'ms';
            }
            else{
                this.postO.style.transitionDuration = '300ms';
                this.postO.style.webkitTransitionDuration = '300ms';
            }
        }
        else{
            this.postO.style.transform = 'translateX('+(newPostX-this.postX)+'px)';
            this.postO.style.webkitTransform = 'translateX('+(newPostX-this.postX)+'px)';
            this.postO.style.transitionDuration = '0ms';
            this.postO.style.webkitTransitionDuration = '0ms';
        }
    }

    _touchEnd(event){
        if(!this.move){
            return;
        }
        let newPostX = event.changedTouches[0].clientX;
        if(newPostX-this.postX>-40){
            this.postO.style.transform = 'translateX(0)';
            this.postO.style.webkitTransform = 'translateX(0)';
            this.postO.style.transitionDuration = '150ms';
            this.postO.style.webkitTransitionDuration = '150ms';
            this.postO.setAttribute('data-left',2);
        }
        else{
            this.postO.style.transform = 'translateX(-80px)';
            this.postO.style.webkitTransform = 'translateX(-80px)';
            this.postO.style.transitionDuration = '300ms';
            this.postO.style.webkitTransitionDuration = '300ms';
            this.postO.setAttribute('data-left',1);
        }
        this.move = false;
        this.postX = 0;
    }

    remove(event){
        let newSongList = JSON.parse(localStorage.song_list);
        for(let i=0;i<newSongList.length;i++){
            if(newSongList[i].songmid == event.target.dataset.mid){
                newSongList.splice(i,1);
            }
        }

        this.props.changeSongeList(newSongList);
        localStorage.song_list = JSON.stringify(newSongList);

        this.postO.style.transform = 'translateX(0)';
        this.postO.style.webkitTransform = 'translateX(0)';
        this.postO.style.transitionDuration = '300ms';
        this.postO.style.webkitTransitionDuration = '300ms';

        Toast('已删除');
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
                    this.postO.style.webkitTransform = 'translateX(0)';
                    this.postO.style.transitionDuration = '300ms';
                    this.postO.style.webkitTransitionDuration = '300ms';
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

        this.props.changeSongeList(newSongList);

        this.postO.style.transform = 'translateX(0)';
        this.postO.style.webkitTransform = 'translateX(0)';
        this.postO.style.transitionDuration = '300ms';
        this.postO.style.webkitTransitionDuration = '300ms';

        Toast('收藏成功');
    }

    changeMusic(event){
        this.props.changeMusic(event.target.dataset.mid);
    }

    render(){
        return (
            <dt id={'item_' + this.props.index}>
                <div className="mSong" onTouchStart={this._touchStart} onTouchMove={this._touchMove} onTouchEnd={this._touchEnd}>
                    {
                        this.props.changeMusic ? (
                            <a data-key={this.props.index} data-mid={this.props.songmid} onClick={this.changeMusic}/>
                        ) : (
                            <Link to={'/v/'+this.props.songmid} data-key={this.props.index} data-mid={this.props.songmid}/>
                        )
                    }
                    <i style={{backgroundImage: 'url('+this.props.cover+')'}}/>
                    <div className="detail column">
                        <div className="title">{this.props.title}</div>
                        <div className="singer">{this.props.singer} - 《{this.props.albumname}》</div>
                    </div>
                    <div className="time">{this.props.duration}</div>
                </div>
                {
                    this.props.remove ? (
                        <a className="mButton remove" data-mid={this.props.songmid} onClick={this.remove}>移除</a>
                    ) : ''
                }
                {
                    this.props.keep ? (
                        <a className="mButton keep" data-mid={this.props.songmid} data-cover={this.props.cover} data-title={this.props.title} data-singer={this.props.singer} data-albumname={this.props.albumname} data-duration={this.props.duration} onClick={this.keep}>收藏</a>
                    ) : ''
                }
            </dt>
        )
    }
}

export default MSingItem;