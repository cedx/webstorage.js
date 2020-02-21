import {SimpleChange} from '../lib/index.js';

/** Tests the features of the {@link SimpleChange} class. */
describe('SimpleChange', () => {
  const {expect} = chai;

  describe('.fromJson()', () => {
    it('should return an empty instance with an empty map', () => {
      const change = SimpleChange.fromJson({});
      expect(change.currentValue).to.be.undefined;
      expect(change.previousValue).to.be.undefined;
    });

    it('should return a non-empty map for an initialized instance', () => {
      const change = SimpleChange.fromJson({currentValue: 'foo', previousValue: 'bar'});
      expect(change.currentValue).to.equal('foo');
      expect(change.previousValue).to.equal('bar');
    });
  });

  describe('.toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      expect(new SimpleChange().toJSON()).to.be.an('object').that.deep.equal({
        currentValue: null,
        previousValue: null
      });
    });

    it('should return a non-empty map for an initialized instance', () => {
      expect(new SimpleChange('baz', 'bar').toJSON()).to.be.an('object').that.deep.equal({
        currentValue: 'bar',
        previousValue: 'baz'
      });
    });
  });
});
