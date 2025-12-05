// https://cookie-upgrade-api.vercel.app/api/upgrades

const cookie = document.getElementById("cookieImg");
const moneyContainer = document.getElementById("money-holder");
const middleContainer = document.getElementById("middle-container");
const clickPowerContainer = document.getElementById("click-power-container");
const autoPowerContainer = document.getElementById("auto-power-container");
const rightContainer = document.getElementById("right-container");

const audioComponent = document.getElementById("audio-component");

//localStorage.clear();

let currentMoney = 0;
let clickPower = 1;
let autoPowerPerSecond = 0;
let first100CookiesComplete = 0;
let first1000CookiesComplete = 0;
let volumeAmount = 50;

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

let upgradeCosts = {
  upgrade1: 100,
  upgrade2: 500,
  upgrade3: 1000,
  upgrade4: 2000,
  upgrade5: 5000,
  upgrade6: 10000,
  upgrade7: 20000,
  upgrade8: 50000,
  upgrade9: 100000,
  upgrade10: 200000,
};

let upgradeIncreaseAmounts = {
  upgrade1: 1,
  upgrade2: 5,
  upgrade3: 10,
  upgrade4: 20,
  upgrade5: 50,
  upgrade6: 100,
  upgrade7: 200,
  upgrade8: 500,
  upgrade9: 1000,
  upgrade10: 2000,
};

cookie.addEventListener("click", function () {
  currentMoney = currentMoney + clickPower;
  moneyContainer.textContent = `Cookies : ${currentMoney}`;
  audioComponent.playbackRate = 5;
  audioComponent.play();
});

function updateStats() {
  moneyContainer.textContent = `Cookies : ${currentMoney}`;
  clickPowerContainer.innerHTML = `Cookie Power : ${clickPower}`;
  autoPowerContainer.innerHTML = `Auto Cookies Per Second : ${autoPowerPerSecond}`;
}

loadData();
updateStats();
getCookieUpgrade(0);
getCookieUpgrade(1);
loadUpgrades();

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

function createUpgrade(upgradeData, upgradeNumber) {
  const upgradesArray = upgradeData;
  const upgrade = upgradesArray[upgradeNumber];
  upgrade.increase = upgradeIncreaseAmounts[`upgrade${upgrade.id}`];
  upgrade.cost = upgradeCosts[`upgrade${upgrade.id}`];

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

  const upgradeLvlDiv = document.createElement("div");
  upgradeLvlDiv.id = "upgrade-title";
  const lvlParagraph = document.createElement("p");
  lvlParagraph.textContent = "Lvl : " + upgradeLvls[`upgrade${upgrade.id}`];
  upgradeLvlDiv.appendChild(lvlParagraph);

  const upgradeIncreaseDiv = document.createElement("div");
  upgradeIncreaseDiv.id = "upgrade-increase";
  const clickIncreaseParagrapgh = document.createElement("p");
  const autoIncreaseParagrapgh = document.createElement("p");
  const currentIncrease = upgradeIncreaseAmounts[`upgrade${upgrade.id}`];
  if (upgrade.id === 1) {
    clickIncreaseParagrapgh.textContent = `+ ${currentIncrease} CPS`;
    upgradeIncreaseDiv.appendChild(clickIncreaseParagrapgh);
  } else {
    autoIncreaseParagrapgh.textContent = `+ ${currentIncrease} APS`;
    upgradeIncreaseDiv.appendChild(autoIncreaseParagrapgh);
  }

  const upgradeCostDiv = document.createElement("div");
  upgradeCostDiv.id = "upgrade-cost";
  const costParagraph = document.createElement("p");
  const currentCost = upgradeCosts[`upgrade${upgrade.id}`];
  costParagraph.textContent = currentCost;
  upgradeCostDiv.appendChild(costParagraph);

  upgradeSection.appendChild(upgradeImgDiv);
  upgradeSection.appendChild(upgradeTitleDiv);
  upgradeTitleDiv.appendChild(upgradeIncreaseDiv);
  upgradeTitleDiv.appendChild(upgradeLvlDiv);
  upgradeSection.appendChild(upgradeCostDiv);

  rightContainer.appendChild(upgradeSection);

  upgradeSection.addEventListener("click", function () {
    if (upgrade.id === 1) {
      if (currentMoney >= upgrade.cost) {
        currentMoney = currentMoney - upgrade.cost;
        clickPower = clickPower + upgrade.increase;
        audioComponent.playbackRate = 1;
        audioComponent.play();
        upgradeLvls[`upgrade${upgrade.id}`] += 1;
        updateStats();
        upgrade.cost = Math.floor(upgrade.cost * 1.15);
        upgradeCosts[`upgrade${upgrade.id}`] = upgrade.cost;
        upgrade.increase = Math.floor(upgrade.increase * 2);
        upgradeIncreaseAmounts[`upgrade${upgrade.id}`] = upgrade.increase;
        clickIncreaseParagrapgh.textContent = `+ ${upgrade.increase} CPS`;
        lvlParagraph.textContent =
          "Lvl : " + upgradeLvls[`upgrade${upgrade.id}`];
        costParagraph.textContent = upgrade.cost;
      } else if (currentMoney < upgrade.cost) {
        InsufficientMoneyFunc();
      }
    } else {
      if (currentMoney >= upgrade.cost) {
        currentMoney = currentMoney - upgrade.cost;
        autoPowerPerSecond = autoPowerPerSecond + upgrade.increase;
        audioComponent.playbackRate = 1;
        audioComponent.play();
        const ownsNextUpgrade = upgradeLvls[`upgrade${upgrade.id}`];
        upgradeLvls[`upgrade${upgrade.id}`] += 1;
        const nextUpgrade = upgrade.id;
        if (ownsNextUpgrade === 0 && nextUpgrade < 10) {
          getCookieUpgrade(nextUpgrade);
        }
        updateStats();
        upgrade.cost = Math.floor(upgrade.cost * 1.15);
        upgradeCosts[`upgrade${upgrade.id}`] = upgrade.cost;
        upgrade.increase = Math.floor(upgrade.increase * 2);
        upgradeIncreaseAmounts[`upgrade${upgrade.id}`] = upgrade.increase;
        autoIncreaseParagrapgh.textContent = `+ ${upgrade.increase} APS`;
        lvlParagraph.textContent =
          "Lvl : " + upgradeLvls[`upgrade${upgrade.id}`];
        costParagraph.textContent = upgrade.cost;
      } else if (currentMoney < upgrade.cost) {
        InsufficientMoneyFunc();
      }
    }
  });
}

