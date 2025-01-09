import { Component } from '@angular/core';
import { ServiceCardComponent } from '../../elements/service-card/service-card.component';
import { ServiceCard } from '../../../app/shared/models/service-card';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-taxi-services',
  standalone: true,
  imports: [ServiceCardComponent, CommonModule, RouterLink],
  templateUrl: './taxi-services.component.html',
  styleUrl: './taxi-services.component.scss',
})
export class TaxiServicesComponent {
  serviceCards: ServiceCard[] = [
    {
      title: 'Airport Transfer',
      description:
        'Experience hassle-free airport transfers with our reliable and professional service. From the airport to your doorstep, we handle the details, ensuring a smooth and stress-free journey.',
      link: '/services/airport-transfer',
      imgUrl:
        'https://storage.googleapis.com/nub-news-files/nub-news-file-storage/592376/conversions/d7SeVRrz3bltL6jVDEQPDYdA2cXa2p-metaU3BrdXBZeW82eXJ0bnVWVXZHdTVtbFJ4RWtZbVlSLW1ldGFRbWx5YldsdVoyaGhiU0JCYVhKd2IzSjBJQ2hUVjA1VEtTNXFjR2M9LS1hcnRpY2xlLmpwZw%3D%3D--article.jpg',
    },
    {
      title: 'Long Distance',
      description:
        'Need to transport someone long distances? Our long distance trips service makes it easy to transport someone from one location to another.',
      link: '/services/long-distance',
      imgUrl:
        'https://www.startrescue.co.uk/media/d8df2064-bfb7-4c9c-91c2-62e349f143d2.jpg',
    },
    {
      title: 'Address Pickup',
      description:
        'Need to pick up someone from a specific address? Our address pickup service makes it easy to transport someone from a specific address to your doorstep.',
      link: '/services/address-pickup',
      imgUrl:
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmdj6eoaGke1uRpk7tjBZNBtgws5JbLNHCIY_rULBL6PTwiqeT3bEaM3MXrUl4c-aOg3DnTgW185CwnPd-FiNcNCSsFFjEHarl9PJ8z8mTa1ucZKHNXejR2Widb2hIw8uhi1In34AgSQHu/s728-rw-e365/gps-location-tracking-device.png',
    },
    {
      title: 'Station Pickup',
      description:
        'Need to pick up someone from a specific address? Our address pickup service makes it easy to transport someone from a specific address to your doorstep.',
      link: '/services/station-pickup',
      imgUrl:
        'https://rugbyobserver.co.uk/wp-content/uploads/2023/07/Rugby-Station-night-623x434.jpg',
    },
  ];
}
