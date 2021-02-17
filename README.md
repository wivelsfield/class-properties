# class-properties

Decorate class properties to allow the class's property names to be known at runtime.

This allows objects to be checked for missing
or excess properties compared to a class.

For more comprehensive decorator-based object validation, consider [class-validator](https://github.com/typestack/class-validator).

## Installation

```
yarn add class-property
```

## Usage

Decorate class properties with the `@Property` decorator:

```typescript
import { Property } from 'class-properties';

class Test {
  @Property()
  field1!: string;

  @Property()
  field2!: string;
}
```

Then retrieve the decorated property names as a string array at runtime:

```typescript
import { getClassProperties } from 'class-properties';

const properties = getClassProperties(Test);
// properties = ['field1', 'field2']
```

You can also compare objects with the class's known properties to determine if it has extra or missing properties:

```typescript
import { compareProperties } from 'class-properties';

const testObject = {
  field2: 'field2',
  field3: 'field3',
};

const result = compareProperties(Test);
// result.missing = ['field1']
// result.extra = ['field3']
```

## Motivation

This may be useful for two reasons:

1. TypeScript's structural typing means that object literals may include excess properties and remain compatible with a type.
2. Since we are executing JavaScript there is not always a runtime guarantee that all expected properties are present on an object.

We may need to confirm our assumptions of the properties that should be present if, for example, handling a data transfer object or passing a model to an ORM.

This is typically handled through a validation library, but in some scenarios a simpler approach may be sufficient.

## Implementation

Property names are stored in the `reflect-metadata` store for the class's prototype under the key `__class-properties`.

## FAQs

###### Is it possible to determine interface properties at runtime?

No. TypeScript interfaces do not exist in compiled JavaScript, and there is no way to decorate them.

###### Are property types or modifiers accessible?

No. Only property names are stored. TypeScript types do not exist in compiled JavaScript, so it is not possible to read them via decorator.
