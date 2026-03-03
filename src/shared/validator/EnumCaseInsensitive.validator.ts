import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'enumCaseInsensitive', async: false })
export class EnumCaseInsensitiveValidator
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments) {
    const [enumType] = args.constraints;
    const enumValues = Object.keys(enumType).map((key) => enumType[key]);

    const lowercasedValue = value?.toLowerCase();
    return enumValues.some(
      (enumValue) => enumValue.toLowerCase() === lowercasedValue,
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [enumType] = args.constraints;

    const enumValues = Object.keys(enumType).map((key) => enumType[key]);

    return `${args.property} must be one of valid values: ${enumValues}`;
  }
}

export function ValidateEnumCaseInsensitive(
  enumType: object,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumType],
      validator: EnumCaseInsensitiveValidator,
    });
  };
}
