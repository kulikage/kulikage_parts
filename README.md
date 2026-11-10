# Kulikage Parts — сайт

Статический сайт (HTML + CSS + немного JS) для GitHub Pages. Сборка не нужна: что лежит в папке, то и публикуется.

## Что внутри

| Файл | Что это |
|---|---|
| `index.html` | Главная: подбор по машине, поиск по OEM-номеру, разделы Fix / Upgrade, «How we test», блок для опта |
| `vehicle-dacia-duster-ii-k9k-858.html` | Всё для Duster II K9K 858: схема, комплект, 4 стопорных, полный набор, круиз, фильтры |
| `product-k9k-858-seal-kit.html` | Карточка комплекта K2285850S |
| `product-equinox-intake.html` | Впуск для Equinox 2018 — «в разработке», подписка на запуск |
| `order.html` | Форма заказа / заявки на опт (подставляет товар из ссылки `?sku=…&qty=…&trade=1`) |
| `privacy.html` | **Черновик** политики конфиденциальности — проверить перед публикацией |
| `404.html` | Страница «не найдено» |
| `assets/css/style.css` | Все стили. Цвета и шрифты — в `:root` в начале файла |
| `assets/js/main.js` | Меню на телефоне, регион/валюта, подбор по машине, поиск по номеру, фильтры, отправка форм |
| `assets/img/logo.svg` | Логотип (он же иконка вкладки) |
| `.nojekyll` | Говорит GitHub Pages не обрабатывать сайт через Jekyll |

## Как опубликовать на GitHub Pages

1. На github.com → **New repository**, например `kulikage-site`, Public → Create.
2. В пустом репозитории: **Add file → Upload files** → перетащите **содержимое** распакованной папки (не сам zip и не папку целиком — `index.html` должен оказаться в корне репозитория). Скрытый файл `.nojekyll` браузер может не показать — это не страшно, сайт работает и без него.
3. **Commit changes**.
4. **Settings → Pages → Build and deployment**: Source — *Deploy from a branch*, Branch — `main`, папка `/ (root)` → **Save**.
5. Через минуту-две сайт откроется по адресу `https://<ваш-логин>.github.io/kulikage-site/`.

Через командную строку то же самое:

```bash
cd kulikage-site
git init -b main
git add .
git commit -m "New site"
git remote add origin https://github.com/<ваш-логин>/kulikage-site.git
git push -u origin main
```

### Когда переводить kulikage.parts на новый сайт

Пока этого не делайте — домен сейчас показывает старый сайт. Когда будете готовы:

1. **Settings → Pages → Custom domain** → `kulikage.parts` → Save (GitHub сам создаст файл `CNAME`).
2. У регистратора домена: A-записи для `kulikage.parts` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; CNAME для `www` → `<ваш-логин>.github.io`.
3. После проверки DNS включите **Enforce HTTPS**.

## Что заполнить перед публикацией

Всё, что в квадратных скобках, — заглушки. Найти их: поиск по `[` во всех `.html` файлах.

- `[PRICE]` — цены (на главной, в карточках, на странице машины)
- `[MATERIAL + HARDNESS — one value everywhere]`, `[RANGE, °C]` — материал и температура колец. Одно значение на всех страницах, в PDF и на маркетплейсах
- `[YEARS]`, `[VERIFY]` — годы применимости и Kangoo III
- `[SKU]` — артикулы стопорных, набора и круиза
- `[NUMBER]` — WhatsApp; `[LEGAL ENTITY NAME]` — юрлицо (в подвале каждой страницы)
- `[WARRANTY TERMS]`, `[MIN]`, `[TOOLS]`, `[Link to PDF install guide]`
- `data-stock="[yes/no]"` на странице машины — поставьте `yes` у того, что есть на складе, иначе фильтр «In stock only» скроет позицию
- Блок «Test data» и «Case study» — только реальные замеры. Пока замеров нет, эти блоки лучше удалить, а не оставлять с заглушками
- `privacy.html` — дописать скобки и проверить текст
- **Каталог PDF**: положите `WholesalePilotCatalog.pdf` в папку `assets/` — на него ведут кнопки «Download catalog»

## Фото вместо серых заглушек

Положите фото в `assets/img/` (лучше `.webp` или `.jpg`, до ~200 КБ, ширина 1200–1600 px для главного фото товара) и замените блок-заглушку на картинку, например:

```html
<!-- было -->
<div class="ph gallery-main">[Kit photo: 5 seals in labelled bag]</div>
<!-- стало -->
<img class="gallery-main" src="assets/img/k9k858-kit.webp" alt="K9K 858 seal kit: 5 seals in a labelled bag" style="object-fit:cover;width:100%">
```

## Формы

Формы отправляются через Formspree на тот же адрес, что и текущая форма опта (`FORM_ENDPOINT` в начале `assets/js/main.js`). Если в настройках формы на formspree.io включено ограничение по домену — добавьте туда `<ваш-логин>.github.io`, иначе заявки с нового адреса не дойдут. Каждая заявка приходит с полем `_subject`, по нему легко отличать заказы от подписок на впуск.

## Как добавить машину или товар

- **Подбор по машине** — объект `VEHICLES` в `assets/js/main.js`: марка → модель → двигатель → `page` (страница на сайте) или `sku` (открыть форму заказа с этим комплектом).
- **Поиск по номеру** — объект `PART_NUMBERS` там же. Номера пишутся без пробелов и дефисов, заглавными.
- **Новая карточка товара** — скопируйте `product-k9k-858-seal-kit.html`, поменяйте тексты, добавьте ссылку в `VEHICLES`/`PART_NUMBERS` и в список товаров в `order.html`.

M9R в подборе пока привязан только к Koleos: применимость на Trafic, X-Trail T31 и Laguna нужно подтвердить.
