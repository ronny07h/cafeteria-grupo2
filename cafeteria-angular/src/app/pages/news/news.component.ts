import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit {
  newsList: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.error = null;
    this.newsService.getAllNews().subscribe({
      next: (data) => {
        this.newsList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading news:', err);
        this.error = 'No se pudieron cargar las noticias.';
        this.loading = false;
      },
    });
  }
}
