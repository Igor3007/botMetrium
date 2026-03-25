<template lang="pug">
  div.form-template-center
    div.modal
      form(@submit.prevent="handleSubmit")
        .modal__title: h3 Зарегистрироваться
        .modal__desc Укажите ваш Еmail и пароль. На указанную почту придет оповещение после активации вашего аккаунта
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
                    maxlength="40"
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
                    maxlength="16"
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
                    maxlength="16"
                  )

          .modal__item(v-if="message" class="error-text-block" :class="{'error-message': isError, 'success-message': !isError}")
            p {{ message }}
          
          .modal__item
            button.btn.btn-green.btn-wide(type="submit" :disabled="isLoading")
              span(v-if="!isLoading") Отправить
              span(v-else) Отправка...
              
         

          .modal__item.text-to-home
            router-link(to="/"): span На главную
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

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    async handleSubmit() {
      // Сброс предыдущих сообщений
      this.message = ''
      this.isError = false

      // Валидация email
      if (!this.validateEmail(this.formData.email)) {
        this.message = 'Не корректный аддрес Email'
        this.isError = true
        return
      }
      
      // Валидация паролей
      if (this.formData.password !== this.formData.confirmPassword) {
        this.message = 'Пароли не совпадают'
        this.isError = true
        return
      }

      // Валидация паролей
      if (this.formData.password.length < 8 || this.formData.confirmPassword.length < 8) {
        this.message = 'Пароль не может быть короче 8 символов'
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
        this.message = 'Регистрация успешна!'
        this.isError = false
        
        // Очистка формы
        this.formData = {
          email: '',
          password: '',
          confirmPassword: ''
        }
        
        // Здесь можно добавить редирект или другие действия
        this.$router.push('/thanks')
        
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
  color: var(--accent-11);
  margin-top: 10px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>