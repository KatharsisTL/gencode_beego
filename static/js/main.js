import * as Fetch from "./utils/fetch.js";
document.addEventListener("DOMContentLoaded", main);
const routes = [];
// @ts-ignore
let router;
// @ts-ignore
let app;
function main() {
    // @ts-ignore
    router = new VueRouter({ routes });
    // @ts-ignore
    const app = new Vue({
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
                Fetch.Json("/project/select.json").then((projects) => {
                    // @ts-ignore
                    this.projects = projects;
                });
            }
        }
    }).$mount("#app");
}
