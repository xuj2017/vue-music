<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { ERR_OK } from "api/config";
import { getSingerDetail } from "api/singer";
import { createSong } from "common/js/song";
import MusicList from "components/music-list/music-list";
export default {
  data() {
    return {
      songs: []
    };
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    this._getSingerDetail(this.singer.id);
  },
  methods: {
    _getSingerDetail(id) {
      if (!this.singer.id) {
        this.$router.push("/singer");
      }
      getSingerDetail(id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list);
            console.log(this.songs)
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;

        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      });

      return ret;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/style/variable";

.singer-detail {
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: $color-background;
}
.slide-enter-active,
.slide-leave-active {
  transform: translate3d(0%, 0, 0);
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
