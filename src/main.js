import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import axios from 'axios'
import Main from "@/components/main/Main";
import Start from "@/components/start/Start";

Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
var router = new VueRouter({
    routes: [
        {path: '/main', component: Main},
        {path: '/', component: Start}
    ]
});




new Vue({
    router,
    render: h => h(App),
}).$mount('#app')


