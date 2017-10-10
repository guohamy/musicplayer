import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './MNav.scss';

class MNav extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <nav className="nav">
                <NavLink to="/" exact className="active">我的</NavLink>
                <NavLink to="/ranking">排行榜</NavLink>
                <NavLink to="/">搜索</NavLink>
            </nav>
        )
    }
}

export default MNav;