import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MediaPlayerPage } from './media-player.page';

describe('MediaPlayerPage', () => {
  let component: MediaPlayerPage;
  let fixture: ComponentFixture<MediaPlayerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaPlayerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MediaPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
