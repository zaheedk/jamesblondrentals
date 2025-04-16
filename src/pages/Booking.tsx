
// Update the mapping of seasonal rates to include new properties
if (response.results.seasonalrates && Array.isArray(response.results.seasonalrates)) {
  const rates = response.results.seasonalrates.map((rate: any) => ({
    season: rate.season || "",
    rateperiod: rate.rateperiod || "",
    numberofdays: rate.numberofdays || 0,
    dailyRate: rate.dailyratebeforediscount || 0,
    dailyratebeforediscount: rate.dailyratebeforediscount || 0,
    totalAmount: rate.dailyrateafterdiscount || 0,
    discountAmount: rate.discountrate || 0,
    discounttype: rate.discounttype || "",
    discountname: rate.discountname || ""
  }));
  setSeasonalRates(rates);
}
