<template>
  <div class="recommend" ref="recommend">
      <scroll class="recommend-content"  :data="descList" ref="srcoll">
          <div>
            <div v-if="recommends.length" class="slider-wrapper">
                <slider>
                    <div v-for="item in recommends">
                        <a :href="item.linkUrl">
                            <img class="needsclick" :src="item.picUrl" alt="">
                        </a>
                    </div>
                </slider>
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                    <li v-for="item in descList" class="item">
                        <div class="icon">
                            <img  @load="loadImage" width="60" height="60"  v-lazy="item.imgurl" alt="">
                        </div>
                        <div class="text">
                            <h2 class="name" v-html="item.creator.name"></h2>
                            <p class="desc" v-html="item.dissname"></p>
                        </div>
                    </li>
                </ul>
            </div>
            </div>
            <div class="loading-container" v-show="!descList.length">
                <loading></loading>
            </div>
          </scroll>
      
  </div>
</template>

<script>
import Slider from "base/slider/slider";
import { getRecommend, getDescList } from "api/recommend";
import { ERR_OK } from "api/config";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
export default {
  data() {
    return {
      recommends: [],
      descList: [],
      checkLoaded:false
    };
  },
  created() {
    this._getRecommend();
    this._getDescList();
    
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
            // console.log(res.data.slider);
          this.recommends = res.data.slider;
        }
      });
    },
    _getDescList() {
      getDescList().then(res => {
        if (res.code === ERR_OK) {
        //   console.log(res.data.list);
          this.descList = res.data.list;
        }
      });
    },
    loadImage(){
        // console.log(111111)
        if(!this.checkLoaded){
            this.$refs.srcoll.refresh()
            this.checkLoaded = true;
            // console.log(123123)
        }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "~common/style/variable";
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slide-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .desc {
            color: $color-text-d;
          }
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>


