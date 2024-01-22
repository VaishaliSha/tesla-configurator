import { CurrencyPipe, JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { chooseDropdown, maxSpeed, miles, range, summary, teslaModel, totalCost, towHitchPack, towHitchPackage, yokePackage, yokeWheelPack } from '../core/constants/app-constants';
import { ConfigDetail } from '../core/interfaces/modelConfigData.interface';
import { Color, ModelWithoutColors } from '../core/interfaces/model.interface';
import { SharedDataService } from '../core/services/shared-data.service';

@Component({
  selector: 'app-car-summary',
  standalone: true,
  imports: [JsonPipe, HttpClientModule, CurrencyPipe],
  templateUrl: './car-summary.component.html',
  styleUrl: './car-summary.component.scss'
})
export class CarSummaryComponent {
  currentConfigDetail!: ConfigDetail;
  towHitchPackage = towHitchPackage;
  yokeSteeringWheelPackage = yokePackage;
  carModelPrice: number = 0;
  carConfigPrice: number = 0;
  carConfig = [];
  modelDetail!: ModelWithoutColors;
  carModelDetail!: Color;
  chooseDropdown = chooseDropdown; range = range; miles = miles; maxSpeed = maxSpeed;
  totalCost = totalCost; summary = summary; teslaModel = teslaModel; towHitchPack = towHitchPack; yokeWheelPack = yokeWheelPack;

  constructor(private sharedDataService: SharedDataService) { }

  ngOnInit() {
    if (this.sharedDataService.saveCarModelInfo) {
      this.modelDetail = this.sharedDataService.saveCarModelInfo.model;
      this.carModelDetail = this.sharedDataService.saveCarModelInfo.color;
      this.carModelPrice = this.carModelDetail?.price;
    }
    if (this.sharedDataService.storeUpdatedCarConfig) {
      this.currentConfigDetail = this.sharedDataService.storeUpdatedCarConfig;
      this.carConfigPrice = this.currentConfigDetail?.configDetails?.price;
    }
  }
}
