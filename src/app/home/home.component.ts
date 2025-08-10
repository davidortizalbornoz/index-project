import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { HomeBottomSheetComponent } from './home-bottom-sheet.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatCardModule, MatIconModule, MatBottomSheetModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  protected title = 'Sistema de Gestión';

  constructor(
    private router: Router,
    private _bottomSheet: MatBottomSheet
  ) {
    console.log('HomeComponent cargado correctamente');
  }

  openBottomSheet(): void {
    console.log('Abriendo bottom-sheet...');
    this._bottomSheet.open(HomeBottomSheetComponent);
  }
}
