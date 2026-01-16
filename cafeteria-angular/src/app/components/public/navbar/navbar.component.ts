import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  companyName: string = 'Café Aroma';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.companyService.getCompanyConfig().subscribe((config) => {
      if (config && config.name) {
        this.companyName = config.name;
      }
    });
  }
}
