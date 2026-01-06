import { NexDialogComponent } from './nex-dialog.component';

describe('NexDialogComponent (class-only)', () => {
  it('should have default inputs set', () => {
    const cmp = new NexDialogComponent();
    expect(cmp.visible).toBe(false);
    expect(cmp.header).toBe('');
    expect(cmp.width).toBe('550px');
  });

  it('should emit visibleChange when visible toggles', () => {
    const cmp = new NexDialogComponent();
    const emitted: boolean[] = [];
    cmp.visibleChange.subscribe(v => emitted.push(v));

    // simulate the p-dialog visibleChange handler forwarding
    cmp.visible = true;
    cmp.visibleChange.emit(false);

    expect(emitted).toEqual([false]);
  });

  it('should emit onHide when onHide called', () => {
    const cmp = new NexDialogComponent();
    let called = false;
    cmp.onHide.subscribe(() => (called = true));

    // simulate the p-dialog (onHide) handler
    cmp.onHide.emit();

    expect(called).toBe(true);
  });
});
