const student_id = 1;

var CurrentAssignmentInfo = {}

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
                lastpairedsection.style.width = "87vw";
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

var player = videojs('my-video')
let videoviewere = document.getElementById("my-video")
let videocontainer = document.querySelector(".videocontainer")
var pdfViewer = document.getElementById("pdfviewer");

function DisplayAttachment(p) { // p = path

    if (p.slice(-3) == "mp4") { // file is video

        if (videocontainer.classList.contains("hiddensection")) { // making video visible
            videocontainer.classList.remove("hiddensection")
        }

        if (!pdfViewer.classList.contains("hiddensection")) { // hiding pdf viewer
            pdfViewer.classList.add("hiddensection")
        }

        player.src({type: "video/mp4", src: p})
    }
    else if (p.slice(-3) == "pdf") { // file is pdf
        if (!videocontainer.classList.contains("hiddensection")) { // hiding video
            videocontainer.classList.add("hiddensection")
        }

        if (pdfViewer.classList.contains("hiddensection")) { // making pdf viewer visible
            pdfViewer.classList.remove("hiddensection")
        }

        pdfjsLib.getDocument("/Client/pdfs/You'll Be Back - Hamilton TABS.pdf").promise.then(pdf => {
            console.log("PDF Loaded!")
        
            return pdf.getPage(1);
        }).then(page => {
            var canvas = pdfViewer
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
    }
}

const noassignments = document.getElementsByClassName('noassignments')[0]
const initialassignment = document.getElementById("initial")

let assignmentPage = document.getElementById("assignment")
let desc = document.getElementsByClassName("textdesc")[0]
let desctitle = document.getElementsByClassName("desctitle")[0]
let duedesc = document.getElementsByClassName("duedesc")[0]
let submissions = document.getElementsByClassName("submissions")[0]

let submissionCard = document.getElementById("initialsubmission")
let assignmentCard = document.getElementById("initialassignment")
let assignmentCardTitle = assignmentCard.querySelector(".submissiontitle");
let assignmentCardSubmissionDate = assignmentCard.querySelector(".submissiondate");

function deleteSubmissionCards() {
    let submissionCards = document.getElementsByClassName("card")
    const staticlength = submissionCards.length
    let removed = 0

    for (let n = 0; n < staticlength; n++) {

        i = n - removed

        if (submissionCards[i].id != "initialsubmission" && submissionCards[i].id != "initialassignment") {
            submissionCards[i].remove()
            removed++
        }
    }
}

function clearCardBorders() {
    let submissionCards = document.getElementsByClassName("card")
    for (let i = 0; i < submissionCards.length; i++) {
        if (submissionCards[i].classList.contains("solidborder")) {
            submissionCards[i].classList.remove("solidborder")
            submissionCards[i].dataset.clicked = 0
        }
    }
}

function updateSubmission(assignment_id) {

    deleteSubmissionCards() // clearing all extra submission cards except initial

    fetch(`http://localhost:3000/submissions?id=${assignment_id}`).then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }).then(data => {
        for (let i = 0; i < data.length; i++) {

            let newCard = submissionCard.cloneNode(true) // cloning card
            newCard.classList.remove("hiddensection") // revealing card
            newCard.removeAttribute("id")

            newCard.dataset.id = data[i].id

            const submissiondate = TranslateDate(data[i].submitted_at)
            newCard.querySelector(".submissiondate").textContent = `Submitted on ${submissiondate}` // changing due date

            submissionCard.after(newCard)

            newCard.addEventListener("click", (e) => {
                
                if (newCard.dataset.clicked == 0) {

                    clearCardBorders() // clearing all borders
                    newCard.classList.add("solidborder") //setting border for clicked card\

                    DisplayAttachment("/Server/" + data[i].submission_data.file) // displaying card attachment/media

                    newCard.dataset.clicked = 1
                }
                
                //changing desc
                desc.innerHTML = data[i].feedback
                desctitle.innerHTML = "Video"
                duedesc.innerHTML = `This Assignment Was Submitted on ${TranslateDate(data[i].submitted_at)}`
                
            }) // click event listeners
        }
    })
}

function SetAssignmentPage(data, j) {
    const details = data[j].details // details included in JSON

    // personalized description
    desc.innerHTML = details.description
    desctitle.innerHTML = data[j].title
    duedesc.innerHTML = "This Assignment is Due " + TranslateDate(data[j].due_date, false)

    DisplayAttachment("/Server/" + details.attachment)
}

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

                                    // Add initial card border
                                    clearCardBorders()
                                    if (!(assignmentCard.classList.contains("solidborder"))) { 
                                        assignmentCard.classList.add("solidborder")
                                    }
                                    assignmentCard.dataset.clicked = 1

                                    SetAssignmentPage(data, j)

                                    lastpairedsection.classList.add("hiddensection")
                                    sections[currentsection].classList.remove("clicked")

                                    //personalized assignment card
                                    assignmentCardTitle.textContent = data[j].title
                                    assignmentCardSubmissionDate.textContent = `Assigned on ${TranslateDate(data[j].created_at, false)}`

                                    //personalized submissions
                                    updateSubmission(data[j].id)

                                    //storing assignment id
                                    assignmentPage.dataset.id = data[j].id

                                    assignmentPage.classList.remove("hiddensection")

                                    currentsection = -1
                                    lastpairedsection = assignmentPage

                                    CurrentAssignmentInfo = [data[j]]
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
    
    console.log(file.type)
    e.preventDefault()

    if (file.type == "application/pdf" || file.type == "video/mp4") {

        const form = new FormData();

        form.append("file", file)
        form.append("assignment_id", assignmentPage.dataset.id)
        form.append("submission_type", file.type)

        
        try {
            e.preventDefault()
            fetch("http://localhost:3000/submission", {
                method: "POST",
                body: form,
            }).then(response => response.json())
            .then(data => {
                console.log("File uploaded successfully:", data);
                return data
            }).then(stuff => { // updatingsubmissions
                updateSubmission(assignmentPage.dataset.id)
            }) 
        } catch(error) {
            console.error("Error uploading file:", error);
        };
    
    }
    
    draggedover = false

    
})

assignmentCard.addEventListener("click", (e) => {
    if (assignmentCard.dataset.clicked == 0) {
        clearCardBorders()

        SetAssignmentPage(CurrentAssignmentInfo, 0)
        assignmentCard.dataset.clicked = 1

        if (!(assignmentCard.classList.contains("solidborder"))) { 
            assignmentCard.classList.add("solidborder")
        }
    }

    
    
})

function checker() {
    console.log(currentsection)
    setTimeout(checker, 50)
}

// checker()