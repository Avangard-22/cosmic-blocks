// Система сохранения игры

// Глобальные переменные сохранения
window.gameState = {
    coins: 0,
    totalDamageDealt: 0,
    clickPower: 1,
    clickUpgradeLevel: 0,
    currentLocation: 'mercury',
    critChance: 0.001,
    critMultiplier: 2.0,
    helperDamageBonus: 0.3,
    helperUpgradeLevel: 0,
    boboCoinBonus: 0,
    critChanceUpgradeLevel: 0,
    critMultiplierUpgradeLevel: 0,
    gameActive: false,
    helperActive: false,
    helperTimeLeft: 0,
    comboCount: 0,
    lastDestroyTime: 0,
    
    // Магазин
    shopItems: {
        timeWarp: { purchased: false, active: false, timeLeft: 0 },
        crystalBoost: { purchased: false, active: false, timeLeft: 0 },
        powerSurge: { purchased: false, active: false, timeLeft: 0 }
    },
    
    // Достижения
    achievements: {
        novice: { unlocked: false, progress: 0, target: 10 },
        rich: { unlocked: false, progress: 0, target: 1000 },
        critMaster: { unlocked: false, progress: 0, target: 50 }
    }
};

// Метрики игры
window.gameMetrics = {
    startTime: Date.now(),
    blocksDestroyed: 0,
    upgradesBought: 0,
    totalClicks: 0,
    sessions: 1,
    totalCrits: 0,
    totalCoinsEarned: 0
};

// Функция сохранения игры
window.saveGame = function() {
    const saveData = {
        gameState: {
            coins: window.gameState.coins,
            totalDamageDealt: window.gameState.totalDamageDealt,
            clickPower: window.gameState.clickPower,
            clickUpgradeLevel: window.gameState.clickUpgradeLevel,
            currentLocation: window.gameState.currentLocation,
            critChance: window.gameState.critChance,
            critMultiplier: window.gameState.critMultiplier,
            helperDamageBonus: window.gameState.helperDamageBonus,
            helperUpgradeLevel: window.gameState.helperUpgradeLevel,
            boboCoinBonus: window.gameState.boboCoinBonus,
            critChanceUpgradeLevel: window.gameState.critChanceUpgradeLevel,
            critMultiplierUpgradeLevel: window.gameState.critMultiplierUpgradeLevel,
            gameActive: window.gameState.gameActive,
            helperActive: window.boboSystem ? window.boboSystem.active : false,
            helperTimeLeft: window.boboSystem ? window.boboSystem.timeLeft : 0,
            comboCount: window.gameState.comboCount,
            lastDestroyTime: window.gameState.lastDestroyTime,
            shopItems: window.gameState.shopItems,
            achievements: window.gameState.achievements
        },
        gameMetrics: window.gameMetrics,
        timestamp: Date.now()
    };
    
    localStorage.setItem('cosmicBlocksSave', JSON.stringify(saveData));
    
    // Показываем уведомление
    if (window.showTooltip) {
        window.showTooltip(window.translations[window.currentLanguage].tooltips.saveSuccess);
        setTimeout(window.hideTooltip, 1500);
    }
    
    // Обновляем кнопку продолжения
    window.updateContinueButton();
};

