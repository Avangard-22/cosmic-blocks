// Глобальные переменные переводов
window.translations = {
    ru: {
        // UI элементы
        gameTitle: {
            mercury: "☿ Меркурий",
            venus: "♀ Венера",
            earth: "♁ Земля",
            mars: "♂ Марс",
            jupiter: "♃ Юпитер",
            saturn: "♄ Сатурн",
            uranus: "♅ Уран",
            neptune: "♆ Нептун",
            pluto: "♇ Плутон"
        },
        hud: {
            coins: "Кристаллы: ",
            clickPower: "Сила: ",
            critChance: "Крит: ",
            critMultiplier: "Множ: "
        },
        progressText: "Прогресс: {current} / {target} а.е. ({percent}%)",
        // Кнопки
        buttons: {
            save: "Сохранить игру",
            continue: "Продолжить",
            noSave: "Нет сохранения",
            start: "Новая игра",
            loadSave: "Продолжить сохраненную игру",
            newGame: "Начать новую игру",
            cancel: "Отмена",
            restart: "Новая добыча",
            share: "Поделиться",
            lang: "Сменить язык"
        },
        // Экраны
        welcome: {
            title: "🚀 КОСМИЧЕСКИЙ КЛИКЕР",
            text1: "Разрушайте восходящие блоки и собирайте <strong>космические Кристаллы</strong>!",
            text2: "Каждый блок требует определённого количества ударов для разрушения.",
            text3: "<strong>Реалистичная система прогресса:</strong>",
            text4: "🌌 <strong>Астрономические единицы</strong> — перемещайтесь по Солнечной системе",
            text5: "🪐 <strong>9 реальных планет</strong> — от Меркурия до Плутона",
            text6: "🚀 <strong>Улучшения</strong> — увеличивайте силу, криты и активируйте помощника",
            text7: "✨ <strong>Редкие блоки</strong> — дают бонусы и огромные награды!"
        },
        saveScreen: {
            title: "СОХРАНЕНИЕ ИГРЫ",
            text: "Хотите продолжить с сохраненной игры или начать новую?"
        },
        gameOver: {
            title: "ДОБЫЧА ПРЕРВАНА!",
            score: "Всего урона: {damage}"
        },
        tooltips: {
            saveSuccess: "Игра сохранена!",
            upgradeClick: "Сила удара<br>Нелинейный рост урона",
            upgradeHelper: "Bobo<br>Авто-атака на 1 минуту<br>+30% урона<br>+20% к кристаллам",
            upgradeCritChance: "Шанс крита<br>+0.1% шанс крит. урона",
            upgradeCritMult: "Множитель крита<br>+0.2x крит. урона",
            upgradeHelperDmg: "Урон Bobo<br>+20% урона за апгрейд",
            combo: "Комбо x{count}! +{bonus}",
            reward: "+{reward} 💎",
            helperAvailable: "Bobo активирован на 1 минуту!<br>Бонус к кристаллам: +20%",
            helperEnd: "Bobo закончил работу!",
            critChanceUpgrade: "Шанс крита +0.1%!<br>Теперь: {chance}%",
            critMultUpgrade: "Множитель крита +0.2x!<br>Теперь: x{mult}",
            helperDmgUpgrade: "Урон Bobo +20%!<br>Уровень: {level}",
            clickPowerUpgrade: "Сила увеличена!<br>Теперь: {power}",
            noSave: "Нет сохраненной игры!",
            shareSuccess: "+50 Кристаллов за распространение!",
            shopItemTimeWarp: "Замедляет движение блоков на 50% на 30 секунд",
            shopItemCrystalBoost: "Увеличивает награду за кристаллы на 50% на 1 минуту",
            shopItemPowerSurge: "Увеличивает силу удара на 50% на 45 секунд",
            achievementNovice: "Начните свое космическое приключение!",
            achievementRich: "Соберите богатство вселенной!",
            achievementCritMaster: "Станьте мастером критических ударов!"
        },
        rareBlocks: {
            gold: "Золотой",
            rainbow: "Радужный",
            crystal: "Кристальный",
            mystery: "Загадочный"
        },
        locationProgress: {
            unlocked: "Открыта локация: {location}!"
        },
        // Новые разделы для магазина и достижений
        shop: {
            title: "🛒 Магазин",
            timeWarp: "Искажение времени",
            crystalBoost: "Усилитель кристаллов",
            powerSurge: "Скачок силы",
            active: "АКТИВНО",
            buy: "Купить",
            descriptionTimeWarp: "Замедляет движение блоков на 50%",
            descriptionCrystalBoost: "+50% к кристаллам",
            descriptionPowerSurge: "+50% к силе удара",
            insufficientFunds: "Недостаточно кристаллов!",
            alreadyActive: "Бонус уже активен!",
            purchased: "Бонус активирован!"
        },
        achievements: {
            title: "🏆 Достижения",
            novice: "Новичок",
            rich: "Богач",
            critMaster: "Мастер крита",
            unlocked: "РАЗБЛОКИРОВАНО",
            progress: "Прогресс",
            descriptionNovice: "Разрушь 10 блоков",
            descriptionRich: "Собери 1000 кристаллов",
            descriptionCritMaster: "Нанеси 50 критических ударов",
            reward: "Награда: +{amount} кристаллов",
            new: "НОВОЕ ДОСТИЖЕНИЕ!"
        }
    },
    en: {
        // UI elements
        gameTitle: {
            mercury: "☿ Mercury",
            venus: "♀ Venus",
            earth: "♁ Earth",
            mars: "♂ Mars",
            jupiter: "♃ Jupiter",
            saturn: "♄ Saturn",
            uranus: "♅ Uranus",
            neptune: "♆ Neptune",
            pluto: "♇ Pluto"
        },
        hud: {
            coins: "Crystals: ",
            clickPower: "Power: ",
            critChance: "Crit: ",
            critMultiplier: "Mult: "
        },
        progressText: "Progress: {current} / {target} a.u. ({percent}%)",
        // Buttons
        buttons: {
            save: "Save game",
            continue: "Continue",
            noSave: "No save",
            start: "New game",
            loadSave: "Continue saved game",
            newGame: "Start new game",
            cancel: "Cancel",
            restart: "New game",
            share: "Share",
            lang: "Change language"
        },
        // Screens
        welcome: {
            title: "🚀 SPACE CLICKER",
            text1: "Destroy rising blocks and collect <strong>cosmic Crystals</strong>!",
            text2: "Each block requires a specific number of hits to destroy.",
            text3: "<strong>Realistic progress system:</strong>",
            text4: "🌌 <strong>Astronomical units</strong> - travel through the Solar System",
            text5: "🪐 <strong>9 real planets</strong> - from Mercury to Pluto",
            text6: "🚀 <strong>Upgrades</strong> - increase power, crits and activate assistant",
            text7: "✨ <strong>Rare blocks</strong> - provide bonuses and huge rewards!"
        },
        saveScreen: {
            title: "GAME SAVE",
            text: "Do you want to continue with the saved game or start a new one?"
        },
        gameOver: {
            title: "MINING INTERRUPTED!",
            score: "Total damage: {damage}"
        },
        tooltips: {
            saveSuccess: "Game saved!",
            upgradeClick: "Click power<br>Non-linear damage growth",
            upgradeHelper: "Bobo<br>Auto-attack for 1 minute<br>+30% damage<br>+20% to crystals",
            upgradeCritChance: "Crit chance<br>+0.1% crit hit chance",
            upgradeCritMult: "Crit multiplier<br>+0.2x crit damage",
            upgradeHelperDmg: "Bobo damage<br>+20% damage per upgrade",
            combo: "Combo x{count}! +{bonus}",
            reward: "+{reward} 💎",
            helperAvailable: "Bobo activated for 1 minute!<br>Crystals bonus: +20%",
            helperEnd: "Bobo has finished working!",
            critChanceUpgrade: "Crit chance +0.1%!<br>Now: {chance}%",
            critMultUpgrade: "Crit multiplier +0.2x!<br>Now: x{mult}",
            helperDmgUpgrade: "Bobo damage +20%!<br>Level: {level}",
            clickPowerUpgrade: "Power increased!<br>Now: {power}",
            noSave: "No saved game!",
            shareSuccess: "+50 Crystals for sharing!",
            shopItemTimeWarp: "Slows block movement by 50% for 30 seconds",
            shopItemCrystalBoost: "Increases crystal reward by 50% for 1 minute",
            shopItemPowerSurge: "Increases click power by 50% for 45 seconds",
            achievementNovice: "Start your space adventure!",
            achievementRich: "Gather universal wealth!",
            achievementCritMaster: "Become a master of critical hits!"
        },
        rareBlocks: {
            gold: "Gold",
            rainbow: "Rainbow",
            crystal: "Crystal",
            mystery: "Mystery"
        },
        locationProgress: {
            unlocked: "Unlocked location: {location}!"
        },
        // New sections for shop and achievements
        shop: {
            title: "🛒 Shop",
            timeWarp: "Time Warp",
            crystalBoost: "Crystal Boost",
            powerSurge: "Power Surge",
            active: "ACTIVE",
            buy: "Buy",
            descriptionTimeWarp: "Slows block movement by 50%",
            descriptionCrystalBoost: "+50% to crystals",
            descriptionPowerSurge: "+50% to click power",
            insufficientFunds: "Not enough crystals!",
            alreadyActive: "Bonus already active!",
            purchased: "Bonus activated!"
        },
        achievements: {
            title: "🏆 Achievements",
            novice: "Novice",
            rich: "Rich",
            critMaster: "Crit Master",
            unlocked: "UNLOCKED",
            progress: "Progress",
            descriptionNovice: "Destroy 10 blocks",
            descriptionRich: "Collect 1000 crystals",
            descriptionCritMaster: "Deal 50 critical hits",
            reward: "Reward: +{amount} crystals",
            new: "NEW ACHIEVEMENT!"
        }
    },
    zh: {
        // UI elements
        gameTitle: {
            mercury: "☿ 水星",
            venus: "♀ 金星",
            earth: "♁ 地球",
            mars: "♂ 火星",
            jupiter: "♃ 木星",
            saturn: "♄ 土星",
            uranus: "♅ 天王星",
            neptune: "♆ 海王星",
            pluto: "♇ 冥王星"
        },
        hud: {
            coins: "水晶: ",
            clickPower: "力量: ",
            critChance: "暴击: ",
            critMultiplier: "倍数: "
        },
        progressText: "进度: {current} / {target} 天文单位 ({percent}%)",
        // Buttons
        buttons: {
            save: "保存游戏",
            continue: "继续",
            noSave: "没有保存",
            start: "新游戏",
            loadSave: "继续保存的游戏",
            newGame: "开始新游戏",
            cancel: "取消",
            restart: "新游戏",
            share: "分享",
            lang: "更改语言"
        },
        // Screens
        welcome: {
            title: "🚀 太空点击器",
            text1: "摧毁上升的方块并收集<strong>宇宙水晶</strong>!",
            text2: "每个方块需要特定次数的点击才能摧毁。",
            text3: "<strong>真实的进度系统:</strong>",
            text4: "🌌 <strong>天文单位</strong> - 在太阳系中旅行",
            text5: "🪐 <strong>9颗真实行星</strong> - 从水星到冥王星",
            text6: "🚀 <strong>升级</strong> - 增加力量, 暴击和激活助手",
            text7: "✨ <strong>稀有方块</strong> - 提供奖励和巨大奖励!"
        },
        saveScreen: {
            title: "游戏保存",
            text: "您想继续保存的游戏还是开始新游戏？"
        },
        gameOver: {
            title: "开采中断!",
            score: "总伤害: {damage}"
        },
        tooltips: {
            saveSuccess: "游戏已保存!",
            upgradeClick: "点击力量<br>非线性伤害增长",
            upgradeHelper: "Bobo<br>自动攻击1分钟<br>+30%伤害<br>+20%水晶",
            upgradeCritChance: "暴击几率<br>+0.1%暴击命中几率",
            upgradeCritMult: "暴击倍数<br>+0.2x暴击伤害",
            upgradeHelperDmg: "Bobo伤害<br>+20%每次升级伤害",
            combo: "连击 x{count}! +{bonus}",
            reward: "+{reward} 💎",
            helperAvailable: "Bobo已激活1分钟!<br>水晶奖励: +20%",
            helperEnd: "Bobo已完成工作!",
            critChanceUpgrade: "暴击几率 +0.1%!<br>现在: {chance}%",
            critMultUpgrade: "暴击倍数 +0.2x!<br>现在: x{mult}",
            helperDmgUpgrade: "Bobo伤害 +20%!<br>等级: {level}",
            clickPowerUpgrade: "力量增加!<br>现在: {power}",
            noSave: "没有保存的游戏!",
            shareSuccess: "分享获得+50水晶!",
            shopItemTimeWarp: "30秒内方块移动速度降低50%",
            shopItemCrystalBoost: "1分钟内水晶奖励增加50%",
            shopItemPowerSurge: "45秒内点击力量增加50%",
            achievementNovice: "开始你的太空冒险!",
            achievementRich: "收集宇宙财富!",
            achievementCritMaster: "成为暴击大师!"
        },
        rareBlocks: {
            gold: "金色",
            rainbow: "彩虹",
            crystal: "水晶",
            mystery: "神秘"
        },
        locationProgress: {
            unlocked: "解锁位置: {location}!"
        },
        // Новые разделы для магазина и достижений
        shop: {
            title: "🛒 商店",
            timeWarp: "时间扭曲",
            crystalBoost: "水晶增强",
            powerSurge: "力量激增",
            active: "激活",
            buy: "购买",
            descriptionTimeWarp: "方块移动速度降低50%",
            descriptionCrystalBoost: "水晶奖励+50%",
            descriptionPowerSurge: "点击力量+50%",
            insufficientFunds: "水晶不足!",
            alreadyActive: "增益已激活!",
            purchased: "增益已激活!"
        },
        achievements: {
            title: "🏆 成就",
            novice: "新手",
            rich: "富人",
            critMaster: "暴击大师",
            unlocked: "已解锁",
            progress: "进度",
            descriptionNovice: "摧毁10个方块",
            descriptionRich: "收集1000个水晶",
            descriptionCritMaster: "造成50次暴击",
            reward: "奖励: +{amount} 水晶",
            new: "新成就!"
        }
    }
};

