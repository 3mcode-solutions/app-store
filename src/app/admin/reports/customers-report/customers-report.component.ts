import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customers-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customers-report.component.html',
  styleUrls: ['./customers-report.component.css']
})
export class CustomersReportComponent implements OnInit {
  // سيتم تنفيذ هذا المكون لاحقاً
  isLoading = false;

  constructor() { }

  ngOnInit(): void {
  }
}
