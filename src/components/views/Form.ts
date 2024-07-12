import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component'; 
import { IEvents } from '../base/events'; 

/**
 * Интерфейс состояния формы
 * @property { boolean } valid - признак валидности формы
 * @property { string[] } errors - список ошибок на форме
 */
interface IFormState {
	valid: boolean;
	errors: string[];
}

class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	/**
	 * Базовый конструктор
	 * @constructor
	 * @param { HTMLFormElement } container - объект контейнера формы
	 * @param { IEvents } events - брокер событий
	 */
	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	/**
	 * Метод для обработки изменения значения поля ввода
	 * @param { keyof T } field - имя поля
	 * @param { string } value - новое значение поля
	 */
	protected onInputChange(field: keyof T, value: string): void {
		const eventName = `${this.container.name}.${String(field)}:change`;
		this.events.emit(eventName, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set errors(value: string[]) {
		this.setText(this._errors, value.join(', '));
	}

	render(state: Partial<T> & IFormState): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

export { Form };
