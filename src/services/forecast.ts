import StormGlass, { StormGlassNormalizedForecastPoint } from "@src/clients/stormGlass";
import { InternalError } from "@src/utils/errors/internal-error";
import e from "express";

export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N'
}

export interface IBeach {
    lat: number;
    lng: number;
    name: string;
    position: BeachPosition;
    user: string;
}

export interface IBeachForecast extends Omit<IBeach, 'user'>, StormGlassNormalizedForecastPoint {
    rating: number;
}

export interface IBeachForecastByTime {
    time: string;
    forecast: IBeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
    constructor(message: string) {
        const internalMessage = 'Unexpected error during the forecast processing';
        super(`${internalMessage}: ${message}`);
    }
}

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) { }

    public async processForecastForBeaches(beaches: IBeach[]): Promise<IBeachForecastByTime[]> {
        const pointsWithCorrectSources: IBeachForecast[] = [];

        try {
            for (const beach of beaches) {
                const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
                pointsWithCorrectSources.push(...this.enrichBeachData(beach, points));
            }

            return this.mapForecastByTime(pointsWithCorrectSources);
        } catch (err: any) {
            throw new ForecastProcessingInternalError(err.message);
        }
    }

    private enrichBeachData(beach: IBeach, points: StormGlassNormalizedForecastPoint[]): IBeachForecast[] {
        return points.map((e) => ({
            ...{
                lat: beach.lat,
                lng: beach.lng,
                name: beach.name,
                position: beach.position,
                rating: 1,
            },
            ...e,
        }));
    }

    private mapForecastByTime(forecast: IBeachForecast[]): IBeachForecastByTime[] {
        const forecastByTime: IBeachForecastByTime[] = [];

        for (const point of forecast) {
            const time = point.time;
            const existingTimeForecast = forecastByTime.find(f => f.time === time);

            if (existingTimeForecast) {
                existingTimeForecast.forecast.push(point);
            } else {
                forecastByTime.push({
                    time,
                    forecast: [point],
                });
            }
        }

        return forecastByTime;
    }
}