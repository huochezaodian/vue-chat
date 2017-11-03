let util = {

};

util.title = function(title) {
    title = title ? title + ' - Home' : 'Chatroom';
    window.document.title = title;
};

util.scrollTo = function(ele,target,time = 500){
    let that = ele,timer = null,
        sT = that.scrollTop,
        distance = target - sT,
        count = 0,
        sumCount = Math.floor(time/20),
        speed = (distance * 20)/time;

    clearInterval(timer);
    timer = setInterval(function(){
        count++;
        let scrollTop = sT + speed * count;
        that.scrollTop = scrollTop;
        if(count == sumCount){
            clearInterval(timer);
            that.scrollTop = target;
        }
    },20)
}


export default util;