// === КОД ИГРЫ ===
document.addEventListener('DOMContentLoaded', function() {
    // Переводы для трех языков
    const translations = {
        // ... (оставлено как есть из предыдущего файла) ...
    };

    // ОБНОВЛЕНИЕ: Объявление переменной locations ПЕРЕД использованием
    const locations = {
        mercury: { name: "☿ Меркурий", color: "#bb86fc", coinColor: "#a0d2ff", borderColor: "#4a55e0", blockColors: ['#2962ff', '#4fc3f7', '#bb86fc', '#f8bbd0'] },
        venus: { name: "♀ Венера", color: "#ffab91", coinColor: "#a0d2ff", borderColor: "#ff5722", blockColors: ['#ff5722', '#ff9800', '#ff5722', '#e91e63'] },
        earth: { name: "♁ Земля", color: "#80deea", coinColor: "#a0d2ff", borderColor: "#0288d1", blockColors: ['#0288d1', '#29b6f6', '#00bcd4', '#00e5ff'] },
        mars: { name: "♂ Марс", color: "#a5d6a7", coinColor: "#a0d2ff", borderColor: "#388e3c", blockColors: ['#388e3c', '#66bb6a', '#9ccc65', '#d4e157'] },
        jupiter: { name: "♃ Юпитер", color: "#ce93d8", coinColor: "#a0d2ff", borderColor: "#7b1fa2", blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] },
        saturn: { name: "♄ Сатурн", color: "#ce93d8", coinColor: "#a0d2ff", borderColor: "#7b1fa2", blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] },
        uranus: { name: "♅ Уран", color: "#ce93d8", coinColor: "#a0d2ff", borderColor: "#7b1fa2", blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] },
        neptune: { name: "♆ Нептун", color: "#ce93d8", coinColor: "#a0d2ff", borderColor: "#7b1fa2", blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] },
        pluto: { name: "♇ Плутон", color: "#ce93d8", coinColor: "#a0d2ff", borderColor: "#7b1fa2", blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] }
    };

    // === ФАКТИЧЕСКИЕ РАССТОЯНИЯ ПЛАНЕТ В АСТРОНОМИЧЕСКИХ ЕДИНИЦАХ ===
    // 1 а.е. = 149,597,870.691 км
    const astronomicalUnits = {
        mercury: 0.38710,
        venus: 0.72333,
        earth: 1.00000,
        mars: 1.52366,
        jupiter: 5.20336,
        saturn: 9.53707,
        uranus: 19.19126,
        neptune: 30.06896,
        pluto: 39.48200
    };
    // ПЕРЕСЧИТАНО на основе фактической астрономической единицы
    const AU_TO_DAMAGE = 149597870.691;
    const locationRequirements = {
        mercury: { 
            damageRequired: 0, 
            targetAU: astronomicalUnits.mercury,
            nextLocation: 'venus'
        },
        venus: { 
            damageRequired: 0, 
            targetAU: astronomicalUnits.venus,
            nextLocation: 'earth'
        },
        earth: { 
            damageRequired: 0, 
            targetAU: astronomicalUnits.earth,
            nextLocation: 'mars'
        },
        mars: { 
            damageRequired: 0, 
            targetAU: astronomicalUnits.mars,
            nextLocation: 'jupiter'
        },
        jupiter: { 
            damageRequired: 0, 
            targetAU: astronomicalUnits.jupiter,
            nextLocation: 'saturn'
        },
        saturn: { 
            damageRequired: 0, 
            targetAU: astronomicalUnits.saturn,
            nextLocation: 'uranus'
        },
        uranus: { 
            damageRequired: 0, 
            targetAU: astronomicalUnits.uranus,
            nextLocation: 'neptune'
        },
        neptune: { 
            damageRequired: 0, 
            targetAU: astronomicalUnits.neptune,
            nextLocation: 'pluto'
        },
        pluto: { 
            damageRequired: 0, 
            targetAU: astronomicalUnits.pluto,
            nextLocation: null
        }
    };
    let blockSpeed = isMobile ? 25 : 20;
    function getCurrentSpeed() {
        const baseSpeed = blockSpeed;
        const locationIndex = Object.keys(locationRequirements).indexOf(currentLocation);
        if (locationIndex < 3) {
            return baseSpeed * 0.85;
        }
        return baseSpeed;
    }
    const baseClickUpgradeCost = 80;
    const baseHelperUpgradeCost = 1500;
    const baseCritChanceCost = 500;
    const baseCritMultiplierCost = 800;
    const baseHelperDmgCost = 1000;
    const rareBlocks = {
        GOLD: {
            name: "Золотой",
            chance: 0.03,
            multiplier: 8,
            healthMultiplier: 1.8,
            effect: "Мгновенный бонус",
            className: "block-gold"
        },
        RAINBOW: {
            name: "Радужный", 
            chance: 0.02,
            multiplier: 5,
            healthMultiplier: 1.5,
            effect: "Увеличение силы",
            className: "block-rainbow"
        },
        CRYSTAL: {
            name: "Кристальный",
            chance: 0.025,
            multiplier: 6,
            healthMultiplier: 1.6,
            effect: "Время помощника",
            className: "block-crystal"
        },
        MYSTERY: {
            name: "Загадочный",
            chance: 0.015,
            multiplier: 10,
            healthMultiplier: 2.0,
            effect: "Случайный бонус",
            className: "block-mystery"
        }
    };
    const balanceConfig = {
        baseHealth: 80,
        targetClicks: 70,
        healthRandomRange: { min: 0.8, max: 1.3 },
        damageProgression: {
            baseMultiplier: 1.15,
            diminishingReturns: 0.96,
            maxLevelEffect: 60
        },
        rewardMultiplier: 2.5,
        comboMultiplier: 0.25,
        randomBonusRange: { min: 0.8, max: 1.5 }
    };
    // === ИСПРАВЛЕНИЕ: Удалены неиспользуемые переменные анимации ===
    // === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
    let coins = 0;
    let totalDamageDealt = 0;
    let clickPower = 1;
    let clickUpgradeLevel = 0;
    let gameActive = false;
    let currentLocation = 'mercury';
    let currentBlockHealth = 0;
    let currentBlock = null;
    let comboCount = 0;
    let lastDestroyTime = 0;
    const COMBO_TIME_WINDOW = isMobile ? 1500 : 2000;
    let helperActive = false;
    let helperTimeLeft = 0;
    const helperDuration = 60000;
    let helperInterval = null; // ИСПРАВЛЕНИЕ: Инициализирована переменная
    let helperUpgradeLevel = 0;
    const helperUpgradeMultiplier = 1.8;
    let critChance = 0.001; // Начальное значение 0.1%
    let critMultiplier = 2.0;
    let helperDamageBonus = 0.3;
    let helperElement = null;
    let helperPosition = { x: 0, y: 0 };
    let bogoCoinBonus = 0; // Бонус к кристаллам от Bobo
    // === ИСПРАВЛЕНИЕ: Добавлены новые переменные для улучшений ===
    let critChanceUpgradeLevel = 0;
    let critMultiplierUpgradeLevel = 0;
    // ИСПРАВЛЕНИЕ: Переработка инициализации gameMetrics
    let gameMetrics = {
        startTime: Date.now(),
        blocksDestroyed: 0,
        upgradesBought: 0,
        totalClicks: 0,
        sessions: 1
    };
    // ИСПРАВЛЕНИЕ: Добавление функций для работы с метриками
    function saveGameMetrics() {
        localStorage.setItem('gameMetrics', JSON.stringify({
            blocksDestroyed: gameMetrics.blocksDestroyed,
            upgradesBought: gameMetrics.upgradesBought,
            totalClicks: gameMetrics.totalClicks,
            sessions: gameMetrics.sessions,
            startTime: gameMetrics.startTime // ИСПРАВЛЕНИЕ: Сохраняем startTime
        }));
    }
    function loadGameMetrics() {
        const saved = localStorage.getItem('gameMetrics');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                gameMetrics = {
                    startTime: data.startTime || Date.now(), // ИСПРАВЛЕНИЕ: Загружаем сохраненное время
                    blocksDestroyed: data.blocksDestroyed || 0,
                    upgradesBought: data.upgradesBought || 0,
                    totalClicks: data.totalClicks || 0,
                    sessions: (data.sessions || 0) + 1
                };
                saveGameMetrics();
                return true;
            } catch (e) {
                console.warn('Ошибка загрузки метрик', e);
            }
        }
        return false;
    }
    // Инициализация метрик при запуске
    loadGameMetrics();
    // === ОБНОВЛЕННЫЕ ФУНКЦИИ БАЛАНСИРОВКИ ===
    function calculateBlockHealth() {
        const currentReq = locationRequirements[currentLocation]; // ИСПРАВЛЕНИЕ: Используем currentReq
        const locationBonus = 1 + (currentReq.targetAU * 2);
        let baseHealth = balanceConfig.baseHealth * locationBonus;
        const targetHealth = clickPower * balanceConfig.targetClicks;
        const combinedHealth = (baseHealth + targetHealth) / 2;
        const randomFactor = balanceConfig.healthRandomRange.min + 
                            Math.random() * (balanceConfig.healthRandomRange.max - balanceConfig.healthRandomRange.min);
        return Math.floor(combinedHealth * randomFactor);
    }
    function calculateClickPower() {
        const basePower = 1;
        const upgradeBonus = clickUpgradeLevel;
        const diminishingEffect = Math.pow(balanceConfig.damageProgression.diminishingReturns, 
                                         Math.min(clickUpgradeLevel, balanceConfig.damageProgression.maxLevelEffect));
        const nonLinearGrowth = Math.sqrt(clickUpgradeLevel + 1);
        return basePower + (upgradeBonus * diminishingEffect * nonLinearGrowth * balanceConfig.damageProgression.baseMultiplier);
    }
    function getExpectedClicks(blockHealth, playerDamage) {
        return Math.ceil(blockHealth / playerDamage);
    }
    function getRareBlockType() {
        const rand = Math.random();
        let cumulativeChance = 0;
        for (const [type, block] of Object.entries(rareBlocks)) {
            cumulativeChance += block.chance;
            if (rand <= cumulativeChance) {
                return type;
            }
        }
        return null;
    }
    function announceRareBlock(blockName) {
        const announce = document.createElement('div');
        announce.className = 'rare-block-announce';
        announce.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.8em;
            font-weight: bold;
            color: gold;
            z-index: 50;
            text-shadow: 0 0 10px black;
            animation: fadeInOut 2s;
        `;
        announce.textContent = `🌟 ${blockName} блок! 🌟`;
        document.body.appendChild(announce);
        setTimeout(() => {
            if (announce.parentNode) {
                document.body.removeChild(announce);
            }
        }, 2000);
    }
    // === УЛУЧШЕННАЯ СИСТЕМА СОХРАНЕНИЯ ===
    function saveGame() {
      const saveData = {
        coins,
        clickPower,
        clickUpgradeLevel,
        critChance,
        critMultiplier,
        helperDamageBonus,
        helperUpgradeLevel,
        totalDamageDealt,
        currentLocation,
        bogoCoinBonus,
        gameActive: true,
        timestamp: Date.now(),
        // ИСПРАВЛЕНИЕ: Добавляем новые переменные в сохранение
        critChanceUpgradeLevel,
        critMultiplierUpgradeLevel
      };
      localStorage.setItem('cosmicBlocksSave', JSON.stringify(saveData));
      showTooltip(translations[currentLanguage].tooltips.saveSuccess);
      setTimeout(hideTooltip, 1500);
      updateContinueButton();
    }
    function loadGame() {
      const saved = localStorage.getItem('cosmicBlocksSave');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          const saveAge = Date.now() - (data.timestamp || 0);
          const maxSaveAge = 30 * 24 * 60 * 60 * 1000;
          if (saveAge < maxSaveAge) {
            coins = data.coins || 0;
            clickPower = data.clickPower || 1;
            clickUpgradeLevel = data.clickUpgradeLevel || 0;
            critChance = data.critChance || 0.001;
            critMultiplier = data.critMultiplier || 2.0;
            helperDamageBonus = data.helperDamageBonus || 0.3;
            helperUpgradeLevel = data.helperUpgradeLevel || 0;
            totalDamageDealt = data.totalDamageDealt || 0;
            currentLocation = data.currentLocation || 'mercury';
            bogoCoinBonus = data.bogoCoinBonus || 0;
            // ИСПРАВЛЕНИЕ: Загружаем новые переменные с обратной совместимостью
            critChanceUpgradeLevel = data.critChanceUpgradeLevel || Math.round((critChance - 0.001) / 0.001);
            critMultiplierUpgradeLevel = data.critMultiplierUpgradeLevel || Math.round((critMultiplier - 2.0) / 0.2);
            return true;
          } else {
            console.log('Сохранение устарело');
            localStorage.removeItem('cosmicBlocksSave');
          }
        } catch (e) {
          console.warn('Ошибка загрузки сохранения', e);
        }
      }
      return false;
    }
    function updateContinueButton() {
      const continueBtn = document.getElementById('continueBtn');
      if (continueBtn) {
        const hasSave = localStorage.getItem('cosmicBlocksSave') !== null;
        if (hasSave) {
          continueBtn.className = 'btn save-available';
          continueBtn.textContent = translations[currentLanguage].buttons.continue;
        } else {
          continueBtn.className = 'btn no-save';
          continueBtn.textContent = translations[currentLanguage].buttons.noSave;
        }
      }
    }
    // Получаем элементы DOM
    const DOMElements = {
        coinsDisplay: document.getElementById("coins-value"),
        clickPowerDisplay: document.getElementById("clickPower-value"),
        critChanceDisplay: document.getElementById("critChance-value"),
        critMultiplierDisplay: document.getElementById("critMultiplier-value"),
        progressBar: document.getElementById("progressBar"),
        progressText: document.getElementById("progressText"),
        levelAnnounce: document.getElementById("levelAnnounce"),
        gameTitle: document.getElementById("gameTitle"),
        upgradeClickBtn: document.getElementById("upgradeClickBtn"),
        upgradeHelperBtn: document.getElementById("upgradeHelperBtn"),
        upgradeCritChanceBtn: document.getElementById("upgradeCritChanceBtn"),
        upgradeCritMultBtn: document.getElementById("upgradeCritMultBtn"),
        upgradeHelperDmgBtn: document.getElementById("upgradeHelperDmgBtn"),
        gameOverScreen: document.getElementById("gameOverScreen"),
        finalScoreDisplay: document.getElementById("finalScore"),
        tooltip: document.getElementById("tooltip"),
        welcomeScreen: document.getElementById("welcomeScreen"),
        saveScreen: document.getElementById("saveScreen"),
        header: document.getElementById("header"),
        gameArea: document.getElementById("gameArea"),
        particlesCanvas: document.getElementById("particlesCanvas"),
        startBtn: document.getElementById("startBtn"),
        continueBtn: document.getElementById("continueBtn"),
        loadSaveBtn: document.getElementById("loadSaveBtn"),
        newGameBtn: document.getElementById("newGameBtn"),
        cancelSaveBtn: document.getElementById("cancelSaveBtn"),
        restartBtn: document.getElementById("restartBtn"),
        shareBtn: document.getElementById("shareBtn"),
        saveBtn: document.getElementById("saveBtn"),
        langBtnWelcome: document.getElementById("langBtn-welcome")
    };
    // Проверяем наличие всех необходимых элементов
    let missingElements = [];
    Object.entries(DOMElements).forEach(([name, element]) => {
        if (!element) missingElements.push(name);
    });
    if (missingElements.length > 0) {
        console.error("Отсутствуют элементы:", missingElements.join(", "));
        return;
    }
    // Присваиваем переменные
    const {
        coinsDisplay, clickPowerDisplay, critChanceDisplay, critMultiplierDisplay, progressBar, progressText,
        levelAnnounce, gameTitle, upgradeClickBtn, upgradeHelperBtn, 
        upgradeCritChanceBtn, upgradeCritMultBtn, upgradeHelperDmgBtn, 
        gameOverScreen, finalScoreDisplay, tooltip, welcomeScreen, saveScreen,
        header, gameArea, particlesCanvas, startBtn, continueBtn, loadSaveBtn,
        newGameBtn, cancelSaveBtn, restartBtn, shareBtn, saveBtn, langBtnWelcome
    } = DOMElements;
    // === ОБНОВЛЕННЫЙ ЭФФЕКТ ВЗРЫВА С УВЕЛИЧЕННОЙ ОБЛАСТЬЮ ===
    function createExplosion(block) {
        const rect = block.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // УВЕЛИЧЕННЫЙ РАЗМЕР ВЗРЫВА
        const explosionSize = isMobile ? 150 : 200;
        // Создаем основной взрыв
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.left = centerX + 'px';
        explosion.style.top = centerY + 'px';
        explosion.style.width = explosionSize + 'px';
        explosion.style.height = explosionSize + 'px';
        document.body.appendChild(explosion);
        // УВЕЛИЧЕННОЕ КОЛИЧЕСТВО ЧАСТИЦ
        const particleCount = isMobile ? 20 : 25;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            // УВЕЛИЧЕННЫЙ РАЗМЕР ЧАСТИЦ
            const particleSize = isMobile ? 10 : 12;
            particle.style.width = particleSize + 'px';
            particle.style.height = particleSize + 'px';
            // ИСПРАВЛЕНИЕ: locations теперь доступна
            const location = locations[currentLocation];
            particle.style.backgroundColor = location.blockColors[Math.floor(Math.random() * location.blockColors.length)];
            // УВЕЛИЧЕННОЕ РАССТОЯНИЕ РАЗЛЕТА
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            document.body.appendChild(particle);
            // Удаляем частицы после анимации
            setTimeout(() => {
                if (particle.parentNode) {
                    document.body.removeChild(particle);
                }
            }, 800);
        }
        // Удаляем основной взрыв после анимации
        setTimeout(() => {
            if (explosion.parentNode) {
                document.body.removeChild(explosion);
            }
        }, 600);
    }
    // === ОБНОВЛЕННАЯ СИСТЕМА ПРОГРЕССА В АСТРОНОМИЧЕСКИХ ЕДИНИЦАХ ===
    function updateProgressBar() {
        const currentReq = locationRequirements[currentLocation];
        const nextLocation = currentReq.nextLocation;
        const currentAU = totalDamageDealt / AU_TO_DAMAGE;
        const targetAU = currentReq.targetAU;
        const percentage = Math.min(100, (currentAU / targetAU) * 100);
        progressBar.style.width = percentage + '%';
        applyTranslation(progressText, 'progressText', {
            current: currentAU.toFixed(5),
            target: targetAU.toFixed(5),
            percent: percentage.toFixed(1)
        });
    }
    function checkLocationUpgrade() {
        const currentReq = locationRequirements[currentLocation];
        const nextLocation = currentReq.nextLocation;
        const currentAU = totalDamageDealt / AU_TO_DAMAGE;
        const targetAU = currentReq.targetAU;
        if (nextLocation && currentAU >= targetAU) {
            // ПОЛНОСТЬЮ РАЗБЛОКИРОВАНЫ ВСЕ ЛОКАЦИИ
            setLocation(nextLocation);
            showTooltip(formatString(translations[currentLanguage].locationProgress.unlocked, { location: locations[nextLocation].name }));
            setTimeout(hideTooltip, 3000);
        }
        updateProgressBar();
    }
    // === ОБНОВЛЕННЫЕ ФУНКЦИИ ТЕКСТА УРОНА И БОНУСОВ ===
    function createDamageText(damage, block, color = '#ff4444') {
        const rect = block.getBoundingClientRect();
        const text = document.createElement('div');
        text.className = 'damage-text';
        text.textContent = `-${damage}`;
        text.style.color = color;
        let left = rect.left + rect.width / 2;
        let top = rect.top;
        const textWidth = 100;
        if (left < textWidth / 2) left = textWidth / 2;
        if (left > window.innerWidth - textWidth / 2) left = window.innerWidth - textWidth / 2;
        if (top < 50) top = 50;
        text.style.left = left + 'px';
        text.style.top = top + 'px';
        document.body.appendChild(text);
        let opacity = 1;
        let yPos = parseInt(text.style.top);
        function animate() {
            opacity -= 0.02;
            yPos -= 2;
            text.style.opacity = opacity;
            text.style.top = yPos + 'px';
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                if (text.parentNode) {
                    document.body.removeChild(text);
                }
            }
        }
        animate();
    }
    function showComboText(combo, bonus, block) {
        const rect = block.getBoundingClientRect();
        const text = document.createElement('div');
        text.className = 'combo-text';
        text.textContent = formatString(translations[currentLanguage].tooltips.combo, { count: combo, bonus: bonus });
        let left = rect.left + rect.width / 2;
        let top = rect.top;
        const textWidth = 150;
        if (left < textWidth / 2) left = textWidth / 2;
        if (left > window.innerWidth - textWidth / 2) left = window.innerWidth - textWidth / 2;
        if (top < 50) top = 50;
        text.style.left = left + 'px';
        text.style.top = top + 'px';
        document.body.appendChild(text);
        setTimeout(() => {
            if (text.parentNode) {
                document.body.removeChild(text);
            }
        }, 1000);
    }
    function showRewardText(reward, block) {
        const rect = block.getBoundingClientRect();
        const text = document.createElement('div');
        text.className = 'reward-text';
        text.textContent = formatString(translations[currentLanguage].tooltips.reward, { reward: reward });
        let left = rect.left + rect.width / 2;
        let top = rect.top + rect.height / 2;
        const textWidth = 120;
        if (left < textWidth / 2) left = textWidth / 2;
        if (left > window.innerWidth - textWidth / 2) left = window.innerWidth - textWidth / 2;
        if (top < 50) top = 50;
        text.style.left = left + 'px';
        text.style.top = top + 'px';
        document.body.appendChild(text);
        setTimeout(() => {
            if (text.parentNode) {
                document.body.removeChild(text);
            }
        }, 1500);
    }
    // === ФУНКЦИИ РАБОТЫ С ПОМОЩНИКОМ BOBO ===
    function moveHelperToRandomPosition() {
        if (!helperElement) return;
        // Получаем позицию текущего блока
        let blockRect = { left: window.innerWidth/2, top: window.innerHeight/2 };
        if (currentBlock) {
            blockRect = currentBlock.getBoundingClientRect();
        }
        // Находим позицию вдали от блока
        let attempts = 0;
        let validPosition = false;
        const safeDistance = 150;
        while (!validPosition && attempts < 20) {
            attempts++;
            // Генерируем случайную позицию
            const randomX = Math.random() * (window.innerWidth - 60) + 30;
            const randomY = Math.random() * (window.innerHeight - 120) + 60; // Избегаем верхней части с UI
            // Проверяем расстояние от блока
            const distance = Math.sqrt(
                Math.pow(randomX - (blockRect.left + blockRect.width/2), 2) + 
                Math.pow(randomY - (blockRect.top + blockRect.height/2), 2)
            );
            // Проверяем, что позиция не слишком близко к краям и не перекрывает UI
            const safeFromEdges = randomX > 60 && randomX < window.innerWidth - 60 && 
                                randomY > 100 && randomY < window.innerHeight - 60;
            if (distance > safeDistance && safeFromEdges) {
                helperPosition = { x: randomX, y: randomY };
                validPosition = true;
            }
        }
        // Если не нашли хорошую позицию, используем последнюю или центральную
        if (!validPosition) {
            helperPosition = {
                x: window.innerWidth * 0.7,
                y: window.innerHeight * 0.7
            };
        }
        // Устанавливаем позицию
        helperElement.style.left = helperPosition.x + 'px';
        helperElement.style.top = helperPosition.y + 'px';
    }
    function createHelperElement() {
        if (helperElement && helperElement.parentNode) {
            document.body.removeChild(helperElement);
        }
        helperElement = document.createElement('div');
        helperElement.className = 'helper';
        document.body.appendChild(helperElement);
        moveHelperToRandomPosition();
        // Добавляем плавное появление
        helperElement.style.opacity = '0';
        setTimeout(() => {
            if (helperElement) helperElement.style.opacity = '1';
        }, 100);
    }
    // === ФУНКЦИЯ ВИЗУАЛИЗАЦИИ ЛУЧА BOBO ===
    function createHelperEffect() {
        if (!currentBlock || !helperElement) return;
        const blockRect = currentBlock.getBoundingClientRect();
        const helperRect = helperElement.getBoundingClientRect();
        // Создаем контейнер для анимации луча
        const beamContainer = document.createElement('div');
        beamContainer.className = 'helper-beam';
        beamContainer.style.position = 'absolute';
        beamContainer.style.zIndex = '13';
        document.body.appendChild(beamContainer);
        // Рассчитываем начальную и конечную точки луча
        const startX = helperRect.left + helperRect.width / 2;
        const startY = helperRect.top + helperRect.height / 2;
        const endX = blockRect.left + blockRect.width / 2;
        const endY = blockRect.top + blockRect.height / 2;
        // Создаем canvas для рисования луча
        const canvas = document.createElement('canvas');
        const maxSize = Math.max(window.innerWidth, window.innerHeight);
        canvas.width = maxSize;
        canvas.height = maxSize;
        beamContainer.appendChild(canvas);
        // Позиционируем контейнер
        beamContainer.style.left = '0px';
        beamContainer.style.top = '0px';
        const ctx = canvas.getContext('2d');
        // Анимация луча с использованием requestAnimationFrame
        let progress = 0;
        const animationDuration = 300; // Длительность анимации в миллисекундах
        const startTime = Date.now();
        function animateBeam() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            progress = Math.min(elapsed / animationDuration, 1);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (progress > 0) {
                // Рассчитываем текущую позицию луча
                const currentX = startX + (endX - startX) * progress;
                const currentY = startY + (endY - startY) * progress;
                // Создаем градиент для луча
                const gradient = ctx.createLinearGradient(startX, startY, currentX, currentY);
                gradient.addColorStop(0, 'rgba(105, 240, 174, 0.9)');
                gradient.addColorStop(0.7, 'rgba(105, 240, 174, 0.5)');
                gradient.addColorStop(1, 'rgba(105, 240, 174, 0)');
                // Рисуем луч
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(currentX, currentY);
                ctx.lineWidth = 4 + (4 * (1 - progress)); // Луч сужается к концу
                ctx.strokeStyle = gradient;
                ctx.stroke();
                // Добавляем светящийся эффект
                ctx.beginPath();
                ctx.arc(currentX, currentY, 8 * (1 - progress), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(105, 240, 174, ${0.7 * (1 - progress)})`;
                ctx.fill();
            }
            if (progress < 1) {
                requestAnimationFrame(animateBeam);
            } else {
                // Удаляем контейнер после окончания анимации
                setTimeout(() => {
                    if (beamContainer.parentNode) {
                        document.body.removeChild(beamContainer);
                    }
                }, 200);
            }
        }
        // Запускаем анимацию
        animateBeam();
        // Воспроизводим звук атаки
        playSound('helperSound');
        // Эффект попадания
        setTimeout(() => {
            const hitEffect = document.createElement('div');
            hitEffect.style.position = 'absolute';
            hitEffect.style.left = (endX - 10) + 'px';
            hitEffect.style.top = (endY - 10) + 'px';
            hitEffect.style.width = '20px';
            hitEffect.style.height = '20px';
            hitEffect.style.background = 'radial-gradient(circle, #69f0ae, transparent)';
            hitEffect.style.borderRadius = '50%';
            hitEffect.style.zIndex = '15';
            hitEffect.style.opacity = '0.8';
            document.body.appendChild(hitEffect);
            // Затухание эффекта
            let opacity = 0.8;
            const fadeOut = setInterval(() => {
                opacity -= 0.1;
                hitEffect.style.opacity = opacity;
                if (opacity <= 0) {
                    clearInterval(fadeOut);
                    if (hitEffect.parentNode) document.body.removeChild(hitEffect);
                }
            }, 30);
        }, animationDuration);
    }
    // === ФУНКЦИЯ АКТИВАЦИИ BOBO С БОНУСОМ К КРИСТАЛЛАМ ===
    function activateHelper() {
        if (helperActive) return;
        helperActive = true;
        helperTimeLeft = helperDuration;
        bogoCoinBonus = 0.2; // +20% к кристаллам
        // Создаем элемент помощника
        createHelperElement();
        helperInterval = setInterval(() => {
            if (helperActive && currentBlock && gameActive) {
                helperAttack();
            }
        }, 1500);
        const helperTimer = setInterval(() => {
            if (!helperActive) {
                clearInterval(helperTimer);
                return;
            }
            helperTimeLeft -= 1000;
            if (helperTimeLeft <= 0) {
                helperActive = false;
                clearInterval(helperInterval);
                clearInterval(helperTimer);
                bogoCoinBonus = 0; // Сбрасываем бонус к кристаллам
                // Плавное исчезание помощника
                if (helperElement) {
                    helperElement.style.opacity = '0';
                    setTimeout(() => {
                        if (helperElement && helperElement.parentNode) {
                            document.body.removeChild(helperElement);
                            helperElement = null;
                        }
                    }, 300);
                }
                updateUpgradeButtons();
                showTooltip(translations[currentLanguage].tooltips.helperEnd);
                setTimeout(hideTooltip, 1500);
            }
        }, 1000);
        updateUpgradeButtons();
        updateHUD();
        showTooltip(translations[currentLanguage].tooltips.helperAvailable);
        setTimeout(hideTooltip, 2500);
        saveGame();
    }
    function helperAttack() {
        if (!currentBlock || !helperActive || !helperElement) return;
        // Создаем визуальный эффект атаки
        createHelperEffect();
        const baseHelperDmg = clickPower * (1 + helperDamageBonus);
        const upgradedHelperDmg = baseHelperDmg * (1 + helperUpgradeLevel * 0.2);
        currentBlockHealth -= upgradedHelperDmg;
        totalDamageDealt += upgradedHelperDmg;
        gameMetrics.totalClicks++;
        createDamageText(Math.round(upgradedHelperDmg), currentBlock, '#69f0ae');
        checkLocationUpgrade();
        if (currentBlockHealth <= 0) {
            destroyBlock(currentBlock);
        } else {
            currentBlock.textContent = Math.floor(currentBlockHealth);
            updateCracks(currentBlock, currentBlockHealth);
        }
    }
    // === ОСТАЛЬНЫЕ ФУНКЦИИ ИГРЫ ===
    function setLocation(loc) {
        currentLocation = loc;
        applyTranslation(gameTitle, `gameTitle.${loc}`);
        if (header) header.style.borderColor = locations[loc].borderColor;
        // Обновляем планетарный фон
        planetBackground.setPlanet(loc);
        if (levelAnnounce) {
            levelAnnounce.textContent = locations[loc].name;
            levelAnnounce.style.color = locations[loc].color;
            levelAnnounce.style.opacity = "1";
            setTimeout(() => {
                levelAnnounce.style.opacity = "0";
            }, 2000);
        }
        updateProgressBar();
    }
    function updateCoins() {
        if (coinsDisplay) coinsDisplay.textContent = Math.floor(coins).toLocaleString();
        updateUpgradeButtons();
    }
    function updateHUD() {
        if (coinsDisplay) coinsDisplay.textContent = Math.floor(coins).toLocaleString();
        if (clickPowerDisplay) clickPowerDisplay.textContent = Math.round(clickPower);
        if (critChanceDisplay) critChanceDisplay.textContent = `${(critChance * 100).toFixed(1)}%`;
        if (critMultiplierDisplay) critMultiplierDisplay.textContent = `x${critMultiplier.toFixed(1)}`;
    }
    // ОБНОВЛЕННАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ КНОПОК С ПРОПОРЦИОНАЛЬНЫМ РОСТОМ СТОИМОСТИ
    function updateUpgradeButtons() {
        const clickCost = Math.floor(baseClickUpgradeCost * Math.pow(1.5, clickUpgradeLevel));
        if (upgradeClickBtn) {
            upgradeClickBtn.querySelector('.upgrade-cost').textContent = clickCost.toLocaleString();
            if (coins >= clickCost) {
                upgradeClickBtn.className = "upgrade-btn btn-available";
            } else {
                upgradeClickBtn.className = "upgrade-btn btn-unavailable";
            }
        }
        const helperCost = Math.floor(baseHelperUpgradeCost * Math.pow(1.4, helperUpgradeLevel));
        if (upgradeHelperBtn) {
            upgradeHelperBtn.querySelector('.upgrade-cost').textContent = helperCost.toLocaleString();
            if (coins >= helperCost && !helperActive) {
                upgradeHelperBtn.className = "upgrade-btn btn-available";
            } else {
                upgradeHelperBtn.className = "upgrade-btn btn-unavailable";
            }
        }
        // ИСПРАВЛЕНИЕ: Используем новые переменные для расчета стоимости
        const critChanceCost = Math.floor(baseCritChanceCost * Math.pow(1.3, critChanceUpgradeLevel));
        if (upgradeCritChanceBtn) {
            upgradeCritChanceBtn.querySelector('.upgrade-cost').textContent = critChanceCost.toLocaleString();
            if (coins >= critChanceCost) {
                upgradeCritChanceBtn.className = "upgrade-btn btn-available";
            } else {
                upgradeCritChanceBtn.className = "upgrade-btn btn-unavailable";
            }
        }
        const critMultiplierCost = Math.floor(baseCritMultiplierCost * Math.pow(1.25, critMultiplierUpgradeLevel));
        if (upgradeCritMultBtn) {
            upgradeCritMultBtn.querySelector('.upgrade-cost').textContent = critMultiplierCost.toLocaleString();
            if (coins >= critMultiplierCost) {
                upgradeCritMultBtn.className = "upgrade-btn btn-available";
            } else {
                upgradeCritMultBtn.className = "upgrade-btn btn-unavailable";
            }
        }
        const helperDmgCost = Math.floor(baseHelperDmgCost * Math.pow(helperUpgradeMultiplier, helperUpgradeLevel));
        if (upgradeHelperDmgBtn) {
            upgradeHelperDmgBtn.querySelector('.upgrade-cost').textContent = helperDmgCost.toLocaleString();
            if (coins >= helperDmgCost) {
                upgradeHelperDmgBtn.className = "upgrade-btn btn-available";
            } else {
                upgradeHelperDmgBtn.className = "upgrade-btn btn-unavailable";
            }
        }
    }
    function buyClickPower() {
        const cost = Math.floor(baseClickUpgradeCost * Math.pow(1.5, clickUpgradeLevel));
        if (coins >= cost) {
            coins -= cost;
            clickUpgradeLevel += 1;
            clickPower = calculateClickPower();
            gameMetrics.upgradesBought++;
            updateCoins();
            updateHUD();
            playSound('upgradeSound');
            showTooltip(formatString(translations[currentLanguage].tooltips.clickPowerUpgrade, { power: Math.round(clickPower) }));
            setTimeout(hideTooltip, 1500);
            saveGame();
        }
    }
    function buyHelper() {
        const cost = Math.floor(baseHelperUpgradeCost * Math.pow(1.4, helperUpgradeLevel));
        if (coins >= cost && !helperActive) {
            coins -= cost;
            activateHelper();
            updateCoins();
            updateHUD();
            saveGame();
        }
    }
    // === ИСПРАВЛЕННАЯ ФУНКЦИЯ ПОКУПКИ ШАНСА КРИТА ===
    function buyCritChance() {
        const cost = Math.floor(baseCritChanceCost * Math.pow(1.3, critChanceUpgradeLevel));
        if (coins >= cost) {
            coins -= cost;
            critChance = Math.min(1.0, critChance + 0.001);
            critChanceUpgradeLevel++; // ИСПРАВЛЕНИЕ: Увеличиваем уровень улучшения
            gameMetrics.upgradesBought++;
            updateCoins();
            updateHUD();
            playSound('upgradeSound');
            showTooltip(formatString(translations[currentLanguage].tooltips.critChanceUpgrade, { chance: (critChance * 100).toFixed(1) }));
            setTimeout(hideTooltip, 1500);
            saveGame();
        }
    }
    function buyCritMultiplier() {
        const cost = Math.floor(baseCritMultiplierCost * Math.pow(1.25, critMultiplierUpgradeLevel));
        if (coins >= cost) {
            coins -= cost;
            critMultiplier += 0.2;
            critMultiplierUpgradeLevel++; // ИСПРАВЛЕНИЕ: Увеличиваем уровень улучшения
            gameMetrics.upgradesBought++;
            updateCoins();
            updateHUD();
            playSound('upgradeSound');
            showTooltip(formatString(translations[currentLanguage].tooltips.critMultUpgrade, { mult: critMultiplier.toFixed(1) }));
            setTimeout(hideTooltip, 1500);
            saveGame();
        }
    }
    function buyHelperDamage() {
        const cost = Math.floor(baseHelperDmgCost * Math.pow(helperUpgradeMultiplier, helperUpgradeLevel));
        if (coins >= cost) {
            coins -= cost;
            helperUpgradeLevel += 1;
            gameMetrics.upgradesBought++;
            updateCoins();
            updateHUD();
            playSound('upgradeSound');
            showTooltip(formatString(translations[currentLanguage].tooltips.helperDmgUpgrade, { level: helperUpgradeLevel }));
            setTimeout(hideTooltip, 1500);
            saveGame();
        }
    }
    function updateCracks(block, health) {
        if (!block) return;
        const existingCrack = block.querySelector('.crack-overlay');
        if (existingCrack) {
            block.removeChild(existingCrack);
        }
        const maxHealth = parseInt(block.dataset.maxHealth);
        const damageRatio = 1 - (health / maxHealth);
        if (damageRatio > 0.7) {
            addCracks(block, 'crack-3');
        } else if (damageRatio > 0.4) {
            addCracks(block, 'crack-2');
        } else if (damageRatio > 0.1) {
            addCracks(block, 'crack-1');
        }
    }
    function addCracks(block, crackLevel) {
        const crackOverlay = document.createElement('div');
        crackOverlay.className = `crack-overlay ${crackLevel}`;
        block.appendChild(crackOverlay);
    }
    function playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => {});
        }
    }
    function hitBlock(block, damage) {
        if (!gameActive) return;
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        playSound('clickSound');
        block.style.transform = 'translateX(-50%) scale(0.85)';
        setTimeout(() => {
            block.style.transform = 'translateX(-50%) scale(1)';
        }, 100);
        let finalDamage = Math.round(damage);
        let isCrit = false;
        if (Math.random() < critChance) {
            finalDamage = Math.round(damage * critMultiplier);
            isCrit = true;
        }
        currentBlockHealth -= finalDamage;
        totalDamageDealt += finalDamage;
        gameMetrics.totalClicks++;
        createDamageText(finalDamage, block, isCrit ? '#FFD700' : '#ff4444');
        checkLocationUpgrade();
        if (currentBlockHealth <= 0) {
            destroyBlock(block);
        } else {
            block.textContent = Math.floor(currentBlockHealth);
            updateCracks(block, currentBlockHealth);
        }
    }
    function destroyBlock(block) {
        const now = Date.now();
        if (now - lastDestroyTime < COMBO_TIME_WINDOW) {
            comboCount++;
        } else {
            comboCount = 1;
        }
        lastDestroyTime = now;
        const baseReward = 25 + (locationRequirements[currentLocation].targetAU * 100);
        let reward = Math.floor(baseReward * balanceConfig.rewardMultiplier);
        const randomBonus = balanceConfig.randomBonusRange.min + 
                           Math.random() * (balanceConfig.randomBonusRange.max - balanceConfig.randomBonusRange.min);
        reward = Math.floor(reward * randomBonus);
        // Применяем бонус от Bobo
        if (bogoCoinBonus > 0) {
            reward = Math.floor(reward * (1 + bogoCoinBonus));
        }
        let isRare = false;
        let rareType = null;
        for (const type in rareBlocks) {
            if (block.classList.contains(rareBlocks[type].className)) {
                isRare = true;
                rareType = type;
                reward = Math.floor(reward * rareBlocks[type].multiplier);
                break;
            }
        }
        if (comboCount > 1) {
            const comboBonus = Math.floor(reward * (comboCount * balanceConfig.comboMultiplier));
            reward += comboBonus;
            showComboText(comboCount, comboBonus, block);
            playSound('comboSound');
        }
        coins += reward;
        gameMetrics.blocksDestroyed++;
        updateCoins();
        updateHUD();
        playSound('breakSound');
        showRewardText(reward, block);
        // Создаем эффект взрыва в центре блока
        createExplosion(block);
        if (gameArea.contains(block)) {
            gameArea.removeChild(block);
        }
        currentBlock = null;
        currentBlockHealth = 0;
        setTimeout(() => {
            if (gameActive) {
                createMovingBlock();
            }
        }, 500);
    }
    function getBlockSize() {
        const baseSize = isMobile ? 80 : 60;
        const locationIndex = Object.keys(locationRequirements).indexOf(currentLocation);
        if (locationIndex < 3) {
            return baseSize * 1.2;
        }
        return baseSize * (1 + locationIndex * 0.15);
    }
    function createMovingBlock() {
        if (currentBlock && gameArea.contains(currentBlock)) {
            gameArea.removeChild(currentBlock);
        }
        const blockHealth = calculateBlockHealth();
        currentBlockHealth = blockHealth;
        const block = document.createElement("div");
        block.className = "moving-block";
        const size = getBlockSize();
        block.style.width = size + "px";
        block.style.height = size + "px";
        block.style.bottom = "0px";
        block.dataset.maxHealth = blockHealth;
        const theme = locations[currentLocation];
        const colorIndex = Math.floor(Math.random() * theme.blockColors.length);
        let isRare = false;
        let rareType = null;
        const potentialRareType = getRareBlockType();
        if (potentialRareType) {
            isRare = true;
            rareType = potentialRareType;
            const rareBlock = rareBlocks[rareType];
            block.classList.add(rareBlock.className);
            currentBlockHealth = Math.floor(currentBlockHealth * rareBlock.healthMultiplier);
            block.innerHTML = `🌟<div style="font-size: 0.35em; margin-top: 1px; line-height: 1.1;">${rareBlock.name}</div>`;
            announceRareBlock(rareBlock.name);
        } else {
            block.style.background = `linear-gradient(135deg, ${theme.blockColors[colorIndex]}, ${theme.blockColors[(colorIndex + 1) % theme.blockColors.length]})`;
            block.style.boxShadow = `0 0 15px ${theme.blockColors[colorIndex]}`;
            block.style.border = `2px solid ${theme.borderColor}`;
            block.textContent = blockHealth;
        }
        const expectedClicks = getExpectedClicks(currentBlockHealth, clickPower);
        block.addEventListener('click', () => hitBlock(block, clickPower));
        block.addEventListener('touchstart', (e) => {
            e.preventDefault();
            hitBlock(block, clickPower);
        }, { passive: false });
        gameArea.appendChild(block);
        currentBlock = block;
        animateBlock(block);
    }
    function animateBlock(block) {
        if (!gameActive) return;
        const speed = getCurrentSpeed();
        let position = parseInt(block.style.bottom) || 0;
        function move() {
            if (!gameActive || currentBlock !== block) return;
            position += speed / 30;
            block.style.bottom = position + "px";
            if (position > window.innerHeight) {
                gameOver();
                return;
            }
            requestAnimationFrame(move);
        }
        move();
    }
    function gameOver(customMessage = null) {
        gameActive = false;
        helperActive = false;
        // ИСПРАВЛЕНИЕ: Очищаем все интервалы
        if (helperInterval) {
            clearInterval(helperInterval);
            helperInterval = null;
        }
        if (helperElement && helperElement.parentNode) {
            document.body.removeChild(helperElement);
            helperElement = null;
        }
        const sessionTime = Date.now() - gameMetrics.startTime;
        console.log('🎮 [Космический Кликер] Сессия завершена:', {
            session: gameMetrics.sessions,
            duration_sec: Math.round(sessionTime / 1000),
            total_damage: totalDamageDealt,
            current_location: currentLocation,
            total_coins: coins,
            blocks_destroyed: gameMetrics.blocksDestroyed,
            upgrades_bought: gameMetrics.upgradesBought,
            total_clicks: gameMetrics.totalClicks
        });
        localStorage.setItem('gameSessions', gameMetrics.sessions.toString());
        if (currentBlock && gameArea.contains(currentBlock)) {
            gameArea.removeChild(currentBlock);
            currentBlock = null;
        }
        if (finalScoreDisplay) {
            applyTranslation(finalScoreDisplay, 'gameOver.score', { damage: Math.floor(totalDamageDealt).toLocaleString() });
        }
        if (gameOverScreen) {
            gameOverScreen.style.display = "flex";
        }
        if (customMessage) {
            const h2 = gameOverScreen.querySelector('h2');
            if (h2) h2.textContent = customMessage;
        }
    }
    function shareResult() {
        const shareText = `🎮 Я нанес ${Math.floor(totalDamageDealt).toLocaleString()} урона и собрал ${Math.floor(coins)} Кристаллов в Космическом Кликере! 🌌
Сможешь побить мой рекорд?`;
        if (navigator.share) {
            navigator.share({
                title: 'Мой рекорд в Космическом Кликере!',
                text: shareText
            }).then(() => {
                coins += 50;
                updateCoins();
                updateHUD();
                showTooltip(translations[currentLanguage].tooltips.shareSuccess);
                setTimeout(hideTooltip, 2000);
                saveGame();
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Результат скопирован! Поделись с друзьями!');
                coins += 50;
                updateCoins();
                updateHUD();
                saveGame();
            });
        }
    }
    function showTooltip(text) {
        if (tooltip) {
            tooltip.innerHTML = text;
            tooltip.style.opacity = "1";
        }
    }
    function hideTooltip() {
        if (tooltip) tooltip.style.opacity = "0";
    }
    // ОБНОВЛЕННАЯ ФУНКЦИЯ СТАРТА ИГРЫ
    function startGame(reset = true) {
        if (reset) {
            // Полностью сбрасываем все параметры при начале новой игры
            coins = 0;
            totalDamageDealt = 0;
            currentLocation = 'mercury';
            clickPower = 1;
            clickUpgradeLevel = 0;
            helperUpgradeLevel = 0;
            helperDamageBonus = 0.3;
            critChance = 0.001;
            critMultiplier = 2.0;
            helperActive = false;
            helperTimeLeft = 0;
            bogoCoinBonus = 0;
            // ИСПРАВЛЕНИЕ: Сбрасываем новые переменные
            critChanceUpgradeLevel = 0;
            critMultiplierUpgradeLevel = 0;
            // Очищаем сохранение при начале новой игры
            localStorage.removeItem('cosmicBlocksSave');
        } else {
            // Если не сбрасываем, пересчитываем урон по новой формуле
            clickPower = calculateClickPower();
            // ИСПРАВЛЕНИЕ: добавляем обновление UI при загрузке сохранения
            updateHUD();
            updateProgressBar();
            updateUpgradeButtons();
        }
        // ИСПРАВЛЕНИЕ: Очищаем все интервалы
        if (helperInterval) {
            clearInterval(helperInterval);
            helperInterval = null;
        }
        if (helperElement && helperElement.parentNode) {
            document.body.removeChild(helperElement);
            helperElement = null;
        }
        gameArea.innerHTML = "";
        if (welcomeScreen) {
            welcomeScreen.style.display = "none";
        }
        if (saveScreen) {
            saveScreen.style.display = "none";
        }
        if (gameOverScreen) {
            gameOverScreen.style.display = "none";
        }
        gameActive = true;
        comboCount = 0;
        lastDestroyTime = 0;
        gameMetrics.startTime = Date.now();
        gameMetrics.blocksDestroyed = 0;
        gameMetrics.upgradesBought = 0;
        gameMetrics.totalClicks = 0;
        updateCoins();
        updateHUD();
        updateProgressBar();
        updateUpgradeButtons();
        setLocation(currentLocation);
        setTimeout(() => createMovingBlock(), 500);
    }
    function continueGame() {
        if (loadGame()) {
            startGame(false); // Не сбрасываем параметры
        } else {
            showTooltip(translations[currentLanguage].tooltips.noSave);
            setTimeout(hideTooltip, 2000);
        }
    }
    function showSaveScreen() {
       if (saveScreen) {
            saveScreen.style.display = "flex";
        }
    }
    function restartGame() {
        startGame(true); // Полностью сбрасываем игру
    }
    function showStartError() {
        showTooltip("Ошибка при запуске игры. Попробуйте перезагрузить страницу.");
        setTimeout(hideTooltip, 3000);
    }
    // === ОБРАБОТЧИКИ СОБЫТИЙ ===
    if (langBtnWelcome) {
        langBtnWelcome.addEventListener('click', switchLanguage);
        langBtnWelcome.addEventListener('touchstart', function(e) {
            e.preventDefault();
            switchLanguage();
        }, { passive: false });
    }
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            try {
                showSaveScreen();
            } catch (error) {
                console.error("Ошибка при запуске игры:", error);
                showStartError();
            }
        });
        startBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            try {
                showSaveScreen();
            } catch (error) {
                console.error("Ошибка при запуске игры:", error);
                showStartError();
            }
        }, { passive: false });
    }
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            try {
                const hasSave = localStorage.getItem('cosmicBlocksSave') !== null;
                if (hasSave) {
                    showSaveScreen();
                } else {
                    showTooltip(translations[currentLanguage].tooltips.noSave);
                    setTimeout(hideTooltip, 2000);
                }
            } catch (error) {
                console.error("Ошибка при продолжении игры:", error);
                showStartError();
            }
        });
        continueBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            try {
                const hasSave = localStorage.getItem('cosmicBlocksSave') !== null;
                if (hasSave) {
                    showSaveScreen();
                } else {
                    showTooltip(translations[currentLanguage].tooltips.noSave);
                    setTimeout(hideTooltip, 2000);
                }
            } catch (error) {
                console.error("Ошибка при продолжении игры:", error);
                showStartError();
            }
        }, { passive: false });
    }
    if (loadSaveBtn) {
        loadSaveBtn.addEventListener('click', continueGame);
        loadSaveBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            continueGame();
        }, { passive: false });
    }
    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => startGame(true));
        newGameBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startGame(true);
        }, { passive: false });
    }
    if (cancelSaveBtn) {
        cancelSaveBtn.addEventListener('click', () => {
            if (saveScreen) saveScreen.style.display = "none";
        });
        cancelSaveBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (saveScreen) saveScreen.style.display = "none";
        }, { passive: false });
    }
    function addMobileButtonHandlers(button, handler) {
        if (button) {
            button.addEventListener('click', handler);
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handler();
            }, { passive: false });
        }
    }
    addMobileButtonHandlers(upgradeClickBtn, buyClickPower);
    addMobileButtonHandlers(upgradeHelperBtn, buyHelper);
    addMobileButtonHandlers(upgradeCritChanceBtn, buyCritChance);
    addMobileButtonHandlers(upgradeCritMultBtn, buyCritMultiplier);
    addMobileButtonHandlers(upgradeHelperDmgBtn, buyHelperDamage);
    if (upgradeClickBtn) {
        upgradeClickBtn.addEventListener('mouseenter', () => showTooltip(translations[currentLanguage].tooltips.upgradeClick));
        upgradeClickBtn.addEventListener('mouseleave', hideTooltip);
    }
    if (upgradeHelperBtn) {
        upgradeHelperBtn.addEventListener('mouseenter', () => showTooltip(translations[currentLanguage].tooltips.upgradeHelper));
        upgradeHelperBtn.addEventListener('mouseleave', hideTooltip);
    }
    if (upgradeCritChanceBtn) {
        upgradeCritChanceBtn.addEventListener('mouseenter', () => showTooltip(translations[currentLanguage].tooltips.upgradeCritChance));
        upgradeCritChanceBtn.addEventListener('mouseleave', hideTooltip);
    }
    if (upgradeCritMultBtn) {
        upgradeCritMultBtn.addEventListener('mouseenter', () => showTooltip(translations[currentLanguage].tooltips.upgradeCritMult));
        upgradeCritMultBtn.addEventListener('mouseleave', hideTooltip);
    }
    if (upgradeHelperDmgBtn) {
        upgradeHelperDmgBtn.addEventListener('mouseenter', () => showTooltip(translations[currentLanguage].tooltips.upgradeHelperDmg));
        upgradeHelperDmgBtn.addEventListener('mouseleave', hideTooltip);
    }
    addMobileButtonHandlers(restartBtn, restartGame);
    addMobileButtonHandlers(shareBtn, shareResult);
    if (saveBtn) {
        saveBtn.addEventListener('click', saveGame);
        saveBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            saveGame();
        }, { passive: false });
    }
    // ИНИЦИАЛИЗАЦИЯ
    updateCoins();
    updateHUD();
    updateProgressBar();
    setLocation(currentLocation);
    // ИНИЦИАЛИЗАЦИЯ КНОПКИ СМЕНЫ ЯЗЫКА
    updateLanguageFlag();
    updateLangButtonTooltip();
    // ИСПРАВЛЕНИЕ: Вызов updateContinueButton после инициализации всех функций
    updateContinueButton();
    // Применяем переводы после инициализации
    updateAllTranslations();
    // Слушатель событий для изменения размера окна
    window.addEventListener('resize', function() {
        if (helperElement) {
            moveHelperToRandomPosition();
        }
    });
});
// Блокировка жестов масштабирования и выделения
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
}, { passive: false });
document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
}, { passive: false });
document.addEventListener('gestureend', function(e) {
    e.preventDefault();
}, { passive: false });