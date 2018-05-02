import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/from'
import { Observable } from 'rxjs/Observable'

import { Restaurant } from './restaurant/restaurant.model';
import { RestaurantsService } from './restaurants.service';

@Component({
  selector: 'mt-restaurants',
  templateUrl: './restaurants.component.html',
  animations: [
    trigger('toogleSearch', [
      state('hidden', style({
        opacity: 0,
        "max-height": "0px"
      })),
      state('visible', style({
        opacity: 1,
        "max-height": "70px",
        "margin-top": "20px"
      })),
      transition('* => *', animate('250ms 0s ease-in-out'))
    ])
  ]
})
export class RestaurantsComponent implements OnInit {

  searchBarState = 'toogleSearch'
  restaurants: Restaurant[]
  searchForm: FormGroup
  searchControl: FormControl

  constructor(
    private restaurantsService: RestaurantsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.searchControl = this.fb.control('')
    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    })

    this.searchControl.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(searchTerm => this.restaurantsService.restaurants(searchTerm)
        .catch(error => Observable.from([])))
      .subscribe(restaurants => this.restaurants = restaurants)

    this.restaurantsService.restaurants()
      .subscribe(restaurants => this.restaurants = restaurants)
  }

  toogleSearch(inputSearch: HTMLInputElement) {
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden'
    if (this.searchBarState === 'visible') {
      inputSearch.focus()
    }
  }

}
