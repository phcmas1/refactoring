
export default function createStateData(invoice, plays) {
  const result: any = {}
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);

  return result


  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance);

    result.play = calculator.play;
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits
    return result
  }

  function playFor(aPerformance) {
      return plays[aPerformance.playID]
  }


  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p)=> total + p.volumeCredits, 0)
  }

}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch(aPlay.type) {
    case "tragedy" : return new TragedyCalculator(aPerformance, aPlay);
    case "comedy" : return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error('알 수 없는 장르')
  }
}



 class PerfomanceCalculator {
    public performance 
    public play    

    constructor(aPerformance, aPlay) {
      this.performance = aPerformance
      this.play = aPlay
    }

    get amount():number {throw new Error('not implemented')}
    get volumeCredits():number { return Math.max(this.performance.audience-30, 0) }
  }

  class TragedyCalculator extends PerfomanceCalculator {
    get amount() {
      let result = 40000;
      if (this.performance.audience > 30) {
        result += 1000 * (this.performance.audience - 30);
      }

      return result
    }
  }

  class ComedyCalculator extends PerfomanceCalculator {
    get amount(): number {
      let result = 30000;
      if (this.performance.audience > 20) {
        result += 10000 + 500 * (this.performance.audience - 20);
      }
      result += 300 * this.performance.audience;

      return result
    }

    get volumeCredits(): number {
      return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
  }




