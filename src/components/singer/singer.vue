<template>
  <div class="singer">
    <keep-alive>
       <list-view :data="singers"></list-view>
    </keep-alive>
     
  </div>
</template>

<script>
import {getSingerList} from 'api/singer';
import { ERR_OK } from "api/config";
import Singer from 'common/js/singer'; 
import ListView from 'base/listview/listview';

const HOT_NAME = '热门';
const HOT_SINGER_SIZE = 10;
export default {
  data(){
    return{
      singers:[]
    }
  },
  components:{
    ListView
  },
  created(){
    this._getSingerList();
  },
  methods:{
   _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
  _normalizeSinger(List){
    let map ={
      hot:{
        title:HOT_NAME,
        items:[]
      }
    }
    List.forEach((item,index) => {
      if(index < HOT_SINGER_SIZE) {
        map.hot.items.push(new Singer(item.Fsinger_mid,item.Fsinger_name))
      }

      const key = item.Findex;

      if(!map[key]){
        map[key] = {
          title:key,
          items:[]
        }
      }

      map[key].items.push(new Singer(item.Fsinger_mid,item.Fsinger_name))
    });
    
    //得到有序列表

    let hot = [];
    let ret = [];
    for(let key in map){
      let val = map[key];

      if(val.title.match(/[a-zA-z]/)) {
        ret.push(val)
      }else if(val.title === HOT_NAME){
        hot.push(val)
      }
    }

    ret.sort( (a,b) => {
      return  a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    // console.log(map)
      return hot.concat(ret);
  }
  }
  
}
</script>

<style lang="scss" scoped>
  .singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>


