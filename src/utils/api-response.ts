class APIResponse {
  statusCode: number;
  data: object | null;
  message: string;

  constructor(
    statusCode: number,
    data: object | null = null,
    message: string = "Success"
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export { APIResponse };
