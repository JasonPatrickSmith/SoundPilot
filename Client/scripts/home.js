const student_id = 1;

let descriptionmodule = null;

var CurrentAssignmentInfo = {}
var assignmentDownloader = document.getElementById("assignmentdownloader")
var pdfpage = 1
var maxpages = 4;

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

//checking for description module (teacher page)

if (document.querySelector('script[src="../scripts/NoteManagement.js"]')) {
    import('./NoteManagement.js').then((m) => {
        descriptionmodule = m;
    })
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
const sections = [document.getElementById("assignmentsbtn"), document.getElementById("practicebtn")]
var currentsection = 0; // initial button
var lastpairedsection = document.getElementById("assignments"); // initial section

export function setCurrentSection(n) {
    currentsection = n
}

export function getCurrentSection() {
    return currentsection
}

export function setLastPairedSection(e) {
    lastpairedsection = e
}

export function getLastPairedSection() {
    console.log(lastpairedsection)
    return lastpairedsection
}



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

export function addIfNew(e, add) { // e = element, add = classname
    if (!e.classList.contains(add)) {
        e.classList.add(add)
    }
}

export function removeIfNew(e, remove) { // e = element, remove = classname
    if (e.classList.contains(remove)) {
        e.classList.remove(remove)
    }
}

//ASSIGNMENTS

export function deleteAllAssignments() {
    const assignments = Array.from(document.getElementsByClassName("assignment"))
    for (let i = 0; i < assignments.length; i++) {
            if (assignments[i].id != "initial") {
                assignments[i].remove()
            }
        
    }
}

var videoElem = document.getElementById("my-video")
videoElem.classList.add("video-js")

var player = videojs('my-video', { 
    fluid: true,
    controls: true
 })
var loadingdata = false
let videoviewere = document.getElementById("my-video")
let videocontainer = document.querySelector(".videocontainer")
var pdfViewer = document.getElementById("pdfviewer");
var pdfcontainer = document.getElementById("pdfcontainer")

function renderPDF() {

    const p = assignmentDownloader.getAttribute('href')

    pdfjsLib.getDocument(p).promise.then(pdf => {
        
        maxpages = pdf.numPages

        return pdf.getPage(pdfpage);
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
        return page;
    
    }).then(again => {
        pdfcontainer.style.opacity = 1
    }).catch(error => {
        console.error("Error loading PDF:", error);
    });
}

const pdfbuttons = document.getElementById("pdfbuttons")

function DisplayAttachment(p) { // p = path

    const fileURL = `/uploads`

    if (p.slice(-3) == "mp4") { // file is video

        addIfNew(pdfbuttons, "hiddensection")

        if (videocontainer.classList.contains("hiddensection")) { // making video visible
            videocontainer.classList.remove("hiddensection")
        }

        if (!pdfViewer.classList.contains("hiddensection")) { // hiding pdf viewer
            pdfViewer.classList.add("hiddensection")
        }

        player.src({type: "video/mp4", src: `http://3.13.118.113:3000/uploads?path=${p}`})
    }
    else if (p.slice(-3) == "pdf") { // file is pdf
        removeIfNew(pdfbuttons, "hiddensection")
        pdfcontainer.style.opacity = 0

        assignmentDownloader.setAttribute("href", `http://3.13.118.113:3000/uploads?path=${p}`)

        if (!videocontainer.classList.contains("hiddensection")) { // hiding video
            videocontainer.classList.add("hiddensection")
        }

        if (pdfViewer.classList.contains("hiddensection")) { // making pdf viewer visible
            pdfViewer.classList.remove("hiddensection")
        }

        renderPDF()
    }
}

function updateVid() {

    var maxWidth = 800
        var maxHeight = 800
        var vidWidth = player.videoWidth();
        var vidHeight = player.videoHeight();
        
    
        var aspectRatio = vidWidth/vidHeight
    
        if (vidWidth > maxWidth || vidHeight > maxHeight) {
            if (vidWidth / maxWidth > vidHeight / maxHeight) { 
                vidWidth = maxWidth 
                vidHeight = Math.round(maxWidth/aspectRatio)
                console.log("width constraint")
            }
            else {
                vidHeight = maxHeight 
                vidWidth = Math.round(maxHeight*aspectRatio) 
                console.log("height constraint")
            }
        }

        var videoelemapi = player.el();
        // videoelemapi.style.width = vidWidth/10 + "vw"
        // videoelemapi.style.heading = vidHeight + "px"
        videocontainer.style.width =  "min(" + vidWidth.toString() + "px, " + (vidWidth/20).toString() + "vw)"
        videocontainer.style.height = "min(" + vidHeight.toString() + "px, " + (vidHeight/20).toString() + "vw)"

        // videocontainer.style.aspectRatio = maxWidth > maxHeight ? maxWidth/maxHeight : maxHeight / maxWidth
        // videoelemapi.style.aspectRatio = maxWidth > maxHeight ? maxWidth/maxHeight : maxHeight / maxWidth

        // player.width(vidWidth)
        // player.height(vidHeight)
}

player.on('loadstart', function() {
    setTimeout(updateVid, 100)
    // if (loadingdata == true) {
        
    // } else {
        // loadingdata = true
    // }
    
        
})

const noassignments = document.getElementsByClassName('noassignments')[0]
const initialassignment = document.getElementById("initial")

let assignmentPage = document.getElementById("assignment")
let desc = document.getElementsByClassName("textdesc")[0]
let desctitle = document.getElementsByClassName("desctitle")[0]
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

        let i = n - removed

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

export function updateSubmission(assignment_id) {

    deleteSubmissionCards() // clearing all extra submission cards except initial

    fetch(`http://3.13.118.113:3000/submissions?id=${assignment_id}`).then(res => {
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
                    pdfpage = 1
                    const serverURL = data[i].submission_data.file

                    DisplayAttachment(data[i].submission_data.file) // displaying card attachment/media
                    

                    newCard.dataset.clicked = 1
                }

                addIfNew(desctitle, "hiddensection")
                
                //changing desc
                if (data[i].feedback == "") { // make note writing available
                    if (descriptionmodule) {
                        descriptionmodule.revealNote(data[i].id)
                        descriptionmodule.resetNote()
                    }
                    updateDesc(false, data[i].feedback, false, "")
                }
                else { //show already written notes
                    if (descriptionmodule) {
                        descriptionmodule.hideNote()
                    }
                    
                    updateDesc(false, data[i].feedback, false, "")
                    if (!desctitle.classList.contains('hiddensection')) {
                        desctitle.classList.add("hiddensection")
                    }
                    
                }
                
                
            }) // click event listeners
        }
    })
}

