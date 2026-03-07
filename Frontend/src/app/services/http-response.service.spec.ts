import { TestBed } from '@angular/core/testing';

import { HttpResponseService } from './http-response.service';

describe('HttpResponseService', () => {
  let service: HttpResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
