
import type { RCMStep1Response, RCMStep2Response, RCMStep3Response } from './rcm-api-types';

// Mock data for Step1 response
export const mockStep1Data: RCMStep1Response = {
  status: "OK",
  results: {
    locations: [
      {
        id: "625",
        location: "Sydney Airport",
        address: "123 Airport Road",
        city: "Sydney",
        state: "NSW",
        country: "Australia",
        postcode: "2020",
        latitude: -33.936,
        longitude: 151.167,
        ispickupavailable: true,
        isdropoffavailable: true,
        isdefault: true,
        minimumbookingday: 1,
        noticerequired_numberofdays: 0,
        officeopeningtime: "09:00",
        officeclosingtime: "17:00"
      },
      {
        id: "626",
        location: "Melbourne CBD",
        address: "456 City Street",
        city: "Melbourne",
        state: "VIC",
        country: "Australia",
        postcode: "3000",
        latitude: -37.814,
        longitude: 144.963,
        ispickupavailable: true,
        isdropoffavailable: true,
        isdefault: false,
        minimumbookingday: 1,
        noticerequired_numberofdays: 0,
        officeopeningtime: "08:30",
        officeclosingtime: "18:00"
      }
    ],
    officetimes: [
      {
        locationid: "625",
        dayofweek: 1,
        openingtime: "09:00",
        closingtime: "17:00"
      },
      {
        locationid: "625",
        dayofweek: 2,
        openingtime: "09:00",
        closingtime: "17:00"
      },
      {
        locationid: "625",
        dayofweek: 3,
        openingtime: "09:00",
        closingtime: "17:00"
      },
      {
        locationid: "625",
        dayofweek: 4,
        openingtime: "09:00",
        closingtime: "17:00"
      },
      {
        locationid: "625",
        dayofweek: 5,
        openingtime: "09:00",
        closingtime: "17:00"
      },
      {
        locationid: "626",
        dayofweek: 1,
        openingtime: "08:30",
        closingtime: "18:00"
      },
      {
        locationid: "626",
        dayofweek: 2,
        openingtime: "08:30",
        closingtime: "18:00"
      },
      {
        locationid: "626",
        dayofweek: 3,
        openingtime: "08:30",
        closingtime: "18:00"
      },
      {
        locationid: "626",
        dayofweek: 4,
        openingtime: "08:30",
        closingtime: "18:00"
      },
      {
        locationid: "626",
        dayofweek: 5,
        openingtime: "08:30",
        closingtime: "18:00"
      }
    ],
    driverages: [
      {
        id: "101",
        driverage: "25-70 years",
        isdefault: true
      },
      {
        id: "102",
        driverage: "21-24 years",
        isdefault: false
      }
    ],
    categorytypes: [
      {
        id: "1",
        vehiclecategorytype: "Economy"
      },
      {
        id: "2",
        vehiclecategorytype: "Compact"
      },
      {
        id: "3",
        vehiclecategorytype: "Midsize"
      },
      {
        id: "4",
        vehiclecategorytype: "SUV"
      },
      {
        id: "5",
        vehiclecategorytype: "Luxury"
      }
    ]
  }
};

