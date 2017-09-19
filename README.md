## 调试/编译/发布

1. 下载安装最新版 [nodejs](http://nodejs.cn/download/)
2. 使用cnpm国内镜像 

	```bash
	npm install -g cnpm --registry=https://registry.npm.taobao.org
	```
3. clone并进入此项目
4. 安装依赖

	```bash
	cnpm install
	```
5. 运行服务并调试

	``` bash
	npm run dev
	# localhost:88
	```
	因为浏览器限制跨域请求，调试过程请做代理来访问api服务，配置`webpack.config.js`中的`proxy.target`即可（更改之后要重启服务）
6. 编译

	```bash
	npm run build
	```
7. 发布

	将dist目录下的所有文件发布到与API在同一域名下即可

## 代码检查
- 为了开发统一，也为了代码简洁易懂，更为了防止低级错误，项目使用了最严格代码检查`eslint standard`，详情：https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
- 强烈建议开发时使用 webstorm 编辑器，如果写了不合规范的代码，编辑器会报错，并提供修复错误代码的功能。
- 每次build前先运行风格检查`npm run lint`，没有报错则表示没问题，`npm run lint:fix`会修复一些错误，但很多还得自己改

## 组件库
项目已集成了[mint-ui](https://github.com/ElemeFE/mint-ui)，提供了较丰富的基础组件，使用时请 **按需引入**
```javascript
import { Toast } from 'mint-ui';
Toast({
  message: '请求成功',
  duration: 2000
});
```
更多的组件参考[mint-ui文档](http://mint-ui.github.io/docs/#/zh-cn2)

如果需要其他的组件，请自行安装依赖或者写了放在components目录下，注意，组件需要能在任意地方引用，请编写可复用组件，如果只用在局部，直接写页面上或者用mixin

## 样式/静态资源
- 所有的静态资源都放入assets文件夹
- flex能满足的布局就不要用其他布局方式
- 公共样式里集成了颜色和其他一些常用的样式，不要写很多不必要的样式

	如：
	```html
	<div class="flex flex-center">
	  <span class="font-16 orange">16px橙色文字，左右上下都居中</span>
	</div>
	```
- 图片等比缩放，文字/元素流式布局
- rem总宽度是10，全屏则10rem，如果设计稿为750宽，则宽=`width/75+'rem'`
- 项目集成了[font-awesome](http://fontawesome.io/icons/)，能用字体图标的尽量用字体图标

## 状态管理
状态管理一般用来做全局的变量管理，如从订单列表页点到订单详情页，删除了此订单，再返回订单列表，此时订单列表需要变化。做法是把订单列表的数据存在store中，改变订单状态时提交一个mutation来改变这个state，一改变则引用到这个state的地方都会自动更新。

注意：
1. 不要把所有的数据都存入store，这样反而更难维护，仅仅存入多处引用的数据，比如说用户的token，购物车的数量，热搜词，用户的基本信息等。
2. 相似的数据，不要添加多个state，用getter来取
3. 如果项目较大，请使用module，方便管理

可以安装vue-devtool来调试store，详情请参考[vuex文档](https://vuex.vuejs.org/zh-cn/)

## 路由
- 除了首页，所有组件都用异步组件，router.js已定义好load方法。
- 需要登录的，给组件加`meta: {requireAuth: true}`
- 把路由归类，方在children里

## 数据交互
为了统一管理，所有的api接口都在`src/api/index.js`里写方法，并指定参数。这样做是为了让每个接口的参数都透明化，方便更改/维护，也方便后端查看接口的参数。如登录方法：
```javascript
login(param={username:'',password:''}){
  return fetch('/api/login', params, 'post')
}
//或
login(username='',password=''){
  return fetch('/api/userLogin', {username,password}, 'post')
}
```
api已注入vue实例，可在组件中调用`this.$api.someMethod()`，如调用登录方法：
```javascript
this.$api.login({username:'aaa',password:'bbb'}).then(res=>{
//res是api返回的内容
})
```
fetch函数是对axios的封装，在`src/api/fetch.js`，如有需求，可更改axios的配置，详情参考[axios的文档](https://github.com/mzabriskie/axios)

## mock
在后端没写完接口的情况下，自己可以先模拟一些数据来做测试。项目集成了`mockjs`，提供了很丰富的随机机制。把main.js里的`import './mock'`的注释打开即可使用，在mock文件夹下创建自己要测试的模块数据，并在`mock/index.js`中拦截url，指向自己模拟的数据。

更多请参考[mockjs文档](https://github.com/nuysoft/Mock/wiki)

mock仅在调试时使用，当所有接口都接入真实数据后，请注释main.js里的引入mock语句，特别编译时一定要记得检查是否已注释。

## 登录及用户校验
- 每个请求都会在header里带`Authorization`，Authorization的值由登录接口返回，状态管理中对应的是token，如需更改，提交mutations中的setToken方法，为了XX天免登陆功能，以及防止刷新页面丢失，token还存cookie中，可根据需要改为存sessionStorage或localStorage，注意`api/fetch.js`也需要更改。
- 登录判断只要判断store里的token有没有值就行了。`if(!this.$store.token){do someThing}`
- Authorization由程序做对称加密或者由OAuth服务提供，如果加密算法需要其他字段请直接与token拼接，比如用户id为86232，则Authorization为token_86232。
- 除了非必要登录的接口程序需获取header里的`Authorization`对用户进行校验。

## cookie
cookie使用了[js-cookie](https://github.com/js-cookie/js-cookie)库，已注入组件中，示例（更多请查看文档）：
```javascript
this.$cookie.set('key',value,{expires:1});//时间单位为天
this.$cookie.get('key')
this.$cookie.remove('key')
```
cookie仅仅用来存储临时的并需要过期的内容，其他情况尽量用sessionStorage或localStorage
