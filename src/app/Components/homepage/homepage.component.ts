import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  ngOnInit(): void {
    setTimeout(() => {
      const images = document.querySelectorAll('.hero img');
      const heroContent = document.querySelector('.hero-content');
      const loadingOverlay = document.querySelector('.loading-overlay');
      let currentIndex = 0;

      const changeImage = () => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
      };

      // Apply the initial transition after a short delay
      setTimeout(() => {
        images[currentIndex].classList.add('active');
        heroContent?.classList.add('active'); // Add class to show hero content
        loadingOverlay?.classList.add('hidden'); // Hide the loading overlay
      }, 100); // 100ms delay for initial load

      // Change images every 10 seconds
      setInterval(changeImage, 5000); // Change image every 10 seconds
    }, 100);
  }
  

}
