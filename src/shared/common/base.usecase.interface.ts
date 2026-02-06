export interface IBaseUsecase {
  execute(...args: unknown[]): unknown | Promise<unknown>;
}
