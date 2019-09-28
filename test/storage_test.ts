import * as chai from 'chai';
import {SessionStorage, SimpleChange, WebStorage} from '../src/index';

/** Tests the features of the [[WebStorage]] class. */
describe('WebStorage', () => {
  const {expect} = chai;
  beforeEach(() => sessionStorage.clear());

  describe('#keys', () => {
    it('should return an empty array for an empty storage', () => {
      expect(new SessionStorage().keys).to.be.empty;
    });

    it('should return the list of keys for a non-empty storage', () => {
      sessionStorage.setItem('foo', 'bar');
      sessionStorage.setItem('bar', 'baz');

      const {keys} = new SessionStorage;
      expect(keys).to.have.lengthOf(2);
      expect(keys).to.have.ordered.members(['foo', 'bar']);
    });
  });

  describe('#length', () => {
    it('should return zero for an empty storage', () => {
      expect(new SessionStorage()).to.have.lengthOf(0);
    });

    it('should return the number of entries for a non-empty storage', () => {
      sessionStorage.setItem('foo', 'bar');
      sessionStorage.setItem('bar', 'baz');
      expect(new SessionStorage()).to.have.lengthOf(2);
    });
  });

  describe('#[Symbol.iterator]()', () => {
    it('should return a done iterator if storage is empty', () => {
      const storage = new SessionStorage;
      const iterator = storage[Symbol.iterator]();
      expect(iterator.next().done).to.be.true;
    });

    it('should return a value iterator if storage is not empty', () => {
      const storage = new SessionStorage;
      sessionStorage.setItem('foo', 'bar');
      sessionStorage.setItem('bar', 'baz');

      const iterator = storage[Symbol.iterator]();
      const values = [];

      let next = iterator.next();
      expect(next.done).to.be.false;
      values.push(next.value);
      next = iterator.next();
      expect(next.done).to.be.false;
      values.push(next.value);
      expect(iterator.next().done).to.be.true;

      expect(values).to.have.lengthOf(2);
      expect(values[0]).to.have.ordered.members(['foo', 'bar']);
      expect(values[1]).to.have.ordered.members(['bar', 'baz']);
    });
  });

  describe('#addEventListener("changes")', () => {
    it('should trigger an event when a value is added', done => {
      const listener = (event: Event): void => {
        const changes = (event as CustomEvent<Map<string, SimpleChange>>).detail;
        expect([...changes.entries()]).to.have.lengthOf(1);
        expect([...changes.keys()][0]).to.equal('foo');

        const [record] = [...changes.values()];
        expect(record.currentValue).to.equal('bar');
        expect(record.previousValue).to.be.undefined;

        done();
      };

      const storage = new SessionStorage;
      storage.addEventListener(WebStorage.eventChanges, listener);
      storage.set('foo', 'bar');
      storage.removeEventListener(WebStorage.eventChanges, listener);
    });

    it('should trigger an event when a value is updated', done => {
      sessionStorage.setItem('foo', 'bar');

      const listener = (event: Event): void => {
        const changes = (event as CustomEvent<Map<string, SimpleChange>>).detail;
        expect([...changes.entries()]).to.have.lengthOf(1);
        expect([...changes.keys()][0]).to.equal('foo');

        const [record] = [...changes.values()];
        expect(record.currentValue).to.equal('baz');
        expect(record.previousValue).to.equal('bar');

        done();
      };

      const storage = new SessionStorage;
      storage.addEventListener(WebStorage.eventChanges, listener);

      storage.set('foo', 'baz');
      storage.removeEventListener(WebStorage.eventChanges, listener);
    });

    it('should trigger an event when a value is removed', done => {
      sessionStorage.setItem('foo', 'bar');

      const listener = (event: Event): void => {
        const changes = (event as CustomEvent<Map<string, SimpleChange>>).detail;
        expect([...changes.entries()]).to.have.lengthOf(1);
        expect([...changes.keys()][0]).to.equal('foo');

        const [record] = [...changes.values()];
        expect(record.currentValue).to.be.undefined;
        expect(record.previousValue).to.equal('bar');

        done();
      };

      const storage = new SessionStorage;
      storage.addEventListener(WebStorage.eventChanges, listener);
      storage.remove('foo');
      storage.removeEventListener(WebStorage.eventChanges, listener);
    });

    it('should trigger an event when the storage is cleared', done => {
      sessionStorage.setItem('foo', 'bar');
      sessionStorage.setItem('bar', 'baz');

      const listener = (event: Event): void => {
        const changes = (event as CustomEvent<Map<string, SimpleChange>>).detail;
        expect([...changes.entries()]).to.have.lengthOf(2);
        expect([...changes.keys()]).to.have.ordered.members(['foo', 'bar']);

        const [record1, record2] = [...changes.values()];
        expect(record1.currentValue).to.be.undefined;
        expect(record1.previousValue).to.equal('bar');
        expect(record2.currentValue).to.be.undefined;
        expect(record2.previousValue).to.equal('baz');

        done();
      };

      const storage = new SessionStorage;
      storage.addEventListener(WebStorage.eventChanges, listener);
      storage.clear();
      storage.removeEventListener(WebStorage.eventChanges, listener);
    });
  });

  describe('#clear()', () => {
    it('should remove all storage entries', () => {
      sessionStorage.setItem('foo', 'bar');
      sessionStorage.setItem('bar', 'baz');

      const storage = new SessionStorage;
      expect(storage).to.have.lengthOf(2);

      storage.clear();
      expect(storage).to.have.lengthOf(0);
    });
  });

  describe('#get()', () => {
    it('should properly get the storage entries', () => {
      const storage = new SessionStorage;
      expect(storage.get('foo')).to.be.undefined;
      expect(storage.get('foo', '123')).to.equal('123');

      sessionStorage.setItem('foo', 'bar');
      expect(storage.get('foo')).to.equal('bar');

      sessionStorage.setItem('foo', '123');
      expect(storage.get('foo')).to.equal('123');
    });
  });

  describe('#getObject()', () => {
    it('should properly get the deserialized storage entries', () => {
      const storage = new SessionStorage;
      expect(storage.getObject('foo')).to.be.undefined;
      expect(storage.getObject('foo', {key: 'value'})).to.be.an('object').that.deep.equal({key: 'value'});

      sessionStorage.setItem('foo', '123');
      expect(storage.getObject('foo')).to.equal(123);

      sessionStorage.setItem('foo', '"bar"');
      expect(storage.getObject('foo')).to.equal('bar');

      sessionStorage.setItem('foo', '{"key": "value"}');
      expect(storage.getObject('foo')).to.be.an('object').that.deep.equal({key: 'value'});
    });

    it('should return the default value if the value can\'t be deserialized', () => {
      sessionStorage.setItem('foo', 'bar');
      expect(new SessionStorage().getObject('foo', 'defaultValue')).to.equal('defaultValue');
    });
  });

  describe('#has()', () => {
    it('should return `false` if the specified key is not contained', () => {
      expect(new SessionStorage().has('foo')).to.be.false;
    });

    it('should return `true` if the specified key is contained', () => {
      const storage = new SessionStorage;
      sessionStorage.setItem('foo', 'bar');
      expect(storage.has('foo')).to.be.true;
      expect(storage.has('bar')).to.be.false;
    });
  });

  describe('#remove()', () => {
    it('should properly remove the storage entries', () => {
      const storage = new SessionStorage;
      sessionStorage.setItem('foo', 'bar');
      sessionStorage.setItem('bar', 'baz');
      expect(sessionStorage.getItem('foo')).to.equal('bar');

      storage.remove('foo');
      expect(sessionStorage.getItem('foo')).to.be.null;
      expect(sessionStorage.getItem('bar')).to.equal('baz');

      storage.remove('bar');
      expect(sessionStorage.getItem('bar')).to.be.null;
    });
  });

  describe('#set()', () => {
    it('should properly set the storage entries', () => {
      const storage = new SessionStorage;
      expect(sessionStorage.getItem('foo')).to.be.null;
      storage.set('foo', 'bar');
      expect(sessionStorage.getItem('foo')).to.equal('bar');
      storage.set('foo', '123');
      expect(sessionStorage.getItem('foo')).to.equal('123');
    });
  });

  describe('#setObject()', () => {
    it('should properly serialize and set the storage entries', () => {
      const storage = new SessionStorage;
      expect(sessionStorage.getItem('foo')).to.be.null;
      storage.setObject('foo', 123);
      expect(sessionStorage.getItem('foo')).to.equal('123');
      storage.setObject('foo', 'bar');
      expect(sessionStorage.getItem('foo')).to.equal('"bar"');
      storage.setObject('foo', {key: 'value'});
      expect(sessionStorage.getItem('foo')).to.equal('{"key":"value"}');
    });
  });

  describe('#toJSON()', () => {
    it('should return an empty map for an empty storage', () => {
      const storage = new SessionStorage;
      expect(storage.toJSON()).to.be.an('object').that.is.empty;
    });

    it('should return a non-empty map for a non-empty storage', () => {
      const storage = new SessionStorage;
      storage.set('foo', 'bar').set('baz', 'qux');
      expect(storage.toJSON()).to.be.an('object').that.deep.equal({baz: 'qux', foo: 'bar'});
    });
  });
});
