import Mock from 'mockjs'
import user from './user'

// 登录
Mock.mock(/\/api\/login/, 'post', user.login)

export default Mock
