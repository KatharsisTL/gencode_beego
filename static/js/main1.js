import * as Fetch from "./utils/fetch.js"
import {Snackbar} from "./vue/mixins/snackbar.js";
import {ProjectVue} from "./vue/routes/project.js";
import * as VnEntities from "./vue/components/vn-entities.js";

document.addEventListener("DOMContentLoaded", main);

const routes = [
    {path: "/project/:id", component: ProjectVue}
];
let router;
let app;

function main() {
    VnEntities.Init();

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
                this.projectEdit(this.addProjDialog.proj = {
                    id: 0,
                    name: "",
                    gen_path: ""
                });
            },
            projectEdit(proj) {
                this.addProjDialog.proj = proj;
                this.addProjDialog.visible = true;
            },
            addProjDialogClose() {
                this.addProjDialog.proj = null;
                this.addProjDialog.visible = false;
            },
            addProjDialogSave() {
                if(this.$refs["addProjForm"].validate()) {
                    Fetch.Json("/project/save", "POST", this.addProjDialog.proj).then((res)=>{
                        console.log(res);
                        if(res.result) {
                            this.showSnackbarSuccess(res.error);
                            this.addProjDialogClose();
                            this.$router.push(`/project/${res.ext}`);
                        } else {
                            this.showSnackbarError(res.error);
                        }
                        this.loadProjects();

                    });
                } else {
                    this.showSnackbarError("Необходимо корректно заполнить все поля");
                }
            }
        }
    });
    app.$mount("#app");
}