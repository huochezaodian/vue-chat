const state = {
    socket: null,
    username : '',
    userlist : [],
    userMessages : [],
};
const mutations = {
    get_message(state, mes){
        state.userMessages = [...mes];
    },
    set_socket(state, user){
        state.socket = user.socket;
    },
    get_userlist(state,list){
        state.userlist = [...list];
    },
    login(state,user){
        state.username = user.username;
    },
    quit(state){
        state.username = '';
        state.userlist = [];
    }
};
const actions = {
    get_message({commit}, mes){
        commit('get_message', mes);
    },
    set_socket({commit}, user){
        commit('set_socket', user);
    },
    get_userlist({commit}, list){
        commit('get_userlist',list);
    },
    login({commit},user){
        commit('login',user);
    },
    quit({commit}){
        commit('quit');
    }
};

export default {
    state,
    mutations,
    actions
};