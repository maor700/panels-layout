import { Component, Host, h, State, Event, EventEmitter, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'pal-edit-in-place',
  styleUrl: 'pal-edit-in-place.css',
  scoped: true,
})
export class PalEditInPlace {
  @Prop() textValue: string;
  @State() titleEditable = false;
  @State() fieldVal: string;
  @State() fieldSize: number;
  @Event() textChange: EventEmitter<string>;
  @Event() textSubmit: EventEmitter<string>;

  fieldElm: HTMLElement;

  @Watch('textValue')
  syncVals() {
    this.fieldVal = this.textValue;
  }

  @Watch('fieldVal')
  fieldValChangedHandler() {
    this.fieldSize = this.fieldVal.length;
    this.textChange.emit(this.fieldVal);
  }

  inputHandler = ({ target }) => {
    this.fieldVal = target.value;
  };

  submitHandler = (ev: Event) => {
    ev.preventDefault();
    this.fieldElm.blur();
    this.textSubmit.emit(this.fieldVal);
  };

  keyDownHandler = (evt: KeyboardEvent) => {
    var isEscape = false;
    isEscape = evt.key === 'Escape' || evt.key === 'Esc';
    if (isEscape) {
      this.fieldElm.blur();
    }
  };

  DClickHandler = () => {
    this.titleEditable = true;
    setTimeout(() => {
      this.fieldElm.focus();
    }, 0);
  };

  blurHandler = () => {
    this.titleEditable = false;
  };

  componentWillLoad() {
    this.syncVals();
  }

  render() {
    return (
      <Host>
        <form onSubmit={this.submitHandler}>
          {this.titleEditable ? (
            <input
              type="text"
              style={{ width: this.fieldSize + 'em', maxWidth: this.fieldSize + 'em' }}
              onInput={this.inputHandler}
              onBlur={this.blurHandler}
              onKeyDown={this.keyDownHandler}
              ref={elm => {
                this.fieldElm = elm;
              }}
              class={`title ${this.titleEditable ? '' : 'edit-disabled'}`}
              value={this.fieldVal}
            />
          ) : (
            <span>
              <span>{this.fieldVal}</span>
              <div onDblClick={this.DClickHandler} class="click-blocker"></div>
            </span>
          )}
        </form>
      </Host>
    );
  }
}
