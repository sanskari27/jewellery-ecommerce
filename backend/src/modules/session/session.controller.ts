import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { JwtPayload, verify } from 'jsonwebtoken';
import {
	ADMIN_AUTH_COOKIE,
	ADMIN_EMAIL,
	ADMIN_PASSWORD,
	AUTH_COOKIE,
	GOOGLE_AUTH_PASSWORD,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URL,
	IS_PRODUCTION,
	JWT_SECRET,
	SESSION_COOKIE,
	TRANSACTION_COOKIE,
} from '../../config/const';
import CustomError, { COMMON_ERRORS, ERRORS } from '../../errors';
import { SessionService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../../utils/email';
import {
	GoogleLoginValidationResult,
	LoginValidationResult,
	ResetPasswordValidationResult,
	UpdatePasswordValidationResult,
} from './session.validator';
export const SESSION_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

const oAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL);

async function listUsers(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
		data: {
			users: await SessionService.listUser(),
		},
	});
}

async function createSession(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];
	const _auth_id = req.cookies[AUTH_COOKIE];

	if (_auth_id) {
		try {
			const decoded = verify(_auth_id, JWT_SECRET) as JwtPayload;
			req.locals.session = await SessionService.getSessionByAccount(decoded.id);
			return Respond({
				res,
				status: 200,
			});
		} catch (err) {
			//ignored
		}
	}

	if (_session_id) {
		try {
			await SessionService.getSession(_session_id);
			return Respond({
				res,
				status: 200,
			});
		} catch (err) {
			//ignored
		}
	}

	const session = await SessionService.createSession();

	res.cookie(SESSION_COOKIE, session.id, {
		sameSite: 'strict',
		expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
	});

	return Respond({
		res,
		status: 200,
	});
}

async function login(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];
	const { email, password, type } = req.locals.data as LoginValidationResult;

	if (type === 'admin') {
		if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
			return next(new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR));
		}

		res.cookie(ADMIN_AUTH_COOKIE, ADMIN_AUTH_COOKIE, {
			sameSite: 'strict',
			expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});

		return Respond({
			res,
			status: 200,
		});
	}
	try {
		const [token, new_session] = await SessionService.login(email, password);

		res.clearCookie(SESSION_COOKIE, {
			sameSite: 'strict',
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});
		res.clearCookie(TRANSACTION_COOKIE, {
			sameSite: 'strict',
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});
		res.cookie(AUTH_COOKIE, token, {
			sameSite: 'strict',
			expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});

		if (_session_id) {
			await SessionService.copySession(_session_id, new_session);
		}

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
	const { email } = req.locals.data as ResetPasswordValidationResult;

	try {
		const token = await SessionService.generatePasswordResetLink(email);

		const resetLink = `https://keethjewels.com/login/reset-password/${token}`;
		const success = await sendPasswordResetEmail(email, resetLink);

		return Respond({
			res,
			status: success ? 200 : 400,
		});
	} catch (err) {
		return next(new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function updatePassword(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];

	const { password, token: update_token } = req.locals.data as UpdatePasswordValidationResult;

	try {
		const [token, new_session] = await SessionService.saveResetPassword(update_token, password);

		res.clearCookie(SESSION_COOKIE, {
			sameSite: 'strict',
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});
		res.clearCookie(TRANSACTION_COOKIE, {
			sameSite: 'strict',
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});
		res.cookie(AUTH_COOKIE, token, {
			sameSite: 'strict',
			expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});

		if (_session_id) {
			await SessionService.copySession(_session_id, new_session);
		}

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function googleLogin(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];
	try {
		const { tokens } = await oAuthClient.getToken({
			code: (req.locals.data as GoogleLoginValidationResult).token,
		});

		const ticket = await oAuthClient.verifyIdToken({
			idToken: tokens.id_token!,
			audience: GOOGLE_CLIENT_ID, // Replace with your client ID
		});

		const payload = ticket.getPayload();
		if (!payload || !payload['email']) {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
		}
		const email = payload['email'];
		const [token, new_session] = await SessionService.loginOrRegister(email, GOOGLE_AUTH_PASSWORD, {
			force: true,
		});

		res.clearCookie(SESSION_COOKIE, {
			sameSite: 'strict',
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});
		res.clearCookie(TRANSACTION_COOKIE, {
			sameSite: 'strict',
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});
		res.cookie(AUTH_COOKIE, token, {
			sameSite: 'strict',
			expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});

		if (_session_id) {
			await SessionService.copySession(_session_id, new_session);
		}

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function register(req: Request, res: Response, next: NextFunction) {
	const _session_id = req.cookies[SESSION_COOKIE];
	const { email, password } = req.locals.data as LoginValidationResult;
	try {
		const [token, new_session] = await SessionService.register(email, password);
		sendWelcomeEmail(email);

		res.cookie(AUTH_COOKIE, token, {
			sameSite: 'strict',
			expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
		});

		if (_session_id) {
			await SessionService.copySession(_session_id, new_session);
		}

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(ERRORS.USER_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function validateAuth(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
	});
}

async function logout(req: Request, res: Response, next: NextFunction) {
	res.clearCookie(SESSION_COOKIE, {
		sameSite: 'strict',
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
	});
	res.clearCookie(AUTH_COOKIE, {
		sameSite: 'strict',
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
	});
	res.clearCookie(ADMIN_AUTH_COOKIE, {
		sameSite: 'strict',
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
	});
	res.clearCookie(TRANSACTION_COOKIE, {
		sameSite: 'strict',
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? '.keethjewels.com' : 'localhost',
	});
	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	validateAuth,
	login,
	resetPassword,
	updatePassword,
	googleLogin,
	register,
	createSession,
	logout,
	listUsers,
};

export default Controller;
