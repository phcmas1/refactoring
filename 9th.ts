function statement9(invoice, plays) {
  const statementData: any = {}
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return renderPlainText(statementData, plays);


  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result
  }

  function renderPlainText(data, plays) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (let perf of data.performances) {
      result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
        perf.audience
      }석)\n`;
    }

    result += `총액: ${usd(totalAmount(data))}\n`;
    result += `적립 포인트: ${totalVolumeCredits(data)}점\n`;
    return result;
  }

  function playFor(aPerformance) {
      return plays[aPerformance.playID]
  }

  function amountFor(aPerformance) {
      let result = 0

      switch (playFor(aPerformance).type) {
       case "tragedy":
         result = 40000;
         if (aPerformance.audience > 30) {
           result += 1000 * (aPerformance.audience - 30);
         }
         break;
       case "comedy":
         result = 30000;
         if (aPerformance.audience > 20) {
           result += 10000 + 500 * (aPerformance.audience - 20);
         }
         result += 300 * aPerformance.audience;
         break;
       default:
         throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
      }
    
      return result
  }

  function totalAmount(data) {
    let result = 0;

    for (let perf of data.performances) {
      result += data.amount
    }

    return result
  }
  
  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);

    if ("comedy" === playFor(aPerformance).type) {
       result += Math.floor(aPerformance.audience / 5);
    }

    return result;
  }

  function totalVolumeCredits(data) {
    let result = 0;

    for (let perf of data.performances) {
      result += perf.volumeCredits
    }

    return result;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber/100);
  }

}



