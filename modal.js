class Modal extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        this.isOpen = false;
        this.shadowRoot.innerHTML = `
            <style>
                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.75);
                    z-index: 10;
                    opacity: 0;
                    pointer-events: none;
                }

                :host([opened]) #backdrop,
                :host([opened]) #modal {
                    opacity: 1;
                    pointer-events: all;
                }

                :host([opened]) #modal {
                    transform: translate(-50%, -50%);
                }
                
                #modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -70%);
                    width: 50%;
                    z-index: 100;
                    background: white;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-sizing: border-box;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s ease-out;
                }

                header{
                    padding: 1rem;
                    border-bottom: 1px solid #ccc;
                }

               ::slotted(h1) {
                    font-size: 1.25rem;
                    margin: 0;
                }

                #main{
                    padding: 0 1rem;
                }

                #actions{
                    border-top: 1px solid #ccc;
                    padding: 1rem;
                    display: flex;
                    justify-content: flex-end;
                }

                #actions button{
                    margin: 0 0.25rem;
                }

            </style>

            <div id="backdrop"></div>
            <div id="modal">
                <header>
                    <slot name="title"> Please Confirm Payment </slot>
                </header>
                <section id="main">
                    <slot name="main"></slot>
                </section>
                <section id="actions">
                    <button id="cancel-btn">Cancel</button>
                    <button id="confirm-btn">Confirm</button>
                </section>
            </div>
        `;
        // ouve as alterações dos slots
         const slots = this.shadowRoot.querySelectorAll('slot');
         slots[1].addEventListener('slotchange', event => {
            console.dir(slots[1].assignedNodes());
         });

         const closeModalBackdrop = this.shadowRoot.querySelector('#backdrop');
         closeModalBackdrop.addEventListener('click', this._cancel.bind(this));

         const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
         cancelButton.addEventListener('click', this._cancel.bind(this));
         
         const confirmButton = this.shadowRoot.querySelector('#confirm-btn');
         confirmButton.addEventListener('click', this._confirm.bind(this));

        //  cancelButton.addEventListener('cancel', () => {
        //     console.log('Cancel inside the component')
        //  });

    }

    // uma maneira de mostrar a modal
    // attributeChangedCallback(name, oldValue, newValue){
    //     if(name === 'opened'){
    //         if(this.hasAttribute('opened')){
    //             this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
    //             this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
    //             this.shadowRoot.querySelector('#modal').style.opacity = 1;
    //             this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
    //         }
    //     }
    // }

    // static get observedAttributes(){
    //     return ['opened']
    // }

    attributeChangedCallback(name, oldValue, newValue){
        if(name === 'opened'){
            if(this.hasAttribute('opened')){
                this.isOpen = true;
            }
        }
    }


    open(){
        this.setAttribute('opened', '');
        this.isOpen = true;
    }

    hide(){
        if(this.hasAttribute('opened')){
            this.removeAttribute('opened');
        }
        this.isOpen = false;
    }

    _cancel(event){
        this.hide();
        const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
        event.target.dispatchEvent(cancelEvent);
    }

    _confirm(){
        this.hide();
        const confirmEvent = new Event('confirm');
        this.dispatchEvent(confirmEvent);
    }

}

customElements.define('md-modal', Modal);