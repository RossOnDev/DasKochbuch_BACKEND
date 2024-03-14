import {StatusCodes} from "http-status-codes";

export class HttpException extends Error {
	public readonly status: StatusCodes;

	constructor(status: StatusCodes, message: string, ) {
		super(message);
		this.status = status;
	}

	toDto() {
		return {
			message: this.message
		}
	}
}