export interface ErrorContent {
  code: number;
  message: string;
  data?: any;
}
export class BackendError extends Error {
  public readonly code: number;
  public readonly message: string;
  public readonly data: any;

  constructor(errorContent: ErrorContent) {
    super(errorContent.message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.code = errorContent.code;
    this.data = errorContent.data;
    this.message = errorContent.message;
  }
}
