import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export function IsCleanHtml(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCleanHtml',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const cleaned = sanitizeHtml(value, {
            allowedTags: ['a', 'code', 'i', 'strong'],
            allowedAttributes: {
              a: ['href', 'title'],
            },
            selfClosing: [],
            exclusiveFilter: () => false,
            parser: {
              lowerCaseTags: true,
              lowerCaseAttributeNames: true,
            },
          });

          return cleaned === value;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Text contains unsafe HTML content, or invalid tags or attributes.';
        },
      },
    });
  };
}
