import * as Fetch from "./utils/fetch.js"
// @ts-ignore
import {Vue} from "vue";
import {IProject} from "./interfaces.js";

declare const VueRouter: typeof import("vue-router/types/router");
declare const Vue: typeof import("vue/types/vue");

document.addEventListener("DOMContentLoaded", main);

const routes: any = [];
// @ts-ignore
let router: VueRouter;
let app: any;

function main() {
    // @ts-ignore
    router = new VueRouter({routes});
    // @ts-ignore
    app = new Vue({
        router,
        data: {
            drawer: true,
            projects: [],
            addProjDialog: {
                visible: false,
                valid: false,
                proj: {}
            },
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
            },
            addProjDialogShow() {
                // @ts-ignore
                this.proj = <IProject>{
                    id: 0,
                    name: "",
                    title: "",
                    short_title: "",
                    gen_path: ""
                };
                // @ts-ignore
                this.addProjDialog.visible = true;
                console.log("addProjDialogShow()");
            },
            addProjDialogClose() {
                // @ts-ignore
                this.addProjDialog.visible = false;
                console.log("addProjDialogClose()");
            }
        }
    });
    app.$mount("#app");
}