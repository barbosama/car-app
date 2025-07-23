import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  items: MenuItem[] | undefined;

  protected readonly title = signal('car-auction');
  constructor(private router: Router) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        command: () => {
          this.router.navigate(['/']);
        },
      },
      {
        label: 'List of Cars',
        command: () => {
          this.router.navigate(['/car-list']);
        },
      },
    ];
  }
}
