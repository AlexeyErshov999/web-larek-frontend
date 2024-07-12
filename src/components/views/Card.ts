import { ILotCategory } from '../../types';
import { CATEGOTY_MAP } from '../../utils/constants';
import { ensureElement, formatSinaps } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

/**
 * Интерфейс карточки
 * @property { string } category - категория лота
 * @property { string } title - заголовок лота
 * @property { string } image - полный путь до файла картинки лота
 * @property { number } price - цена лота
 * @property { string } description - описание лота
 * @property { string } button - текст на кнопке добавления лота в заказ
 */
interface ICard {
	category: string;
	title: string;
	image: string;
	price: number;
	description: string;
	button?: string;
}

class Card extends Component<ICard> {
	private _category: HTMLElement;
	private _title: HTMLElement;
	private _image?: HTMLImageElement;
	private _description?: HTMLElement;
	private _button?: HTMLButtonElement;
	private _price?: HTMLElement;

	/**
	 * Конструктор класса Card
	 * @constructor
	 * @param { string } blockName - название блока
	 * @param { HTMLElement } container - контейнер, в котором будет отображаться карточка
	 * @param { IEvents } events - брокер событий
	 * @param { ICardActions } actions - действия, доступные для привязки
	 */
	constructor(
		protected blockName: string,
		container: HTMLElement,
		events: IEvents,
		actions?: ICardActions
	) {
		super(container, events);

		this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}


	set category(value: ILotCategory) {
		this.setText(this._category, value);
		this._category.className = '';
		const mainClass = `${this.blockName}__category`;
		const additionalClass = CATEGOTY_MAP[value];
		this._category.classList.add(mainClass, `${mainClass}_${additionalClass}`);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number) {
		this.setText(this._price, formatSinaps(value));
		this.setDisabled(this._button, value == null);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}

export { Card, ICardActions };
