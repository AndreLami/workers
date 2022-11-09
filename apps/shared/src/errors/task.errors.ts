import { HttpErrorRepresentable } from './http.error.representable';
import { HttpStatus} from '@nestjs/common';

export class TaskError extends Error {

    constructor(
        readonly code: number,
        readonly description: string,
        readonly extra: any | null = null,
        readonly reasons: ErrorReason[] | null= null
    ) { super() }

}

export class ErrorReason {

    constructor(
        readonly code: number,
        readonly description: string,
        readonly extra: any | null = null
    ) {}

}

export class InternalError extends TaskError implements HttpErrorRepresentable {

    constructor() {
        super(100_0000, "Something went wrong");
    }

    httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR

}

export class UnableToScheduleJob extends TaskError implements HttpErrorRepresentable {

    constructor() {
        super(100_0001, "Unable to schedule job");
    }

    httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR

}

export class UnableToCancelJob extends TaskError implements HttpErrorRepresentable {

    constructor(jobHandle: string) {
        super(100_0002, "Unable to cancel job", {
            jobHandle: jobHandle
        });
    }

    httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR

}