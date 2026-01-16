import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  companyName: string = 'Café Aroma';
  currentYear: number = new Date().getFullYear();

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.companyService.getCompanyConfig().subscribe((config) => {
      if (config && config.name) {
        this.companyName = config.name;
      }
    });
  }
}
