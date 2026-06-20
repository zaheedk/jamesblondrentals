import CityCarHire from './CityCarHire';

const AucklandCarHire = () => (
  <CityCarHire
    city="Auckland"
    region="Auckland"
    slug="/car-hire-auckland"
    phone="+6492759595"
    phoneDisplay="Call our Auckland branch"
    fromPrice="$49"
    intro="Auckland is a city of long drives — North Shore commutes, weekend trips to the Coromandel, airport runs from the CBD and Waiheke ferry connections. Our Auckland car hire fleet is set up for all of it, with branches in Penrose and at Auckland Airport, and a mix of economy cars, sedans and SUVs."
    neighbourhoods={['Auckland CBD', 'Penrose', 'Auckland Airport', 'North Shore', 'West Auckland', 'South Auckland']}
  />
);

export default AucklandCarHire;