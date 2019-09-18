/**
 * Created by user on 18.08.17.
 */
console.log("test");
export function Html(url) {
    return window.fetch(url, {
        credentials: "same-origin"
    }).then((response) => {
        return response.text();
    });
}
export function Json(url, method = "GET", data = null, file = null) {
    if (data == null && file == null) {
        return window.fetch(url, {
            credentials: "same-origin",
            method: method,
        }).then((response) => {
            return response.json();
        });
    }
    else {
        let formData = new FormData();
        if (data != null) {
            formData.append("data", JSON.stringify(data));
        }
        if (file != null) {
            formData.append("file", file, "file");
        }
        return window.fetch(url, {
            credentials: "same-origin",
            method: method,
            body: formData
        }).then((response) => {
            return response.json();
        });
    }
}
