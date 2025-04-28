import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-icon-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.css'
})
export class IconPickerComponent implements OnInit {
  @Input() selectedIcon: string = '';
  @Output() iconSelected = new EventEmitter<string>();

  searchQuery: string = '';
  showIconPicker: boolean = false;

  // قائمة بأيقونات Bootstrap الشائعة
  iconCategories = [
    {
      name: 'عام',
      icons: [
        'bi bi-house', 'bi bi-house-fill', 'bi bi-house-heart', 'bi bi-house-heart-fill',
        'bi bi-shop', 'bi bi-shop-window', 'bi bi-basket', 'bi bi-basket-fill',
        'bi bi-bag', 'bi bi-bag-fill', 'bi bi-bag-check', 'bi bi-bag-check-fill',
        'bi bi-cart', 'bi bi-cart-fill', 'bi bi-cart-plus', 'bi bi-cart-plus-fill',
        'bi bi-cart-dash', 'bi bi-cart-dash-fill', 'bi bi-cart-x', 'bi bi-cart-x-fill'
      ]
    },
    {
      name: 'إلكترونيات',
      icons: [
        'bi bi-laptop', 'bi bi-laptop-fill', 'bi bi-pc', 'bi bi-pc-display',
        'bi bi-phone', 'bi bi-phone-fill', 'bi bi-tablet', 'bi bi-tablet-fill',
        'bi bi-tv', 'bi bi-tv-fill', 'bi bi-printer', 'bi bi-printer-fill',
        'bi bi-camera', 'bi bi-camera-fill', 'bi bi-headphones', 'bi bi-speaker',
        'bi bi-mouse', 'bi bi-mouse-fill', 'bi bi-keyboard', 'bi bi-usb-drive'
      ]
    },
    {
      name: 'ملابس وأزياء',
      icons: [
        'bi bi-person', 'bi bi-person-fill', 'bi bi-person-dress', 'bi bi-person-dress-fill',
        'bi bi-person-standing', 'bi bi-person-standing-dress', 'bi bi-handbag', 'bi bi-handbag-fill',
        'bi bi-sunglasses', 'bi bi-watch', 'bi bi-suit-heart', 'bi bi-suit-heart-fill',
        'bi bi-suit-diamond', 'bi bi-suit-diamond-fill', 'bi bi-suit-club', 'bi bi-suit-club-fill',
        'bi bi-suit-spade', 'bi bi-suit-spade-fill', 'bi bi-gift', 'bi bi-gift-fill'
      ]
    },
    {
      name: 'منزل ومطبخ',
      icons: [
        'bi bi-lamp', 'bi bi-lamp-fill', 'bi bi-lightbulb', 'bi bi-lightbulb-fill',
        'bi bi-cup', 'bi bi-cup-fill', 'bi bi-cup-hot', 'bi bi-cup-hot-fill',
        'bi bi-cup-straw', 'bi bi-egg', 'bi bi-egg-fill', 'bi bi-egg-fried',
        'bi bi-thermometer', 'bi bi-thermometer-half', 'bi bi-fan', 'bi bi-water',
        'bi bi-droplet', 'bi bi-droplet-fill', 'bi bi-door-closed', 'bi bi-door-open'
      ]
    },
    {
      name: 'كتب وتعليم',
      icons: [
        'bi bi-book', 'bi bi-book-fill', 'bi bi-book-half', 'bi bi-bookmark',
        'bi bi-bookmark-fill', 'bi bi-journal', 'bi bi-journal-bookmark', 'bi bi-journal-text',
        'bi bi-pencil', 'bi bi-pencil-fill', 'bi bi-pen', 'bi bi-pen-fill',
        'bi bi-highlighter', 'bi bi-eraser', 'bi bi-eraser-fill', 'bi bi-paperclip',
        'bi bi-file-earmark', 'bi bi-file-earmark-fill', 'bi bi-file-text', 'bi bi-file-text-fill'
      ]
    },
    {
      name: 'رياضة وترفيه',
      icons: [
        'bi bi-bicycle', 'bi bi-controller', 'bi bi-puzzle', 'bi bi-puzzle-fill',
        'bi bi-dice-1', 'bi bi-dice-2', 'bi bi-dice-3', 'bi bi-dice-4',
        'bi bi-dice-5', 'bi bi-dice-6', 'bi bi-trophy', 'bi bi-trophy-fill',
        'bi bi-music-note', 'bi bi-music-note-beamed', 'bi bi-film', 'bi bi-camera-reels',
        'bi bi-camera-reels-fill', 'bi bi-ticket', 'bi bi-ticket-fill', 'bi bi-ticket-perforated'
      ]
    }
  ];

  filteredIcons: string[] = [];
  allIcons: string[] = [];

  ngOnInit(): void {
    // تجميع كل الأيقونات في مصفوفة واحدة
    this.iconCategories.forEach(category => {
      this.allIcons = [...this.allIcons, ...category.icons];
    });
    this.filteredIcons = this.allIcons;
  }

  toggleIconPicker(): void {
    this.showIconPicker = !this.showIconPicker;
  }

  selectIcon(icon: string): void {
    this.selectedIcon = icon;
    this.iconSelected.emit(icon);
    this.showIconPicker = false;
  }

  searchIcons(): void {
    if (!this.searchQuery) {
      this.filteredIcons = this.allIcons;
      return;
    }

    this.filteredIcons = this.allIcons.filter(icon =>
      icon.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
