import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsService } from '../../../services/news.service';

@Component({
  selector: 'app-news-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news-management.component.html',
  styleUrl: './news-management.component.css',
})
export class NewsManagementComponent implements OnInit {
  newsList: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  showModal: boolean = false;
  editingNews: any = null;
  formData: any = {
    title: '',
    content: '',
    imageUrl: '',
  };

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
        this.error = 'Error al cargar noticias';
        this.loading = false;
      },
    });
  }

  handleOpenModal(news: any = null): void {
    if (news) {
      this.editingNews = news;
      this.formData = {
        title: news.title,
        content: news.content,
        imageUrl: news.imageUrl || '',
      };
    } else {
      this.editingNews = null;
      this.formData = {
        title: '',
        content: '',
        imageUrl: '',
      };
    }
    this.showModal = true;
  }

  handleCloseModal(): void {
    this.showModal = false;
    this.editingNews = null;
    this.formData = {
      title: '',
      content: '',
      imageUrl: '',
    };
  }

  handleSubmit(): void {
    // Basic validation handled by HTML form validation
    const request = this.editingNews
      ? this.newsService.updateNews(this.editingNews.id, this.formData) // Assuming update method exists
      : this.newsService.createNews(this.formData);

    request.subscribe({
      next: () => {
        this.loadNews();
        this.handleCloseModal();
      },
      error: (err: any) => {
        console.error('Error saving news:', err);
        let errorMessage = 'Error al guardar la noticia';

        // Check for backend validation errors
        if (err.error && err.error.errors) {
          errorMessage +=
            ': ' +
            err.error.errors.map((e: any) => e.defaultMessage).join(', ');
        } else if (err.error && err.error.message) {
          errorMessage += ': ' + err.error.message;
        }

        alert(errorMessage);
      },
    });
  }

  handleDelete(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta noticia?')) {
      this.newsService.deleteNews(id).subscribe({
        next: () => {
          this.loadNews();
        },
        error: (err) => {
          console.error('Error deleting news:', err);
          alert('Error al eliminar');
        },
      });
    }
  }
}
