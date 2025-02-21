import { removeIfNew, addIfNew, getLastPairedSection, getCurrentSection, setLastPairedSection, setCurrentSection } from "/Client/scripts/home.js"

const sections = document.getElementsByClassName("section") // all sections
const mainPage = document.getElementById("practice")

const exercisesdiv = document.getElementById("exercises")
const exercises = document.getElementsByClassName("exercise")

for (let i = 0; i < exercises.length; i++) {
    exercises[i].addEventListener("click", (e) => {

        console.log(exercises)

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
    
        // // A quarter-note D.
        // new StaveNote({ keys: ["d/4"], duration: "q" }),
    
        // // A quarter-note rest. Note that the key (b/4) specifies the vertical
        // // position of the rest.
        // new StaveNote({ keys: ["b/4"], duration: "qr" }),
    
        // // A C-Major chord.
        // new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
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
    const randomNote = notechoices[Math.round(Math.random() * 7) - 1] + "/" + (3 + Math.floor(Math.random() * 3)).toString()
    const randommodifier = accidentals[Math.round(Math.random() * 3) - 1]
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
            const rand = ChooseRandomNote()
            chosenNote = rand[0]
            chosenAccidental = rand[1]

            renderSingle(chosenNote, chosenAccidental)

            notes[i].classList.add("correctchoice")
            setTimeout(removeClass, 100, "correctchoice", notes[i])
        }
        else {
            notes[i].classList.add("wrongchoice")
            setTimeout(removeClass, 100, "wrongchoice", notes[i])
        }

    })
}
renderSingle(chosenNote)
// setTimeout(renderSingle, 1000, "c/5")
// setTimeout(renderSingle, 2000, "d/5")
// setTimeout(renderSingle, 3000, "e/5")
// setTimeout(renderSingle, 4000, "f/4")
// setTimeout(renderSingle, 5000, "g/4")
// setTimeout(renderSingle, 6000, "a/4")