export async function filter() {

    let {
        startTime,
        requestId,
        isShowOnlyRestConnector
    } = await chrome.storage.sync.get();

    if (!document.getElementById("logs")) {
        reformat();
        addExtendIcon();
        addClassBySearch("[REST CONNECTOR]", "isRestConnector")
        addClassBySearch("exit_code: KO", "isKO")
        addClassBySearch("Status: 500", "isKO")
    }

    showAllRows(true); //Reset

    if (startTime != null && startTime !== "") {
        let index = findStartTimeIndex(startTime);
        showRowsByRange(false, 0, index - 1, true);
    }

    if (requestId != null && requestId !== "") {
        let indexes = findIndexesRequestId(requestId);
        showRowsByRange(false, 0, indexes.first-1, true);
        showRowsByRange(false, indexes.last+1, indexes.tot, true);
        showRowsByRange(true, indexes.first, indexes.last, false);
    }

    if (isShowOnlyRestConnector) {
        for (let row of document.getElementsByClassName("row")) {
            row.style.display = row.classList.contains('isRestConnector') && row.style.display === 'flex' ? 'flex' : 'none';
        }
    }

    function showRowsByRange(isVisible, firstIndex, lastIndex, ignoreHiddenRows) {
        const display = isVisible ? 'flex' : 'none';
        let rows = document.getElementsByClassName("row");
        for (let i = firstIndex; i <= lastIndex; i++) {
            if (ignoreHiddenRows || rows[i].style.display !== 'none') {
                rows[i].style.display = display;
            }
        }
    }


    function showAllRows(isVisible) {
        const display = isVisible ? 'flex' : 'none';
        for (let row of document.getElementsByClassName("row")) {
            row.style.display = display;
        }
    }

    function findIndexesRequestId(requestId) {

        let logs = document.getElementById("logs");

        let first = 0;
        let last = 0;
        const tot = logs.children.length;

        for (let i = 0; i < logs.children.length; i++) {
            let log = logs.children[i].getElementsByClassName('log')[0];

            if (log.textContent.includes(requestId)) {
                first = i;
                break;
            }
        }

        for (let i = first + 1; i < logs.children.length; i++) {
            let log = logs.children[i].getElementsByClassName('log')[0];

            if (log.textContent.includes(requestId)) {
                last = i;
            }
        }

        return {first, last, tot}
    }

    function findStartTimeIndex(startTime) {
        let logs = document.getElementById("logs");
        startTime = new Date(startTime).getTime();
        for (let i = 0; i < logs.children.length; i++) {
            let date = logs.children[i].getAttribute('date');
            let currTime = new Date(date).getTime();
            if (currTime > startTime) {
                return i;
            }
        }
        return logs.children.length;
    }

    function addClassBySearch(text, className) {
        for (let log of document.getElementsByClassName("log")) {
            if (log.innerText.includes(text)) {
                log.parentElement.parentElement.classList.add(className);
            }
        }
    }

    function getDateFromString(inputString) {
        let regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/;
        let match = inputString.match(regex);
        return match && match[1] ? match[1] : "";
    }

    function addExtendIcon() {
        let rows = document.getElementById('logs');
        for (let child of rows.children) {
            let text = child.getElementsByClassName('log')[0];
            let exp = document.createElement('div');
            child.insertBefore(exp, child.childNodes[1]);
            exp.style.display = 'none'
            exp.classList.add('exp')
            if (text.offsetWidth > rows.offsetWidth) {
                exp.textContent = "⏷"
                exp.addEventListener("click", (e) => {
                    if (child.classList.contains('wrap')) {
                        child.classList.remove('wrap');
                        exp.textContent = "⏷";
                    } else {
                        child.classList.add('wrap');
                        exp.textContent = "⏶";
                    }
                })
            }
        }

        let exps = document.getElementsByClassName('exp');
        for (let exp of exps) {
            exp.style.display = 'block'
        }
    }

    function reformat() {
        let pre = document.getElementsByTagName("pre")[0];

        pre.removeAttribute('style')

        let text = pre.innerText.split("\n");

        let div = document.createElement("div");
        div.id = "logs"

        for (let i = 0; i < text.length; i++) {
            let row = document.createElement("div");
            row.classList.add("row")
            row.setAttribute('index', i);
            row.setAttribute('date', getDateFromString(text[i]));

            let log = document.createElement("p");
            log.classList.add('log')
            log.innerText = text[i];
            log.addEventListener("dblclick", (e) => {
                let selection = window.getSelection();
                let range = document.createRange();
                range.selectNodeContents(e.target);
                selection.removeAllRanges();
                selection.addRange(range);
            })

            let divLog = document.createElement("div");
            divLog.appendChild(log);

            let index = document.createElement("p");
            index.innerText = i;

            let divIndex = document.createElement("div");
            divIndex.appendChild(index);
            divIndex.classList.add('index')

            row.appendChild(divIndex);
            row.appendChild(divLog)
            div.appendChild(row);
        }

        pre.innerHTML = "";
        pre.appendChild(div);
    }
}