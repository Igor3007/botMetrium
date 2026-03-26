<template lang="pug">
  div.form-template-center.form-template-center--chat
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
                    .chat-history__id(data-title="ID" @click.prevent="copyToBuffer(item.object_id)") {{ item.object_id }}
                    .chat-history__date(data-title="Дата") {{formatDate(item.created_at, '-3') }}

                    .chat-history__link( v-if="item.pdf_link" data-title="Ссылка") 
                      a( v-for="link in item.pdf_link.split(',')" :href="link" target="_blank") 
                        div {{ link }}
                        span.copy-link(@click.prevent="copyToBuffer(link)")

                    .chat-history__link( v-else data-title="Ошибка") 
                      div.error-text-block Объект с таким ID не найден
                
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
                @input.prevent="validateObjectId"
                @blur="onBlurHelper"
              )
              .chat-form__btn
                button.btn.btn-green(
                  type="submit"
                  :disabled="loading || !getToken()"
                ): span {{ loading ? 'Поиск...' : 'Отправить' }}

    Notication(ref="status")
</template>

<script>
import axios from 'axios'
import { config } from '@/config';
import Notication from '@/components/notification/index.vue'  

export default {

  components: {Notication},

  data() {
    return {
      history: [],
      objectId: '',
      loading: false,
      error: null
    }
  },

  created() {
    if (!this.getToken()) {
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
          config.api + 'history',
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

      if (this.objectId == '/clear') {

        if(confirm('Очистить историю?')){
          const response = await axios.delete(
            `${config.api}history/clear`,
             this.getAuthHeaders()
          )

          if (response.data) {
            await this.getHistory()
            this.objectId = ''
          }
        }

        return
      }


      if(isNaN(Number(this.objectId))) {
        alert('Неверная команда, /clear - очистить историю')
        return
      }


      if (!this.objectId) {
        return
      }

      try {
        this.loading = true
        const response = await axios.get(
          `${config.api}presentation/link?id=${this.objectId}`,
          this.getAuthHeaders()
        )

        

        this.error = null
      } catch (error) {
        //this.handleError(error, 'Ошибка при поиске объекта')
      } finally {
        this.loading = false
        await this.getHistory()
        this.objectId = ''
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
      const value = e.target.value;
    
      if (value.startsWith('/')) {
        this.objectId = value.replace(/[^a-z0-9\/]/g, '');
      } else {
        this.objectId = value.replace(/\D/g, '');
      }
    },
 

    logout() {
      localStorage.removeItem('token')
      this.$router.push('/')
    },

    scrollToBottom() {
      const { scrollHeight } = this.$refs.scrollChat
      this.$refs.scrollChat.scrollTo({
        top: scrollHeight + 150,
        behavior: 'smooth'
      })
    },

    copyToBuffer(link) {
      navigator.clipboard.writeText(link)
        .then(() => {
          //alert('Cкорировано в буфер!')
          this.$refs.status.msg('Скопировано')
        })
        .catch(err => {
          alert('Не удалось скопировать ссылку')
        });
    },

    formatDate(dateStr, offset = null) {
      const [d, m, y, h, min] = dateStr.split(/[.\s:]/);
      let date = new Date(y, m - 1, d, h, min);
      if (offset !== null) {
        date = new Date(date.getTime() - offset * 3600000);
      }
      let now = new Date();
      if (offset !== null) {
        now = new Date(now.getTime() - offset * 3600000);
      }
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      
      const isToday = date.toDateString() === now.toDateString();
      const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
      
      if (isToday) return `сегодня в ${time}`;
      if (isYesterday) return `вчера в ${time}`;
      
      const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
      const monthName = months[parseInt(m) - 1];
      const currentYear = new Date().getFullYear();
      
      return parseInt(y) === currentYear ? `${parseInt(d)} ${monthName} ${time}` : `${parseInt(d)} ${monthName} ${y} в ${time}`;
    },

    onBlurHelper() {
      window.scrollTo({
        top: 0
      })
    }

    }
  }
</script>
