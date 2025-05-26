import { AxiosStatic } from "axios";

export default class StormGlass {

    // API params to be used in the request
    readonly paramsAPI = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly sourceAPI = 'noaa';
    readonly endAPI = '1592113802';


    constructor(protected request: AxiosStatic) {}

    public async fetchPoints(lat: number, lng: number): Promise<{}> {

        return this.request.get(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.paramsAPI}&source=${this.sourceAPI}&end=${this.endAPI}`);
    }
}