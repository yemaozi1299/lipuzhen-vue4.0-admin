<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus">
html,body{
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
  
}
.mg-l-10{
  margin-left: 10px;
}
.mg-l-20{
  margin-left: 20px;
}
.mg-r-10{
  margin-right: 10px;
}
.mg-r-20{
  margin-right: 20px;
}




</style>
