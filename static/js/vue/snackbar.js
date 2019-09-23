export let Snackbar = {
    data() {
        return {
            snackbar: {
                visible: false,
                text: "",
                color: "",
            }
        }
    },
    methods: {
        showSnackbar(color, text) {
            this.snackbar.color = color;
            this.snackbar.text = text;
            this.snackbar.visible = true;
        },
        showSnackbarError(text) {
            this.showSnackbar("error", text);
        },
        showSnackbarSuccess(text) {
            this.showSnackbar("success", text);
        }
    }
};