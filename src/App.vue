<template>
  <router-view></router-view>
</template>

<script>

export default {
  data () {
    return {}
  },
  methods: {
  },
  mounted () {
    window.addEventListener('keydown', (e) => {
      let keyCode = e.keyCode || e.which || e.charCode
      let ctrlKey = e.ctrlKey || e.metaKey
      console.log(e)
    })
  }
}
</script>

<style media="screen">
html,body {
  height: 100%;
}
</style>
