# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# АРХИТЕКТУРА

Все взаимодействия происходят через события. Модели вызывают события, слушатели событий:
- передают данные компонентам отображения
- выполняют вычисления между передачей
- меняют значения в моделях

# БАЗОВЫЙ КОД

### Класс Api

Поля:

- `baseUrl: string` - базовый URL типа `string`
- `options: RequestInit` - объект опций запроса

Через класс `Api` представляется доступа к серверу.

`constructor(baseUrl: string, options: RequestInit = {})` - конструктор принимает URL адрес типа строка и объект опций, который поумолчанию пустой. В объект можно передать заголовки запроса.

Методы:

- `handleResponse(response: Response): Promise<object>` - принимает ответ сервера типа `Response` и возвращает промис с ответом в формате json или сообщением об ошибке
- `get(uri: string): Promise<object>` - принимает адрес запроса типа `string` (запрос типа `GET`) и возвращает промис с ответом в формате json или сообщением об ошибке
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает адрес запроса типа `string` (запрос типа `POST`), данные, передаваемые в теле запроса, метод запроса из обьединения `ApiPostMethods` и возвращает промис с ответом в формате json или сообщением об ошибке

### 2. Класс Component

Класс `Component<T>`
Абстрактный класс, который позволяет создавать компоненты пользовательского интерфейса. С помощью класса можно управлять DOM элементами и поведением компонента. Наследуется всеми классами представления (`View`).

`constructor(container: HTMLElement)` - конструктор принимает `container` типа HTMLElement, в который будет помещен компонент.

#### Методы:
  - `toggleClass(element: HTMLElement, className: string, force?: boolean): void` - переключение класса, принимает HTML элемент, имя класса для смены типа `string`, параметр `force` типа `string`, где `force - true` - добавить класс, `false` - удалить класс
  - `setText(element: HTMLElement, value: unknown): void` - устанавливка текстового содержимого
  - `setImage(element: HTMLImageElement, src: string, alt?: string): void` - устанавливает изображения и альтернативный текст
  - `setDisabled(element: HTMLElement, state: boolean): void` - изменяет статус переданного элемента на `disabled`
  - `setHidden(element: HTMLElement): void`, `setVisible(element: HTMLElement): void` - меняют отображение и скрытие
  - `render(data?: Partial<T>): HTMLElement` - отображает компонент. Метод должен быть переназначен в дочерних классах!

### 3. Класс EventEmitter

Поля:

- `events: Map<EventName, Set<Subscriber>>` - хранилище событий и подписчиков

Класс `EventEmitter` 
реализует интерфейс IEvents и предназначен для управления событиями.

`constructor() { this._events = new Map<EventName, Set<Subscriber>>(); }` - не принимает аргументов, инициализация хранилища событий и подписчиков.

Методы:

