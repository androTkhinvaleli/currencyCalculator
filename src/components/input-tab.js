import {LitElement, html, css} from 'lit-element';


class InputTab extends LitElement{

    static get properties() {
        return {
            currencies: {
                type: Array
            },
            value: {
                type:String,
                // observer: "_propertiesChanged"


            },
            ccy:{
                type:String,
                // observer: "_propertiesChanged"
            }

        }
    }
    static get styles() {
        // language=CSS
        return [
            css`
                div{
                    
                    display: flex;
                    width: 370px;

                    
                }
                *{
                    padding: 0;
                    margin: 0;
                    box-sizing: border-box;
                }
                *:focus {
                    outline: none; 
                }
                input {
                    height: 50px;
                    width: 30%;
                    margin: 0;
                    
                    
                    padding: 10px 20px;
                }

                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    /* display: none; <- Crashes Chrome on hover */
                    -webkit-appearance: none;
                    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
                }

                input[type=number] {
                    -moz-appearance:textfield; /* Firefox */
                }
                select {
                    background-color: white;
                    height: 50px;
                    width: 70%;
                    margin: 0;
                    border-left: 0;

                    padding: 10px 20px;
                }
                
                
            `
        ];
    }

    // update(props) { // handle property change
    //     const properties = this.constructor.properties;
    //     props.forEach((oldValue, name) => {
    //         if (this[properties[name].observer]) {
    //             this[properties[name].observer].apply(this, [this[name], oldValue]);
    //         }
    //     });
    //     super.update(props);
    // }


    constructor(){
        super();
        this.$ = new Proxy({}, {
                get: (obj, id) => this.shadowRoot.querySelector(id),
            }
        );

    }

    changingInput(){
        this.dispatchEvent(new CustomEvent("changedInput", {
            composed:true, bubbles:true, detail:this.$.input.value
        }));
    }

    changingSelect(){
        this.dispatchEvent(new CustomEvent("changedSelect", {
            composed:true, bubbles:true, detail:this.$.select.value
        }));
    }

    // _propertiesChanged(props, changed, oldProps) {
    //     console.log("_propertiesChanged(props, changed, oldProps):");
    //     console.log(props);
    //     console.log(changed);
    //     console.log(oldProps);
    //     if (changed && 'temp1' in changed) {
    //         console.log("if temp1:"+changed.temp1);
    //     }
    //     super._propertiesChanged(props, changed, oldProps); //This is needed here
    // }

    render() {
        return html`
        <div>
            <input placeholder="თანხა" @input="${this.changingInput}" value="${this.value}" min="0" type="number">
            <select @change = "${this.changingSelect}" value="${this.ccy}">
                 <option  value="" >ვალუტა</option>
                ${this.currencies.map(cur => html`<option value="${cur}">${cur}</option>`)}
            </select>
        </div>
        `;
    }


}

window.customElements.define('input-tab', InputTab);