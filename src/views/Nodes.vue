<template>
  <div class="nodes-page">
    <div class="card">
      <h2>节点管理</h2>

      <div v-if="error" class="error">{{ error }}</div>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <table v-else-if="nodes.length > 0">
        <thead>
          <tr>
            <th>节点名</th>
            <th>用户</th>
            <th>IP地址</th>
            <th>最后在线</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="node in nodes" :key="node.id">
            <td>{{ node.givenName || node.name }}</td>
            <td>{{ node.user?.name || '-' }}</td>
            <td><code>{{ node.ipAddresses?.[0] || '-' }}</code></td>
            <td>{{ formatDate(node.lastSeen) }}</td>
            <td>
              <button @click="deleteNode(node.id)" class="btn btn-danger btn-sm">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-else class="loading">暂无节点</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { nodeAPI } from '../api/headscale'

export default {
  name: 'Nodes',
  setup() {
    const nodes = ref([])
    const loading = ref(false)
    const error = ref('')

    const loadNodes = async () => {
      loading.value = true
      error.value = ''
      try {
        const data = await nodeAPI.list()
        nodes.value = data.nodes || []
      } catch (err) {
        error.value = '加载节点失败: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const deleteNode = async (id) => {
      if (!confirm('确定要删除此节点吗?')) return
      
      try {
        await nodeAPI.delete(id)
        await loadNodes()
        alert('节点删除成功')
      } catch (err) {
        alert('删除节点失败: ' + err.message)
      }
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleString('zh-CN')
    }

    onMounted(() => {
      loadNodes()
    })

    return {
      nodes,
      loading,
      error,
      deleteNode,
      formatDate
    }
  }
}
</script>

<style scoped>
.btn-sm {
  padding: 4px 12px;
  font-size: 12px;
}

code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}
</style>