import './scss/styles.scss';

import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LocalApi } from './components/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Card } from './components/views/Card';
import { Success } from './components/views/Success';
import {
	CatalogChangeEvent,
	Events,
	IFormErrors,
	ILot,
	IPaymentType,
} from './types';
import { State } from './components/models/State';
import { DeliveryForm } from './components/views/DeliveryForm';
import { ContactsForm } from './components/views/ContactsForm';
import { BasketItem } from './components/views/BasketItem';

const api = new LocalApi(CDN_URL, API_URL);
const events = new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new State({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryForm = new DeliveryForm(cloneTemplate(deliveryTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);



events.on<CatalogChangeEvent>(Events.LOAD_LOTS, () => {
	page.galery = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit(Events.OPEN_LOT, item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

events.on(Events.OPEN_BASKET, () => {
	modal.render({
		content: basket.render({
			valid: appData.getBasketLength() > 0,
		}),
	});
});

events.on(Events.OPEN_LOT, (item: ILot) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => {
			if (appData.isLotInBasket(item)) {
				item.removeFromBasket();
			} else {
				item.placeInBasket();
			}
			events.emit(Events.OPEN_LOT, item);
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			button: item.isOrdered ? 'Удалить из корзины' : 'Купить',
		}),
	});
});

events.on(Events.CHANGE_LOT_IN_BASKET, () => {
	page.counter = appData.getBasketLength();

	basket.items = appData.basket.map((item, index) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), events, {
			onClick: (event) => {
				item.removeFromBasket();
				events.emit(Events.OPEN_BASKET);
			},
		});
		return card.render({
			index: index,
			title: item.title,
			price: item.price,
		});
	});

	basket.total = appData.getTotalAmount();
});

events.on(Events.OPEN_FIRST_ORDER_PART, () => {
	const order = appData.initOrder();
	modal.render({
		content: deliveryForm.render({
			payment: order.payment,
			address: order.address,
			valid: false,
			errors: [],
		}),
	});
});

events.on(Events.SELECT_PAYMENT, (data: { target: string }) => {
	appData.order.payment = data.target as IPaymentType;
});

events.on(Events.INPUT_ORDER_ADDRESS, (data: { value: string }) => {
	appData.order.address = data.value;
});

events.on(Events.INPUT_ORDER_EMAIL, (data: { value: string }) => {
	appData.order.email = data.value;
});

events.on(Events.INPUT_ORDER_PHONE, (data: { value: string }) => {
	appData.order.phone = data.value;
});

events.on(Events.VALIDATE_ORDER, (errors: Partial<IFormErrors>) => {
	const { payment, address, email, phone } = errors;
	deliveryForm.valid = !payment && !address;
	contactsForm.valid = !email && !phone;
	deliveryForm.errors = Object.values({ payment, address })
		.filter((i) => typeof i === 'string')
		.map((i) => i.toString());
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => typeof i === 'string')
		.map((i) => i.toString());
});

events.on(Events.FINISH_FIRST_ORDER_PART, () => {
	events.emit(Events.OPEN_SECOND_ORDER_PART);
});

events.on(Events.OPEN_SECOND_ORDER_PART, () => {
	const order = appData.order;
	modal.render({
		content: contactsForm.render({
			email: order.email,
			phone: order.phone,
			valid: false,
			errors: [],
		}),
	});
});

events.on(Events.FINISH_SECOND_ORDER_PART, () => {
	const order = appData.order;

	api
		.postOrderLots({
			payment: order.payment,
			address: order.address,
			email: order.email,
			phone: order.phone,
			total: appData.getTotalAmount(),
			items: appData.getBasketIds(),
		})
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), events, {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});

			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on(Events.OPEN_MODAL, () => {
	page.locked = true;
});

events.on(Events.CLOSE_MODAL, () => {
	page.locked = false;
});



api
	.getLotList()
	.then((res) => {
		appData.catalog = res;
	})
	.catch(console.error);
