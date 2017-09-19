<style>
  .login{width:360px;height:360px;background:rgba(255,255,255,.9);border-radius:3px;}
  .form-box{margin:0 30px;}
</style>
<template>
  <div class="flex flex-center full-height bg">
    <div class="login">
      <div class="form-box">
        <div ref="form">
          <div class="form-item flex">
            <i class="fa fa-user-o"></i>
            <input v-model="form.userName" placeholder="用户名">
          </div>
          <div class="form-item flex">
            <i class="fa fa-lock"></i>
            <input type="password" v-model="form.password" placeholder="密码">
          </div>
          <div style="width:100%;">
            <button :disabled="disable" style="width:100%;" @click="submit">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        disable: true,
        form: {
          userName: '',
          password: ''
        }
      }
    },
    created () {
      const self = this
      self.$watch('form', () => {
        if (self.form.userName && self.form.password) {
          self.disable = false
        } else {
          self.disable = true
        }
      }, {deep: true})
    },
    methods: {
      submit () {
        const self = this
        self.$api.login().then(res=>{
          console.log(res)
          const token = res.data.token
          self.$store.commit('setToken', token)
          self.$cookie.set('authorization', token, {expire: 30})
          const url = self.$route.query.redirect || '/'
          self.$router.replace(url)
        })
      }
    }
  }
</script>
