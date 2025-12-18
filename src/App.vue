<template>
  <t-layout>
    <t-header>
      <t-head-menu theme="light" height="120px" :value="activeMenu">
        <template #logo>
          <img width="136" class="logo" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo" />
        </template>
        <t-menu-item v-for="item in menuItems" :key="item.value" :value="item.value" @click="activeMenu = item.value">
          <Router-link :to="item.path">{{ item.label }}</Router-link>
        </t-menu-item>
      </t-head-menu>
    </t-header>
    <t-content>
      <div>
        <router-view />
      </div>
    </t-content>
  </t-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = ref('')
const menuItems = ref([
  { label: '用户管理', value: '/users', path: '/users' },
  { label: '节点管理', value: '/nodes', path: '/nodes' },
  { label: 'PreAuth密钥', value: '/keys', path: '/keys' }
])

watch(() => route.path, (path) => {
  const item = menuItems.value.find(item => item.path === path)
  if (item) {
    activeMenu.value = item.value
  }
},
  { immediate: true }
)

</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}

.header h1 {
  font-size: 20px;
  color: #333;
}

.header nav {
  display: flex;
  gap: 24px;
}

.header nav a {
  color: #666;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.header nav a:hover {
  color: #1890ff;
  background: #e6f7ff;
}

.header nav a.router-link-active {
  color: #1890ff;
  font-weight: 600;
}
</style>
