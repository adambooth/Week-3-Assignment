// https://cookie-upgrade-api.vercel.app/api/upgrades

const cookie = document.getElementById("cookieImg");
const moneyContainer = document.getElementById("money-holder");
const middleContainer = document.getElementById("middle-container");
const clickPowerContainer = document.getElementById("click-power-container");
const autoPowerContainer = document.getElementById("auto-power-container");
const rightContainer = document.getElementById("right-container");

//localStorage.clear();

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
});

function updateStats() {
  moneyContainer.textContent = `Cookies : ${currentMoney}`;
  clickPowerContainer.innerHTML = `Click Power : ${clickPower}`;
  autoPowerContainer.innerHTML = `Auto Power Per Second : ${autoPowerPerSecond}`;
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
        upgradeCosts[`upgrade${upgrade.id}`] = upgrade.cost;
        upgrade.increase = Math.floor(upgrade.increase * 2);
        upgradeIncreaseAmounts[`upgrade${upgrade.id}`] = upgrade.increase;
        autoIncreaseParagrapgh.textContent = `+ ${upgrade.increase} APS`;
        lvlParagraph.textContent =
          "Lvl : " + upgradeLvls[`upgrade${upgrade.id}`];
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
      JSON.stringify({
        currentMoney,
        clickPower,
        autoPowerPerSecond,
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

//===============================================Background Icon===============================================

const backgroundIcon = document.getElementById("background-change-container");

const mainContainer = document.getElementById("main-container");

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

backgroundsContainer.appendChild(redBackground);
backgroundsContainer.appendChild(lightblueBackground);
backgroundsContainer.appendChild(brownBackground);

backgroundIcon.addEventListener("mouseenter", function () {
  backgroundIcon.appendChild(backgroundsContainer);

  const redBackgroundBtn = document.getElementById("red-background-img");

  const lightblueBackgroundBtn = document.getElementById(
    "lightblue-background-img"
  );

  const brownBackgroundBtn = document.getElementById("brown-background-img");

  redBackgroundBtn.addEventListener("click", function () {
    mainContainer.style.backgroundColor = "red";
    console.log("red btn clicked");
  });

  lightblueBackgroundBtn.addEventListener("click", function () {
    mainContainer.style.backgroundColor = "lightblue";
    console.log("lightblue btn clicked");
  });

  brownBackgroundBtn.addEventListener("click", function () {
    mainContainer.style.backgroundColor = "brown";
    console.log("brown btn clicked");
  });
});

backgroundIcon.addEventListener("mouseleave", function () {
  backgroundsContainer.remove();
});
