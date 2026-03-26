<template lang="pug">
  div.form-template-center
    div.modal
      .page-intro
        .page-intro__logo: img(src="/images/logo.svg")
        .page-intro__title: h3 MetriumBot
        .page-intro__desc Что бы воспользоваться функцилналом сайта войдите или зарегистрируйтесь
        .page-intro__buttons
         
          button.btn.btn-wide(@click="Login()"): span Войти
          router-link(to="/registration")
            button.btn.btn-wide.btn-line: span Зарегистрироваться
             
</template>

<script>
    export default {
      name: 'Home',

      methods: {
        Login() {
          if(localStorage.getItem('token')) {
            this.$router.push('/chat')
            return
          }

          this.$router.push('/login')
        }
      }

    }
</script>
