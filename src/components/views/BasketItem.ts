import { ensureElement, formatSinaps } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ICardActions } from './Card';
import { Component } from '../base/Component';

interface IBasketCard {
	index: number;
	title: string;
	price: number;
	delete: () => void;
}

class BasketItem extends Component<IBasketCard> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteBtn: HTMLButtonElement;

	/**
	 * Конструктор класса
	 * @constructor
	 * @param { HTMLElement } container - HTML-элемент контейнера (шаблона) карточки в корзине
	 * @param { IEvents } events - брокер событий для обработки событий карточки
	 * @param { ICardActions } actions - доступные действия для привязки
	 */
	constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
		super(container, events);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._deleteBtn = container.querySelector('.card__button');

		this._deleteBtn.addEventListener('click', (event: MouseEvent) => {
			actions?.onClick?.(event);
		});
	}

	set index(value: number) {
		this.setText(this._index, value + 1);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, formatSinaps(value));
	}
}

export { BasketItem };
