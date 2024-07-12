export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	/**
	 * Создает новый экземпляр класса Api
	 * @constructor
	 * @param {string} baseUrl - Базовый URL API
	 * @param {RequestInit} options - Опции запроса
	 */
	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	/**
	 * Обрабатывает ответ от сервера
	 * @param {Response} response - Ответ от сервера
	 * @returns {Promise<object>} - Обработанный JSON-объект или сообщение об ошибке
	 */
	protected handleResponse(response: Response): Promise<object> {
		if (response.ok)
			return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	/**
	 * Выполняет GET-запрос к API
	 * @param {string} uri - Путь к конечной точке API
	 * @returns {Promise<object>} - Обработанный ответ от сервера
	 */
	get(uri: string): Promise<object> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	/**
	 * Выполняет POST-запрос к API
	 * @param {string} uri - Путь к конечной точке API
	 * @param {object} data - Данные, передаваемые в теле запроса (в формате JSON)
	 * @param {ApiPostMethods} method - HTTP-метод запроса (по умолчанию 'POST')
	 * @returns {Promise<object>} - Обработанный ответ от сервера
	 */
	post(
		uri: string,
		data: object,
		method: ApiPostMethods = 'POST'
	): Promise<object> {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}
