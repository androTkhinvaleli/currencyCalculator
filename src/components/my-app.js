import {LitElement, html, css} from 'lit-element';
import './input-tab';

class MyApp extends LitElement {
    static get properties() {
        return {
            data: {
                type: Array
            },
            currenciesFrom: {
                type: Array
            },
            currenciesTo: {
                type: Array
            },
            allCurrencies: {
                type: Array
            }
        };
    }

    static get styles() {
        // language=CSS
        return [
            css`
                * {
                    padding: 0;
                    margin: 0;
                    box-sizing: border-box;
                }

                .body {
                    width: 500px;
                    margin: auto;
                }

                header {
                    width: 100%;
                    height: 80px;
                    background-color: rgb(245, 245, 245);
                    display: flex;
                    justify-content: center;
                }

                .header-wrapper {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .exit {
                    height: 55px;
                    width: 55px;
                    background-color: white;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .exit img {
                    height: 16px;
                    width: 16px;
                }

                .container {
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    width: 371px;
                }

                main {
                    display: flex;
                    justify-content: center;
                   
                }
                .hidden{
                    display: none;
                }

                .wrapper {
                    width: 370px;
                }

                .last-update {
                    font-size: 13.3333px;
                    margin: 45px 0 70px 0;
                }

                input {
                    height: 50px;
                    width: 150px;
                    margin: 0;
                }

                input::placeholder {
                    text-align: center;
                }

                select {
                    background-color: white;
                    height: 50px;
                    width: 250px;
                    margin: 0;

                }

                option {
                    text-align: center;
                    /*background-color: red;*/
                }

                #reverse {
                    height: 75px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                }

                #reverse img {
                    height: 30px;
                    width: 30px;
                    cursor: pointer;
                }


            `
        ];
    }

    constructor() {
        super();
        this.resultFrom = "";
        this.resultTo = "";
        this.shown = true;
        this.$ = new Proxy({}, {
                get: (obj, id) => this.shadowRoot.getElementById(id),
            }
        );
        this.currenciesFrom = [];
        this.currenciesTo = [];
        this.allCurrencies = [];
        this.data = [];
        fetch('data/currencyData.json').then(res => {
            return res.json();
        }).then(data => {
            this.data = data.result.list;

            this.day = new Date(data.result.currentDate).getDate();
            this.month = new Date(data.result.currentDate).getMonth();
            this.year = new Date(data.result.currentDate).getFullYear();
            this.hours = new Date(data.result.currentDate).getHours();
            this.minutes = new Date(data.result.currentDate).getMinutes();

            this.date = this.day + "." + this.month + "." + this.year + " / " + this.hours + ":" + this.minutes;

            for (let i = 0; i < this.data.length; i++) {
                console.log(this.data[i].ccy);
                this.currenciesFrom = [...this.currenciesFrom, this.data[i].ccy];
                this.currenciesTo = [...this.currenciesTo, this.data[i].ccy];
                this.allCurrencies = [...this.allCurrencies, this.data[i].ccy];

            }
            this.ccyFrom = '';
            this.ccyTo = '';
            this.amountFrom = '';
            this.amountTo = '';
        });


    }


    changedInput(event) {

        // console.log(this.ccyFrom, this.ccyTo, this.amountFrom, this.amountTo );
        console.log(event.detail);
        if (event.target.id === "inputTabFrom") {
            this.amountFrom = event.detail;
            this.currenciesTo = this.allCurrencies.filter(i => i !== this.ccyFrom);
            this.calculate('from');
        }
        if (event.target.id === "inputTabTo") {
            this.amountTo = event.detail;
            this.currenciesFrom=this.allCurrencies.filter(i => i !== this.ccyTo);
            this.calculate('to');
        }
    }

