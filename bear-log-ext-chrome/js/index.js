import {init} from "./init.js";
import {filter} from "./filter.js";
import {executeScript} from "./chrome.js"
import {showLoader} from "./loader.js";

chrome.runtime.onMessage.addListener((request) => {
        document.getElementById('filter').disabled = !request.isValidPage
    }
);

await executeScript(init)

document.getElementById("filter").addEventListener("click", async () => {

    chrome.storage.sync.set({
        startTime: document.getElementById("startTime").value,
        requestId: document.getElementById("requestId").value,
        isShowOnlyRestConnector: document.getElementById("showOnlyRestConnector").checked
    });

    showLoader(true)
    executeScript(filter).then(() => showLoader(false));
});




