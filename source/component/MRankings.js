import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MNav from './MNav';
import './MRankings.scss';
import Toast from '../component/Toast';

class MRankings extends Component {
    constructor(props){
        super(props);

        this.state = {
            offset: 0,
            song_list: [],
            billboard: {},
            finish: false
        };

        this.loadData = this.loadData.bind(this);
        this.changeTime = this.changeTime.bind(this);
        this.onScrollHandle = this.onScrollHandle.bind(this);
    }

    render(){
        return (
            <div className="content">
                <MNav type="2"/>
                <div className="mBody mRankings" ref={ node => this.contentNode = node }>
                    <div className="poster" style={{backgroundImage: 'url('+this.state.billboard.cover+')'}}/>
                    <div className="items">
                        <dl>
                            {
                                this.state.song_list.map((value,index)=>{
                                    return (
                                        <dt key={index}>
                                            <Link to={'/v/'+value.songid} className="mSong">
                                                <i style={{backgroundImage: 'url('+value.cover+')'}}/>
                                                <div className="detail">
                                                    <div className="title">{value.title}</div>
                                                    <div className="singer">{value.singer}</div>
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

            console.log(json);

            /*if(json.song_list==null){
                this.setState({
                    finish: true
                });
                Toast('已全部加载完毕');
            }
            else{
                let song_list = this.state.song_list;
                for(let i=0;i<json.song_list.length;i++){
                    song_list.push({
                        songid: json.song_list[i].song_id,
                        uid: json.song_list[i].ting_uid,
                        cover: '//www.guohamy.cn/api/music.php?action=tingpic&url=' + json.song_list[i].pic_big,
                        title: json.song_list[i].title,
                        singer: json.song_list[i].author,
                        duration: this.changeTime(json.song_list[i].file_duration)
                    });
                }

                if(this.state.offset==0){
                    this.setState({
                        billboard: {
                            cover: '//www.guohamy.cn/api/music.php?action=tingpic&url=' + json.billboard.pic_s192,
                            title: json.billboard.name,
                            desc: json.billboard.comment
                        }
                    })
                }

                let offset = this.state.offset + 10;

                this.setState({
                    song_list: song_list,
                    offset: offset
                });
            }*/

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
            this.loadData();
        }
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