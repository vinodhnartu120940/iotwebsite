import { Component } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(public userService: UserService) {}
  handleDevice(device: any) {
    console.log(device.target.value);
    localStorage.setItem('DeviceId', device.target.value);
  }
}
