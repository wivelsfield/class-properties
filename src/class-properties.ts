import 'reflect-metadata';

// reflect-metadata key used to store property names
// for a class prototype in the metadata store
const KEY = '__class-properties';

/**
 * Records that the containing class has a property with this
 * name. This information is then available at runtime.
 */
export function Property(): PropertyDecorator {
  return function (
    target: Record<string, any>,
    propertyName: string | symbol,
  ): void {
    const fields =
      Reflect.getOwnMetadata(KEY, target) ||
      (Reflect.getMetadata(KEY, target) || []).slice(0);
    if (!fields.includes(propertyName)) {
      fields.push(propertyName);
    }
    Reflect.defineMetadata(KEY, fields, target);
  };
}

/**
 * Retrieves an array of property names for the specified class
 * based on the `@Property` decorator
 *
 * For 'unknown' classes (those which have no properties decorated
 * with `@Property`), it returns an empty array.
 *
 * @param targetClass - The class to list property names for.
 **/
export function getClassProperties(targetClass: {
  new (): Record<string, any>;
}): string[] {
  return Reflect.getMetadata(KEY, targetClass.prototype) ?? [];
}

/**
 * Determines whether the specified class is known to have
 * a property of the specified name, based on the `@Property`
 * decorator.
 *
 * Returns `true` if it does, `false` otherwise. For unknown
 * classes (those which have no properties decorated with
 * `@Property`), it always returns `false`.
 *
 * @param targetClass - The class to evaluate.
 * @param propertyName - The property name to test for.
 **/
export function hasProperty(
  targetClass: {
    new (): Record<string, any>;
  },
  propertyName: string,
): boolean {
  return getClassProperties(targetClass)?.includes(propertyName) ?? false;
}

/**
 * Determines whether an object has extra properties or is
 * missing properties compared to a class. Known properties of
 * the class are determined based on the `@Property` decorator.
 *
 * Returns an object literal containing `missing`, a list of
 * property names which were decorated on the class but not
 * present on the object, and `extra`, a list of property names
 * which were present on the object but not decorated on the
 * class.
 *
 * Only property names are evaluated. Property types and
 * modifiers are ignored.
 *
 * @param object - The object to evaluate.
 * @param templateClass - The class to compare this object to.
 */
export function compareProperties(
  object: Record<string, any>,
  templateClass: { new (): Record<string, any> },
): {
  missing: string[];
  extra: string[];
} {
  const presentProperties = Object.keys(object);
  const expectedProperties = getClassProperties(templateClass);
  const extra = presentProperties.filter(
    (property) => !expectedProperties.includes(property),
  );
  const missing = expectedProperties.filter(
    (property) => !presentProperties.includes(property),
  );
  return { missing: missing, extra: extra };
}

/**
 * Evaluates whether an object has extra properties or is
 * missing properties compared to a class.
 *
 * Returns `true` if the object's property names exactly
 * match the names of the class's properties decorated with
 * the `@Property` decorator, and `false` if the object
 * has any extra properties or is missing properties.
 *
 * Only property names are evaluated. Property types and
 * modifiers are ignored.
 *
 * @param object - The object to evaluate.
 * @param templateClass - The class to compare this object to.
 */
export function hasValidProperties(
  object: Record<string, any>,
  templateClass: { new (): Record<string, any> },
): boolean {
  const comparison = compareProperties(object, templateClass);
  return comparison.missing.length == 0 && comparison.extra.length == 0;
}