// Mock data for Step2 response
export const mockStep2Data: RCMStep2Response = {
  status: "OK",
  results: {
    availablecars: [
      {
        vehiclecategoryid: "201",
        vehiclecategorytypeid: "1",
        vehiclecategory: "Toyota Corolla or similar",
        vehicledescription1: "Economy Car",
        vehicledescription2: "Fuel-efficient and perfect for city driving",
        vehicledescription3: "5 doors, automatic transmission, A/C",
        imageurl: "https://via.placeholder.com/300x200?text=Toyota+Corolla",
        totalrateafterdiscount: 45.00,
        totaldiscountamount: 5.00,
        avgrate: 50.00,
        numberofdays: "3",
        numberofadults: 4,
        numberofchildren: 1,
        numberoflargecases: 2,
        numberofsmallcases: 2,
        available: 5
      },
      {
        vehiclecategoryid: "202",
        vehiclecategorytypeid: "2",
        vehiclecategory: "Mazda 3 or similar",
        vehicledescription1: "Compact Car",
        vehicledescription2: "Sporty handling with modern features",
        vehicledescription3: "5 doors, automatic transmission, A/C, Bluetooth",
        imageurl: "https://via.placeholder.com/300x200?text=Mazda+3",
        totalrateafterdiscount: 55.00,
        totaldiscountamount: 5.00,
        avgrate: 60.00,
        numberofdays: "3",
        numberofadults: 4,
        numberofchildren: 1,
        numberoflargecases: 2,
        numberofsmallcases: 2,
        available: 3
      },
      {
        vehiclecategoryid: "203",
        vehiclecategorytypeid: "4",
        vehiclecategory: "Toyota RAV4 or similar",
        vehicledescription1: "Compact SUV",
        vehicledescription2: "Versatile and spacious for all occasions",
        vehicledescription3: "5 doors, automatic transmission, A/C, Bluetooth, Backup Camera",
        imageurl: "https://via.placeholder.com/300x200?text=Toyota+RAV4",
        totalrateafterdiscount: 75.00,
        totaldiscountamount: 5.00,
        avgrate: 80.00,
        numberofdays: "3",
        numberofadults: 5,
        numberofchildren: 0,
        numberoflargecases: 3,
        numberofsmallcases: 2,
        available: 2
      }
    ],
    seasonalrates: [
      {
        vehiclecategoryid: "201",
        dailyratebeforediscount: 50.00,
        dailyrateafterdiscount: 45.00,
        discountrate: 10.00,
        discounttype: "Percentage",
        numberofdays: 3,
        numberofhours: 0,
        rateperiod: "Daily"
      },
      {
        vehiclecategoryid: "202",
        dailyratebeforediscount: 60.00,
        dailyrateafterdiscount: 55.00,
        discountrate: 8.33,
        discounttype: "Percentage",
        numberofdays: 3,
        numberofhours: 0,
        rateperiod: "Daily"
      }
    ],
    locationfees: [
      {
        vehiclecategorytypeid: "1",
        currencysymbol: "$",
        currencyname: "AUD"
      },
      {
        vehiclecategorytypeid: "2",
        currencysymbol: "$",
        currencyname: "AUD"
      }
    ],
    mandatoryfees: [
      {
        vehiclecategoryid: "201",
        vehiclecategorytypeid: "1",
        totalfeeamount: 10.00
      },
      {
        vehiclecategoryid: "202",
        vehiclecategorytypeid: "2",
        totalfeeamount: 10.00
      }
    ]
  }
};

// Mock data for Step3 response
export const mockStep3Data: RCMStep3Response = {
  status: "OK",
  results: {
    insuranceoptions: [
      {
        id: "301",
        name: "Standard Insurance",
        description: "Basic coverage with $2000 excess",
        totalinsuranceamount: 0.00,
        isdefault: true
      },
      {
        id: "302",
        name: "Premium Insurance",
        description: "Comprehensive coverage with $500 excess",
        totalinsuranceamount: 15.00,
        isdefault: false
      },
      {
        id: "303",
        name: "Full Coverage",
        description: "Zero excess liability",
        totalinsuranceamount: 25.00,
        isdefault: false
      }
    ],
    kmcharges: [
      {
        id: "401",
        name: "Unlimited",
        mileagedesc: "Unlimited kilometers included",
        dailyrate: 0.00,
        numberofkmsfree: 0,
        feeforeachadditionalkm: 0.00,
        isdefault: true
      },
      {
        id: "402",
        name: "200km/day",
        mileagedesc: "200km per day included, $0.25 per extra km",
        dailyrate: -5.00,
        numberofkmsfree: 200,
        feeforeachadditionalkm: 0.25,
        isdefault: false
      }
    ],
    extras: [
      {
        id: "501",
        name: "GPS Navigation",
        description: "Satellite navigation system",
        maxquantity: 1,
        unitprice: 8.00,
        totalextraamount: 8.00,
        isdefault: false
      },
      {
        id: "502",
        name: "Child Seat",
        description: "Safety-approved child seat",
        maxquantity: 3,
        unitprice: 10.00,
        totalextraamount: 10.00,
        isdefault: false
      },
      {
        id: "503",
        name: "Additional Driver",
        description: "Add an additional authorized driver",
        maxquantity: 3,
        unitprice: 5.00,
        totalextraamount: 5.00,
        isdefault: false
      }
    ],
    locationfees: {
      vehiclecategoryid: "201",
      currencysymbol: "$",
      currencyname: "AUD"
    }
  }
};
