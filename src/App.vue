<template>
  <div id="app">
    <!-- <el-container>
      <el-header>
        <navigation></navigation>
      </el-header>
      <el-main>
         <router-view/>
      </el-main>
    </el-container> -->
    <router-view/>
  </div>
</template>
<script>
//  import navigation from "./components/navigation/navigation.vue";

  export default {
    name: 'App',
    // components: {
    //   navigation
    // }
  };
</script>