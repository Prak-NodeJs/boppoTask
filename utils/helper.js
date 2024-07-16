const {ApiError} = require('../utils/ApiError')
const validate = (schema) => (req, res, next) => {
    const { body, params, query } = schema;

    const bodyResult = body ? body.validate(req.body, { abortEarly: false }) : { error: null };
    const paramsResult = params ? params.validate(req.params, { abortEarly: false }) : { error: null };
    const queryResult = query ? query.validate(req.query, { abortEarly: false }) : { error: null };

    const errors = [];
    if (bodyResult.error) {
        errors.push(...bodyResult.error.details.map(detail => detail.message));
    }
    if (paramsResult.error) {
        errors.push(...paramsResult.error.details.map(detail => detail.message));
    }
    if (queryResult.error) {
        errors.push(...queryResult.error.details.map(detail => detail.message));
    }

    if (errors.length > 0) {
        throw new ApiError(400, errors)
    }

    return next();
  };


  module.exports = {
    validate
  }