// Функция загрузки игры
window.loadGame = function() {
    const saved = localStorage.getItem('cosmicBlocksSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            const saveAge = Date.now() - (data.timestamp || 0);
            const maxSaveAge = 30 * 24 * 60 * 60 * 1000; // 30 дней
            
            if (saveAge < maxSaveAge) {
                // Загружаем состояние игры
                if (data.gameState) {
                    window.gameState.coins = data.gameState.coins || 0;
                    window.gameState.totalDamageDealt = data.gameState.totalDamageDealt || 0;
                    window.gameState.clickPower = data.gameState.clickPower || 1;
                    window.gameState.clickUpgradeLevel = data.gameState.clickUpgradeLevel || 0;
                    window.gameState.currentLocation = data.gameState.currentLocation || 'mercury';
                    window.gameState.critChance = data.gameState.critChance || 0.001;
                    window.gameState.critMultiplier = data.gameState.critMultiplier || 2.0;
                    window.gameState.helperDamageBonus = data.gameState.helperDamageBonus || 0.3;
                    window.gameState.helperUpgradeLevel = data.gameState.helperUpgradeLevel || 0;
                    window.gameState.boboCoinBonus = data.gameState.boboCoinBonus || 0;
                    window.gameState.critChanceUpgradeLevel = data.gameState.critChanceUpgradeLevel || 0;
                    window.gameState.critMultiplierUpgradeLevel = data.gameState.critMultiplierUpgradeLevel || 0;
                    window.gameState.gameActive = data.gameState.gameActive || false;
                    window.gameState.helperActive = data.gameState.helperActive || false;
                    window.gameState.helperTimeLeft = data.gameState.helperTimeLeft || 0;
                    window.gameState.comboCount = data.gameState.comboCount || 0;
                    window.gameState.lastDestroyTime = data.gameState.lastDestroyTime || 0;
                    window.gameState.shopItems = data.gameState.shopItems || {
                        timeWarp: { purchased: false, active: false, timeLeft: 0 },
                        crystalBoost: { purchased: false, active: false, timeLeft: 0 },
                        powerSurge: { purchased: false, active: false, timeLeft: 0 }
                    };
                    window.gameState.achievements = data.gameState.achievements || {
                        novice: { unlocked: false, progress: 0, target: 10 },
                        rich: { unlocked: false, progress: 0, target: 1000 },
                        critMaster: { unlocked: false, progress: 0, target: 50 }
                    };
                }
                
                // Загружаем метрики
                if (data.gameMetrics) {
                    window.gameMetrics = {
                        ...window.gameMetrics,
                        ...data.gameMetrics,
                        sessions: (data.gameMetrics.sessions || 0) + 1
                    };
                }
                
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
};

// Функция сброса игры
window.resetGame = function() {
    window.gameState = {
        coins: 0,
        totalDamageDealt: 0,
        clickPower: 1,
        clickUpgradeLevel: 0,
        currentLocation: 'mercury',
        critChance: 0.001,
        critMultiplier: 2.0,
        helperDamageBonus: 0.3,
        helperUpgradeLevel: 0,
        boboCoinBonus: 0,
        critChanceUpgradeLevel: 0,
        critMultiplierUpgradeLevel: 0,
        gameActive: false,
        helperActive: false,
        helperTimeLeft: 0,
        comboCount: 0,
        lastDestroyTime: 0,
        shopItems: {
            timeWarp: { purchased: false, active: false, timeLeft: 0 },
            crystalBoost: { purchased: false, active: false, timeLeft: 0 },
            powerSurge: { purchased: false, active: false, timeLeft: 0 }
        },
        achievements: {
            novice: { unlocked: false, progress: 0, target: 10 },
            rich: { unlocked: false, progress: 0, target: 1000 },
            critMaster: { unlocked: false, progress: 0, target: 50 }
        }
    };
    
    window.gameMetrics = {
        startTime: Date.now(),
        blocksDestroyed: 0,
        upgradesBought: 0,
        totalClicks: 0,
        sessions: 1,
        totalCrits: 0,
        totalCoinsEarned: 0
    };
    
    localStorage.removeItem('cosmicBlocksSave');
};

// Функция обновления кнопки продолжения
window.updateContinueButton = function() {
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        const hasSave = localStorage.getItem('cosmicBlocksSave') !== null;
        if (hasSave) {
            continueBtn.className = 'btn save-available';
            window.applyTranslation(continueBtn, 'buttons.continue');
        } else {
            continueBtn.className = 'btn no-save';
            window.applyTranslation(continueBtn, 'buttons.noSave');
        }
    }
};

// Сохранение метрик
window.saveGameMetrics = function() {
    const metrics = {
        blocksDestroyed: window.gameMetrics.blocksDestroyed,
        upgradesBought: window.gameMetrics.upgradesBought,
        totalClicks: window.gameMetrics.totalClicks,
        sessions: window.gameMetrics.sessions,
        totalCrits: window.gameMetrics.totalCrits,
        totalCoinsEarned: window.gameMetrics.totalCoinsEarned,
        startTime: window.gameMetrics.startTime
    };
    
    localStorage.setItem('gameMetrics', JSON.stringify(metrics));
};

// Загрузка метрик
window.loadGameMetrics = function() {
    const saved = localStorage.getItem('gameMetrics');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            window.gameMetrics = {
                ...window.gameMetrics,
                ...data,
                sessions: (data.sessions || 0) + 1
            };
            return true;
        } catch (e) {
            console.warn('Ошибка загрузки метрик', e);
        }
    }
    return false;
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    window.loadGameMetrics();
    window.updateContinueButton();
});
