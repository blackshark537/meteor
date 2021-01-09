import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { LikedPageModule } from './liked.module';

import { LikedPage } from './liked.page';

describe('LikedPage', () => {
  let component: LikedPage;
  let fixture: ComponentFixture<LikedPage>;

  beforeEach(async () =>{
    await TestBed.configureTestingModule({
      declarations: [LikedPage],
      imports: [LikedPageModule]
    }).compileComponents();
  });

  it('should create', () => {
    const app = TestBed.createComponent(LikedPage).componentInstance
    expect(app).toBeTruthy();
  });
});
