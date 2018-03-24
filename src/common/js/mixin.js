import {mapGetters} from 'vuex';
export const playlistMixin = {
    computed:{
        ...mapGetters([
            'playlist'
        ])
    },
    munted(){
        this.handelPlayList(this.palylist)
    },
    activated(){
        this.handleplayList(this.playlist)
    },
    watch:{
        playlist(newval){
            this.handleplayList(newval)
        },
    },
    methods:{
        handlePlayList(){
            throw  new Error('Component must implement handlePlayList method')
        }
    }
}