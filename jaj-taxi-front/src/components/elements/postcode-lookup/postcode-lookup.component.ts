import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-postcode-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './postcode-lookup.component.html',
  styleUrls: ['./postcode-lookup.component.scss'],
})
export class PostcodeLookupComponent {
  searchText: string = ''; // User input
  addressOptions: any[] = []; // Filtered address options
  postcodeDetails: any = null; // Selected postcode details
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient) {
    // Debounce user input to reduce API calls
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchText) => {
        this.fetchAddressOptions(searchText);
      });
  }

  onSearch() {
    const formattedSearchText = this.searchText.trim();
    if (formattedSearchText.length >= 3) {
      this.searchSubject.next(formattedSearchText);
    } else {
      this.addressOptions = [];
    }
  }

  onSelectAddress(address: any) {
    this.searchText = address.formatted; // Set input box to the formatted address
    this.addressOptions = []; // Hide dropdown
    this.fetchPostcodeDetails(address.postcode); // Fetch details for the selected postcode
  }

  private fetchAddressOptions(query: string) {
    const url = `https://api.os.uk/search/places/v1/postcode?q=${query}`;
    this.http.get(url).subscribe(
      (response: any) => {
        if (response && response.result) {
          this.addressOptions = response.result.map((item: any) => ({
            formatted: `${item.building_number || 'N/A'} ${item.thoroughfare || 'N/A'}, ${item.admin_district}, ${item.postcode}`,
            postcode: item.postcode,
          }));
        } else {
          this.addressOptions = [];
        }
      },
      (error) => {
        console.error('Error fetching address options:', error);
        this.addressOptions = [];
      },
    );
  }

  private fetchPostcodeDetails(postcode: string) {
    const url = `https://api.postcodes.io/postcodes/${postcode}`;
    this.http.get(url).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.postcodeDetails = response.result;
        }
      },
      (error) => {
        console.error('Error fetching postcode details:', error);
        this.postcodeDetails = null;
      },
    );
  }
}
