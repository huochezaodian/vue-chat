const http = require('http');
const io = require('socket.io');
const mysql = require('mysql');
const validate = require('./libs/validate.js');

let db = mysql.createConnection({
    host:   'localhost',
    user:   'root',
    password:   '123456',
    database:   'test'
});

let httpServer = http.createServer((req, res)=>{}).listen(8088);
let wsServer = io.listen(httpServer);

let socks = [], users = [];

wsServer.on('connection', sock => {
	socks.push(sock);
	console.log('连接');
	sock.on('login', (username, password) => {
		console.log('登录');
		
		if(users.includes(username)){
			sock.emit('login_result',{'err':1,'msg':'用户已登录'});
			return;
		}

		let SQL = `SELECT * FROM user WHERE name="${username}" AND password="${password}"`;
		db.query(SQL, (err, data) => {
			console.log('数据库查询');
			if(err){
				sock.emit('login_result',{'err':1,'msg':err.Error});
			}else{
				if(data.length == 0){
					sock.emit('login_result',{'err':1,'msg':'此用户不存在'});
				}else{
					sock.emit('login_result',{'err':0,'msg':'登陆成功！'});

					users.push(username);
					sock.username = username;

					sock.on('get_users', cb => cb(users));

					socks.map(elem => {
						elem.emit('total_users',{'err':0, 'data':users});
					});
				}
			}
		});
	});

	sock.on('reg', (username, password) => {
		console.log('注册');
		let SQL = `SELECT * FROM user WHERE name="${username}" AND password="${password}"`;
		db.query(SQL, (err, data) => {
			console.log('数据库查询用户'+username+'是否存在');
			if(err){
				sock.emit('reg_result',{'err':1,'msg':err.Error});
			}else{
				if(data.length == 0){
					let SQL = `INSERT INTO test.user ( name, password ) VALUES ( "${username}", "${password}" )`;
					db.query(SQL, (err, data) => {
						if(err){
							sock.emit('reg_result',{'err':2,'msg':'注册失败'});
						}else{
							sock.emit('reg_result',{'err':0,'msg':'注册成功'});
						}
					})
				}else{
					sock.emit('reg_result',{'err':1,'msg':'此用户已被注册'});
				}
			}
		});
	});

	sock.on('speak', userinfo => {

		let SQL = `INSERT INTO test.chat_message ( name, message, time ) VALUES ( "${sock.username}", "${userinfo.value}", "${userinfo.time}")`;
		db.query(SQL, (err, data) => {
			if(err){
				console.log(err);
			}else{
				let SQL = `SELECT * FROM chat_message ORDER BY id DESC`;
				db.query(SQL, (err, data) => {
					if(err){
						console.log(err);
					}else{
						console.log(data);
						socks.map(elem => {
							elem.emit('total_message', { 'err':0, 'data':[...data] })
						});
					}
				});
			}
		});
	});

	sock.on('get_messages', cb => {
		let SQL = `SELECT * FROM chat_message ORDER BY id DESC LIMIT 20`;
		db.query(SQL, (err, data) => {
			if(err){
				console.log(err);
			}else{
				cb([...data]);
			}
		});
	});

	sock.on('disconnect',() => {
		console.log('断开连接');
		users.map((elem,index) => {
			if(elem == sock.username){
				users.splice(index,1);
			}
		});

		socks.map((elem,index) => {
			if(elem == sock){
				sock.emit('total_users', {'err':2, 'msg':'连接已断开'});
				socks.splice(index,1);
			}else{
				elem.emit('total_users',{'err':0, 'data':users});
			}
		});
	});

	sock.on('login_out',() => {
		console.log('退出登录');
		users.map((elem,index) => {
			if(elem == sock.username){
				users.splice(index,1);
			}
		});

		socks.map((elem,index) => {
			if(elem == sock){
				sock.emit('total_users', {'err':2, 'msg':'已退出登录'});
			}else{
				elem.emit('total_users',{'err':0, 'data':users});
			}
		});
	});
});