const tagColor = {
  Assassin: "#FF0069",
  Fighter: "#e74c3c",
  Mage: "#3498db",
  Marksman: "#f39c12",
  Support: "#27ae60",
  Tank: "#2c3e50",
};

const url = "https://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json";
const card = document.getElementById("card");
const btn = document.getElementById("btn");

let currentChampion = null; // To track currently displayed champion
let isCard1Shown = true; // To track which content is currently shown

let getChampionData = () => {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const champions = Object.values(data.data);
      const randomChampion = champions[Math.floor(Math.random() * champions.length)];
      generateChampionDetails(randomChampion);
    });
};

let generateChampionDetails = (champion) => {
  const championId = champion.id;
  const detailsUrl = `https://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion/${championId}.json`;

  fetch(detailsUrl)
    .then(response => response.json())
    .then(data => {
      const championDetails = data.data[championId];
      currentChampion = { champion, championDetails }; // Store current champion details

      // Display content of card2 directly
      card2(currentChampion.champion);

      // Add click event listener to toggle between card1 and card2 content
      card.addEventListener('click', toggleCardContent);
    });
};

let toggleCardContent = () => {
  if (isCard1Shown) {
    card1(currentChampion.champion, currentChampion.championDetails);
  } else {
    card2(currentChampion.champion);
  }
  card.classList.add('flip'); // Add flip animation class

  // Ensure flip class is removed after animation completes
  setTimeout(() => {
    card.classList.remove('flip');
  }, 600); // Adjust timing to match CSS animation duration

  isCard1Shown = !isCard1Shown; // Toggle state
};

let card1 = (champion, details) => {
  const imgSrc = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
  const blurb = details.blurb;
  const championName = champion.name;
  const championTitle = champion.title;

  card.innerHTML = `
    <img src="${imgSrc}" style="width: 100%; height: auto;" />
    <h2>${championName}</h2>
    <h3>${championTitle}</h3>
    <div class="blurb">
      <p>${blurb}</p>
    </div>
  `;
  styleCard(tagColor[champion.tags[0]]); // Apply card styling
};

let card2 = (data) => {
  const imgSrc = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${data.id}_0.jpg`;
  const championName = data.name;
  const championTitle = data.title;
  const championTags = data.tags;
  const championPartype = data.partype;

  const hp = data.stats.hp;
  const armor = data.stats.armor;
  const spellblock = data.stats.spellblock;

  const themeColor = tagColor[championTags[0]];

  card.innerHTML = `
    <p class="hp">
      <span>${championPartype}</span>
    </p>
    <img src="${imgSrc}" />
    <h2 class="champion-name">${championName}</h2>
    <h3 class="champion-title">${championTitle}</h3>
    <div class="types">
      
    </div>
    <div class="stats">
      <div>
        <h3>${hp}</h3>
        <p>HP</p>
      </div>
      <div>
        <h3>${armor}</h3>
        <p>Armor</p>
      </div>
      <div>
        <h3>${spellblock}</h3>
        <p>MR</p>
      </div>
    </div>
  `;
  appendTags(championTags);
  styleCard(themeColor);
};

let appendTags = (tags) => {
  const typesDiv = card.querySelector(".types");
  typesDiv.innerHTML = ""; // Clear existing tags
  tags.forEach((tag) => {
    let span = document.createElement("SPAN");
    span.textContent = tag;
    typesDiv.appendChild(span);
  });
};

let styleCard = (color) => {
  card.style.background = `radial-gradient(circle at 50% 0%, ${color} 36%, #ffffff 36%)`;
  card.querySelectorAll(".types span").forEach((typeColor) => {
    typeColor.style.backgroundColor = color;
  });
};

btn.addEventListener("click", getChampionData);
window.addEventListener("load", getChampionData);
