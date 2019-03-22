import { Component, OnInit } from '@angular/core';

import { InfoStatusCardConfig } from 'patternfly-ng/card';
import { CardAction, CardConfig, CardFilter, CardFilterPosition } from 'patternfly-ng/card';

const data = [
  {
    itemId : '329199',
    name : 'Forge Laptop Sticker',
    description : 'JBoss Community Forge Project Sticker',
    price : 8.5,
    availability : {
      quantity : 12
    }
  }
];

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  config: CardConfig;

  constructor() { }

  ngOnInit() {
    this.config = {
      noPadding: true,
      topBorder: true
    } as CardConfig;
  }

}
