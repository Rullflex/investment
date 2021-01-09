import 'lazysizes'
import { App } from '../../../local_modules/scripts/_core'


document.addEventListener(`DOMContentLoaded`, function () {
    const app = new App()
    
    app.matchMediaListener(app.lg, () => {
    }, () => {

    })

    
    app.tabSwitcher({
        parent: `.sec4`
    })

    // sec3 кнопка читать полностью
    document.querySelector(`.sec3 .readmore`).addEventListener(`click`, event => {
        event.preventDefault()
        const target = event.currentTarget
        if (target.classList.contains(`active`)) {
            document.querySelector(`.sec3 .text-block`).classList.remove(`expanded`)
            target.classList.remove(`active`)
            target.querySelector(`span`).innerText = `Читать полностью...`
        } else {
            document.querySelector(`.sec3 .text-block`).classList.add(`expanded`)
            target.classList.add(`active`)
            target.querySelector(`span`).innerText = `Скрыть`
        }
    })



    window.sendGA = function sendGA(category, action, label) {
        const data = category + ((label !== ``) ? (category ? `_` : ``) + label : ``) + `.${action}`
        // console.log(data, {category, action, label})

        console.log(data)
        if (`yaCounter49810573` in window && yaCounter49810573.reachGoal) {
            yaCounter49810573.reachGoal(data)
        }
        if (`ga` in window) {
            ga(`send`, `event`, category, action, label)
            // console.log(category, action, label)
        }
    }
})
