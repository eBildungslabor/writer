export default async function (word) {
    let content = await get(word);
    return parseContent(content);
}

async function get(word) {
    if (word.length === 0) {
        return [];
    }
    var url = new URL("https://de.wiktionary.org/w/api.php"),
        params = {
            format: "json",
            origin: "*",

            'action': "query",
            prop: "revisions",
            rvprop: "content",

            titles: word
        }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    let response = await fetch(url);
    response = await response.json();

    let pages = response.query.pages;
    let content;

    //let content = res.query.pages["46018"].revisions[0]["*"];
    // always only single prop of importance
    for (let [key, value] of Object.entries(pages)) {
        //console.log(key, value)
        if (key === "-1") {
            return [];
        }
        content = value.revisions[0]["*"];
    }

    content = content.split("\n");

    return content;
}


function parseContent(content) {
    let cutIndex = -1;
    for (let i in content) {
        let line = content[i];

        line = line.replace(/{{/g, "")
        line = line.replace(/\]\]/g, "")
        line = line.replace(/\[\[/g, "")
        line = line.replace(/}}/g, "")
        line = line.replace(/\[\d+[a-z]*\]/g, "")
        //line = line.replace(/=== /g, "->")
        line = line.replace(/: /g, "    ")
        line = line.replace(/''/g, "'")
        line = line.replace(/^\|/g, "    ")
        line = line.replace(/^:/g, "    ")

        content[i] = line;
    }

    removeParts(content)

    return content;
}

let headings = [
    "Übersetzungen",
    "Quellen",
    "Aussprache",
    "Referenzen",
    "Siehe auch",
    "Übersicht",
    "Worttrennung",
    "Wort der Woche",
    "Wortkombinationen",
    "Navigationsleiste",
    "Wortbildungen",
    "Herkunft",
    "Namensvarianten",
    "Bekannte Namensträger",
    "Wortart",
    "Deutsch) ==",
    "Abkürzungen",
    //"Alternative Schreibweisen"
]
function removeParts(content) {
    console.log("removeparts")
    console.dir(Array.from(content))

    for (let i = 0 ; i<content.length ; i++) {
        let line = content[i];
        console.log("currentline" + i +" "+ line)

        
        if (
            /^[a-z]/i.test(line) ||
            /==== Übersetzungen ====/.test(line) ||
            /Wort der Woche/.test(line) ||
            /=== Wortart/.test(line) ||
            /\|Deutsch\) ==/.test(line)

        ) {
            console.log("isheading true" + line)

            for (let heading of headings) {
                if (line === undefined) break;
                if (line.includes(heading)) {
                    console.log("heading" + heading)
                    console.log(line)
                    content.splice(i, 1);
                    line = content[i];
                    
                    while (!/^[a-z]/i.test(line)) {
                        content.splice(i, 1);
                        line = content[i];
                        console.dir(i)
                        console.dir(Array.from(content))
                    }
                    i--;
                    break;
               }
            }

            console.dir(Array.from(content))


        }





    }














    console.log(content.join("\n"))

    //console.dir(content)

    
}

