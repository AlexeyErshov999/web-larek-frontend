import { Events, ILot, ILotCategory } from '../../types';
import { Model } from '../base/Model';

class Lot extends Model<ILot> {
	id: string;
	title: string;
	description: string;
	image: string;
	category: ILotCategory;
	price: number;
	isOrdered: boolean;

	placeInBasket(): void {
		this.isOrdered = true;
		this.emitChanges(Events.CHANGE_LOT_IN_BASKET, { isOrdered: this.isOrdered });
	}

	removeFromBasket() {
		this.isOrdered = false;
		this.emitChanges(Events.CHANGE_LOT_IN_BASKET, { isOrdered: this.isOrdered });
	}
}

export { Lot };
