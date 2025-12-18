import { createRouter, createWebHistory } from 'vue-router'
import Users from '../views/Users.vue'
import Nodes from '../views/Nodes.vue'
import PreAuthKeys from '../views/PreAuthKeys.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/nodes'
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: { menuValue: 'users' }
    },
    {
      path: '/nodes',
      name: 'Nodes',
      component: Nodes,
      meta: { menuValue: 'nodes' }
    },
    {
      path: '/keys',
      name: 'PreAuthKeys',
      component: PreAuthKeys,
      meta: { menuValue: 'keys' }
    }
  ],
})

export default router
