const routers = [
    {
        path: '/',
        redirect:'/login'
    },
	{
		path:'/login',
        meta:{title:'登录'},
        component:(resolve) => require(['./views/login.vue'],resolve)
	},
	{
		path:'/chatroom',
        meta:{title:'聊天室'},
        component:(resolve) => require(['./views/chatroom.vue'],resolve)
	}
];
export default routers;