import StormGlass from '../stormGlass';
import stormGlassWeather3 from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3 from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import * as HTTPUtil from '@src/utils/request';

jest.mock('@src/utils/request');

describe('StormGlass client', () => {
    const mockedRequest =
        new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

    const mockedRequestClass = HTTPUtil.Request as jest.MockedClass<
        typeof HTTPUtil.Request
    >;

    it('should return an StormGlass normalized forecast from the StormGlass service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        mockedRequest.get.mockResolvedValue({
            data: stormGlassWeather3,
        } as HTTPUtil.Response);

        const stormGlass = new StormGlass(mockedRequest);
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

        mockedRequest.get.mockResolvedValue({
            data: incompleteResponse,
        } as HTTPUtil.Response);

        const stormGlass = new StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(lat, lng);

        expect(response).toEqual([]);
    });

    it('should get a generic error from StormGlass service when the request fail befor reaching the service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

        const stormGlass = new StormGlass(mockedRequest);

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error when trying to communicate to StormGlass: Network Error'
        );
    });

    it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        jest.spyOn(mockedRequestClass, 'isRequestError').mockReturnValue(true);

        mockedRequest.get.mockRejectedValue({
            response: {
                status: 429,
                data: { errors: ['Rate Limit reached'] },
            },
        });

        const stormGlass = new StormGlass(mockedRequest);

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error returned by the StormGlass service: Error:{"errors":["Rate Limit reached"]} code 429'
        );
    });
});
