<template>
  <scroll class="suggest" :beforeScoll="beforeScoll" @beforeScroll="listScroll" :data="result" :pullup="pullup" @scrollToEnd="searchMore" ref ="suggest">
      <ul class="suggest-list">
          <li class="suggest-item" v-for="(item,index) in result" @click="selectItem(item)">
              <div class="icon">
                  <i :class="getIconClass(item)"></i>
              </div>
              <div class="name">
                  <p class="text" v-html="getDisplayName(item)"></p>
              </div>
          </li>
          <loading v-show="hasMore" title=""></loading>
      </ul>
      <div class="no-result-wrapper" v-show="!hasMore && !result.length">
        <no-result :text  ="noResultStr"></no-result>
      </div>
  </scroll>
</template>

<script>
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import Singer from "common/js/singer";
import { mapMutations } from "vuex";
import {mapActions} from 'vuex';
import NoResult from 'base/no-result/no-result';

const TYPE_SINGER = "singer";
const PER_PAGE = 20;
export default {
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      noResultStr:'抱歉，暂无搜索结果',
      beforeScoll:true
    };
  },
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    search() {
      this.page = 1;
      this.$refs.suggest.scrollTo(0, 0);
      this.hasMore = true;
      search(this.query, this.page, this.showSinger, PER_PAGE).then(res => {
        if (res.code == ERR_OK) {
          this.result = this._getResult(res.data);
          this.checkMore(res.data);
        }
      });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, PER_PAGE).then(res => {
        if (res.code == ERR_OK) {
          this.result = this.result.concat(this._getResult(res.data));
          this.checkMore(res.data);
        }
      });
    },
    checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * PER_PAGE >= song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    _getResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    getIconClass(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    refresh(){
      this.$refs.suggest.refresh();
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer(
            item.singermid,
             item.singername
          )
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      }else{
          this.insertSong(item)
      }
      this.$emit('select')
    },
    listScroll(){
      this.$emit('listScroll')
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions([
        'insertSong'
    ])
  },
  watch: {
    query() {
      this.search();
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>

<style lang="scss" scoped>
@import "~common/style/variable";
@import "~common/style/mixin";

.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }
    .icon {
      flex: 0 0 30px;
      width: 30px;
      [class^="icon-"] {
        font-size: 14px;
        color: $color-text-d;
      }
    }
    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;
      .text {
        @include no-wrap();
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>


