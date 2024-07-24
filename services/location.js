import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.error("Error getting current location: ", error);
    throw error;
  }
};

export const watchLocation = async (callback, distanceThreshold = 5) => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    return await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, 
        distanceInterval: 5, 
      },
      (newLocation) => {
        callback(newLocation, distanceThreshold);
      }
    );
  } catch (error) {
    console.error("Error watching location: ", error);
    throw error;
  }
};
