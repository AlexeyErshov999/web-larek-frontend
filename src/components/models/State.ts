import _ from 'lodash'; 
import { Events, IState, ILot, IOrder } from '../../types';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';
import { Lot } from './Lot';
import { Order } from './Order';

class State extends Model<IState> {
	private _catalog: ILot[];
	private _order: IOrder;
	private _preview: ILot;

	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { Partial<IAppState> } data - данные модели
	 * @param { IEvents } events - объект брокера событий
	 */
	constructor(data: Partial<IState>, events: IEvents) {
		super(data, events);
	}

	set catalog(items: ILot[]) {
		this._catalog = items.map((item) => new Lot(item, this.events));
		this.emitChanges(Events.LOAD_LOTS, { catalog: this.catalog });
	}

	get catalog(): ILot[] {
		return this._catalog;
	}

	get basket(): ILot[] {
		return this._catalog.filter((item) => item.isOrdered);
	}

	get order(): IOrder {
		return this._order;
	}

	get preview(): ILot {
		return this._preview;
	}

	set preview(value: ILot) {
		this._preview = value;
		this.emitChanges('preview:changed', this.preview);
	}

	/**
	 * Проверяем, находится ли лот в корзине
	 * @param { ILot } item - лот
	 * @returns { boolean } - результат проверки
	 */
	isLotInBasket(item: ILot): boolean {
		return item.isOrdered;
	}

	clearBasket(): void {
		this.basket.forEach((lot) => lot.removeFromBasket());
	}

	/**
	 * Получаем общую стоимость товаров в корзине
	 * @returns { number } - общая стоимость
	 */
	getTotalAmount(): number {
		return this.basket.reduce((a, c) => a + c.price, 0);
	}

	/**
	 * Получаем список индексов в корзине
	 * @returns { string[] } - список индексов
	 */
	getBasketIds(): string[] {
		return this.basket.map((item) => item.id);
	}

	/**
	 * Получаем количество товаров в корзине
	 * @returns { number } - количество товаров
	 */
	getBasketLength(): number {
		return this.basket.length;
	}

	/**
	 * Инициализируем объект заказа
	 * @returns { IOrder } - объект заказа
	 */
	initOrder(): IOrder {
		this._order = new Order({}, this.events);
		this.order.clearOrder();
		return this.order;
	}
}

export { State };
