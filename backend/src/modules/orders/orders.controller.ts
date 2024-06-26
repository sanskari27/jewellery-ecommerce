import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ORDER_STATUS } from '../../config/const';
import CustomError, { COMMON_ERRORS } from '../../errors';
import { CheckoutService } from '../../services';
import DateUtils from '../../utils/DateUtils';
import { Respond } from '../../utils/ExpressUtils';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function statistics(req: Request, res: Response, next: NextFunction) {
	try {
		return Respond({
			res,
			status: 200,
			data: {
				overall: await CheckoutService.generateTotalStats(),
				monthly: await CheckoutService.generateMonthStats(
					new Date('2024-01-01'),
					new Date('2050-01-01')
				),
			},
		});
	} catch (err) {
		next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function listAllOrders(req: Request, res: Response, next: NextFunction) {
	let list = await CheckoutService.getAllOrders();

	if (req.query.startDate && typeof req.query.startDate === 'string') {
		list = list.filter((o) =>
			DateUtils.getMoment(o.transaction_date, 'DD/MM/YYYY').isSameOrAfter(
				DateUtils.getMoment((req.query.startDate as string).split('T')[0], 'YYYY-MM-DD')
			)
		);
	}

	if (req.query.endDate && typeof req.query.endDate === 'string') {
		list = list.filter((o) =>
			DateUtils.getMoment(o.transaction_date, 'DD/MM/YYYY').isSameOrBefore(
				DateUtils.getMoment((req.query.endDate as string).split('T')[0], 'YYYY-MM-DD')
			)
		);
	}

	return Respond({
		res,
		status: 200,
		data: {
			orders: list,
		},
	});
}

async function orderDetails(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;
	const checkout_service = new CheckoutService(transaction_id);
	return Respond({
		res,
		status: 200,
		data: {
			order: await checkout_service.getDetails(),
		},
	});
}

async function listUserOrders(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
		data: {
			orders: await CheckoutService.getOrders(
				req.locals.session.id,
				(await req.locals.session.getEmailById()) ?? ''
			),
		},
	});
}

async function cancelOrder(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;
	const checkout_service = new CheckoutService(transaction_id);

	await checkout_service.cancelOrder();
	return Respond({
		res,
		status: 200,
	});
}

async function acceptReturn(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;
	const checkout_service = new CheckoutService(transaction_id);

	await checkout_service.acceptReturn();
	return Respond({
		res,
		status: 200,
	});
}

async function rejectReturn(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;
	const checkout_service = new CheckoutService(transaction_id);

	await checkout_service.rejectReturn();
	return Respond({
		res,
		status: 200,
	});
}

async function requestReturn(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;
	const checkout_service = new CheckoutService(transaction_id);
	await checkout_service.requestReturn();
	return Respond({
		res,
		status: 200,
	});
}

async function cancelReturnRequest(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;
	const checkout_service = new CheckoutService(transaction_id);
	await checkout_service.cancelReturnRequest();
	return Respond({
		res,
		status: 200,
	});
}

async function setTrackingID(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;

	const body = req.body.tracking_number;
	if (!body) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	const checkout_service = new CheckoutService(transaction_id);
	await checkout_service.setTrackingID(body);
	return Respond({
		res,
		status: 200,
	});
}

async function changeOrderStatus(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;

	const body = req.body.status;
	if (
		![
			ORDER_STATUS.PLACED,
			ORDER_STATUS.SHIPPED,
			ORDER_STATUS.CANCELLED,
			ORDER_STATUS.DELIVERED,
			ORDER_STATUS.UNINITIALIZED,
			ORDER_STATUS.RETURN_INITIATED,
			ORDER_STATUS.RETURN_ACCEPTED,
			ORDER_STATUS.REFUND_COMPLETED,
			ORDER_STATUS.RETURN_DENIED,
			ORDER_STATUS.REFUND_COMPLETED,
			ORDER_STATUS.RETURN_RAISED,
			ORDER_STATUS.REFUND_INITIATED,
		].includes(body)
	) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	const checkout_service = new CheckoutService(transaction_id);
	const success = await checkout_service.changeOrderStatus(body);
	return Respond({
		res,
		status: success ? 200 : 400,
	});
}

async function initiateRefund(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;

	if (!z.number().nonnegative().safeParse(req.body.amount).success) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	const amount = Number(req.body.amount);

	const checkout_service = new CheckoutService(transaction_id);
	const success = await checkout_service.initiateRefund(amount);
	return Respond({
		res,
		status: success ? 200 : 400,
	});
}

async function paymentCompleted(req: Request, res: Response, next: NextFunction) {
	const transaction_id = req.locals.id;

	const checkout_service = new CheckoutService(transaction_id);
	try {
		await checkout_service.markCODCompleted();
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}
}

const Controller = {
	listAllOrders,
	listUserOrders,
	initiateRefund,
	orderDetails,
	acceptReturn,
	cancelOrder,
	rejectReturn,
	requestReturn,
	setTrackingID,
	changeOrderStatus,
	cancelReturnRequest,
	paymentCompleted,
	statistics,
};

export default Controller;
