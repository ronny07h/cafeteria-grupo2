import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-accessibility-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessibility-panel.component.html',
  styleUrl: './accessibility-panel.component.css',
  encapsulation: ViewEncapsulation.None, // This allows styles to affect the whole app
})
export class AccessibilityPanelComponent implements OnInit {
  isOpen: boolean = false;
  settings: any = {
    fontSize: 100,
    contrast: false,
    highlightLinks: false,
    grayscale: false,
    invertColors: false,
    noAnimations: false,
    removeStyles: false,
    largeCursor: false,
    monochrome: false,
    sepia: false,
  };

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
        this.applySettings();
      }
    }
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
  }

  applySettings(): void {
    if (!this.isBrowser) return;

    const root = document.documentElement;
    root.style.fontSize = `${this.settings.fontSize}%`;

    const content = document.body; // Applying to body since we don't have #accessible-content equivalent yet

    const toggleClass = (className: string, enabled: boolean) => {
      if (enabled) {
        content.classList.add(className);
      } else {
        content.classList.remove(className);
      }
    };

    toggleClass('high-contrast', this.settings.contrast);
    toggleClass('highlight-links', this.settings.highlightLinks);
    toggleClass('grayscale', this.settings.grayscale);
    toggleClass('invert-colors', this.settings.invertColors);
    toggleClass('no-animations', this.settings.noAnimations);
    toggleClass('remove-styles', this.settings.removeStyles);
    toggleClass('large-cursor', this.settings.largeCursor);
    toggleClass('monochrome', this.settings.monochrome);
    toggleClass('sepia', this.settings.sepia);
  }

  saveSettings(): void {
    if (this.isBrowser) {
      localStorage.setItem(
        'accessibilitySettings',
        JSON.stringify(this.settings)
      );
    }
  }

  increaseFontSize(): void {
    this.settings.fontSize = Math.min(this.settings.fontSize + 10, 150);
    this.applySettings();
    this.saveSettings();
  }

  decreaseFontSize(): void {
    this.settings.fontSize = Math.max(this.settings.fontSize - 10, 80);
    this.applySettings();
    this.saveSettings();
  }

  toggleSetting(setting: string): void {
    this.settings[setting] = !this.settings[setting];
    this.applySettings();
    this.saveSettings();
  }

  resetSettings(): void {
    this.settings = {
      fontSize: 100,
      contrast: false,
      highlightLinks: false,
      grayscale: false,
      invertColors: false,
      noAnimations: false,
      removeStyles: false,
      largeCursor: false,
      monochrome: false,
      sepia: false,
    };
    this.applySettings();
    this.saveSettings();
  }
}
