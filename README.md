# vue-chat
- vue2 + iview + websocket + webpack2 + postcss
- 基本框架使用的是vue，客户端和服务端的通信使用的是websocket，打包编译使用的webpack，所有的css样式全都使用postcss进行后编译，常用的几个poctcss包以及案例，在[postcss-learning](https://github.com/huochezaodian/postcss-learning)也进行了试用。

### 项目介绍
- 要实现通信，主要的两个部分，客户端和服务端，服务端在**src**文件目录下的**server.js**文件，在这里使用了基本的**node**语法，其它的就是客户端的页面。

### 本地测试
1. npm install
2. npm run dev
3. node server.js
4. 打开多个窗口就可以登录，然后聊天了