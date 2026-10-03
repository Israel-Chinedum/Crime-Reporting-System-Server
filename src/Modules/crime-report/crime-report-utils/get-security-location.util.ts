import getDistance from 'geolib/es/getPreciseDistance';
import { Repository } from 'typeorm';
import { Location } from '../crime-report-entities/location.entity';
import { InternalServerErrorException } from '@nestjs/common';

export const getSecurityLocation = async ({
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

  const locations = await locationRepo.find();
  const nearbyStations: {
    name: string;
    lng: number;
    lat: number;
    distance?: number;
  }[] = [];

  for (let location of locations) {
    if (location.name === 'School Gate') {
      nearbyStations.push({
        name: location.name,
        lng: Number(location.longitude),
        lat: Number(location.latitude),
      });
    }
  }

  //   ====== Send Security Locations ======
  try {
    for (let station of nearbyStations) {
      //   ====== Get Distance ======
      const distance = getDistance(
        { latitude: userLat, longitude: userLng },
        { latitude: station?.lat!, longitude: station?.lng! },
      );
      station.distance = distance;
    }

    return nearbyStations;
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException(
      'An error occured, please try again!',
    );
  }
};
