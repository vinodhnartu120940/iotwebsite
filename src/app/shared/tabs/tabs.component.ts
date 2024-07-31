import { NgComponentOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  @Input() tabs: { id: string, title: string, component: any }[] = [];
  activeTab:string | undefined;

  ngOnInit(){
    this.activeTab = this.tabs[0]?.id;
  }
 
  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  isActive(tabId: string): boolean {
    return this.activeTab === tabId;
  }
}
