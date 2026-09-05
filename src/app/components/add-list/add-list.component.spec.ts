import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddListComponent } from './add-list.component';

describe('AddListComponent', () => {
  let component: AddListComponent;
  let fixture: ComponentFixture<AddListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should reset form state when close() or cancel is clicked', () => {
    component.open();
    component.listTitle = 'Draft List';

    component.close();

    expect(component.listTitle).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should reset form state and emit title after a successful submit', () => {
    let emittedTitle: string | null = null;
    component.submitList.subscribe((title) => {
      emittedTitle = title;
    });

    component.open();
    component.listTitle = 'Testing List';

    component.submit();

    expect(emittedTitle).toBe('Testing List');
    expect(component.listTitle).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should validate non-empty trimmed title and not submit when invalid', () => {
    let submitted = false;
    component.submitList.subscribe(() => {
      submitted = true;
    });

    component.open();
    component.listTitle = '   ';
    component.submit();

    expect(submitted).toBe(false);
    expect(component.errorMessage).toBe('List title is required.');
  });
});
