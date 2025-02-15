// SIDEBAR

function endTransition(e) {
    e.classList.remove("transitioning")
}

const expandbtn = document.getElementById("expandbtn");
const sidebar = document.getElementById("sidebar");

console.log(expandbtn, sidebar)

expandbtn.addEventListener("click", (e) => {
    sidebar.classList.toggle("shrunk");
    sidebar.classList.add("transitioning");
    setTimeout(endTransition, 300, sidebar)
});

// SIDEBAR