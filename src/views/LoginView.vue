<script>
import axios from 'axios'
import { config } from '@/config';

export default {
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      error: '',
      loading: false,
      preload: true
    }
  },

  created() {
      if(localStorage.getItem('token')) {
        this.$router.push('/chat')
      }

      this.preload = false
  },

  methods: {
    async handleSubmit() {
      this.error = ''
      this.loading = true
      
      try {
        const response = await axios.post(config.api+'login', {
          email: this.formData.email,
          password: this.formData.password
        })
        
        // Сохраняем токен или данные пользователя
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        
        // Перенаправляем на страницу чата
        this.$router.push('/chat')
        
      } catch (err) {
        if (err.response) {
          // Ошибка от сервера
          this.error = err.response.data.message || 'Ошибка авторизации'
        } else if (err.request) {
          // Ошибка сети
          this.error = 'Ошибка соединения с сервером'
        } else {
          this.error = 'Произошла ошибка'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template lang="pug">
div.form-template-center
  div.modal(v-if="preload")
    span Загрузка...
  div.modal(v-else)
    form(@submit.prevent="handleSubmit")
      .modal__title: h3 Авторизоваться
      .modal__content
        
        .modal__item
          .call-form__title.modal__item-title Ваш Email
          .call-form__group
            .call-form__input
              input(
                type="email" 
                placeholder="user@yandex.ru" 
                name="email" 
                v-model="formData.email"
                required
              )
          br
          .call-form__title.modal__item-title Ваш пароль
          .call-form__group
            .call-form__input
              input(
                type="password" 
                placeholder="******" 
                name="password"
                v-model="formData.password" 
                required
              )
        
        //- Отображение ошибки
        .error-message(v-if="error") {{ error }}
        
        .modal__item
          button.btn.btn-green.btn-wide(
            type="submit" 
            :disabled="loading"
          )
            span {{ loading ? 'Вход...' : 'Войти' }}

        .modal__item.text-to-home
          router-link(to="/"): span На главную
</template>

<style scoped>
  .error-message {
    color: #ff4444;
    margin: 10px 0;
    text-align: center;
    font-size: 14px;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>