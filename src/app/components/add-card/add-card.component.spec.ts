import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddCardComponent } from './add-card.component';

describe('AddCardComponent', () => {
  let component: AddCardComponent;
  let fixture: ComponentFixture<AddCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should reset form state when close() or cancel is clicked', () => {
    component.open('list-1');
    component.cardTitle = 'Draft Card';
    component.cardDesc = 'Draft Description';

    component.close();

    component.open('list-2');

    expect(component.cardTitle).toBe('');
    expect(component.cardDesc).toBe('');
    expect(component.errorMessage).toBe('');
    expect(component.targetListId).toBe('list-2');
  });

  it('should reset form state and emit payload after a successful submit', () => {
    let emittedPayload: { listId: string; title: string; desc: string } | null = null;
    component.submitCard.subscribe((payload) => {
      emittedPayload = payload;
    });

    component.open('list-abc');
    component.cardTitle = 'New Feature';
    component.cardDesc = 'Some details';

    component.submit();

    expect(emittedPayload).toEqual({
      listId: 'list-abc',
      title: 'New Feature',
      desc: 'Some details'
    });

    component.open('list-xyz');
    expect(component.cardTitle).toBe('');
    expect(component.cardDesc).toBe('');
    expect(component.targetListId).toBe('list-xyz');
  });

  it('should validate non-empty trimmed title and not submit when invalid', () => {
    let submitted = false;
    component.submitCard.subscribe(() => {
      submitted = true;
    });

    component.open('list-1');
    component.cardTitle = '   ';
    component.submit();

    expect(submitted).toBe(false);
    expect(component.errorMessage).toBe('Card title is required.');
  });
});
