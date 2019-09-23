import * as Fetch from "./utils/fetch.js"
import {Snackbar} from "./vue/snackbar.js";

document.addEventListener("DOMContentLoaded", main);

const routes = [];
let router;
let app;

function main() {
    router = new VueRouter({routes});
    app = new Vue({
        router,
        data: function() {
            return {
            drawer: true,
            projects: [],
            addProjDialog: {
                visible: false,
                valid: false,
                proj: {},
                rules: {
                    name: [
                        v => !!v || "Не должно быть пустым"
                    ],
                    gen_path: [
                        v => !!v || "Не должно быть пустым"
                    ]
                }
            },
        }},
        mixins: [Snackbar],
        created() {
            //this.$router.push({path: "/ot_new"});
            this.loadProjects();
        },
        methods: {
            loadProjects() {
                Fetch.Json("/project/select.json").then((projects)=>{
                    this.projects = projects;
                });
            },
            addProjDialogShow() {
                this.addProjDialog.proj = {
                    id: 0,
                    name: "",
                    gen_path: ""
                };
                this.addProjDialog.visible = true;
                console.log("addProjDialogShow()");
            },
            addProjDialogClose() {
                this.addProjDialog.visible = false;
                console.log("addProjDialogClose()");
            },
            addProjDialogSave() {
                if(this.addProjDialog.valid) {
                    console.log(this.addProjDialog.proj);
                    Fetch.Json("/project/save", "POST", this.addProjDialog.proj).then((res)=>{
                        console.log(res);
                    });
                } else {
                    this.showSnackbarError("Необходимо корректно заполнить все поля");
                }
            }
        }
    });
    app.$mount("#app");
}