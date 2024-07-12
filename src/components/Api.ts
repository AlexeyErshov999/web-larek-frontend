import { Api, ApiListResponse } from './base/api';
import { ILot, IOrderAPI } from '../types';

/**
 * Интерфейс API для сервиса web-larek
 * @method getLotItem - получить информацию по конкретному лоту
 * @method getLotList - выгрузить все доступные лоты
 * @method postOrderLots - отправить на сервер запрос на оформление заказа
 */
interface ILocalApi {
	getLotItem: (id: string) => Promise<ILot>;
	getLotList: () => Promise<ILot[]>;
	postOrderLots: (order: IOrderAPI) => Promise<IOrderResult>;
}

/**
 * Интерфейс ответа на post запроса на оформление заказа
 * @property {string} id - идентификатор заказа
 * @property {number} total - общая стоимость заказа
 */
interface IOrderResult {
	id: string;
	total: number;
}

class LocalApi extends Api implements ILocalApi {
	private readonly cdn: string;

	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { string } cdn используемый домен со статикой
	 * @param { string } baseUrl используемый домен сервера
	 * @param { RequestInit } options параметры запроса
	 */
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	/**
	 * Получить информацию по конкретному лоту
	 * @param { string } id идентификатор лота
	 * @returns { Promise<ILot> } объект лота
	 */
	getLotItem(id: string): Promise<ILot> {
		return this.get(`/product/${id}`).then((item: ILot) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	/**
	 * Выгрузить все доступные лоты
	 * @returns { Promise<ILot[]> } объекты лотов
	 */
	getLotList(): Promise<ILot[]> {
		return this.get('/product/').then((data: ApiListResponse<ILot>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	/**
	 * Отправить на сервер запрос на оформление заказа
	 * @param { IOrderAPI } order данные запроса
	 * @returns { Promise<IOrderResult> } результат запроса
	 */
	postOrderLots(order: IOrderAPI): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}

export { LocalApi };
