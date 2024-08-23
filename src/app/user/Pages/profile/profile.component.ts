import { Component } from '@angular/core';
import { UserService } from '../../user.service';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(public userService: UserService,public auth:AuthService) {}
  handleDevice(device: any) {
    console.log(device.target.value);
    localStorage.setItem('DeviceId', device.target.value);
  }
}
