<template>
    <div class="keys-page">
        <div class="card">
            <div class="header-actions">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <h2>PreAuth密钥管理</h2>
                    <select v-model="selectedUser" @change="loadKeys">
                        <option value="">选择用户</option>
                        <option v-for="user in users" :key="user.name" :value="user.id">
                            {{ user.name }}
                        </option>
                    </select>
                </div>
                <button @click="showCreateDialog = true" :disabled="!selectedUser" class="btn btn-primary">
                    + 创建密钥
                </button>
            </div>

            <div v-if="error" class="error">{{ error }}</div>

            <div v-if="!selectedUser" class="loading">请先选择用户</div>
            <div v-else-if="loading" class="loading">加载中...</div>
            <div v-else-if="keys.length === 0" class="loading">该用户暂无可用PreAuth密钥</div>

            <div v-else class="keys-list">
                <div v-for="key in keys" :key="key.id" class="key-item">
                    <div class="key-header">
                        <code class="key-value">{{ key.key }}</code>
                        <button @click="copyKey(key.key)" class="btn btn-sm">
                            {{ copiedKey === key.key ? '✓ 已复制' : '复制' }}
                        </button>
                        <button @click="expireKey(key.user.id, key.key)" class="btn btn-danger btn-sm">
                            过期密钥
                        </button>
                    </div>
                    <div class="key-info">
                        <span>可重复: {{ key.reusable ? '是' : '否' }}</span>
                        <span>临时: {{ key.ephemeral ? '是' : '否' }}</span>
                        <span>已使用: {{ key.used ? '是' : '否' }}</span>
                        <span v-if="key.expiration">
                            过期: {{ formatDate(key.expiration) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 创建密钥对话框 -->
        <div v-if="showCreateDialog" class="modal-overlay" @click="showCreateDialog = false">
            <div class="modal" @click.stop>
                <h3>创建PreAuth密钥</h3>

                <label>
                    <input type="checkbox" v-model="keyForm.reusable" />
                    可重复使用
                </label>

                <label>
                    <input type="checkbox" v-model="keyForm.ephemeral" />
                    临时节点(断开后自动删除)
                </label>

                <label>
                    <input type="datetime-local" v-model="keyForm.expiration" />
                    过期时间(分钟)(留空则永不过期)
                </label>

                <div class="modal-actions">
                    <button @click="createKey" class="btn btn-primary">创建</button>
                    <button @click="showCreateDialog = false" class="btn">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { preAuthKeyAPI, userAPI } from '../api/headscale'

export default {
    name: 'PreAuthKeys',
    setup() {
        const users = ref([])
        const keys = ref([])
        const selectedUser = ref('')
        const loading = ref(false)
        const error = ref('')
        const showCreateDialog = ref(false)
        const copiedKey = ref('')
        const keyForm = ref({
            reusable: false,
            ephemeral: false,
            expiration: null
        })

        const loadUsers = async () => {
            try {
                const data = await userAPI.list()
                users.value = data.users || []
            } catch (err) {
                error.value = '加载用户失败: ' + err.message
            }
        }

        const loadKeys = async () => {
            if (!selectedUser.value) return

            loading.value = true
            error.value = ''
            try {
                const data = await preAuthKeyAPI.list(selectedUser.value)
                const filter_keys = data.preAuthKeys.filter(item => {
                    const expirationTime = new Date(item.expiration).getTime();
                    const currentTime = Date.now();
                    return expirationTime > currentTime;
                });
                keys.value = filter_keys || []
            } catch (err) {
                error.value = '加载密钥失败: ' + err.message
            } finally {
                loading.value = false
            }
        }

        const createKey = async () => {
            try {
                const data = {
                    user: selectedUser.value,
                    reusable: keyForm.value.reusable,
                    ephemeral: keyForm.value.ephemeral,
                    expiration: new Date(keyForm.value.expiration).toISOString()
                }

                await preAuthKeyAPI.create(data)
                showCreateDialog.value = false
                keyForm.value = { reusable: false, ephemeral: false }
                await loadKeys()
                alert('密钥创建成功')
            } catch (err) {
                alert('创建密钥失败: ' + err.message)
            }
        }

        const expireKey = async (userId, key) => {
            if (!confirm('确定要使该密钥过期吗?')) return

            try {
                await preAuthKeyAPI.expire(userId, key)
                await loadKeys()
                alert('密钥已过期')
            } catch (err) {
                alert('使密钥过期失败: ' + err.message)
            }
        }

        const copyKey = (key) => {
            navigator.clipboard.writeText(key)
            copiedKey.value = key
            setTimeout(() => {
                copiedKey.value = ''
            }, 2000)
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return '永不过期'
            return new Date(dateStr).toLocaleString('zh-CN')
        }

        onMounted(() => {
            loadUsers()
        })

        return {
            users,
            keys,
            selectedUser,
            loading,
            error,
            showCreateDialog,
            keyForm,
            copiedKey,
            loadKeys,
            createKey,
            copyKey,
            formatDate,
            expireKey
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

select {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
}

.keys-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.key-item {
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 12px;
}

.key-header {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 8px;
}

.key-value {
    flex: 1;
    background: #f5f5f5;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13px;
    word-break: break-all;
}

.key-info {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #666;
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

.modal label {
    display: block;
    margin-bottom: 12px;
    cursor: pointer;
}

.modal label input {
    margin-right: 8px;
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 16px;
}
</style>