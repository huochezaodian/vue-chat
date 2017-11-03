<template>
	<div class="chat-room">
		<div class="chat-content">
			<div class="chat-info" id="chat_list">
				<div 
					v-for="list in chatInfoList" 
					:class="{'info':true,'current':user == list.name}"
				>
					<div :class="{'time':true,'hide':list.time == ''}">{{list.time}}</div>
					<Avatar icon="person" size="small" :class="{'fr':user == list.name}"/>
					<div class="user">{{list.name}}</div>
					<div class="content">
						<span>{{list.message}}</span>
					</div>
				</div>
			</div>
			<div class="chat-speak">
				<Input 
					type="textarea" v-model="value" 
					:autofocus="true"
					:rows="2" 
					@on-enter="handleSpeak()"
				>
				</Input>
			</div>
		</div>
		<div class="user-list">
			<div  
				v-for="username in userlist" 
				:class="{'user-item':true,'current':username == user}"
			>
				<Avatar icon="person" size="small" />
				<div class="user">{{username}}</div>
			</div>
		</div>
		<div class="user-info">
			<div class="name">
				<label>用户名:</label>
				<p>{{user}}</p>
			</div>
			<div class="statu">
				<label>状态:</label>
				<p>online</p>
			</div>
			<div class="quit">
                <Button type="primary" @click="handleQuit()">退出登录</Button>
			</div>
		</div>
	</div>
</template>
<script>
	import Moment from 'moment';
	import Util from '../libs/util';
	export default {
		computed: {
		    user(){
		      	return this.$store.state.user.username;
		    },
		    userlist(){
		    	return this.$store.state.user.userlist;
		    },
		    sock(){
		    	return this.$store.state.user.socket;
		    },
		    chatInfoList(){
		    	let newMessages = this.$store.state.user.userMessages;
		    	let preTime = '';
		    	newMessages.map((item,idx) => {
		    		if(!Number.isNaN(preTime) && idx != 0 && Moment(item.time).isAfter(Moment(preTime).add(10, 'm'))){
		    			preTime = item.time;
		    			item.time = Moment(item.time).format('YYYY-MM-DD HH:mm:ss');
		    		}else{
		    			preTime = item.time;
		    			item.time = '';
		    		}
		    		return item;
		    	});
		    	return newMessages;
		    }
		},
		data(){
			return{
				value:''
			}
		},
		methods: {
			handleSpeak(){
				this.sock.emit('speak', {'value':this.value,'time':Moment().format('YYYY-MM-DD HH:mm:ss')});
				this.value = '';
			},
			handleQuit(){
				this.$Modal.confirm({
                    content: '<h3>确定要退出当前登录？</h3>',
                    onOk: () => {
                        this.$store.dispatch('quit');
                        this.sock.emit('login_out'),
                        this.$router.push('/login');
                    },
                });
			},
			getAllUser(){
				this.sock.on('total_users', data => {
					if(data.err){
						this.$Message.error(data.msg);
						this.$store.dispatch('quit');
	                    this.$router.push('/login');
					}else{
						this.$store.dispatch('get_userlist', [...data.data]);
					}
				});
			},
			getAllMessage(){
				this.sock.on('total_message', data => {
					if(data.err){
						this.$Message.error(data.msg);
						this.$store.dispatch('quit');
	                    this.$router.push('/login');
					}else{
						this.$store.dispatch('get_message', [...data.data].reverse());
					}
				});
			}
		},
		created(){
			this.sock && this.sock.emit('get_messages', data => {
                this.$store.dispatch('get_message', [...data].reverse());
            });
		},
		mounted(){
			if(!this.sock){
				this.$store.dispatch('quit');
                this.$router.push('/login');
			}
			this.sock && this.getAllUser();
			this.sock && this.getAllMessage();
		},
		updated(){
		  	this.$nextTick(function () {
		  		let chatlist = document.getElementById('chat_list');
        		chatlist && Util.scrollTo(chatlist, chatlist.scrollHeight);
		  	})
		},
		destroyed(){
			this.sock && this.sock.removeListener('total_users');
			this.sock && this.sock.removeListener('total_message');
		}
	}
</script>
<style scoped>
</style>