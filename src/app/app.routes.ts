import { Routes } from '@angular/router';
import { IngresoMascotaComponent } from './ingreso-mascota/ingreso-mascota.component';
import { IngresoPersonaComponent } from './ingreso-persona/ingreso-persona.component';
import { HomeComponent } from './home/home.component';
import { RegisterCardComponent } from './register-card/register-card.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ingreso_mascota', component: IngresoMascotaComponent },
  { path: 'ingreso_persona', component: IngresoPersonaComponent },
  { path: 'register-card', component: RegisterCardComponent },
];
