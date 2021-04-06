import Joi, {
  Schema,
  ValidationOptions,
  ValidationResult,
  ObjectSchema,
  CoerceResult,
} from "joi";

type Joi = typeof Joi;

type SchemaLike = {
  [key: string]: Schema;
};

export type ValidatorSchema =
  | ((type: typeof Joi) => SchemaLike | ObjectSchema)
  | string[];

export interface ValidatorConfig extends ValidationOptions {
  required?: boolean;
}

export interface ValidatorResult {
  value: ValidationResult | null;
  error: string | null;
}

class Validator {
  public schema: Schema | null;
  public config: ValidationOptions;
  public Joi: Joi;

  constructor() {
    this.Joi = this.createJoi();
    this.schema = null;
    this.config = this.getDefaultConfig();
  }

  private createJoi(): Joi {
    return Joi;
  }

  getDefaultConfig(): ValidationOptions {
    return {
      abortEarly: false,
      convert: true,
      presence: "required",
      allowUnknown: true,
    };
  }

  setConfig(config: ValidatorConfig): void {
    const { required = true, ...rest } = config;
    const validatorConfig = {
      presence: required ? "required" : "optional",
      ...rest,
    };
    this.config = Object.assign({}, this.config, validatorConfig);
  }

  setSchema(
    schema: ValidatorSchema,
    config: ValidationOptions = this.getDefaultConfig()
  ): Validator {
    this.setConfig(config);

    if (schema instanceof Function) {
      const schemaObj: SchemaLike | ObjectSchema = schema(this.Joi);

      try {
        this.schema = this.Joi.object(schemaObj as SchemaLike);
      } catch (error) {
        this.schema = schemaObj as ObjectSchema;
      }
      return this;
    }
    if (Array.isArray(schema)) {
      const validationSchema: any = {};

      schema.forEach((setting) => {
        validationSchema[setting] = this.Joi.any();
      });
      this.schema = this.Joi.object(validationSchema);

      return this;
    }
    return this;
  }

  validate(data: unknown): ValidatorResult | null {
    let result: ValidationResult | null = null;
    let error: string | null = null;

    if (!this.schema) return null;

    result = this.schema.validate(data, this.config);

    if (result.error) {
      error = result.error.details
        .map((detail) => detail.message)
        .join(" | ")
        .replace(/"/g, `'`);
    }

    return { value: result.value, error };
  }
}

export default Validator;
