document.addEventListener('DOMContentLoaded', () => populatePage());
async function fetchJSON() { //Load all the JSON data and return after it's all loaded
    var r = await fetch('songs.json'); var data = await r.json(); return data;
}
let songs
async function populatePage() {
    let data = await fetchJSON(); //Wait for all the JSON data to load from this function before we do anything else
    if (data) console.log('JSON song data loaded');
    songs = JSON.parse(JSON.stringify(data.songs))
}

document.onkeyup = enter;
function enter(e) { Check(); }

const Check = () => {

    let charString = document.getElementById("charInput").value
    charString = charString.toLowerCase().replace(/\W/g, '');

    let matches = []

    for (let i = 0; i < songs.length; i++) {
        let word = songs[i];
        var letterCount = 0
        var wordCopy = word.split("(")[0].toLowerCase().replace(/\W/g, '');
        var wordLength = wordCopy.length
        if (charString.length < wordCopy.length) continue
        for (let j = 0; j < charString.length; j++) {
            if (wordCopy.includes(charString[j])) {
                letterCount++
                let letterPos = wordCopy.indexOf(charString[j])
                wordCopy = wordCopy.slice(0, letterPos).concat(wordCopy.slice(letterPos + 1))
            }
        }
        if (letterCount == wordLength) matches.push(word)
    }

    document.getElementById("resultsHolder").classList.remove("hidden")

    document.getElementById("resultsText").innerHTML = "You can make:"
    if (matches.length == 0) document.getElementById("results").innerHTML = "<div class='result'>Nothing 😭</div>"
    else {
        document.getElementById("results").innerHTML = ""
        for (let i = 0; i < matches.length; i++) {
            let result = document.createElement("div")
            result.classList.add('result')
            let removeButton = document.createElement("button")
            removeButton.id = i
            removeButton.classList.add("removeButton")
            let resultText = document.createElement("div")
            resultText.innerHTML += matches[i]
            result.appendChild(removeButton)
            result.appendChild(resultText)
            document.getElementById("results").appendChild(result)

            document.getElementById(i).addEventListener("click", (e) => { Remove(matches[i].split('(')[0].toLowerCase()) })
        }
    }

    if (document.getElementById("charInput").value == "") {
        document.getElementById("resultsHolder").classList.add("hidden")
    }
}

const Remove = (str) => {
    if (!confirm("Remove the letters " + str + "?")) return

    let charString = document.getElementById("charInput").value.toLowerCase()
    for (let i = 0; i < str.length; i++) {
        if (charString.includes(str[i])) {
            let letterPos = charString.indexOf(str[i])
            charString = charString.slice(0, letterPos).concat(charString.slice(letterPos + 1))
        }
    }
    document.getElementById("charInput").value = charString
    Check()
}