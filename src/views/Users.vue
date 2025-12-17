<template>
  <div class="users-page">
    <div class="card">
      <div class="header-actions">
        <h2>用户管理</h2>
        <button @click="showCreateDialog = true" class="btn btn-primary">
          + 创建用户
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <table v-else-if="users.length > 0">
        <thead>
          <tr>
            <th>id</th>
            <th>用户名</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-else class="loading">暂无用户</div>
    </div>

    <!-- 创建用户对话框 -->
    <div v-if="showCreateDialog" class="modal-overlay" @click="showCreateDialog = false">
      <div class="modal" @click.stop>
        <h3>创建新用户</h3>
        <input 
          v-model="newUserName" 
          placeholder="输入用户名"
          @keyup.enter="createUser"
        />
        <div class="modal-actions">
          <button @click="createUser" class="btn btn-primary">创建</button>
          <button @click="showCreateDialog = false" class="btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { userAPI } from '../api/headscale'

export default {
  name: 'Users',
  setup() {
    const users = ref([])
    const loading = ref(false)
    const error = ref('')
    const showCreateDialog = ref(false)
    const newUserName = ref('')

    const loadUsers = async () => {
      loading.value = true
      error.value = ''
      try {
        const data = await userAPI.list()
        users.value = data.users || []
      } catch (err) {
        error.value = '加载用户失败: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const createUser = async () => {
      if (!newUserName.value.trim()) {
        alert('请输入用户名')
        return
      }
      
      try {
        await userAPI.create(newUserName.value)
        showCreateDialog.value = false
        newUserName.value = ''
        await loadUsers()
        alert('用户创建成功')
      } catch (err) {
        alert('创建用户失败: ' + err.message)
      }
    }

    const deleteUser = async (name) => {
      if (!confirm(`确定要删除用户 ${name} 吗?`)) return
      
      try {
        await userAPI.delete(name)
        await loadUsers()
        alert('用户删除成功')
      } catch (err) {
        alert('删除用户失败: ' + err.message)
      }
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleString('zh-CN')
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      users,
      loading,
      error,
      showCreateDialog,
      newUserName,
      createUser,
      deleteUser,
      formatDate
    }
  }
}
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-sm {
  padding: 4px 12px;
  font-size: 12px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 400px;
}

.modal h3 {
  margin-bottom: 16px;
}

.modal input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>