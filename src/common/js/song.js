export default class song{
    constructor({id,mid,singer,name,album,durtion,image,url}){
        this.id =id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.durtion = durtion;
        this.image = image;
        this.url = url;
    }
}

//url 地址可能会报错
export function createSong(musicData){
    return new song({
        id:musicData.songid,
        mid:musicData.songmid,
        singer:filterSinger(musicData.singer),
        name:musicData.songname,
        album:musicData.albumname,
        durtion:musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`    
    })
}

function filterSinger(singer){
    let ret = [];
    if(!singer) return ''

    singer.forEach((s) => {
        ret.push(s.name)
    })

    return ret.join('/');
}