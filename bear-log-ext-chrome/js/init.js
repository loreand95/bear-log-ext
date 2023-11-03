export async function init() {

    await checkIsValidPage();

    injectCSS(`
        .hidden { 
            display: none; 
        }
        .isKO {
            color: red;
        }
        .row:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }
        p {
            tab-size: 6; 
            display: inline;
        }
        .row {
            display: flex;
            margin-top:4px;
            align-items:top;
            width:max-content;
        }
        .wrap {
            text-wrap:wrap;
            word-break: break-word;
            width:fit-content;
        }
        .index {
            min-width: 50px;
        }
        .exp {
            min-width: 50px;
            text-align:center;
        }
        .log {}
    `.trim());

    async function checkIsValidPage() {
        let isValidPage = document.getElementsByTagName("pre").length === 1;
        chrome.runtime.sendMessage({
            isValidPage
        });
    }

    function injectCSS(css) {
        if(document.getElementById('logs')){
            return ;
        }

        let el = document.createElement('style');
        el.innerText = css;
        document.head.appendChild(el);
        return el;
    }
}