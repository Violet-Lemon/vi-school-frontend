<template>
  <div class="home">
    <md-card class="card" v-if="isSignUp">
      <md-card-content>
        <md-field>
          <label>Email</label>
          <md-input v-model="signUp.email" @input="error = ''"></md-input>
        </md-field>
        <md-field>
          <label>Пароль</label>
          <md-input v-model="signUp.plainPassword"></md-input>
        </md-field>
        <md-field>
          <label>Пароль еще раз</label>
          <md-input v-model="signUp.repeatedPlainPassword"></md-input>
        </md-field>
        <md-field>
          <label>Как вас зовут</label>
          <md-input v-model="signUp.fullName"></md-input>
        </md-field>
      </md-card-content>

      <md-card-actions>
        <md-button @click="isSignUp = false">Войти</md-button>
        <md-button @click="signUpMethod">Отправить</md-button>
      </md-card-actions>
    </md-card>

    <md-card class="card" v-else>
      <md-card-content>
        <md-field>
          <label>Email</label>
          <md-input v-model="email" @input="error = ''"></md-input>
        </md-field>
        <md-field>
          <label>Пароль</label>
          <md-input v-model="password"></md-input>
        </md-field>
      </md-card-content>

      <md-card-actions>
        <md-button @click="loginMethod">Войти</md-button>
        <md-button @click="isSignUp = true">Зарегистрироваться</md-button>
      </md-card-actions>
    </md-card>

    <md-card class="card error" v-if="error">
      <md-card-content>
        {{ error }}
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import cookies from 'js-cookie';

export default {
  name: 'Home',
  data() {
    return {
      email: '',
      password: '',
      isSignUp: false,
      signUp: {
        email: '',
        plainPassword: '',
        repeatedPlainPassword: '',
        fullName: '',
      },
      error: '',
    };
  },
  methods: {
    async signUpMethod() {
      try {
        this.error = '';
        const response = await this.$api.post('registration', this.signUp);
        if (response.data.error) {
          if (response.data.message === 'Пользователь с таким email уже существует.') {
            this.error = response.data.message;
            return;
          } else {
            this.error = 'Для регистрации необходимо корректно заполнить все поля';
            return;
          }
        }
        this.isSignUp = false;
        this.email = this.signUp.email;
      } catch (error) {
        this.error = 'Ошибка подключения к серверу.';
      }
    },
    async loginMethod() {
      try {
        this.error = '';
        const response = await this.$api.post('login', {
          email: this.email,
          password: this.password,
        });
        if (response.data.message === 'Bad credentials.') {
          this.error = 'Для входа заполните верные Email и пароль';
          return;
        }
        cookies.set('token', response.data.data);
        this.$router.push({ name: 'TasksList' });
      } catch (error) {
        this.error = 'Ошибка подключения к серверу.';
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  max-width: 400px;
  margin: 100px auto 0;

  &.error {
    color: red;
    margin-top: 0;
  }
}
</style>
