import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-home-bottom-sheet',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <div class="bottom-sheet-container">
      <div class="bottom-sheet-header">
        <div class="header-content">
          <h2>¿Qué deseas registrar?</h2>
          <p class="header-subtitle">Selecciona una opción para continuar</p>
        </div>
        <button mat-icon-button (click)="close()" aria-label="Cerrar" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="options-container">
        <div class="option-card" (click)="navegarAPersona()">
          <div class="option-icon">
            <mat-icon>person_add</mat-icon>
          </div>
          <div class="option-content">
            <h3>Registrar Persona</h3>
            <p>Gestionar información personal</p>
          </div>
          <div class="option-arrow">
            <mat-icon>arrow_forward_ios</mat-icon>
          </div>
        </div>

        <div class="option-card" (click)="navegarAMascota()">
          <div class="option-icon">
            <mat-icon>pets</mat-icon>
          </div>
          <div class="option-content">
            <h3>Registrar Mascota</h3>
            <p>Gestionar información de mascotas</p>
          </div>
          <div class="option-arrow">
            <mat-icon>arrow_forward_ios</mat-icon>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bottom-sheet-container {
      padding: 20px 40px;
      min-height: 280px;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    }

    .bottom-sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }

    .header-content h2 {
      margin: 0 0 4px 0;
      color: var(--text-primary);
      font-size: var(--font-size-xl);
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .header-subtitle {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--font-size-md);
      font-weight: 400;
    }

    .close-btn {
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      color: var(--text-primary);
      transform: scale(1.1);
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .option-card {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      background: white;
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .option-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
    }

    .option-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
      border-color: rgba(0, 0, 0, 0.1);
    }

    .option-card:hover::before {
      opacity: 0.05;
    }

    .option-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      margin-right: 16px;
      position: relative;
      z-index: 1;
    }

    .option-icon mat-icon {
      color: white;
      font-size: var(--font-size-xl);
      width: 24px;
      height: 24px;
    }

    .option-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .option-content h3 {
      margin: 0 0 4px 0;
      color: var(--text-primary);
      font-size: var(--font-size-lg);
      font-weight: 600;
      letter-spacing: -0.3px;
    }

    .option-content p {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--font-size-md);
      font-weight: 400;
      line-height: 1.4;
    }

    .option-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.04);
      position: relative;
      z-index: 1;
      transition: all 0.2s ease;
      margin-left: 20px;
    }

    .option-arrow mat-icon {
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
      width: 16px;
      height: 16px;
    }

    .option-card:hover .option-arrow {
      background: rgba(0, 0, 0, 0.08);
      transform: translateX(2px);
    }

    .option-card:hover .option-arrow mat-icon {
      color: var(--primary-color);
    }

    /* Responsive */
    @media (max-width: 600px) {
      .bottom-sheet-container {
        padding: 16px 32px;
        min-height: 260px;
      }

      .header-content h2 {
        font-size: var(--font-size-lg);
      }

      .option-card {
        padding: 14px 16px;
      }

      .option-icon {
        width: 44px;
        height: 44px;
        margin-right: 14px;
      }

      .option-icon mat-icon {
        font-size: var(--font-size-lg);
        width: 22px;
        height: 22px;
      }

      .option-content h3 {
        font-size: var(--font-size-md);
      }

      .option-content p {
        font-size: var(--font-size-sm);
      }

      .option-arrow {
        margin-left: 16px;
      }
    }

    /* Animación de entrada */
    @keyframes slideInUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .bottom-sheet-container {
      animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `]
})
export class HomeBottomSheetComponent {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<HomeBottomSheetComponent>,
    private router: Router
  ) {}

  close(): void {
    this._bottomSheetRef.dismiss();
  }

  navegarAPersona(): void {
    console.log('Navegando a persona desde bottom-sheet...');
    this.router.navigate(['/ingreso_persona']);
    this.close();
  }

  navegarAMascota(): void {
    console.log('Navegando a mascota desde bottom-sheet...');
    this.router.navigate(['/ingreso_mascota']);
    this.close();
  }
}
