import { Events } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

/**
 * Интерфейс данных модального окна
 * @property { HTMLElement } content - отображаемое содержимое
 */
interface IModalData {
	content: HTMLElement;
}

class Modal extends Component<IModalData> {
	private _closeButton: HTMLButtonElement;
	private _content: HTMLElement;

	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLElement } container - родительский контейнер для элементов модального окна
	 * @param { IEvents } events - брокер событий
	 */
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		[this._closeButton, this.container].forEach((element) => {
			element.addEventListener('click', () => {
				this.close();
			});
		});
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open(): void {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit(Events.OPEN_MODAL);
	}

	close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = null;
		this.events.emit(Events.CLOSE_MODAL);
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}

export { Modal };
