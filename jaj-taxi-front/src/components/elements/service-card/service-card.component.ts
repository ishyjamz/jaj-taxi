import { Component, Input, OnInit } from '@angular/core';
import { ServiceCard } from '../../../app/shared/models/service-card';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule],
})
export class ServiceCardComponent implements OnInit {
  cardTitle!: string;
  cardDescription!: string;
  cardLink!: string;
  imgUrl!: string;

  @Input() serviceCard: ServiceCard = {
    title: this.cardTitle,
    description: this.cardDescription,
    link: this.cardLink,
    imgUrl: this.imgUrl,
  };

  constructor() {}

  ngOnInit() {
  }
}
