import { getDistance } from 'geolib';
import { Repository } from 'typeorm';
import { Location } from '../crime-report-entities/location.entity';

export const getLoacation = async ({
  lng,
  lat,
  locationRepo,
}: {
  lng: string;
  lat: string;
  locationRepo: Repository<Location>;
}) => {
  //   ====== Set co-ordinates type to number ======
  const userLng = Number(lng);
  const userLat = Number(lat);
  let locationName = 'Unavailable';

  if (lng && lat) {
    const checkProximity = ({ lat, lng }: { lat: number; lng: number }) => {
      const distance = getDistance(
        { latitude: userLat, longitude: userLng },
        { latitude: lat, longitude: lng },
      );
      return distance > 30 ? false : true;
    };

    const locations = await locationRepo.find();

    for (let location of locations) {
      const withinRange = checkProximity({
        lat: Number(location.latitude),
        lng: Number(location.longitude),
      });

      if (withinRange) {
        locationName = location.name;
        break;
      }
    }
  }

  return { location: locationName! };
};
