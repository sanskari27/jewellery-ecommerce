import { NextFunction, Request, Response } from 'express';
import CustomError, { ERRORS } from '../../errors';
import CollectionService from '../../services/collection';
import { Respond } from '../../utils/ExpressUtils';
import { CreateValidationResult } from './collection.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

async function listCollections(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
		data: {
			collections: await new CollectionService().listAll(),
		},
	});
}

async function homeCollections(req: Request, res: Response, next: NextFunction) {
	let list = await new CollectionService().listAll();
	list = list.filter((el) => el.visibleAtHome);

	return Respond({
		res,
		status: 200,
		data: {
			collections: list,
		},
	});
}

async function create(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateValidationResult;

	try {
		await new CollectionService().create(data.id, data.name, data.image);
	} catch (err) {
		return next(new CustomError(ERRORS.COMMON_ERRORS.ALREADY_EXISTS));
	}

	return Respond({
		res,
		status: 200,
		data: {
			id: data.id,
			name: data.name,
		},
	});
}

async function updateName(req: Request, res: Response, next: NextFunction) {
	const data = req.body.name as string;

	if (!data) {
		return next(new CustomError(ERRORS.COMMON_ERRORS.NOT_FOUND));
	}

	try {
		await new CollectionService().updateName(req.locals.collection_id, data);
	} catch (err) {
		return next(new CustomError(ERRORS.COMMON_ERRORS.ALREADY_EXISTS));
	}

	return Respond({
		res,
		status: 200,
	});
}

async function updateImage(req: Request, res: Response, next: NextFunction) {
	const data = req.body.image as string;

	try {
		await new CollectionService().updateImage(req.locals.collection_id, data);
	} catch (err) {
		return next(new CustomError(ERRORS.COMMON_ERRORS.ALREADY_EXISTS));
	}

	return Respond({
		res,
		status: 200,
	});
}

async function updateVisibility(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as boolean;

	await new CollectionService().updateHomeVisibility(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function deleteCollection(req: Request, res: Response, next: NextFunction) {
	await new CollectionService().remove(req.locals.collection_id);

	return Respond({
		res,
		status: 200,
	});
}

async function addTags(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as string[];

	await new CollectionService().addTag(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function replaceTags(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as string[];

	await new CollectionService().replaceTags(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function removeTags(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as string[];

	await new CollectionService().removeTags(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function setProducts(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as string[];

	await new CollectionService().setProducts(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function addProducts(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as string[];

	await new CollectionService().addProducts(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

async function removeProducts(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as string[];

	await new CollectionService().removeProducts(req.locals.collection_id, data);

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	listCollections,
	homeCollections,
	updateImage,
	create,
	updateVisibility,
	setProducts,
	addTags,
	replaceTags,
	removeTags,
	addProducts,
	removeProducts,
	updateName,
	deleteCollection,
};

export default Controller;
