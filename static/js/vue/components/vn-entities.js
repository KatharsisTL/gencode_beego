export function Init() {
    Vue.component("vn-entities", {
        props: [
            'project-id'
        ],
        // language=HTML
        template: `<div class="vn-entities">
            <v-card-text>
                <v-btn fab color="primary" small title="Добавить сущность"><v-icon>add</v-icon></v-btn>
            </v-card-text>
            <v-card-text>{{projectId}}</v-card-text>
</div>`,
        data: function() {
            return {
                entities: []
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
                console.log(`projectId = ${this.projectId}`);

            }
        }
    });
}