import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  pageTitle = {
    title: 'Contact Us',
    description: 'Get in touch with us for any inquiries or support needs.'
  };

  contactInfo = {
    address: '123 Business Street, New York, NY 12345',
    email: 'info@example.com',
    phone: '+1 (555) 123-4567',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970971!3d40.69714941680757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1682237287261!5m2!1sen!2s'
  };

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isLoading = false;
  isError = false;
  isSuccess = false;
  errorMessage = '';

  async onSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.subject || !this.formData.message) {
      this.isError = true;
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.isError = false;
    this.isSuccess = false;
    this.errorMessage = '';

    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Form submitted:', this.formData);
      this.isSuccess = true;

      // Reset form after successful submission
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    } catch (error) {
      this.isError = true;
      this.errorMessage = 'An error occurred while sending your message. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
