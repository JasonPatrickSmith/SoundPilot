import { reloadAssignments, deleteAllAssignments } from "./home.js"

var uploading = document.getElementById("assignmentuploading")
var PieceButton = document.getElementById("addAssignmentContainer")
var Form = document.getElementById("Pieceform")
var FormDiv = document.getElementById("newPieceForm")
var currentFile = null

var encompass = document.getElementById("formencompassing")
var downloadingimg = document.getElementById("assignmentuploadingimg")

function resetForm() {
    currentFile = null
    downloadingimg.src = "../imgs/download.png"
}

PieceButton.addEventListener("click", (e) => {
    encompass.classList.remove("hiddensection")
})

uploading.addEventListener("dragover", (e) => {
    uploading.classList.add("orangeuploader")
    e.preventDefault()
})

uploading.addEventListener("dragleave", (e) => {
    uploading.classList.remove("orangeuploader")
    e.preventDefault()
})

uploading.addEventListener('drop', (e) => {
    if (currentFile == null) {
        
        const file = e.dataTransfer.files[0];
        e.preventDefault()

        if (file.type == "application/pdf" || file.type == "video/mp4") {

            currentFile = file
            
            downloadingimg.src = "../imgs/file_downloaded.png"

            // setTimeout(resetForm, 1000)

        
        // try {
        //     e.preventDefault()
        //     fetch("http://localhost:3000/submission", {
        //         method: "POST",
        //         body: form,
        //     }).then(response => response.json())
        //     .then(data => {
        //         console.log("File uploaded successfully:", data);
        //         return data
        //     }).then(stuff => { // updatingsubmissions
        //         updateSubmission(assignmentPage.dataset.id)
        //     }) 
        // } catch(error) {
        //     console.error("Error uploading file:", error);
        // };
    
        }
    }
    

    uploading.classList.remove("orangeuploader")
})

encompass.addEventListener("click", (e) => {
    encompass.classList.add("hiddensection")
}) // close event

FormDiv.addEventListener("click", (e) => {
    e.stopPropagation();
})

Form.addEventListener("submit", (e) => {
    e.preventDefault();

    var formData = new FormData(Form)

    if (currentFile != null) {
        formData.append("file", currentFile)
    }

    Form.reset();
    resetForm();

    encompass.classList.add("hiddensection")

    fetch("http://3.13.118.113:3000/assign", {
        method: "POST",
        body: formData
    }).then(response => response.json())
    .then(data => {
        console.log("File uploaded successfully:", data);

        deleteAllAssignments()
        reloadAssignments()

        return data
    })
})