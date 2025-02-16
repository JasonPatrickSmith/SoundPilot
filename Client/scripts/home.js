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

// combine lists of elements
// for (let i = 0; i < texts.length; i++) {
//     clearToggle.push(texts[i])
// }

function toggleClear() {
    for (let i = 0; i < clearToggle.length; i++) {
        clearToggle[i].classList.toggle("clear")
    }
    
}

expandbtn.addEventListener("click", (e) => {
    sidebar.classList.toggle("shrunk");
    sidebar.classList.add("transitioning");
    setTimeout(endTransition, 300, sidebar);
    setTimeout(toggleClear, logo.classList.contains("clear") ? 100 : 0)
});

// SIDEBAR