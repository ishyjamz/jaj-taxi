import { Component, Input } from '@angular/core';
import { LandingCard } from '../../../app/shared/models/landing-card';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-card',
  templateUrl: './landing-card.component.html',
  styleUrls: ['./landing-card.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class LandingCardComponent {
  cardTitle!: string;
  cardDescription!: string;
  cardLink!: string;

  @Input() landingCard: LandingCard = {
    title: this.cardTitle,
    description: this.cardDescription,
    link: this.cardLink,
  };
}
