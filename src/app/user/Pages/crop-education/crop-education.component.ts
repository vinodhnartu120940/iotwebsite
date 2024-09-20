import { Component } from '@angular/core';
import { UserService } from '../../user.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-crop-education',
  standalone: true,
  imports: [NgClass, NgForOf, NgIf],
  templateUrl: './crop-education.component.html',
  styleUrl: './crop-education.component.scss'
})
export class CropEducationComponent {
  cropData: any;

  constructor(private userService: UserService) {
    this.userService.GetAgronomicPractices().subscribe((res) => {
      this.cropData = res;
    })
  }
}
