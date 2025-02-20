import { addIfNew, removeIfNew, updateDesc } from "/Client/scripts/home.js"

var desc = document.getElementById("description")
var descedit = document.getElementById("descriptionedit")
var feedbackinput = document.getElementById("feedbackinput")
var form = document.getElementById("descform")

var currentsubmission = 0;

export function revealNote(submission) {
    addIfNew(desc, "hiddensection")
    removeIfNew(descedit, "hiddensection")
    currentsubmission = submission
}

export function hideNote() {
    removeIfNew(desc, "hiddensection")
    addIfNew(descedit, "hiddensection")
}

export function resetNote() {
    form.reset()
}


form.addEventListener("submit", (e) => {
    e.preventDefault()
    var data = new FormData()

    var hello = JSON.stringify({
        'feedback' : feedbackinput.value,
        'submission_id' : currentsubmission
    })

    fetch("http://localhost:3000/feedback", {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: hello
    }).then(res => {
        updateDesc(false, feedbackinput.value, true, "")
        resetNote()
    })
})