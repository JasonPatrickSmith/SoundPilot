// SIDEBAR

function endTransition(e) {
    e.classList.remove("transitioning")
}



const expandbtn = document.getElementById("expandbtn");
const sidebar = document.getElementById("sidebar");

// fading elements
const logo = document.getElementById("name");
const menutag = document.getElementById("menutag");
const texts = document.getElementById("infobar");
const clearToggle = [logo, menutag, texts]

function toggleClear() {
    for (let i = 0; i < clearToggle.length; i++) {
        clearToggle[i].classList.toggle("clear")
    }
    
}

// main container
const main = document.getElementById("main")
const sections = document.getElementsByClassName("section") // all sections
let currentsection = 0; // initial button
let lastpairedsection = document.getElementById("assignments"); // initial section

expandbtn.addEventListener("click", (e) => {
    sidebar.classList.toggle("shrunk");
    main.classList.toggle("shrunk"); //shrinking elements

    main.classList.add("transitioning")
    setTimeout(endTransition, 300, main)

    setTimeout(toggleClear, logo.classList.contains("clear") ? 100 : 0) // making buttons visible or clear

    if (main.classList.contains("shrunk")) {//shrinking or not 
        lastpairedsection.style.width = "95.6vw"
    } 
    lastpairedsection.style.opacity = 0;
    setTimeout(() => {

        if (!main.classList.contains("shrunk")) { // main div is shrinking
            lastpairedsection.style.width = "85vw";
        }

        lastpairedsection.style.opacity = 1;
    }, 300)
     // hide sections while resizing
});

//section buttons


for (let i = 0; i < sections.length; i++) {
    sections[i].addEventListener("click", (e) => {

        if (i != currentsection) {

            pairedsectionid = (sections[i].id).slice(0, -3) // section (like assignments section) that we want to turn visible
            sections[i].classList.add("clicked")
            pairedsection = document.getElementById(pairedsectionid)
            
            pairedsection.classList.remove("hiddensection")

            lastpairedsection.classList.add("hiddensection")
            sections[currentsection].classList.remove("clicked")

            currentsection = i
            lastpairedsection = pairedsection
        }
    })
}

// SIDEBAR