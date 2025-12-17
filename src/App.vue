<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="header">
    <div class="container">
      <h1>Headscale 管理面板</h1>
      <nav>
        <router-link to="/users">用户管理</router-link>
        <router-link to="/nodes">节点管理</router-link>
        <router-link to="/keys">PreAuth密钥</router-link>
      </nav>
    </div>
  </div>
    
    <div class="container">
      <router-view />
    </div>
</template>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