function startAutoPower() {
  setInterval(function () {
    if (first100CookiesComplete === 0 && currentMoney >= 100) {
      first100CookiesComplete = 1;
      first100Cookies();
    }
    if (first1000CookiesComplete === 0 && currentMoney >= 1000) {
      first1000CookiesComplete = 1;
      first1000Cookies();
    }
    currentMoney = currentMoney + autoPowerPerSecond;
    updateStats();
    localStorage.setItem(
      "StoredData",
      JSON.stringify({
        currentMoney,
        clickPower,
        autoPowerPerSecond,
        first100CookiesComplete,
        first1000CookiesComplete,
        upgradeLvls,
        upgradeCosts,
        upgradeIncreaseAmounts,
      })
    );
  }, 1500);
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
      first100CookiesComplete,
      first1000CookiesComplete,
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
      upgradeCosts: {
        upgrade1: 100,
        upgrade2: 500,
        upgrade3: 1000,
        upgrade4: 2000,
        upgrade5: 5000,
        upgrade6: 10000,
        upgrade7: 20000,
        upgrade8: 50000,
        upgrade9: 100000,
        upgrade10: 200000,
      },
      upgradeIncreaseAmounts: {
        upgrade1: 1,
        upgrade2: 5,
        upgrade3: 10,
        upgrade4: 20,
        upgrade5: 50,
        upgrade6: 100,
        upgrade7: 200,
        upgrade8: 500,
        upgrade9: 1000,
        upgrade10: 2000,
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
    first100CookiesComplete = data.first100CookiesComplete;
    first1000CookiesComplete = data.first1000CookiesComplete;

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

    upgradeCosts = {
      upgrade1: data.upgradeCosts.upgrade1,
      upgrade2: data.upgradeCosts.upgrade2,
      upgrade3: data.upgradeCosts.upgrade3,
      upgrade4: data.upgradeCosts.upgrade4,
      upgrade5: data.upgradeCosts.upgrade5,
      upgrade6: data.upgradeCosts.upgrade6,
      upgrade7: data.upgradeCosts.upgrade7,
      upgrade8: data.upgradeCosts.upgrade8,
      upgrade9: data.upgradeCosts.upgrade9,
      upgrade10: data.upgradeCosts.upgrade10,
    };

    upgradeIncreaseAmounts = {
      upgrade1: data.upgradeIncreaseAmounts.upgrade1,
      upgrade2: data.upgradeIncreaseAmounts.upgrade2,
      upgrade3: data.upgradeIncreaseAmounts.upgrade3,
      upgrade4: data.upgradeIncreaseAmounts.upgrade4,
      upgrade5: data.upgradeIncreaseAmounts.upgrade5,
      upgrade6: data.upgradeIncreaseAmounts.upgrade6,
      upgrade7: data.upgradeIncreaseAmounts.upgrade7,
      upgrade8: data.upgradeIncreaseAmounts.upgrade8,
      upgrade9: data.upgradeIncreaseAmounts.upgrade9,
      upgrade10: data.upgradeIncreaseAmounts.upgrade10,
    };
  }
}

