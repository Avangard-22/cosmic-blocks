// === ОБНОВЛЕННАЯ СИСТЕМА СОХРАНЕНИЯ ===
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

// Инициализация
updateContinueButton();