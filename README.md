# class-properties

Decorate class properties to allow the class's property names to be listed at runtime.

This allows objects to be checked for missing
or excess properties compared to a class.

## Installation

```
yarn add class-property
```

## Usage

Decorate class properties with the `@Property` decorator:

```
class Test {
    @Property()
    field1!: string

    @Property()
    field2!: string
}
```