async function loadUpgrades() {
  const data = JSON.parse(localStorage.getItem("StoredData"));
  if (data.upgradeLvls.upgrade2 > 0) {
    const cookieUpgrades = await getCookieAPI();
    createUpgrade(cookieUpgrades, 2);
  }

  if (data.upgradeLvls.upgrade3 > 0) {
    const cookieUpgrades = await getCookieAPI();
    createUpgrade(cookieUpgrades, 3);
  }

  if (data.upgradeLvls.upgrade4 > 0) {
    const cookieUpgrades = await getCookieAPI();
    createUpgrade(cookieUpgrades, 4);
  }

  if (data.upgradeLvls.upgrade5 > 0) {
    const cookieUpgrades = await getCookieAPI();
    createUpgrade(cookieUpgrades, 5);
  }

  if (data.upgradeLvls.upgrade6 > 0) {
    const cookieUpgrades = await getCookieAPI();
    createUpgrade(cookieUpgrades, 6);
  }

  if (data.upgradeLvls.upgrade7 > 0) {
    const cookieUpgrades = await getCookieAPI();
    createUpgrade(cookieUpgrades, 7);
  }

  if (data.upgradeLvls.upgrade8 > 0) {
    const cookieUpgrades = await getCookieAPI();
    createUpgrade(cookieUpgrades, 8);
  }

  if (data.upgradeLvls.upgrade9 > 0) {
    const cookieUpgrades = await getCookieAPI();
    createUpgrade(cookieUpgrades, 9);
  }

  if (data.upgradeLvls.upgrade10 > 0) {
    const cookieUpgrades = await getCookieAPI();
    createUpgrade(cookieUpgrades, 10);
  }
}

//===============================================Error/Insufficient Money===============================================

function InsufficientMoneyFunc() {
  const InsufficientMoney = document.createElement("section");
  InsufficientMoney.id = "InsufficientMoneyContainer";

  const upgradeImgDiv = document.createElement("div");
  upgradeImgDiv.id = "upgrade-img";

  const cursorImg = document.createElement("img");
  cursorImg.id = "cursorImg";
  cursorImg.src = "./media/images/redCross.png";
  cursorImg.alt = "a cartoon cursor picture";
  upgradeImgDiv.appendChild(cursorImg);

  const upgradeLvlDiv = document.createElement("div");
  upgradeLvlDiv.id = "upgrade-title";
  const lvlParagraph = document.createElement("p");
  lvlParagraph.textContent = "Lvl : ";
  upgradeLvlDiv.appendChild(lvlParagraph);

  const upgradeCostDiv = document.createElement("div");
  upgradeCostDiv.id = "upgrade-cost";
  const costParagraph = document.createElement("p");
  const currentCost = "Insufficient Cookies";
  costParagraph.textContent = currentCost;
  upgradeCostDiv.appendChild(costParagraph);

  InsufficientMoney.appendChild(upgradeImgDiv);
  InsufficientMoney.appendChild(upgradeCostDiv);

  middleContainer.appendChild(InsufficientMoney);
  setInterval(function () {
    InsufficientMoney.remove();
  }, 1000);
}

//===============================================Achievements===============================================

function first100Cookies() {
  const first100CookiesSection = document.createElement("section");
  first100CookiesSection.id = "InsufficientMoneyContainer";

  const upgradeImgDiv = document.createElement("div");
  upgradeImgDiv.id = "upgrade-img";

  const cursorImg = document.createElement("img");
  cursorImg.id = "cursorImg";
  cursorImg.src = "./media/images/greenTick.png";
  cursorImg.alt = "a cartoon cursor picture";
  upgradeImgDiv.appendChild(cursorImg);

  const upgradeLvlDiv = document.createElement("div");
  upgradeLvlDiv.id = "upgrade-title";
  const lvlParagraph = document.createElement("p");
  lvlParagraph.textContent = "Lvl : ";
  upgradeLvlDiv.appendChild(lvlParagraph);

  const upgradeCostDiv = document.createElement("div");
  upgradeCostDiv.id = "upgrade-cost";
  const costParagraph = document.createElement("p");
  const currentCost = "First 100 Cookies";
  costParagraph.textContent = currentCost;
  upgradeCostDiv.appendChild(costParagraph);

  first100CookiesSection.appendChild(upgradeImgDiv);
  first100CookiesSection.appendChild(upgradeCostDiv);

  middleContainer.appendChild(first100CookiesSection);
  setInterval(function () {
    first100CookiesSection.remove();
  }, 2000);
}

