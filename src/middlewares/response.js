export const clientResponder = {
  SUCCESS: ({ res, message, errorCode = 200 }) => {
    res.status(errorCode).json({
      status: "success",
      message,
    });
  },

  ERROR: ({ res, message, errorCode = 200 }) => {
    res.status(errorCode).json({
      status: "error",
      message,
    });
  },
};
