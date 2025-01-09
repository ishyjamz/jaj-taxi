import { Component } from '@angular/core';
import { LandingCardComponent } from '../../elements/landing-card/landing-card.component';
import { LandingCard } from '../../../app/shared/models/landing-card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LandingCardComponent, CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  landingCards: LandingCard[] = [
    {
      title: 'Our Services',
      description:
        'For your convenience, we offer a wide range of services. We promise to offer you the best experience and prices',
      link: '/services',
    },
    {
      title: 'Contact Us',
      description:
        "For any further questions and enquiries, please don't hesitate to contact us.",
      link: '/contact',
    },
  ];

  constructor() {}
}
