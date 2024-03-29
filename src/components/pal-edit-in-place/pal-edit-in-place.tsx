import { Component, Host, h, State, Event, EventEmitter, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'pal-edit-in-place',
  styleUrl: 'pal-edit-in-place.css',
  scoped: true,
})
export class PalEditInPlace {
  @Prop() textValue: string;
  @Prop() disableEdit: boolean = false;
  @State() titleEditable = false;
  @State() fieldVal: string;
  @State() fieldWidth: string;
  @Event() textChange: EventEmitter<string>;
  @Event() textSubmit: EventEmitter<string>;

  fieldElm: HTMLElement;

  @Watch('textValue')
  syncVals() {
    this.fieldVal = this.textValue;
  }

  @Watch('fieldVal')
  fieldValChangedHandler() {
    this.fieldWidth = `calc(${this.fieldVal.length * 0.5}em + 2px)`;
  }

  componentWillLoad() {
    this.syncVals();
    this.fieldValChangedHandler();
  }

  inputHandler = ({ target }) => {
    if (this.disableEdit) return;
    
    this.fieldVal = target.value;
    this.textChange.emit(target.value);
  };

  submitHandler = (ev: Event) => {
    if (this.disableEdit) return;

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
    if (this.disableEdit) return;

    this.titleEditable = true;
    setTimeout(() => {
      this.fieldElm.focus();
    }, 0);
  };

  blurHandler = () => {
    this.titleEditable = false;
  };

  render() {
    const inputStyle = { display: this.titleEditable ? 'inline-block' : 'none', width: this.fieldWidth, maxWidth: this.fieldWidth };


    return (
      <Host>
        <form onSubmit={this.submitHandler}>
          <input
            type="text"
            style={inputStyle}
            onInput={this.inputHandler}
            onBlur={this.blurHandler}
            onKeyDown={this.keyDownHandler}
            ref={elm => {
              this.fieldElm = elm;
            }}
            class={`title ${this.titleEditable ? '' : 'edit-disabled'}`}
            value={this.fieldVal}
          />
          {!this.titleEditable && (
            <span>
              {this.fieldVal}
              <div onDblClick={this.DClickHandler} class="click-blocker"></div>
            </span>
          )}
        </form>
      </Host>
    );
  }
}
