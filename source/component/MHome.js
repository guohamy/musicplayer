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
            rankingList: sessionStorage.getItem('rankingList') ? JSON.parse(sessionStorage.getItem('rankingList')) : [],
            billborad: [1,2,11,21,22,23,24,25]
        };

        this.continue = true;
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
        if(this.state.billborad.length==0||!this.continue){
            return;
        }

        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=fcg_myqq_toplist.fcg',{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            this.setState({
                rankingList: json.data.topList
            });

            console.log(json);

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
                                                <Link to={'/ranking/'+value.id}/>
                                                <h3 className="top">{value.topTitle}</h3>
                                                <div className="bottom">
                                                    <div className="left" style={{backgroundImage: 'url('+value.picUrl+')'}}/>
                                                    <div className="right">
                                                        <dl>
                                                            {
                                                                value.songList.map((value,index)=>{
                                                                    return (
                                                                        <dt key={index}>
                                                                            <div className="mSong">
                                                                                <div className="detail">
                                                                                    <div className="number">{index+1}.</div>
                                                                                    <div className="title">{value.songname}</div>
                                                                                    <div className="quote">-</div>
                                                                                    <div className="singer">{value.singername}</div>
                                                                                </div>
                                                                            </div>
                                                                        </dt>
                                                                    )
                                                                })
                                                            }
                                                        </dl>
                                                    </div>
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
        if(!sessionStorage.getItem('rankingList')) {
            this.loadData();
        }
    }

    componentWillUnmount(){
        this.continue = false;
    }
}

export default MHome;