<template>
    <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll"  @scroll="scroll" :probeType="probeType">
       <ul>
           <li v-for="group in data" class="list-group" ref="listGroup">
               <h2 class="list-group-title">{{group.title}}</h2>
               <ul>
                   <li class="list-group-item" @click="selectItem(item)" v-for="item in group.items">
                       <img v-lazy="item.avatar" class="avatar" alt="">
                       <span class="name">{{item.name}}</span>
                   </li>
               </ul>
           </li>
       </ul>
       <div class="list-shortcut">
           <ul>
               <li v-for="(item,index) in shortcutList"
                    @touchstart="onShortCutTouchStart"
                    @touchmove.stop="onShortCutTouchMove"  
                    :data-index="index" class="item" :class="{'current':currentIndex == index}">{{item}}</li>
           </ul>
       </div>
       <div class="list-fixed" v-show="fixTitle" ref="fixed">
           <h1 class="fixed-title">{{fixTitle}}</h1>
       </div>
        <div class="loading-container" v-show="!data.length">
                <loading></loading>
            </div>
    </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 20;
export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    Scroll,
    Loading
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listheight = [];
    this.probeType = 3;
  },
  computed: {
    shortcutList() {
      return this.data.map(item => {
        return item.title.substr(0, 1);
      });
    },
    fixTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
      //   console.log(this.scrollY );
    },
    onShortCutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];

      this.touch.y1 = firstTouch.pageY;

      this.touch.anchorIndex = anchorIndex;

      this._scrollTo(anchorIndex);
    },
    onShortCutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0; //偏移取整

      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }

      if (index < 0) {
        index = 0;
      } else if (index > this.listheight.length - 2) {
        index = this.listheight.length - 2;
      }

      this.scrollY = -this.listheight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      this.listheight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listheight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listheight.push(height);
      }
    },
    selectItem(item) {
      this.$emit("select", item);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listheight;

      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }

      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/style/variable";
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
