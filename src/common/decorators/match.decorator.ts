import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
	validate(value: unknown, args: ValidationArguments): boolean {
		const [relatedPropertyName] = args.constraints;
		const relatedValue = (args.object as Record<string, unknown>)[
			relatedPropertyName
		];
		return value === relatedValue;
	}

	defaultMessage(args: ValidationArguments): string {
		const [relatedPropertyName] = args.constraints;
		return `${relatedPropertyName} and ${args.property} do not match`;
	}
}

export function Match(property: string, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: MatchConstraint,
		});
	};
}