function first1000Cookies() {
  const first1000CookiesSection = document.createElement("section");
  first1000CookiesSection.id = "InsufficientMoneyContainer";

  const upgradeImgDiv = document.createElement("div");
  upgradeImgDiv.id = "upgrade-img";

  const cursorImg = document.createElement("img");
  cursorImg.id = "cursorImg";
  cursorImg.src = "./media/images/greenTick.png";
  cursorImg.alt = "a cartoon cursor picture";
  upgradeImgDiv.appendChild(cursorImg);

  const upgradeLvlDiv = document.createElement("div");
  upgradeLvlDiv.id = "upgrade-title";
  const lvlParagraph = document.createElement("p");
  lvlParagraph.textContent = "Lvl : ";
  upgradeLvlDiv.appendChild(lvlParagraph);

  const upgradeCostDiv = document.createElement("div");
  upgradeCostDiv.id = "upgrade-cost";
  const costParagraph = document.createElement("p");
  const currentCost = "First 1000 Cookies";
  costParagraph.textContent = currentCost;
  upgradeCostDiv.appendChild(costParagraph);

  first1000CookiesSection.appendChild(upgradeImgDiv);
  first1000CookiesSection.appendChild(upgradeCostDiv);

  middleContainer.appendChild(first1000CookiesSection);
  setInterval(function () {
    first1000CookiesSection.remove();
  }, 2000);
}

//===============================================Volume Icon===============================================

const volumeIcon = document.createElement("img");
volumeIcon.id = "volume-icon";
volumeIcon.src = "./media/images/volumeImg.png";
volumeIcon.alt = "change background button and image";

const volumeParagraph = document.createElement("p");
volumeParagraph.id = "volume-icon";
volumeParagraph.textContent = "Change Volume";

const volumeLabel = document.createElement("label");
const volumeInput = document.createElement("input");

volumeLabel.for = "volume";

volumeInput.type = "range";
volumeInput.id = "volume";
volumeInput.min = "0";
volumeInput.max = "100";
volumeInput.value = "50";

//===============================================Background Icon===============================================

const mainContainer = document.getElementById("main-container");

const backgroundParagraph = document.createElement("p");
backgroundParagraph.id = "background-para";
backgroundParagraph.textContent = "Change Background";

const backgroundsContainer = document.createElement("div");
backgroundsContainer.id = "backgroundsContainer";

const redBackground = document.createElement("img");
const lightblueBackground = document.createElement("img");
const brownBackground = document.createElement("img");
redBackground.src = "./media/images/redBackground.png";
lightblueBackground.src = "./media/images/lightblueBackground.png";
brownBackground.src = "./media/images/brownBackground.png";

redBackground.id = "red-background-img";
lightblueBackground.id = "lightblue-background-img";
brownBackground.id = "brown-background-img";

//===============================================Settings Icon===============================================

const settingsIcon = document.getElementById("settings-icon");

const settingsContainer = document.createElement("div");
settingsContainer.id = "settings-container";

const backgroundContainer = document.createElement("div");
backgroundContainer.id = "background-container";

const volumeContainer = document.createElement("div");
volumeContainer.id = "volume-container";

settingsIcon.addEventListener("mouseenter", function () {
  volumeContainer.appendChild(volumeIcon);
  volumeContainer.appendChild(volumeParagraph);
  volumeContainer.appendChild(volumeLabel);
  volumeContainer.appendChild(volumeInput);

  backgroundContainer.appendChild(backgroundParagraph);
  backgroundContainer.appendChild(redBackground);
  backgroundContainer.appendChild(lightblueBackground);
  backgroundContainer.appendChild(brownBackground);

  settingsContainer.appendChild(volumeContainer);
  settingsContainer.appendChild(backgroundContainer);

  settingsIcon.appendChild(settingsContainer);

  const slider = document.getElementById("volume");
  slider.addEventListener("input", () => {
    volumeAmount = slider.value;
    audioComponent.volume = volumeAmount / 100;
    console.log(volumeAmount);
  });

  const redBackgroundBtn = document.getElementById("red-background-img");

  const lightblueBackgroundBtn = document.getElementById(
    "lightblue-background-img"
  );

  const brownBackgroundBtn = document.getElementById("brown-background-img");

  redBackgroundBtn.addEventListener("click", function () {
    document.body.style.backgroundColor = "red";
    console.log("red btn clicked");
  });

  lightblueBackgroundBtn.addEventListener("click", function () {
    document.body.style.backgroundColor = "lightblue";
    console.log("lightblue btn clicked");
  });

  brownBackgroundBtn.addEventListener("click", function () {
    document.body.style.backgroundColor = "brown";
    console.log("brown btn clicked");
  });
});

settingsIcon.addEventListener("mouseleave", function () {
  settingsContainer.remove();
});
