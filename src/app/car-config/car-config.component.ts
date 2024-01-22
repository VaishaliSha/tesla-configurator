import { AsyncPipe, CommonModule, CurrencyPipe, JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Config, ModelConfig } from '../core/interfaces/modelConfigData.interface';
import { CarDataService } from '../apis/car-data.service';
import { SharedDataService } from '../core/services/shared-data.service';
import { chooseDropdown, configText, cost, maxSpeed, miles, range, selectConfigText, step2, towHitch, yokeWheel } from '../core/constants/app-constants';

@Component({
  selector: 'app-car-config',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, JsonPipe, AsyncPipe, CurrencyPipe, CommonModule],
  templateUrl: './car-config.component.html',
  styleUrl: './car-config.component.scss'
})
export class CarConfigComponent {
  selectedModelConfig!: ModelConfig;
  isComponentedDetroyed: boolean = false;
  selectedDetails!: Config;
  initialValues: {} = {};
  chooseDropdown = chooseDropdown; range = range; miles = miles; maxSpeed = maxSpeed; selectConfigText = selectConfigText;
  cost = cost; towHitch = towHitch; yokeWheel = yokeWheel; configText = configText; step2 = step2;
  unSubscribe$: Subject<boolean> = new Subject<boolean>();

  configForm = new FormGroup({
    configSelected: new FormControl('', [Validators.required]),
    towHitch: new FormControl(false, []),
    steeringWheel: new FormControl(false, []),
  })

  constructor(private carDataService: CarDataService, private sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.initStepData();
    this.configForm.valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe((data) => {
      if (this.configForm.valid) {
        this.sharedDataService.carConfigStepCompleted(true);
      } else {
        this.sharedDataService.carConfigStepCompleted(false);
      }
      if (!this.isComponentedDetroyed && data?.configSelected) {
        this.selectedDetails = this.getConfigDetails(data?.configSelected);
        let selectedConfigDetails = {
          configDetails: this.getConfigDetails(data?.configSelected) ?? '',
          towHitch: data?.towHitch ?? false,
          steeringWheel: data?.steeringWheel ?? false
        }
        this.sharedDataService.storeUpdatedCarConfig = selectedConfigDetails;
      }
    })
  }

  initStepData() {
    this.initialValues = this.configForm.value;
    if (this.sharedDataService.storeUpdatedCarConfig && !this.sharedDataService.isSelModelUpdated) {
      if (this.sharedDataService?.storeUpdatedCarConfig?.configDetails?.id != 0) {
        this.selectedDetails = this.sharedDataService?.storeUpdatedCarConfig?.configDetails;
      }
      this.configForm.setValue({
        configSelected: this.sharedDataService?.storeUpdatedCarConfig?.configDetails?.id.toString() ?? '',
        towHitch: this.sharedDataService.storeUpdatedCarConfig.towHitch ?? false,
        steeringWheel: this.sharedDataService.storeUpdatedCarConfig.steeringWheel ?? false
      })
    }

    let saveCarModelInfo = this.sharedDataService.saveCarModelInfo;
    if (this.sharedDataService.isSelModelUpdated) {
      this.sharedDataService.isSelModelUpdated = false;
      this.configForm.reset(this.initialValues);
      this.getModelConfigDetails(saveCarModelInfo.model.code)
    } else {
      this.selectedModelConfig = this.sharedDataService.saveSelectedModelConfig;
    }
  }

  getConfigDetails(id: string) {
    let configDetailIndividual = this.selectedModelConfig.configs.filter((val) => {
      return val.id == +id
    })
    return configDetailIndividual[0]
  }

  trackByFn(index: number, item: Config) {
    return item.id;
  }

  getModelConfigDetails(selectedModelCode: string) {
    this.carDataService.getModelsConfigDetails(selectedModelCode).pipe(takeUntil(this.unSubscribe$)).subscribe((data: ModelConfig) => {
      this.selectedModelConfig = data;
      this.sharedDataService.saveSelectedModelConfig = data;
    })
  }

  ngOnDestroy() {
    this.isComponentedDetroyed = true;
    this.unSubscribe$.next(true);
    this.unSubscribe$.unsubscribe();
  }

}
