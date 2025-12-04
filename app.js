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

let upgradeLvls = {
  upgrade1: 0,
  upgrade2: 0,
  upgrade3: 0,
  upgrade4: 0,
  upgrade5: 0,
  upgrade6: 0,
  upgrade7: 0,
  upgrade8: 0,
  upgrade9: 0,
  upgrade10: 0,
};

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

async function getCookieUpgrade(number) {
  const cookieUpgrades = await getCookieAPI();
  console.log(cookieUpgrades);
  createUpgrade(cookieUpgrades, number);
}

getCookieUpgrade(0);
getCookieUpgrade(1);

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
  const clickIncreaseParagrapgh = document.createElement("p");
  const autoIncreaseParagrapgh = document.createElement("p");
  if (upgrade.id === 1) {
    clickIncreaseParagrapgh.textContent = `+ ${upgrade.increase} CPS`;
    upgradeIncreaseDiv.appendChild(clickIncreaseParagrapgh);
  } else {
    autoIncreaseParagrapgh.textContent = `+ ${upgrade.increase} APS`;
    upgradeIncreaseDiv.appendChild(autoIncreaseParagrapgh);
  }

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
    if (upgrade.id === 1) {
      if (currentMoney >= upgrade.cost) {
        currentMoney = currentMoney - upgrade.cost;
        clickPower = clickPower + upgrade.increase;
        upgradeLvls[`upgrade${upgrade.id}`] += 1;
        updateStats();
        upgrade.cost = Math.floor(upgrade.cost * 1.15);
        upgrade.increase = Math.floor(upgrade.increase * 2);
        clickIncreaseParagrapgh.textContent = `+ ${upgrade.increase} CPS`;
        costParagraph.textContent = upgrade.cost;
      }
    } else {
      if (currentMoney >= upgrade.cost) {
        currentMoney = currentMoney - upgrade.cost;
        autoPowerPerSecond = autoPowerPerSecond + upgrade.increase;
        const ownsNextUpgrade = upgradeLvls[`upgrade${upgrade.id}`];
        upgradeLvls[`upgrade${upgrade.id}`] += 1;
        const nextUpgrade = upgrade.id;
        if (ownsNextUpgrade === 0 && nextUpgrade < 10) {
          getCookieUpgrade(nextUpgrade);
        }
        updateStats();
        upgrade.cost = Math.floor(upgrade.cost * 1.15);
        upgrade.increase = Math.floor(upgrade.increase * 2);
        autoIncreaseParagrapgh.textContent = `+ ${upgrade.increase} APS`;
        costParagraph.textContent = upgrade.cost;
      }
    }
  });
}

function startAutoPower() {
  setInterval(function () {
    currentMoney = currentMoney + autoPowerPerSecond;
    updateStats();
    localStorage.setItem(
      "StoredData",
      JSON.stringify({ colour: newColour, text: newText })
    ); // applies the change of colour to the local storage object
    const updatedPreferences = JSON.parse(localStorage.getItem("StoredData")); // gets a fresh variable with the fresh storage values
    pTag.textContent = updatedPreferences.text;
  }, 1000);
}

startAutoPower();

//===============================================Local Storage===============================================

if (!localStorage.getItem("StoredData")) {
  localStorage.setItem(
    "StoredData",
    JSON.stringify({
      currentMoney: 0,
      clickPower: 1,
      autoPowerPerSecond: 0,
      upgradeLvls: {
        upgrade1: 0,
        upgrade2: 0,
        upgrade3: 0,
        upgrade4: 0,
        upgrade5: 0,
        upgrade6: 0,
        upgrade7: 0,
        upgrade8: 0,
        upgrade9: 0,
        upgrade10: 0,
      },
    })
  );
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("StoredData"));

  if (data) {
    currentMoney = data.currentMoney;
    clickPower = data.clickPower;
    autoPowerPerSecond = data.autoPowerPerSecond;

    upgradeLvls = {
      upgrade1: data.upgradeLvls.upgrade1,
      upgrade2: data.upgradeLvls.upgrade2,
      upgrade3: data.upgradeLvls.upgrade3,
      upgrade4: data.upgradeLvls.upgrade4,
      upgrade5: data.upgradeLvls.upgrade5,
      upgrade6: data.upgradeLvls.upgrade6,
      upgrade7: data.upgradeLvls.upgrade7,
      upgrade8: data.upgradeLvls.upgrade8,
      upgrade9: data.upgradeLvls.upgrade9,
      upgrade10: data.upgradeLvls.upgrade10,
    };
  }
}
