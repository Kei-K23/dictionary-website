const wordLists = document.querySelector("#word-list");
const search = document.getElementById("search");

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

async function fetchDataFromEndPoint(url, word) {
  try {
    const request = await fetch(url + word);
    const data = await request.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

search.addEventListener("input", (e) => {
  const word = e.target.value;
  if (word === "") {
    wordLists.innerHTML = "";
  }

  fetchDataFromEndPoint(url, word).then((data) => {
    wordLists.innerHTML = "";
    const meaning = data[0];
    const phoneticsArray = meaning.phonetics.filter((phonetic) => {
      return phonetic.text !== "" && phonetic.audio !== "";
    });

    wordLists.innerHTML = `
    <li class="p-4">
      <h2 class="text-4xl mb-2 font-bold">${meaning.word}</h2>
      <div class="flex items-center gap-4 mb-4">
      ${phoneticsArray
        .map(
          (phonetic) => `
                <div class="flex items-center">
                <h3 class="text-lg text-slate-700">
                (${phonetic.audio.includes("uk") ? "UK" : "USA"})
                </h3>
                <h3 class="text-lg text-slate-700">${phonetic.text}</h3>
                <audio>
                <source src="${phonetic.audio}" type="audio/mpeg" />
                </audio>
                <i
                class="fa-solid fa-volume-high playAudio cursor-pointer text-xl"
              ></i>
            </div>
            `
        )
        .join(" ")}
        </div>
        <p class="text-lg mt-4">
          ${meaning.meanings[0].definitions[0].definition}
        </p>
            ${meaning.meanings
              .map(
                (meaning) =>
                  `
              <h3 class="text-xl my-4 uppercase">${meaning.partOfSpeech}</h3>
              <ul>
                ${meaning.definitions
                  .map(
                    (def) =>
                      `
                    <li class="mb-8 border-b border-b-black">
                      <p class="text-lg mb-2">
                        Definition:  ${def.definition}
                      </p>
                      <p class="text-lg mb-4">
                        Example: ${!def.example ? "no example" : def.example}
                      </p>
                    </li>
                  `
                  )
                  .join(" ")}
              </ul>
              `
              )
              .join(" ")}
            </li>
              `;

    const playAudios = document.querySelectorAll(".playAudio");
    playAudios.forEach((playAudio) => {
      playAudio.addEventListener("click", (e) => {
        const parentEle = e.target.parentNode;
        const audio = parentEle.querySelector("audio");
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      });
    });
  });
});
