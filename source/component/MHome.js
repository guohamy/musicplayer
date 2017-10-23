import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MNav from './MNav';
import MSingItem from './MSingItem';
import MLoading from './MLoading';
import Toast from './Toast';
import './MHome.scss';
import './MRanking.scss';

class MHome extends Component {
    constructor(props){
        super(props);

        this.state = {
            page: sessionStorage.getItem('page') ? parseInt(sessionStorage.getItem('page')) : 2,
            rankingList: sessionStorage.getItem('rankingList') ? JSON.parse(sessionStorage.getItem('rankingList')) : [],
            song_list: localStorage.song_list ? JSON.parse(localStorage.song_list) : [],
            hotkeys: [],
            searchValue: '',
            searched: false,
            searchList: [],
            finish: false,
            loading: false
        };

        this.continue = true;
        this.searchPage = 1;
        this.changePage = this.changePage.bind(this);
        this.loadData = this.loadData.bind(this);

        this.changeSongeList = this.changeSongeList.bind(this);

        this.changeTime = this.changeTime.bind(this);
        this.changeSearchValue = this.changeSearchValue.bind(this);
        this._search = this._search.bind(this);
        this.keySearch = this.keySearch.bind(this);
        this.fastSearch = this.fastSearch.bind(this);
        this.search = this.search.bind(this);

        this.onSearchScrollHandle = this.onSearchScrollHandle.bind(this);
    }

    changePage(page){
        this.setState({
            page: page
        });

        sessionStorage.setItem('page',page);
    }

    loadData(){
        if(!this.continue){
            return;
        }

        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=fcg_myqq_toplist.fcg',{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            this.setState({
                rankingList: json.data.topList
            });

        }).catch((error)=>{
            Toast(error)
        });
    }

    changeSongeList(newSongList){
        this.setState({
            song_list: newSongList
        });
    }

    changeTime(t){
        let minutes = Math.floor(t/60);
        minutes = minutes<=9 ? '0' + minutes : minutes;
        let seconds = Math.floor(t % 60);
        seconds = seconds<=9 ? '0' + seconds : seconds;
        return minutes + ':' + seconds;
    }

    changeSearchValue(event){
        this.setState({
            searchValue: event.target.value
        });
    }

    _search(keyword=this.state.searchValue){

        this.setState({
            loading: true
        });

        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=search_for_qq_cp&n=10&p='+this.searchPage+'&w='+keyword.replace(' ',''),{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            if(json.data.song.list.length>0){

                let searchList = this.state.searchList;
                for(let i=0;i<json.data.song.list.length;i++){
                    searchList.push({
                        songmid: json.data.song.list[i].songmid,
                        uid: json.data.song.list[i].singer.id,
                        cover: '//y.gtimg.cn/music/photo_new/T002R300x300M000'+json.data.song.list[i].albummid+'.jpg',
                        title: json.data.song.list[i].songname,
                        singer: json.data.song.list[i].singer[0].name,
                        albumname: json.data.song.list[i].albumname,
                        duration: this.changeTime(json.data.song.list[i].interval)
                    });
                }

                this.searchPage += 1;
                this.setState({
                    searched: true,
                    finish: false
                })
            }
            else{
                this.setState({
                    finish: true
                });
                Toast('已加载完全部');
            }

            this.setState({
                loading: false
            });

        }).catch((error)=>{
            Toast(error)
        });
    }

    keySearch(event){
        if(event.keyCode==13){
            this.setState({
                searchList: []
            });
            this._search();
        }
    }

    fastSearch(event){
        this.setState({
            searchValue: event.target.dataset.value
        });
        this._search(event.target.dataset.value);
    }

    search(){
        this.setState({
            searchList: []
        });
        this._search();
    }

    onSearchScrollHandle(){
        if(this.state.finish){
            return;
        }
        let clientHeight = event.target.clientHeight;
        let scrollHeight = event.target.scrollHeight;
        let scrollTop = event.target.scrollTop;
        if(clientHeight + scrollTop === scrollHeight){
            this._search();
        }
    }

    render(){
        return (
            <div className="content">
                <MNav changePage={this.changePage} page={this.state.page}/>
                {
                    this.state.page === 1 ? (
                        <div className="mBody mMyself">

                            <div className={this.state.song_list.length==0?'items none':'items'}>
                                <dl>
                                    {
                                        this.state.song_list.map((value,index)=>{
                                            return (
                                                <MSingItem key={index} index={index} songmid={value.songmid} cover={value.cover} title={value.title} singer={value.singer} albumname={value.albumname} duration={value.duration} remove={true} changeSongeList={this.changeSongeList}/>
                                            )
                                        })
                                    }
                                </dl>
                            </div>

                        </div>
                    ) : ''
                }
                {
                    this.state.page === 2 ? (
                        <div className="mBody mRanking">
                            <ul>
                                {
                                    this.state.rankingList.length ==0 ? <MLoading/> : ''
                                }
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
                        <div className="mBody mSearch">
                            <div className="search">
                                <input type="text" className="search" placeholder="输入关键字" value={this.state.searchValue} onChange={this.changeSearchValue} onKeyDown={this.keySearch}/>
                                <a onClick={this.search}>搜索</a>
                            </div>
                            {
                                this.state.loading ? <MLoading/> : ''
                            }
                            {
                                !this.state.searched ? (
                                    <div className="hotkey">
                                        <div className="title">热门搜索</div>
                                        <div className="list">
                                            {
                                                this.state.hotkeys.map((value,index)=>{
                                                    return (
                                                        <a key={index} data-value={value.k} onClick={this.fastSearch}>{value.k}</a>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                ) : (
                                    <div className="items" ref={ node => this.contentNode = node }>
                                        <dl>
                                            {
                                                this.state.searchList.map((value,index)=>{
                                                    return (
                                                        <MSingItem key={index} index={index} songmid={value.songmid} cover={value.cover} title={value.title} singer={value.singer} albumname={value.albumname} duration={value.duration} keep={true} changeSongeList={this.changeSongeList}/>
                                                    )
                                                })
                                            }
                                        </dl>
                                    </div>
                                )
                            }

                        </div>
                    ) : ''
                }
            </div>
        )
    }

    componentDidMount(){
        document.title = '音乐播放器';

        if(!sessionStorage.getItem('rankingList')) {
            this.loadData();
        }

        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=gethotkey.fcg',{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            this.setState({
                hotkeys: json.data.hotkey
            });

        }).catch((error)=>{
            Toast(error)
        });
    }

    componentDidUpdate(){
        if (this.contentNode) {
            this.contentNode.addEventListener('scroll', this.onSearchScrollHandle);
        }
    }

    componentWillUnmount(){
        this.continue = false;

        if (this.contentNode) {
            this.contentNode.removeEventListener('scroll', this.onSearchScrollHandle);
        }
    }
}

export default MHome;