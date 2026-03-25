<script setup>
 
</script>

<template lang="pug">
  div.form-template-center
    div.modal
      .page-intro
        .page-intro__title: h3 Спасибо!
        .page-intro__desc Мы получили ваш запрос. В ближайшее время он будет обработан. Менеджер должен активировать ваш аккаунт
        .page-intro__buttons
          router-link(to="/login")
            button.btn.btn-wide: span Хорошо
           
</template>
