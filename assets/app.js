let ACTIVE_MENU = "HOME"

const headerTexts = {
    "HOME": {
        "header .action-area h1": "It's Never been Easier",
        "header .action-area .actions button:nth-child(1)": "DOWNLOAD",
        "header .action-area .actions button:nth-child(2)": "READ MORE"
    }, "DOWNLOAD": {
        "header .action-area h1": "CustoMiner",
        "header .action-area .actions button:nth-child(1)": "<img src=\"assets/img/icons/download_icon.png\">DOWNLOAD LATEST",
        "header .action-area .actions button:nth-child(2)": "GITHUB"
    }
}

document.querySelectorAll('.nav .left a').forEach(a => {
    a.onclick = (e) => {
        e.preventDefault()
        navElClick(a)
    }
})

function navElClick(a) {
    // show menu
    openMenu(a)
    // change URL
    window.location.hash = a.getAttribute('href')
}

function openMenu(a) {
    let aHrefBodyClass = a.getAttribute('href').slice(3).toUpperCase()
    // change body class to show menu header
    document.body.classList.remove(ACTIVE_MENU)
    document.body.classList.add(aHrefBodyClass)
    // update menu state
    ACTIVE_MENU = aHrefBodyClass
    // show menu content
    // check menu isn't already open
    if (!a.classList.contains('active')) {
        document.querySelectorAll('.actions a').forEach(b => {
            if (b == a) {
                a.classList.add('active')
                showMenu(aHrefBodyClass, a)
            } else {
                b.classList.remove('active')
            }
        })
    }
}

function renderActiveMenuIndicator(a = document.querySelector('.nav .left .actions a.active')) {
    // render active menu indicator
    let activeMenuIndicator = document.querySelector('.activeMenuIndicator')
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = a.getBoundingClientRect(),
        offsetLeft = elemRect.left - bodyRect.left;

    activeMenuIndicator.style.left = offsetLeft + "px"
    activeMenuIndicator.style.width = a.offsetWidth + "px"
}

function showMenu(bodyClass, navElem) {
    window.scrollTo({top: 0})
    renderActiveMenuIndicator(navElem)

    // change texts
    Object.keys(headerTexts[ACTIVE_MENU]).forEach(selector => {
        document.querySelector(selector).innerHTML = headerTexts[ACTIVE_MENU][selector]
    })
}

// browser back btns
window.onhashchange = function () {
    document.querySelectorAll('.nav .left a').forEach(a => {
        if (a.getAttribute('href') == window.location.hash.slice(0, a.getAttribute('href').length) && ACTIVE_MENU != window.location.hash.slice(1, a.getAttribute('href').length).toUpperCase()) {
            navElClick(a)
        }
    })
}

// load finishes & nav load animation
setTimeout(() => {
    renderActiveMenuIndicator()
    document.querySelector('.nav').style.transform = 'translateY(0)'
    document.querySelector('.nav').style.opacity = 1
}, 300)

// open URL menu on load
if (window.location.hash != "") {
    navElClick(document.querySelector(`a[href="${window.location.hash}"]`))
} else {
    navElClick(document.querySelector('.nav div div a:nth-child(1)'))
}

// sections:
// infinite scroll carousel
let ScrollCardsContainer = document.querySelector('#features .cards')
let translateValue = 0

// todo

// get last release installer
let lastReleaseInstallerFileURL = ""
let GITHUB_URL = "https://github.com/Wivon/CustoMiner"
if (lastReleaseInstallerFileURL == "") {
    fetch("https://api.github.com/repos/Wivon/CustoMiner/releases/latest").then((response) => {
        response.json().then(res => {
            res["assets"].forEach(asset => {
                let extensions = asset["name"].split('.')
    
                if (extensions[extensions.length - 1] == "exe") {
                    lastReleaseInstallerFileURL = asset.browser_download_url
                }
            })
            // set version name as download menu h1
            headerTexts.DOWNLOAD['header .action-area h1'] = "CustoMiner V" + res.name
        })
    })
}

// download button onclick
document.querySelector('header .action-area .actions button:nth-child(1)').onclick = () => {
    if (ACTIVE_MENU == "HOME") {
        navElClick(document.querySelector('div div div a:nth-child(2)'))
    } else if (ACTIVE_MENU == "DOWNLOAD") {
        window.open(lastReleaseInstallerFileURL)
    }
}

document.querySelector('header .action-area .actions button:nth-child(2)').onclick = () => {
    if (ACTIVE_MENU == "HOME") {
        document.querySelector('.home-container').scrollIntoView()
    } else if (ACTIVE_MENU == "DOWNLOAD") {
        window.open(GITHUB_URL)
    }
}

// handle window resize (nav)
window.onresize = () => {
    renderActiveMenuIndicator()
}