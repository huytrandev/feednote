import { TestBed } from '@angular/core/testing';

import { CowBreedService } from './cow-breed.service';

describe('CowBreedService', () => {
  let service: CowBreedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CowBreedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
