import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactUs } from '../../../app/shared/models/contact-us.model';
import { ContactUsService } from '../../../app/shared/services/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  providers: [ContactUsService],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FormsModule],
})
export class ContactUsComponent implements OnInit {
  contactUsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService,
  ) {}

  ngOnInit() {
    this.contactUsForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.contactUsForm.valid) {
      const formData = this.contactUsForm.value;

      // Prepare the payload to match the backend DTO
      const payload: ContactUs = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      console.log('Payload being sent to API:', payload);

      // Submit the booking
      this.contactUsService.createContactMessage(payload).subscribe({
        next: (response) => {
          console.log('Booking submitted successfully:', response);
          alert('Booking submitted successfully!');
          this.contactUsForm.reset();
        },
        error: (error) => {
          console.error('Error submitting booking:', error);
          alert(
            `An error occurred: ${error.error?.message || 'Unable to process the request.'}`,
          );
        },
      });
    } else {
      console.log('Form is invalid:', this.contactUsForm);
      alert('Please fill out the form correctly.');
    }
  }
}
