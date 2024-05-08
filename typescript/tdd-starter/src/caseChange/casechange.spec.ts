import { CaseChange } from './casechange';

describe('The CaseChange tests', () => {
  let caseChange: CaseChange;
  beforeEach(() => {
    caseChange = new CaseChange();
  });

  it('exists', () => {
    expect(caseChange).toBeDefined();
  });

  it('should change MOM to mom', () => {
    expect(caseChange.convertLower('MOM')).toBe('mom');
  });

  it('should change BILL to bill', () => {
    expect(caseChange.convertLower('BILL')).toBe('bill');
  });

  it('should change phil to PHIL', () => {
    expect(caseChange.convertUpper('phil')).toBe('PHIL');
  });

  it('should capitalize the first letter only phil to Phil', () => {
    expect(caseChange.convertFirst('phil')).toBe('Phil');
  });
});
