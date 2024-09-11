import expect   from 'expect';
import createId from '../../app/utils/createId';

describe('createId', () => {
  it('should convert a description into a unique id', () => {
    const actual = createId(123, 'Cool example description');
    const expected = `123-cool-example`;
    expect(actual).toEqual(expected);
  });
});
