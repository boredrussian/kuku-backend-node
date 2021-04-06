import Validator, { ValidatorSchema, ValidatorConfig } from "../lib/validator";
import { Handler } from "../utils";
import { HTTP400Error } from "../utils/httpErrors";
import Logger from "../lib/logger";
import { NextFunction } from "express";

const logger = new Logger();

enum RequestDataType {
  body = "body",
  query = "query",
}

/**
 *
 * TODO refactor complete  call, not clean function
 *
 *
 * returning middleware =>
 * @param {validatorSchema} schema - can take function or array
 * @param {validatorConfig} validationConfig - config, extends Joi.ValidationOptions
 * @param {boolean} replaceBody - should validated object replace default body
 *
 * @Short_Guide
 * You can use function or array:
 * 1. function - take Joi module as param and return valid Joi schema.
 * more: https://joi.dev/api/
 *  e.g. (R) => ({ id: R.number(), name: R.string() })
 *
 *  2. array of strings that represents the prop names. e.g. ['id', 'name', ...]
 * This array will be transformed to Joi object with [value.name]: any.type.
 *
 *Default validation config:
 * - required: true - all elements are required as well
 * - abortEarly: false - when true, stops validation on the first error, otherwise returns all the errors found
 * - convert: true - when true, attempts to cast values to the required types (e.g. a string to a number)
 * - allowUnknown: true - when true, allows object to contain unknown keys which are ignored
 *
 * */

const validator = (
  requestProperty: RequestDataType,
  errorMessage = (error: string): string => error
) => {
  return (
    schema: ValidatorSchema,
    validationConfig?: ValidatorConfig,
    replaceBody: boolean = false
  ): Handler => {
    const validator = new Validator();
    validator.setSchema(schema, validationConfig);

    return (req, res, next): void => {
      const result = validator.validate(req[requestProperty]);

      if (!result) {
        logger.error("Validator config does not setup.");
        return next();
      }
      const { value, error } = result;
      if (error) return next(new HTTP400Error(errorMessage(error)));
      if (replaceBody) req.body = value;
      return next();
    };
  };
};

export const validateBody = validator(
  RequestDataType.body,
  (error) => `Bad body: ${error}`
);
export const validateQuery = validator(
  RequestDataType.query,
  (error) => `Bad query: ${error}`
);

export const validate = {
  /**
   * @param {Date} startDate - js Date object
   * @param {Date} endDate - js Date object
   * @rule - one of `startDate` or `endDate` should be present
   */
  dateRangeQuery: validateQuery((R) =>
    R.object({
      startDate: R.date().optional(),
      endDate: R.date().optional(),
    }).or("startDate", "endDate")
  ),
  /**
   * @param {number} userResponsibleId - number
   * @param {number} userCreatorId - number
   * @param {Date} startDate - js Date object
   * @param {any} data - any
   */
  manualTimeBody: validateBody((R) => ({
    userResponsibleId: R.number(),
    userCreatorId: R.number(),
    startDate: R.date(),
    data: R.any(),
  })),
  /**
   * @param {any} event - any
   * @param {any} data - any
   * @param {Object} auth - js Date object
   * @object `auth`:
   * @param {string} application_token - string: one of process.env.HOOK_TOKENs
   */
  hookBody: validateBody((R) => ({
    event: R.any(),
    data: R.any(),
    auth: R.object({
      ["application_token"]: R.equal(
        ...(process.env.HOOK_TOKEN ? process.env.HOOK_TOKEN.split(";") : [])
      ),
    }),
  })),
  /**
   * @param {number[]} userResponsibleId - array of numbers
   * @param {Date} startDate - date
   * @param {Date} endDate - date
   * @rule - one of `startDate` or `endDate` should be present
   */
  taskQuery: validateQuery((R) =>
    R.object({
      userResponsibleId: R.array().items(R.number()),
      startDate: R.date().optional(),
      endDate: R.date().optional(),
    }).or("startDate", "endDate")
  ),
};
