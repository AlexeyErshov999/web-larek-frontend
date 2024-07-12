import { IEvents } from '../base/events'; 
import { Form } from './Form'; 

/**
 * Интерфейс формы с контактной информацией
 * @property { string } email - почта для связи
 * @property { string } phone - телефон для связи
 */
interface IOrderContactsForm {
	email: string;
	phone: string;
}

class ContactsForm extends Form<IOrderContactsForm> {
	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLFormElement } container - объект контейнера формы
	 * @param { IEvents } events - брокер событий
	 */
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	/**
	 * Устанавливаем значение телефона в форме
	 * @param { string } value - значение телефона для установки
	 */
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}

	/**
	 * Устанавливаем значение почты в форме
	 * @param { string } value - значение почты для установки
	 */
	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}
}

export { IOrderContactsForm, ContactsForm };
