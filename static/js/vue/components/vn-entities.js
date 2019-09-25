import * as Fetch from "../../utils/fetch.js";

export function Init() {
    Vue.component("vn-entities", {
        props: [
            'project-id'
        ],
        // language=HTML
        template: `<div class="vn-entities">
            <v-dialog v-model="edit.visible" width="500" v-if="edit.entity != null">
                <v-card>
                    <v-card-title>Добавление сущности<v-spacer></v-spacer><v-btn fab flat small @click="editDlgClose()"><v-icon>close</v-icon></v-btn></v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-form ref="editEntityForm" v-model="edit.valid" lazy-validation>
                            <v-text-field v-model="edit.entity.name" :rules="edit.rules.name" label="Имя сущности" required></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="editDlgClose()">
                            <v-icon>close</v-icon>
                            <span>Отмена</span>
                        </v-btn>
                        <v-btn color="success" @click="editDlgSave()">
                            <v-icon>save</v-icon>
                            <span>Сохранить</span>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- Основное тело -->
            <v-card-text>
                <v-btn fab color="primary" small title="Добавить сущность" @click="addDlgOpen()"><v-icon>add</v-icon></v-btn>
            </v-card-text>
            <v-divider></v-divider>
            <template v-for="e in entities">
                <v-layout row nowrap>
                    <v-flex xs10>
                        <v-card-text :key="e.id">{{e.name}}</v-card-text>    
                    </v-flex>
                    <v-flex xs2 text-xs-right>
                        <v-btn fab small color="warning" title="Редактировать" @click="editDlgOpen(e)"><v-icon>edit</v-icon></v-btn>
                        <v-btn fab small color="error" title="Удалить"><v-icon>delete</v-icon></v-btn>
                    </v-flex>
                </v-layout>
                
                <v-divider :key="'divider_'+e.id"></v-divider>
            </template>
            
</div>`,
        data: function() {
            return {
                entities: [],
                edit: {
                    visible: false,
                    valid: false,
                    entity: null,
                    rules: {
                        name: [
                            v => !!v || "Не должно быть пустым"
                        ]
                    }
                }
            }
        },
        created() {
            if(this.projectId) {
                this.loadEntities();
            } else {
                console.error("created() hook: projectId is empty");
            }
        },
        watch: {
            projectId(to) {
                this.loadEntities();
            }
        },
        methods: {
            loadEntities() {
                Fetch.Json(`/entity/select.json?project_id=${this.projectId}`).then(res=>{
                    this.entities = res;
                });
            },
            addDlgOpen() {
                this.editDlgOpen({
                    id: 0,
                    name: "",
                    project_id: parseInt(this.projectId)
                });
            },
            editDlgOpen(entity) {
                this.edit.entity = entity;
                this.edit.visible = true;
            },
            editDlgClose() {
                this.edit.entity = null;
                this.edit.visible = false;
            },
            editDlgSave() {
                this.edit.entity.name = this.toSnake(this.edit.entity.name);
                if(this.$refs["editEntityForm"].validate()) {
                    Fetch.Json("/entity/save", "POST", this.edit.entity).then((res)=>{
                        if(res.result) {
                            this.$root.showSnackbarSuccess(res.error);
                            this.editDlgClose();
                        } else {
                            this.$root.showSnackbarError(res.error);
                        }
                        this.loadEntities();

                    });
                } else {
                    this.$root.showSnackbarError("Необходимо корректно заполнить все поля");
                }
            },
            toSnake(text) {
                return text.split(/(?=[A-Z])/).join('_').toLowerCase();
            }
        }
    });
}