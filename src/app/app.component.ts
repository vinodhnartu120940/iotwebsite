import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { GoogleTranslateService } from './Services/google-translate.service';
import { Store } from '@ngrx/store';
import { loadWeather } from './user/Store/actions/weather.action';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, HomepageComponent],
})
export class AppComponent {
  constructor(
    private googleTranslate: GoogleTranslateService,
    private store: Store
  ) {}
  title = 'Trees-RaysWeb';
  ngOnInit(): void {
    debugger;
    this.googleTranslate.loadGoogleTranslate();
    this.store.dispatch(loadWeather());
  }
}
