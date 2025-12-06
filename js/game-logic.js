// Основная игровая логика с исправленной системой Bobo
(function() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Константы игры
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
  
  const locations = {
    mercury: { 
      name: "☿ Меркурий", 
      color: "#bb86fc", 
      coinColor: "#a0d2ff", 
      borderColor: "#4a55e0", 
      blockColors: ['#2962ff', '#4fc3f7', '#bb86fc', '#f8bbd0'] 
    },
    venus: { 
      name: "♀ Венера", 
      color: "#ffab91", 
      coinColor: "#a0d2ff", 
      borderColor: "#ff5722", 
      blockColors: ['#ff5722', '#ff9800', '#ff5722', '#e91e63'] 
    },
    earth: { 
      name: "♁ Земля", 
      color: "#80deea", 
      coinColor: "#a0d2ff", 
      borderColor: "#0288d1", 
      blockColors: ['#0288d1', '#29b6f6', '#00bcd4', '#00e5ff'] 
    },
    mars: { 
      name: "♂ Марс", 
      color: "#a5d6a7", 
      coinColor: "#a0d2ff", 
      borderColor: "#388e3c", 
      blockColors: ['#388e3c', '#66bb6a', '#9ccc65', '#d4e157'] 
    },
    jupiter: { 
      name: "♃ Юпитер", 
      color: "#ce93d8", 
      coinColor: "#a0d2ff", 
      borderColor: "#7b1fa2", 
      blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] 
    },
    saturn: { 
      name: "♄ Сатурн", 
      color: "#ce93d8", 
      coinColor: "#a0d2ff", 
      borderColor: "#7b1fa2", 
      blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] 
    },
    uranus: { 
      name: "♅ Уран", 
      color: "#ce93d8", 
      coinColor: "#a0d2ff", 
      borderColor: "#7b1fa2", 
      blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] 
    },
    neptune: { 
      name: "♆ Нептун", 
      color: "#ce93d8", 
      coinColor: "#a0d2ff", 
      borderColor: "#7b1fa2", 
      blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] 
    },
    pluto: { 
      name: "♇ Плутон", 
      color: "#ce93d8", 
      coinColor: "#a0d2ff", 
      borderColor: "#7b1fa2", 
      blockColors: ['#7b1fa2', '#9c27b0', '#ab47bc', '#e1bee7'] 
    }
  };
  
  let blockSpeed = isMobile ? 25 : 20;
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
  
  // DOM элементы
  let currentBlock = null;
  let currentBlockHealth = 0;
  
  // === ЦЕНТРАЛИЗОВАННАЯ СИСТЕМА УПРАВЛЕНИЯ BOBO ===
  window.boboSystem = {
    active: false,
    timeLeft: 0,
    element: null,
    attackInterval: null,
    timerInterval: null,
    coinBonus: 0,

    // Активация помощника
    activate: function(duration = 60000) {
      if (this.active) return;

      console.log('🎮 Bobo: Активация помощника');
      this.active = true;
      this.timeLeft = duration;
      this.coinBonus = 0.2; // +20% к кристаллам

      // Создаем визуальный элемент
      this.createElement();

      // Запускаем интервал атаки
      this.attackInterval = setInterval(() => {
        if (this.active && currentBlock && window.gameState.gameActive && !window.gameState.gamePaused) {
          this.attack();
        }
      }, 1500);

      // Запускаем таймер обратного отсчета
      this.timerInterval = setInterval(() => {
        if (!this.active) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
          return;
        }

        // Если игра на паузе, не уменьшаем время
        if (window.gameState.gamePaused) return;

        this.timeLeft -= 1000;
        if (this.timeLeft <= 0) {
          this.deactivate();
        }
        
        // Обновляем отображение таймера
        this.updateTimerDisplay();
      }, 1000);

      // Обновляем UI
      window.updateUpgradeButtons();
      window.updateHUD();
      this.updateTimerDisplay();

      // Показываем уведомление
      if (window.showTooltip) {
        window.showTooltip(window.translations[window.currentLanguage].tooltips.helperAvailable);
        setTimeout(window.hideTooltip, 2500);
      }

      // Сохраняем игру
      window.saveGame();
    },

    // Деактивация помощника
    deactivate: function() {
      console.log('🎮 Bobo: Деактивация помощника');
      
      this.active = false;
      this.coinBonus = 0;

      // Очищаем интервалы
      if (this.attackInterval) {
        clearInterval(this.attackInterval);
        this.attackInterval = null;
      }

      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      // Удаляем визуальный элемент
      if (this.element && this.element.parentNode) {
        this.element.style.opacity = '0';
        setTimeout(() => {
          if (this.element && this.element.parentNode) {
            document.body.removeChild(this.element);
            this.element = null;
          }
        }, 300);
      }

      // Обновляем UI
      window.updateUpgradeButtons();
      window.updateHUD();
      this.updateTimerDisplay();

      // Показываем уведомление
      if (window.showTooltip) {
        window.showTooltip(window.translations[window.currentLanguage].tooltips.helperEnd);
        setTimeout(window.hideTooltip, 1500);
      }

      // Сохраняем игру
      window.saveGame();
    },

    // Восстановление из сохранения
    restoreFromSave: function(savedState) {
      console.log('🎮 Bobo: Восстановление из сохранения', savedState);
      
      if (savedState.helperActive && savedState.helperTimeLeft > 0) {
        this.active = true;
        this.timeLeft = savedState.helperTimeLeft;
        this.coinBonus = savedState.boboCoinBonus || 0.2;

        // Создаем визуальный элемент
        this.createElement();

        // Запускаем интервалы с оставшимся временем
        this.attackInterval = setInterval(() => {
          if (this.active && currentBlock && window.gameState.gameActive && !window.gameState.gamePaused) {
            this.attack();
          }
        }, 1500);

        this.timerInterval = setInterval(() => {
          if (!this.active) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            return;
          }

          if (window.gameState.gamePaused) return;

          this.timeLeft -= 1000;
          if (this.timeLeft <= 0) {
            this.deactivate();
          }
          
          // Обновляем отображение таймера
          this.updateTimerDisplay();
        }, 1000);

        console.log('🎮 Bobo: Успешно восстановлен, осталось времени:', this.timeLeft);
        
        // Обновляем UI
        this.updateTimerDisplay();
      }
    },

    // Создание визуального элемента
    createElement: function() {
      if (this.element && this.element.parentNode) {
        document.body.removeChild(this.element);
      }

      this.element = document.createElement('div');
      this.element.className = 'helper';
      document.body.appendChild(this.element);
      this.moveToRandomPosition();

      // Плавное появление
      this.element.style.opacity = '0';
      setTimeout(() => {
        if (this.element) this.element.style.opacity = '1';
      }, 100);
    },

    // Перемещение в случайную позицию
    moveToRandomPosition: function() {
      if (!this.element) return;

      const safeDistance = 150;
      let attempts = 0;
      let validPosition = false;

      while (!validPosition && attempts < 20) {
        attempts++;
        
        // Генерируем случайную позицию, избегая краев и UI
        const randomX = Math.random() * (window.innerWidth - 100) + 50;
        const randomY = Math.random() * (window.innerHeight - 200) + 100;

        // Проверяем расстояние от текущего блока
        let distanceFromBlock = 0;
        if (currentBlock) {
          const blockRect = currentBlock.getBoundingClientRect();
          const blockCenterX = blockRect.left + blockRect.width / 2;
          const blockCenterY = blockRect.top + blockRect.height / 2;
          distanceFromBlock = Math.sqrt(
            Math.pow(randomX - blockCenterX, 2) + 
            Math.pow(randomY - blockCenterY, 2)
          );
        }

        // Проверяем, что позиция не перекрывает UI элементы
        const notInUI = randomX > 100 && randomX < window.innerWidth - 100 && 
                       randomY > 150 && randomY < window.innerHeight - 100;

        if ((!currentBlock || distanceFromBlock > safeDistance) && notInUI) {
          this.element.style.left = randomX + 'px';
          this.element.style.top = randomY + 'px';
          validPosition = true;
        }
      }

      // Если не нашли хорошую позицию, используем стандартную
      if (!validPosition) {
        this.element.style.left = (window.innerWidth * 0.7) + 'px';
        this.element.style.top = (window.innerHeight * 0.7) + 'px';
      }
    },

    // Атака помощника
    attack: function() {
      if (!currentBlock || !this.active || !this.element || !window.gameState.gameActive) return;

      // Создаем визуальный эффект атаки
      this.createEffect();

      // Рассчитываем урон
      const baseHelperDmg = window.gameState.clickPower * (1 + window.gameState.helperDamageBonus);
      const upgradedHelperDmg = baseHelperDmg * (1 + window.gameState.helperUpgradeLevel * 0.2);
      
      // Бонус от магазина (скачок силы)
      let finalHelperDmg = upgradedHelperDmg;
      if (window.gameState.shopItems && window.gameState.shopItems.powerSurge && window.gameState.shopItems.powerSurge.active) {
        finalHelperDmg *= 1.5;
      }

      // Наносим урон
      currentBlockHealth -= finalHelperDmg;
      window.gameState.totalDamageDealt += finalHelperDmg;
      window.gameMetrics.totalClicks++;

      // Показываем текст урона
      if (window.createDamageText) {
        window.createDamageText(Math.round(finalHelperDmg), currentBlock, '#69f0ae');
      }

      // Проверяем прогресс локации
      window.checkLocationUpgrade();

      // Проверяем, разрушен ли блок
      if (currentBlockHealth <= 0) {
        window.destroyBlock(currentBlock);
      } else {
        currentBlock.textContent = Math.floor(currentBlockHealth);
        window.updateCracks(currentBlock, currentBlockHealth);
      }
    },

    // Создание визуального эффекта атаки
    createEffect: function() {
      if (!currentBlock || !this.element) return;

      const blockRect = currentBlock.getBoundingClientRect();
      const helperRect = this.element.getBoundingClientRect();

      const beamContainer = document.createElement('div');
      beamContainer.className = 'helper-beam';
      beamContainer.style.position = 'absolute';
      beamContainer.style.zIndex = '13';
      document.body.appendChild(beamContainer);

      const startX = helperRect.left + helperRect.width / 2;
      const startY = helperRect.top + helperRect.height / 2;
      const endX = blockRect.left + blockRect.width / 2;
      const endY = blockRect.top + blockRect.height / 2;

      const canvas = document.createElement('canvas');
      const maxSize = Math.max(window.innerWidth, window.innerHeight);
      canvas.width = maxSize;
      canvas.height = maxSize;
      beamContainer.appendChild(canvas);

      beamContainer.style.left = '0px';
      beamContainer.style.top = '0px';

      const ctx = canvas.getContext('2d');
      let progress = 0;
      const animationDuration = 300;
      const startTime = Date.now();

      const animateBeam = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        progress = Math.min(elapsed / animationDuration, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (progress > 0) {
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;

          const gradient = ctx.createLinearGradient(startX, startY, currentX, currentY);
          gradient.addColorStop(0, 'rgba(105, 240, 174, 0.9)');
          gradient.addColorStop(0.7, 'rgba(105, 240, 174, 0.5)');
          gradient.addColorStop(1, 'rgba(105, 240, 174, 0)');

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(currentX, currentY);
          ctx.lineWidth = 4 + (4 * (1 - progress));
          ctx.strokeStyle = gradient;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(currentX, currentY, 8 * (1 - progress), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(105, 240, 174, ${0.7 * (1 - progress)})`;
          ctx.fill();
        }

        if (progress < 1) {
          requestAnimationFrame(animateBeam);
        } else {
          setTimeout(() => {
            if (beamContainer.parentNode) document.body.removeChild(beamContainer);
          }, 200);
        }
      };

      animateBeam();
      
      // Воспроизводим звук атаки
      window.playSound('helperSound');

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
    },

    // Пауза работы помощника
    pause: function() {
      console.log('🎮 Bobo: Пауза');
      if (this.attackInterval) {
        clearInterval(this.attackInterval);
        this.attackInterval = null;
      }
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    // Возобновление работы помощника
    resume: function() {
      console.log('🎮 Bobo: Возобновление');
      if (this.active && this.timeLeft > 0) {
        // Восстанавливаем интервал атаки
        this.attackInterval = setInterval(() => {
          if (this.active && currentBlock && window.gameState.gameActive) {
            this.attack();
          }
        }, 1500);

        // Восстанавливаем таймер
        this.timerInterval = setInterval(() => {
          if (!this.active) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            return;
          }

          this.timeLeft -= 1000;
          if (this.timeLeft <= 0) {
            this.deactivate();
          }
          
          // Обновляем отображение таймера
          this.updateTimerDisplay();
        }, 1000);
      }
    },
    
    // Обновление отображения таймера Bobo
    updateTimerDisplay: function() {
      const boboInfo = document.getElementById('bobo-info');
      const boboTime = document.getElementById('bobo-time');
      const boboTimer = document.getElementById('bobo-timer');
      const upgradeHelperBtn = document.getElementById('upgradeHelperBtn');
      
      if (this.active && this.timeLeft > 0) {
        // Форматируем время
        const minutes = Math.floor(this.timeLeft / 60000);
        const seconds = Math.floor((this.timeLeft % 60000) / 1000);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Обновляем HUD
        if (boboInfo && boboTime) {
          boboInfo.style.display = 'flex';
          boboTime.textContent = timeString;
        }
        
        // Обновляем таймер на кнопке
        if (boboTimer) {
          boboTimer.style.display = 'block';
          boboTimer.textContent = timeString;
          
          // Если осталось меньше 10 секунд, добавляем анимацию пульсации
          if (this.timeLeft < 10000) {
            boboTimer.style.animation = 'pulse 1s infinite';
            boboTimer.style.color = '#ff4444';
          } else {
            boboTimer.style.animation = '';
            boboTimer.style.color = '#69f0ae';
          }
        }
        
        // Обновляем tooltip кнопки улучшения
        if (upgradeHelperBtn) {
          const percent = Math.round(this.coinBonus * 100);
          const tooltipText = window.formatString(
            window.translations[window.currentLanguage].tooltips.boboActive || 'Bobo активен!<br>Осталось времени: {time}<br>Бонус к кристаллам: +{percent}%',
            { time: timeString, percent: percent }
          );
          upgradeHelperBtn.title = tooltipText;
        }
      } else {
        // Скрываем информацию о Bobo
        if (boboInfo) boboInfo.style.display = 'none';
        if (boboTimer) {
          boboTimer.style.display = 'none';
          boboTimer.style.animation = '';
        }
        
        // Восстанавливаем стандартный tooltip
        if (upgradeHelperBtn) {
          upgradeHelperBtn.title = window.translations[window.currentLanguage].tooltips.upgradeHelper || 'Bobo<br>Авто-атака на 1 минуту<br>+30% урона<br>+20% к кристаллам';
        }
      }
    }
  };

  // === ФУНКЦИИ ОБНОВЛЕНИЯ UI ДЛЯ BOBO ===
  
  // Обновление отображения статуса Bobo в HUD
  window.updateBoboHUD = function() {
    window.boboSystem.updateTimerDisplay();
  };
  
  // Обновление общего HUD
  window.updateHUD = function() {
    const coinsDisplay = document.getElementById('coins-value');
    const clickPowerDisplay = document.getElementById('clickPower-value');
    const critChanceDisplay = document.getElementById('critChance-value');
    const critMultiplierDisplay = document.getElementById('critMultiplier-value');
    
    if (coinsDisplay) coinsDisplay.textContent = Math.floor(window.gameState.coins).toLocaleString();
    if (clickPowerDisplay) clickPowerDisplay.textContent = Math.round(window.gameState.clickPower);
    if (critChanceDisplay) critChanceDisplay.textContent = `${(window.gameState.critChance * 100).toFixed(1)}%`;
    if (critMultiplierDisplay) critMultiplierDisplay.textContent = `x${window.gameState.critMultiplier.toFixed(1)}`;
    
    // Обновляем отображение Bobo
    window.updateBoboHUD();
  };

  // === ИСПРАВЛЕННЫЕ ФУНКЦИИ ПОКУПКИ И АКТИВАЦИИ ПОМОЩНИКА ===

  // Покупка помощника
  function buyHelper() {
    const cost = Math.floor(baseHelperUpgradeCost * Math.pow(1.4, window.gameState.helperUpgradeLevel));
    if (window.gameState.coins >= cost && !window.boboSystem.active) {
      window.gameState.coins -= cost;
      window.boboSystem.activate();
      window.updateHUD();
      window.updateUpgradeButtons();
      window.saveGame();
    }
  }

  // Обновление кнопок улучшений
  window.updateUpgradeButtons = function() {
    const clickCost = Math.floor(baseClickUpgradeCost * Math.pow(1.5, window.gameState.clickUpgradeLevel));
    const upgradeClickBtn = document.getElementById('upgradeClickBtn');
    
    if (upgradeClickBtn) {
      upgradeClickBtn.querySelector('.upgrade-cost').textContent = clickCost.toLocaleString();
      if (window.gameState.coins >= clickCost) {
        upgradeClickBtn.className = "upgrade-btn btn-available";
      } else {
        upgradeClickBtn.className = "upgrade-btn btn-unavailable";
      }
    }
    
    const helperCost = Math.floor(baseHelperUpgradeCost * Math.pow(1.4, window.gameState.helperUpgradeLevel));
    const upgradeHelperBtn = document.getElementById('upgradeHelperBtn');
    
    if (upgradeHelperBtn) {
      upgradeHelperBtn.querySelector('.upgrade-cost').textContent = helperCost.toLocaleString();
      if (window.gameState.coins >= helperCost && !window.boboSystem.active) {
        upgradeHelperBtn.className = "upgrade-btn btn-available";
      } else {
        upgradeHelperBtn.className = "upgrade-btn btn-unavailable";
      }
    }
    
    const critChanceCost = Math.floor(baseCritChanceCost * Math.pow(1.3, window.gameState.critChanceUpgradeLevel));
    const upgradeCritChanceBtn = document.getElementById('upgradeCritChanceBtn');
    
    if (upgradeCritChanceBtn) {
      upgradeCritChanceBtn.querySelector('.upgrade-cost').textContent = critChanceCost.toLocaleString();
      if (window.gameState.coins >= critChanceCost) {
        upgradeCritChanceBtn.className = "upgrade-btn btn-available";
      } else {
        upgradeCritChanceBtn.className = "upgrade-btn btn-unavailable";
      }
    }
    
    const critMultiplierCost = Math.floor(baseCritMultiplierCost * Math.pow(1.25, window.gameState.critMultiplierUpgradeLevel));
    const upgradeCritMultBtn = document.getElementById('upgradeCritMultBtn');
    
    if (upgradeCritMultBtn) {
      upgradeCritMultBtn.querySelector('.upgrade-cost').textContent = critMultiplierCost.toLocaleString();
      if (window.gameState.coins >= critMultiplierCost) {
        upgradeCritMultBtn.className = "upgrade-btn btn-available";
      } else {
        upgradeCritMultBtn.className = "upgrade-btn btn-unavailable";
      }
    }
    
    const helperDmgCost = Math.floor(baseHelperDmgCost * Math.pow(1.8, window.gameState.helperUpgradeLevel));
    const upgradeHelperDmgBtn = document.getElementById('upgradeHelperDmgBtn');
    
    if (upgradeHelperDmgBtn) {
      upgradeHelperDmgBtn.querySelector('.upgrade-cost').textContent = helperDmgCost.toLocaleString();
      if (window.gameState.coins >= helperDmgCost) {
        upgradeHelperDmgBtn.className = "upgrade-btn btn-available";
      } else {
        upgradeHelperDmgBtn.className = "upgrade-btn btn-unavailable";
      }
    }
  };

  // === ИСПРАВЛЕННАЯ ФУНКЦИЯ ЗАГРУЗКИ ИГРЫ ===
  function continueGame() {
    if (window.loadGame()) {
      // Восстанавливаем состояние Bobo из сохранения
      window.boboSystem.restoreFromSave(window.gameState);
      startGame(false);
    } else {
      if (window.showTooltip) {
        window.showTooltip(window.translations[window.currentLanguage].tooltips.noSave);
        setTimeout(window.hideTooltip, 2000);
      }
    }
  }

  // === ИСПРАВЛЕННАЯ ФУНКЦИЯ СТАРТА ИГРЫ ===
  function startGame(reset = true) {
    if (reset) {
      window.resetGame();
    } else {
      window.gameState.clickPower = calculateClickPower();
    }
    
    // Не деактивируем Bobo при продолжении игры
    if (reset && window.boboSystem) {
      window.boboSystem.deactivate();
    }
    
    // Очищаем интервалы
    if (window.boboSystem && window.boboSystem.attackInterval) {
      clearInterval(window.boboSystem.attackInterval);
      window.boboSystem.attackInterval = null;
    }
    
    if (window.boboSystem && window.boboSystem.timerInterval) {
      clearInterval(window.boboSystem.timerInterval);
      window.boboSystem.timerInterval = null;
    }
    
    const gameArea = document.getElementById('gameArea');
    if (gameArea) gameArea.innerHTML = "";
    
    const welcomeScreen = document.getElementById('welcomeScreen');
    const saveScreen = document.getElementById('saveScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    if (welcomeScreen) welcomeScreen.style.display = "none";
    if (saveScreen) saveScreen.style.display = "none";
    if (gameOverScreen) gameOverScreen.style.display = "none";
    
    window.gameState.gameActive = true;
    window.gameState.gamePaused = false;
    window.gameState.comboCount = 0;
    window.gameState.lastDestroyTime = 0;
    window.gameMetrics.startTime = Date.now();
    window.gameMetrics.blocksDestroyed = 0;
    window.gameMetrics.upgradesBought = 0;
    window.gameMetrics.totalClicks = 0;
    
    window.updateHUD();
    window.updateUpgradeButtons();
    window.updateProgressBar();
    setLocation(window.gameState.currentLocation);
    
    // Обновляем магазин и достижения
    if (window.shopSystem) window.shopSystem.updateShopDisplay();
    if (window.achievementsSystem) window.achievementsSystem.updateAchievementsDisplay();
    
    setTimeout(() => createMovingBlock(), 500);
  }

  // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (без изменений) ===
  
  function getCurrentSpeed() {
    const baseSpeed = blockSpeed;
    const locationIndex = Object.keys(locationRequirements).indexOf(window.gameState.currentLocation);
    if (locationIndex < 3) return baseSpeed * 0.85;
    return baseSpeed;
  }
  
  function calculateBlockHealth() {
    const currentReq = locationRequirements[window.gameState.currentLocation];
    const locationBonus = 1 + (currentReq.targetAU * 2);
    let baseHealth = balanceConfig.baseHealth * locationBonus;
    const targetHealth = window.gameState.clickPower * balanceConfig.targetClicks;
    const combinedHealth = (baseHealth + targetHealth) / 2;
    const randomFactor = balanceConfig.healthRandomRange.min + 
                        Math.random() * (balanceConfig.healthRandomRange.max - balanceConfig.healthRandomRange.min);
    return Math.floor(combinedHealth * randomFactor);
  }
  
  function calculateClickPower() {
    const basePower = 1;
    const upgradeBonus = window.gameState.clickUpgradeLevel;
    const diminishingEffect = Math.pow(balanceConfig.damageProgression.diminishingReturns, 
                                     Math.min(window.gameState.clickUpgradeLevel, balanceConfig.damageProgression.maxLevelEffect));
    const nonLinearGrowth = Math.sqrt(window.gameState.clickUpgradeLevel + 1);
    return basePower + (upgradeBonus * diminishingEffect * nonLinearGrowth * balanceConfig.damageProgression.baseMultiplier);
  }
  
  window.calculateClickPower = calculateClickPower;
  
  // ... (остальные вспомогательные функции остаются без изменений)

  // === ОБРАБОТЧИКИ СОБЫТИЙ ПАУЗЫ ===
  
  // Событие паузы игры (при открытии магазина/достижений)
  document.addEventListener('gamePaused', function() {
    if (window.boboSystem && window.boboSystem.active) {
      window.boboSystem.pause();
    }
  });

  // Событие возобновления игры
  document.addEventListener('gameResumed', function() {
    if (window.boboSystem && window.boboSystem.active) {
      window.boboSystem.resume();
    }
  });

  // === ИНИЦИАЛИЗАЦИЯ ИГРЫ ===
  
  // Обновление прогресс-бара
  window.updateProgressBar = function() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const currentReq = locationRequirements[window.gameState.currentLocation];
    const currentAU = window.gameState.totalDamageDealt / AU_TO_DAMAGE;
    const targetAU = currentReq.targetAU;
    const percentage = Math.min(100, (currentAU / targetAU) * 100);
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) {
      window.applyTranslation(progressText, 'progressText', {
        current: currentAU.toFixed(5),
        target: targetAU.toFixed(5),
        percent: percentage.toFixed(1)
      });
    }
  };
  
  // Проверка перехода на следующую локацию
  window.checkLocationUpgrade = function() {
    const currentReq = locationRequirements[window.gameState.currentLocation];
    const nextLocation = currentReq.nextLocation;
    const currentAU = window.gameState.totalDamageDealt / AU_TO_DAMAGE;
    const targetAU = currentReq.targetAU;
    
    if (nextLocation && currentAU >= targetAU) {
      setLocation(nextLocation);
      const tooltipText = window.formatString(
        window.translations[window.currentLanguage].locationProgress.unlocked, 
        { location: locations[nextLocation].name }
      );
      if (window.showTooltip) window.showTooltip(tooltipText);
      setTimeout(window.hideTooltip, 3000);
    }
    
    window.updateProgressBar();
  };
  
  // Установка локации
  function setLocation(loc) {
    window.gameState.currentLocation = loc;
    const gameTitle = document.getElementById('gameTitle');
    const header = document.getElementById('header');
    
    if (gameTitle) window.applyTranslation(gameTitle, `gameTitle.${loc}`);
    if (header) header.style.borderColor = locations[loc].borderColor;
    
    if (window.planetBackground) {
      window.planetBackground.setPlanet(loc);
    }
    
    const levelAnnounce = document.getElementById('levelAnnounce');
    if (levelAnnounce) {
      levelAnnounce.textContent = locations[loc].name;
      levelAnnounce.style.color = locations[loc].color;
      levelAnnounce.style.opacity = "1";
      setTimeout(() => {
        levelAnnounce.style.opacity = "0";
      }, 2000);
    }
    
    window.updateProgressBar();
  }
  
  // Инициализация обработчиков событий
  function initEventHandlers() {
    // ... (существующие обработчики остаются без изменений)
  }
  
  // Инициализация игры
  document.addEventListener('DOMContentLoaded', function() {
    initEventHandlers();
    window.updateHUD();
    window.updateUpgradeButtons();
    window.updateProgressBar();
    setLocation(window.gameState.currentLocation);
    window.updateLanguageFlag();
    window.updateContinueButton();
    window.updateAllTranslations();
    
    // Запускаем обновление таймера Bobo каждую секунду
    setInterval(() => {
      if (window.boboSystem && window.boboSystem.active) {
        window.boboSystem.updateTimerDisplay();
      }
    }, 1000);
  });
})();
