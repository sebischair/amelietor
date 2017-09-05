export const REQUEST_DECORATORS = 'REQUEST_DECORATORS';
export const DECORATED = 'DECORATED';
export const DECORATION_FAILED = 'DECORATION_FAILED';

export const decorate = () => {
  return {
    type: REQUEST_DECORATORS
  }
};

export const decorationSucceed = () => {
  return {
    type: DECORATED
  }
};

export const decorationFailed = (errorMsg) => {
  return {
    type: DECORATION_FAILED,
    errorMsg
  }
};
