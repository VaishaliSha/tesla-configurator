import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CarDataService } from './apis/car-data.service';
import { SharedDataService } from './core/services/shared-data.service';
import { step1, step2, step3 } from './core/constants/app-constants';
import { AppRouteNames } from './core/classes/app-route-names';
import { TabsComponent } from './shared/components/tabs/tabs.component';
import { CarImageComponent } from './car-image/car-image.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CarImageComponent, TabsComponent, HttpClientModule, ReactiveFormsModule, RouterOutlet, RouterModule],
  providers: [CarDataService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  stepList: string[] = [step1, step2, step3];
  disabledStepList: string[] = [];
  unSubscribe$: Subject<boolean> = new Subject<boolean>();
  stepsRoute = {
    [step1]: AppRouteNames.CAR_MODEL,
    [step2]: AppRouteNames.CAR_CONFIG,
    [step3]: AppRouteNames.CAR_SUMMARY
  };
  activeTab: string = step1;

  constructor(private sharedDataService: SharedDataService, private router: Router) {}

  ngOnInit() {
    this.sharedDataService.carModelStepCompService.pipe(takeUntil(this.unSubscribe$)).subscribe((val) => {
      const deleteIndex = this.disabledStepList.indexOf(step2);
      if (val && deleteIndex >= 0) {
        this.disabledStepList.splice(deleteIndex, 1);
      }
      if (!val && !this.disabledStepList.includes(step2)) {
        this.disabledStepList.push(step2);
      }
    });

    this.sharedDataService.carConfigStepCompService.pipe(takeUntil(this.unSubscribe$)).subscribe((val) => {
      const deleteIndex = this.disabledStepList.indexOf(step3);
      if (val && deleteIndex >= 0) {
        this.disabledStepList.splice(deleteIndex, 1);
      }
      if (!val && !this.disabledStepList.includes(step3)) {
        this.disabledStepList.push(step3);
      } 
    });

     setTimeout(() => {
      this.activeTab = this.getActiveStep(window.location.pathname.replace('/', ''));
    }, 10)
  }

  updateStep(tabName: typeof step1 | typeof step2 | typeof step3) {
    this.router.navigate([this.stepsRoute[tabName]]);
  }

  getActiveStep(path: string) {
    switch(path) {
      case AppRouteNames.CAR_MODEL: return step1;
      case AppRouteNames.CAR_CONFIG: return step2;
      case AppRouteNames.CAR_SUMMARY: return step3;
    }
    return step1;
  }

  ngOnDestroy() {
    this.unSubscribe$.next(true);
    this.unSubscribe$.unsubscribe();
  }

}
