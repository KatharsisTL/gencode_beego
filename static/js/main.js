import * as Fetch from "./utils/fetch.js";
document.addEventListener("DOMContentLoaded", main);
const routes = [];
// @ts-ignore
let router;
let app;
function main() {
    // @ts-ignore
    router = new VueRouter({ routes });
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
                Fetch.Json("/project/select.json").then((projects) => {
                    // @ts-ignore
                    this.projects = projects;
                });
            },
            addProjDialogShow() {
                // @ts-ignore
                this.proj = {
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
