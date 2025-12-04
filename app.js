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
  console.log(currentMoney);
  moneyContainer.textContent = `Cookies : ${currentMoney}`;
});

function updateStats() {
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
  createUpgrade(cookieUpgrades);
}

getCookieUpgrade();

function createUpgrade(upgradeData) {
  const upgradesArray = upgradeData;
  console.log(upgradesArray);
  for (let i = 0; i < upgradesArray.length; i++) {
    const upgradeSection = document.createElement("section");
    upgradeSection.id = `${upgradesArray[i].id}`;
    const upgradeImgDiv = document.createElement("div");
    upgradeImgDiv.id = "upgrade-img";
    const cursorImg = document.createElement("img");
    cursorImg.id = "cursorImg";
    cursorImg.src = "./media/images/cursor.png";
    cursorImg.alt = "a cartoon cursor picture";
    upgradeImgDiv.appendChild(cursorImg);
    const upgradeTitleDiv = document.createElement("div");
    upgradeTitleDiv.id = "upgrade-title";
    const titlePara = document.createElement("p");
    titlePara.textContent = `${upgradesArray[i].name}`;
    upgradeTitleDiv.appendChild(titlePara);
    const upgradeCostDiv = document.createElement("div");
    upgradeCostDiv.id = "upgrade-cost";
    const costPara = document.createElement("p");
    costPara.textContent = `${upgradesArray[i].cost}`;
    upgradeCostDiv.appendChild(costPara);
    upgradeSection.appendChild(upgradeImgDiv);
    upgradeSection.appendChild(upgradeTitleDiv);
    upgradeSection.appendChild(upgradeCostDiv);
    rightContainer.appendChild(upgradeSection);

    upgradeSection.addEventListener("click", function () {
      console.log(`${upgradesArray[i].name} clicked`);
    });
  }
}
