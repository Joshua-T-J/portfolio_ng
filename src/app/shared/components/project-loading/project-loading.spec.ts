import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLoading } from './project-loading';

describe('ProjectLoading', () => {
  let component: ProjectLoading;
  let fixture: ComponentFixture<ProjectLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectLoading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