- `on<T extends object>(eventName: EventName, callback: (data: T) => void): void` - Метод используется для подписки на событие. Принимает имя события `eventName` и функцию `callback`, которая будет вызываться при наступлении события.
- `off(eventName: EventName, callback: Subscriber): void` - Метод для отписки от события. Принимает имя события `eventName` и функцию обратного вызова `callback`, которая была использована при подписке на событие.
- `emit<T extends object>(eventName: string, data?: T): void` - Метод инициализации события. Принимает имя события `eventName` и необязательные данные `data`.
- `onAll(callback: (event: EmitterEvent) => void): void` - Метод для подписки на все события. Принимает функцию обратного вызова `callback`, которая будет вызываться при любом событии.
- `offAll(): void` - Метод для отписки от всех событий. Удаляет все подписки на события и очищает хранилище событий и подписчиков.
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void` - Метод создания триггера. Принимает имя события `eventName` и опциональный контекст `context`, который будет добавлен к данным события при инициализации. Возвращает функцию, которая инициализирует событие с переданными данными.

### 4. Класс Model

Класс `Model<T>` 
абстрактный базовый класс для создания моделей данных в сервисе. Он предоставляет базовый функционал для работы с данными и уведомлений о изменениях в данных. Класс наследуется другими классами.

`constructor(data: Partial<T>, protected events: IEvents)` -  Принимает частичные данные `data` типа `Partial` и объект брокера событий `events`, реализующий интерфейс `IEvents` и использующийся для уведомления об изменениях в данных.

Метод:
- `emitChanges(event: string, payload?: object)` - используется для сообщения об изменениях в модели. Принимает идентификатор события (`event`) и данные (`payload`), связанные с этим событием. Затем метод иммитирует событие через объект брокера событий.

## Классы модели данных
### 1. Класс AppState

Класс `AppState` - данные всего приложения. Позволяет отслеживать его состояние. Содержит следующие свойства:

- `catalog: ILot[]`: для отслеживания списка доступных лотов. Установка данного свойства вызывает событие `catalog:changed`.
- `basket: ILot[]`: для отслеживания лотов, находящихся в корзине.
- `order: IOrder`: отслеживает состояние заказа.
- `preview: ILot`: отслеживает лот, который используется для подробного изучения в модальном окне.

`AppState` наследует абстрактный класс `Model` и реализует его конструктор. Он описан выше.

Методы:

- `set catalog(items: ILot[])` - принимает массив лотов с интерфейсом `ILot` и устанавливает их в каталог
- `get catalog(): ILot[]` - геттер, возвращающий массив всех лотов. Лот удовлетворяет интерфейсу `ILot`
- `get basket(): ILot[]` - геттер, возвращающий все лоты в корзине
- `get order(): IOrder` - геттер, возвращающий заказ. Заказ удовлетворяет интерфейсу `IOrder`
- `get preview(): ILot` - геттер, возвращающий конкретный лот для предпросмотра
- `set preview(value: ILot)` - сеттер, устанавливающий лот для предпросмотра
- `isLotInBasket(item: ILot): boolean` - принимает лот с интерфейсом `ILot` и возвращает булево значение в зависимости от того, есть ли лот в корзине
- `getBasketIds(): string[]` - возвращает массив id типа строка всех лотов в корзине
- `clearBasket(): void` - совершает действие очистки корзины
- `getTotalAmount(): number` - возвращает полную стоимость корзины типа `number`
- `getBasketLength(): number` - возвращает число товаров в корзине типа `number`
- `initOrder(): IOrder` - инициализирует заказ и возвращает заказ с интерфейсом `IOrder`

### 2. Класс LotItem

Поля:

- `id: string` - идентификатор лота
- `id: string` - название лота
- `description: string` - описание лота
- `image: string` - URL картинки лота
- `category: ILotCategory` - категория лота из списка категорий
- `price: number` - цена лота
- `isOrdered: boolean` - поле, указывающее на то, добавлен ли лот в корзину или нет

Класс `LotItem` - данные отдельной карточки лота. Его структура определяется ответом сервера с добавлением свойств и методов, реализующих логику взаимодействия с корзиной через вызов события `lot:changed`.

Методы:

- `placeInBasket(): void` - добавляет лот в корзину
- `removeFromBasket(): void` - удаляет лот из корзины

### 3. Класс Order

Поля:

- `payment: IPaymentType = 'card'` - тип оплаты
- `address: string = ''` - адрес доставки
- `email: string = ''` - почта для связи
- `phone: string = ''` - телефон для связи
- `items: ILot[] = []` - массив выбранных лотов
- `formErrors: IFormErrors = {}` - ошибки валидации формы заказа

Класс `Order` - данные процесса оформления заказа.
- Содержит свойства, соответствующие полям формы оформления заказа.
- Валидирует эти свойства на наличие значений.
Изменения в любом из свойств вызывают проверку всех полей и генерацию события `formErrors:changed`.

Методы:

- `validateOrder(): void` - валидация полей формы
- `clearOrder(): void` - сброс формы
- `set payment(value: IPaymentType)` - установка типа оплаты
- `get payment()` - получение способа оплаты
- `validatePayment(): void` - проверка способа оплаты
- `set address(value: string)` - установка адреса
- `get address()` - получение адреса
- `validateAddress(): void` - проверка адреса доставки
- `set email(value: string)` - установка почты
- `get email()` - получение почты
- `validateEmail(): void` - проверка почты
- `set phone(value: string)` - установка телефона
- `get phone()` - получение телефона
- `validatePhone(): void` - проверка телефона
- `set items(value: ILot[])` - установка списка лотов в заказе
- `get items()` - получение списка лотов заказа
- `postOrder(): void` - отправка заказа

## Компоненты представления

### 1. Класс Basket

Класс `Basket` представляет собой корзину. Он позволяет задать следующие элементы:

- `list: HTMLElement`: список элементов в корзине.
- `total: HTMLElement`: общую стоимость корзины.
- `button: HTMLElement`: кнопку открытия формы оформления заказа. Вызов этой кнопки вызывает событие `order_payment:open`.

`constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);` конструкотор, вызывает внутри себя конструктор класса `Component`

Методы:

- `set items(items: HTMLElement[])` - утснавливаент элементы корзины
- `set total(total: number)` - устанавливает стоимость корзины
- `set valid(value: boolean)` - устанавливает валидность заказа и меняет состояние кнопки заказа

### 2. Класс BasketItem

Класс `BasketItem` - элементы корзины. Он позволяет задать следующие свойства:

- `index: HTMLElement`: номер элемента в корзине.
- `title: HTMLElement`: название элемента.
- `price: HTMLElement`: стоимость элемента.
- `deleteBtn: HTMLElement`: кнопку удаления элемента из корзины.

`constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
		super(container, events);` конструкотор, вызывает внутри себя конструктор класса `Component`

Методы: 

- `set index(value: number)` - устанавливает индекс лота в корзине
- `set title(value: string)` - устанавливает название лота
- `set price(value: number)` - устанавливает цену лота

### 3. Класс Card

Поля: 

- `category: HTMLElement` - Элемент для отображения категории
- `title: HTMLElement` - Элемент для отображения заголовка
- `image?: HTMLImageElement` - Элемент для отображения изображения
- `description: HTMLElement` - Элемент для отображения описания
- `button: HTMLButtonElement` - Элемент кнопки
- `price: HTMLElement` - Элемент для отображения цены

Класс `Card` - это карточка каждого лота.

`constructor(protected blockName: string, container: HTMLElement, events: IEvents, actions?: ICardActions) {
		super(container, events);` конструкотор, вызывает внутри себя конструктор класса `Component`

Методы: 

- `set category(value: ILotCategory)` - установка категории
- `set title(value: string)` - установка названия карточки
- `set image(value: string)` - утсановка картинка карточки
- `set description(value: string)` - установка описания карточки
- `set price(value: number)` - установка цены
- `set button(value: string)` - установка текста на кнопке

### 4. Класс ContactsForm

Класс `ContactsForm` наследуется от класса `Form` и представляет форму оформления заказа с контактной информацией.

Он позволяет задать следующие свойства:

- `email: HTMLInputElement`: почта.
- `phone: HTMLInputEle`: телефон.

`constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);` конструкотор, вызывает внутри себя конструктор класса `Form`

Метды: 

- `set phone(value: string)` - устновка телефона в форме
- `set email(value: string)` - установка почты в форме

### 5. Класс DeliveryForm

Класс `DeliveryForm` наследуется от класса `Form` и представляет форму оформления заказа с информацией об способе оплаты и адресом доставки.

Он позволяет задать следующие свойства:

- `payment: IPaymentType`: способ оплаты.
- `address: string`: адрес доставки.

Методы: 

- `setClassPaymentMethod(className: string): void` - управление стилем кнопки в зависимости от выбранного способа оплаты
- `set payment(value: string)` - установка способа оплаты
- `set address(value: IPaymentType)` - установка адреса

### 6. Класс Form

Класс `Form` - базовая форма. Он позволяет задать следующие элементы:

- `submit: HTMLButtonElement`: кнопка отправки формы.
- `errors: HTMLElement`: отображение ошибок валидации.

`constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);` конструкотор, вызывает внутри себя конструктор класса `Component`

На все отображение привязывается событие `input` для вызова событий вида `container.field:change` и событие `container:submit`.

Методы: 

- `onInputChange(field: keyof T, value: string): void` - обработка изменений в поле ввода
- `set valid(value: boolean)` - установка состояния валидности
- `set errors(value: string[])` - установка сообщений об ошибках
- `render(state: Partial<T> & IFormState): HTMLFormElement` - рендер формы с указанным состоянием

### 7. Класс Modal

Класс `Modal` - модальное окно. Он позволяет задать следующие элементы:

- `content: HTMLElement`: отображение внутреннего содержимого модального окна.
- `closeButton: HTMLButtonElement`: для отображения кнопки закрытия модалки.

`constructor(container: HTMLElement, events: IEvents) {
		super(container, events);` конструкотор, вызывает внутри себя конструктор класса `Component`

Класс привязывает событие закрытия модального окна `modal:close` к кликам по кнопке закрытия формы и по родительскому контейнеру модального окна.

Методы: 

- `set content(value: HTMLElement)` - установка содержимого
- `open(): void` - открытие модального окна
- `close(): void` - закрытие модельного окна
- `render(data: IModalData): HTMLElement` - рендер модального окна

### 8. Класс Page

Класс `Page` - всея страница. Он позволяет задать следующие элементы:

- `counter: HTMLElement`: отображение количества товаров в корзине.
- `gallery: HTMLElement`: отображение доступных лотов.
- `wrapper: HTMLElement`: обёртка, позволяющая блокировать прокрутку страницы при открытии модального окна.
- `basket: HTMLButtonElement`: кнопка отображения корзины. Клик по кнопке вызывает событие `basket:open`.

`constructor(container: HTMLElement, events: IEvents) {
		super(container, events);` конструкотор, вызывает внутри себя конструктор класса `Component`

Методы: 
 - `set counter(value: number)` - установка количества лотов в корзине
 - `set galery(items: HTMLElement[])` - обновление списка карточек в галерее
 - `set locked(value: boolean)` - обработка блокировки прокрутки страницы

### 9. Класс Success

Класс `Success` определяет отображение основной информации об оформленном заказе, такой как общая сумма заказа.

Поля: 

- `close: HTMLElement` - Элемент для закрытия страницы
- `protected _total: HTMLElement` - Элемент для отображения общей стоимости заказа

` constructor(container: HTMLElement, events: IEvents, actions: ISuccessActions) {
        super(container, events);` конструкотор, вызывает внутри себя конструктор класса `Component`

 Методы:

 - `set total(value: number)` - установка общей стоимости заказа

## СВЯЗИ

### LarekAPI

**Поля:**
- `cdn: string` - URL для CDN

`constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);` - конструкотор, вызывает внутри себя конструктор класса `Api`

**Методы:**
- `getLotItem(id: string): Promise<ILot>`: Запрос информации по лоту.
- `getLotList(): Promise<ILot[]>`: Запрос информации по всем лотам.
- `postOrderLots(order: IOrderAPI): Promise<IOrderResult>`: Оформление заказа.

## Типы данных
```typescript
Интерфейс лота:

interface ILot {
	id: string; // идентификационный номер лота
	title: string; //имя лота
	description: string; //описание лота
	image: string; //картинка лота
	category: ILotCategory; //категория лота
	price: number; //стоимость лота
	isOrdered: boolean; //показывает заказан лот или нет
	placeInBasket: () => void; //размещает лот в корзине
	removeFromBasket: () => void; //удаляет лот из корзины
}

Интерфейс приложения:

interface IAppState {
    catalog: ILot[]; // каталог лотов
    basket: ILot[]; // лоты в корзине
    order: IOrder; // заказ
    preview: ILot; // предпросмотр лота
    isLotInBasket(item: ILot): boolean; // проверка находится ли лот в корзине
    clearBasket(): void; // очистка корзины
    getTotalAmount(): number; // получение стоимости корзины
    getBasketIds(): number[]; // получение списка индексов лотов в корзине
    getBasketLength(): number; // получение количества товаров в корзине
    initOrder(): IOrder; // инициализация объекта заказа
}

Модель заказа:

interface IOrder {
    payment: IPaymentType; // тип оплаты заказа
    address: string; // адрес доставки
    email: string; // почта
    phone: string; // телефон
    items: ILot[]; // объекты лотов в корзине
    formErrors: IFormErrors; // ошибки валидации формы
    validateOrder(): void; // валидация полей формы
    clearOrder(): void; // очистка заказа
    validatePayment(): void; // валидация способа оплаты
    validateAddress(): void; // валидация адреса доставки
    validateEmail(): void; // валидация почты
    validatePhone(): void; // валидация телефона
    postOrder(): void; // отправка заказа
}

События:

enum Events {
    // загрузка доступные лоты
	LOAD_LOTS = 'catalog:changed',
    // открытие карточки лота для просмотра
	OPEN_LOT = 'card:open',
    // открытие корзину
	OPEN_BASKET = 'basket:open',
    // добавление/удаление лота из корзины
	CHANGE_LOT_IN_BASKET = 'lot:changed',
    // валидация формы отправки
	VALIDATE_ORDER = 'formErrors:changed',
    // начинаем оформление заказа
	OPEN_FIRST_ORDER_PART = 'order_payment:open',
    // заполнение первой формы
	FINISH_FIRST_ORDER_PART = 'order:submit',
    // продолжаем оформление заказа
	OPEN_SECOND_ORDER_PART = 'order_contacts:open',
    // окончание заполнения второй формы
	FINISH_SECOND_ORDER_PART = 'contacts:submit',
    // завершение заказ
	PLACE_ORDER = 'order:post',
    // выбор способа оплаты
	SELECT_PAYMENT = 'payment:changed',
    // ввод адреса доставки
	INPUT_ORDER_ADDRESS = 'order.address:change',
    // ввод почты
	INPUT_ORDER_EMAIL = 'contacts.email:change',
    // ввод телефона
	INPUT_ORDER_PHONE = 'contacts.phone:change',
    // открытие модального окна
	OPEN_MODAL = 'modal:open',
    // закрытие модального окна
	CLOSE_MODAL = 'modal:close'
}
