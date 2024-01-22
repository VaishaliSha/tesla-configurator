import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent implements OnInit {
  @Input() tabs: string[] = [];
  @Input() disabledTabs: string[] = [];
  @Input() active: string = '';
  @Output() tabChange = new EventEmitter();
  currentTab: string = '';

  ngOnInit(): void {
    this.currentTab = this.active;
  }

  tabChanged(tab: string) {
    this.tabChange.emit(tab);
    this.currentTab = tab;
  }

  isTabDisabled (tab: string) {
    return this.disabledTabs.includes(tab);
  }
}
