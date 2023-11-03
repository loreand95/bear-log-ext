export async function executeScript(func) {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    return chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: func,
    })
}