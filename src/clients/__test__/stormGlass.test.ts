import StormGlass from '../stormGlass';
import axios from 'axios';
import stormGlassWeather3 from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3 from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
    const mockAxios = axios as jest.Mocked<typeof axios>;
    it('should return an StormGlass normalized forecast from the StormGlass service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        mockAxios.get.mockResolvedValue({ data: stormGlassWeather3 });

        const stormGlass = new StormGlass(mockAxios);
        const response = await stormGlass.fetchPoints(lat, lng);

        expect(response).toBeDefined();
        expect(response).toEqual(stormGlassNormalized3);
    });

    it('should exclude incomplete data point', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
        const incompleteResponse = {
            hours: [
                {
                    windDirection: {
                        noaa: 300,
                    },
                    time: '2020-04-26T00:00:00+00:00',
                },
            ],
        };

        mockAxios.get.mockResolvedValue({ data: incompleteResponse });

        const stormGlass = new StormGlass(mockAxios);
        const response = await stormGlass.fetchPoints(lat, lng);

        expect(response).toEqual([]);
    });

    it('should get a generic error from StormGlass service when the request fail befor reaching the service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        mockAxios.get.mockRejectedValue({ message: 'Network Error' });

        const stormGlass = new StormGlass(mockAxios);

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error when trying to communicate to StormGlass: Network Error')
    });

    it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        mockAxios.get.mockRejectedValue({
            response: {
                status: 429,
                data: { errors: ['Rate Limit reached'] },
            },
        });

        const stormGlass = new StormGlass(mockAxios);

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error returned by the StormGlass service: Error:{ "errors": ["Rate Limit reached"] } code 429'
        );
    });
});