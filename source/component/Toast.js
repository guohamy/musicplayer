import './Toast.scss';

let TipsShow = (o,text,time,callback)=>{
    localStorage.toast = text;
    o.innerHTML = text;
    var tipsTime = 0;
    let t = setInterval(()=>{
        tipsTime += 33;
        if(tipsTime>time){
            clearInterval(t);
            o.classList.remove('show');
            setTimeout(()=>{
                callback()
            },1000)
        }
    },33)
};

let Toast = (text,time=1500,callback=()=>console.log('隐藏消息框'))=>{
    let msgTips = document.getElementsByClassName('toast');
    if(msgTips.length>0){
        if(msgTips[0].className.match(new RegExp( "(\\s|^)show(\\s|$)"))){
            if(text!=localStorage.toast){
                TipsShow(msgTips[0],text,time,callback)
            }
            return false;
        }
        msgTips[0].classList.add('show');
        TipsShow(msgTips[0],text,time,callback)
    }
    else{
        let body = document.getElementsByTagName('body')[0];
        let msgTips = document.createElement('div');
        msgTips.className = 'toast show';
        body.appendChild(msgTips);
        TipsShow(msgTips,text,time,callback)
    }
};

export default Toast;