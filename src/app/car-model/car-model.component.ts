import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { chooseDropdown, chooseModel, colorDropdownLabel, modelDropdownLabel, step1 } from '../core/constants/app-constants';
import { Color, Model, ModelWithoutColors } from '../core/interfaces/model.interface';
import { CarDataService } from '../apis/car-data.service';
import { SharedDataService } from '../core/services/shared-data.service';

@Component({
  selector: 'app-car-model',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './car-model.component.html',
  styleUrl: './car-model.component.scss'
})
export class CarModelComponent {
  modelList: Model[] = [];
  colorList: Color[] = [];
  selectedModel!: ModelWithoutColors;
  modelDropdownLabel = modelDropdownLabel; colorDropdownLabel = colorDropdownLabel; chooseDropdown = chooseDropdown;
  chooseModel = chooseModel; step1 = step1;
  unSubscribe$: Subject<boolean> = new Subject<boolean>();

  carModelForm = new FormGroup({
    selectedCarModel: new FormControl('', [Validators.required]),
    modelColor: new FormControl('', [Validators.required]),
  })

  constructor(private carDataService: CarDataService, private sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.initStepData();
    this.carModelForm.controls['selectedCarModel'].valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe((data) => {
      this.modelList.forEach((model) => {
        if (model.code === data) {
          this.selectedModel = {
            code: model.code,
            description: model.description
          };
          this.colorList = model.colors;
          this.carModelForm.controls['modelColor'].setValue(this.colorList[0].code)
        }
      })
    })

    this.carModelForm.controls['modelColor'].valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe((code) => {
      const color = this.modelList.find((model) => model.code === this.selectedModel.code)?.colors
        .find((color) =>
          color.code === code
        );
      this.updateCarModel(this.selectedModel, color);
    })

    this.carModelForm.valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe((data) => {
      if (this.carModelForm?.valid) {
        this.sharedDataService.carModelStepCompleted(true);
      } else {
        this.sharedDataService.carModelStepCompleted(false);
      }
    })
  }

  initStepData() {
    if (!this.sharedDataService.storeModelData) {
      this.carDataService.getModelDataList().pipe(takeUntil(this.unSubscribe$)).subscribe((data) => {
        this.modelList = data;
        this.sharedDataService.storeModelData = data;
      });
    } else {
      this.modelList = this.sharedDataService.storeModelData;
      this.colorList = this.sharedDataService.storeModelData.find((model) => model.code === this.sharedDataService.saveCarModelInfo.model?.code)?.colors ?? [];
      this.carModelForm.setValue({
        selectedCarModel: this.sharedDataService.saveCarModelInfo.model?.code,
        modelColor: this.sharedDataService.saveCarModelInfo.color?.code,
      })
    }
  }

  updateCarModel(model: ModelWithoutColors, color: Color | undefined) {
    if (color) {
      this.sharedDataService.updateCarModel({ model, color })
      this.sharedDataService.saveCarModelInfo = { model, color };
    }
  }

  trackByFn(index: number, item: Model | Color) {
    return item.code;
  }

  modelChange() {
    this.sharedDataService.isSelModelUpdated = true;
    this.sharedDataService.storeUpdatedCarConfig = undefined;
    this.sharedDataService.carConfigStepCompleted(false);
  }

  ngOnDestroy() {
    this.unSubscribe$.next(true);
    this.unSubscribe$.unsubscribe();
  }

}
