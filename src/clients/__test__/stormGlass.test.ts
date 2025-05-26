import StormGlass from '../stormGlass';
import axios from 'axios';
import stormGlassWeather3 from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3 from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
    it('should return an StormGlass normalized forecast from the StormGlass service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        axios.get = jest.fn().mockResolvedValue(stormGlassWeather3);

        const stormGlass = new StormGlass(axios);
        const response = await stormGlass.fetchPoints(lat, lng);
        
        expect(response).toBeDefined();
        expect(response).toEqual(stormGlassNormalized3);
    });
});