export function reloadAssignments() {
    fetch(`http://3.13.118.113:3000/assignments?id=${student_id}`).then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }).then(data => {
        if (data.length > 0) {


            addIfNew(noassignments, "hiddensection")
            removeIfNew(initialassignment, 'hiddensection')
            for (let j = 0; j < data.length; j++) { // looping through every JSON assignment
                
                var current = initialassignment

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

                const assignmentTypee = current.querySelector(".type .heading")

                // assignment button styling

                current.dataset.assignment_type = data[j].type
                
                assignmentTypee.textContent = data[j].type_given
                

                // assignmentbuttondelete
                const deletebtn = current.getElementsByClassName("datehighlight")[0]
                if (deletebtn) {
                    deletebtn.addEventListener("click", (e) => {
                        event.stopPropagation()

                        const details = {
                            'id' : data[j].id
                        }

                        fetch("http://3.13.118.113:3000/deleteAssignment", {
                            method: "POST",
                            headers: {
                                'Content-Type': "application/json"
                            },
                            body: JSON.stringify(details)
                        }).then(res => {
                            deleteAllAssignments()
                            reloadAssignments()
                        })

                    })
                }

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

export function updateDesc(title, descn, hide, titlen) {
    desc.innerHTML = descn
    if (title) {
        removeIfNew(desctitle, "hiddensection")
        desctitle.innerHTML = titlen
    }
    if (hide && descriptionmodule) {
        descriptionmodule.hideNote()
    }
    
}

function SetAssignmentPage(data, j) {
    if (descriptionmodule) {
        descriptionmodule.hideNote()
    }

    const details = data[j].details // details included in JSON

    // personalized description
    updateDesc(true, details.description, true, data[j].title)
    pdfpage = 1
    const serverURL = details.attachment

    // fetch()

    DisplayAttachment(details.attachment)
    
}

for (let i = 0; i < sections.length; i++) {
    if (sections[i]) {
        sections[i].addEventListener("click", (e) => {

            if (i != currentsection) {
    
                const pairedsectionid = (sections[i].id).slice(0, -3) // section (like assignments section) that we want to turn visible
                sections[i].classList.add("clicked")
                let pairedsection = document.getElementById(pairedsectionid)
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
    
                reloadAssignments()
            }
        })  
    }
}

// SIDEBAR

// SUBMISSION DROPPING


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



// pdf buttons
const forward = document.getElementById("forwardarrow")
const backward = document.getElementById("backwardarrow")

forward.addEventListener("click", (e) => {
    if (pdfpage + 1 <= maxpages) {
        pdfpage = pdfpage + 1
        renderPDF()
    }
    
})

backward.addEventListener("click", (e) => {
    if (pdfpage - 1 >= 1) {
        pdfpage = pdfpage - 1
        renderPDF()
    }
    
   
})



function checker() {
    setTimeout(checker, 50)
}

// checker()


document.addEventListener('DOMContentLoaded', function() {
    reloadAssignments()
 })
