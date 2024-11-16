const CycleCalculator = require('../../../utility/helpers/cycle.calculator.js');
const { expect } = require('chai');
const sinon = require('sinon');


describe('calculate function', () => {
  let clock;
  let cycleCalculator;

  before(() => {
    cycleCalculator = new CycleCalculator()
    clock = sinon.useFakeTimers(new Date('2023-11-22').getTime());
  });

  after(() => {
    clock.restore();
  });

  it('calculates when ovulation occurs the day after menstraution ', async () => {
    const result = await cycleCalculator.calculate(5, '2023-11-20', '2023-11-25');
    expect(result.days).to.equal(20);
    expect(result.periodRange.length).to.equal(5);
    expect(result.ovulation).to.equal('2023-11-25');
    expect(result.ovulationRange.length).to.equal(2);
    expect(result.unsafeDays.length).to.equal(6);
    expect(result.nextDate).to.equal('2023-12-10');
  });

  it('calculates correctly when menstraution is 4 days and ovulation is specified ', async () => {
    const result = await cycleCalculator.calculate(4, '2023-11-20', '2023-12-03');
    expect(result.days).to.equal(28);
    expect(result.periodRange.length).to.equal(4);
    expect(result.ovulation).to.equal('2023-12-03');
    expect(result.ovulationRange.length).to.equal(3);
    expect(result.unsafeDays.length).to.equal(11);
    expect(result.nextDate).to.equal('2023-12-18');
  });

  it('calculates correctly when menstraution is 5 days and ovulation is specified', async () => {
    const result = await cycleCalculator.calculate(5, '2023-11-20', '2023-12-03');
    expect(result.days).to.equal(28);
    expect(result.periodRange.length).to.equal(5);
    expect(result.ovulation).to.equal('2023-12-03');
    expect(result.ovulationRange.length).to.equal(3);
    expect(result.unsafeDays.length).to.equal(11);
    expect(result.nextDate).to.equal('2023-12-18');
  });

  it("calculates correctly when menstraution is 5 days when ovulation isn't specified", async () => {
    const result = await cycleCalculator.calculate(5, '2023-11-20');
    expect(result.days).to.equal(29);
    expect(result.periodRange.length).to.equal(5);
    expect(result.ovulation).to.equal('2023-12-04');
    expect(result.ovulationRange.length).to.equal(3);
    expect(result.unsafeDays.length).to.equal(11);
    expect(result.nextDate).to.equal('2023-12-19');
  });

  it("calculates correctly when menstraution is 4 days when ovulation isn't specified", async () => {
    const result = await cycleCalculator.calculate(4, '2023-11-20');
    expect(result.days).to.equal(28);
    expect(result.periodRange.length).to.equal(4);
    expect(result.ovulation).to.equal('2023-12-03');
    expect(result.ovulationRange.length).to.equal(3);
    expect(result.unsafeDays.length).to.equal(11);
    expect(result.nextDate).to.equal('2023-12-18');
  });

  it('should throw error when ovulation occurs during menstraution', async () => {
    try {
      await cycleCalculator.calculate(5, '2023-11-20', '2023-11-24');
    } catch (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal("Invalid ovulation date: Can't occur before or during menstraution");
    }
  });

  it('should throw error when ovulation occurs below menstraution date', async () => {
    try {
      await cycleCalculator.calculate(5, '2023-11-20', '2023-11-19');
    } catch (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal("Invalid ovulation date: Can't occur before or during menstraution");
    }
  });
});

describe('month function', () => {
  let cycleCalculator;

  before(() => {
    cycleCalculator = new CycleCalculator()
  });

  it('should return the correct month for a given date', () => {
    const result = cycleCalculator.getMonth('2023-11-24');
    expect(result).to.equal('November');
  });

  it('should return the correct month for another date', () => {
    const result = cycleCalculator.getMonth('2023-05-15');
    expect(result).to.equal('May');
  });
});
