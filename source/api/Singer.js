import URlConsts from './URLConst'

export default class Singer {

    constructor(singermid) {
        // 歌手id
        this.singermid = singermid
    }

    /**
     * 相似歌手
     * @param {Number} start
     * @param {Number} num
     */
    simsinger(start = 0, num = 5) {
        let url = `${URLConsts.URL_SINGER_SIM}&singer_mid=${this.singermid}&start=${start}&num=${num}`
        return fetch(url)
    }

    /**
     * 歌曲
     * @param {Number} begin
     * @param {Number} num
     */
    songs(begin = 0, num = 30) {
        let url = `${URLConsts.URL_SINGER_SONGS}&singermid=${this.singermid}&begin=${begin}&num=${num}`
        return fetch(url)
    }

    /**
     * 专辑
     * @param {Number} begin
     * @param {Number} num
     */
    albums(begin = 0, num = 30) {
        let url = `${URLConsts.URL_SINGER_ALBUM}&singermid=${this.singermid}&begin=${begin}&num=${num}`
        return fetch(url)
    }

    /**
     * 获得歌手的mvs
     * @param {Number} begin 开始下标
     * @param {Number} num  数量
     * @param {Number} order 排序 time /listen
     * @param {Number} cmd 1 爱豆视频
     */
    mvs(begin = 0, num = 10, order = 'listen', cmd = undefined) {
        let url = `${URLConsts.URL_SINGER_MVS}&singermid=${this.singermid}&begin=${begin}&num=${num}&order=${order}`
        if (cmd) {
            url += '&cmd=1'
        }
        return fetch(url)
    }

    /**
     * 歌手描述 tested
     * var doc = (new DOMParser()).parseFromString(content,'text/xml')
     * doc.querySelector('info').textContent
     */
    desc() {
        let r = new Date().getTime()
        let url = `${URLConsts.URL_SINGER_DESC}&singermid=${this.singermid}&r=${r}`
        return fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                '_referer': 'https://c.y.qq.com/xhr_proxy_utf8.html'
            }
        })
    }

    /**
     * 获得粉丝数
     */
    fans() {
        let r = new Date().getTime()
        let url = `${URLConsts.URL_SINGER_FANS}&singermid=${this.singermid}&r=${r}`
        return fetch(url)
    }

    /**
     * 获得推荐歌曲，和专辑3个
     */
    track(begin = 0, num = 8) {
        let url = `${URLConsts.URL_SINGER_TRACK}&begin=${begin}&num=${num}&_=${new Date().getTime()}&singermid=${this.singermid}`
        return fetch(url)
    }

}