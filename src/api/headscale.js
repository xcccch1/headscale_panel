import axios from 'axios'

let config = null

// 加载配置
export async function loadConfig() {
    if (config) return config

    try {
        const response = await fetch('/config.json')
        config = await response.json()
        return config
    } catch (error) {
        console.error('加载配置失败:', error)
        throw new Error('无法加载配置文件,请确保 public/config.json 存在')
    }
}

// 创建API客户端
async function createApiClient() {
    const cfg = await loadConfig()

    return axios.create({
        baseURL: `${cfg.headscale.baseUrl}/api/v1`,
        headers: {
            'Authorization': `Bearer ${cfg.headscale.apiKey}`,
            'Content-Type': 'application/json'
        },
        timeout: 10000
    })
}

// 用户管理API
export const userAPI = {
    async list() {
        const client = await createApiClient()
        const response = await client.get('/user')
        console.log(response.data)
        return response.data
    },

    async get(name) {
        const client = await createApiClient()
        const response = await client.get(`/user?name=${name}`)
        return response.data
    },

    async create(name) {
        const client = await createApiClient()
        const response = await client.post('/user', { name })
        return response.data
    },

    async delete(name) {
        const client = await createApiClient()
        const response = await client.delete(`/user/${name}`)
        return response.data
    },

    async rename(oldName, newName) {
        const client = await createApiClient()
        const response = await client.post('/user/rename', {
            oldName,
            newName
        })
        return response.data
    }
}

// 节点管理API
export const nodeAPI = {
    async list(user = null) {
        const client = await createApiClient()
        const params = user ? { user } : {}
        const response = await client.get('/node', { params })
        return response.data
    },

    async get(nodeId) {
        const client = await createApiClient()
        const response = await client.get(`/node/${nodeId}`)
        return response.data
    },

    async register(user, key) {
        const client = await createApiClient()
        const response = await client.post('/node/register', { user, key })
        return response.data
    },

    async delete(nodeId) {
        const client = await createApiClient()
        const response = await client.delete(`/node/${nodeId}`)
        return response.data
    },

    async expire(nodeId) {
        const client = await createApiClient()
        const response = await client.post(`/node/${nodeId}/expire`)
        return response.data
    },

    async rename(nodeId, newName) {
        const client = await createApiClient()
        const response = await client.post(`/node/${nodeId}/rename`, { newName })
        return response.data
    },

    async move(nodeId, user) {
        const client = await createApiClient()
        const response = await client.post(`/node/${nodeId}/user`, { user })
        return response.data
    }
}

// PreAuth密钥API
export const preAuthKeyAPI = {
    async list(id) {
        const client = await createApiClient()
        const response = await client.get(`/preauthkey?user=${id}`)
        return response.data
    },

    async create(data) {
        const client = await createApiClient()
        const response = await client.post('/preauthkey', data)
        return response.data
    },

    async expire(user, key) {
        const client = await createApiClient()
        const response = await client.post('/preauthkey/expire', { user, key })
        return response.data
    }
}

// 路由管理API
export const routeAPI = {
    async list(nodeId = null) {
        const client = await createApiClient()
        const params = nodeId ? { nodeId } : {}
        const response = await client.get('/routes', { params })
        return response.data
    },

    async enable(routeId) {
        const client = await createApiClient()
        const response = await client.post(`/routes/${routeId}/enable`)
        return response.data
    },

    async disable(routeId) {
        const client = await createApiClient()
        const response = await client.post(`/routes/${routeId}/disable`)
        return response.data
    },

    async delete(routeId) {
        const client = await createApiClient()
        const response = await client.delete(`/routes/${routeId}`)
        return response.data
    }
}