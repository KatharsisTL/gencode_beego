import * as Fetch from "../../utils/fetch.js"

export let ProjectVue = Vue.extend({
    // language=HTML
    template: `
    <v-card class="mb-1">
        <v-layout row nowrap>
            <v-flex xs5 v-if="project != null"><v-card-text>Имя проекта: {{project.name}}</v-card-text></v-flex>
            <v-flex xs5 v-if="project != null">
                <v-card-text>Путь генерации файлов: {{project.gen_path}}</v-card-text>
            </v-flex>
            <v-flex xs2 class="text-xs-right">
                <v-btn class="warning" fab small title="Редактировать" @click="$root.projectEdit(project)">
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn class="error" fab small title="Удалить" @click="projectDel(project)">
                    <v-icon>delete</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-tabs v-model="active_tab">
            <v-tab v-for="(tab, num) in tabs" :key="num">{{tab.title}}</v-tab>
            <v-tab-item v-for="(tab, num) in tabs" :key="num">
                <vn-entities v-if="num == 0" :project-id="project_id"></vn-entities>
            </v-tab-item>
        </v-tabs>
    </v-card>`,
    data: function () {
        return {
            project_id: this.$route.params.id,
            project: null,
            active_tab: null,
            tabs: [
                {
                    title: "Сущности"
                }
            ]
        }
    },
    watch: {
        '$route.params.id' (to, from) {
            this.project_id = to;
        },
        project_id(to) {
            Fetch.Json(`/project/${this.project_id}/one.json`).then((res)=>{
                this.project = res;
            });
        }
    },
    created() {
        this.loadProject();
    },
    methods: {
        loadProject() {
            this.$route.params.id;
            Fetch.Json(`/project/${this.project_id}/one.json`).then((res)=>{
                this.project = res;
            });
        },
        projectDel() {
            if(this.project) {
                console.log("del");
                Fetch.Json(`/project/${this.project.id}/delete`, "POST").then(res=>{
                    if(res.result) {
                        this.$root.loadProjects();
                        this.$router.push("/");
                        this.$root.showSnackbarSuccess(res.error);
                    } else {
                        this.$root.loadProjects();
                        if(res.ext) {this.$router.push(`/project/${res.ext}`);}
                        this.$root.showSnackbarError(res.error);
                    }
                });
            } else {
                this.$root.showSnackbarError("Нет проектов для удаления");
            }
        }
    }
});