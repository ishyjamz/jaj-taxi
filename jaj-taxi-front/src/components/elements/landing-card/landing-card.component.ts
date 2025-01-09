import { Component, Input } from '@angular/core';
import { LandingCard } from '../../../app/shared/models/landing-card';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-card',
  templateUrl: './landing-card.component.html',
  styleUrls: ['./landing-card.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule],
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

  ngOnInit() {
    console.log(this.landingCard);
  }
}
