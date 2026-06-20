import CityCarHire from './CityCarHire';

const ChristchurchCarHire = () => (
  <CityCarHire
    city="Christchurch"
    region="Canterbury"
    slug="/car-hire-christchurch"
    phone="+6433651122"
    phoneDisplay="Call our Christchurch branch"
    fromPrice="$45"
    intro="Christchurch is the gateway to the South Island — alpine roads to Arthur's Pass, ski runs at Mt Hutt, the wine country of Waipara and the long drive south to Tekapo and Queenstown. Our Christchurch car hire fleet covers everything from compact city runabouts to AWD SUVs ready for the mountains."
    neighbourhoods={['Christchurch CBD', 'Christchurch Airport', 'Riccarton', 'Sydenham', 'Sockburn', 'Addington']}
  />
);

export default ChristchurchCarHire;