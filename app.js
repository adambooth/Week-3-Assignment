// https://cookie-upgrade-api.vercel.app/api/upgrades

const cookie = document.getElementById("cookieImg");
const moneyContainer = document.getElementById("money-holder");
const middleContainer = document.getElementById("middle-container");
const clickPowerContainer = document.getElementById("click-power-container");
const autoPowerContainer = document.getElementById("auto-power-container");
const rightContainer = document.getElementById("right-container");

let currentMoney = 0;
let clickPower = 1;
let autoPowerPerSecond = 0;

cookie.addEventListener("click", function () {
  currentMoney = currentMoney + clickPower;
  moneyContainer.textContent = `Cookies : ${currentMoney}`;
});

function updateStats() {
  moneyContainer.textContent = `Cookies : ${currentMoney}`;
  clickPowerContainer.innerHTML = `Click Power : ${clickPower}`;
  autoPowerContainer.innerHTML = `Auto Power Per Second : ${autoPowerPerSecond}`;
}

updateStats();

async function getCookieAPI() {
  const cookieAPI = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );

  const cookieAPIData = await cookieAPI.json();

  return cookieAPIData;
}

async function getCookieUpgrade() {
  const cookieUpgrades = await getCookieAPI();
  console.log(cookieUpgrades);
  createUpgrade(cookieUpgrades, 0);
  createUpgrade(cookieUpgrades, 1);
}

getCookieUpgrade();

function createUpgrade(upgradeData, upgradeNumber) {
  const upgradesArray = upgradeData;

  const upgrade = upgradesArray[upgradeNumber];

  const upgradeSection = document.createElement("section");
  upgradeSection.id = `${upgrade.id}`;

  const upgradeImgDiv = document.createElement("div");
  upgradeImgDiv.id = "upgrade-img";

  const cursorImg = document.createElement("img");
  cursorImg.id = "cursorImg";
  cursorImg.src = "./media/images/cursor.png";
  cursorImg.alt = "a cartoon cursor picture";
  upgradeImgDiv.appendChild(cursorImg);

  const upgradeTitleDiv = document.createElement("div");
  upgradeTitleDiv.id = "upgrade-title";
  const titleParagraph = document.createElement("p");
  titleParagraph.textContent = `${upgrade.name}`;
  upgradeTitleDiv.appendChild(titleParagraph);

  const upgradeIncreaseDiv = document.createElement("div");
  upgradeIncreaseDiv.id = "upgrade-increase";
  const increaseParagraph = document.createElement("p");
  increaseParagraph.textContent = `+ ${upgrade.increase} CPS`;
  upgradeIncreaseDiv.appendChild(increaseParagraph);

  const upgradeCostDiv = document.createElement("div");
  upgradeCostDiv.id = "upgrade-cost";
  const costParagraph = document.createElement("p");
  costParagraph.textContent = `${upgrade.cost}`;
  upgradeCostDiv.appendChild(costParagraph);

  upgradeSection.appendChild(upgradeImgDiv);
  upgradeSection.appendChild(upgradeTitleDiv);
  upgradeTitleDiv.appendChild(upgradeIncreaseDiv);
  upgradeSection.appendChild(upgradeCostDiv);

  rightContainer.appendChild(upgradeSection);

  upgradeSection.addEventListener("click", function () {
    console.log(`${upgrade.name} clicked`);
    if (currentMoney >= upgrade.cost) {
      currentMoney = currentMoney - upgrade.cost;
      clickPower = clickPower + upgrade.increase;
      updateStats();
      upgrade.cost = Math.floor(upgrade.cost * 1.15);
      costParagraph.textContent = upgrade.cost;
    }
  });
}

function startAutoPower() {
  setInterval(function () {
    currentMoney = currentMoney + autoPowerPerSecond;
    updateStats();
  }, 1000);
}

startAutoPower();
