<script setup>
 
</script>

<template lang="pug">
  div.form-template-center
    div.modal
      .page-intro
        .page-intro__logo: img(src="/images/logo.svg")
        .page-intro__title: h3 MetriumBot
        .page-intro__desc Что бы воспользоваться функцилналом сайта войдите или зарегистрируйтесь
        .page-intro__buttons
          router-link(to="/login")
            button.btn.btn-wide: span Войти
          router-link(to="/registration")
            button.btn.btn-wide.btn-line: span Зарегистрироваться
             
</template>
