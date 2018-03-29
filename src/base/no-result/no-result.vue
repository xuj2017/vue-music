<template>
  <div class="no-result">
      <div class="no-result-icon"></div>
      <p class="no-result-text">{{text}}</p>
  </div>
</template>

<script>
export default {
  props:{
      text:{
          type:String,
          default:''
      }
  }
}
</script>

<style lang="scss" scoped>
@import '~common/style/variable';
@import '~common/style/mixin';
.no-result{
    text-align: center;
    .no-result-icon{
        width: 86px;
        height:90px;
        margin:0 auto;
        @include bg-image('no-result');
        background-size:86px 90px;
    }
    .no-result-text{
        margin-top: 30px;
        font-size:$font-size-medium;
        color:$color-text-d;
    }
}
</style>