    changedSelect(event){
        console.log(event.detail);
        if (event.target.id === "inputTabFrom") {
            this.ccyFrom = event.detail;
            this.currenciesTo = this.allCurrencies.filter(i => i !== this.ccyFrom);
            if (this.amountFrom) {
                this.calculate('from');
            } else if (this.amountTo) this.calculate("to");
        }
        if (event.target.id === "inputTabTo") {
            this.ccyTo = event.detail;
            this.currenciesFrom = this.allCurrencies.filter(i => i !== this.ccyTo);
            if( this.amountTo ){
                this.calculate("to");
            }else if (this.amountFrom) this.calculate('from');
        }
    }

    cancel() {

        this.shadowRoot.querySelector("main").classList.toggle("hidden");

    }

    calculate(e) {
        console.log(this.ccyFrom, this.ccyTo, this.amountFrom, this.amountTo );
        if (this.ccyTo === "" || this.ccyFrom === "") return;

        let baseValue = this.amountFrom;
        let targetValue = this.amountTo;
        let selfRate = 1;
        let sellRate = 1;
        let baseCurrency = this.ccyFrom;
        let targetCurrency = this.ccyTo;

        this.data.forEach(object => {
            if (object.ccy === targetCurrency) {
                sellRate = object.sellRate / object.rateWeight;
                console.log(sellRate);
            }
        });
        this.data.forEach(object => {
            if (object.ccy === baseCurrency) {
                selfRate = object.buyRate / object.rateWeight;
                console.log(selfRate);
            }
        });

        if (e === "from") {
            let result = (baseValue * selfRate) / sellRate;
            if (!result) {
                this.resultTo = "";
                this.$.inputTabTo.shadowRoot.querySelector("input").value = "";
                return;
            }
            this.resultFrom = baseValue;
            this.resultTo = result;
            this.$.inputTabTo.shadowRoot.querySelector("input").value = result;
            console.log(this.resultTo);

        }else if (e === "to") {

            let result = (targetValue / selfRate) * sellRate;
            if (!result) {
                this.resultFrom = "";
                this.$.inputTabFrom.shadowRoot.querySelector("input").value="";
                return;
            }
            this.resultTo=targetValue;
            this.resultFrom = result;
            this.$.inputTabFrom.shadowRoot.querySelector("input").value = result;
            console.log(this.resultFrom);
        }

    }

    upToBottom() {
        let memFrom = this.ccyFrom;
        let memTo = this.ccyTo;


        this.currenciesFrom = this.allCurrencies.filter(cur => cur !== memFrom);
        this.currenciesTo = this.allCurrencies.filter(cur => cur !== memTo);
        setTimeout(() => {
            this.ccyFrom = memTo;
            this.ccyTo = memFrom;


            this.$.inputTabFrom.shadowRoot.querySelector("select").value = memTo;
            this.$.inputTabTo.shadowRoot.querySelector("select").value = memFrom;
            console.log(this.ccyFrom + ' ' + this.ccyTo);
            this.calculate("from");
        }, 10);
    }


    render() {
        // Anything that's related to rendering should be done in here.
        return html`
          <div class="body">
              <header>
                <div class="container">
                    <div class="header-wrapper">
                        <div  >კალკულატორი</div>  
                        <div class="exit" @click="${this.cancel}"><img src="../../images/cancel.png"></div>                 
                    </div>
                </div>
              </header>
              <main>
              <div class="container">
                  <div class="wrapper">
                      <div class="last-update">
                        ბოლო განახლების თარიღი    
                        <strong>${this.date}</strong>
                      </div>
                      <input-tab id="inputTabFrom" @changedSelect="${this.changedSelect}" @changedInput="${this.changedInput}" .value="${this.resultFrom}" .ccy="${this.ccyFrom}" .currencies = "${this.currenciesFrom}"></input-tab>
                      <div id="reverse" ">
                        <img src="../../images/recycle.png" @click="${this.upToBottom}">
                      </div>
                      <input-tab id="inputTabTo" @changedSelect="${this.changedSelect}" @changedInput="${this.changedInput}" .value="${this.resultTo}" .ccy="${this.ccyTo}" .currencies = "${this.currenciesTo}"></input-tab>
                  </div>
              </div>
              </main>
          </div>
          
        `;
    }

}

window.customElements.define('my-app', MyApp);
