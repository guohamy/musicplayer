import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MNav from './MNav';
import './MHome.scss';
import './MRanking.scss';

class MHome extends Component {
    constructor(props){
        super(props);

        this.state = {
            page: sessionStorage.getItem('page') ? parseInt(sessionStorage.getItem('page')) : 1,
            rankingList: [],
            billborad: [1,2,11,21,22,23,24,25]
        };

        this.changePage = this.changePage.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    changePage(page){
        this.setState({
            page: page
        });

        sessionStorage.setItem('page',page);
    }

    loadData(){
        if(this.state.billborad.length==0){
            return;
        }

        fetch('//www.guohamy.cn/api/music.php?action=tingapi&method=baidu.ting.billboard.billList&type='+this.state.billborad[0]+'&size=3&offset=0',{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            let song_list = [],rankingList = this.state.rankingList;
            for(let i=0;i<json.song_list.length;i++){
                song_list.push({
                    songid: json.song_list[i].song_id,
                    uid: json.song_list[i].ting_uid,
                    cover: '//www.guohamy.cn/api/music.php?action=tingpic&url=' + json.song_list[i].pic_big,
                    title: json.song_list[i].title,
                    singer: json.song_list[i].author
                });
            }

            rankingList.push({
                billboard: {
                    type: json.billboard.billboard_type,
                    cover: '//www.guohamy.cn/api/music.php?action=tingpic&url=' + json.billboard.pic_s192,
                    title: json.billboard.name,
                    desc: json.billboard.comment
                },
                song_list: song_list
            });

            this.setState({
                rankingList: rankingList
            });

            this.state.billborad.splice(0,1);

            this.loadData()

        }).catch((error)=>{
            console.log(error)
        });
    }

    render(){
        return (
            <div className="content">
                <MNav changePage={this.changePage} page={this.state.page}/>
                {
                    this.state.page === 1 ? (
                        <div>
                            Home
                        </div>
                    ) : ''
                }
                {
                    this.state.page === 2 ? (
                        <div className="mBody mRanking">
                            <ul>
                                {
                                    this.state.rankingList.map((value,index)=>{
                                        return (
                                            <li key={index}>
                                                <Link to={'./ranking/'+value.billboard.type}/>
                                                <div className="top">
                                                    <div className="left" style={{backgroundImage: 'url('+value.billboard.cover+')'}}/>
                                                    <div className="right">
                                                        <h3>{value.billboard.title}</h3>
                                                        <p>{value.billboard.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="bottom">
                                                    <dl>
                                                        {
                                                            value.song_list.map((value,index)=>{
                                                                return (
                                                                    <dt key={index}>
                                                                        <div className="mSong">
                                                                            <i style={{backgroundImage: 'url('+value.cover+')'}}/>
                                                                            <div className="detail">
                                                                                <div className="title">{value.title}</div>
                                                                                <div className="singer">{value.singer}</div>
                                                                            </div>
                                                                            <div className={'mark m' + (index + 1)}/>
                                                                        </div>
                                                                    </dt>
                                                                )
                                                            })
                                                        }
                                                    </dl>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    ) : ''
                }
                {
                    this.state.page === 3 ? (
                        <div>
                            Search
                        </div>
                    ) : ''
                }
            </div>
        )
    }

    componentDidMount(){
        this.loadData()
    }
}

export default MHome;