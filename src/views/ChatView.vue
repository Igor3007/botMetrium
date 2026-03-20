<template lang="pug">
  div.form-template-center
    div.modal.modal--chat
      .chat-user
        .chat-user__header
          .chat-user__logo: span MetriumBot
          .chat-user__profile
            .chat-profile
              .chat-profile__name: span(@click="logout()") Выйти

        .chat-user__history
          .chat-user__overlay(ref="scrollChat")
            .chat-history
              .chat-history__list
                template(v-if="history.length")
                  .chat-history__item(v-for="item in history" :key="item.id")
                    .chat-history__id(data-title="ID") {{ item.object_id || '42500' }}
                    .chat-history__date(data-title="Дата") {{ item.created_at}}
                    .chat-history__link(data-title="Ссылка") 
                      a(:href="item.pdf_link" target="_blank") 
                        | {{ item.pdf_link }}
                        span.copy-link(@click.prevent="copyToBuffer(item.pdf_link)")
                
              .chat-history__loading(v-if="loading && !history.length") 
                .empty-text-block
                  span.preloader
                  | Загрузка...
              
              .chat-history__error(v-if="error") 
                .error-text-block {{ error }}

              .chat-history__empty(v-if="!loading && !history.length && !error")
                .empty-text-block История пуста
        
        .chat-user__form
          .chat-form
            form.form(@submit.prevent="findObject")
              .chat-form__input: input(
                type="text" 
                v-model="objectId"
                placeholder="Введите ID объекта"
                :disabled="loading || !getToken()"
                @keyup="validateObjectId($event)"
              )
              .chat-form__btn
                button.btn.btn-green(
                  type="submit"
                  :disabled="loading || !getToken()"
                ): span {{ loading ? 'Поиск...' : 'Отправить' }}
</template>
 
<script>
  import axios from 'axios'
  import { config } from '@/config';

  export default {
    data() {
      return {
        history: [],
        objectId: '',
        loading: false,
        error: null
      }
    },

    created() {
      if(!this.getToken()) {
        this.$router.push('/')
      }
    },
    
    mounted() {
      this.getHistory()
      
    },
    
    methods: {
      // Получение токена из localStorage
      getToken() {
        return localStorage.getItem('token')
      },
      
      // Создание заголовков с авторизацией
      getAuthHeaders() {
        const token = this.getToken()
        return {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      },
      
      // Получение истории
      async getHistory() {
        try {
          this.loading = true
          const response = await axios.get(
            config.api+'presentation/history',
            this.getAuthHeaders()
          )
          this.history = response.data.data.reverse()
          
          this.error = null
        } catch (error) {
          this.handleError(error, 'Ошибка при загрузке истории')
        } finally {
          this.loading = false
          setTimeout(() => {
            this.scrollToBottom()
          }, 0)
        }
      },
      
      // Поиск объекта по ID
      async findObject() {
        if (!this.objectId) {
          return
        }
        
        try {
          this.loading = true
          const response = await axios.get(
            `${config.api}presentation/link?id=${this.objectId}`,
            this.getAuthHeaders()
          )
          
          // Обработка успешного ответа  
          console.log('Object found:', response.data)
          
          // Добавляем новый объект в историю
          if (response.data) {
            // Обновляем историю после успешного поиска
            await this.getHistory()
            
            // Очищаем поле ввода
            this.objectId = ''
          }
          
          this.error = null
        } catch (error) {
          this.handleError(error, 'Ошибка при поиске объекта')
        } finally {
          this.loading = false
        }
      },
      
      // Централизованная обработка ошибок
      handleError(error, defaultMessage) {
        if (error.response) {
          // Сервер ответил с кодом ошибки
          switch (error.response.status) {
            case 401:
              this.error = 'Ошибка авторизации. Пожалуйста, войдите снова.'
              // Можно добавить редирект на страницу логина
              break
            case 403:
              this.error = 'Доступ запрещен'
              break
            case 404:
              this.error = 'Объект не найден'
              break
            default:
              this.error = error.response.data?.message || defaultMessage
          }
        } else if (error.request) {
          // Запрос был сделан, но нет ответа
          this.error = 'Сервер не отвечает. Проверьте подключение к интернету.'
        } else {
          // Что-то пошло не так при настройке запроса
          this.error = defaultMessage
        }
        
        console.error('Error:', error)
      },
      
      // Проверка наличия токена
      checkAuth() {
        const token = this.getToken()
        if (!token) {
          this.error = 'Не найден токен авторизации'
          return false
        }
        return true
      },

      validateObjectId(e) {
          e.target.value = e.target.value.replace(/\D/g, '');
      },

      logout() {
        localStorage.removeItem('token')
        this.$router.push('/')
      },

      scrollToBottom() {
        const {scrollHeight} = this.$refs.scrollChat
        this.$refs.scrollChat.scrollTo({
          top: scrollHeight + 150,
         behavior: 'smooth'
        })
      },

      copyToBuffer(link) {
        navigator.clipboard.writeText(link)
          .then(() => {
            alert('Ссылка скорирована')
          })
          .catch(err => {
            alert('Не удалось скопировать ссылку')
          });
}
    }
  }
</script>
