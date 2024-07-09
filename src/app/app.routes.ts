import { Routes } from '@angular/router';
import { SignupComponent } from './Pages/signup/signup.component';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { authGuard } from './Services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [authGuard]
  },

];
