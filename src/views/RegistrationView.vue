<template lang="pug">
  div.form-template-center
    div.modal
      form(@submit.prevent="handleSubmit")
        .modal__title: h3 Зарегистрироваться
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
                    placeholder="Введите пароль" 
                    name="password" 
                    v-model="formData.password"
                    required
                  )
            br
            .call-form__title.modal__item-title Повторите пароль
            .call-form__group
              .call-form__input
                  input(
                    type="password" 
                    placeholder="Повторите пароль" 
                    name="confirmPassword" 
                    v-model="formData.confirmPassword"
                    required
                  )
          
          .modal__item
            button.btn.btn-green.btn-wide(type="submit" :disabled="isLoading")
              span(v-if="!isLoading") Отправить
              span(v-else) Отправка...
              
          .modal__item(v-if="message" :class="{'error-message': isError, 'success-message': !isError}")
            p {{ message }}
</template>

<script>
import axios from 'axios'
import { config } from '@/config';

export default {
  data() {
    return {
      formData: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      isLoading: false,
      message: '',
      isError: false
    }
  },

  created() {
      if(localStorage.getItem('token')) {
        this.$router.push('/chat')
      }
  },

  methods: {
    async handleSubmit() {
      // Сброс предыдущих сообщений
      this.message = ''
      this.isError = false
      
      // Валидация паролей
      if (this.formData.password !== this.formData.confirmPassword) {
        this.message = 'Пароли не совпадают'
        this.isError = true
        return
      }
      
      this.isLoading = true
      
      try {
        // Отправка POST запроса
        const response = await axios.post(config.api+'register', {
          email: this.formData.email,
          password: this.formData.password,
          password_confirmation: this.formData.confirmPassword
        }, {
          headers: {
            'Content-Type': 'application/json',
            // Добавьте другие заголовки при необходимости
            // 'Authorization': 'Bearer your-token'
          }
        })
        
        // Обработка успешного ответа
        console.log('Ответ сервера:', response.data)
        this.message = 'Регистрация успешна!'
        this.isError = false
        
        // Очистка формы
        this.formData = {
          email: '',
          password: '',
          confirmPassword: ''
        }
        
        // Здесь можно добавить редирект или другие действия
        // this.$router.push('/login')
        
      } catch (error) {
        // Обработка ошибок
        console.error('Ошибка при отправке:', error)
        
        if (error.response) {
          // Сервер ответил с ошибкой
          this.message = error.response.data.message || 'Ошибка сервера'
        } else if (error.request) {
          // Запрос был отправлен, но нет ответа
          this.message = 'Нет ответа от сервера'
        } else {
          // Ошибка при настройке запроса
          this.message = 'Ошибка при отправке запроса'
        }
        
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>