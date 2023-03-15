(function() {
  const selectors = [
    { selector: '[class*="arrow-left"]', name: 'Влево' }, // Добавляем события клика для стелок на карусели.
    { selector: '[class*="arrow-right"]', name: 'Вправо' }, // Добавляем события клика для стелок на карусели.
    { selector: '[class*="tab"]' }, // Добавляем события клика для табов.
    { selector: '[class*="accordion"]', descendant: '[class*="header"]' }, // Добавляем события клика для аккордеона.
    { selector: '[class*="submit"]' }, // Добавляем события клика для кнопки формы.
    { selector: '[class*="radio"]' }, // Добавляем события клика для радио кнопок.
    { selector: '[class*="jx-handle"]', name: 'Интерактивное сравнение фото' }, // Добавляем события клика для сравнивалки.
    { selector: 'video', name: 'Видео' }, // Добавляем события клика для видео.
  ];

  const hashCode = function(text) {
    var hash = 0;
    if (text.length == 0) {
        return hash;
    }
    for (var i = 0; i < text.length; i++) {
        var char = text.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  const cleanString = (str) => {
    return str.replace(/(^\s*)|(\s*$)/gi,"").replace(/[ ]{2,}/gi," ").replace(/[\r\n]+/g, ' ');
  };

  const truncate = (str) => {
    const maxWords = 15;
    const cleanedString = cleanString(str).split(' ');
    const ellipsis = cleanedString.length > maxWords ? '...' : '';

    return cleanedString.slice(0, maxWords).join(' ') + ellipsis;
  };


  const getChildSelectorAndText = (target) => {
    let targetSelector = target;

    // Добавляем события клика для карточкек grid.
    if (target.closest('[class*="grid"]')) {
      targetSelector = target.closest('[class*="grid"]');
      const descendantText = targetSelector.querySelector('[class*="__title"]');
      const descendantDescr = targetSelector.querySelector('[class*="descr"]');
      const descendantBtn = target.closest('[class*="btn"]');
      let textSelector = truncate(targetSelector.innerText);

      if (descendantText) {
        textSelector = truncate(descendantText.innerText);
      }

      if(!descendantText && descendantDescr) {
        textSelector = truncate(descendantDescr.innerText);
      }

      if (descendantBtn && descendantBtn.innerText) {
        textSelector += ` ${descendantBtn.innerText}`;
      }

      return [targetSelector, textSelector];
    }

    // Добавляем события клика для попапа.
    if (target.closest('[class*="product-full"]')) {
      targetSelector = target.closest('[class*="product-full"]');
      const descendantText = targetSelector.querySelector('[class*="__title"]');
      const descendantBtn = target.closest('a');
      let textSelector = truncate(descendantText.innerText);;

      if (descendantText && descendantBtn && descendantBtn.innerText) {
        textSelector += ` ${descendantBtn.innerText}`;
      }

      return [targetSelector, textSelector];
    }

    // Добавляем события клика для любого элемента с родителем ссылкой.
    if (target.closest('a')) {
      targetSelector = target.closest('a');
      let textSelector = targetSelector.innerText;

      // Если текста нет, предполагаем, что внутри картинка.
      if (!textSelector) {
        const descendantImg = targetSelector.querySelector('img');

        // Если img, то должен быть прописан alt текст.
        if (descendantImg) {
          textSelector = descendantImg.alt;
        }

        // Если текста нет, то скорее всего кнопка "наверх"
        const parentToTop = targetSelector.closest('[class="t190"]');
        if (parentToTop) {
          textSelector = 'Наверх';
        }
      }

      // Смотрим если есть заголовок у дитя, то отправляем его.
      const descendantTitle = targetSelector.querySelector('[class*="__title"]');
      if (descendantTitle) {
        textSelector = descendantTitle.innerText;
      }

      // Смотрим если есть заголовок у дитя, то отправляем его.
      const descendantName = targetSelector.querySelector('[class*="t-name"]');
      if (descendantName) {
        textSelector = descendantName.innerText;
      }

      textSelector = truncate(textSelector);

      const parentIsAccordion = targetSelector.closest('[class*="accordion"]');
      if (parentIsAccordion) {
        const accordionHeader = parentIsAccordion.querySelector('[class*="header"]');
        textSelector = `Аккордеон "${truncate(accordionHeader.innerText)}" гиперссылка "${textSelector}"`;
      }

      const parentIsMenusub = targetSelector.closest('[class="t-menusub"]');
      if (parentIsMenusub) {
        const menusubTargetLink = parentIsMenusub.closest('[class*="list_item"]').querySelector('[class*="t-menusub__target-link"]');
        textSelector = `${truncate(menusubTargetLink.innerText)}: ${textSelector}`;
      }

      return [targetSelector, textSelector];
    }

    for (let s of selectors) {
      if (target.closest(s.selector)) {
        targetSelector = target.closest(s.selector);
        const descendant = s.descendant ? targetSelector.querySelector(s.descendant) : null;
        const text = truncate(descendant ? descendant.innerText : (s.name || targetSelector.innerText));
        return [targetSelector, text];
      }
    }

    return [null, null];
  };

  window.scrollStat = (projectName, container, containerText) => {
    const hash =`A${hashCode(container)}_show`;
    $(container).appear();
    $(container).on('appear', function () {
      if (!window[hash]) {
        window[hash] = true;
        yaCounter32628510.params({
          "СпецПроекты": {
            [projectName]: {
              "Доскроллы": `Доскролл до элемента "${containerText}"`
            }
          }
        })
      }
    });
  };

  window.commonStatHandler = (projectName, containerText, [childSelector, childText]) => {
    if (childSelector && childText) {
      childText = cleanString(childText);
      yaCounter32628510.params({
        "СпецПроекты": {
          [projectName]: {
            [containerText]: `Нажатие на "${childText}"`
          }
        }
      });
    }
  };

  window.initCommonStat = (projectName, containers) => {
    containers.map(c => {
      const item = document.querySelector(c.selector);
      if (item) {
        item.addEventListener('click',
          (event) => commonStatHandler(projectName, c.name, getChildSelectorAndText(event.target))
        );
      }

      if (c.scrollTracking) {
        scrollStat(projectName, c.selector, c.name);
      }
    });
  };
})();
