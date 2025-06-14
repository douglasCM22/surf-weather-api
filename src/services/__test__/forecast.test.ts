import StormGlass from '@src/clients/stormGlass';
import stormGlassNormalized3 from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import { Forecast, ForecastProcessingInternalError } from '../forecast';
import { BeachPosition, IBeach } from '@src/models/beachModel';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
    const mockedStormGlassClient = new StormGlass() as jest.Mocked<StormGlass>;

    it('should return the forecast for a list of beaches', async () => {
        mockedStormGlassClient.fetchPoints.mockResolvedValue(
            stormGlassNormalized3
        );

        const beaches: IBeach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
            },
        ];

        const expectedResponse = [
            {
                time: '2020-04-26T00:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 64.26,
                        swellHeight: 0.15,
                        swellPeriod: 3.89,
                        time: '2020-04-26T00:00:00+00:00',
                        waveDirection: 231.38,
                        waveHeight: 0.47,
                        windDirection: 299.45,
                        windSpeed: 100,
                    },
                ],
            },
            {
                time: '2020-04-26T01:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 123.41,
                        swellHeight: 0.21,
                        swellPeriod: 3.67,
                        time: '2020-04-26T01:00:00+00:00',
                        waveDirection: 232.12,
                        waveHeight: 0.46,
                        windDirection: 310.48,
                        windSpeed: 100,
                    },
                ],
            },
            {
                time: '2020-04-26T02:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 182.56,
                        swellHeight: 0.28,
                        swellPeriod: 3.44,
                        time: '2020-04-26T02:00:00+00:00',
                        waveDirection: 232.86,
                        waveHeight: 0.46,
                        windDirection: 321.5,
                        windSpeed: 100,
                    },
                ],
            },
        ];

        const forecast = new Forecast(mockedStormGlassClient);
        const beachesWithRatings =
            await forecast.processForecastForBeaches(beaches);

        expect(beachesWithRatings).toEqual(expectedResponse);
    });

    it('should return an empty list when the beaches array is empty', async () => {
        const forecast = new Forecast();
        const response = await forecast.processForecastForBeaches([]);

        expect(response).toEqual([]);
    });

    it('should throw internal server error when something goes wrong during the rating process', async () => {
        const beaches: IBeach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
            },
        ];

        mockedStormGlassClient.fetchPoints.mockRejectedValue(
            'Error fetching data'
        );

        const forecast = new Forecast(mockedStormGlassClient);

        await expect(
            forecast.processForecastForBeaches(beaches)
        ).rejects.toThrow(ForecastProcessingInternalError);
    });

    // Add more tests here as needed
});
