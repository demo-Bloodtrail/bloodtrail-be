export const response = ({ isSuccess, code, message }, result) => {
  return {
    isSuccess: isSuccess,
    code: code,
    message: message,
    result: result,
  };
};

export const errResponse = ({ isSuccess, code, message, status }) => {
  return {
    isSuccess: isSuccess,
    code: code,
    message: message,
    status: status,
  };
};

export const customErrResponse = (
  { isSuccess, code, message, status },
  customMessage
) => {
  return {
    isSuccess: isSuccess,
    code: code,
    message: customMessage,
    status: status,
  };
};
