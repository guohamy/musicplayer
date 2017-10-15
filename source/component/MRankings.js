import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MNav from './MNav';
import './MRankings.scss';
import defaultCover from '../images/default_grey.png';

class MRankings extends Component {
    constructor(props){
        super(props);

        this.state = {
            song_list: [],
            billboard: {
                cover: {
                    backgroundImage: 'url('+ defaultCover +')'
                }
            }
        };

        this.loadData = this.loadData.bind(this);
        this.changeTime = this.changeTime.bind(this);
    }

    render(){
        return (
            <div className="content">
                <MNav type="2"/>
                <div className="mBody mRankings">
                    <div className="poster" style={{backgroundImage: 'url('+this.state.billboard.cover+')'}}/>
                    <div className="items">
                        <dl>
                            {
                                this.state.song_list.length ==0 ? (
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
                                        <dt key={index}>
                                            <Link to={'/v/'+value.songmid} className="mSong">
                                                <i style={{backgroundImage: 'url('+value.cover+')'}}/>
                                                <div className="detail">
                                                    <div className="number">{index+1}.</div>
                                                    <div className="column">
                                                        <div className="title">{value.title}</div>
                                                        <div className="singer">{value.singer} - 《{value.albumname}》</div>
                                                    </div>
                                                </div>
                                                <div className="time">{value.duration}</div>
                                            </Link>
                                        </dt>
                                    )
                                })
                            }
                        </dl>
                    </div>
                </div>
            </div>
        )
    }

    changeTime(t){
        let minutes = Math.floor(t/60);
        minutes = minutes<=9 ? '0' + minutes : minutes;
        let seconds = Math.floor(t % 60);
        seconds = seconds<=9 ? '0' + seconds : seconds;
        return minutes + ':' +seconds;
    }

    loadData(){
        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=fcg_v8_toplist_cp.fcg&topid='+this.props.match.params.id,{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            let song_list = this.state.song_list;
            for(let i=0;i<json.songlist.length;i++){
                song_list.push({
                    songmid: json.songlist[i].data.songmid,
                    uid: json.songlist[i].data.singer.id,
                    cover: '//y.gtimg.cn/music/photo_new/T002R300x300M000'+json.songlist[i].data.albummid+'.jpg',
                    title: json.songlist[i].data.songname,
                    singer: json.songlist[i].data.singer[0].name,
                    albumname: json.songlist[i].data.albumname,
                    duration: this.changeTime(json.songlist[i].data.interval)
                });
            }

            this.setState({
                billboard: {
                    cover: json.topinfo.pic_v12,
                    title: json.topinfo.ListName,
                    desc: json.topinfo.info
                }
            })

            console.log(json);

        }).catch((error)=>{
            console.log(error)
        });
    }

    componentDidMount(){
        this.loadData();
        if (this.contentNode) {
            this.contentNode.addEventListener('scroll', this.onScrollHandle);
        }
    }

    componentWillUnmount() {
        if (this.contentNode) {
            this.contentNode.removeEventListener('scroll', this.onScrollHandle);
        }
    }
}

export default MRankings;