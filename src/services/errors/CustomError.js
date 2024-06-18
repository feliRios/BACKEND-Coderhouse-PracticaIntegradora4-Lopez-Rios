class CustomError {
  static createError({ name = "Error", cause, message, code = 1 }) {
    console.log("message:", message);
      const error = new Error(message);
      error.name = name;
      error.code = code;
      error.cause = cause ? cause : null

      return error;
  }
}

module.exports = CustomError;
