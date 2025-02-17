const student_id = 1;

const num_to_date = {
    "01" : "JAN",
    "02" : "FEB",
    "03" : "MAR",
    "04" : "APR",
    "05" : "MAY",
    "06" : "JUN",
    "07" : "JUL",
    "08" : "AUG",
    "09" : "SEB",
    "10" : "OCT",
    "11" : "NOV",
    "12" : "DEC",
}

function TranslateDate(d) {
    const month = d.slice(5,7)
    const day = d.slice(8,10)
    return num_to_date[month] + " " + day.replace(/^0+/, '')
}

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
let currentsection = -1; // initial button
let lastpairedsection = null; // initial section


expandbtn.addEventListener("click", (e) => {
    sidebar.classList.toggle("shrunk");

    setTimeout(toggleClear, logo.classList.contains("clear") ? 100 : 0) // making buttons visible or clear

    lastpairedsection.style.opacity = 0;
    setTimeout(() => {
        main.classList.toggle("shrunk"); //shrinking elements
        if (!main.classList.contains("shrunk")) { // main div is shrinking
            lastpairedsection.style.width = "85vw";
        }
        else {
            lastpairedsection.style.width = "95.6vw"
        }

        lastpairedsection.style.opacity = 1;
    }, 300)

     // hide sections while resizing
});

//section buttons

function addIfNew(e, add) { // e = element, add = classname
    if (!e.classList.contains(add)) {
        e.classList.add(add)
    }
}

function removeIfNew(e, remove) { // e = element, remove = classname
    if (e.classList.contains(remove)) {
        e.classList.remove(remove)
    }
}

//ASSIGNMENTS

function deleteAllAssignments() {
    const assignments = document.getElementsByClassName("assignment")
    for (let i = 0; i < assignments.length; i++) {
        if (assignments[i].id != "initial") {
            assignments[i].remove()
        }
    }
}

const noassignments = document.getElementsByClassName('noassignments')[0]
const initialassignment = document.getElementById("initial")

for (let i = 0; i < sections.length; i++) {
    sections[i].addEventListener("click", (e) => {

        if (i != currentsection) {

            pairedsectionid = (sections[i].id).slice(0, -3) // section (like assignments section) that we want to turn visible
            sections[i].classList.add("clicked")
            pairedsection = document.getElementById(pairedsectionid)
            pairedsection.classList.remove("hiddensection")
            
            if (currentsection != -1) {
                
                sections[currentsection].classList.remove("clicked")
            }
            if (lastpairedsection != null) {
                lastpairedsection.classList.add("hiddensection")
            }
            
            currentsection = i
            lastpairedsection = pairedsection
        }
        
        if (sections[i].id == "assignmentsbtn") {


            deleteAllAssignments()

            fetch(`http://localhost:3000/assignments?id=${student_id}`).then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            }).then(data => {
                assignmentelements = []

                if (data.length > 0) {


                    addIfNew(noassignments, "hiddensection")
                    removeIfNew(initialassignment, 'hiddensection')
                    for (let j = 0; j < data.length; j++) { // looping through every JSON assignment

                        current = initialassignment

                        if (j != 0) {
                            let newassignment = initialassignment.cloneNode(true) // cloning assignment buttons
                            current.after(newassignment)
                            current = newassignment
                            current.removeAttribute("id")
                            current.dataset.listener = '0'
                        }

                        // assignment button styling
                        
                        const datee = current.querySelector('.date')
                        datee.textContent = TranslateDate(data[j].due_date)

                        const headinge = current.querySelector(".heading")
                        headinge.textContent = data[j].title

                        const infotext = current.querySelector(".infotext")
                        infotext.textContent = data[j].short_desc

                        // assignment button styling

                        current.dataset.assignment_type = data[j].type

                        assignmentelements.push(current)
                    }
                }
                else {
                    noassignments.classList.remove("hiddensection")
                    addIfNew(initialassignment, 'hiddensection')
                }

                return assignmentelements;
            }).then(assignmentbuttons => {
                    
                const assignmentPage = document.getElementById("assignment")

                for (let i = 0; i < assignmentbuttons.length; i++) {
                    if (assignmentbuttons[i].dataset.listener == '0') {
                        assignmentbuttons[i].addEventListener("click", (e) => {

                            if (assignmentbuttons[i].dataset.assignment_type == "attachment") {
                                assignmentPage.classList.remove("hiddensection")
    
                                lastpairedsection.classList.add("hiddensection")
                                sections[currentsection].classList.remove("clicked")
    
                                currentsection = -1
                                lastpairedsection = assignmentPage
                            }
                        })
                        assignmentbuttons[i].dataset.listener = '1'
                    }
                }
            })
        }
    })
}

// SIDEBAR

// Assignment icons


//PDF LOADING

pdfjsLib.getDocument("/Client/pdfs/You'll Be Back - Hamilton TABS.pdf").promise.then(pdf => {
    console.log("PDF Loaded!")

    return pdf.getPage(1);
}).then(page => {
    const canvas = document.getElementById("pdfviewer");
    const ctx = canvas.getContext("2d");

    const scale = 2
    const viewport = page.getViewport({ scale })

    const multiplier = 4

    canvas.width = viewport.width
    canvas.height = viewport.height
    // canvas.style.width = `${viewport.width/multiplier}px`
    // canvas.style.height = `${viewport.height/multiplier}px`
    canvas.style.width = `${viewport.width/3.5}px`
    canvas.style.height = `${viewport.height/3.5}px`
    // canvas.style.width = `4[x]`

    const renderContext = {
        canvasContext: ctx,
        viewport: viewport
    };
    page.render(renderContext);
}).catch(error => {
    console.error("Error loading PDF:", error);
});