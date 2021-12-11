<template>
  <div class="md-layout-column">
    <md-toolbar class="md-primary toolbar">
      <md-button class="md-icon-button" @click="show()">
        <md-icon>menu</md-icon>
      </md-button>
      <md-button v-if="isLoggedIn" @click="logOut">
        <md-icon class="md-title">close</md-icon>
      </md-button>
    </md-toolbar>
    <md-drawer :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Основное меню</span>
      </md-toolbar>
      <md-list>
        <md-list-item>
          <md-icon>move_to_inbox</md-icon>
          <span @click="hide()">
            <router-link to="/" class="md-title">Главная</router-link>
          </span>
        </md-list-item>
        <md-list-item>
          <md-icon>send</md-icon>
          <span @click="hide()">
            <router-link to="/tasks" class="md-title">Список заявок</router-link>
          </span>
        </md-list-item>
        <md-list-item>
          <md-icon>analytics</md-icon>
          <span @click="hide()">
            <router-link to="/analytics" class="md-title">Аналитика</router-link>
          </span>
        </md-list-item>
      </md-list>
    </md-drawer>
    <breadcrumbs />
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumb';
import cookies from 'js-cookie';
import { NAMES } from '../router/constants';

export default {
  name: 'Header',
  components: { Breadcrumbs },
  data: () => ({
    showNavigation: false,
    isLoggedIn: cookies.get('token'),
  }),
  mounted() {
    this.$bus.$on('login', () => {
      this.isLoggedIn = true;
    });
  },
  methods: {
    show() {
      this.showNavigation = true;
    },
    hide() {
      this.showNavigation = false;
    },
    logOut() {
      this.isLoggedIn = false;
      cookies.set('token', '');
      this.$router.push({ name: NAMES.HOME });
    },
  },
};
</script>

<style>
.toolbar {
  display: flex;
  justify-content: space-between;
}
</style>
