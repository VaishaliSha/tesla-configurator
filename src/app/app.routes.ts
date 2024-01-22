import { Routes } from '@angular/router';
import { carModelGuard } from './core/guards/car-model.guard';
import { AppRouteNames } from './core/classes/app-route-names';
import { CarModelComponent } from './car-model/car-model.component';
import { CarConfigComponent } from './car-config/car-config.component';
import { CarSummaryComponent } from './car-summary/car-summary.component';


export const routes: Routes = [
    { path: AppRouteNames.CAR_MODEL, component: CarModelComponent },
    { path: AppRouteNames.CAR_CONFIG, component: CarConfigComponent, canActivate: [carModelGuard] },
    { path: AppRouteNames.CAR_SUMMARY, component: CarSummaryComponent, canActivate: [carModelGuard] },
    { path: AppRouteNames.FALLBACK, component: CarModelComponent },
];
