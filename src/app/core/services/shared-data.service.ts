import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Model, SelectedConfig } from '../interfaces/model.interface';
import { ConfigDetail, ModelConfig } from '../interfaces/modelConfigData.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private carModel = new Subject<SelectedConfig>();
  carModelService = this.carModel.asObservable();

  private isCarModelStepCompleted = new BehaviorSubject(false)
  carModelStepCompService = this.isCarModelStepCompleted.asObservable();

  private isCarConfigStepCompleted = new BehaviorSubject(false)
  carConfigStepCompService = this.isCarConfigStepCompleted.asObservable();

  saveCarModelInfo!: SelectedConfig;
  storeModelData!: Model[];
  storeUpdatedCarConfig!: ConfigDetail | undefined;
  saveSelectedModelConfig!: ModelConfig;
  isSelModelUpdated = false;

  constructor() { }

  updateCarModel(data: SelectedConfig) {
    this.carModel.next(data);
  }

  carModelStepCompleted(value: boolean) {
    this.isCarModelStepCompleted.next(value);
  }

  carConfigStepCompleted(value: boolean) {
    this.isCarConfigStepCompleted.next(value);
  }

}
