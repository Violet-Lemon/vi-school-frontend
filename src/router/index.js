import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import TaskList from '@/views/TaskList';
import Task from '@/views/Task.vue';
import Analytics from '@/views/Analytics.vue';
import notFound from '@/views/notFound';
import cookies from 'js-cookie';
import { NAMES } from './constants';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    component: notFound,
  },
  {
    path: '/',
    name: NAMES.HOME,
    component: Home,
    meta: {
      breadcrumb: [{ name: 'Главная' }],
    },
  },
  {
    path: '/tasks',
    name: 'TasksList',
    component: TaskList,
    meta: {
      breadcrumb: [{ name: 'Главная', link: '/' }, { name: 'Список заявок' }],
    },
  },
  {
    path: '/task/:id',
    props: true,
    component: Task,
    meta: {
      breadcrumb: [{ name: 'Главная', link: '/' }, { name: 'Список заявок', link: '/tasks' }, { name: 'Заявка' }],
    },
  },
  {
    path: '/analytics',
    component: Analytics,
    meta: {
      breadcrumb: [{ name: 'Главная', link: '/' }, { name: 'Аналитика' }],
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (cookies.get('token')) {
    router.app.$api.defaults.headers.common['Authorization'] = 'Bearer ' + cookies.get('token');
    if (to.name === NAMES.HOME) {
      next({ name: 'TasksList' });
    }
  } else if (to.name !== NAMES.HOME) {
    next({ name: NAMES.HOME });
  }
  next();
});

export default router;
