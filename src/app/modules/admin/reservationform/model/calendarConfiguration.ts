/**
 * Api Documentation
 * Api Documentation
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


export interface CalendarConfiguration { 
    calendarConfId?: number;
    date?: string;
    dinner?: CalendarConfiguration.DinnerEnum;
    launch?: CalendarConfiguration.LaunchEnum;
}
export namespace CalendarConfiguration {
    export type DinnerEnum = 'OPEN' | 'CLOSE';
    export const DinnerEnum = {
        OPEN: 'OPEN' as DinnerEnum,
        CLOSE: 'CLOSE' as DinnerEnum
    };
    export type LaunchEnum = 'OPEN' | 'CLOSE';
    export const LaunchEnum = {
        OPEN: 'OPEN' as LaunchEnum,
        CLOSE: 'CLOSE' as LaunchEnum
    };
}
