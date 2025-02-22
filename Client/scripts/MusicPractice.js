import { removeIfNew, addIfNew, getLastPairedSection, getCurrentSection, setLastPairedSection, setCurrentSection } from "../scripts/home.js"

const sections = document.getElementsByClassName("section") // all sections
const mainPage = document.getElementById("practice")
console.log(mainPage)
const defaultUserId = 1
const exercisesdiv = document.getElementById("exercises")
const exercises = document.getElementsByClassName("exercise")

var startTime = null
var rightNotes = 0
var wrongNotes = 0

for (let i = 0; i < exercises.length; i++) {
    exercises[i].addEventListener("click", (e) => {


        sections[getCurrentSection()].classList.remove("clicked")
        addIfNew(getLastPairedSection(), "hiddensection")

        const openingPage = document.getElementById(exercises[i].dataset.page)
        removeIfNew(openingPage, "hiddensection")
        setCurrentSection(-1)
        
        setLastPairedSection(openingPage)
    })
}

//staff logic


const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;


const notechoices = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
const accidentals = ['#', 'b', null]

const div = document.getElementById("staff")

var chosenNote = "c/3"
var chosenAccidental = null

function renderSingle(n, m = null) {
    const svgElement1 = div.querySelector('svg');
    if (svgElement1) {
        svgElement1.remove()
    }

    const renderer = new Renderer(div, Renderer.Backends.SVG);

    renderer.resize(500, 500);
    const context = renderer.getContext();
    context.setFont('Arial', 10);
    var voice = new Voice({ num_beats: 4, beat_value: 4 });

    const notes = [
        // A quarter-note C.
        new StaveNote({ keys: ["b/4"], duration: "qr" }),
        (m == null ? new StaveNote({ 
            keys: [n], 
            duration: "q" 
        }) : new StaveNote({ 
            keys: [n], 
            duration: "q" 
        }).addModifier(new Accidental(m))),
        new StaveNote({ keys: ["b/4"], duration: "qr" }),
        new StaveNote({ keys: ["b/4"], duration: "qr" }),
    ];

    voice.addTickables(notes)
    new Formatter().joinVoices([voice]).format([voice], 310);

    const stave = new Stave(10, 40, 310);

    stave.addClef('treble').addTimeSignature('4/4');

    stave.setContext(context).draw();
    voice.draw(context, stave)

    const svgElement = div.querySelector('svg');
    const width = svgElement.getAttribute('width');
    const height = svgElement.getAttribute('height');
    svgElement.style.width = '60vw'
    svgElement.style.height = '60vw'
    svgElement.style.marginTop = "-3vw"
    svgElement.style.pointerEvents = 'none'
}

const notes = document.getElementsByClassName("notebutton")

function removeClass(cls, e) {
    e.classList.remove(cls)
}

function ChooseRandomNote() {

    const randomaddoni = 3 + Math.floor(Math.random() * 3)
    const randomnotei = Math.round(Math.random() * 6)

    const randomNote = notechoices[randomnotei] + "/" + (randomaddoni).toString()
    const modifieri = Math.round(Math.random() * 3) - 1
    const randommodifier = accidentals[modifieri]
    // console.log("should be 0 1 or 2: " + modifieri)
    // console.log("should be between 0 and 6: " + randomnotei)
    // console.log("should be 3 4 or 5: " + randomaddoni)
    return [randomNote, randommodifier]
}

const accidentaltable = {
    "f" : "b",
    "s" : "#",
    "n" : null
}

for (let i = 0; i < notes.length; i++) {
    notes[i].addEventListener("click", (e) => {

        const currentVal = notes[i].dataset.note
        const accidental1 = accidentaltable[currentVal[1]]

        if (currentVal[0] == chosenNote[0] && accidental1 == chosenAccidental) {
            notes[i].classList.add("correctchoice")
            setTimeout(removeClass, 100, "correctchoice", notes[i])
            const rand = ChooseRandomNote()
            chosenNote = rand[0]
            chosenAccidental = rand[1]

            console.log(chosenNote, chosenAccidental)
            renderSingle(chosenNote, chosenAccidental)
            rightNotes += 1
            
        }
        else {
            notes[i].classList.add("wrongchoice")
            wrongNotes += 1
            setTimeout(removeClass, 100, "wrongchoice", notes[i])
        }

    })
}
renderSingle(chosenNote)



document.addEventListener("DOMContentLoaded", () => {
    const targetElement = document.getElementById("noteidentifyingpage")
    const noteIdentifyingAccuracyE = document.querySelector("#noteidentifying .accuracycontainer .accuracynum")


    if (targetElement && mainPage) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    if (!(mainPage.classList.contains("hiddensection"))) { // revealing main page
                        

                        var totalwrong = 0
                        var totalright = 0
                        fetch(`http://3.13.118.113:3000/noteidentifying?id=${defaultUserId}`).then(res => {
                            return res.json()
                        }).then(data => {
                            for (let i = 0; i < data.length; i++) {
                                totalwrong += data[i].wrong_guesses
                                totalright += data[i].correct_guesses
                            }

                            const accuracy = Math.round(totalright/(totalwrong + totalright)*100)
                            noteIdentifyingAccuracyE.textContent = accuracy.toString() + "%"
                            
                            const accuracyLevels = ['bad', 'mid', 'good']

                            for (let i = 0; i < accuracyLevels.length; i++) {
                                if (noteIdentifyingAccuracyE.classList.contains(accuracyLevels[i] + "accuracy")) {
                                    noteIdentifyingAccuracyE.classList.remove(accuracyLevels[i] + "accuracy")
                                }
                            }

                            var accuracyLevel = ""
                            if (accuracy > 40) {
                                if (accuracy > 80) {
                                    accuracyLevel = "good"
                                }
                                else {
                                    accuracyLevel = "mid"
                                }
                            }
                            else {
                                accuracyLevel = "bad"
                            }

                            noteIdentifyingAccuracyE.classList.add(accuracyLevel + "accuracy")
                        })
                    }




                    if (targetElement.classList.contains("hiddensection")) {

                        if(rightNotes + wrongNotes > 0) {
                            const endTime = new Date()
                            const time = Math.floor((endTime - startTime)/1000)
                        
                            

                            const details = {
                                'startTime': startTime.toISOString(),
                                'endTime': endTime.toISOString(),
                                'user_id': defaultUserId,
                                'rightNotes': rightNotes,
                                'wrongNotes': wrongNotes,
                                'duration': time
                            }

                            console.log(details)

                            console.log("Class 'hidden' was added!");
                            fetch("http://3.13.118.113:3000/noteidentifying", {
                                method: "POST",
                                headers: {
                                    'Content-Type': "application/json"
                                },
                                body: JSON.stringify(details)
                            })

                            startTime = null
                            wrongNotes = 0
                            rightNotes = 0
                        }
                        
                    } else {
                        console.log("Class 'hidden' was removed!");
                        startTime = new Date()
                    }
                }
            });
        });

        const config = { attributes: true, attributeFilter: ["class"] }
        observer.observe(targetElement, config);
        observer.observe(mainPage, config)
    }
    
});