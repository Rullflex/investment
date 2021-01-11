import 'lazysizes'
import {App} from '../../local_modules/scripts/_core'

document.addEventListener(`DOMContentLoaded`, function () {
    const app = new App()
    app.init()
    
    app.matchMediaListener(app.lg, () => {
        
    }, () => {

    })


    app.accordionSlider({
        // onSlide: () => {
        //     if (window.matchMedia(`(max-width: ${app.lg}px)`).matches) {
        //         app.matchMediaListener(app.lg, () => {})
        //         const values = document.querySelectorAll(`.sec2__slider .uk-slider-items .active .value`)
        //         document.querySelectorAll(`.sec2__slider .phantom .value`).forEach((el, i) => {
        //             el.innerText = values[i].innerHTML
        //         })
        //     }
        // }
    })

    app.tabSwitcher({
        parent: `.sec3`
    })
    app.tabSlider({
        parent: `.sec12`
    })
    app.accordion()



    // sec5 кнопка смотреть все параметры
    document.querySelector(`.sec5 .btn-outline`).addEventListener(`click`, event => {
        event.preventDefault()
        const target = event.currentTarget
        if (target.classList.contains(`active`)) {
            document.querySelectorAll(`.sec5 .uk-slider-item`).forEach(el => el.classList.remove(`expanded`))
            target.classList.remove(`active`)
            target.querySelector(`span`).innerText = `Смотреть все параметры`
        } else {
            document.querySelectorAll(`.sec5 .uk-slider-item`).forEach(el => el.classList.add(`expanded`))
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
