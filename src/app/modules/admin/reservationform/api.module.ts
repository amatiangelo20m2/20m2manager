import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { CalendarConfControllerService } from './api/calendarConfController.service';
import { ProductControllerService } from './api/productController.service';
import { SummerOfLoveControllerService } from './api/summerOfLoveController.service';
import { SushiControllerService } from './api/sushiController.service';
import { WineControllerService } from './api/wineController.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    CalendarConfControllerService,
    ProductControllerService,
    SummerOfLoveControllerService,
    SushiControllerService,
    WineControllerService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<any> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
