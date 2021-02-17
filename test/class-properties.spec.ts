import {
  getClassProperties,
  Property,
  compareProperties,
  hasProperty,
  hasValidProperties,
} from '../src/main';

describe('tests Property decorator', () => {
  it('tests getting properties of a class', async () => {
    class Test {
      @Property()
      field!: string;
    }

    const properties = getClassProperties(Test);
    expect(properties).toEqual(['field']);
  });

  it('tests getting properties of a class with no decorator', async () => {
    class Test {
      field!: string;
    }

    const properties = getClassProperties(Test);
    expect(properties).toEqual([]);
  });

  it('tests getting properties of a partially decorated class', async () => {
    class Test {
      @Property()
      field1!: string;

      field2!: string;
    }

    const properties = getClassProperties(Test);
    expect(properties).toEqual(['field1']);
  });

  it('tests getting properties of classes with inheritence', async () => {
    class Test1 {
      @Property()
      field1!: string;
    }

    class Test2 extends Test1 {
      @Property()
      field2!: string;
    }

    class Test3 extends Test1 {
      @Property()
      field3!: string;
    }

    class Test4 extends Test3 {
      @Property()
      field4!: string;
    }

    const properties1 = getClassProperties(Test1);
    expect(properties1).toEqual(['field1']);

    const properties2 = getClassProperties(Test2);
    expect(properties2).toEqual(['field1', 'field2']);

    const properties3 = getClassProperties(Test3);
    expect(properties3).toEqual(['field1', 'field3']);

    const properties4 = getClassProperties(Test4);
    expect(properties4).toEqual(['field1', 'field3', 'field4']);
  });

  it('tests getting properties when inheriting an abstract class', async () => {
    abstract class AbstractTest {
      @Property()
      field1!: string;
    }

    class Test extends AbstractTest {
      @Property()
      field2!: string;
    }

    const properties = getClassProperties(Test);
    expect(properties).toEqual(['field1', 'field2']);
  });

  it('tests getting properties with a modifier', async () => {
    class Test {
      @Property()
      private field!: string;
    }

    const properties = getClassProperties(Test);
    expect(properties).toEqual(['field']);
  });

  it('tests getting properties when the class has a method', async () => {
    class Test {
      @Property()
      field!: string;

      method() {
        return;
      }
    }

    const properties = getClassProperties(Test);
    expect(properties).toEqual(['field']);
  });

  it('tests getting properties when a method is annotated', async () => {
    class Test {
      @Property()
      field!: string;

      @Property()
      method() {
        return;
      }
    }

    const properties = getClassProperties(Test);
    expect(properties).toEqual(['field', 'method']);
  });

  it('tests checking whether a class has a property', async () => {
    class Test {
      @Property()
      field1!: string;
    }

    const has = hasProperty(Test, 'field1');
    expect(has).toEqual(true);

    const hasNot = hasProperty(Test, 'field2');
    expect(hasNot).toEqual(false);
  });

  it('tests checking whether a class with no metadata has a property', async () => {
    class Test {
      field!: string;
    }

    const hasNot = hasProperty(Test, 'field');
    expect(hasNot).toEqual(false);
  });
});

describe('tests object property comparison', () => {
  it('tests checking an object for missing or extra properties', async () => {
    class Test {
      @Property()
      field1!: string;
      @Property()
      field2!: string;
    }

    const test = {
      field2: 'field2',
      field3: 'field3',
    };

    const comparison = compareProperties(test, Test);
    expect(comparison.missing).toEqual(['field1']);
    expect(comparison.extra).toEqual(['field3']);
  });

  it('tests checking an object for missing or extra properties', async () => {
    class Test {
      @Property()
      field1!: string;
      @Property()
      field2!: string;
    }

    const test1 = {
      field1: 'field1',
      field2: 'field2',
    };

    const test2 = {
      field2: 'field2',
      field3: 'field3',
    };

    const test3 = {
      field2: 'field1',
    };

    const valid1 = hasValidProperties(test1, Test);
    expect(valid1).toEqual(true);

    const valid2 = hasValidProperties(test2, Test);
    expect(valid2).toEqual(false);

    const valid3 = hasValidProperties(test3, Test);
    expect(valid3).toEqual(false);
  });
});
