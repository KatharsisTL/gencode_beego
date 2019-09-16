import * as Fetch from "./utils/fetch.js"

declare const VueRouter: typeof import("vue-router/types/router");
declare const Vue: typeof import("vue/types/vue");

document.addEventListener("DOMContentLoaded", main);

const routes: any = [];
// @ts-ignore
let router: VueRouter;
// @ts-ignore
let app: Vue;

function main() {

    // @ts-ignore
    router = new VueRouter({routes});
    // @ts-ignore
    const app =new Vue({
        router,
        data: {
            drawer: false,
            projects: []
        },
        created() {
            //this.$router.push({path: "/ot_new"});
            this.loadProjects();
        },
        methods: {
            loadProjects() {
                Fetch.Json("/project/select.json").then((projects)=>{
                    // @ts-ignore
                    this.projects = projects;
                });
            }
        }
    }).$mount("#app");
}