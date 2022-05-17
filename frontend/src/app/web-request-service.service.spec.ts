import { TestBed } from '@angular/core/testing';

import { WebRequestServiceService } from './web-request-service.service';

describe('WebRequestServiceService', () => {
  let service: WebRequestServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRequestServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
