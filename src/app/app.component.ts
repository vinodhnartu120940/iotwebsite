import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomepageComponent } from "./Components/homepage/homepage.component";
import { GoogleTranslateService } from './Services/google-translate.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, HomepageComponent]
})
export class AppComponent {
  constructor(private googleTranslate: GoogleTranslateService) { }
  title = 'Trees-RaysWeb';
  ngOnInit(): void {
    this.googleTranslate.loadGoogleTranslate();
  }
}
