// Система достижений
(function() {
  const achievements = {
    novice: {
      id: 'novice',
      name: 'novice',
      icon: 'fas fa-rocket',
      target: 10,
      description: 'Разрушь 10 блоков',
      reward: 100
    },
    rich: {
      id: 'rich',
      name: 'rich',
      icon: 'fas fa-gem',
      target: 1000,
      description: 'Собери 1000 кристаллов',
      reward: 500
    },
    critMaster: {
      id: 'critMaster',
      name: 'critMaster',
      icon: 'fas fa-star',
      target: 50,
      description: 'Нанеси 50 критических ударов',
      reward: 300
    }
  };
  
  let achievementsPanelVisible = false;
  
  // Инициализация системы достижений
  function init() {
    createAchievementsPanel();
    setupEventHandlers();
    updateAchievementsDisplay();
    
    // Проверяем сохраненные достижения
    checkSavedAchievements();
  }
  
  // Создание панели достижений
  function createAchievementsPanel() {
    const achievementsContainer = document.getElementById('achievementsContainer');
    if (!achievementsContainer) return;
    
    // Убедимся, что кнопка и панель существуют
    const achievementsBtn = document.getElementById('achievementsBtn');
    const achievementsPanel = document.getElementById('achievementsPanel');
    
    if (!achievementsBtn || !achievementsPanel) return;
    
    // Добавляем прокрутку если достижений много
    achievementsPanel.style.overflowY = 'auto';
    achievementsPanel.style.maxHeight = '400px';
  }
  
  // Настройка обработчиков событий
  function setupEventHandlers() {
    const achievementsBtn = document.getElementById('achievementsBtn');
    const achievementsPanel = document.getElementById('achievementsPanel');
    
    if (achievementsBtn && achievementsPanel) {
      achievementsBtn.addEventListener('click', toggleAchievementsPanel);
      achievementsBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleAchievementsPanel();
      }, { passive: false });
      
      // Закрытие панели при клике вне ее
      document.addEventListener('click', (e) => {
        if (achievementsPanelVisible && 
            !achievementsPanel.contains(e.target) && 
            !achievementsBtn.contains(e.target)) {
          hideAchievementsPanel();
        }
      });
    }
  }
  
  // Переключение видимости панели достижений
  function toggleAchievementsPanel() {
    const achievementsPanel = document.getElementById('achievementsPanel');
    if (!achievementsPanel) return;
    
    if (achievementsPanelVisible) {
      hideAchievementsPanel();
    } else {
      showAchievementsPanel();
      
      // Скрываем панель магазина если она открыта
      if (window.shopSystem) {
        window.shopSystem.hideShopPanel();
      }
    }
  }
  
  function showAchievementsPanel() {
    const achievementsPanel = document.getElementById('achievementsPanel');
    if (achievementsPanel) {
      achievementsPanel.style.display = 'flex';
      achievementsPanelVisible = true;
      updateAchievementsDisplay();
    }
  }
  
  function hideAchievementsPanel() {
    const achievementsPanel = document.getElementById('achievementsPanel');
    if (achievementsPanel) {
      achievementsPanel.style.display = 'none';
      achievementsPanelVisible = false;
    }
  }
  
  // Обновление прогресса достижения
  function updateProgress(achievementId, increment = 1) {
    const gameState = window.gameState;
    const achievement = achievements[achievementId];
    
    if (!achievement || !gameState.achievements[achievementId]) return;
    
    // Если достижение уже разблокировано, ничего не делаем
    if (gameState.achievements[achievementId].unlocked) return;
    
    // Увеличиваем прогресс
    gameState.achievements[achievementId].progress += increment;
    
    // Проверяем, достигнута ли цель
    if (gameState.achievements[achievementId].progress >= achievement.target) {
      unlockAchievement(achievementId);
    } else {
      // Просто обновляем отображение
      updateAchievementDisplay(achievementId);
      window.saveGame();
    }
  }
  
  // Разблокировка достижения
  function unlockAchievement(achievementId) {
    const gameState = window.gameState;
    const achievement = achievements[achievementId];
    
    if (!achievement || !gameState.achievements[achievementId]) return;
    
    // Устанавливаем прогресс в точное значение цели
    gameState.achievements[achievementId].progress = achievement.target;
    gameState.achievements[achievementId].unlocked = true;
    
    // Награда за достижение
    gameState.coins += achievement.reward;
    
    // Обновляем отображение
    updateHUD();
    updateUpgradeButtons();
    updateAchievementDisplay(achievementId);
    
    // Показываем уведомление
    showAchievementNotification(achievementId);
    
    // Сохраняем игру
    window.saveGame();
    
    // Запускаем звук разблокировки
    playSound('upgradeSound');
    
    // Виброотдача если доступно
    if (navigator.vibrate) navigator.vibrate(200);
  }
  
  // Показ уведомления о разблокировке
  function showAchievementNotification(achievementId) {
    const achievement = achievements[achievementId];
    if (!achievement) return;
    
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 140, 0, 0.9));
      color: white;
      padding: 15px 25px;
      border-radius: 12px;
      z-index: 1000;
      text-align: center;
      font-family: 'Orbitron', sans-serif;
      font-weight: bold;
      box-shadow: 0 5px 15px rgba(0,0,0,0.5);
      animation: slideDown 0.5s ease-out;
      max-width: 300px;
      width: 80%;
    `;
    
    notification.innerHTML = `
      <div style="font-size: 1.5em; margin-bottom: 5px;">🏆 ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО!</div>
      <div style="font-size: 1.1em; margin-bottom: 8px;">${getAchievementName(achievementId)}</div>
      <div style="font-size: 0.9em; opacity: 0.9;">Награда: +${achievement.reward} кристаллов</div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.5s ease-in forwards';
      setTimeout(() => {
        if (notification.parentNode) document.body.removeChild(notification);
      }, 500);
    }, 3000);
    
    // Добавляем CSS для анимаций
    if (!document.getElementById('achievement-animations')) {
      const style = document.createElement('style');
      style.id = 'achievement-animations';
      style.textContent = `
        @keyframes slideDown {
          from { top: -100px; opacity: 0; }
          to { top: 20%; opacity: 1; }
        }
        @keyframes slideUp {
          from { top: 20%; opacity: 1; }
          to { top: -100px; opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Обновление отображения достижения
  function updateAchievementDisplay(achievementId) {
    const gameState = window.gameState;
    const achievement = achievements[achievementId];
    const achievementState = gameState.achievements[achievementId];
    
    if (!achievement || !achievementState) return;
    
    const achievementItem = document.getElementById(`achievement${capitalizeFirstLetter(achievementId)}`);
    if (!achievementItem) return;
    
    // Обновляем прогресс
    const progressElement = achievementItem.querySelector('.achievement-progress');
    if (progressElement) {
      if (achievementState.unlocked) {
        progressElement.textContent = window.translations[window.currentLanguage].achievements.unlocked;
        progressElement.style.color = '#4CAF50';
      } else {
        const progressText = window.translations[window.currentLanguage].achievements.progress || 'Прогресс';
        progressElement.textContent = `${progressText}: ${achievementState.progress}/${achievement.target}`;
        progressElement.style.color = '#4FC3F7';
      }
    }
    
    // Обновляем стиль если разблокировано
    if (achievementState.unlocked) {
      achievementItem.classList.add('unlocked');
      
      // Добавляем значок если его нет
      if (!achievementItem.querySelector('.achievement-badge')) {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.innerHTML = '✓';
        achievementItem.appendChild(badge);
      }
    } else {
      achievementItem.classList.remove('unlocked');
      
      // Удаляем значок если есть
      const badge = achievementItem.querySelector('.achievement-badge');
      if (badge) badge.remove();
    }
    
    // Обновляем переводы
    updateTranslations();
  }
  
  // Обновление отображения всех достижений
  function updateAchievementsDisplay() {
    Object.keys(achievements).forEach(achievementId => {
      updateAchievementDisplay(achievementId);
    });
  }
  
  // Обновление переводов
  function updateTranslations() {
    const achievementsPanel = document.getElementById('achievementsPanel');
    if (!achievementsPanel) return;
    
    const title = achievementsPanel.querySelector('h3');
    if (title) window.applyTranslation(title, 'achievements.title');
    
    Object.keys(achievements).forEach(achievementId => {
      const achievementItem = document.getElementById(`achievement${capitalizeFirstLetter(achievementId)}`);
      if (!achievementItem) return;
      
      const span = achievementItem.querySelector('span');
      if (span) {
        window.applyTranslation(span, `achievements.${achievementId}`);
      }
      
      // Обновляем текст прогресса
      const achievementState = window.gameState.achievements[achievementId];
      const progressElement = achievementItem.querySelector('.achievement-progress');
      
      if (progressElement && achievementState) {
        if (achievementState.unlocked) {
          progressElement.textContent = window.translations[window.currentLanguage].achievements.unlocked;
        } else {
          const progressText = window.translations[window.currentLanguage].achievements.progress || 'Прогресс';
          progressElement.textContent = `${progressText}: ${achievementState.progress}/${achievements[achievementId].target}`;
        }
      }
    });
  }
  
  // Проверка сохраненных достижений
  function checkSavedAchievements() {
    // Эта функция вызывается при загрузке для синхронизации прогресса
    // с текущими метриками игры
    
    const gameState = window.gameState;
    const gameMetrics = window.gameMetrics;
    
    // Синхронизируем достижение "Новичок" с количеством разрушенных блоков
    if (gameMetrics.blocksDestroyed > gameState.achievements.novice.progress) {
      gameState.achievements.novice.progress = Math.min(
        gameMetrics.blocksDestroyed, 
        achievements.novice.target
      );
    }
    
    // Синхронизируем достижение "Богач" с общим количеством заработанных кристаллов
    if (gameMetrics.totalCoinsEarned > gameState.achievements.rich.progress) {
      gameState.achievements.rich.progress = Math.min(
        gameMetrics.totalCoinsEarned, 
        achievements.rich.target
      );
    }
    
    // Синхронизируем достижение "Мастер крита" с количеством критических ударов
    if (gameMetrics.totalCrits > gameState.achievements.critMaster.progress) {
      gameState.achievements.critMaster.progress = Math.min(
        gameMetrics.totalCrits, 
        achievements.critMaster.target
      );
    }
    
    // Проверяем разблокировку достижений на основе текущего прогресса
    Object.keys(achievements).forEach(achievementId => {
      const achievement = achievements[achievementId];
      const achievementState = gameState.achievements[achievementId];
      
      if (!achievementState.unlocked && achievementState.progress >= achievement.target) {
        unlockAchievement(achievementId);
      }
    });
    
    updateAchievementsDisplay();
  }
  
  // Получение имени достижения
  function getAchievementName(achievementId) {
    const translations = window.translations[window.currentLanguage];
    if (translations && translations.achievements && translations.achievements[achievementId]) {
      return translations.achievements[achievementId];
    }
    return achievements[achievementId]?.description || achievementId;
  }
  
  // Вспомогательная функция
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Получение общего количества разблокированных достижений
  function getUnlockedCount() {
    const gameState = window.gameState;
    return Object.values(gameState.achievements).filter(a => a.unlocked).length;
  }
  
  // Получение общего количества достижений
  function getTotalCount() {
    return Object.keys(achievements).length;
  }
  
  // Экспорт функций
  window.achievementsSystem = {
    init,
    toggleAchievementsPanel,
    showAchievementsPanel,
    hideAchievementsPanel,
    updateProgress,
    unlockAchievement,
    updateAchievementsDisplay,
    updateTranslations,
    getAchievementName,
    getUnlockedCount,
    getTotalCount
  };
  
  // Инициализация при загрузке
  document.addEventListener('DOMContentLoaded', function() {
    // Небольшая задержка для гарантии загрузки других модулей
    setTimeout(() => {
      if (document.getElementById('achievementsBtn')) {
        init();
      }
    }, 100);
  });
})();