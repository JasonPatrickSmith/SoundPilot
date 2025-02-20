import { updateSubmission } from '/Client/scripts/home.js'

let assignmentPage = document.getElementById("assignment")
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
                // console.log("File uploaded successfully:", data);
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