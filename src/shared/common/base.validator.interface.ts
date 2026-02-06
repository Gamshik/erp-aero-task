export interface IBaseValidator {
  validate(...args: unknown[]): unknown | Promise<unknown>;
}
