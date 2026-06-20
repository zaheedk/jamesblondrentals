import CityCarHire from './CityCarHire';

const HamiltonCarHire = () => (
  <CityCarHire
    city="Hamilton"
    region="Waikato"
    slug="/car-hire-hamilton"
    phone="+6478383150"
    phoneDisplay="Call our Hamilton branch"
    fromPrice="$45"
    intro="Hamilton drivers cover ground — between the CBD, Te Rapa, Hillcrest and the Waikato Expressway out to Auckland or Tauranga. Our Hamilton hire-car fleet is sized for short city stays, weekend escapes to Raglan, and longer business trips where a comfortable, fuel-efficient car matters."
    neighbourhoods={['Hamilton CBD', 'Te Rapa', 'Hillcrest', 'Frankton', 'Hamilton East', 'Cambridge']}
  />
);

export default HamiltonCarHire;