// Текущий язык
window.currentLanguage = localStorage.getItem('gameLanguage') || 'ru';

// Функция для форматирования строк с параметрами
window.formatString = function(template, params) {
    return template.replace(/{(\w+)}/g, (match, key) => {
        return params.hasOwnProperty(key) ? params[key] : match;
    });
};

// Функция для применения перевода к элементу
window.applyTranslation = function(element, keyPath, params = {}) {
    if (!element) return;
    const keys = keyPath.split('.');
    let translation = window.translations[window.currentLanguage];
    for (const key of keys) {
        if (translation && translation[key]) {
            translation = translation[key];
        } else {
            translation = undefined;
            break;
        }
    }
    if (translation === undefined) {
        console.warn(`Translation not found for ${keyPath} in ${window.currentLanguage}`);
        return;
    }
    if (typeof translation === 'string') {
        element.innerHTML = window.formatString(translation, params);
    } else if (typeof translation === 'object' && params.value) {
        element.innerHTML = translation + params.value;
    } else {
        element.innerHTML = translation;
    }
};

// Функция обновления флага языка
window.updateLanguageFlag = function() {
    const flagElement = document.getElementById('currentLangFlag');
    if (flagElement) {
        switch(window.currentLanguage) {
            case 'ru': flagElement.textContent = '🇷🇺'; break;
            case 'en': flagElement.textContent = '🇬🇧'; break;
            case 'zh': flagElement.textContent = '🇨🇳'; break;
        }
    }
};

// Функция переключения языка
window.switchLanguage = function() {
    const languages = ['ru', 'en', 'zh'];
    const currentIndex = languages.indexOf(window.currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    window.currentLanguage = languages[nextIndex];
    localStorage.setItem('gameLanguage', window.currentLanguage);
    
    window.updateLanguageFlag();
    
    // Обновляем все переводы в игре
    if (window.updateAllTranslations) {
        window.updateAllTranslations();
    }
    
    // Обновляем магазин и достижения если они существуют
    if (window.shopSystem && window.shopSystem.updateTranslations) {
        window.shopSystem.updateTranslations();
    }
    
    if (window.achievementsSystem && window.achievementsSystem.updateTranslations) {
        window.achievementsSystem.updateTranslations();
    }
};