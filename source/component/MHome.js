import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MNav from './MNav';
import Toast from '../component/Toast';
import './MHome.scss';
import './MRanking.scss';

class MHome extends Component {
    constructor(props){
        super(props);

        this.state = {
            page: sessionStorage.getItem('page') ? parseInt(sessionStorage.getItem('page')) : 2,
            rankingList: sessionStorage.getItem('rankingList') ? JSON.parse(sessionStorage.getItem('rankingList')) : [],
            billborad: [1,2,11,21,22,23,24,25],
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

        this._touchStart = this._touchStart.bind(this);
        this._touchMove = this._touchMove.bind(this);
        this._touchEnd = this._touchEnd.bind(this);

        this.remove = this.remove.bind(this);
        this.keep = this.keep.bind(this);
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

    remove(event){
        let newSongList = JSON.parse(localStorage.song_list);
        for(let i=0;i<newSongList.length;i++){
            if(newSongList[i].songmid == event.target.dataset.mid){
                newSongList.splice(i,1);
            }
        }
        this.setState({
            song_list: newSongList
        });
        localStorage.song_list = JSON.stringify(newSongList);

        console.log(localStorage.song_list);
        this.postO.style.transform = 'translateX(0)';
        this.postO.style.transitionDuration = '300ms';

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

        this.setState({
            song_list: newSongList
        });

        this.postO.style.transform = 'translateX(0)';
        this.postO.style.transitionDuration = '300ms';

        Toast('收藏成功');
    }

    changeTime(t){
        let minutes = Math.floor(t/60);
        minutes = minutes<=9 ? '0' + minutes : minutes;
        let seconds = Math.floor(t % 60);
        seconds = seconds<=9 ? '0' + seconds : seconds;
        return minutes + ':' +seconds;
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

            console.log(json);

        }).catch((error)=>{
            console.log(error)
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
        console.log(3)
        if(this.state.finish){
            return;
        }
        let clientHeight = event.target.clientHeight;
        let scrollHeight = event.target.scrollHeight;
        let scrollTop = event.target.scrollTop;
        if(clientHeight + scrollTop === scrollHeight){
            console.log(123)
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
                                                <dt key={index} id={'item_'+index}>
                                                    <div className="mSong" onTouchStart={this._touchStart} onTouchMove={this._touchMove} onTouchEnd={this._touchEnd}>
                                                        <Link to={'/v/'+value.songmid} data-key={index} data-mid={value.songmid}/>
                                                        <i style={{backgroundImage: 'url('+value.cover+')'}}/>
                                                        <div className="detail column">
                                                            <div className="title">{value.title}</div>
                                                            <div className="singer">{value.singer} - 《{value.albumname}》</div>
                                                        </div>
                                                        <div className="time">{value.duration}</div>
                                                    </div>
                                                    <a className="mButton remove" data-mid={value.songmid} onClick={this.remove}>移除</a>
                                                </dt>
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
                                    this.state.rankingList.length ==0 ? (
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
                                this.state.loading ? (
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
                                                        <dt key={index} id={'item_'+index}>
                                                            <div className="mSong" onTouchStart={this._touchStart} onTouchMove={this._touchMove} onTouchEnd={this._touchEnd}>
                                                                <Link to={'/v/'+value.songmid} data-key={index} data-mid={value.songmid}/>
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
                                )
                            }

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

        fetch('//www.guohamy.cn/api/music.php?action=qqapi&method=gethotkey.fcg',{
            method: 'GET',
            dataType: 'json'
        }).then((res)=>res.json()).then((json)=>{

            this.setState({
                hotkeys: json.data.hotkey
            });

            console.log(json);

        }).catch((error)=>{
            console.log(error)
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