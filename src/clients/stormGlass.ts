import { AxiosStatic } from "axios";

interface NoaaData {
    noaa: number;
}

export interface HourlyForecast {
    readonly time: string;
    readonly swellDirection: NoaaData;
    readonly swellHeight: NoaaData;
    readonly swellPeriod: NoaaData;
    readonly waveDirection: NoaaData;
    readonly waveHeight: NoaaData;
    readonly windDirection: NoaaData;
    readonly windSpeed: NoaaData;
}

export interface MetaData {
    cost: number;
    dailyQuota: number;
    end: string;
    lat: number;
    lng: number;
    params: string[];
    requestCount: number;
    source: string[];
    start: string;
}

export interface StormGlassForecastResponse {
    hours: HourlyForecast[];
    meta: MetaData;

}

export interface StormGlassNormalizedForecastPoint {
    time: string;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    waveDirection: number;
    waveHeight: number;
    windDirection: number;
    windSpeed: number;
}

export default class StormGlass {

    // API params to be used in the request
    readonly paramsAPI = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly sourceAPI = 'noaa';
    readonly endAPI = '1592113802';


    constructor(protected request: AxiosStatic) { }

    public async fetchPoints(lat: number, lng: number): Promise<StormGlassNormalizedForecastPoint[]> {
        const resp = await this.request.get<StormGlassForecastResponse>(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.paramsAPI}&source=${this.sourceAPI}&end=${this.endAPI}`);

        return this.normalizeResponse(resp.data);
    }

    private normalizeResponse(data: StormGlassForecastResponse): StormGlassNormalizedForecastPoint[] {
        return data.hours.filter(this.isValidPoint.bind(this)).map<StormGlassNormalizedForecastPoint>(hour => {
            return {
                time: hour.time,
                swellDirection: hour.swellDirection.noaa,
                swellHeight: hour.swellHeight.noaa,
                swellPeriod: hour.swellPeriod.noaa,
                waveDirection: hour.waveDirection.noaa,
                waveHeight: hour.waveHeight.noaa,
                windDirection: hour.windDirection.noaa,
                windSpeed: hour.windSpeed.noaa
            };
        });
    }

    private isValidPoint(point: Partial<HourlyForecast>): boolean {
        return !!(
            point.time &&
            point.swellDirection?.[this.sourceAPI] && 
            point.swellHeight?.[this.sourceAPI] && 
            point.swellPeriod?.[this.sourceAPI] &&
            point.waveDirection?.[this.sourceAPI] && 
            point.waveHeight?.[this.sourceAPI] && 
            point.windDirection?.[this.sourceAPI] && 
            point.windSpeed?.[this.sourceAPI]);

    }
}