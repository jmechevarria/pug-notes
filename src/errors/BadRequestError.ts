import { v4 } from "uuid";
import { NestedError, toError } from "ts-nested-error";

export class BadRequestError extends NestedError {
  public readonly id: string;

  static type: string = "BadRequestError";

  constructor(message: string, ...innerErrors: unknown[]) {
    super(message, ...innerErrors.map((v) => toError(v)));
    this.id = v4();
  }
}
