import { Events } from '../../types';
import { createElement, ensureElement, formatSinaps } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	valid: boolean;
}

class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(Events.OPEN_FIRST_ORDER_PART);
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, formatSinaps(total));
	}

	set valid(value: boolean) {
		this.setDisabled(this._button, !value);
	}
}

export { Basket };
