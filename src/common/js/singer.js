export default class Singer{
    constructor(id,name){
        // this.id = id;
        // this.name = name ;
        // this.avator = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`;

        return {
           id:id,
           name:name,
           avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
        }
    }
}
