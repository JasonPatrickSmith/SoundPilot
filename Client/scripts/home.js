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

function TranslateDate(d, uppercase) {
    const month = d.slice(5,7)
    const day = d.slice(8,10)
    return (uppercase ? num_to_date[month] : num_to_date[month].slice(0, 1) + num_to_date[month].slice(1, 3).toLowerCase()) + " " + day.replace(/^0+/, '')
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

    if (lastpairedsection) {
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
    }
    

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

                let assignmentPage = document.getElementById("assignment")
                let desc = document.getElementsByClassName("textdesc")[0]
                let desctitle = document.getElementsByClassName("desctitle")[0]
                let duedesc = document.getElementsByClassName("duedesc")[0]
                let submissions = document.getElementsByClassName("submissions")[0]

                if (data.length > 0) {


                    addIfNew(noassignments, "hiddensection")
                    removeIfNew(initialassignment, 'hiddensection')
                    for (let j = 0; j < data.length; j++) { // looping through every JSON assignment

                        const details = data[j].details // details included in JSON

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
                        datee.textContent = TranslateDate(data[j].due_date, true)

                        const headinge = current.querySelector(".heading")
                        headinge.textContent = data[j].title

                        const infotext = current.querySelector(".infotext")
                        infotext.textContent = data[j].short_desc

                        // assignment button styling

                        current.dataset.assignment_type = data[j].type
                        

                        // ASSIGNMENT BUTTON LISTENERS

                        if (current.dataset.listener == '0') { 
                            current.addEventListener("click", (e) => {
                                if (current.dataset.assignment_type=="attachment") {
                                    assignmentPage.classList.remove("hiddensection")

                                    lastpairedsection.classList.add("hiddensection")
                                    sections[currentsection].classList.remove("clicked")

                                    desc.innerHTML = details.description
                                    desctitle.innerHTML = data[j].title
                                    duedesc.innerHTML = "This Assignment is Due " + TranslateDate(data[j].due_date, false)
    
                                    currentsection = -1
                                    lastpairedsection = assignmentPage
                                }
                            })
                        }
                        // ASSIGNMENT BUTTON LISTENERS

                        current.dataset.listener = '1'
                    }
                }
                else {
                    noassignments.classList.remove("hiddensection")
                    addIfNew(initialassignment, 'hiddensection')
                }
            })
        }
    })
}

// SIDEBAR

//PDF LOADING

pdfjsLib.getDocument("/Client/pdfs/You'll Be Back - Hamilton TABS.pdf").promise.then(pdf => {
    console.log("PDF Loaded!")

    return pdf.getPage(1);
}).then(page => {
    const canvas = document.getElementById("pdfviewer");
    const ctx = canvas.getContext("2d");

    const scale = 2.15
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

    window.addEventListener('resize', (e) => {
        const renderContext2 = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render({
            canvasContext: ctx,
            viewport: page.getViewport({ scale })
        });
    })

}).catch(error => {
    console.error("Error loading PDF:", error);
});

// SUBMISSION DROPPING

const zone = document.getElementById("scrollbarborder")
const scrolled = document.getElementById("submissions")
let draggedover = false

function cooldownDragLeave() {


    if (draggedover == false) {
        scrolled.classList.remove("hiddensection")
        scrolled.classList.remove("noPointerEvents")
        return;
    }
    else {
    }

    setTimeout(cooldownDragLeave, 70)
}

zone.addEventListener('dragover', (e) => {
    scrolled.classList.add("hiddensection")
    scrolled.classList.add("noPointerEvents")
    draggedover = true
    setTimeout(cooldownDragLeave, 70)
    e.preventDefault();
})

zone.addEventListener('dragleave', (e) => {
    draggedover = false
    e.preventDefault();
})

zone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    console.log(file)
    e.preventDefault()
    draggedover = false

    const form = new FormData();
    form.append("file", file)

    try {
        fetch("http://localhost:3000/submission", {
            method: "POST",
            body: form,
        }).then(response => response.json())
        .then(data => {
            console.log("File uploaded successfully:", data);
        })
    } catch(error) {
        console.error("Error uploading file:", error);
    };
})