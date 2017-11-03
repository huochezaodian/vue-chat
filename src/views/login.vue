<template>
    <div class="login-wrap">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="姓名" prop="username">
                <Input type="text" v-model="formValidate.username" placeholder="请填写姓名">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input type="password" v-model="formValidate.password" placeholder="请填写密码">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">登录</Button>
                <Button type="ghost" @click="handleReg('formValidate')" class="reset-button">注册</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import validate from '../libs/validate.js'
    import io from 'socket.io-client';
    export default {
        computed:{
            sock(){
                return this.$store.state.user.socket;
            }
        },
        data(){
            return{
                formValidate: {
                    username: '',
                    password: ''
                },
                ruleValidate: {
                    username: [
                        { required: true, message: '请填写用户名', trigger: 'blur' },
                        { pattern: validate.username, message: '请输入6-16位的字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                },
            }
        },
        methods: {
            handleSubmit(name) {
                const { username, password } = this.formValidate;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.sock.emit('login', username, password);
                        this.sock.on('login_result', data => {
                            if(data.err == 0){
                                this.$Message.success(data.msg);
                                this.sock.emit('get_users', data => {
                                    this.$store.dispatch('get_userlist', [...data]);
                                });
                                this.$store.dispatch('login', { username });
                                this.$router.push('/chatroom');
                            }else{
                                this.$Message.error(data.msg);
                            }
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReg(name) {
                const { username, password } = this.formValidate;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.sock.emit('reg', username, password);
                        this.sock.on('reg_result', data => {
                            if(data.err == 0){
                                this.$Message.success(data.msg);
                            }else{
                                this.$Message.error(data.msg);
                            }
                            this.sock.removeListener('reg_result');
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            }
        },
        created(){
            if(!this.sock){
                this.$store.dispatch('set_socket', { socket: io.connect('ws://localhost:8088/') });
            }
        },
        destroyed(){
            this.sock && this.sock.removeListener('login_result');
        }
    };
</script>
<style scoped>
    .reset-button{
        margin-left: 15px;
    }
</style>