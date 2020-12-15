const Keyboard = {
    elements: {
        main: null,
        keyContainer: null,
        keys: []
    },
    
    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: '',
        capslock: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement('div');
        this.elements.keyContainer = document.createElement('div');

        // Setup main elements
        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        this.elements.keyContainer.classList.add('keyboard__keys');
        this.elements.keyContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard__key');

        // Add to DOM
        this.elements.main.appendChild(this.elements.keyContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard on elements with use-keyboard-input class
        document.querySelectorAll('.use-keyboard-input').forEach(el => {
            el.addEventListener('focus', () => {
                this.open(el.value, currentValue => {
                    el.value = currentValue;
                })
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Create html for an icon
        const createIconHtml = (iconName) => {
            return `<i class="material-icons">${iconName}</i>`
        }


        keyLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');


            switch(key) {
                case 'backspace':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml('backspace');

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });
                    break;
                case 'caps':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                    keyElement.innerHTML = createIconHtml('keyboard_capslock');

                    keyElement.addEventListener('click', () => {
                        keyElement.classList.toggle('keyboard__key--active');
                        this._toggleCapslock();
                        this._triggerEvent('oninput');
                    });

                    break;
                case 'enter':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml('keyboard_return');

                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n';
                        this._triggerEvent('oninput');
                    });

                    break;
                case 'space':
                    keyElement.classList.add('keyboard__key--extra-wide');
                    keyElement.innerHTML = createIconHtml('space_bar');

                    keyElement.addEventListener('click', () => {
                        this.properties.value += ' ';
                        this._triggerEvent('oninput');
                    });

                    break;
                case 'done':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
                    keyElement.innerHTML = createIconHtml('check_circle');

                    keyElement.addEventListener('click', () => {
                        this._triggerEvent('onclose');
                        this.close();
                    });
                    break;
                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capslock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent('oninput');
                    })
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] === 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapslock() {
        this.properties.capslock = !this.properties.capslock;
        this.elements.keys.forEach(key => {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capslock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        })
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');
    }, 
    
    close() {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');
    }
}


window.addEventListener('DOMContentLoaded', () => {
    Keyboard.init();
})